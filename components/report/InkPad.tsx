'use client';

/**
 * A pen pad: write with a stylus (pressure-sensitive), a finger or a mouse.
 * Records strokes as data (lib/reports/ink.ts) rather than pixels, so the
 * note stays sharp on the report and in the PDF.
 *
 * Tablet details:
 * - `touch-action: none` so writing never scrolls the page;
 * - palm rejection: once a stylus has touched the pad, finger touches are
 *   ignored (a toggle lets fingers write again);
 * - coalesced pointer events for smooth, fast handwriting;
 * - "Full screen" gives a large writing surface; "Done" brings it back.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { INK_COLORS, PEN_SIZES, inkPaths, outlineToPath, type Ink, type InkColor, type InkStroke } from '@/lib/reports/ink';
import { getStroke } from 'perfect-freehand';

const SIZE_LABEL = ['Fine', 'Medium', 'Bold'] as const;
const COLOR_LABEL: Record<InkColor, string> = { blue: 'Blue ink', black: 'Black', red: 'Red', green: 'Green' };

function livePath(st: InkStroke): string {
  const pts: number[][] = [];
  for (let i = 0; i < st.p.length; i += 3) pts.push([st.p[i], st.p[i + 1], st.pen ? st.p[i + 2] : 0.5]);
  return outlineToPath(
    getStroke(pts, { size: st.s, thinning: st.pen ? 0.65 : 0.5, smoothing: 0.5, streamline: 0.45, simulatePressure: !st.pen, last: false })
  );
}

export function InkPad({
  value,
  onChange,
  pad,
  variant,
  label,
  defaultColor = 'blue',
}: {
  value: Ink | null;
  onChange: (ink: Ink | null) => void;
  pad: { w: number; h: number };
  variant: 'note' | 'signature';
  label: string;
  defaultColor?: InkColor;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [color, setColor] = useState<InkColor>(defaultColor);
  const [size, setSize] = useState<number>(variant === 'signature' ? PEN_SIZES[1] : PEN_SIZES[0]);
  const [active, setActive] = useState<InkStroke | null>(null);
  const activeRef = useRef<InkStroke | null>(null);
  const pointerRef = useRef<number | null>(null);
  const [penSeen, setPenSeen] = useState(false);
  const [fingers, setFingers] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [redo, setRedo] = useState<InkStroke[]>([]);

  const strokes = useMemo(() => value?.strokes ?? [], [value]);
  const paths = useMemo(() => (value ? inkPaths(value) : []), [value]);

  const commit = useCallback(
    (next: InkStroke[]) => onChange(next.length ? { v: 1, w: pad.w, h: pad.h, strokes: next } : null),
    [onChange, pad.h, pad.w]
  );

  const toPad = (e: { clientX: number; clientY: number }) => {
    const rect = svgRef.current!.getBoundingClientRect();
    return [((e.clientX - rect.left) / rect.width) * pad.w, ((e.clientY - rect.top) / rect.height) * pad.h];
  };

  const allowed = (e: React.PointerEvent) => {
    if (e.pointerType === 'pen') return true;
    if (e.pointerType === 'touch') return fingers && !penSeen;
    return e.button === 0;
  };

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (e.pointerType === 'pen' && !penSeen) {
      setPenSeen(true);
      setFingers(false);
    }
    if (pointerRef.current !== null || !allowed(e)) return;
    e.preventDefault();
    svgRef.current?.setPointerCapture(e.pointerId);
    pointerRef.current = e.pointerId;
    const [x, y] = toPad(e);
    const st: InkStroke = { c: color, s: size, pen: e.pointerType === 'pen', p: [x, y, e.pointerType === 'pen' ? e.pressure || 0.5 : 0.5] };
    activeRef.current = st;
    setActive({ ...st });
  };

  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (pointerRef.current !== e.pointerId || !activeRef.current) return;
    e.preventDefault();
    const native = e.nativeEvent as PointerEvent;
    const events = typeof native.getCoalescedEvents === 'function' ? native.getCoalescedEvents() : [];
    const list = events.length ? events : [native];
    const st = activeRef.current;
    for (const ev of list) {
      const [x, y] = toPad(ev);
      st.p.push(x, y, st.pen ? ev.pressure || 0.5 : 0.5);
    }
    setActive({ ...st, p: st.p.slice() });
  };

  const finish = (e: React.PointerEvent<SVGSVGElement>) => {
    if (pointerRef.current !== e.pointerId) return;
    pointerRef.current = null;
    const st = activeRef.current;
    activeRef.current = null;
    setActive(null);
    if (st) {
      const rounded = { ...st, p: st.p.map((n, i) => (i % 3 === 2 ? Math.round(n * 100) / 100 : Math.round(n * 10) / 10)) };
      commit([...strokes, rounded]);
      setRedo([]);
    }
  };

  const undo = () => {
    if (!strokes.length) return;
    setRedo((r) => [...r, strokes[strokes.length - 1]]);
    commit(strokes.slice(0, -1));
  };
  const redoOne = () => {
    if (!redo.length) return;
    commit([...strokes, redo[redo.length - 1]]);
    setRedo((r) => r.slice(0, -1));
  };
  const clear = () => {
    if (!strokes.length) return;
    if (variant === 'note' && strokes.length > 5 && !window.confirm('Clear the whole handwritten note?')) return;
    setRedo([]);
    commit([]);
  };

  // Full screen: Escape closes it, and the page behind must not scroll.
  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpanded(false);
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [expanded]);

  const lineGap = 56;
  const btn =
    'inline-flex min-h-[36px] items-center justify-center rounded-md border border-gray-200 bg-white px-2.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40';

  const toolbar = (
    <div className="flex flex-wrap items-center gap-1.5">
      <div className="flex items-center gap-1" role="radiogroup" aria-label="Ink colour">
        {(Object.keys(INK_COLORS) as InkColor[]).map((c) => (
          <button
            key={c}
            type="button"
            role="radio"
            aria-checked={color === c}
            aria-label={COLOR_LABEL[c]}
            title={COLOR_LABEL[c]}
            onClick={() => setColor(c)}
            className={`h-8 w-8 rounded-full border-2 ${color === c ? 'border-gray-900' : 'border-transparent'}`}
          >
            <span className="mx-auto block h-5 w-5 rounded-full" style={{ background: INK_COLORS[c] }} />
          </button>
        ))}
      </div>
      <div className="flex items-center gap-1" role="radiogroup" aria-label="Pen size">
        {PEN_SIZES.map((s, i) => (
          <button
            key={s}
            type="button"
            role="radio"
            aria-checked={size === s}
            title={SIZE_LABEL[i]}
            aria-label={SIZE_LABEL[i]}
            onClick={() => setSize(s)}
            className={`${btn} w-9 ${size === s ? 'ring-2 ring-gray-900' : ''}`}
          >
            <span className="block rounded-full bg-gray-800" style={{ width: 4 + i * 3, height: 4 + i * 3 }} />
          </button>
        ))}
      </div>
      <button type="button" onClick={undo} disabled={!strokes.length} className={btn} title="Undo the last stroke">
        ↶ Undo
      </button>
      <button type="button" onClick={redoOne} disabled={!redo.length} className={btn} title="Redo">
        ↷ Redo
      </button>
      <button type="button" onClick={clear} disabled={!strokes.length} className={btn}>
        Clear
      </button>
      {penSeen && (
        <label className="ml-1 inline-flex items-center gap-1.5 text-xs text-gray-600">
          <input type="checkbox" checked={fingers} onChange={(e) => setFingers(e.target.checked)} className="h-4 w-4" />
          Let fingers write too
        </label>
      )}
      <button type="button" onClick={() => setExpanded((x) => !x)} className={`${btn} ml-auto`}>
        {expanded ? '✓ Done' : '⤢ Full screen'}
      </button>
    </div>
  );

  const surface = (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${pad.w} ${pad.h}`}
      role="img"
      aria-label={`${label} pad — write here with your pen`}
      className={`block w-full select-none rounded-lg border border-gray-300 ${variant === 'note' ? 'bg-[#fffdf5]' : 'bg-white'} cursor-crosshair`}
      style={{ touchAction: 'none', aspectRatio: `${pad.w} / ${pad.h}`, ...(expanded ? { maxHeight: 'calc(100dvh - 9rem)', width: 'auto', maxWidth: '100%', margin: '0 auto' } : {}) }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={finish}
      onPointerCancel={finish}
      onContextMenu={(e) => e.preventDefault()}
    >
      {variant === 'note' ? (
        <g aria-hidden>
          {Array.from({ length: Math.floor(pad.h / lineGap) }, (_, i) => (
            <line key={i} x1={0} x2={pad.w} y1={(i + 1) * lineGap} y2={(i + 1) * lineGap} stroke="#e6e0cc" strokeWidth={1.2} />
          ))}
          <line x1={60} x2={60} y1={0} y2={pad.h} stroke="#f3c6c6" strokeWidth={1.2} />
        </g>
      ) : (
        <g aria-hidden>
          <line x1={30} x2={pad.w - 30} y1={pad.h - 50} y2={pad.h - 50} stroke="#cbd5e1" strokeWidth={1.5} strokeDasharray="6 6" />
          <text x={32} y={pad.h - 60} fontSize={28} fill="#cbd5e1">
            ✕
          </text>
        </g>
      )}
      {!strokes.length && !active && (
        <text x={pad.w / 2} y={variant === 'note' ? pad.h / 2 : pad.h / 2 - 10} textAnchor="middle" fontSize={variant === 'note' ? 26 : 22} fill="#b8b2a0" aria-hidden>
          {variant === 'note' ? 'Write your note here with your pen ✍️' : 'Sign here'}
        </text>
      )}
      {paths.map((p, i) => (
        <path key={i} d={p.d} fill={p.fill} />
      ))}
      {active && <path d={livePath(active)} fill={INK_COLORS[active.c]} />}
    </svg>
  );

  const hint =
    penSeen && !fingers ? 'Pen detected — finger and palm touches are ignored.' : 'Works with a stylus (pressure-sensitive), a finger or a mouse.';

  if (expanded) {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col gap-3 bg-white p-3 sm:p-5" role="dialog" aria-modal="true" aria-label={label}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-800">{label}</h3>
          <span className="text-xs text-gray-500">{hint}</span>
        </div>
        {toolbar}
        <div className="flex flex-1 items-start justify-center overflow-hidden">{surface}</div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {toolbar}
      {surface}
      <p className="text-[11px] text-gray-400">{hint}</p>
    </div>
  );
}
