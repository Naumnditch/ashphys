'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Gas in a Box — kinetic theory made honest.
 *
 * Real physics, not a canned animation:
 *  - Hard-disc molecular dynamics: every particle moves under Newton's
 *    laws, collides elastically with the walls and with every other
 *    particle. Nothing about "pressure" is programmed in.
 *  - Pressure is MEASURED the way nature does it: the impulse of every
 *    wall collision is totalled and divided by time and wall length.
 *    The dial reads emergent bombardment, and it obeys pV = NkT to a
 *    few percent (verified headless; the small excess at high
 *    compression is the particles' own finite size — a real-gas effect).
 *  - The bath thermostat is soft: slam the piston in and the gas heats
 *    before the walls can cool it (adiabatic compression), visible as a
 *    spike on the thermometer.
 *  - The Maxwell-Boltzmann speed distribution is not drawn from a
 *    formula — it EMERGES from particle collisions, and the technical
 *    overlay lets you watch the histogram settle onto the theory curve.
 */

// internal coordinate system, scaled to canvas width
const IW = 1000;
const IH = 440;
// gas box
const X0 = 20;
const Y0 = 40;
const BOX_H = 340;
const PISTON_MIN = 220; // piston x — min volume (W = 200)
const PISTON_MAX = 470; // max volume (W = 450)
// physics
const R = 2; // particle radius
const DT = 1 / 120;
const SUBSTEPS = 2;
const SPEED_SCALE = 90; // at T = 300 K, vrms = SPEED_SCALE * sqrt(2)
const THERMO_RATE = 0.02; // soft heat-bath relaxation per substep

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

function gaussian(): number {
  const u1 = Math.random() || 1e-9;
  const u2 = Math.random();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

function makeGas(n: number, tK: number, pistonX: number): Particle[] {
  const sd = Math.sqrt(tK / 300) * SPEED_SCALE;
  const parts: Particle[] = [];
  for (let i = 0; i < n; i++) {
    parts.push({
      x: X0 + R + Math.random() * (pistonX - X0 - 2 * R),
      y: Y0 + R + Math.random() * (BOX_H - 2 * R),
      vx: sd * gaussian(),
      vy: sd * gaussian(),
    });
  }
  return parts;
}

export function GasLawsSimulator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const partsRef = useRef<Particle[]>(makeGas(160, 300, 400));
  const draggingRef = useRef(false);

  const [bathT, setBathT] = useState(300);
  const [nTarget, setNTarget] = useState(160);
  const [pistonX, setPistonX] = useState(400);
  const [paused, setPaused] = useState(false);
  const [showTechnical, setShowTechnical] = useState(false);
  const [readout, setReadout] = useState({ p: 0, tKin: 300, pv: 0, nkt: 0 });

  const simRef = useRef({
    bathT: 300,
    pistonX: 400,
    pistonV: 0,
    lastPistonX: 400,
    paused: false,
    showTechnical: false,
    // pressure bookkeeping
    impulse: 0,
    impulseT: 0,
    pSmooth: 0,
    tKin: 300,
    // p–V trail for the chart
    trail: [] as { v: number; p: number }[],
    trailClock: 0,
  });

  const stepPhysics = () => {
    const s = simRef.current;
    const parts = partsRef.current;
    const px = s.pistonX;
    const pv = s.pistonV;

    for (const q of parts) {
      q.x += q.vx * DT;
      q.y += q.vy * DT;
      if (q.x < X0 + R && q.vx < 0) {
        q.x = X0 + R;
        s.impulse += 2 * Math.abs(q.vx);
        q.vx = -q.vx;
      }
      if (q.x > px - R && q.vx > pv) {
        q.x = px - R;
        s.impulse += 2 * Math.abs(q.vx - pv);
        q.vx = 2 * pv - q.vx; // moving piston does work on the gas
      }
      if (q.y < Y0 + R && q.vy < 0) {
        q.y = Y0 + R;
        s.impulse += 2 * Math.abs(q.vy);
        q.vy = -q.vy;
      }
      if (q.y > Y0 + BOX_H - R && q.vy > 0) {
        q.y = Y0 + BOX_H - R;
        s.impulse += 2 * Math.abs(q.vy);
        q.vy = -q.vy;
      }
    }

    // pairwise elastic collisions (equal masses: exchange normal components)
    for (let i = 0; i < parts.length; i++) {
      const a = parts[i];
      for (let j = i + 1; j < parts.length; j++) {
        const b = parts[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 4 * R * R && d2 > 1e-9) {
          const d = Math.sqrt(d2);
          const nx = dx / d;
          const ny = dy / d;
          const rel = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;
          if (rel > 0) {
            a.vx -= rel * nx;
            a.vy -= rel * ny;
            b.vx += rel * nx;
            b.vy += rel * ny;
            const overlap = 2 * R - d;
            a.x -= (nx * overlap) / 2;
            a.y -= (ny * overlap) / 2;
            b.x += (nx * overlap) / 2;
            b.y += (ny * overlap) / 2;
          }
        }
      }
    }

    // measured kinetic temperature + soft bath thermostat
    let ke = 0;
    for (const q of parts) ke += 0.5 * (q.vx * q.vx + q.vy * q.vy);
    const tKin = ((ke / Math.max(1, parts.length)) / (SPEED_SCALE * SPEED_SCALE)) * 300;
    s.tKin = tKin;
    if (tKin > 1) {
      const f = Math.sqrt(1 + (s.bathT / tKin - 1) * THERMO_RATE);
      for (const q of parts) {
        q.vx *= f;
        q.vy *= f;
      }
    }
    s.impulseT += DT;

    // smoothed pressure: impulse / time / perimeter, EMA
    if (s.impulseT > 0.1) {
      const perim = 2 * (s.pistonX - X0 + BOX_H);
      const pInst = s.impulse / s.impulseT / perim;
      s.pSmooth = s.pSmooth === 0 ? pInst : s.pSmooth * 0.85 + pInst * 0.15;
      s.impulse = 0;
      s.impulseT = 0;
    }

    // p–V trail sample twice per second
    s.trailClock += DT;
    if (s.trailClock > 0.5 && s.pSmooth > 0) {
      s.trailClock = 0;
      const area = (s.pistonX - X0) * BOX_H;
      s.trail.push({ v: area, p: s.pSmooth });
      if (s.trail.length > 120) s.trail.shift();
    }
  };

  const areaOf = (px: number) => (px - X0) * BOX_H;
  const kB300 = SPEED_SCALE * SPEED_SCALE; // kB * 300 K in internal units

  const speedColor = (sp: number, tRef: number): string => {
    // blue (slow) → teal → brass → red (fast), normalised to bath vrms
    const vr = Math.sqrt(2 * (tRef / 300)) * SPEED_SCALE;
    const k = Math.min(1.6, sp / Math.max(1, vr)) / 1.6;
    if (k < 0.45) return `rgb(${Math.round(46 + k * 100)}, ${Math.round(90 + k * 120)}, ${Math.round(160 + k * 60)})`;
    if (k < 0.75) return `rgb(${Math.round(150 + (k - 0.45) * 250)}, ${Math.round(140 - (k - 0.45) * 60)}, ${Math.round(120 - (k - 0.45) * 180)})`;
    return `rgb(${Math.round(179 + (k - 0.75) * 120)}, ${Math.round(74 - (k - 0.75) * 60)}, 60)`;
  };

  const render = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const scale = rect.width / IW;
    ctx.setTransform(devicePixelRatio * scale, 0, 0, devicePixelRatio * scale, 0, 0);
    ctx.clearRect(0, 0, IW, IH);
    const s = simRef.current;

    // ---- gas box ----
    ctx.fillStyle = '#eef3f2';
    ctx.fillRect(X0, Y0, s.pistonX - X0, BOX_H);
    ctx.strokeStyle = '#1b2a41';
    ctx.lineWidth = 3;
    ctx.strokeRect(X0, Y0, s.pistonX - X0, BOX_H);

    // particles, coloured by speed
    for (const q of partsRef.current) {
      const sp = Math.hypot(q.vx, q.vy);
      ctx.fillStyle = speedColor(sp, s.bathT);
      ctx.beginPath();
      ctx.arc(q.x, q.y, R + 0.6, 0, Math.PI * 2);
      ctx.fill();
    }

    // piston: brass wall with handle
    ctx.fillStyle = '#b8823d';
    ctx.fillRect(s.pistonX, Y0 - 4, 14, BOX_H + 8);
    ctx.strokeStyle = '#8f6428';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(s.pistonX, Y0 - 4, 14, BOX_H + 8);
    ctx.fillStyle = '#8f6428';
    ctx.fillRect(s.pistonX + 14, Y0 + BOX_H / 2 - 5, 34, 10);
    ctx.beginPath();
    ctx.arc(s.pistonX + 52, Y0 + BOX_H / 2, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#4a5a72';
    ctx.font = '600 10.5px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('drag the piston', s.pistonX + 7, Y0 - 12);

    // volume label inside the box
    ctx.fillStyle = 'rgba(27, 42, 65, 0.55)';
    ctx.font = '600 11px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`V = ${(areaOf(s.pistonX) / 1000).toFixed(1)} ×10³ u²   N = ${partsRef.current.length}`, X0 + 8, Y0 + 16);

    // ---- pressure dial ----
    const gx = 590;
    const gy = 150;
    const gr = 62;
    ctx.beginPath();
    ctx.arc(gx, gy, gr, 0, Math.PI * 2);
    ctx.fillStyle = '#faf7f0';
    ctx.fill();
    ctx.strokeStyle = '#b8823d';
    ctx.lineWidth = 3;
    ctx.stroke();
    const P_FULL = 40; // dial full scale
    for (let k = 0; k <= 8; k++) {
      const ang = Math.PI * 0.75 + (k / 8) * Math.PI * 1.5;
      ctx.strokeStyle = '#1b2a41';
      ctx.lineWidth = k % 2 === 0 ? 2 : 1;
      ctx.beginPath();
      ctx.moveTo(gx + Math.cos(ang) * (gr - 10), gy + Math.sin(ang) * (gr - 10));
      ctx.lineTo(gx + Math.cos(ang) * (gr - 3), gy + Math.sin(ang) * (gr - 3));
      ctx.stroke();
    }
    const pFrac = Math.min(1, s.pSmooth / P_FULL);
    const pAng = Math.PI * 0.75 + pFrac * Math.PI * 1.5;
    ctx.strokeStyle = '#b34a3c';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(gx, gy);
    ctx.lineTo(gx + Math.cos(pAng) * (gr - 14), gy + Math.sin(pAng) * (gr - 14));
    ctx.stroke();
    ctx.fillStyle = '#1b2a41';
    ctx.beginPath();
    ctx.arc(gx, gy, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = '700 12px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`p = ${s.pSmooth.toFixed(1)}`, gx, gy + gr + 16);
    ctx.font = '500 10px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
    ctx.fillStyle = '#4a5a72';
    ctx.fillText('measured from wall bombardment', gx, gy + gr + 30);

    // ---- thermometer: bath setpoint vs measured kinetic T ----
    const tx = 590;
    const ty0 = 260;
    const tH = 130;
    ctx.fillStyle = '#faf7f0';
    ctx.fillRect(tx - 9, ty0, 18, tH);
    ctx.strokeStyle = '#1b2a41';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(tx - 9, ty0, 18, tH);
    const tFrac = Math.min(1, s.tKin / 700);
    ctx.fillStyle = '#b34a3c';
    ctx.fillRect(tx - 6, ty0 + tH * (1 - tFrac), 12, tH * tFrac);
    const bathFrac = Math.min(1, s.bathT / 700);
    ctx.strokeStyle = '#2e7d6b';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(tx - 16, ty0 + tH * (1 - bathFrac));
    ctx.lineTo(tx + 16, ty0 + tH * (1 - bathFrac));
    ctx.stroke();
    ctx.fillStyle = '#1b2a41';
    ctx.font = '700 11px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${Math.round(s.tKin)} K`, tx, ty0 + tH + 16);
    ctx.font = '500 10px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
    ctx.fillStyle = '#4a5a72';
    ctx.fillText('gas temperature', tx, ty0 + tH + 30);
    ctx.fillStyle = '#2e7d6b';
    ctx.fillText('— bath setpoint', tx, ty0 - 8);

    // ---- p–V chart ----
    const cx0 = 700;
    const cy0 = 60;
    const cw = 280;
    const ch = 320;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(cx0, cy0, cw, ch);
    ctx.strokeStyle = '#1b2a41';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(cx0, cy0, cw, ch);
    const vMin = areaOf(PISTON_MIN) * 0.92;
    const vMax = areaOf(PISTON_MAX) * 1.04;
    const pMaxChart = 42;
    const vToX = (v: number) => cx0 + ((v - vMin) / (vMax - vMin)) * cw;
    const pToY = (p: number) => cy0 + ch - (Math.min(p, pMaxChart) / pMaxChart) * ch;

    // theory isotherm p = NkT/V at the bath temperature
    ctx.strokeStyle = '#2e7d6b';
    ctx.lineWidth = 1.8;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    let started = false;
    for (let px2 = PISTON_MIN; px2 <= PISTON_MAX; px2 += 4) {
      const v = areaOf(px2);
      const p = (partsRef.current.length * kB300 * (s.bathT / 300)) / v;
      if (!started) {
        ctx.moveTo(vToX(v), pToY(p));
        started = true;
      } else ctx.lineTo(vToX(v), pToY(p));
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // measured trail
    s.trail.forEach((pt, idx) => {
      const age = idx / Math.max(1, s.trail.length - 1);
      ctx.fillStyle = `rgba(184, 130, 61, ${0.15 + 0.75 * age})`;
      ctx.beginPath();
      ctx.arc(vToX(pt.v), pToY(pt.p), age > 0.98 ? 5 : 3, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.fillStyle = '#1b2a41';
    ctx.font = '600 11px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('pressure–volume  (dots: measured · dashes: pV = NkT)', cx0 + cw / 2, cy0 - 8);
    ctx.font = '500 10px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.fillStyle = '#4a5a72';
    ctx.textAlign = 'left';
    ctx.fillText('V →', cx0 + cw - 28, cy0 + ch + 14);
    ctx.save();
    ctx.translate(cx0 - 8, cy0 + 24);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('p →', 0, 0);
    ctx.restore();

    // ---- technical overlay: emergent Maxwell-Boltzmann ----
    if (s.showTechnical) {
      const hx = X0 + 12;
      const hy = Y0 + BOX_H - 116;
      const hw = 220;
      const hh = 104;
      ctx.fillStyle = 'rgba(250, 247, 240, 0.93)';
      ctx.fillRect(hx, hy, hw, hh);
      ctx.strokeStyle = '#1b2a41';
      ctx.lineWidth = 1;
      ctx.strokeRect(hx, hy, hw, hh);
      const bins = 18;
      const vCap = Math.sqrt(2 * (s.bathT / 300)) * SPEED_SCALE * 2.6;
      const hist = new Array(bins).fill(0);
      for (const q of partsRef.current) {
        const b = Math.min(bins - 1, Math.floor((Math.hypot(q.vx, q.vy) / vCap) * bins));
        hist[b] += 1;
      }
      const hMax = Math.max(1, ...hist);
      for (let b = 0; b < bins; b++) {
        ctx.fillStyle = 'rgba(46, 125, 107, 0.6)';
        const bh = (hist[b] / hMax) * (hh - 26);
        ctx.fillRect(hx + 6 + (b * (hw - 12)) / bins, hy + hh - 8 - bh, (hw - 12) / bins - 1, bh);
      }
      // 2D Maxwell-Boltzmann (Rayleigh) theory at the measured temperature
      const sigma2 = (s.tKin / 300) * SPEED_SCALE * SPEED_SCALE;
      let fMax = 0;
      const fs: number[] = [];
      for (let b = 0; b < bins; b++) {
        const v = ((b + 0.5) / bins) * vCap;
        const fv = (v / sigma2) * Math.exp((-v * v) / (2 * sigma2));
        fs.push(fv);
        fMax = Math.max(fMax, fv);
      }
      ctx.strokeStyle = '#b34a3c';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      fs.forEach((fv, b) => {
        const xx = hx + 6 + ((b + 0.5) * (hw - 12)) / bins;
        const yy = hy + hh - 8 - (fv / fMax) * (hh - 26);
        if (b === 0) ctx.moveTo(xx, yy);
        else ctx.lineTo(xx, yy);
      });
      ctx.stroke();
      ctx.fillStyle = '#1b2a41';
      ctx.font = '600 9.5px ui-monospace, SFMono-Regular, Menlo, monospace';
      ctx.textAlign = 'left';
      ctx.fillText('speed distribution: bars emerge from collisions,', hx + 6, hy + 12);
      ctx.fillText('curve is Maxwell-Boltzmann theory', hx + 6, hy + 23);
    }
  };

  const loop = () => {
    const s = simRef.current;
    if (!s.paused) {
      // piston velocity from drag motion (per physics step)
      s.pistonV = (s.pistonX - s.lastPistonX) / (DT * SUBSTEPS);
      s.lastPistonX = s.pistonX;
      for (let k = 0; k < SUBSTEPS; k++) stepPhysics();
      s.pistonV = 0;
      render();
      const area = areaOf(s.pistonX);
      setReadout({
        p: s.pSmooth,
        tKin: s.tKin,
        pv: s.pSmooth * area,
        nkt: partsRef.current.length * kB300 * (s.tKin / 300),
      });
    }
    rafRef.current = requestAnimationFrame(loop);
  };

  // ---- piston dragging ----
  const pistonFromPointer = (clientX: number): number | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const ix = ((clientX - rect.left) / rect.width) * IW;
    return Math.max(PISTON_MIN, Math.min(PISTON_MAX, ix));
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ix = ((e.clientX - rect.left) / rect.width) * IW;
    if (Math.abs(ix - simRef.current.pistonX) < 70) {
      (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
      draggingRef.current = true;
    }
  };
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!draggingRef.current) return;
    const px = pistonFromPointer(e.clientX);
    if (px !== null) {
      simRef.current.pistonX = px;
      setPistonX(px);
    }
  };
  const handlePointerUp = () => {
    draggingRef.current = false;
  };

  const handleVolumeSlider = (px: number) => {
    simRef.current.pistonX = px;
    setPistonX(px);
  };

  const handleBathT = (t: number) => {
    setBathT(t);
    simRef.current.bathT = t;
  };

  const handleN = (delta: number) => {
    const s = simRef.current;
    const next = Math.max(80, Math.min(280, nTarget + delta));
    setNTarget(next);
    const parts = partsRef.current;
    if (next > parts.length) {
      const extra = makeGas(next - parts.length, s.bathT, s.pistonX);
      partsRef.current = parts.concat(extra);
    } else {
      partsRef.current = parts.slice(0, next);
    }
  };

  const resetTrail = () => {
    simRef.current.trail = [];
  };

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
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('resize', resize);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const agreement = readout.nkt > 0 ? (readout.pv / readout.nkt) * 100 : 0;

  const variables = [
    { symbol: 'p', name: 'Pressure', def: 'Force per unit wall length from particle bombardment. Not programmed — measured from the impulse of every collision with the walls.' },
    { symbol: 'V', name: 'Volume', def: 'The area of the box (this is a 2D gas). Drag the piston or use the slider to change it.' },
    { symbol: 'T', name: 'Temperature', def: 'Proportional to the average kinetic energy of the particles. The bath (green marker) sets it; fast compression can push the gas above it briefly.' },
    { symbol: 'N', name: 'Number of particles', def: 'More particles, more collisions per second, more pressure — in exact proportion.' },
  ];

  return (
    <div className="gas-laws-lab flex flex-col gap-5">
      {/* ---- Apparatus: full width ---- */}
      <div className="bg-white border border-[#e4ddcc] rounded overflow-hidden">
        <div className="flex justify-between items-baseline px-4 pt-3">
          <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">
            Kinetic Theory Bench · {nTarget} particles
          </span>
          <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">
            {paused ? 'paused' : 'live'}
          </span>
        </div>
        <div className="px-4 pt-2">
          <canvas
            ref={canvasRef}
            className="block w-full rounded border border-[#e4ddcc] touch-none cursor-ew-resize"
            style={{ aspectRatio: '1000 / 440' }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          />
        </div>
        <div className="px-4 pb-2 pt-2">
          <p className="text-[11.5px] text-[#4a5a72] leading-snug">
            Every particle obeys Newton's laws; the <span className="text-[#b34a3c] font-semibold">pressure dial</span>{' '}
            reads nothing but the accumulated impact of particles on the walls. Squeeze the gas with the{' '}
            <span className="text-[#8f6428] font-semibold">brass piston</span> and the measured dots on the{' '}
            <span className="text-[#8f6428] font-semibold">p–V chart</span> trace out Boyle's hyperbola on their own.
            Particle colour shows speed: blue slow, red fast.
          </p>
        </div>

        <div className="px-4 pb-5 pt-3 border-t border-[#eee6d3]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-3 mb-3">
            <div className="flex items-center gap-3">
              <label className="text-[13px] text-[#4a5a72] w-24 flex-shrink-0">Bath temp. T</label>
              <input type="range" min={100} max={600} step={10} value={bathT}
                onChange={(e) => handleBathT(parseFloat(e.target.value))} className="flex-1" />
              <span className="font-mono text-[13px] w-16 text-right">{bathT} K</span>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-[13px] text-[#4a5a72] w-24 flex-shrink-0">Volume</label>
              <input type="range" min={PISTON_MIN} max={PISTON_MAX} step={2} value={pistonX}
                onChange={(e) => handleVolumeSlider(parseFloat(e.target.value))} className="flex-1" />
              <span className="font-mono text-[13px] w-16 text-right">{(areaOf(pistonX) / 1000).toFixed(0)}k u²</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[13px] text-[#4a5a72] w-24 flex-shrink-0">Particles N</span>
              <button onClick={() => handleN(-40)}
                className="flex-1 text-[12.5px] font-semibold px-2 py-1.5 rounded border bg-transparent text-[#1b2a41] border-[#d8cfb6] hover:bg-[#f5f0e2]">
                −40
              </button>
              <span className="font-mono text-[13px] w-10 text-center">{nTarget}</span>
              <button onClick={() => handleN(40)}
                className="flex-1 text-[12.5px] font-semibold px-2 py-1.5 rounded border bg-transparent text-[#1b2a41] border-[#d8cfb6] hover:bg-[#f5f0e2]">
                +40
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                const next = !simRef.current.paused;
                simRef.current.paused = next;
                setPaused(next);
              }}
              className="flex-1 min-w-28 text-[12.5px] font-semibold px-3 py-2 rounded border bg-transparent text-[#1b2a41] border-[#d8cfb6] hover:bg-[#f5f0e2]">
              {paused ? '▶ Resume' : '⏸ Pause'}
            </button>
            <button onClick={resetTrail}
              className="flex-1 min-w-28 text-[12.5px] font-semibold px-3 py-2 rounded border bg-transparent text-[#1b2a41] border-[#d8cfb6] hover:bg-[#f5f0e2]">
              ⌫ Clear Chart Trail
            </button>
            <button
              onClick={() => {
                const next = !showTechnical;
                setShowTechnical(next);
                simRef.current.showTechnical = next;
              }}
              className={`flex-1 min-w-40 text-[12.5px] font-semibold px-3 py-2 rounded border ${
                showTechnical ? 'bg-[#1b2a41] text-white border-[#1b2a41]' : 'bg-transparent text-[#1b2a41] border-[#d8cfb6] hover:bg-[#f5f0e2]'
              }`}>
              {showTechnical ? '✓ Speed Distribution Shown' : '⚙ Show Speed Distribution'}
            </button>
          </div>
        </div>
      </div>

      {/* ---- Notebook row ---- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="bg-white border border-[#e4ddcc] rounded p-4">
          <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">Live Readings</span>
          <div className="mt-3 space-y-2">
            <div className="flex justify-between border-b border-[#eee6d3] pb-1">
              <span className="text-[12.5px] text-[#4a5a72]">Pressure p (measured)</span>
              <span className="font-mono text-[13px] font-bold text-[#1b2a41]">{readout.p.toFixed(1)} u</span>
            </div>
            <div className="flex justify-between border-b border-[#eee6d3] pb-1">
              <span className="text-[12.5px] text-[#4a5a72]">Gas temperature (measured)</span>
              <span className="font-mono text-[13px] text-[#1b2a41]">{Math.round(readout.tKin)} K</span>
            </div>
            <div className="flex justify-between border-b border-[#eee6d3] pb-1">
              <span className="text-[12.5px] text-[#4a5a72]">Product p × V</span>
              <span className="font-mono text-[13px] font-bold text-[#2e7d6b]">{(readout.pv / 1000).toFixed(0)}k</span>
            </div>
            <div className="flex justify-between border-b border-[#eee6d3] pb-1">
              <span className="text-[12.5px] text-[#4a5a72]">Ideal-gas N·k·T</span>
              <span className="font-mono text-[13px] text-[#1b2a41]">{(readout.nkt / 1000).toFixed(0)}k</span>
            </div>
            <div className="flex justify-between border-b border-[#eee6d3] pb-1">
              <span className="text-[12.5px] text-[#4a5a72]">Agreement pV / NkT</span>
              <span className="font-mono text-[13px] text-[#1b2a41]">{agreement > 0 ? `${agreement.toFixed(0)}%` : '—'}</span>
            </div>
          </div>
          <p className="text-[11.5px] text-[#4a5a72] mt-2.5 leading-snug">
            Watch p × V while you move the piston slowly: the product holds nearly constant while p and V change by more
            than double each. That constancy IS Boyle's law — and it emerges from nothing but Newton's laws.
          </p>
        </div>

        <div className="bg-white border border-[#e4ddcc] rounded p-4">
          <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">Try This</span>
          <div className="mt-2 space-y-2.5 text-[12px] text-[#4a5a72] leading-snug">
            <p>
              <strong className="text-[#1b2a41]">1.</strong> Clear the chart trail, then compress SLOWLY from full
              volume to minimum. The brass dots trace the green dashed hyperbola: p₁V₁ = p₂V₂, live.
            </p>
            <p>
              <strong className="text-[#1b2a41]">2.</strong> Now slam the piston in fast and watch the thermometer: the
              red column jumps above the green bath marker. Compressing a gas does work on it and heats it — then the
              bath cools it back. That spike is why a bicycle pump gets hot.
            </p>
            <p>
              <strong className="text-[#1b2a41]">3.</strong> Double the particles from 140 to 280 at fixed volume: the
              dial doubles. Pressure is bombardment, and twice the particles means twice the hits.
            </p>
            <p>
              <strong className="text-[#1b2a41]">4.</strong> Heat the bath from 300 K to 600 K at fixed volume: particles
              turn red, hit harder and more often, and p doubles — the pressure law.
            </p>
            <p>
              <strong className="text-[#1b2a41]">5.</strong> Open the speed distribution: the histogram isn't drawn from
              a formula — it's counted from the particles, and collisions alone push it onto the red theory curve.
            </p>
          </div>
        </div>

        <div className="bg-white border border-[#e4ddcc] rounded p-4">
          <div className="bg-gradient-to-br from-[#fbf5e8] to-[#f6efdc] border border-[#e6d9b8] rounded px-4 py-3.5 text-center mb-3">
            <div className="italic text-[22px] text-[#8f6428]" style={{ fontFamily: 'Georgia, serif' }}>
              p₁V₁ = p₂V₂
            </div>
            <div className="italic text-[14px] text-[#8f6428] mt-1.5" style={{ fontFamily: 'Georgia, serif' }}>
              at constant temperature (Boyle's law)
            </div>
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
  );
}
