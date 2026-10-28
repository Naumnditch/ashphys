'use client';

/**
 * Read-only viewer for a handwritten solution: the server-rendered SVG page
 * snapshots stacked top to bottom, with pan (drag, one finger, wheel), zoom
 * (pinch, Ctrl/Cmd + wheel, buttons, double-click) and full screen. No
 * editing tools and no write calls. Pan/zoom only rewrite the SVG viewBox,
 * so the ink stays sharp at every zoom and React doesn't re-render per frame.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { HwSnapshot } from '@/lib/handwriting/types';
import { fitBounds, pinchView, wheelZoomFactor, zoomAt, zoomTo, type View } from '@/lib/handwriting/view';
import { IconButton, ZoomBar } from './controls';
import { ExitFullscreenIcon } from './icons';
import { useFullscreen } from './useFullscreen';

const GAP = 24;

export function HandwritingViewer({ pages, label }: { pages: HwSnapshot[]; label: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const viewRef = useRef<View>({ scale: 1, x: 0, y: 0 });
  const size = useRef({ w: 1, h: 1 });
  const userMoved = useRef(false);
  const [zoom, setZoom] = useState(1);
  const fs = useFullscreen(rootRef);

  const layout = useMemo(() => {
    const width = Math.max(1, ...pages.map((p) => p.width));
    let y = 0;
    const items = pages.map((s) => {
      const item = { s, x: (width - s.width) / 2, y };
      y += s.height + GAP;
      return item;
    });
    return { items, width, height: Math.max(1, y - GAP) };
  }, [pages]);

  // Built once per solution; only the viewBox changes afterwards.
  const markup = useMemo(
    () =>
      layout.items
        .map(
          ({ s, x, y }) =>
            `<g transform="translate(${x - s.x} ${y - s.y})">${s.body}</g>` +
            `<rect x="${x}" y="${y}" width="${s.width}" height="${s.height}" fill="none" stroke="#d4d4d4" stroke-width="1" vector-effect="non-scaling-stroke"/>`
        )
        .join(''),
    [layout]
  );

  const apply = useCallback((v: View) => {
    viewRef.current = v;
    const { w, h } = size.current;
    svgRef.current?.setAttribute('viewBox', `${-v.x / v.scale} ${-v.y / v.scale} ${w / v.scale} ${h / v.scale}`);
    setZoom(v.scale);
  }, []);

  const fitWidth = useCallback(() => {
    const { w, h } = size.current;
    apply(fitBounds({ minX: 0, minY: 0, maxX: layout.width, maxY: layout.height }, w, h, { pad: 16, maxScale: 1.5, align: 'top', widthOnly: true }));
  }, [apply, layout]);

  // Size tracking: refit until the reader has moved the view themselves.
  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const measure = () => {
      const r = box.getBoundingClientRect();
      size.current = { w: Math.max(1, r.width), h: Math.max(1, r.height) };
      if (!userMoved.current) fitWidth();
      else apply(viewRef.current);
    };
    const ro = new ResizeObserver(measure);
    ro.observe(box);
    measure();
    return () => ro.disconnect();
  }, [apply, fitWidth]);

  useEffect(() => {
    userMoved.current = false;
    fitWidth();
  }, [fitWidth]);

  // Pointer pan + pinch, wheel pan/zoom.
  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const pointers = new Map<number, [number, number]>();
    let pan: { start: View; from: [number, number] } | null = null;
    let pinch: { start: View; ids: [number, number]; a0: [number, number]; b0: [number, number] } | null = null;
    const local = (e: { clientX: number; clientY: number }): [number, number] => {
      const r = box.getBoundingClientRect();
      return [e.clientX - r.left, e.clientY - r.top];
    };
    const restart = () => {
      const ids = [...pointers.keys()];
      pan = null;
      pinch = null;
      if (ids.length >= 2) pinch = { start: viewRef.current, ids: [ids[0], ids[1]], a0: pointers.get(ids[0])!, b0: pointers.get(ids[1])! };
      else if (ids.length === 1) pan = { start: viewRef.current, from: pointers.get(ids[0])! };
    };
    const down = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      box.setPointerCapture?.(e.pointerId);
      pointers.set(e.pointerId, local(e));
      restart();
    };
    const move = (e: PointerEvent) => {
      if (!pointers.has(e.pointerId)) return;
      const p = local(e);
      pointers.set(e.pointerId, p);
      userMoved.current = true;
      if (pinch) {
        apply(pinchView(pinch.start, pinch.a0, pinch.b0, pointers.get(pinch.ids[0])!, pointers.get(pinch.ids[1])!));
      } else if (pan) {
        apply({ ...pan.start, x: pan.start.x + p[0] - pan.from[0], y: pan.start.y + p[1] - pan.from[1] });
      }
    };
    const up = (e: PointerEvent) => {
      if (!pointers.delete(e.pointerId)) return;
      restart();
    };
    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      userMoved.current = true;
      const [cx, cy] = local(e);
      const v = viewRef.current;
      if (e.ctrlKey || e.metaKey) apply(zoomAt(v, wheelZoomFactor(e.deltaY, e.deltaMode), cx, cy));
      else {
        const k = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? size.current.h : 1;
        apply({ ...v, x: v.x - e.deltaX * k, y: v.y - e.deltaY * k });
      }
    };
    const dbl = (e: MouseEvent) => {
      userMoved.current = true;
      const [cx, cy] = local(e);
      const v = viewRef.current;
      apply(v.scale < 1.9 ? zoomTo(v, Math.max(2, v.scale * 2), cx, cy) : zoomTo(v, 1, cx, cy));
    };
    const prevent = (e: Event) => e.preventDefault();
    box.addEventListener('pointerdown', down);
    box.addEventListener('pointermove', move);
    box.addEventListener('pointerup', up);
    box.addEventListener('pointercancel', up);
    box.addEventListener('wheel', wheel, { passive: false });
    box.addEventListener('dblclick', dbl);
    box.addEventListener('gesturestart', prevent);
    box.addEventListener('touchmove', prevent, { passive: false });
    return () => {
      box.removeEventListener('pointerdown', down);
      box.removeEventListener('pointermove', move);
      box.removeEventListener('pointerup', up);
      box.removeEventListener('pointercancel', up);
      box.removeEventListener('wheel', wheel);
      box.removeEventListener('dblclick', dbl);
      box.removeEventListener('gesturestart', prevent);
      box.removeEventListener('touchmove', prevent);
    };
  }, [apply]);

  const center = (): [number, number] => [size.current.w / 2, size.current.h / 2];
  const zoomBy = (f: number) => {
    userMoved.current = true;
    apply(zoomAt(viewRef.current, f, ...center()));
  };

  const onKey = (e: React.KeyboardEvent) => {
    const v = viewRef.current;
    const step = 60;
    const moves: Record<string, [number, number]> = { ArrowUp: [0, step], ArrowDown: [0, -step], ArrowLeft: [step, 0], ArrowRight: [-step, 0] };
    if (moves[e.key]) {
      e.preventDefault();
      userMoved.current = true;
      apply({ ...v, x: v.x + moves[e.key][0], y: v.y + moves[e.key][1] });
    } else if (e.key === '+' || e.key === '=') zoomBy(1.25);
    else if (e.key === '-') zoomBy(0.8);
    else if (e.key === '0') fitWidth();
  };

  return (
    <div
      ref={rootRef}
      className={`relative overflow-hidden bg-gray-100 ${fs.fallback ? 'fixed inset-0 z-[70] h-[100dvh] w-screen' : 'h-full w-full'}`}
    >
      <div
        ref={boxRef}
        tabIndex={0}
        onKeyDown={onKey}
        role="region"
        aria-roledescription="zoomable solution"
        aria-label={`${label}. Drag to move, pinch or Ctrl + scroll to zoom, arrow keys to move.`}
        className="absolute inset-0 cursor-grab active:cursor-grabbing focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500"
        style={{ touchAction: 'none', WebkitUserSelect: 'none', userSelect: 'none' } as React.CSSProperties}
      >
        <svg
          ref={svgRef}
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          preserveAspectRatio="xMinYMin meet"
          aria-hidden="true"
          className="block"
          dangerouslySetInnerHTML={{ __html: markup }}
        />
      </div>
      <ZoomBar
        className="absolute top-2 right-2 z-10"
        zoom={zoom}
        onZoomIn={() => zoomBy(1.25)}
        onZoomOut={() => zoomBy(0.8)}
        onFit={() => {
          userMoved.current = false;
          fitWidth();
        }}
        onReset={() => {
          userMoved.current = true;
          apply(zoomTo(viewRef.current, 1, ...center()));
        }}
        fullscreen={fs.isFullscreen}
        onToggleFullscreen={fs.toggle}
      />
      {fs.isFullscreen && (
        <div className="absolute top-2 left-2 z-10">
          <IconButton label="Exit full screen" onClick={fs.exit} className="bg-white/95 border border-gray-200 shadow-lg">
            <ExitFullscreenIcon />
          </IconButton>
        </div>
      )}
    </div>
  );
}
