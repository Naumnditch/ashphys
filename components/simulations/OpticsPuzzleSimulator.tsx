'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Optics Puzzle: Lenses & Mirrors — an original ray-tracing puzzle,
 * built for AshPhys's own optics curriculum (13.1 reflection, 13.4
 * lenses). Not a copy of any existing commercial game's code, assets,
 * or level designs — a from-scratch implementation of the "bend light
 * with optical elements to reach a goal" genre, verified against real
 * physics rather than scripted per-level behaviour.
 *
 * Three physics primitives, each independently verified in node before
 * any rendering code was written:
 *  - plane mirrors: standard vector reflection about the surface normal
 *  - curved mirrors: reflection computed from the TRUE LOCAL NORMAL at
 *    the exact point the ray strikes the circular arc (not a scripted
 *    principal-ray diagram) — verified to reproduce the real paraxial
 *    focal length f = R/2, and to show genuine spherical aberration
 *    for rays far from the axis, exactly as a real spherical mirror
 *    would
 *  - thin lenses: the paraxial ABCD transform θ_out = θ_in − h/f —
 *    verified to reproduce all three classical principal-ray rules
 *    (parallel ray → through focus; ray through centre → undeviated;
 *    ray through near focus → emerges parallel) from ONE general
 *    formula, so it correctly bends any ray, not just the textbook's
 *    three special ones
 *
 * The ray is re-traced from scratch on every drag/rotate — real-time,
 * not pre-baked per level.
 */

const INK = '#1b2a41';
const MUTE = '#4a5a72';
const BRASS = '#b8823d';
const TEAL = '#2e7d6b';
const RED = '#b34a3c';
const GOLD = '#e8b93a';

// ---------- geometry / ray-tracing core ----------

interface Vec { x: number; y: number; }
const sub = (a: Vec, b: Vec): Vec => ({ x: a.x - b.x, y: a.y - b.y });
const add = (a: Vec, b: Vec): Vec => ({ x: a.x + b.x, y: a.y + b.y });
const scale = (a: Vec, s: number): Vec => ({ x: a.x * s, y: a.y * s });
const dot = (a: Vec, b: Vec): number => a.x * b.x + a.y * b.y;
const len = (a: Vec): number => Math.hypot(a.x, a.y);
const norm = (a: Vec): Vec => { const l = len(a) || 1; return { x: a.x / l, y: a.y / l }; };
const rot = (a: Vec, rad: number): Vec => ({ x: a.x * Math.cos(rad) - a.y * Math.sin(rad), y: a.x * Math.sin(rad) + a.y * Math.cos(rad) });

interface Ray { o: Vec; d: Vec; } // origin, unit direction

type ElementType = 'planeMirror' | 'curvedMirror' | 'lens';
interface OpticalElement {
  id: string;
  type: ElementType;
  kind: 'concave' | 'convex' | 'plane';
  pos: Vec; // centre of the element
  angle: number; // radians, orientation of the element's own axis
  length: number; // physical size (mirror segment length / lens aperture)
  focalLength?: number; // for curvedMirror (R, always positive — kind decides concave/convex) and lens (f, signed)
  locked?: boolean; // fixed elements the player can't move (rare, for framing a level)
}

interface HitResult {
  t: number; // ray parameter (distance along the ray)
  point: Vec;
  newDir: Vec;
  elementId: string;
}

/** Plane mirror: a line segment through pos, oriented by angle, of given length. */
function intersectPlaneMirror(ray: Ray, el: OpticalElement): HitResult | null {
  const axis = { x: Math.cos(el.angle), y: Math.sin(el.angle) };
  const normal = { x: -axis.y, y: axis.x };
  const denom = dot(ray.d, normal);
  if (Math.abs(denom) < 1e-9) return null;
  const t = dot(sub(el.pos, ray.o), normal) / denom;
  if (t < 1e-6) return null;
  const point = add(ray.o, scale(ray.d, t));
  const along = dot(sub(point, el.pos), axis);
  if (Math.abs(along) > el.length / 2) return null;
  const n = dot(ray.d, normal) > 0 ? scale(normal, -1) : normal;
  const d2 = dot(ray.d, n);
  const newDir = norm(sub(ray.d, scale(n, 2 * d2)));
  return { t, point, newDir, elementId: el.id };
}

/** Curved mirror: an arc of a circle of radius el.focalLength*2 (R), spanning el.length (arc chord width). */
function intersectCurvedMirror(ray: Ray, el: OpticalElement): HitResult | null {
  const R = (el.focalLength ?? 100) * 2;
  const axis = { x: Math.cos(el.angle), y: Math.sin(el.angle) };
  const normalOut = { x: -axis.y, y: axis.x }; // "outward" from the mirror's reflective face
  // centre of curvature sits behind (concave) or in front (convex) of the vertex along -normalOut
  const sign = el.kind === 'concave' ? 1 : -1;
  const vertex = el.pos;
  const center = add(vertex, scale(normalOut, sign * R));
  const oc = sub(ray.o, center);
  const b = 2 * dot(ray.d, oc);
  const c = dot(oc, oc) - R * R;
  const disc = b * b - 4 * c;
  if (disc < 0) return null;
  const sq = Math.sqrt(disc);
  const t1 = (-b - sq) / 2;
  const t2 = (-b + sq) / 2;
  const candidates = [t1, t2].filter((t) => t > 1e-6).sort((a, b2) => a - b2);
  for (const t of candidates) {
    const point = add(ray.o, scale(ray.d, t));
    // must be within the mirror's aperture (chord length along the vertex's tangent) AND on the correct arc face
    const alongTangent = dot(sub(point, vertex), axis);
    if (Math.abs(alongTangent) > el.length / 2) continue;
    const towardFace = dot(sub(point, vertex), normalOut) * sign;
    if (towardFace > R * 0.4) continue; // reject the far side of the sphere
    let n = norm(sub(center, point));
    if (el.kind === 'convex') n = scale(n, -1);
    if (dot(n, ray.d) > 0) n = scale(n, -1); // normal must face the incoming ray
    const d2 = dot(ray.d, n);
    const newDir = norm(sub(ray.d, scale(n, 2 * d2)));
    return { t, point, newDir, elementId: el.id };
  }
  return null;
}

/** Thin lens: a line segment (the lens plane) through pos, refracting via the paraxial ABCD transform. */
function intersectLens(ray: Ray, el: OpticalElement): HitResult | null {
  const axis = { x: Math.cos(el.angle), y: Math.sin(el.angle) }; // the lens's own "height" axis
  let opticalAxis = { x: -axis.y, y: axis.x }; // perpendicular to the lens — direction light nominally travels along
  // there are two valid perpendiculars; always pick the one roughly aligned with
  // the incoming ray, so "along" below is consistently positive regardless of
  // which way the lens happens to be oriented
  if (dot(ray.d, opticalAxis) < 0) opticalAxis = scale(opticalAxis, -1);
  const denom = dot(ray.d, opticalAxis);
  if (Math.abs(denom) < 1e-9) return null;
  const t = dot(sub(el.pos, ray.o), opticalAxis) / denom;
  if (t < 1e-6) return null;
  const point = add(ray.o, scale(ray.d, t));
  const h = dot(sub(point, el.pos), axis); // height above the lens's optical axis
  if (Math.abs(h) > el.length / 2) return null;
  const f = el.focalLength ?? 150;
  // decompose ray.d into (component along opticalAxis, component along axis) to get the paraxial angle
  const along = dot(ray.d, opticalAxis);
  const perp = dot(ray.d, axis);
  const thetaIn = perp / along; // small-angle slope relative to the optical axis
  const thetaOut = thetaIn - h / f;
  const newDir = norm(add(scale(opticalAxis, along), scale(axis, along * thetaOut)));
  return { t, point, newDir, elementId: el.id };
}

function intersectElement(ray: Ray, el: OpticalElement): HitResult | null {
  if (el.type === 'planeMirror') return intersectPlaneMirror(ray, el);
  if (el.type === 'curvedMirror') return intersectCurvedMirror(ray, el);
  return intersectLens(ray, el);
}

interface TraceSegment { a: Vec; b: Vec; }

function traceRay(start: Ray, elements: OpticalElement[], bounds: { w: number; h: number }, maxBounces = 12): { segments: TraceSegment[]; hitGoal: boolean; goalPoint?: Vec } {
  const segments: TraceSegment[] = [];
  let ray = start;
  for (let bounce = 0; bounce < maxBounces; bounce++) {
    let nearest: HitResult | null = null;
    for (const el of elements) {
      const hit = intersectElement(ray, el);
      if (hit && (!nearest || hit.t < nearest.t)) nearest = hit;
    }
    // clip against canvas bounds too, as a far-away "exit" point
    const boundsT = boundsExitT(ray, bounds);
    if (!nearest || nearest.t > boundsT) {
      segments.push({ a: ray.o, b: add(ray.o, scale(ray.d, boundsT)) });
      return { segments, hitGoal: false };
    }
    segments.push({ a: ray.o, b: nearest.point });
    ray = { o: add(nearest.point, scale(nearest.newDir, 0.01)), d: nearest.newDir };
  }
  return { segments, hitGoal: false };
}

function boundsExitT(ray: Ray, bounds: { w: number; h: number }): number {
  let t = Infinity;
  const candidates: number[] = [];
  if (ray.d.x > 1e-9) candidates.push((bounds.w - ray.o.x) / ray.d.x);
  if (ray.d.x < -1e-9) candidates.push((0 - ray.o.x) / ray.d.x);
  if (ray.d.y > 1e-9) candidates.push((bounds.h - ray.o.y) / ray.d.y);
  if (ray.d.y < -1e-9) candidates.push((0 - ray.o.y) / ray.d.y);
  for (const c of candidates) if (c > 0 && c < t) t = c;
  return isFinite(t) ? t : 1000;
}

// ---------- levels ----------

interface Level {
  id: string;
  name: string;
  concept: string;
  source: Ray;
  goal: Vec;
  goalRadius: number;
  elements: OpticalElement[]; // starting positions; player drags/rotates these
}

const LEVELS: Level[] = [
  {
    id: 'plane-basics',
    name: '1 · Plane Mirror',
    concept: 'Law of reflection: angle of incidence = angle of reflection',
    source: { o: { x: 40, y: 80 }, d: norm({ x: 1, y: 0.15 }) },
    goal: { x: 520, y: 300 },
    goalRadius: 16,
    elements: [{ id: 'm1', type: 'planeMirror', kind: 'plane', pos: { x: 300, y: 160 }, angle: 0.9, length: 130 }],
  },
  {
    id: 'concave-focus',
    name: '2 · Concave Mirror',
    concept: 'A concave mirror converges parallel rays through its focal point',
    source: { o: { x: 40, y: 150 }, d: { x: 1, y: 0 } },
    goal: { x: 300, y: 260 },
    goalRadius: 16,
    elements: [{ id: 'm1', type: 'curvedMirror', kind: 'concave', pos: { x: 460, y: 240 }, angle: Math.PI / 2, length: 160, focalLength: 90 }],
  },
  {
    id: 'convex-spread',
    name: '3 · Convex Mirror',
    concept: 'A convex mirror diverges rays — its focus is virtual, behind the mirror',
    source: { o: { x: 40, y: 240 }, d: { x: 1, y: 0 } },
    goal: { x: 500, y: 120 },
    goalRadius: 16,
    elements: [{ id: 'm1', type: 'curvedMirror', kind: 'convex', pos: { x: 300, y: 240 }, angle: Math.PI / 2, length: 160, focalLength: 70 }],
  },
  {
    id: 'convex-lens',
    name: '4 · Convex Lens',
    concept: 'A converging lens bends parallel rays through its focal point',
    source: { o: { x: 40, y: 150 }, d: { x: 1, y: 0 } },
    goal: { x: 520, y: 300 },
    goalRadius: 16,
    elements: [{ id: 'l1', type: 'lens', kind: 'convex', pos: { x: 300, y: 240 }, angle: Math.PI / 2, length: 170, focalLength: 130 }],
  },
  {
    id: 'concave-lens',
    name: '5 · Concave Lens',
    concept: 'A diverging lens spreads rays as if from a virtual focus in front',
    source: { o: { x: 40, y: 170 }, d: { x: 1, y: 0 } },
    goal: { x: 540, y: 60 },
    goalRadius: 16,
    elements: [{ id: 'l1', type: 'lens', kind: 'concave', pos: { x: 300, y: 240 }, angle: Math.PI / 2, length: 170, focalLength: -110 }],
  },
  {
    id: 'combo',
    name: '6 · Mirror + Lens',
    concept: 'Combine a plane mirror and a lens to redirect and refract in sequence',
    source: { o: { x: 40, y: 60 }, d: { x: 1, y: 0 } },
    goal: { x: 460, y: 330 },
    goalRadius: 16,
    elements: [
      { id: 'm1', type: 'planeMirror', kind: 'plane', pos: { x: 260, y: 60 }, angle: 0.9, length: 130 },
      { id: 'l1', type: 'lens', kind: 'convex', pos: { x: 260, y: 250 }, angle: 0, length: 170, focalLength: 140 },
    ],
  },
];

const CANVAS_W = 580;
const CANVAS_H = 380;

export function OpticsPuzzleSimulator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const phaseRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);

  const [levelIdx, setLevelIdx] = useState(0);
  const [elements, setElements] = useState<OpticalElement[]>(() => LEVELS[0].elements.map((e) => ({ ...e })));
  const [won, setWon] = useState(false);
  const [dragState, setDragState] = useState<{ id: string; mode: 'move' | 'rotate'; grabOffset: Vec } | null>(null);

  const level = LEVELS[levelIdx];

  const loadLevel = (i: number) => {
    setLevelIdx(i);
    setElements(LEVELS[i].elements.map((e) => ({ ...e })));
    setWon(false);
  };

  const resetLevel = () => {
    setElements(LEVELS[levelIdx].elements.map((e) => ({ ...e })));
    setWon(false);
  };

  const checkWin = (els: OpticalElement[]) => {
    const { segments } = traceRay(level.source, els, { w: CANVAS_W, h: CANVAS_H });
    for (const seg of segments) {
      if (distPointToSegment(level.goal, seg.a, seg.b) < level.goalRadius) return true;
    }
    return false;
  };

  useEffect(() => {
    setWon(checkWin(elements));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elements, levelIdx]);

  const handleUp = () => setDragState(null);

  const toCanvasCoords = (clientX: number, clientY: number): Vec | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    return { x: ((clientX - rect.left) / rect.width) * CANVAS_W, y: ((clientY - rect.top) / rect.height) * CANVAS_H };
  };

  const rotateHandlePos = (el: OpticalElement): Vec => {
    const n = { x: -Math.sin(el.angle), y: Math.cos(el.angle) };
    const reach = el.type === 'curvedMirror' ? 34 : 30;
    return add(el.pos, scale(n, -reach));
  };

  const handleDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const p = toCanvasCoords(e.clientX, e.clientY);
    if (!p) return;
    for (const el of elements) {
      if (el.locked) continue;
      const rh = rotateHandlePos(el);
      if (len(sub(p, rh)) < 14) {
        (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
        setDragState({ id: el.id, mode: 'rotate', grabOffset: { x: 0, y: 0 } });
        return;
      }
      if (len(sub(p, el.pos)) < el.length / 2 + 10) {
        (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
        setDragState({ id: el.id, mode: 'move', grabOffset: sub(el.pos, p) });
        return;
      }
    }
  };

  const handleMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!dragState) return;
    const p = toCanvasCoords(e.clientX, e.clientY);
    if (!p) return;
    setElements((prev) =>
      prev.map((el) => {
        if (el.id !== dragState.id) return el;
        if (dragState.mode === 'move') {
          const nx = Math.max(20, Math.min(CANVAS_W - 20, p.x + dragState.grabOffset.x));
          const ny = Math.max(20, Math.min(CANVAS_H - 20, p.y + dragState.grabOffset.y));
          return { ...el, pos: { x: nx, y: ny } };
        }
        const dvec = sub(p, el.pos);
        const newAngle = Math.atan2(dvec.y, dvec.x) + Math.PI / 2;
        return { ...el, angle: newAngle };
      })
    );
  };

  function distPointToSegment(p: Vec, a: Vec, b: Vec): number {
    const ab = sub(b, a);
    const ab2 = dot(ab, ab) || 1e-9;
    let t = dot(sub(p, a), ab) / ab2;
    t = Math.max(0, Math.min(1, t));
    const proj = add(a, scale(ab, t));
    return len(sub(p, proj));
  }

  const render = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const scaleFactor = rect.width / CANVAS_W;
    ctx.setTransform(devicePixelRatio * scaleFactor, 0, 0, devicePixelRatio * scaleFactor, 0, 0);
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    // background grid
    ctx.strokeStyle = 'rgba(27,42,65,0.06)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= CANVAS_W; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, CANVAS_H);
      ctx.stroke();
    }
    for (let y = 0; y <= CANVAS_H; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(CANVAS_W, y);
      ctx.stroke();
    }

    // ray path, animated flowing dashes
    const { segments } = traceRay(level.source, elements, { w: CANVAS_W, h: CANVAS_H });
    ctx.strokeStyle = won ? TEAL : GOLD;
    ctx.lineWidth = 2.5;
    ctx.setLineDash([8, 6]);
    ctx.lineDashOffset = -phaseRef.current * 40;
    ctx.beginPath();
    for (const seg of segments) {
      ctx.moveTo(seg.a.x, seg.a.y);
      ctx.lineTo(seg.b.x, seg.b.y);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // light source
    ctx.fillStyle = INK;
    ctx.beginPath();
    ctx.arc(level.source.o.x, level.source.o.y, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(level.source.o.x, level.source.o.y);
    ctx.lineTo(level.source.o.x + level.source.d.x * 20, level.source.o.y + level.source.d.y * 20);
    ctx.stroke();

    // goal
    ctx.fillStyle = won ? 'rgba(46,125,107,0.25)' : 'rgba(184,130,61,0.2)';
    ctx.beginPath();
    ctx.arc(level.goal.x, level.goal.y, level.goalRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = won ? TEAL : BRASS;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // elements
    for (const el of elements) {
      drawElement(ctx, el);
      if (!el.locked) {
        const rh = rotateHandlePos(el);
        ctx.fillStyle = '#faf7f0';
        ctx.strokeStyle = MUTE;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(rh.x, rh.y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    }
  };

  function drawElement(ctx: CanvasRenderingContext2D, el: OpticalElement) {
    const axis = { x: Math.cos(el.angle), y: Math.sin(el.angle) };
    const p1 = add(el.pos, scale(axis, el.length / 2));
    const p2 = add(el.pos, scale(axis, -el.length / 2));
    if (el.type === 'planeMirror') {
      ctx.strokeStyle = INK;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
      const n = { x: -axis.y, y: axis.x };
      ctx.strokeStyle = '#8a94a3';
      ctx.lineWidth = 1;
      for (let s = -1; s <= 1; s += 0.5) {
        const base = add(el.pos, scale(axis, s * el.length * 0.48));
        ctx.beginPath();
        ctx.moveTo(base.x, base.y);
        ctx.lineTo(base.x - n.x * 8, base.y - n.y * 8);
        ctx.stroke();
      }
    } else if (el.type === 'curvedMirror') {
      const R = (el.focalLength ?? 100) * 2;
      const normalOut = { x: -axis.y, y: axis.x };
      const sign = el.kind === 'concave' ? 1 : -1;
      const center = add(el.pos, scale(normalOut, sign * R));
      const startAngle = Math.atan2(el.pos.y - center.y, el.pos.x - center.x);
      const halfSpan = Math.asin(Math.min(0.9, el.length / 2 / R));
      ctx.strokeStyle = el.kind === 'concave' ? TEAL : RED;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(center.x, center.y, R, startAngle - halfSpan, startAngle + halfSpan);
      ctx.stroke();
    } else {
      // lens: bulge outward (convex) or inward (concave) on both faces
      const n = { x: -axis.y, y: axis.x };
      const bulge = el.kind === 'convex' ? 12 : -8;
      ctx.strokeStyle = BRASS;
      ctx.fillStyle = 'rgba(184,130,61,0.12)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.quadraticCurveTo(el.pos.x + n.x * bulge, el.pos.y + n.y * bulge, p2.x, p2.y);
      ctx.quadraticCurveTo(el.pos.x - n.x * bulge, el.pos.y - n.y * bulge, p1.x, p1.y);
      ctx.fill();
      ctx.stroke();
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const resize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * devicePixelRatio;
      canvas.height = rect.height * devicePixelRatio;
      render();
    };
    resize();
    window.addEventListener('resize', resize);
    const loop = (t: number) => {
      if (lastTimeRef.current === null) lastTimeRef.current = t;
      const dt = Math.min(0.05, (t - lastTimeRef.current) / 1000);
      lastTimeRef.current = t;
      phaseRef.current += dt;
      render();
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('resize', resize);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elements, won, levelIdx]);

  return (
    <div className="optics-puzzle flex flex-col gap-5">
      {/* ---- Puzzle stage: full width ---- */}
      <div className="bg-white border border-[#e4ddcc] rounded overflow-hidden">
        <div className="flex justify-between items-baseline px-4 pt-3">
          <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">{level.name}</span>
          <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">
            {won ? '✓ goal reached' : 'drag the element, ring rotates it'}
          </span>
        </div>
        <div className="px-4 pt-2">
          <canvas
            ref={canvasRef}
            className="block w-full rounded border border-[#e4ddcc] touch-none cursor-grab active:cursor-grabbing"
            style={{ aspectRatio: `${CANVAS_W} / ${CANVAS_H}`, background: '#faf7f0' }}
            onPointerDown={handleDown}
            onPointerMove={handleMove}
            onPointerUp={handleUp}
            onPointerCancel={handleUp}
          />
        </div>
        <div className="px-4 pb-2 pt-2">
          <p className="text-[11.5px] text-[#4a5a72] leading-snug">{level.concept}</p>
        </div>
        <div className="px-4 pb-5 pt-3 border-t border-[#eee6d3] flex flex-wrap items-center gap-2">
          <button onClick={resetLevel} className="text-[12px] font-semibold px-3 py-1.5 rounded-full border border-[#d8cfb6] text-[#4a5a72] hover:bg-[#faf7f0]">
            ↺ Reset Level
          </button>
          <span className="text-[11px] font-mono text-[#a8a196] mr-1 ml-auto">level:</span>
          {LEVELS.map((lv, i) => (
            <button
              key={lv.id}
              onClick={() => loadLevel(i)}
              className={`text-[12px] font-semibold px-3 py-1.5 rounded-full border ${
                i === levelIdx ? 'bg-[#1b2a41] text-white border-[#1b2a41]' : 'bg-transparent text-[#4a5a72] border-[#d8cfb6] hover:bg-[#faf7f0]'
              }`}
            >
              {lv.name}
            </button>
          ))}
        </div>
      </div>

      {/* ---- Notebook row ---- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="bg-white border border-[#e4ddcc] rounded p-4">
          <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">How To Play</span>
          <div className="mt-2.5 space-y-2.5 text-[12.5px] text-[#4a5a72] leading-snug">
            <p>
              <strong className="text-[#1b2a41]">Drag the body</strong> of the mirror or lens to reposition it.
              <strong className="text-[#1b2a41]"> Drag the small ring</strong> beside it to rotate.
            </p>
            <p>
              The gold beam is real ray-tracing — every reflection and refraction is computed from the actual
              geometry, live, as you move things. It turns teal when the beam reaches the goal.
            </p>
          </div>
        </div>

        <div className="bg-white border border-[#e4ddcc] rounded p-4">
          <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">The Physics</span>
          <div className="mt-2 space-y-2.5 text-[12px] text-[#4a5a72] leading-snug">
            <p>
              <strong className="text-[#1b2a41]">Mirrors</strong> reflect using the true local surface at the exact
              point the beam strikes it — angle of incidence equals angle of reflection, every time, on flat or
              curved glass alike.
            </p>
            <p>
              <strong className="text-[#1b2a41]">Lenses</strong> bend the beam according to its height above the
              optical axis and the lens's focal length — the same rule produces every principal ray your textbook
              draws by hand, and every ray in between them too.
            </p>
          </div>
        </div>

        <div className="bg-white border border-[#e4ddcc] rounded p-4">
          <div className="bg-gradient-to-br from-[#fbf5e8] to-[#f6efdc] border border-[#e6d9b8] rounded px-4 py-3.5 text-center mb-3">
            <div className="italic text-[19px] text-[#8f6428]" style={{ fontFamily: 'Georgia, serif' }}>
              θᵢ = θᵣ
            </div>
            <div className="italic text-[13px] text-[#8f6428] mt-1.5" style={{ fontFamily: 'Georgia, serif' }}>
              angle of incidence = angle of reflection
            </div>
          </div>
          <h2 className="font-mono text-[13px] tracking-wide uppercase text-[#4a5a72] border-b border-[#eee6d3] pb-2 mb-3">
            Element Key
          </h2>
          <div className="space-y-2.5 text-[12px] text-[#4a5a72] leading-snug">
            <div className="flex gap-2.5 items-center">
              <div className="w-8 h-1.5 rounded-full flex-shrink-0" style={{ background: INK }} />
              <p><strong className="text-[#1b2a41]">Plane mirror</strong> — flat, simple reflection</p>
            </div>
            <div className="flex gap-2.5 items-center">
              <div className="w-8 h-1.5 rounded-full flex-shrink-0" style={{ background: TEAL }} />
              <p><strong className="text-[#1b2a41]">Concave mirror</strong> — converges, real focus</p>
            </div>
            <div className="flex gap-2.5 items-center">
              <div className="w-8 h-1.5 rounded-full flex-shrink-0" style={{ background: RED }} />
              <p><strong className="text-[#1b2a41]">Convex mirror</strong> — diverges, virtual focus</p>
            </div>
            <div className="flex gap-2.5 items-center">
              <div className="w-8 h-1.5 rounded-full flex-shrink-0" style={{ background: BRASS }} />
              <p><strong className="text-[#1b2a41]">Lens</strong> — bulges out (convex) or in (concave)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
