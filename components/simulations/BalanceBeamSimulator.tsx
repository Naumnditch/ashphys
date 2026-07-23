'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Balance Beam — the moments practical as a real torque engine.
 *
 * Real physics, not a canned animation:
 *  - Every hanging load contributes a torque τ = m·g·(x − p)·cos θ about
 *    the pivot; the horizontal lever arm genuinely shortens as the beam
 *    tilts, exactly as it does for masses hanging on strings
 *  - The beam's own weight acts at its centre of gravity (50 cm), which
 *    is what makes the classic "find the mass of the ruler" experiment
 *    possible here
 *  - Net torque drives real rotational dynamics: I·α = Στ with damping
 *    and end stops, so an unbalanced beam swings and settles instead of
 *    snapping to a pose
 *  - A mystery mass challenge hides a bag at a random notch — balance
 *    the beam with known weights and calculate the unknown, then reveal
 */

const G = 9.8; // N/kg (Cambridge 0625 value)
const BEAM_LEN = 1.0; // metres — a metre rule
const NOTCH = 0.05; // hanging positions every 5 cm
const MAX_TILT = 0.21; // rad, ≈ 12° end stops
// The beam sits in a cradle slightly BELOW the rotation axis, like a real
// demonstration balance. Tilting therefore lifts the load system's centre of
// gravity, giving a restoring moment — this is why equal masses settle level,
// and why a small imbalance produces a small steady tilt instead of neutral
// equilibrium at any angle.
const PIVOT_DROP = 0.02; // metres

const TRAY_MASSES = [0.02, 0.05, 0.1, 0.2]; // kg

interface PlacedWeight {
  id: number;
  pos: number; // metres from the left end of the beam
  mass: number; // kg
}

interface Mystery {
  pos: number;
  mass: number;
  revealed: boolean;
}

interface DragState {
  kind: 'new' | 'placed' | 'pivot' | null;
  mass: number;
  fromId: number | null;
  x: number;
  y: number;
}

const snap = (x: number) => Math.round(x / NOTCH) * NOTCH;
const clampPos = (x: number) => Math.min(BEAM_LEN, Math.max(0, snap(x)));

function randomMystery(): Mystery {
  // between 30 g and 250 g, in 10 g steps, at a notch in the outer thirds
  const mass = (3 + Math.floor(Math.random() * 23)) / 100;
  const side = Math.random() < 0.5 ? -1 : 1;
  const offset = 0.2 + Math.floor(Math.random() * 5) * NOTCH; // 20–40 cm from centre
  const pos = clampPos(0.5 + side * offset);
  return { pos, mass, revealed: false };
}

export function BalanceBeamSimulator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const nextIdRef = useRef(1);

  const [placed, setPlaced] = useState<PlacedWeight[]>([]);
  const [pivot, setPivot] = useState(0.5); // metres from the left end
  const [beamMass, setBeamMass] = useState(0.1);
  const [mystery, setMystery] = useState<Mystery | null>(null);
  const [showTechnical, setShowTechnical] = useState(false);
  const [balanced, setBalanced] = useState(false);

  // everything the animation loop needs lives in a ref
  const simRef = useRef({
    placed: [] as PlacedWeight[],
    pivot: 0.5,
    beamMass: 0.1,
    mystery: null as Mystery | null,
    showTechnical: false,
    theta: 0,
    omega: 0,
    drag: { kind: null, mass: 0, fromId: null, x: 0, y: 0 } as DragState,
  });

  /** Net torque about the pivot (N·m). Positive = clockwise on screen (right side down). */
  const netTorque = (theta: number) => {
    const s = simRef.current;
    let tau = 0;
    // horizontal offset of an attachment point that sits at (pos) along the
    // beam and PIVOT_DROP below the axis: shrinks with tilt AND gains a
    // restoring −h·sinθ term
    const arm = (pos: number) => (pos - s.pivot) * Math.cos(theta) - PIVOT_DROP * Math.sin(theta);
    s.placed.forEach((wt) => {
      tau += wt.mass * G * arm(wt.pos);
    });
    if (s.mystery) tau += s.mystery.mass * G * arm(s.mystery.pos);
    tau += s.beamMass * G * arm(BEAM_LEN / 2);
    return tau;
  };

  /** Moment of inertia about the pivot (kg·m²), with a floor so an empty beam still moves sanely. */
  const inertia = () => {
    const s = simRef.current;
    let I = 0.004; // hanger + fixings floor
    const h2 = PIVOT_DROP * PIVOT_DROP;
    s.placed.forEach((wt) => {
      I += wt.mass * (Math.pow(wt.pos - s.pivot, 2) + h2);
    });
    if (s.mystery) I += s.mystery.mass * (Math.pow(s.mystery.pos - s.pivot, 2) + h2);
    const c = BEAM_LEN / 2 - s.pivot;
    I += s.beamMass * ((BEAM_LEN * BEAM_LEN) / 12 + c * c + h2);
    return I;
  };

  // ---------- geometry helpers (canvas ↔ beam coordinates) ----------
  const geom = () => {
    const canvas = canvasRef.current;
    const rect = canvas ? canvas.getBoundingClientRect() : ({ width: 600, height: 430 } as DOMRect);
    const w = rect.width;
    const h = rect.height;
    const margin = 55;
    const scale = (w - margin * 2) / BEAM_LEN; // px per metre
    const benchY = h - 46;
    const pivotTopY = benchY - 84;
    const beamXpx = (pos: number) => margin + pos * scale;
    return { w, h, margin, scale, benchY, pivotTopY, beamXpx };
  };

  /** Screen position of a point on the (tilted) beam. */
  const beamPoint = (pos: number) => {
    const s = simRef.current;
    const g = geom();
    const px = g.beamXpx(s.pivot);
    const dx = (pos - s.pivot) * g.scale;
    const hpx = PIVOT_DROP * g.scale;
    return {
      x: px + dx * Math.cos(s.theta) - hpx * Math.sin(s.theta),
      y: g.pivotTopY + dx * Math.sin(s.theta) + hpx * Math.cos(s.theta),
    };
  };

  const drawDisc = (ctx: CanvasRenderingContext2D, x: number, y: number, mass: number, ghost = false) => {
    const r = 11 + mass * 40;
    ctx.fillStyle = ghost ? 'rgba(184, 130, 61, 0.45)' : '#b8823d';
    ctx.strokeStyle = ghost ? 'rgba(122, 84, 34, 0.45)' : '#7a5422';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#faf7f0';
    ctx.font = `700 ${mass >= 0.1 ? 11 : 9.5}px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(`${Math.round(mass * 1000)}g`, x, y + 3.5);
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const s = simRef.current;
    const g = geom();
    ctx.clearRect(0, 0, g.w, g.h);

    // ---- weights tray ----
    ctx.fillStyle = 'rgba(27, 42, 65, 0.05)';
    ctx.fillRect(0, 0, g.w, 56);
    ctx.strokeStyle = '#e4ddcc';
    ctx.beginPath();
    ctx.moveTo(0, 56);
    ctx.lineTo(g.w, 56);
    ctx.stroke();
    ctx.fillStyle = '#4a5a72';
    ctx.font = '600 10.5px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('WEIGHTS TRAY — drag onto the beam', 12, 15);
    TRAY_MASSES.forEach((m, i) => {
      drawDisc(ctx, 40 + i * 72, 37, m);
    });

    // ---- bench & pivot stand ----
    ctx.strokeStyle = '#1b2a41';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, g.benchY);
    ctx.lineTo(g.w, g.benchY);
    ctx.stroke();

    const px = g.beamXpx(s.pivot);
    ctx.fillStyle = '#4a5a72';
    ctx.beginPath();
    ctx.moveTo(px, g.pivotTopY + 3);
    ctx.lineTo(px - 20, g.benchY);
    ctx.lineTo(px + 20, g.benchY);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#faf7f0';
    ctx.font = '700 9px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('⟷', px, g.benchY - 8);

    // ---- beam (a metre rule) ----
    const L = beamPoint(0);
    const R = beamPoint(BEAM_LEN);
    ctx.save();
    ctx.translate(px, g.pivotTopY);
    ctx.rotate(s.theta);
    ctx.translate(0, PIVOT_DROP * g.scale);
    const halfL = -s.pivot * g.scale;
    const halfR = (BEAM_LEN - s.pivot) * g.scale;
    ctx.fillStyle = '#efe7d2';
    ctx.strokeStyle = '#1b2a41';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.roundRect(halfL, -9, halfR - halfL, 18, 2);
    ctx.fill();
    ctx.stroke();
    // centimetre graduations + labels every 10 cm
    for (let cm = 0; cm <= 100; cm += 5) {
      const x = (cm / 100 - s.pivot) * g.scale;
      const tall = cm % 10 === 0;
      ctx.strokeStyle = 'rgba(27, 42, 65, 0.55)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, -9);
      ctx.lineTo(x, tall ? -1 : -5);
      ctx.stroke();
      if (tall) {
        ctx.fillStyle = '#4a5a72';
        ctx.font = '500 8px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(String(cm), x, 7);
      }
    }
    // centre of gravity marker for the beam's own weight
    if (s.beamMass > 0) {
      const xc = (0.5 - s.pivot) * g.scale;
      ctx.strokeStyle = '#b34a3c';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(xc, 9);
      ctx.lineTo(xc, 26);
      ctx.stroke();
      ctx.fillStyle = '#b34a3c';
      ctx.beginPath();
      ctx.moveTo(xc, 32);
      ctx.lineTo(xc - 5, 24);
      ctx.lineTo(xc + 5, 24);
      ctx.closePath();
      ctx.fill();
      ctx.font = '600 9px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`beam ${Math.round(s.beamMass * 1000)}g`, xc + 8, 30);
    }
    ctx.restore();

    // ---- hanging loads (strings stay vertical) ----
    const groups = new Map<number, PlacedWeight[]>();
    s.placed.forEach((wt) => {
      const key = Math.round(wt.pos * 1000);
      const arr = groups.get(key) || [];
      arr.push(wt);
      groups.set(key, arr);
    });
    groups.forEach((arr) => {
      const p = beamPoint(arr[0].pos);
      ctx.strokeStyle = '#8a94a3';
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y + 9);
      ctx.lineTo(p.x, p.y + 26);
      ctx.stroke();
      let y = p.y + 26;
      arr.forEach((wt) => {
        const r = 11 + wt.mass * 40;
        drawDisc(ctx, p.x, y + r, wt.mass);
        y += r * 2 + 2;
      });
    });

    // ---- mystery bag ----
    if (s.mystery) {
      const p = beamPoint(s.mystery.pos);
      ctx.strokeStyle = '#8a94a3';
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y + 9);
      ctx.lineTo(p.x, p.y + 24);
      ctx.stroke();
      ctx.fillStyle = '#7a52b3';
      ctx.strokeStyle = '#553a80';
      ctx.beginPath();
      ctx.roundRect(p.x - 16, p.y + 24, 32, 30, 5);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#faf7f0';
      ctx.font = '700 13px Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText(s.mystery.revealed ? `${Math.round(s.mystery.mass * 1000)}g` : '?', p.x, p.y + 43);
    }

    // ---- balance state badge + angle ----
    ctx.font = '700 12px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
    ctx.textAlign = 'right';
    const atStop = Math.abs(s.theta) >= MAX_TILT - 1e-4;
    if (balancedNow()) {
      ctx.fillStyle = '#2e7d6b';
      ctx.fillText('✓ BALANCED', g.w - 12, 76);
    } else if (atStop) {
      ctx.fillStyle = '#b34a3c';
      ctx.fillText('▼ TIPPED — resting on the stop', g.w - 12, 76);
    }
    ctx.fillStyle = '#4a5a72';
    ctx.font = '600 11px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.fillText(`tilt ${((s.theta * 180) / Math.PI).toFixed(1)}°`, g.w - 12, 92);

    // ---- technical overlay: torque arrows at the pivot ----
    if (s.showTechnical) {
      const tau = netTorque(s.theta);
      ctx.textAlign = 'left';
      ctx.font = '600 11px ui-monospace, SFMono-Regular, Menlo, monospace';
      ctx.fillStyle = '#4a5a72';
      ctx.fillText(`net moment ${tau >= 0 ? '+' : ''}${tau.toFixed(3)} N·m ${Math.abs(tau) < 0.0005 ? '' : tau > 0 ? '(clockwise)' : '(anticlockwise)'}`, 12, 76);
      ctx.fillText(`I = ${inertia().toFixed(4)} kg·m²`, 12, 92);
      const support = (s.beamMass + s.placed.reduce((a, wt) => a + wt.mass, 0) + (s.mystery ? s.mystery.mass : 0)) * G;
      ctx.fillText(`pivot pushes up with ${support.toFixed(2)} N`, 12, 108);
    }

    // ---- dragged item ghost ----
    if (s.drag.kind === 'new' || s.drag.kind === 'placed') {
      drawDisc(ctx, s.drag.x, s.drag.y, s.drag.mass, true);
      const posOnBeam = dragBeamPos(s.drag.x, s.drag.y);
      if (posOnBeam !== null) {
        const p = beamPoint(posOnBeam);
        ctx.strokeStyle = 'rgba(46, 125, 107, 0.8)';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 3]);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 10, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    void L;
    void R;
  };

  /** If a dragged disc is near the beam, the notch position it would land on; else null. */
  const dragBeamPos = (x: number, y: number): number | null => {
    const s = simRef.current;
    const g = geom();
    // invert the beam transform approximately using the un-tilted axis
    const along = (x - g.beamXpx(s.pivot)) / Math.cos(s.theta || 1e-9) / g.scale + s.pivot;
    const pos = clampPos(along);
    const p = beamPoint(pos);
    const dist = Math.hypot(x - p.x, y - p.y);
    return dist < 70 ? pos : null;
  };

  const balancedNow = () => {
    const s = simRef.current;
    return Math.abs(s.theta) < 0.012 && Math.abs(s.omega) < 0.02 && Math.abs(netTorque(0)) < 0.004;
  };

  // ---------- animation ----------
  const loop = (t: number) => {
    if (lastTimeRef.current === null) lastTimeRef.current = t;
    const dt = Math.min(0.035, (t - lastTimeRef.current) / 1000);
    lastTimeRef.current = t;
    const s = simRef.current;

    const I = inertia();
    const damping = 0.9 * Math.sqrt(I); // heavier systems ring longer but still settle
    const alpha = (netTorque(s.theta) - damping * s.omega) / I;
    s.omega += alpha * dt;
    s.theta += s.omega * dt;
    if (s.theta > MAX_TILT) {
      s.theta = MAX_TILT;
      if (s.omega > 0) s.omega *= -0.15; // nearly dead bounce off the stop
    } else if (s.theta < -MAX_TILT) {
      s.theta = -MAX_TILT;
      if (s.omega < 0) s.omega *= -0.15;
    }
    draw();
    setBalanced(balancedNow());
    rafRef.current = requestAnimationFrame(loop);
  };

  // ---------- pointer interaction ----------
  const canvasXY = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const { x, y } = canvasXY(e);
    const s = simRef.current;
    const g = geom();
    (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);

    // tray?
    if (y < 62) {
      const idx = TRAY_MASSES.findIndex((m, i) => Math.hypot(x - (40 + i * 72), y - 37) < 11 + m * 40 + 6);
      if (idx >= 0) {
        s.drag = { kind: 'new', mass: TRAY_MASSES[idx], fromId: null, x, y };
        return;
      }
    }
    // pivot?
    const px = g.beamXpx(s.pivot);
    if (Math.abs(x - px) < 26 && y > g.pivotTopY && y < g.benchY + 6) {
      s.drag = { kind: 'pivot', mass: 0, fromId: null, x, y };
      return;
    }
    // an already-placed weight? (topmost disc within reach)
    for (const wt of [...s.placed].reverse()) {
      const p = beamPoint(wt.pos);
      if (Math.hypot(x - p.x, y - p.y - 30) < 55 && y > p.y + 8) {
        s.drag = { kind: 'placed', mass: wt.mass, fromId: wt.id, x, y };
        return;
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const s = simRef.current;
    if (!s.drag.kind) return;
    const { x, y } = canvasXY(e);
    s.drag.x = x;
    s.drag.y = y;
    if (s.drag.kind === 'pivot') {
      const g = geom();
      const pos = clampPos((x - g.margin) / g.scale);
      s.pivot = Math.min(0.95, Math.max(0.05, pos));
      setPivot(s.pivot);
    }
  };

  const handlePointerUp = () => {
    const s = simRef.current;
    if (s.drag.kind === 'new' || s.drag.kind === 'placed') {
      const landing = dragBeamPos(s.drag.x, s.drag.y);
      let next = s.placed;
      if (s.drag.kind === 'placed') next = next.filter((wt) => wt.id !== s.drag.fromId);
      if (landing !== null) {
        next = [...next, { id: nextIdRef.current++, pos: landing, mass: s.drag.mass }];
      }
      s.placed = next;
      setPlaced(next);
    }
    s.drag = { kind: null, mass: 0, fromId: null, x: 0, y: 0 };
  };

  // ---------- state sync helpers ----------
  const setBeamMassBoth = (m: number) => {
    setBeamMass(m);
    simRef.current.beamMass = m;
  };

  const handleClear = () => {
    simRef.current.placed = [];
    setPlaced([]);
  };

  const handleMysteryToggle = () => {
    if (simRef.current.mystery) {
      simRef.current.mystery = null;
      setMystery(null);
    } else {
      const m = randomMystery();
      simRef.current.mystery = m;
      setMystery({ ...m });
    }
  };

  const handleReveal = () => {
    if (!simRef.current.mystery) return;
    simRef.current.mystery.revealed = true;
    setMystery({ ...simRef.current.mystery });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const resize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * devicePixelRatio;
      canvas.height = rect.height * devicePixelRatio;
      canvas.getContext('2d')?.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      draw();
    };
    resize();
    window.addEventListener('resize', resize);
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('resize', resize);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- moments ledger (computed for the flat beam, as students do on paper) ----------
  interface LedgerRow {
    label: string;
    force: string;
    dist: string;
    moment: number | null;
    side: 'cw' | 'acw' | 'none';
  }
  const ledger: LedgerRow[] = [];
  const addRow = (label: string, mass: number | null, pos: number) => {
    const d = pos - pivot; // + means right of pivot → clockwise
    if (mass === null) {
      ledger.push({ label, force: '?', dist: Math.abs(d).toFixed(2), moment: null, side: d > 0 ? 'cw' : d < 0 ? 'acw' : 'none' });
      return;
    }
    const F = mass * G;
    const m = F * Math.abs(d);
    ledger.push({
      label,
      force: F.toFixed(2),
      dist: Math.abs(d).toFixed(2),
      moment: m,
      side: d > 1e-9 ? 'cw' : d < -1e-9 ? 'acw' : 'none',
    });
  };
  const groupsForLedger = new Map<number, number>();
  placed.forEach((wt) => {
    const key = Math.round(wt.pos * 1000);
    groupsForLedger.set(key, (groupsForLedger.get(key) || 0) + wt.mass);
  });
  [...groupsForLedger.entries()]
    .sort((a, b) => a[0] - b[0])
    .forEach(([key, mass]) => addRow(`${Math.round(mass * 1000)} g at ${key / 10} cm`, mass, key / 1000));
  if (beamMass > 0) addRow(`beam (${Math.round(beamMass * 1000)} g) at 50 cm`, beamMass, 0.5);
  if (mystery) addRow(`mystery at ${Math.round(mystery.pos * 100)} cm`, mystery.revealed ? mystery.mass : null, mystery.pos);

  const cwTotal = ledger.filter((r) => r.side === 'cw' && r.moment !== null).reduce((a, r) => a + (r.moment || 0), 0);
  const acwTotal = ledger.filter((r) => r.side === 'acw' && r.moment !== null).reduce((a, r) => a + (r.moment || 0), 0);
  const hasUnknown = ledger.some((r) => r.moment === null);

  const variables = [
    { symbol: 'M', name: 'Moment', def: 'The turning effect of a force about the pivot, in newton-metres (N·m).' },
    { symbol: 'F', name: 'Force', def: 'Here, the weight of each load: F = m·g, with g = 9.8 N/kg. Measured in newtons (N).' },
    { symbol: 'd', name: 'Perpendicular distance', def: 'From the pivot to the line of action of the force, in metres (m). The ledger lists d for every load.' },
    { symbol: 'Σ', name: 'Sum of', def: 'Add up every moment on that side of the pivot. When the two sums are equal, there is no resultant turning effect — the beam is in equilibrium.' },
  ];

  return (
    <div className="balance-beam-lab">
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-5">
        {/* ---- Apparatus ---- */}
        <div className="bg-white border border-[#e4ddcc] rounded overflow-hidden">
          <div className="flex justify-between items-baseline px-4 pt-3">
            <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">Metre Rule on a Pivot</span>
            <span className={`font-mono text-[11px] tracking-wide uppercase ${balanced ? 'text-[#2e7d6b] font-bold' : 'text-[#4a5a72]'}`}>
              {balanced ? 'in equilibrium' : 'not balanced'}
            </span>
          </div>
          <canvas
            ref={canvasRef}
            className="block w-full touch-none cursor-grab"
            style={{ height: 430 }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          />
          <div className="px-4 pb-2 -mt-1">
            <p className="text-[11.5px] text-[#4a5a72] leading-snug">
              <span className="text-[#b8823d] font-semibold">Drag weights</span> from the tray onto the beam — stack
              them, or drag them off to remove. <span className="text-[#4a5a72] font-semibold">Drag the grey stand</span>{' '}
              to move the pivot. <span className="text-[#b34a3c] font-semibold">Red arrow</span> = the beam's own weight
              at its centre of gravity.
            </p>
          </div>

          <div className="px-4 pb-5 pt-3 border-t border-[#eee6d3]">
            <div className="flex items-center gap-3 mb-3">
              <label className="text-[13px] text-[#4a5a72] w-28 flex-shrink-0">Beam mass</label>
              <input
                type="range"
                min={0}
                max={0.3}
                step={0.01}
                value={beamMass}
                onChange={(e) => setBeamMassBoth(parseFloat(e.target.value))}
                className="flex-1"
              />
              <span className="font-mono text-[13px] w-14 text-right">{Math.round(beamMass * 1000)} g</span>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <label className="text-[13px] text-[#4a5a72] w-28 flex-shrink-0">Pivot at</label>
              <input
                type="range"
                min={0.05}
                max={0.95}
                step={0.05}
                value={pivot}
                onChange={(e) => {
                  const p = parseFloat(e.target.value);
                  setPivot(p);
                  simRef.current.pivot = p;
                }}
                className="flex-1"
              />
              <span className="font-mono text-[13px] w-14 text-right">{Math.round(pivot * 100)} cm</span>
            </div>

            <div className="flex gap-2 mb-3">
              <button
                onClick={handleMysteryToggle}
                className={`flex-1 text-[12.5px] font-semibold px-3 py-2 rounded border ${
                  mystery
                    ? 'bg-[#7a52b3] text-white border-[#7a52b3]'
                    : 'bg-transparent text-[#1b2a41] border-[#d8cfb6] hover:bg-[#f5f0e2]'
                }`}
              >
                {mystery ? '✓ Mystery mass on' : '🎒 Add a mystery mass'}
              </button>
              <button
                onClick={handleClear}
                className="text-[12.5px] font-semibold px-3 py-2 rounded border bg-transparent text-[#1b2a41] border-[#d8cfb6] hover:bg-[#f5f0e2]"
              >
                Clear weights
              </button>
            </div>

            <button
              onClick={() => {
                const next = !showTechnical;
                setShowTechnical(next);
                simRef.current.showTechnical = next;
              }}
              className={`w-full text-[12.5px] font-semibold px-3 py-2 rounded border ${
                showTechnical
                  ? 'bg-[#1b2a41] text-white border-[#1b2a41]'
                  : 'bg-transparent text-[#1b2a41] border-[#d8cfb6] hover:bg-[#f5f0e2]'
              }`}
            >
              {showTechnical ? '✓ Technical Details Shown' : '⚙ Show Technical Details'}
            </button>
          </div>
        </div>

        {/* ---- Notebook ---- */}
        <div className="flex flex-col gap-5">
          <div className="bg-white border border-[#e4ddcc] rounded p-4">
            <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">Moments Ledger</span>
            {ledger.length === 0 ? (
              <p className="text-[12px] text-[#4a5a72] mt-2 leading-snug">
                Nothing on the beam yet. Hang a weight and its moment (force × distance) appears here, sorted into
                clockwise and anticlockwise columns.
              </p>
            ) : (
              <div className="mt-2">
                <table className="w-full text-[12px]">
                  <thead>
                    <tr className="text-left text-[#4a5a72] border-b border-[#eee6d3]">
                      <th className="py-1 font-semibold">Load</th>
                      <th className="py-1 font-semibold text-right">F (N)</th>
                      <th className="py-1 font-semibold text-right">d (m)</th>
                      <th className="py-1 font-semibold text-right">ACW (N·m)</th>
                      <th className="py-1 font-semibold text-right">CW (N·m)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ledger.map((r, idx) => (
                      <tr key={idx} className="border-b border-[#f5f0e2]">
                        <td className="py-1 text-[#1b2a41]">{r.label}</td>
                        <td className="py-1 text-right font-mono">{r.force}</td>
                        <td className="py-1 text-right font-mono">{r.dist}</td>
                        <td className="py-1 text-right font-mono text-[#2e7d6b]">
                          {r.side === 'acw' ? (r.moment === null ? '?' : r.moment.toFixed(3)) : ''}
                        </td>
                        <td className="py-1 text-right font-mono text-[#b34a3c]">
                          {r.side === 'cw' ? (r.moment === null ? '?' : r.moment.toFixed(3)) : ''}
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td className="py-1.5 font-semibold text-[#1b2a41]" colSpan={3}>
                        Totals
                      </td>
                      <td className="py-1.5 text-right font-mono font-bold text-[#2e7d6b]">{acwTotal.toFixed(3)}</td>
                      <td className="py-1.5 text-right font-mono font-bold text-[#b34a3c]">{cwTotal.toFixed(3)}</td>
                    </tr>
                  </tbody>
                </table>
                <p className="text-[11.5px] text-[#4a5a72] mt-2 leading-snug">
                  {hasUnknown
                    ? 'Balanced with an unknown on board? Then its moment must make the two totals equal — that is your equation.'
                    : balanced
                      ? 'The principle of moments in action: total clockwise = total anticlockwise about the pivot.'
                      : 'Unequal totals → a resultant moment → the beam turns towards the bigger side.'}
                </p>
              </div>
            )}
          </div>

          {mystery && (
            <div className="bg-white border border-[#e4ddcc] rounded p-4">
              <span className="font-mono text-[11px] tracking-wide uppercase text-[#7a52b3]">Mystery Challenge</span>
              <p className="text-[12px] text-[#4a5a72] mt-1.5 leading-snug">
                A hidden mass is clamped at <strong>{Math.round(mystery.pos * 100)} cm</strong>. Balance the beam with
                known weights, then use the principle of moments to work out what it must be — and check yourself.
              </p>
              <button
                onClick={handleReveal}
                disabled={mystery.revealed}
                className={`w-full mt-2.5 text-[12.5px] font-semibold px-3 py-2 rounded border ${
                  mystery.revealed
                    ? 'bg-[#f5f0e2] text-[#8a94a3] border-[#e4ddcc] cursor-not-allowed'
                    : 'bg-[#7a52b3] text-white border-[#7a52b3] hover:bg-[#684596]'
                }`}
              >
                {mystery.revealed ? `It was ${Math.round(mystery.mass * 1000)} g` : 'Reveal the mass'}
              </button>
            </div>
          )}

          <div className="bg-white border border-[#e4ddcc] rounded p-4">
            <div className="bg-gradient-to-br from-[#fbf5e8] to-[#f6efdc] border border-[#e6d9b8] rounded px-4 py-3.5 text-center mb-3">
              <div className="italic text-[21px] text-[#8f6428]" style={{ fontFamily: 'Georgia, serif' }}>
                M = F × d
              </div>
              <div className="italic text-[15px] text-[#8f6428] mt-1.5" style={{ fontFamily: 'Georgia, serif' }}>
                Σ clockwise moments = Σ anticlockwise moments
              </div>
              <div className="text-[10.5px] text-[#4a5a72] mt-1 not-italic font-sans">(for an object in equilibrium)</div>
            </div>
            <h2 className="font-mono text-[13px] tracking-wide uppercase text-[#4a5a72] border-b border-[#eee6d3] pb-2 mb-3">
              What Each Variable Means
            </h2>
            <div className="space-y-2.5">
              {variables.map((v) => (
                <div key={v.symbol} className="flex gap-3 items-start">
                  <div
                    className="flex-shrink-0 w-9 h-9 rounded bg-[#faf7f0] border border-[#eee6d3] flex items-center justify-center text-[16px] font-bold italic text-[#8f6428]"
                    style={{ fontFamily: 'Georgia, serif' }}
                  >
                    {v.symbol}
                  </div>
                  <p className="text-[12px] text-[#4a5a72] leading-snug">
                    <strong className="text-[#1b2a41]">{v.name}.</strong> {v.def}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
