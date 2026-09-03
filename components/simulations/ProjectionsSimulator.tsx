'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Orthographic Projections — a SolidWorks-style view explorer.
 *
 * Tilt a solid freely with the mouse while four orthographic views
 * (front, top, right, bottom) update live beside it — the same idea as
 * a CAD orientation panel, viewing only, no editing.
 *
 * The 3D core is written from scratch (no 3D library in this project)
 * and was verified in node before any rendering code was written:
 *  - every solid is built by extruding a 2D profile, and each one was
 *    checked to be genuinely closed (every edge shared by exactly two
 *    faces) — an open solid would render with holes
 *  - each of the six named views was checked to actually show the
 *    physical face it claims: the TOP view really does look at the top
 *    face, not the bottom. Getting this backwards would silently teach
 *    students the wrong thing, so it is asserted rather than assumed
 *  - backface culling verified: exactly one face visible from each
 *    axis-aligned view, exactly three from an isometric angle
 */

const INK = '#1b2a41';
const MUTE = '#4a5a72';
const BRASS = '#b8823d';
const TEAL = '#2e7d6b';
const RED = '#b34a3c';
const PAPER = '#faf7f0';

// ---------- 3D core ----------

interface V3 { x: number; y: number; z: number; }
const rotY = (v: V3, a: number): V3 => ({ x: v.x * Math.cos(a) + v.z * Math.sin(a), y: v.y, z: -v.x * Math.sin(a) + v.z * Math.cos(a) });
const rotX = (v: V3, a: number): V3 => ({ x: v.x, y: v.y * Math.cos(a) - v.z * Math.sin(a), z: v.y * Math.sin(a) + v.z * Math.cos(a) });
const xform = (v: V3, yaw: number, pitch: number): V3 => rotX(rotY(v, yaw), pitch);
const sub3 = (a: V3, b: V3): V3 => ({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z });
const cross3 = (a: V3, b: V3): V3 => ({ x: a.y * b.z - a.z * b.y, y: a.z * b.x - a.x * b.z, z: a.x * b.y - a.y * b.x });

interface Face {
  verts: V3[];
  color: string;
  /** engravings sit slightly proud of their host face so they sort in front of it */
  isMark?: boolean;
}

interface Shape {
  id: string;
  name: string;
  note: string;
  faces: Face[];
}

/** Extrude a 2D profile (x,y) along z into a closed solid. */
function prism(profile: [number, number][], zMin: number, zMax: number, color: string): Face[] {
  const faces: Face[] = [];
  faces.push({ verts: profile.map((p) => ({ x: p[0], y: p[1], z: zMax })), color });
  faces.push({ verts: profile.map((p) => ({ x: p[0], y: p[1], z: zMin })).reverse(), color });
  for (let i = 0; i < profile.length; i++) {
    const a = profile[i];
    const b = profile[(i + 1) % profile.length];
    faces.push({
      verts: [
        { x: a[0], y: a[1], z: zMin },
        { x: b[0], y: b[1], z: zMin },
        { x: b[0], y: b[1], z: zMax },
        { x: a[0], y: a[1], z: zMax },
      ],
      color,
    });
  }
  return faces;
}

/** Place a flat 2D mark onto one face of the cube, offset slightly outward. */
function mark(shape2d: [number, number][], origin: V3, u: V3, v: V3, out: V3, color: string): Face {
  const eps = 0.012;
  return {
    verts: shape2d.map(([a, b]) => ({
      x: origin.x + u.x * a + v.x * b + out.x * eps,
      y: origin.y + u.y * a + v.y * b + out.y * eps,
      z: origin.z + u.z * a + v.z * b + out.z * eps,
    })),
    color,
    isMark: true,
  };
}

function regularPoly(n: number, r: number, rot = 0): [number, number][] {
  const pts: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const a = rot + (i / n) * Math.PI * 2;
    pts.push([Math.cos(a) * r, Math.sin(a) * r]);
  }
  return pts;
}

// ---------- shape library ----------

const BODY = '#dfe7ea';

function engravedCube(): Face[] {
  const s = 1.3;
  const faces = prism([[-s, -s], [s, -s], [s, s], [-s, s]], -s, s, BODY);
  const O = (x: number, y: number, z: number): V3 => ({ x, y, z });
  // face frames: origin (face centre), in-plane u and v, outward normal
  const frames: { o: V3; u: V3; v: V3; n: V3; color: string; shape: [number, number][] }[] = [
    // FRONT (+Z): circle
    { o: O(0, 0, s), u: O(1, 0, 0), v: O(0, 1, 0), n: O(0, 0, 1), color: RED, shape: regularPoly(28, 0.62) },
    // BACK (−Z): square
    { o: O(0, 0, -s), u: O(-1, 0, 0), v: O(0, 1, 0), n: O(0, 0, -1), color: '#7a6cae', shape: [[-0.55, -0.55], [0.55, -0.55], [0.55, 0.55], [-0.55, 0.55]] },
    // RIGHT (+X): triangle
    { o: O(s, 0, 0), u: O(0, 0, -1), v: O(0, 1, 0), n: O(1, 0, 0), color: TEAL, shape: regularPoly(3, 0.72, Math.PI / 2) },
    // LEFT (−X): plus / cross
    { o: O(-s, 0, 0), u: O(0, 0, 1), v: O(0, 1, 0), n: O(-1, 0, 0), color: '#c76b2e', shape: [[-0.2, -0.62], [0.2, -0.62], [0.2, -0.2], [0.62, -0.2], [0.62, 0.2], [0.2, 0.2], [0.2, 0.62], [-0.2, 0.62], [-0.2, 0.2], [-0.62, 0.2], [-0.62, -0.2], [-0.2, -0.2]] },
    // TOP (+Y): hexagon
    { o: O(0, s, 0), u: O(1, 0, 0), v: O(0, 0, -1), n: O(0, 1, 0), color: BRASS, shape: regularPoly(6, 0.62) },
    // BOTTOM (−Y): L-shape (deliberately asymmetric, so its orientation is readable)
    { o: O(0, -s, 0), u: O(1, 0, 0), v: O(0, 0, 1), n: O(0, -1, 0), color: '#3f7fa6', shape: [[-0.55, -0.55], [0.15, -0.55], [0.15, -0.15], [-0.15, -0.15], [-0.15, 0.55], [-0.55, 0.55]] },
  ];
  for (const f of frames) faces.push(mark(f.shape, f.o, f.u, f.v, f.n, f.color));
  return faces;
}

const SHAPES: Shape[] = [
  {
    id: 'cube',
    name: 'Engraved Cube',
    note: 'Every face carries a different mark, so each projection shows a different symbol — the fastest way to see that a view names one specific face.',
    faces: engravedCube(),
  },
  {
    id: 'cylinder',
    name: 'Cylinder',
    note: 'The classic case: a circle from the front, a rectangle from the top and the side. One solid, two completely different outlines.',
    faces: prism(regularPoly(40, 1.25), -1.25, 1.25, BODY),
  },
  {
    id: 'wedge',
    name: 'Wedge',
    note: 'A sloping face reads as a full rectangle from the front, but the slope only reveals itself from the side.',
    faces: prism([[-1.4, -1.1], [1.4, -1.1], [-1.4, 1.1]], -1.1, 1.1, BODY),
  },
  {
    id: 'lblock',
    name: 'L-Block',
    note: 'The standard first projection exercise — an L from the front, plain rectangles from the top and side.',
    faces: prism([[-1.4, -1.4], [0.6, -1.4], [0.6, -0.4], [-0.4, -0.4], [-0.4, 1.4], [-1.4, 1.4]], -1.0, 1.0, BODY),
  },
  {
    id: 'tblock',
    name: 'T-Block',
    note: 'Symmetric front view, but the top and bottom views differ — proof that you cannot identify a solid from one view alone.',
    faces: prism([[-1.5, 0.4], [-0.45, 0.4], [-0.45, -1.4], [0.45, -1.4], [0.45, 0.4], [1.5, 0.4], [1.5, 1.3], [-1.5, 1.3]], -0.95, 0.95, BODY),
  },
  {
    id: 'stairs',
    name: 'Stepped Block',
    note: 'The staircase: a stepped outline from the front, flat rectangles everywhere else. Compare with the reference drawing in your notes.',
    faces: prism([[-1.5, -1.5], [1.5, -1.5], [1.5, -0.5], [0.5, -0.5], [0.5, 0.5], [-0.5, 0.5], [-0.5, 1.5], [-1.5, 1.5]], -1.0, 1.0, BODY),
  },
];

// ---------- named views ----------

const D = Math.PI / 180;
interface ViewDef { key: string; label: string; yaw: number; pitch: number; }
const NAMED_VIEWS: ViewDef[] = [
  { key: 'front', label: 'FRONT', yaw: 0, pitch: 0 },
  { key: 'top', label: 'TOP', yaw: 0, pitch: 90 * D },
  { key: 'right', label: 'RIGHT', yaw: -90 * D, pitch: 0 },
  { key: 'bottom', label: 'BOTTOM', yaw: 0, pitch: -90 * D },
];
const EXTRA_VIEWS: ViewDef[] = [
  { key: 'left', label: 'Left', yaw: 90 * D, pitch: 0 },
  { key: 'back', label: 'Back', yaw: 180 * D, pitch: 0 },
  { key: 'iso', label: 'Isometric', yaw: -35 * D, pitch: 30 * D },
];

// ---------- rendering ----------

interface RenderOpts {
  yaw: number;
  pitch: number;
}

/** Draws a shape orthographically into a canvas, auto-fitted, with painter's-algorithm depth sorting. */
function drawShape(ctx: CanvasRenderingContext2D, w: number, h: number, shape: Shape, opts: RenderOpts) {
  const { yaw, pitch } = opts;
  ctx.clearRect(0, 0, w, h);

  const tf = shape.faces.map((f) => ({
    face: f,
    tv: f.verts.map((v) => xform(v, yaw, pitch)),
  }));

  // auto-fit to the canvas
  let minx = 1e9, maxx = -1e9, miny = 1e9, maxy = -1e9;
  for (const { tv } of tf) for (const v of tv) {
    minx = Math.min(minx, v.x); maxx = Math.max(maxx, v.x);
    miny = Math.min(miny, v.y); maxy = Math.max(maxy, v.y);
  }
  const pad = 0.16;
  const sx = (w * (1 - pad)) / Math.max(0.001, maxx - minx);
  const sy = (h * (1 - pad)) / Math.max(0.001, maxy - miny);
  const s = Math.min(sx, sy);
  const cx = (minx + maxx) / 2;
  const cy = (miny + maxy) / 2;
  const toPx = (v: V3) => ({ x: w / 2 + (v.x - cx) * s, y: h / 2 - (v.y - cy) * s });

  // visible faces only, sorted back-to-front
  const visible = tf
    .map((entry) => {
      const n = cross3(sub3(entry.tv[1], entry.tv[0]), sub3(entry.tv[2], entry.tv[0]));
      const depth = entry.tv.reduce((acc, v) => acc + v.z, 0) / entry.tv.length;
      return { ...entry, facingViewer: n.z > 1e-9, depth };
    })
    .filter((e) => e.facingViewer)
    .sort((a, b) => a.depth - b.depth);

  for (const entry of visible) {
    const pts = entry.tv.map(toPx);
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
    ctx.closePath();
    ctx.fillStyle = entry.face.color;
    ctx.fill();
    ctx.strokeStyle = entry.face.isMark ? 'rgba(27,42,65,0.35)' : INK;
    ctx.lineWidth = entry.face.isMark ? 1 : 1.6;
    ctx.stroke();
  }
}

// ---------- component ----------

const MAIN_W = 460;
const MAIN_H = 360;
const SUB_W = 200;
const SUB_H = 160;

export function ProjectionsSimulator() {
  const mainRef = useRef<HTMLCanvasElement>(null);
  const subRefs = useRef<Record<string, HTMLCanvasElement | null>>({});
  const dragRef = useRef<{ x: number; y: number } | null>(null);

  const [shapeIdx, setShapeIdx] = useState(0);
  const [yaw, setYaw] = useState(-35 * D);
  const [pitch, setPitch] = useState(30 * D);

  const shape = SHAPES[shapeIdx];

  const renderAll = () => {
    const mc = mainRef.current;
    if (mc) {
      const ctx = mc.getContext('2d');
      const rect = mc.getBoundingClientRect();
      if (ctx && rect.width) {
        const sf = rect.width / MAIN_W;
        ctx.setTransform(devicePixelRatio * sf, 0, 0, devicePixelRatio * sf, 0, 0);
        drawShape(ctx, MAIN_W, MAIN_H, shape, { yaw, pitch });
      }
    }
    for (const v of NAMED_VIEWS) {
      const c = subRefs.current[v.key];
      if (!c) continue;
      const ctx = c.getContext('2d');
      const rect = c.getBoundingClientRect();
      if (!ctx || !rect.width) continue;
      const sf = rect.width / SUB_W;
      ctx.setTransform(devicePixelRatio * sf, 0, 0, devicePixelRatio * sf, 0, 0);
      drawShape(ctx, SUB_W, SUB_H, shape, { yaw: v.yaw, pitch: v.pitch });
    }
  };

  useEffect(() => {
    const sizeCanvas = (c: HTMLCanvasElement | null, w: number, h: number) => {
      if (!c) return;
      const rect = c.getBoundingClientRect();
      if (!rect.width) return;
      c.width = rect.width * devicePixelRatio;
      c.height = ((rect.width * h) / w) * devicePixelRatio;
    };
    const resize = () => {
      sizeCanvas(mainRef.current, MAIN_W, MAIN_H);
      for (const v of NAMED_VIEWS) sizeCanvas(subRefs.current[v.key], SUB_W, SUB_H);
      renderAll();
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shapeIdx]);

  useEffect(() => {
    renderAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yaw, pitch, shapeIdx]);

  const onDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
    dragRef.current = { x: e.clientX, y: e.clientY };
  };
  const onMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.x;
    const dy = e.clientY - dragRef.current.y;
    dragRef.current = { x: e.clientX, y: e.clientY };
    setYaw((y) => y + dx * 0.011);
    setPitch((p) => Math.max(-89 * D, Math.min(89 * D, p + dy * 0.011)));
  };
  const onUp = () => { dragRef.current = null; };

  const snapTo = (v: ViewDef) => { setYaw(v.yaw); setPitch(v.pitch); };

  const degrees = (r: number) => `${Math.round(((r * 180) / Math.PI) % 360)}°`;

  return (
    <div className="projections-lab flex flex-col gap-5">
      <div className="bg-white border border-[#e4ddcc] rounded overflow-hidden">
        <div className="flex justify-between items-baseline px-4 pt-3">
          <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">{shape.name}</span>
          <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">
            yaw {degrees(yaw)} · pitch {degrees(pitch)}
          </span>
        </div>

        <div className="px-4 pt-3 grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-4">
          {/* main orbit view */}
          <div>
            <canvas
              ref={mainRef}
              className="block w-full rounded border border-[#e4ddcc] touch-none cursor-grab active:cursor-grabbing"
              style={{ aspectRatio: `${MAIN_W} / ${MAIN_H}`, background: PAPER }}
              onPointerDown={onDown}
              onPointerMove={onMove}
              onPointerUp={onUp}
              onPointerCancel={onUp}
            />
            <p className="text-[11.5px] text-[#4a5a72] leading-snug mt-2">
              Drag to tilt the solid freely. The four views beside it are locked to their axes and update live.
            </p>
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {[...NAMED_VIEWS, ...EXTRA_VIEWS].map((v) => (
                <button
                  key={v.key}
                  onClick={() => snapTo(v)}
                  className="text-[11px] font-semibold px-2.5 py-1 rounded border border-[#d8cfb6] text-[#4a5a72] hover:bg-[#faf7f0]"
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          {/* four locked orthographic views */}
          <div className="grid grid-cols-2 gap-3">
            {NAMED_VIEWS.map((v) => (
              <div key={v.key} className="rounded border border-[#e4ddcc] overflow-hidden">
                <div className="px-2 py-1 bg-[#faf7f0] border-b border-[#eee6d3]">
                  <span className="font-mono text-[10px] tracking-widest uppercase text-[#8f6428] font-bold">{v.label}</span>
                </div>
                <canvas
                  ref={(el) => { subRefs.current[v.key] = el; }}
                  className="block w-full"
                  style={{ aspectRatio: `${SUB_W} / ${SUB_H}`, background: '#ffffff' }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="px-4 pb-5 pt-4 mt-1 border-t border-[#eee6d3] flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-mono text-[#a8a196] mr-1">shape:</span>
          {SHAPES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setShapeIdx(i)}
              className={`text-[12px] font-semibold px-3 py-1.5 rounded-full border ${
                i === shapeIdx ? 'bg-[#1b2a41] text-white border-[#1b2a41]' : 'bg-transparent text-[#4a5a72] border-[#d8cfb6] hover:bg-[#faf7f0]'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* ---- Notebook row ---- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="bg-white border border-[#e4ddcc] rounded p-4">
          <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">This Shape</span>
          <p className="mt-2.5 text-[12.5px] text-[#4a5a72] leading-snug">{shape.note}</p>
        </div>

        <div className="bg-white border border-[#e4ddcc] rounded p-4">
          <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">Try This</span>
          <div className="mt-2 space-y-2.5 text-[12px] text-[#4a5a72] leading-snug">
            <p>
              <strong className="text-[#1b2a41]">1.</strong> On the engraved cube, tilt until you can see three faces
              at once — then check which symbol each locked view is showing. Every view names one specific face.
            </p>
            <p>
              <strong className="text-[#1b2a41]">2.</strong> Switch to the cylinder. Front gives a circle, top and
              side give rectangles. The same solid, three different outlines.
            </p>
            <p>
              <strong className="text-[#1b2a41]">3.</strong> Compare the T-block's top and bottom views. They are not
              the same — which is exactly why an engineering drawing needs more than one view to be unambiguous.
            </p>
          </div>
        </div>

        <div className="bg-white border border-[#e4ddcc] rounded p-4">
          <div className="bg-gradient-to-br from-[#fbf5e8] to-[#f6efdc] border border-[#e6d9b8] rounded px-4 py-3.5 text-center mb-3">
            <div className="italic text-[17px] text-[#8f6428]" style={{ fontFamily: 'Georgia, serif' }}>
              one solid, many views
            </div>
            <div className="italic text-[12.5px] text-[#8f6428] mt-1.5" style={{ fontFamily: 'Georgia, serif' }}>
              each view flattens one direction away
            </div>
          </div>
          <h2 className="font-mono text-[13px] tracking-wide uppercase text-[#4a5a72] border-b border-[#eee6d3] pb-2 mb-3">
            View Key
          </h2>
          <div className="space-y-2 text-[12px] text-[#4a5a72] leading-snug">
            <p><strong className="text-[#1b2a41]">Front</strong> — looking horizontally at the face nearest you</p>
            <p><strong className="text-[#1b2a41]">Top</strong> — looking straight down from above</p>
            <p><strong className="text-[#1b2a41]">Right</strong> — looking horizontally from the right-hand side</p>
            <p><strong className="text-[#1b2a41]">Bottom</strong> — looking straight up from underneath</p>
          </div>
        </div>
      </div>
    </div>
  );
}
