/**
 * The handwriting canvas engine: input, rendering and pan/zoom for one page.
 * Imperative on purpose — pointer moves never go through React, so ink keeps
 * up with an Apple Pencil (240 Hz coalesced events, predicted points on the
 * live layer, cached Path2D per stroke, culling to the visible area).
 *
 * Layers: the stage element's CSS background is the paper (grid/lines move
 * with the view); `base` holds committed strokes; `live` (multiply-blended)
 * holds the stroke being drawn, the lasso, the selection box and the eraser
 * ring. Strokes are always stored in logical coordinates; only the view
 * transform changes on pan/zoom, and the canvases are sized to the device
 * pixel ratio so ink stays sharp on high-DPI screens.
 *
 * Input rules (drawing and navigating never conflict):
 *  - pen: always uses the current tool; while a pen is down, touches are ignored (palm);
 *  - touch: two fingers pan + pinch-zoom; one finger pans in pencil-only mode
 *    (or with the hand tool), otherwise draws. A second finger landing on a
 *    young one-finger stroke cancels it and turns into navigation;
 *  - mouse: left button uses the tool; middle button, Space + drag or the hand tool pans;
 *    wheel pans, Ctrl/Cmd + wheel (and trackpad pinch) zooms at the cursor.
 */

import {
  eraseFromStroke,
  freehandOutline,
  isFreehand,
  outlineToPathData,
  round1,
  round2,
  shapePathData,
  snapAngle,
  squareBox,
  strokeBounds,
  strokeHitBySegment,
  strokeInLasso,
  strokesBounds,
  translateStroke,
  boundsIntersect,
} from '@/lib/handwriting/geometry';
import { GRID_COLOR, GRID_SIZE, LINE_COLOR, LINE_SPACING, PAPER } from '@/lib/handwriting/svg';
import { newId, type Bounds, type HwBackground, type HwPage, type HwPoint, type HwShape, type HwStroke } from '@/lib/handwriting/types';
import { fitBounds, pinchView, toScreen, toWorld, visibleWorld, wheelZoomFactor, zoomAt, zoomTo, type View } from '@/lib/handwriting/view';

export type ToolId = 'pen' | 'highlighter' | 'eraser' | 'lasso' | 'shape' | 'hand';
export type EraserMode = 'stroke' | 'pixel';

export interface ToolSettings {
  tool: ToolId;
  /** Style of the active inking tool (pen, highlighter or shape). */
  color: string;
  width: number;
  opacity: number;
  shape: Exclude<HwShape, 'polyline'>;
  eraserMode: EraserMode;
  /** Eraser radius in screen px. */
  eraserSize: number;
}

export interface ScreenRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface EngineCallbacks {
  /** The current page's strokes changed (one undo step). */
  onCommit(strokes: HwStroke[]): void;
  onView(view: View): void;
  onSelection(count: number, rect: ScreenRect | null): void;
  /** A pen (Apple Pencil, stylus) touched the canvas. */
  onPen(): void;
}

type Vec = [number, number];

type Action =
  | { kind: 'ink'; pointerId: number; pointerType: string; stroke: HwStroke; startedAt: number; lastScreen: Vec; predicted: HwPoint[] }
  | { kind: 'shape'; pointerId: number; pointerType: string; from: Vec; to: Vec; startedAt: number }
  | { kind: 'erase'; pointerId: number; pointerType: string; last: Vec; working: HwStroke[]; changed: boolean; mode: EraserMode; startedAt: number }
  | { kind: 'lasso'; pointerId: number; pointerType: string; points: Vec[]; startedAt: number }
  | { kind: 'move'; pointerId: number; pointerType: string; start: Vec; dx: number; dy: number; startedAt: number }
  | { kind: 'pan'; pointerId: number; pointerType: string; startView: View; startScreen: Vec; startedAt: number }
  | { kind: 'pinch'; ids: [number, number]; startView: View; a0: Vec; b0: Vec };

/** A one-finger stroke younger than this is dropped when a second finger lands (it was the start of a pinch). */
const PINCH_GRACE_MS = 250;
/** Minimum distance between recorded points, in screen px (pencils report up to 240 Hz). */
const MIN_POINT_GAP = 0.75;
const MAX_DPR = 3;

export class HandwritingEngine {
  private readonly stage: HTMLElement;
  private readonly base: HTMLCanvasElement;
  private readonly live: HTMLCanvasElement;
  private readonly baseCtx: CanvasRenderingContext2D;
  private readonly liveCtx: CanvasRenderingContext2D;
  private readonly cb: EngineCallbacks;
  private readonly resizeObserver: ResizeObserver;

  private page: HwPage = { id: '', background: 'grid', strokes: [] };
  private tool: ToolSettings = { tool: 'pen', color: '#1b2a41', width: 3, opacity: 1, shape: 'line', eraserMode: 'stroke', eraserSize: 10 };
  private view: View = { scale: 1, x: 24, y: 24 };
  private width = 0;
  private height = 0;
  private dpr = 1;
  private rect: DOMRect | null = null;

  private penOnly = false;
  private spaceDown = false;
  private shiftDown = false;
  private readonly pointers = new Map<number, { x: number; y: number; type: string }>();
  /** Touches left over from a pinch: ignored until lifted, so they never start a stroke. */
  private readonly spentTouches = new Set<number>();
  private action: Action | null = null;
  private penDownId: number | null = null;
  private hover: Vec | null = null;

  private selection = new Set<string>();
  /** Strokes drawn on the base layer already (just committed), so the React round-trip doesn't redraw. */
  private readonly drawnAhead = new WeakSet<HwStroke>();
  private readonly pathCache = new WeakMap<HwStroke, Path2D>();
  private readonly boundsCache = new WeakMap<HwStroke, Bounds>();

  private frame = 0;
  private dirtyBase = false;
  private dirtyLive = false;
  private viewChanged = false;
  private destroyed = false;

  constructor(stage: HTMLElement, callbacks: EngineCallbacks) {
    this.stage = stage;
    this.cb = callbacks;
    this.base = this.makeCanvas();
    this.live = this.makeCanvas();
    this.live.style.mixBlendMode = 'multiply';
    this.baseCtx = this.base.getContext('2d')!;
    // A low-latency hint where supported (Chrome); ignored elsewhere.
    this.liveCtx = (this.live.getContext('2d', { desynchronized: true } as CanvasRenderingContext2DSettings) ?? this.live.getContext('2d'))!;
    stage.append(this.base, this.live);

    stage.addEventListener('pointerdown', this.onPointerDown);
    stage.addEventListener('pointermove', this.onPointerMove);
    stage.addEventListener('pointerup', this.onPointerUp);
    stage.addEventListener('pointercancel', this.onPointerCancel);
    stage.addEventListener('pointerleave', this.onPointerLeave);
    stage.addEventListener('wheel', this.onWheel, { passive: false });
    stage.addEventListener('contextmenu', prevent);
    // iOS Safari: stop page pinch-zoom and the callout/magnifier while writing.
    stage.addEventListener('gesturestart', prevent as EventListener);
    stage.addEventListener('gesturechange', prevent as EventListener);
    stage.addEventListener('touchmove', prevent, { passive: false });

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(stage);
    this.resize();
  }

  destroy() {
    this.destroyed = true;
    cancelAnimationFrame(this.frame);
    this.resizeObserver.disconnect();
    const s = this.stage;
    s.removeEventListener('pointerdown', this.onPointerDown);
    s.removeEventListener('pointermove', this.onPointerMove);
    s.removeEventListener('pointerup', this.onPointerUp);
    s.removeEventListener('pointercancel', this.onPointerCancel);
    s.removeEventListener('pointerleave', this.onPointerLeave);
    s.removeEventListener('wheel', this.onWheel);
    s.removeEventListener('contextmenu', prevent);
    s.removeEventListener('gesturestart', prevent as EventListener);
    s.removeEventListener('gesturechange', prevent as EventListener);
    s.removeEventListener('touchmove', prevent);
    this.base.remove();
    this.live.remove();
  }

  // ------------------------------------------------------------------ inputs from React

  setPage(page: HwPage, view?: View) {
    const samePage = page.id === this.page.id;
    const prev = this.page.strokes;
    this.page = page;
    if (!samePage) {
      this.cancelAction();
      this.selection.clear();
      this.emitSelection();
      this.view = view ?? this.defaultView();
      this.viewChanged = true;
      this.applyBackground();
      this.requestRender(true, true);
      return;
    }
    this.applyBackground();
    if (page.strokes === prev) return;
    // Drop selected ids that no longer exist (undo, clear).
    if (this.selection.size) {
      const ids = new Set(page.strokes.map((s) => s.id));
      for (const id of [...this.selection]) if (!ids.has(id)) this.selection.delete(id);
      this.emitSelection();
    }
    // Strokes appended on top of what is drawn can be painted incrementally.
    const appended = page.strokes.length > prev.length && prev.every((s, i) => page.strokes[i] === s);
    if (appended) {
      const ctx = this.baseCtx;
      this.applyWorldTransform(ctx);
      for (const s of page.strokes.slice(prev.length)) if (!this.drawnAhead.has(s)) this.drawStroke(ctx, s);
      return;
    }
    this.requestRender(true, true);
  }

  setTool(tool: ToolSettings) {
    const toolChanged = tool.tool !== this.tool.tool;
    this.tool = tool;
    if (toolChanged && tool.tool !== 'lasso' && this.selection.size) {
      this.selection.clear();
      this.emitSelection();
    }
    this.updateCursor();
    this.requestRender(false, true);
  }

  setPenOnly(on: boolean) {
    this.penOnly = on;
  }

  setModifierKeys(keys: { space?: boolean; shift?: boolean }) {
    if (keys.space !== undefined) this.spaceDown = keys.space;
    if (keys.shift !== undefined) this.shiftDown = keys.shift;
    this.updateCursor();
  }

  getView(): View {
    return this.view;
  }

  setView(view: View) {
    this.view = view;
    this.viewChanged = true;
    this.applyBackground();
    this.requestRender(true, true);
  }

  zoomBy(factor: number) {
    this.setView(zoomAt(this.view, factor, this.width / 2, this.height / 2));
  }

  /** 100% around the centre of the screen. */
  resetZoom() {
    this.setView(zoomTo(this.view, 1, this.width / 2, this.height / 2));
  }

  /** Fit the page's ink to the screen (or the default view for an empty page). */
  fit() {
    this.setView(this.defaultView(true));
  }

  hasSelection() {
    return this.selection.size > 0;
  }

  deleteSelection() {
    if (!this.selection.size) return;
    const next = this.page.strokes.filter((s) => !this.selection.has(s.id));
    this.selection.clear();
    this.commit(next);
    this.emitSelection();
  }

  /** Recolour the selected strokes (palette click while something is selected). */
  styleSelection(patch: { color?: string; opacity?: number }) {
    if (!this.selection.size) return;
    const next = this.page.strokes.map((s) =>
      this.selection.has(s.id) ? { ...s, ...(patch.color ? { color: patch.color } : {}), ...(patch.opacity ? { opacity: patch.opacity } : {}) } : s
    );
    this.commit(next);
  }

  clearSelection() {
    if (!this.selection.size) return;
    this.selection.clear();
    this.emitSelection();
    this.requestRender(false, true);
  }

  // ------------------------------------------------------------------ geometry helpers

  private makeCanvas() {
    const c = document.createElement('canvas');
    c.style.position = 'absolute';
    c.style.inset = '0';
    c.style.width = '100%';
    c.style.height = '100%';
    c.style.pointerEvents = 'none';
    return c;
  }

  private resize() {
    const r = this.stage.getBoundingClientRect();
    const first = this.width === 0;
    this.width = Math.max(1, Math.round(r.width));
    this.height = Math.max(1, Math.round(r.height));
    this.dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    for (const c of [this.base, this.live]) {
      c.width = Math.round(this.width * this.dpr);
      c.height = Math.round(this.height * this.dpr);
    }
    this.rect = null;
    if (first && this.page.id) this.view = this.defaultView();
    this.viewChanged = true;
    this.applyBackground();
    this.requestRender(true, true);
  }

  /** Content top-left at 100% (or fitted when `fitInk` and there is ink). */
  private defaultView(fitInk = false): View {
    const b = strokesBounds(this.page.strokes);
    if (!b) return { scale: 1, x: 24, y: 24 };
    if (fitInk) return fitBounds(b, this.width, this.height, { pad: 32, maxScale: 2 });
    // Opening a page: start at 100% at the top-left of the ink, zooming out only if it is wider than the screen.
    const v = fitBounds(b, this.width, this.height, { pad: 32, maxScale: 1, align: 'top', widthOnly: true });
    return { ...v, x: Math.min(v.x, 32 - b.minX * v.scale) };
  }

  private local(e: { clientX: number; clientY: number }): Vec {
    if (!this.rect) this.rect = this.stage.getBoundingClientRect();
    return [e.clientX - this.rect.left, e.clientY - this.rect.top];
  }

  private world(screen: Vec): Vec {
    return toWorld(this.view, screen[0], screen[1]);
  }

  private boundsOf(s: HwStroke): Bounds {
    let b = this.boundsCache.get(s);
    if (!b) {
      b = strokeBounds(s);
      this.boundsCache.set(s, b);
    }
    return b;
  }

  private pathOf(s: HwStroke): Path2D {
    let p = this.pathCache.get(s);
    if (!p) {
      p = new Path2D(isFreehand(s) ? outlineToPathData(freehandOutline(s)) : shapePathData(s));
      this.pathCache.set(s, p);
    }
    return p;
  }

  private selectionBounds(): Bounds | null {
    if (!this.selection.size) return null;
    return strokesBounds(this.page.strokes.filter((s) => this.selection.has(s.id)));
  }

  private selectionScreenRect(): ScreenRect | null {
    const b = this.selectionBounds();
    if (!b) return null;
    const off = this.action?.kind === 'move' ? [this.action.dx, this.action.dy] : [0, 0];
    const [x0, y0] = toScreen(this.view, b.minX + off[0], b.minY + off[1]);
    const [x1, y1] = toScreen(this.view, b.maxX + off[0], b.maxY + off[1]);
    return { x: x0, y: y0, width: x1 - x0, height: y1 - y0 };
  }

  private emitSelection() {
    this.cb.onSelection(this.selection.size, this.selectionScreenRect());
  }

  private commit(strokes: HwStroke[], redrawBase = true) {
    this.page = { ...this.page, strokes };
    this.requestRender(redrawBase, true);
    this.cb.onCommit(strokes);
  }

  // ------------------------------------------------------------------ rendering

  private requestRender(base: boolean, live: boolean) {
    if (this.destroyed) return;
    this.dirtyBase ||= base;
    this.dirtyLive ||= live;
    if (!this.frame) this.frame = requestAnimationFrame(this.flush);
  }

  private flush = () => {
    this.frame = 0;
    if (this.destroyed) return;
    if (this.dirtyBase) this.renderBase();
    if (this.dirtyLive) this.renderLive();
    this.dirtyBase = false;
    this.dirtyLive = false;
    if (this.viewChanged) {
      this.viewChanged = false;
      this.cb.onView(this.view);
      if (this.selection.size) this.emitSelection();
    }
  };

  private applyWorldTransform(ctx: CanvasRenderingContext2D) {
    const k = this.dpr * this.view.scale;
    ctx.setTransform(k, 0, 0, k, this.dpr * this.view.x, this.dpr * this.view.y);
  }

  private drawStroke(ctx: CanvasRenderingContext2D, s: HwStroke, dx = 0, dy = 0) {
    const path = this.pathOf(s);
    ctx.save();
    if (dx || dy) ctx.translate(dx, dy);
    ctx.globalAlpha = s.opacity;
    if (isFreehand(s)) {
      if (s.tool === 'highlighter') ctx.globalCompositeOperation = 'multiply';
      ctx.fillStyle = s.color;
      ctx.fill(path);
    } else {
      ctx.strokeStyle = s.color;
      ctx.lineWidth = s.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke(path);
    }
    ctx.restore();
  }

  private renderBase() {
    const ctx = this.baseCtx;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this.base.width, this.base.height);
    this.applyWorldTransform(ctx);
    const vis = visibleWorld(this.view, this.width, this.height);
    const strokes = this.action?.kind === 'erase' ? this.action.working : this.page.strokes;
    const moving = this.action?.kind === 'move';
    for (const s of strokes) {
      if (moving && this.selection.has(s.id)) continue;
      if (boundsIntersect(this.boundsOf(s), vis)) this.drawStroke(ctx, s);
    }
  }

  private renderLive() {
    const ctx = this.liveCtx;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this.live.width, this.live.height);
    const a = this.action;

    if (a?.kind === 'ink') {
      this.applyWorldTransform(ctx);
      const pts = a.predicted.length ? [...a.stroke.points, ...a.predicted] : a.stroke.points;
      const s = { ...a.stroke, points: pts };
      ctx.save();
      ctx.globalAlpha = s.opacity;
      ctx.fillStyle = s.color;
      ctx.fill(new Path2D(outlineToPathData(freehandOutline(s, false))));
      ctx.restore();
    } else if (a?.kind === 'shape') {
      this.applyWorldTransform(ctx);
      this.drawStroke(ctx, this.shapeStroke(a.from, a.to, 'preview'));
    } else if (a?.kind === 'move') {
      this.applyWorldTransform(ctx);
      for (const s of this.page.strokes) if (this.selection.has(s.id)) this.drawStroke(ctx, s, a.dx, a.dy);
    }

    // Screen-space overlays.
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    if (a?.kind === 'lasso' && a.points.length > 1) {
      ctx.beginPath();
      a.points.forEach((p, i) => {
        const [x, y] = toScreen(this.view, p[0], p[1]);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.fillStyle = 'rgba(37, 99, 235, 0.06)';
      ctx.fill();
      ctx.setLineDash([6, 4]);
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#2563eb';
      ctx.stroke();
      ctx.setLineDash([]);
    }
    const sel = this.selection.size ? this.selectionScreenRect() : null;
    if (sel) {
      ctx.setLineDash([6, 4]);
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#2563eb';
      ctx.strokeRect(sel.x - 6, sel.y - 6, sel.width + 12, sel.height + 12);
      ctx.setLineDash([]);
    }
    const ring = this.tool.tool === 'eraser' ? (a?.kind === 'erase' ? a.last : this.hover) : null;
    if (ring) {
      const [x, y] = toScreen(this.view, ring[0], ring[1]);
      ctx.beginPath();
      ctx.arc(x, y, this.tool.eraserSize, 0, Math.PI * 2);
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#6b7280';
      ctx.fillStyle = 'rgba(107, 114, 128, 0.08)';
      ctx.fill();
      ctx.stroke();
    }
  }

  private applyBackground() {
    const st = this.stage.style;
    st.backgroundColor = PAPER;
    const bg: HwBackground = this.page.background;
    const step = (bg === 'grid' ? GRID_SIZE : LINE_SPACING) * this.view.scale;
    if (bg === 'blank' || step < 6) {
      st.backgroundImage = 'none';
      return;
    }
    const color = bg === 'grid' ? GRID_COLOR : LINE_COLOR;
    const h = `linear-gradient(to bottom, ${color} 1px, transparent 1px)`;
    const v = `linear-gradient(to right, ${color} 1px, transparent 1px)`;
    st.backgroundImage = bg === 'grid' ? `${v}, ${h}` : h;
    st.backgroundSize = `${step}px ${step}px`;
    const ox = ((this.view.x % step) + step) % step;
    const oy = ((this.view.y % step) + step) % step;
    st.backgroundPosition = `${ox}px ${oy}px`;
  }

  private updateCursor() {
    const t = this.tool.tool;
    const panning = this.action?.kind === 'pan';
    this.stage.style.cursor =
      panning ? 'grabbing' : this.spaceDown || t === 'hand' ? 'grab' : t === 'eraser' ? 'none' : t === 'lasso' ? 'default' : 'crosshair';
  }

  // ------------------------------------------------------------------ pointer input

  private onPointerDown = (e: PointerEvent) => {
    if (e.pointerType === 'mouse' && e.button !== 0 && e.button !== 1) return;
    this.rect = this.stage.getBoundingClientRect();
    const screen = this.local(e);
    this.pointers.set(e.pointerId, { x: screen[0], y: screen[1], type: e.pointerType });
    this.stage.setPointerCapture?.(e.pointerId);

    if (e.pointerType === 'pen') {
      this.cb.onPen();
      this.penDownId = e.pointerId;
      // A palm (or finger) got there first: drop whatever it started.
      if (this.action && this.action.kind !== 'pinch' && this.action.pointerType === 'touch') this.cancelAction();
      if (this.action?.kind === 'pinch') this.cancelAction();
    }

    if (e.pointerType === 'touch') {
      if (this.penDownId !== null) return; // palm resting while the pencil writes
      if (e.width > 60 && e.height > 60) return; // a palm-sized contact
      const touches = [...this.pointers.entries()].filter(([id, p]) => p.type === 'touch' && !this.spentTouches.has(id));
      if (touches.length >= 2) {
        const a = this.action;
        if (a && a.kind !== 'pinch' && a.pointerType === 'touch') {
          if (a.kind === 'ink' && performance.now() - a.startedAt > PINCH_GRACE_MS) this.finishAction();
          else this.cancelAction();
        }
        if (!this.action) this.startPinch(touches[0][0], touches[1][0]);
        return;
      }
      if (this.action) return;
      if (this.penOnly || this.tool.tool === 'hand') {
        this.startPan(e, screen);
        return;
      }
    }

    if (this.action) return;
    if ((e.pointerType === 'mouse' && e.button === 1) || this.spaceDown || this.tool.tool === 'hand') {
      e.preventDefault();
      this.startPan(e, screen);
      return;
    }
    // The back end of some styluses (Surface Pen) erases.
    const tool = e.pointerType === 'pen' && (e.buttons & 32) !== 0 ? 'eraser' : this.tool.tool;
    this.startTool(tool, e, screen);
  };

  private onPointerMove = (e: PointerEvent) => {
    const screen = this.local(e);
    const p = this.pointers.get(e.pointerId);
    if (p) {
      p.x = screen[0];
      p.y = screen[1];
    }
    const a = this.action;
    if (!a) {
      if (this.tool.tool === 'eraser' && e.pointerType !== 'touch') {
        this.hover = this.world(screen);
        this.requestRender(false, true);
      }
      return;
    }
    if (a.kind === 'pinch') {
      if (!a.ids.includes(e.pointerId)) return;
      const pa = this.pointers.get(a.ids[0]);
      const pb = this.pointers.get(a.ids[1]);
      if (!pa || !pb) return;
      this.view = pinchView(a.startView, a.a0, a.b0, [pa.x, pa.y], [pb.x, pb.y]);
      this.viewChanged = true;
      this.applyBackground();
      this.requestRender(true, true);
      return;
    }
    if (a.pointerId !== e.pointerId) return;

    switch (a.kind) {
      case 'pan': {
        this.view = { ...a.startView, x: a.startView.x + screen[0] - a.startScreen[0], y: a.startView.y + screen[1] - a.startScreen[1] };
        this.viewChanged = true;
        this.applyBackground();
        this.requestRender(true, true);
        break;
      }
      case 'ink': {
        const events = e.getCoalescedEvents?.() ?? [];
        for (const ev of events.length ? events : [e]) this.addInkPoint(a, ev);
        a.predicted = (e.getPredictedEvents?.() ?? []).slice(0, 2).map((ev) => this.inkPoint(a, ev));
        this.requestRender(false, true);
        break;
      }
      case 'shape':
        a.to = this.world(screen);
        this.requestRender(false, true);
        break;
      case 'erase': {
        const events = e.getCoalescedEvents?.() ?? [];
        for (const ev of events.length ? events : [e]) this.eraseTo(a, this.world(this.local(ev)));
        break;
      }
      case 'lasso': {
        const w = this.world(screen);
        const last = a.points[a.points.length - 1];
        if (Math.hypot(w[0] - last[0], w[1] - last[1]) * this.view.scale >= 2) a.points.push(w);
        this.requestRender(false, true);
        break;
      }
      case 'move': {
        const w = this.world(screen);
        a.dx = round1(w[0] - a.start[0]);
        a.dy = round1(w[1] - a.start[1]);
        this.requestRender(false, true);
        this.emitSelection();
        break;
      }
    }
  };

  private onPointerUp = (e: PointerEvent) => {
    this.endPointer(e, false);
  };

  private onPointerCancel = (e: PointerEvent) => {
    this.endPointer(e, true);
  };

  private onPointerLeave = (e: PointerEvent) => {
    if (e.pointerType !== 'touch' && !this.action && this.hover) {
      this.hover = null;
      this.requestRender(false, true);
    }
  };

  private endPointer(e: PointerEvent, cancelled: boolean) {
    this.pointers.delete(e.pointerId);
    this.spentTouches.delete(e.pointerId);
    if (e.pointerId === this.penDownId) this.penDownId = null;
    const a = this.action;
    if (!a) return;
    if (a.kind === 'pinch') {
      if (!a.ids.includes(e.pointerId)) return;
      // The other finger is still down: it must not start drawing or panning.
      for (const id of a.ids) if (this.pointers.has(id)) this.spentTouches.add(id);
      this.action = null;
      return;
    }
    if (a.pointerId !== e.pointerId) return;
    // A cancelled touch (the browser took it over) is discarded; a pen's ink is kept.
    if (cancelled && a.pointerType === 'touch') this.cancelAction();
    else this.finishAction();
  }

  private onWheel = (e: WheelEvent) => {
    e.preventDefault();
    const screen = this.local(e);
    if (e.ctrlKey || e.metaKey) {
      this.setView(zoomAt(this.view, wheelZoomFactor(e.deltaY, e.deltaMode), screen[0], screen[1]));
      return;
    }
    const k = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? this.height : 1;
    const dx = (e.shiftKey && !e.deltaX ? e.deltaY : e.deltaX) * k;
    const dy = (e.shiftKey && !e.deltaX ? 0 : e.deltaY) * k;
    this.setView({ ...this.view, x: this.view.x - dx, y: this.view.y - dy });
  };

  // ------------------------------------------------------------------ actions

  private startPan(e: PointerEvent, screen: Vec) {
    this.action = { kind: 'pan', pointerId: e.pointerId, pointerType: e.pointerType, startView: this.view, startScreen: screen, startedAt: performance.now() };
    this.updateCursor();
  }

  private startPinch(idA: number, idB: number) {
    const pa = this.pointers.get(idA)!;
    const pb = this.pointers.get(idB)!;
    this.action = { kind: 'pinch', ids: [idA, idB], startView: this.view, a0: [pa.x, pa.y], b0: [pb.x, pb.y] };
  }

  private startTool(tool: ToolId, e: PointerEvent, screen: Vec) {
    const w = this.world(screen);
    const now = performance.now();
    const base = { pointerId: e.pointerId, pointerType: e.pointerType, startedAt: now };
    switch (tool) {
      case 'pen':
      case 'highlighter': {
        const stroke: HwStroke = {
          id: newId(),
          tool,
          color: this.tool.color,
          width: this.tool.width,
          opacity: this.tool.opacity,
          pressure: e.pointerType === 'pen',
          points: [],
        };
        const a: Action = { kind: 'ink', ...base, stroke, lastScreen: screen, predicted: [] };
        a.stroke.points.push(this.inkPoint(a, e));
        this.action = a;
        this.requestRender(false, true);
        break;
      }
      case 'shape':
        this.action = { kind: 'shape', ...base, from: w, to: w };
        break;
      case 'eraser': {
        const a: Action = { kind: 'erase', ...base, last: w, working: this.page.strokes, changed: false, mode: this.tool.eraserMode };
        this.action = a;
        this.eraseTo(a, w);
        break;
      }
      case 'lasso': {
        const sb = this.selectionBounds();
        const pad = 8 / this.view.scale;
        if (sb && w[0] >= sb.minX - pad && w[0] <= sb.maxX + pad && w[1] >= sb.minY - pad && w[1] <= sb.maxY + pad) {
          this.action = { kind: 'move', ...base, start: w, dx: 0, dy: 0 };
          this.requestRender(true, true);
        } else {
          if (this.selection.size) {
            this.selection.clear();
            this.emitSelection();
          }
          this.action = { kind: 'lasso', ...base, points: [w] };
        }
        break;
      }
      default:
        break;
    }
  }

  private inkPoint(a: Extract<Action, { kind: 'ink' }>, ev: PointerEvent): HwPoint {
    const [x, y] = this.world(this.local(ev));
    const pressure = a.stroke.pressure ? (ev.pressure > 0 ? ev.pressure : 0.5) : 0.5;
    return [round1(x), round1(y), round2(pressure)];
  }

  private addInkPoint(a: Extract<Action, { kind: 'ink' }>, ev: PointerEvent) {
    const screen = this.local(ev);
    if (Math.hypot(screen[0] - a.lastScreen[0], screen[1] - a.lastScreen[1]) < MIN_POINT_GAP) return;
    a.lastScreen = screen;
    a.stroke.points.push(this.inkPoint(a, ev));
  }

  private eraseTo(a: Extract<Action, { kind: 'erase' }>, to: Vec) {
    const r = this.tool.eraserSize / this.view.scale;
    const from = a.last;
    a.last = to;
    let changed = false;
    const next =
      a.mode === 'stroke'
        ? a.working.filter((s) => {
            const hit = strokeHitBySegment(s, from, to, r);
            if (hit) changed = true;
            return !hit;
          })
        : a.working.flatMap((s) => {
            const pieces = eraseFromStroke(s, from, to, r, newId);
            if (pieces.length !== 1 || pieces[0] !== s) changed = true;
            return pieces;
          });
    if (changed) {
      a.working = next;
      a.changed = true;
    }
    this.requestRender(changed, true);
  }

  private shapeStroke(from: Vec, to: Vec, id: string): HwStroke {
    let end = to;
    if (this.shiftDown) end = this.tool.shape === 'line' || this.tool.shape === 'arrow' ? snapAngle(from, to) : squareBox(from, to);
    return {
      id,
      tool: 'shape',
      shape: this.tool.shape,
      color: this.tool.color,
      width: this.tool.width,
      opacity: this.tool.opacity,
      pressure: false,
      points: [
        [round1(from[0]), round1(from[1]), 0.5],
        [round1(end[0]), round1(end[1]), 0.5],
      ],
    };
  }

  private finishAction() {
    const a = this.action;
    this.action = null;
    if (!a) return;
    switch (a.kind) {
      case 'ink': {
        const stroke = a.stroke;
        if (stroke.points.length > 0) {
          // Paint it on the base layer now; the React round-trip then finds it drawn.
          this.drawnAhead.add(stroke);
          this.applyWorldTransform(this.baseCtx);
          this.drawStroke(this.baseCtx, stroke);
          this.commit([...this.page.strokes, stroke], false);
        }
        break;
      }
      case 'shape': {
        const len = Math.hypot(a.to[0] - a.from[0], a.to[1] - a.from[1]) * this.view.scale;
        if (len >= 3) this.commit([...this.page.strokes, this.shapeStroke(a.from, a.to, newId())]);
        break;
      }
      case 'erase':
        if (a.changed) this.commit(a.working);
        break;
      case 'lasso': {
        const hits = a.points.length >= 3 ? this.page.strokes.filter((s) => strokeInLasso(s, a.points)) : [];
        this.selection = new Set(hits.map((s) => s.id));
        this.emitSelection();
        break;
      }
      case 'move':
        if (a.dx || a.dy) this.commit(this.page.strokes.map((s) => (this.selection.has(s.id) ? translateStroke(s, a.dx, a.dy) : s)));
        this.emitSelection();
        break;
      default:
        break;
    }
    this.updateCursor();
    this.requestRender(a.kind === 'move' || a.kind === 'erase', true);
  }

  /** Drop the in-progress action without committing anything. */
  private cancelAction() {
    const a = this.action;
    this.action = null;
    if (a && (a.kind === 'erase' || a.kind === 'move')) this.requestRender(true, true);
    else this.requestRender(false, true);
    this.updateCursor();
  }
}

function prevent(e: Event) {
  e.preventDefault();
}
