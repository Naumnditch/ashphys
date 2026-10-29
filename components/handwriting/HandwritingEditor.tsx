'use client';

/**
 * Handwriting canvas for one practice question. Loaded with next/dynamic
 * from the practice page: for an admin it edits the teacher's worked
 * solution (the default endpoint, admin-only on the server); for a student it
 * edits their own private workspace (`endpoint` = /api/practice/…/workspace/…),
 * and only once they open "My working".
 *
 * Tools: pen, highlighter, eraser (whole strokes or pixel), lasso (select,
 * move, delete, recolour), shapes (line, arrow, rectangle, ellipse; Shift
 * snaps), hand. Undo/redo, clear page, several pages per question with a
 * blank/grid/lined background each, pinch/scroll/Ctrl-wheel zoom, fit and
 * 100%, full screen, "Pencil only" (fingers navigate), autosave.
 */

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { HandwritingEngine, type EraserMode, type ScreenRect, type ToolId } from './engine';
import { IconButton, Popover, ZoomBar } from './controls';
import { useFullscreen } from './useFullscreen';
import { useHandwritingDoc, type SaveState } from './useHandwritingDoc';
import {
  ArrowIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  EllipseIcon,
  EraserIcon,
  ExitFullscreenIcon,
  HandIcon,
  HighlighterIcon,
  LassoIcon,
  LineIcon,
  MoreIcon,
  PenIcon,
  PencilOnlyIcon,
  PlusIcon,
  RectIcon,
  RedoIcon,
  TrashIcon,
  UndoIcon,
} from './icons';
import { countStrokes, emptyPage, newId, type HwBackground, type HwShape } from '@/lib/handwriting/types';
import type { View } from '@/lib/handwriting/view';

type ShapeKind = Exclude<HwShape, 'polyline'>;
type StyleKey = 'pen' | 'highlighter' | 'shape';

interface Style {
  color: string;
  width: number;
  opacity: number;
}

interface ToolPrefs {
  tool: ToolId;
  pen: Style;
  highlighter: Style;
  shape: Style;
  shapeKind: ShapeKind;
  eraserMode: EraserMode;
  eraserSize: number;
}

const INK = ['#111827', '#1b2a41', '#2563eb', '#dc2626', '#2e7d6b', '#b8823d', '#7c3aed', '#db2777'];
const HIGHLIGHT = ['#facc15', '#a3e635', '#67e8f9', '#f9a8d4', '#fdba74', '#c4b5fd'];
const WIDTH_RANGE: Record<StyleKey, [number, number]> = { pen: [1, 24], highlighter: [6, 60], shape: [1, 16] };
const STYLE_NAME: Record<StyleKey, string> = { pen: 'Pen', highlighter: 'Highlighter', shape: 'Shapes' };

const DEFAULT_PREFS: ToolPrefs = {
  tool: 'pen',
  pen: { color: '#1b2a41', width: 3, opacity: 1 },
  highlighter: { color: '#facc15', width: 20, opacity: 0.35 },
  shape: { color: '#1b2a41', width: 2.5, opacity: 1 },
  shapeKind: 'line',
  eraserMode: 'stroke',
  eraserSize: 12,
};

const PREFS_KEY = 'ashphys:handwriting-tools';
const PENCIL_ONLY_KEY = 'ashphys:handwriting-pencil-only';
const TOOLS: ToolId[] = ['pen', 'highlighter', 'eraser', 'lasso', 'shape', 'hand'];
const SHAPE_ICON: Record<ShapeKind, ReactNode> = {
  line: <LineIcon />,
  arrow: <ArrowIcon />,
  rect: <RectIcon />,
  ellipse: <EllipseIcon />,
};

function readPrefs(): ToolPrefs {
  try {
    const raw = JSON.parse(localStorage.getItem(PREFS_KEY) || 'null');
    if (!raw || typeof raw !== 'object') return DEFAULT_PREFS;
    const style = (k: StyleKey): Style => {
      const s = raw[k] ?? {};
      const [lo, hi] = WIDTH_RANGE[k];
      return {
        color: /^#[0-9a-f]{6}$/i.test(s.color) ? s.color : DEFAULT_PREFS[k].color,
        width: typeof s.width === 'number' && s.width >= lo && s.width <= hi ? s.width : DEFAULT_PREFS[k].width,
        opacity: typeof s.opacity === 'number' && s.opacity >= 0.1 && s.opacity <= 1 ? s.opacity : DEFAULT_PREFS[k].opacity,
      };
    };
    return {
      tool: TOOLS.includes(raw.tool) ? raw.tool : 'pen',
      pen: style('pen'),
      highlighter: style('highlighter'),
      shape: style('shape'),
      shapeKind: ['line', 'arrow', 'rect', 'ellipse'].includes(raw.shapeKind) ? raw.shapeKind : 'line',
      eraserMode: raw.eraserMode === 'pixel' ? 'pixel' : 'stroke',
      eraserSize: typeof raw.eraserSize === 'number' && raw.eraserSize >= 4 && raw.eraserSize <= 40 ? raw.eraserSize : 12,
    };
  } catch {
    return DEFAULT_PREFS;
  }
}

function writeStorage(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Private mode / blocked storage: preferences just aren't remembered.
  }
}

const styleKeyOf = (tool: ToolId): StyleKey => (tool === 'highlighter' ? 'highlighter' : tool === 'shape' ? 'shape' : 'pen');

type MenuId = 'style' | 'eraser' | 'shape' | 'page';

export default function HandwritingEditor({
  problemId,
  label,
  endpoint,
  onLoaded,
  onSaveState,
}: {
  problemId: string;
  label?: string;
  /** Where the document is loaded from and saved to (default: the admin's handwritten solution). */
  endpoint?: string;
  onLoaded?: (data: Record<string, unknown>) => void;
  /** Save status plus how many strokes the current document has (all saved when status is 'saved'). */
  onSaveState?: (state: SaveState & { strokeCount: number }) => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<HandwritingEngine | null>(null);
  const overStage = useRef(false);
  const views = useRef(new Map<string, View>());

  const fs = useFullscreen(rootRef);
  const hw = useHandwritingDoc(endpoint ?? `/api/admin/handwriting/${problemId}`, onLoaded);
  const [pageIndex, setPageIndex] = useState(0);
  const [prefs, setPrefs] = useState<ToolPrefs>(DEFAULT_PREFS);
  const [pencilOnly, setPencilOnly] = useState<'auto' | 'on' | 'off'>('auto');
  const [zoom, setZoom] = useState(1);
  const [selection, setSelection] = useState<{ count: number; rect: ScreenRect | null }>({ count: 0, rect: null });
  const [menu, setMenu] = useState<{ id: MenuId; anchor: HTMLElement } | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const onSaveStateRef = useRef(onSaveState);
  onSaveStateRef.current = onSaveState;
  useEffect(() => {
    onSaveStateRef.current?.({ ...hw.save, strokeCount: countStrokes(hw.doc) });
  }, [hw.save, hw.doc]);

  const idx = Math.min(pageIndex, hw.doc.pages.length - 1);
  const page = hw.doc.pages[idx];
  const loading = hw.save.status === 'loading';

  // Callbacks the engine holds on to: always read the latest state through refs.
  const live = useRef({ commit: hw.commit, docRef: hw.docRef, idx, pencilOnly });
  live.current = { commit: hw.commit, docRef: hw.docRef, idx, pencilOnly };

  // Preferences from this browser (after mount, so server and client markup match).
  useEffect(() => {
    setPrefs(readPrefs());
    try {
      const p = localStorage.getItem(PENCIL_ONLY_KEY);
      if (p === 'on' || p === 'off') setPencilOnly(p);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const engine = new HandwritingEngine(stage, {
      onCommit: (strokes) => {
        const { docRef, idx: i, commit } = live.current;
        const pages = docRef.current.pages.slice();
        pages[i] = { ...pages[i], strokes };
        commit({ ...docRef.current, pages });
      },
      onView: (v) => setZoom(v.scale),
      onSelection: (count, rect) => setSelection({ count, rect }),
      onPen: () => {
        if (live.current.pencilOnly !== 'auto') return;
        setPencilOnly('on');
        writeStorage(PENCIL_ONLY_KEY, 'on');
        setToast('Pencil detected: fingers now pan and zoom. Turn off “Pencil only” to draw with a finger.');
      },
    });
    engineRef.current = engine;
    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (page) engineRef.current?.setPage(page, views.current.get(page.id));
  }, [page]);

  const styleKey = styleKeyOf(prefs.tool);
  useEffect(() => {
    engineRef.current?.setTool({
      tool: prefs.tool,
      ...prefs[styleKey],
      shape: prefs.shapeKind,
      eraserMode: prefs.eraserMode,
      eraserSize: prefs.eraserSize,
    });
  }, [prefs, styleKey]);

  useEffect(() => {
    engineRef.current?.setPenOnly(pencilOnly === 'on');
  }, [pencilOnly]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(t);
  }, [toast]);

  const updatePrefs = useCallback((patch: (p: ToolPrefs) => ToolPrefs) => {
    setPrefs((prev) => {
      const next = patch(prev);
      writeStorage(PREFS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const selectTool = useCallback((tool: ToolId) => updatePrefs((p) => ({ ...p, tool })), [updatePrefs]);

  const setStyle = (patch: Partial<Style>) => {
    // With strokes selected, the palette recolours them instead.
    const engine = engineRef.current;
    if (engine?.hasSelection() && (patch.color || patch.opacity)) {
      engine.styleSelection(patch);
      if (patch.color) return;
    }
    updatePrefs((p) => ({ ...p, [styleKey]: { ...p[styleKey], ...patch } }));
  };

  const goToPage = (i: number) => {
    const engine = engineRef.current;
    if (engine && page) views.current.set(page.id, engine.getView());
    setPageIndex(Math.max(0, Math.min(i, hw.docRef.current.pages.length - 1)));
  };

  const addPage = () => {
    const d = hw.docRef.current;
    const pages = d.pages.slice();
    pages.splice(idx + 1, 0, emptyPage(newId(), page?.background ?? 'grid'));
    hw.commit({ ...d, pages });
    if (engineRef.current && page) views.current.set(page.id, engineRef.current.getView());
    setPageIndex(idx + 1);
  };

  const setBackground = (background: HwBackground) => {
    const d = hw.docRef.current;
    const pages = d.pages.slice();
    pages[idx] = { ...pages[idx], background };
    hw.commit({ ...d, pages });
  };

  const clearPage = () => {
    if (!page?.strokes.length) return;
    if (!window.confirm(`Clear everything on page ${idx + 1}? You can undo this.`)) return;
    const d = hw.docRef.current;
    const pages = d.pages.slice();
    pages[idx] = { ...pages[idx], strokes: [] };
    hw.commit({ ...d, pages });
  };

  const deletePage = () => {
    const d = hw.docRef.current;
    if (d.pages.length === 1) return clearPage();
    if (page?.strokes.length && !window.confirm(`Delete page ${idx + 1}? You can undo this.`)) return;
    hw.commit({ ...d, pages: d.pages.filter((_, i) => i !== idx) });
    setPageIndex(Math.max(0, idx - 1));
  };

  // Keyboard: undo/redo, delete selection, tool letters, zoom, Space to pan, Shift to snap.
  const { undo, redo } = hw;
  useEffect(() => {
    const typing = (t: EventTarget | null) =>
      t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
    const onDown = (e: KeyboardEvent) => {
      const engine = engineRef.current;
      if (!engine || typing(e.target)) return;
      const key = e.key.toLowerCase();
      if (e.metaKey || e.ctrlKey) {
        if (key === 'z') {
          e.preventDefault();
          if (e.shiftKey) redo();
          else undo();
        } else if (key === 'y') {
          e.preventDefault();
          redo();
        }
        return;
      }
      if (e.key === 'Shift') engine.setModifierKeys({ shift: true });
      if (e.key === ' ' && overStage.current) {
        e.preventDefault();
        if (!e.repeat) engine.setModifierKeys({ space: true });
        return;
      }
      if ((e.key === 'Delete' || e.key === 'Backspace') && engine.hasSelection()) {
        e.preventDefault();
        engine.deleteSelection();
        return;
      }
      if (e.key === 'Escape') engine.clearSelection();
      if (e.altKey) return;
      const tools: Record<string, ToolId> = { p: 'pen', h: 'highlighter', e: 'eraser', l: 'lasso', s: 'shape' };
      if (tools[key]) selectTool(tools[key]);
      else if (e.key === '+' || e.key === '=') engine.zoomBy(1.25);
      else if (e.key === '-' || e.key === '_') engine.zoomBy(0.8);
      else if (e.key === '0') engine.resetZoom();
    };
    const onUp = (e: KeyboardEvent) => {
      if (e.key === ' ') engineRef.current?.setModifierKeys({ space: false });
      if (e.key === 'Shift') engineRef.current?.setModifierKeys({ shift: false });
    };
    const onBlur = () => engineRef.current?.setModifierKeys({ space: false, shift: false });
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
      window.removeEventListener('blur', onBlur);
    };
  }, [undo, redo, selectTool]);

  const openMenu = (id: MenuId) => (e: React.MouseEvent<HTMLElement>) => {
    const anchor = e.currentTarget;
    setMenu((m) => (m?.id === id ? null : { id, anchor }));
  };
  const closeMenu = useCallback(() => setMenu(null), []);

  const onToolClick = (tool: ToolId) => (e: React.MouseEvent<HTMLButtonElement>) => {
    // Clicking the active tool again opens its options.
    if (prefs.tool === tool) {
      const menuFor: Partial<Record<ToolId, MenuId>> = { pen: 'style', highlighter: 'style', shape: 'shape', eraser: 'eraser' };
      const id = menuFor[tool];
      if (id) openMenu(id)(e);
      return;
    }
    selectTool(tool);
    setMenu(null);
  };

  const current = prefs[styleKey];
  const palette = styleKey === 'highlighter' ? HIGHLIGHT : INK;

  const toolbar = (
    <div
      role="toolbar"
      aria-label="Handwriting tools"
      className={
        fs.isFullscreen
          ? 'absolute top-2 left-1/2 -translate-x-1/2 z-20 flex items-center gap-0.5 max-w-[calc(100%-4.5rem)] overflow-x-auto rounded-2xl border border-gray-200 bg-white/95 shadow-lg p-1'
          : 'shrink-0 flex items-center gap-0.5 overflow-x-auto border-b border-gray-200 bg-white px-1.5 py-1'
      }
    >
      <ToolButton label="Pen (P)" active={prefs.tool === 'pen'} onClick={onToolClick('pen')} hasMenu>
        <PenIcon />
      </ToolButton>
      <ToolButton label="Highlighter (H)" active={prefs.tool === 'highlighter'} onClick={onToolClick('highlighter')} hasMenu>
        <HighlighterIcon />
      </ToolButton>
      <ToolButton
        label={`Eraser: ${prefs.eraserMode === 'pixel' ? 'pixel' : 'whole strokes'} (E)`}
        active={prefs.tool === 'eraser'}
        onClick={onToolClick('eraser')}
        hasMenu
      >
        <EraserIcon />
      </ToolButton>
      <ToolButton label="Lasso: select, move, delete (L)" active={prefs.tool === 'lasso'} onClick={onToolClick('lasso')}>
        <LassoIcon />
      </ToolButton>
      <ToolButton label="Shapes and straight lines (S)" active={prefs.tool === 'shape'} onClick={onToolClick('shape')} hasMenu>
        {SHAPE_ICON[prefs.shapeKind]}
      </ToolButton>
      <ToolButton label="Pan (or hold Space)" active={prefs.tool === 'hand'} onClick={onToolClick('hand')}>
        <HandIcon />
      </ToolButton>

      <Divider />
      <button
        type="button"
        onClick={openMenu('style')}
        title={`${STYLE_NAME[styleKey]} colour and size`}
        aria-label={`${STYLE_NAME[styleKey]} colour and size`}
        aria-expanded={menu?.id === 'style'}
        className="shrink-0 inline-flex items-center gap-1.5 h-9 px-2 rounded-lg hover:bg-gray-100"
      >
        <span
          className="block w-5 h-5 rounded-full border border-gray-300"
          style={{ backgroundColor: current.color, opacity: Math.max(0.35, current.opacity) }}
        />
        <span className="text-[11px] tabular-nums text-gray-500">{current.width}</span>
      </button>

      <Divider />
      <IconButton label="Undo (Ctrl+Z)" onClick={hw.undo} disabled={!hw.canUndo}>
        <UndoIcon />
      </IconButton>
      <IconButton label="Redo (Ctrl+Shift+Z)" onClick={hw.redo} disabled={!hw.canRedo}>
        <RedoIcon />
      </IconButton>
      <IconButton label="Clear page" onClick={clearPage} disabled={!page?.strokes.length}>
        <TrashIcon />
      </IconButton>

      <Divider />
      <IconButton
        label={pencilOnly === 'on' ? 'Pencil only is on: fingers pan and zoom' : 'Pencil only: fingers pan, the pencil writes'}
        active={pencilOnly === 'on'}
        onClick={() => {
          const next = pencilOnly === 'on' ? 'off' : 'on';
          setPencilOnly(next);
          writeStorage(PENCIL_ONLY_KEY, next);
        }}
      >
        <PencilOnlyIcon />
      </IconButton>

      {!fs.isFullscreen && <div className="flex-1 min-w-2" />}
      <SaveBadge state={hw.save} />
    </div>
  );

  return (
    <div
      ref={rootRef}
      className={`relative flex flex-col min-h-0 overflow-hidden bg-gray-100 ${
        fs.fallback ? 'fixed inset-0 z-[70] h-[100dvh] w-screen' : 'h-full w-full'
      }`}
    >
      {!fs.isFullscreen && toolbar}

      <div className="relative flex-1 min-h-0">
        <div
          ref={stageRef}
          className="absolute inset-0 overflow-hidden select-none"
          style={{ touchAction: 'none', WebkitUserSelect: 'none', WebkitTouchCallout: 'none', overscrollBehavior: 'contain' } as React.CSSProperties}
          onPointerEnter={() => (overStage.current = true)}
          onPointerLeave={() => (overStage.current = false)}
          role="application"
          aria-roledescription="drawing canvas"
          aria-label={`Handwriting canvas${label ? ` for ${label}` : ''}, page ${idx + 1} of ${hw.doc.pages.length}`}
        />

        {fs.isFullscreen && toolbar}
        {fs.isFullscreen && (
          <div className="absolute top-2 right-2 z-20">
            <IconButton label="Exit full screen" onClick={fs.exit} className="bg-white/95 border border-gray-200 shadow-lg">
              <ExitFullscreenIcon />
            </IconButton>
          </div>
        )}

        {selection.count > 0 && selection.rect && (
          <SelectionBar
            rect={selection.rect}
            count={selection.count}
            onDelete={() => engineRef.current?.deleteSelection()}
            onDone={() => engineRef.current?.clearSelection()}
          />
        )}

        {/* Pages */}
        <div className="absolute bottom-2 left-2 z-10 flex items-center gap-0.5 rounded-xl border border-gray-200 bg-white/95 shadow-sm p-0.5" role="toolbar" aria-label="Pages">
          <IconButton label="Previous page" onClick={() => goToPage(idx - 1)} disabled={idx === 0}>
            <ChevronLeftIcon />
          </IconButton>
          <span className="px-1 text-xs font-semibold tabular-nums text-gray-700" aria-live="polite">
            {idx + 1} / {hw.doc.pages.length}
          </span>
          <IconButton label="Next page" onClick={() => goToPage(idx + 1)} disabled={idx >= hw.doc.pages.length - 1}>
            <ChevronRightIcon />
          </IconButton>
          <IconButton label="Add a page after this one" onClick={addPage}>
            <PlusIcon />
          </IconButton>
          <IconButton label="Page options" onClick={openMenu('page')} aria-expanded={menu?.id === 'page'}>
            <MoreIcon />
          </IconButton>
        </div>

        <ZoomBar
          className="absolute bottom-2 right-2 z-10"
          zoom={zoom}
          onZoomIn={() => engineRef.current?.zoomBy(1.25)}
          onZoomOut={() => engineRef.current?.zoomBy(0.8)}
          onFit={() => engineRef.current?.fit()}
          onReset={() => engineRef.current?.resetZoom()}
          fullscreen={fs.isFullscreen}
          onToggleFullscreen={fs.toggle}
        />

        {hw.save.status === 'conflict' && (
          <div role="alert" className="absolute top-2 left-2 right-2 z-30 mx-auto max-w-lg rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 shadow">
            <p className="font-semibold">This solution was changed in another tab or device{hw.save.conflictAt ? ` (${new Date(hw.save.conflictAt).toLocaleTimeString()})` : ''}.</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button type="button" className="rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-semibold text-on-ink" onClick={() => void hw.resolveConflict('mine')}>
                Keep this version
              </button>
              <button type="button" className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700" onClick={() => void hw.resolveConflict('theirs')}>
                Load the other version
              </button>
            </div>
          </div>
        )}

        {(loading || hw.loadError) && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-white/70" role={hw.loadError ? 'alert' : 'status'}>
            {hw.loadError ? (
              <div className="rounded-xl border border-red-200 bg-white p-4 text-center text-sm shadow">
                <p className="text-red-700">{hw.loadError}</p>
                <button type="button" onClick={() => void hw.reload()} className="mt-2 rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-semibold text-on-ink">
                  Try again
                </button>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Loading handwriting…</p>
            )}
          </div>
        )}

        {toast && (
          <div role="status" className="absolute bottom-14 left-1/2 z-30 w-[min(28rem,calc(100%-1rem))] -translate-x-1/2 rounded-xl bg-gray-900 px-3 py-2 text-xs text-on-ink shadow-lg">
            {toast}
          </div>
        )}
      </div>

      {menu?.id === 'style' && (
        <Popover anchor={menu.anchor} onClose={closeMenu} label={`${STYLE_NAME[styleKey]} colour and size`}>
          <div className="w-60 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              {STYLE_NAME[styleKey]}
              {selection.count > 0 && <span className="normal-case font-normal"> · colour applies to {selection.count} selected</span>}
            </p>
            <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Colour">
              {palette.map((c) => (
                <button
                  key={c}
                  type="button"
                  role="radio"
                  aria-checked={current.color === c}
                  aria-label={c}
                  title={c}
                  onClick={() => setStyle({ color: c })}
                  className={`w-7 h-7 rounded-full border ${current.color === c ? 'ring-2 ring-offset-2 ring-gray-900 border-transparent' : 'border-gray-300'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
              <label className="relative w-7 h-7 rounded-full border border-dashed border-gray-400 overflow-hidden cursor-pointer" title="Custom colour">
                <span className="sr-only">Custom colour</span>
                <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">+</span>
                <input
                  type="color"
                  value={current.color}
                  onChange={(e) => setStyle({ color: e.target.value })}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </label>
            </div>
            <Slider
              label="Size"
              min={WIDTH_RANGE[styleKey][0]}
              max={WIDTH_RANGE[styleKey][1]}
              step={0.5}
              value={current.width}
              display={`${current.width}`}
              onChange={(width) => setStyle({ width })}
            />
            <Slider
              label="Opacity"
              min={10}
              max={100}
              step={5}
              value={Math.round(current.opacity * 100)}
              display={`${Math.round(current.opacity * 100)}%`}
              onChange={(v) => setStyle({ opacity: v / 100 })}
            />
            <svg viewBox="0 0 220 30" className="w-full h-8 rounded-md border border-gray-200" style={{ backgroundColor: '#ffffff' }} aria-hidden="true">
              <path
                d="M10 20 C 60 0, 100 30, 150 12 S 200 16, 210 10"
                fill="none"
                stroke={current.color}
                strokeOpacity={current.opacity}
                strokeWidth={Math.min(current.width, 26)}
                strokeLinecap="round"
              />
            </svg>
          </div>
        </Popover>
      )}

      {menu?.id === 'eraser' && (
        <Popover anchor={menu.anchor} onClose={closeMenu} label="Eraser options">
          <div className="w-56 space-y-3">
            <Segmented
              label="Eraser"
              value={prefs.eraserMode}
              options={[
                ['stroke', 'Whole strokes'],
                ['pixel', 'Pixel'],
              ]}
              onChange={(eraserMode) => updatePrefs((p) => ({ ...p, eraserMode: eraserMode as EraserMode }))}
            />
            <Slider
              label="Size"
              min={4}
              max={40}
              step={1}
              value={prefs.eraserSize}
              display={`${prefs.eraserSize}`}
              onChange={(eraserSize) => updatePrefs((p) => ({ ...p, eraserSize }))}
            />
          </div>
        </Popover>
      )}

      {menu?.id === 'shape' && (
        <Popover anchor={menu.anchor} onClose={closeMenu} label="Shape">
          <div className="w-56 space-y-2">
            <div className="flex gap-1">
              {(['line', 'arrow', 'rect', 'ellipse'] as ShapeKind[]).map((k) => (
                <IconButton
                  key={k}
                  label={{ line: 'Straight line', arrow: 'Arrow', rect: 'Rectangle', ellipse: 'Ellipse' }[k]}
                  active={prefs.shapeKind === k}
                  onClick={() => {
                    updatePrefs((p) => ({ ...p, shapeKind: k, tool: 'shape' }));
                    closeMenu();
                  }}
                >
                  {SHAPE_ICON[k]}
                </IconButton>
              ))}
            </div>
            <p className="text-xs text-gray-500">Hold Shift for 15° angles and squares/circles.</p>
          </div>
        </Popover>
      )}

      {menu?.id === 'page' && (
        <Popover anchor={menu.anchor} onClose={closeMenu} label="Page options" placement="above">
          <div className="w-56 space-y-3">
            <Segmented
              label="Background"
              value={page?.background ?? 'grid'}
              options={[
                ['blank', 'Blank'],
                ['grid', 'Grid'],
                ['lined', 'Lined'],
              ]}
              onChange={(bg) => setBackground(bg as HwBackground)}
            />
            <button
              type="button"
              onClick={() => {
                closeMenu();
                deletePage();
              }}
              className="w-full rounded-lg border border-red-200 px-3 py-1.5 text-left text-xs font-semibold text-red-700 hover:bg-red-50"
            >
              {hw.doc.pages.length > 1 ? `Delete page ${idx + 1}` : 'Clear this page'}
            </button>
          </div>
        </Popover>
      )}
    </div>
  );
}

function ToolButton({
  label,
  active,
  onClick,
  hasMenu = false,
  children,
}: {
  label: string;
  active: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  hasMenu?: boolean;
  children: ReactNode;
}) {
  return (
    <IconButton label={label} active={active} onClick={onClick} className="relative">
      {children}
      {hasMenu && active && (
        <span aria-hidden="true" className="absolute bottom-1 right-1 border-[3px] border-transparent border-b-current border-r-current opacity-70" />
      )}
    </IconButton>
  );
}

function Divider() {
  return <span aria-hidden="true" className="mx-1 h-6 w-px shrink-0 bg-gray-200" />;
}

function Slider({
  label,
  min,
  max,
  step,
  value,
  display,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  display: string;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <span className="flex justify-between text-xs text-gray-600">
        <span>{label}</span>
        <span className="tabular-nums">{display}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 w-full accent-gray-900"
      />
    </label>
  );
}

function Segmented({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: [string, string][];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <p className="mb-1 text-xs text-gray-600">{label}</p>
      <div className="flex rounded-lg border border-gray-200 p-0.5" role="radiogroup" aria-label={label}>
        {options.map(([v, text]) => (
          <button
            key={v}
            type="button"
            role="radio"
            aria-checked={value === v}
            onClick={() => onChange(v)}
            className={`flex-1 rounded-md px-2 py-1 text-xs font-semibold ${value === v ? 'bg-gray-900 text-on-ink' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}

function SelectionBar({ rect, count, onDelete, onDone }: { rect: ScreenRect; count: number; onDelete: () => void; onDone: () => void }) {
  const top = Math.max(8, rect.y - 52);
  const left = Math.max(8, rect.x - 6);
  return (
    <div
      className="absolute z-20 flex items-center gap-1 rounded-xl border border-gray-200 bg-white/95 p-1 shadow-lg"
      style={{ top, left }}
      role="toolbar"
      aria-label="Selection"
    >
      <span className="px-1.5 text-xs text-gray-600">{count} selected · drag to move</span>
      <IconButton label="Delete selection" onClick={onDelete}>
        <TrashIcon />
      </IconButton>
      <IconButton label="Done" onClick={onDone}>
        <CloseIcon />
      </IconButton>
    </div>
  );
}

function SaveBadge({ state }: { state: SaveState }) {
  const { status } = state;
  const text =
    status === 'loading'
      ? 'Loading…'
      : status === 'saved'
        ? 'Saved'
        : status === 'unsaved' || status === 'saving'
          ? 'Saving…'
          : status === 'conflict'
            ? 'Not saved'
            : state.message || 'Not saved';
  const tone = status === 'error' || status === 'conflict' ? 'text-red-700' : status === 'saved' ? 'text-green-700' : 'text-gray-500';
  const title =
    status === 'saved' && state.savedAt ? `Saved at ${new Date(state.savedAt).toLocaleTimeString()}` : status === 'error' ? state.message : undefined;
  return (
    <span role="status" aria-live="polite" title={title} className={`shrink-0 inline-flex items-center gap-1 px-2 text-xs font-semibold whitespace-nowrap ${tone}`}>
      {status === 'saved' && <CheckIcon width={14} height={14} />}
      {text}
    </span>
  );
}
