'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Double-Slit Lab — the same physics engine as the ripple tank,
 * dedicated to Young's experiment and the fringe equation.
 *
 * Real physics, not a canned animation:
 *  - Identical FDTD wave engine to /simulations/ripple-tank: the 2D wave
 *    equation with velocity-damped absorbing beaches, a one-way soft
 *    dipper behind a housing, and the same rendering
 *  - The slit separation a physically moves the slits; the screen
 *    distance D physically moves a measurement line in the tank
 *  - A detector integrates the wave envelope along that screen line and
 *    the fringe spacing is MEASURED from the actual field, then compared
 *    with the prediction x = λD/a — including the honest mismatch when
 *    the small-angle assumption (D ≫ a) starts to strain
 */

const GW = 176;
const GH = 104;
const CM_PER_CELL = 0.5;
const C_DEEP = 0.5; // cells per step
const STEPS_PER_FRAME = 2;
const STEPS_PER_SEC = 120;
const V_DEEP = C_DEEP * STEPS_PER_SEC * CM_PER_CELL; // 30 cm/s
const SIDE_SPONGE = 20;
const G_RIGHT = 0.35;
const G_TB = 0.22;
const SRC_X = 10; // dipper housing occupies x <= SRC_X
const BARRIER_X = 56; // slit barrier, 28 cm from the left wall
const GAP_HALF = 3; // each slit ≈ 3 cm wide

interface Field {
  u: Float32Array;
  uPrev: Float32Array;
  c2: Float32Array;
  wall: Uint8Array;
  g: Float32Array;
}

function buildField(aCm: number): Field {
  const n = GW * GH;
  const u = new Float32Array(n);
  const uPrev = new Float32Array(n);
  const c2 = new Float32Array(n).fill(C_DEEP * C_DEEP);
  const wall = new Uint8Array(n);
  const g = new Float32Array(n);
  const halfSepCells = (aCm / CM_PER_CELL) / 2;

  for (let y = 0; y < GH; y++) {
    for (let x = 0; x < GW; x++) {
      const i = y * GW + x;
      // velocity-damped beaches, identical to the ripple tank
      let gv = 0;
      const eTB = Math.min(y, GH - 1 - y);
      if (eTB < SIDE_SPONGE) {
        const r = 1 - eTB / SIDE_SPONGE;
        gv = Math.max(gv, G_TB * r * r);
      }
      const eR = GW - 1 - x;
      if (eR < SIDE_SPONGE) {
        const r = 1 - eR / SIDE_SPONGE;
        gv = Math.max(gv, G_RIGHT * r * r);
      }
      if (x < SRC_X) {
        const r = 1 - x / SRC_X;
        gv = Math.max(gv, 0.6 * r * r + 0.04);
      }
      g[i] = gv;

      // the double slit: two gaps, centres a apart — moving the slider
      // physically rebuilds this barrier
      const inGap =
        Math.abs(y - (GH / 2 - halfSepCells)) <= GAP_HALF ||
        Math.abs(y - (GH / 2 + halfSepCells)) <= GAP_HALF;
      if (Math.abs(x - BARRIER_X) < 2 && !inGap) wall[i] = 1;
    }
  }
  return { u, uPrev, c2, wall, g };
}

/** Peaks of the smoothed envelope along the screen line → mean fringe spacing (cm). */
function measureFringeSpacing(env: Float32Array): { xCm: number | null; peaks: number[] } {
  const y0 = SIDE_SPONGE + 2;
  const y1 = GH - SIDE_SPONGE - 2;
  const sm = new Float32Array(GH);
  let mx = 0;
  for (let y = y0 + 1; y < y1 - 1; y++) {
    sm[y] = (env[y - 1] + 2 * env[y] + env[y + 1]) / 4;
    mx = Math.max(mx, sm[y]);
  }
  if (mx < 0.08) return { xCm: null, peaks: [] }; // detector still warming up
  const peaks: number[] = [];
  for (let y = y0 + 2; y < y1 - 2; y++) {
    if (sm[y] > sm[y - 1] && sm[y] >= sm[y + 1] && sm[y] > 0.35 * mx) {
      if (peaks.length === 0 || y - peaks[peaks.length - 1] > 4) peaks.push(y);
    }
  }
  if (peaks.length < 2) return { xCm: null, peaks };
  let sum = 0;
  for (let k = 1; k < peaks.length; k++) sum += peaks[k] - peaks[k - 1];
  return { xCm: (sum / (peaks.length - 1)) * CM_PER_CELL, peaks };
}

/**
 * Exact wave theory: the n-th bright fringe sits where the true path
 * difference √(D²+(y+a/2)²) − √(D²+(y−a/2)²) equals nλ. Solved by
 * bisection — no small-angle assumption. Returns the mean fringe spacing
 * over nSide orders each side of centre (matching what the detector
 * averages), or null when nλ ≥ a (no such fringe exists).
 */
function exactFringeMean(lamCm: number, aCm: number, dCm: number, nSide: number): number | null {
  const delta = (y: number) =>
    Math.hypot(dCm, y + aCm / 2) - Math.hypot(dCm, y - aCm / 2);
  const solve = (target: number): number | null => {
    if (target >= aCm) return null; // Δ can never reach nλ
    let lo = 0;
    let hi = 500;
    for (let k = 0; k < 60; k++) {
      const mid = (lo + hi) / 2;
      if (delta(mid) < target) lo = mid;
      else hi = mid;
    }
    return (lo + hi) / 2;
  };
  const yN = solve(nSide * lamCm);
  return yN === null ? null : yN / nSide;
}

export function DoubleSlitSimulator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offscreenRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<ImageData | null>(null);
  const fieldRef = useRef<Field>(buildField(12));
  const envRef = useRef<Float32Array>(new Float32Array(GH));
  const rafRef = useRef<number | null>(null);
  const timeRef = useRef(0);
  const lastStrobeCycleRef = useRef(-1);

  const [freq, setFreq] = useState(9);
  const [aCm, setACm] = useState(12);
  const [dCm, setDCm] = useState(35);
  const [paused, setPaused] = useState(false);
  const [strobe, setStrobe] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [showTechnical, setShowTechnical] = useState(false);
  const [measured, setMeasured] = useState<number | null>(null);
  const [peakCount, setPeakCount] = useState(0);

  const simRef = useRef({ freq: 9, aCm: 12, dCm: 35, paused: false, strobe: false, speed: 1, acc: 0, showTechnical: false });

  const lambdaCm = V_DEEP / freq;
  const predictedX = (lambdaCm * dCm) / aCm; // x = λD/a, all in cm
  const nSide = peakCount >= 3 ? Math.floor((peakCount - 1) / 2) : 1;
  const exactX = exactFringeMean(lambdaCm, aCm, dCm, nSide);

  const screenXCells = () => BARRIER_X + Math.round(simRef.current.dCm / CM_PER_CELL);

  const stepPhysics = () => {
    const s = simRef.current;
    const f = fieldRef.current;
    const { c2, wall, g } = f;

    {
      timeRef.current += 1 / STEPS_PER_SEC;
      const t = timeRef.current;
      const u = f.u;
      const uPrev = f.uPrev;
      for (let y = 1; y < GH - 1; y++) {
        const row = y * GW;
        for (let x = 1; x < GW - 1; x++) {
          const i = row + x;
          if (wall[i]) {
            uPrev[i] = 0;
            continue;
          }
          const lap = u[i - 1] + u[i + 1] + u[i - GW] + u[i + GW] - 4 * u[i];
          uPrev[i] = (2 * u[i] - (1 - g[i]) * uPrev[i] + c2[i] * lap) / (1 + g[i]);
        }
      }
      f.u = uPrev;
      f.uPrev = u;

      const gain = 0.3 * (s.freq / 6);
      const drive = gain * Math.sin(2 * Math.PI * s.freq * t);
      const newU = f.u;
      for (let y = 1; y < GH - 1; y++) newU[y * GW + SRC_X] += drive;

      // detector: peak-hold envelope with slow decay along the screen line
      const sx = screenXCells();
      const env = envRef.current;
      for (let y = 0; y < GH; y++) {
        const v = Math.abs(f.u[y * GW + sx]);
        env[y] = Math.max(env[y] * 0.997, v);
      }
    }
  };

  const render = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (!offscreenRef.current) {
      offscreenRef.current = document.createElement('canvas');
      offscreenRef.current.width = GW;
      offscreenRef.current.height = GH;
    }
    const off = offscreenRef.current;
    const offCtx = off.getContext('2d');
    if (!offCtx) return;
    if (!imageRef.current) imageRef.current = offCtx.createImageData(GW, GH);
    const img = imageRef.current;
    const data = img.data;

    const f = fieldRef.current;
    for (let i = 0; i < GW * GH; i++) {
      const p = i * 4;
      const cx = i % GW;
      if (cx <= SRC_X) {
        data[p] = 27; data[p + 1] = 42; data[p + 2] = 65; data[p + 3] = 255;
        continue;
      }
      if (f.wall[i]) {
        data[p] = 184; data[p + 1] = 130; data[p + 2] = 61; data[p + 3] = 255;
        continue;
      }
      const raw = f.u[i] * 1.15;
      const mag = Math.min(1, Math.abs(raw));
      const v = Math.sign(raw) * Math.pow(mag, 0.65);
      const baseR = 205;
      const baseG = 224;
      const baseB = 218;
      if (v >= 0) {
        const k = v;
        data[p] = baseR + (250 - baseR) * k;
        data[p + 1] = baseG + (250 - baseG) * k;
        data[p + 2] = baseB + (247 - baseB) * k;
      } else {
        const k = -v;
        data[p] = baseR + (27 - baseR) * k;
        data[p + 1] = baseG + (62 - baseG) * k;
        data[p + 2] = baseB + (88 - baseB) * k;
      }
      data[p + 3] = 255;
    }
    offCtx.putImageData(img, 0, 0);

    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    const px = (cells: number) => (cells / GW) * w;
    const py = (cells: number) => (cells / GH) * h;
    ctx.imageSmoothingEnabled = true;
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(off, 0, 0, w, h);

    // 10 cm grid
    ctx.strokeStyle = 'rgba(27, 42, 65, 0.16)';
    ctx.lineWidth = 1;
    ctx.font = '500 9px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.fillStyle = 'rgba(27, 42, 65, 0.45)';
    for (let cm = 10; cm < GW * CM_PER_CELL; cm += 10) {
      const x = (cm / (GW * CM_PER_CELL)) * w;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
      ctx.fillText(`${cm}`, x + 2, h - 4);
    }
    for (let cm = 10; cm < GH * CM_PER_CELL; cm += 10) {
      const y = (cm / (GH * CM_PER_CELL)) * h;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    const s = simRef.current;
    const sx = screenXCells();
    const sxPx = px(sx + 0.5);

    // ---- screen line (the detector) ----
    ctx.strokeStyle = '#2e7d6b';
    ctx.lineWidth = 2;
    ctx.setLineDash([7, 5]);
    ctx.beginPath();
    ctx.moveTo(sxPx, py(2));
    ctx.lineTo(sxPx, py(GH - 2));
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#2e7d6b';
    ctx.font = '600 10.5px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('screen', sxPx, py(2) + 12);

    // ---- intensity profile hugging the screen line ----
    const env = envRef.current;
    const { peaks } = measureFringeSpacing(env);
    let envMax = 0;
    for (let y = SIDE_SPONGE; y < GH - SIDE_SPONGE; y++) envMax = Math.max(envMax, env[y]);
    if (envMax > 0.05) {
      const profW = Math.min(w - sxPx - 8, w * 0.09);
      ctx.beginPath();
      ctx.moveTo(sxPx, py(SIDE_SPONGE));
      for (let y = SIDE_SPONGE; y < GH - SIDE_SPONGE; y++) {
        ctx.lineTo(sxPx + (env[y] / envMax) * profW, py(y + 0.5));
      }
      ctx.lineTo(sxPx, py(GH - SIDE_SPONGE));
      ctx.closePath();
      ctx.fillStyle = 'rgba(184, 130, 61, 0.4)';
      ctx.fill();
      ctx.strokeStyle = '#b8823d';
      ctx.lineWidth = 1.6;
      ctx.stroke();

      // fringe-spacing bracket between the first two detected maxima
      if (peaks.length >= 2) {
        const b0 = py(peaks[0] + 0.5);
        const b1 = py(peaks[1] + 0.5);
        const bx = sxPx + profW + 8;
        ctx.strokeStyle = '#1b2a41';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(bx - 5, b0);
        ctx.lineTo(bx + 3, b0);
        ctx.moveTo(bx - 5, b1);
        ctx.lineTo(bx + 3, b1);
        ctx.moveTo(bx - 1, b0);
        ctx.lineTo(bx - 1, b1);
        ctx.stroke();
        ctx.fillStyle = '#1b2a41';
        ctx.font = 'italic 700 12px Georgia, serif';
        ctx.textAlign = 'left';
        ctx.fillText('x', bx + 6, (b0 + b1) / 2 + 4);
      }
      // mark detected maxima on the profile
      ctx.fillStyle = '#b34a3c';
      peaks.forEach((yy) => {
        ctx.beginPath();
        ctx.arc(sxPx + (env[yy] / envMax) * profW, py(yy + 0.5), 3, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // ---- a bracket at the slits ----
    const halfSep = (s.aCm / CM_PER_CELL) / 2;
    const bxPx = px(BARRIER_X);
    ctx.strokeStyle = '#8f6428';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(bxPx - 14, py(GH / 2 - halfSep));
    ctx.lineTo(bxPx - 22, py(GH / 2 - halfSep));
    ctx.moveTo(bxPx - 14, py(GH / 2 + halfSep));
    ctx.lineTo(bxPx - 22, py(GH / 2 + halfSep));
    ctx.moveTo(bxPx - 18, py(GH / 2 - halfSep));
    ctx.lineTo(bxPx - 18, py(GH / 2 + halfSep));
    ctx.stroke();
    ctx.fillStyle = '#8f6428';
    ctx.font = 'italic 700 12px Georgia, serif';
    ctx.textAlign = 'right';
    ctx.fillText(`a = ${s.aCm} cm`, bxPx - 26, py(GH / 2) + 4);

    // ---- D bracket along the bottom ----
    const dyPx = h - 16;
    ctx.strokeStyle = '#4a5a72';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(bxPx, dyPx - 5);
    ctx.lineTo(bxPx, dyPx + 5);
    ctx.moveTo(sxPx, dyPx - 5);
    ctx.lineTo(sxPx, dyPx + 5);
    ctx.moveTo(bxPx, dyPx);
    ctx.lineTo(sxPx, dyPx);
    ctx.stroke();
    ctx.fillStyle = '#4a5a72';
    ctx.font = 'italic 700 11.5px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText(`D = ${s.dCm} cm`, (bxPx + sxPx) / 2, dyPx - 8);

    if (s.showTechnical) {
      ctx.textAlign = 'left';
      ctx.font = '600 11px ui-monospace, SFMono-Regular, Menlo, monospace';
      ctx.fillStyle = '#1b2a41';
      const m = measureFringeSpacing(env);
      const lam = V_DEEP / s.freq;
      const pred = (lam * s.dCm) / s.aCm;
      const lines = [
        `same engine as the ripple tank: u_tt = c²·∇²u, ${GW}×${GH} cells, ${STEPS_PER_SEC} steps/s`,
        `λ = v/f = ${lam.toFixed(1)} cm   predicted x = λD/a = ${pred.toFixed(1)} cm`,
        m.xCm !== null ? `measured x (peak spacing on the detector) = ${m.xCm.toFixed(1)} cm` : 'measured x: detector integrating…',
        `x = λD/a assumes D ≫ a — push D down or a up and watch the mismatch grow`,
      ];
      lines.forEach((line, idx) => ctx.fillText(line, 12, 20 + idx * 15));
    }
  };

  const loop = () => {
    const s = simRef.current;
    if (!s.paused) {
      s.acc += s.speed * STEPS_PER_FRAME;
      const whole = Math.floor(s.acc);
      s.acc -= whole;
      for (let k = 0; k < whole; k++) stepPhysics();
      if (s.strobe) {
        const cycle = Math.floor(timeRef.current * s.freq);
        if (cycle !== lastStrobeCycleRef.current) {
          lastStrobeCycleRef.current = cycle;
          render();
        }
      } else {
        render();
      }
      const m = measureFringeSpacing(envRef.current);
      setMeasured(m.xCm);
      setPeakCount(m.peaks.length);
    }
    rafRef.current = requestAnimationFrame(loop);
  };

  const resetDetector = () => {
    envRef.current = new Float32Array(GH);
  };

  const handleFreq = (f: number) => {
    setFreq(f);
    simRef.current.freq = f;
    resetDetector(); // the fringe pattern changes, let the detector re-form
  };

  const handleA = (a: number) => {
    setACm(a);
    simRef.current.aCm = a;
    // moving the slits physically rebuilds the barrier
    fieldRef.current = buildField(a);
    timeRef.current = 0;
    lastStrobeCycleRef.current = -1;
    resetDetector();
  };

  const handleD = (d: number) => {
    setDCm(d);
    simRef.current.dCm = d;
    resetDetector(); // the screen line moves; re-integrate there
  };

  const handlePause = () => {
    const next = !simRef.current.paused;
    simRef.current.paused = next;
    setPaused(next);
    if (!next) lastStrobeCycleRef.current = -1;
  };

  const handleStrobe = () => {
    const next = !simRef.current.strobe;
    simRef.current.strobe = next;
    setStrobe(next);
    lastStrobeCycleRef.current = -1;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const resize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * devicePixelRatio;
      canvas.height = rect.height * devicePixelRatio;
      canvas.getContext('2d')?.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
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

  const variables = [
    { symbol: 'x', name: 'Fringe spacing', def: 'Distance between adjacent lines of biggest ripples on the screen. Measured live from the detector, in cm.' },
    { symbol: 'λ', name: 'Wavelength', def: 'Of the water waves: λ = v/f, with v = 30 cm/s fixed by the water. The frequency slider is your wavelength dial.' },
    { symbol: 'D', name: 'Slit-to-screen distance', def: 'From the barrier to the dashed detector line. Bigger D spreads the fringes out.' },
    { symbol: 'a', name: 'Slit separation', def: 'Between the centres of the two slits. Smaller a gives WIDER fringes — they are inversely related.' },
  ];

  return (
    <div className="double-slit-lab flex flex-col gap-5">
      {/* ---- Tank: full width ---- */}
      <div className="bg-white border border-[#e4ddcc] rounded overflow-hidden">
        <div className="flex justify-between items-baseline px-4 pt-3">
          <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">
            Double-Slit Ripple Tank · {Math.round(GW * CM_PER_CELL)} × {Math.round(GH * CM_PER_CELL)} cm
          </span>
          <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">
            {paused ? 'paused' : strobe ? 'strobe' : 'live'}
          </span>
        </div>
        <div className="px-4 pt-2">
          <canvas ref={canvasRef} className="block w-full rounded border border-[#e4ddcc]" style={{ aspectRatio: '176 / 104' }} />
        </div>
        <div className="px-4 pb-2 pt-2">
          <p className="text-[11.5px] text-[#4a5a72] leading-snug">
            Same tank, same physics as the ripple tank — dedicated to one experiment.{' '}
            <span className="text-[#b8823d] font-semibold">Brass</span> = the double-slit barrier (the a slider moves the
            slits). <span className="text-[#2e7d6b] font-semibold">Dashed green line</span> = the detector screen (the D
            slider moves it). The <span className="text-[#b8823d] font-semibold">brass profile</span> on its right is the
            integrated wave intensity — its <span className="text-[#b34a3c] font-semibold">red dots</span> are the bright
            fringes the sim itself detects.
          </p>
        </div>

        <div className="px-4 pb-5 pt-3 border-t border-[#eee6d3]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-3 mb-3">
            <div className="flex items-center gap-3">
              <label className="text-[13px] text-[#4a5a72] w-24 flex-shrink-0">Dipper f</label>
              <input type="range" min={4} max={12} step={0.5} value={freq}
                onChange={(e) => handleFreq(parseFloat(e.target.value))} className="flex-1" />
              <span className="font-mono text-[13px] w-16 text-right">{freq.toFixed(1)} Hz</span>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-[13px] text-[#4a5a72] w-24 flex-shrink-0">Slit sep. a</label>
              <input type="range" min={6} max={20} step={1} value={aCm}
                onChange={(e) => handleA(parseFloat(e.target.value))} className="flex-1" />
              <span className="font-mono text-[13px] w-16 text-right">{aCm} cm</span>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-[13px] text-[#4a5a72] w-24 flex-shrink-0">Distance D</label>
              <input type="range" min={15} max={45} step={1} value={dCm}
                onChange={(e) => handleD(parseFloat(e.target.value))} className="flex-1" />
              <span className="font-mono text-[13px] w-16 text-right">{dCm} cm</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            <button onClick={handlePause}
              className="flex-1 min-w-28 text-[12.5px] font-semibold px-3 py-2 rounded border bg-transparent text-[#1b2a41] border-[#d8cfb6] hover:bg-[#f5f0e2]">
              {paused ? '▶ Resume' : '⏸ Pause'}
            </button>
            <button onClick={handleStrobe}
              className={`flex-1 min-w-28 text-[12.5px] font-semibold px-3 py-2 rounded border ${
                strobe ? 'bg-[#2e7d6b] text-white border-[#2e7d6b]' : 'bg-transparent text-[#1b2a41] border-[#d8cfb6] hover:bg-[#f5f0e2]'
              }`}>
              {strobe ? '✓ Stroboscope' : '◉ Stroboscope'}
            </button>
            <div className="flex items-center gap-2 flex-1 min-w-40">
              <span className="text-[13px] text-[#4a5a72]">Speed</span>
              {[0.25, 0.5, 1].map((sp) => (
                <button key={sp}
                  onClick={() => { setSpeed(sp); simRef.current.speed = sp; }}
                  className={`flex-1 text-[12.5px] font-semibold px-2 py-1.5 rounded border ${
                    speed === sp ? 'bg-[#1b2a41] text-white border-[#1b2a41]' : 'bg-transparent text-[#1b2a41] border-[#d8cfb6] hover:bg-[#f5f0e2]'
                  }`}>
                  {sp === 0.25 ? '¼×' : sp === 0.5 ? '½×' : '1×'}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              const next = !showTechnical;
              setShowTechnical(next);
              simRef.current.showTechnical = next;
            }}
            className={`w-full text-[12.5px] font-semibold px-3 py-2 rounded border ${
              showTechnical ? 'bg-[#1b2a41] text-white border-[#1b2a41]' : 'bg-transparent text-[#1b2a41] border-[#d8cfb6] hover:bg-[#f5f0e2]'
            }`}>
            {showTechnical ? '✓ Technical Details Shown' : '⚙ Show Technical Details'}
          </button>
        </div>
      </div>

      {/* ---- Notebook row ---- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="bg-white border border-[#e4ddcc] rounded p-4">
          <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">Live Readings</span>
          <div className="mt-3 space-y-2">
            <div className="flex justify-between border-b border-[#eee6d3] pb-1">
              <span className="text-[12.5px] text-[#4a5a72]">Wavelength λ = v/f</span>
              <span className="font-mono text-[13px] text-[#1b2a41]">{lambdaCm.toFixed(1)} cm</span>
            </div>
            <div className="flex justify-between border-b border-[#eee6d3] pb-1">
              <span className="text-[12.5px] text-[#4a5a72]">Predicted x = λD/a</span>
              <span className="font-mono text-[13px] font-bold text-[#1b2a41]">{predictedX.toFixed(1)} cm</span>
            </div>
            <div className="flex justify-between border-b border-[#eee6d3] pb-1">
              <span className="text-[12.5px] text-[#4a5a72]">Exact wave theory</span>
              <span className="font-mono text-[13px] text-[#1b2a41]">
                {exactX !== null ? `${exactX.toFixed(1)} cm` : '—'}
              </span>
            </div>
            <div className="flex justify-between border-b border-[#eee6d3] pb-1">
              <span className="text-[12.5px] text-[#4a5a72]">Measured x (detector)</span>
              <span className="font-mono text-[13px] font-bold text-[#2e7d6b]">
                {measured !== null ? `${measured.toFixed(1)} cm` : 'integrating…'}
              </span>
            </div>
            <div className="flex justify-between border-b border-[#eee6d3] pb-1">
              <span className="text-[12.5px] text-[#4a5a72]">Measured vs theory</span>
              <span className="font-mono text-[13px] text-[#1b2a41]">
                {measured !== null && exactX !== null ? `${((measured / exactX) * 100).toFixed(0)}%` : '—'}
              </span>
            </div>
          </div>
          <p className="text-[11.5px] text-[#4a5a72] mt-2.5 leading-snug">
            Three numbers, one story: the formula x = λD/a is a far-field approximation; the exact row solves the true
            path-difference geometry (no approximation); and the measured row is read off the actual wave field. Measured
            should track the exact theory closely — the gap to the formula is its small print, made visible.
          </p>
        </div>

        <div className="bg-white border border-[#e4ddcc] rounded p-4">
          <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">Try This</span>
          <div className="mt-2 space-y-2.5 text-[12px] text-[#4a5a72] leading-snug">
            <p>
              <strong className="text-[#1b2a41]">1.</strong> Watch the slits move as you slide a — then halve a and see
              the fringes spread to double the spacing. Inversely related.
            </p>
            <p>
              <strong className="text-[#1b2a41]">2.</strong> Slide the screen out with D and watch the same fringes fan
              out wider: x grows in proportion to D.
            </p>
            <p>
              <strong className="text-[#1b2a41]">3.</strong> Raise f: shorter λ, tighter fringes. Rearranged, λ = xa/D —
              this experiment is a way to MEASURE a wavelength.
            </p>
            <p>
              <strong className="text-[#1b2a41]">4.</strong> x = λD/a assumes D is much bigger than a. Set a = 20 cm and
              D = 15 cm: the formula drifts far from the exact and measured rows, which stay together. Restore D ≫ a and
              all three converge. Formulas have small print; this tank is small enough to show you where it is.
            </p>
          </div>
        </div>

        <div className="bg-white border border-[#e4ddcc] rounded p-4">
          <div className="bg-gradient-to-br from-[#fbf5e8] to-[#f6efdc] border border-[#e6d9b8] rounded px-4 py-3.5 text-center mb-3">
            <div className="italic text-[22px] text-[#8f6428]" style={{ fontFamily: 'Georgia, serif' }}>
              x = λD / a
            </div>
            <div className="italic text-[14px] text-[#8f6428] mt-1.5" style={{ fontFamily: 'Georgia, serif' }}>
              bright fringes where the path difference = nλ
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
