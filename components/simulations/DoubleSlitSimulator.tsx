'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Double-Slit Lab — Young's experiment, built around the fringe equation.
 *
 * Real physics, not a canned animation:
 *  - The path difference at any screen point is computed EXACTLY from the
 *    geometry: Δ = |S₂P| − |S₁P|, no small-angle shortcut. The familiar
 *    x = λD/a emerges from it — and the technical overlay shows how close
 *    the small-angle approximation Δ ≈ ay/D really is
 *  - The screen pattern is the true intensity I ∝ cos²(πΔ/λ), coloured by
 *    the actual wavelength you dial in
 *  - Drag the probe point along the screen and watch the path difference
 *    pass through whole numbers of λ (bright) and half-numbers (dark)
 *
 * Companion to the ripple tank: there you SEE the wave field make fringes;
 * here you MEASURE them and command the equation.
 */

const LAMBDA_MIN = 400; // nm
const LAMBDA_MAX = 700;
const FRINGES_SHOWN = 4.6; // bright fringes visible each side of centre

/** Approximate spectral colour for a visible wavelength in nm. */
function wavelengthToRGB(nm: number): [number, number, number] {
  let r = 0;
  let g = 0;
  let b = 0;
  if (nm < 440) {
    r = -(nm - 440) / 40;
    b = 1;
  } else if (nm < 490) {
    g = (nm - 440) / 50;
    b = 1;
  } else if (nm < 510) {
    g = 1;
    b = -(nm - 510) / 20;
  } else if (nm < 580) {
    r = (nm - 510) / 70;
    g = 1;
  } else if (nm < 645) {
    r = 1;
    g = -(nm - 645) / 65;
  } else {
    r = 1;
  }
  // gentle intensity roll-off at the spectrum ends
  let f = 1;
  if (nm < 420) f = 0.5 + (0.5 * (nm - 400)) / 20;
  if (nm > 660) f = 0.5 + (0.5 * (700 - nm)) / 40;
  return [Math.round(255 * r * f), Math.round(255 * g * f), Math.round(255 * b * f)];
}

/** Exact path difference |S2P| − |S1P| in metres, for slits at ±a/2. */
function pathDifference(aM: number, dM: number, yM: number): number {
  const s1 = Math.hypot(dM, yM - aM / 2);
  const s2 = Math.hypot(dM, yM + aM / 2);
  return s2 - s1;
}

export function DoubleSlitSimulator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const phaseRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);
  const draggingRef = useRef(false);

  const [lambdaNm, setLambdaNm] = useState(600);
  const [aMm, setAMm] = useState(0.5);
  const [dM, setDM] = useState(1.0);
  const [probeYmm, setProbeYmm] = useState(1.2); // start on the first side fringe
  const [showTechnical, setShowTechnical] = useState(false);

  const simRef = useRef({ lambdaNm: 600, aMm: 0.5, dM: 1.0, probeYmm: 1.2, showTechnical: false });

  // ---- physics (SI units) ----
  const lambdaM = lambdaNm * 1e-9;
  const aM = aMm * 1e-3;
  const fringeSpacingM = (lambdaM * dM) / aM; // x = λD/a
  const fringeSpacingMm = fringeSpacingM * 1e3;
  const probeYM = probeYmm * 1e-3;
  const deltaM = pathDifference(aM, dM, probeYM);
  const nExact = deltaM / lambdaM;
  const nNearest = Math.round(nExact);
  const offN = Math.abs(nExact - nNearest);
  const isBright = offN < 0.12;
  const isDark = Math.abs(offN - 0.5) < 0.12;

  const geom = () => {
    const canvas = canvasRef.current;
    const rect = canvas ? canvas.getBoundingClientRect() : ({ width: 900, height: 480 } as DOMRect);
    const w = rect.width;
    const h = rect.height;
    const slitX = Math.min(150, w * 0.16);
    const screenX = w - Math.max(120, w * 0.14);
    const midY = h * 0.5;
    // vertical scale: keep a constant number of fringes on screen — the
    // printed mm values carry the real size
    const s = simRef.current;
    const ySpanM = FRINGES_SHOWN * ((s.lambdaNm * 1e-9 * s.dM) / (s.aMm * 1e-3));
    const pxPerM = (h * 0.44) / ySpanM;
    return { w, h, slitX, screenX, midY, pxPerM, ySpanM };
  };

  const yToPx = (yM: number) => {
    const g = geom();
    return g.midY - yM * g.pxPerM;
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const s = simRef.current;
    const g = geom();
    ctx.clearRect(0, 0, g.w, g.h);

    const lM = s.lambdaNm * 1e-9;
    const aMet = s.aMm * 1e-3;
    const [cr, cg, cb] = wavelengthToRGB(s.lambdaNm);
    const laser = `rgb(${cr}, ${cg}, ${cb})`;

    const slitGapPx = 34; // schematic slit separation on screen (not to scale)
    const s1y = g.midY + slitGapPx / 2;
    const s2y = g.midY - slitGapPx / 2;

    // ---- incoming plane wave (left of the slits) ----
    ctx.strokeStyle = `rgba(${cr}, ${cg}, ${cb}, 0.45)`;
    ctx.lineWidth = 1.6;
    const inSpacing = 14;
    const inOffset = (phaseRef.current * 40) % inSpacing;
    for (let x = g.slitX - 8 - inOffset; x > 14; x -= inSpacing) {
      ctx.beginPath();
      ctx.moveTo(x, g.midY - 74);
      ctx.lineTo(x, g.midY + 74);
      ctx.stroke();
    }
    ctx.fillStyle = '#4a5a72';
    ctx.font = '500 10.5px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('monochromatic light', 14, g.midY - 84);

    // ---- barrier with two slits ----
    ctx.strokeStyle = '#1b2a41';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(g.slitX, 16);
    ctx.lineTo(g.slitX, s2y - 7);
    ctx.moveTo(g.slitX, s2y + 7);
    ctx.lineTo(g.slitX, s1y - 7);
    ctx.moveTo(g.slitX, s1y + 7);
    ctx.lineTo(g.slitX, g.h - 16);
    ctx.stroke();
    ctx.fillStyle = '#1b2a41';
    ctx.font = '600 11px Georgia, serif';
    ctx.textAlign = 'right';
    ctx.fillText('S₂', g.slitX - 9, s2y + 4);
    ctx.fillText('S₁', g.slitX - 9, s1y + 4);

    // a-bracket between slits
    ctx.strokeStyle = '#b8823d';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(g.slitX + 10, s2y);
    ctx.lineTo(g.slitX + 22, s2y);
    ctx.moveTo(g.slitX + 10, s1y);
    ctx.lineTo(g.slitX + 22, s1y);
    ctx.moveTo(g.slitX + 16, s2y);
    ctx.lineTo(g.slitX + 16, s1y);
    ctx.stroke();
    ctx.fillStyle = '#8f6428';
    ctx.font = 'italic 700 12px Georgia, serif';
    ctx.textAlign = 'left';
    ctx.fillText(`a = ${s.aMm.toFixed(2)} mm`, g.slitX + 24, g.midY + 4);

    // ---- circular wavelets from each slit (spacing ∝ λ, animated) ----
    const waveSpacing = 10 + (s.lambdaNm - LAMBDA_MIN) * 0.04;
    const wOffset = (phaseRef.current * 40) % waveSpacing;
    ctx.lineWidth = 1.1;
    for (const sy of [s1y, s2y]) {
      ctx.strokeStyle = `rgba(${cr}, ${cg}, ${cb}, 0.3)`;
      for (let r = wOffset; r < 120; r += waveSpacing) {
        ctx.beginPath();
        ctx.arc(g.slitX, sy, r, -Math.PI / 2.25, Math.PI / 2.25);
        ctx.stroke();
      }
    }

    // ---- screen with the true intensity pattern ----
    const screenW = 26;
    ctx.fillStyle = '#111a28';
    ctx.fillRect(g.screenX, 14, screenW, g.h - 28);
    for (let py = 16; py < g.h - 16; py += 1) {
      const yM = (g.midY - py) / g.pxPerM;
      const d = pathDifference(aMet, s.dM, yM);
      const I = Math.pow(Math.cos((Math.PI * d) / lM), 2);
      ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, ${(0.08 + 0.92 * I).toFixed(3)})`;
      ctx.fillRect(g.screenX + 2, py, screenW - 4, 1.2);
    }
    ctx.fillStyle = '#4a5a72';
    ctx.font = '500 10.5px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('screen', g.screenX + screenW / 2, g.h - 4);

    // fringe-spacing bracket between the centre and first bright fringe
    const xM = (lM * s.dM) / aMet;
    const b0 = yToPx(0);
    const b1 = yToPx(xM);
    ctx.strokeStyle = '#faf7f0';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(g.screenX + screenW + 6, b0);
    ctx.lineTo(g.screenX + screenW + 14, b0);
    ctx.moveTo(g.screenX + screenW + 6, b1);
    ctx.lineTo(g.screenX + screenW + 14, b1);
    ctx.moveTo(g.screenX + screenW + 10, b0);
    ctx.lineTo(g.screenX + screenW + 10, b1);
    ctx.stroke();
    ctx.fillStyle = '#1b2a41';
    ctx.font = 'italic 700 12px Georgia, serif';
    ctx.textAlign = 'left';
    ctx.fillText(`x = ${(xM * 1e3).toFixed(2)} mm`, g.screenX + screenW + 18, (b0 + b1) / 2 + 4);

    // ---- rays from both slits to the draggable probe ----
    const probePy = yToPx(s.probeYmm * 1e-3);
    const clampedPy = Math.max(20, Math.min(g.h - 20, probePy));
    const dashLen = 7;
    ctx.setLineDash([dashLen, dashLen]);
    ctx.lineDashOffset = -phaseRef.current * 55;
    ctx.strokeStyle = laser;
    ctx.lineWidth = 1.8;
    for (const sy of [s1y, s2y]) {
      ctx.beginPath();
      ctx.moveTo(g.slitX, sy);
      ctx.lineTo(g.screenX + 2, clampedPy);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // probe marker
    ctx.fillStyle = isBrightAt(s) ? '#2e7d6b' : '#b34a3c';
    ctx.beginPath();
    ctx.arc(g.screenX + 1, clampedPy, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#faf7f0';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = '#1b2a41';
    ctx.font = '700 11px Georgia, serif';
    ctx.textAlign = 'right';
    ctx.fillText('P  (drag me)', g.screenX - 8, clampedPy - 10);

    // ---- axis + D bracket ----
    ctx.strokeStyle = '#8a94a3';
    ctx.lineWidth = 1.2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(g.slitX, g.midY);
    ctx.lineTo(g.screenX, g.midY);
    ctx.stroke();
    ctx.setLineDash([]);
    const dy = g.h - 22;
    ctx.strokeStyle = '#4a5a72';
    ctx.beginPath();
    ctx.moveTo(g.slitX, dy - 5);
    ctx.lineTo(g.slitX, dy + 5);
    ctx.moveTo(g.screenX, dy - 5);
    ctx.lineTo(g.screenX, dy + 5);
    ctx.moveTo(g.slitX, dy);
    ctx.lineTo(g.screenX, dy);
    ctx.stroke();
    ctx.fillStyle = '#4a5a72';
    ctx.font = 'italic 700 12px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText(`D = ${s.dM.toFixed(2)} m`, (g.slitX + g.screenX) / 2, dy - 8);
    ctx.font = '500 10px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
    ctx.fillText('geometry not to scale — the numbers are exact', (g.slitX + g.screenX) / 2, 24);

    // ---- technical overlay ----
    if (s.showTechnical) {
      const d = pathDifference(aMet, s.dM, s.probeYmm * 1e-3);
      const approx = (aMet * (s.probeYmm * 1e-3)) / s.dM;
      ctx.textAlign = 'left';
      ctx.font = '600 11px ui-monospace, SFMono-Regular, Menlo, monospace';
      ctx.fillStyle = '#1b2a41';
      const lines = [
        `Δ exact  = |S₂P| − |S₁P| = ${(d * 1e6).toFixed(4)} µm`,
        `Δ approx = a·y/D          = ${(approx * 1e6).toFixed(4)} µm`,
        `small-angle error ${(Math.abs(1 - approx / d) * 100).toFixed(4)}%`,
        `I(P) ∝ cos²(πΔ/λ) = ${Math.pow(Math.cos((Math.PI * d) / lM), 2).toFixed(3)}`,
      ];
      lines.forEach((line, idx) => ctx.fillText(line, 14, g.h - 76 + idx * 15));
    }
  };

  const isBrightAt = (s: { lambdaNm: number; aMm: number; dM: number; probeYmm: number }) => {
    const d = pathDifference(s.aMm * 1e-3, s.dM, s.probeYmm * 1e-3);
    const n = d / (s.lambdaNm * 1e-9);
    return Math.abs(n - Math.round(n)) < 0.25;
  };

  const loop = (t: number) => {
    if (lastTimeRef.current === null) lastTimeRef.current = t;
    const dt = Math.min(0.05, (t - lastTimeRef.current) / 1000);
    lastTimeRef.current = t;
    phaseRef.current += dt;
    draw();
    rafRef.current = requestAnimationFrame(loop);
  };

  // ---- probe dragging along the screen ----
  const probeFromPointer = (clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const g = geom();
    const py = clientY - rect.top;
    const yM = (g.midY - py) / g.pxPerM;
    const lim = g.ySpanM * 0.98;
    return Math.max(-lim, Math.min(lim, yM)) * 1e3; // mm
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
    draggingRef.current = true;
    const y = probeFromPointer(e.clientY);
    if (y !== null) setProbe(y);
  };
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!draggingRef.current) return;
    const y = probeFromPointer(e.clientY);
    if (y !== null) setProbe(y);
  };
  const handlePointerUp = () => {
    draggingRef.current = false;
  };

  const setProbe = (yMm: number) => {
    setProbeYmm(yMm);
    simRef.current.probeYmm = yMm;
  };
  const setLambda = (nm: number) => {
    setLambdaNm(nm);
    simRef.current.lambdaNm = nm;
  };
  const setA = (mm: number) => {
    setAMm(mm);
    simRef.current.aMm = mm;
  };
  const setD = (m: number) => {
    setDM(m);
    simRef.current.dM = m;
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

  const variables = [
    { symbol: 'x', name: 'Fringe spacing', def: 'The distance between the centres of two adjacent bright fringes on the screen.' },
    { symbol: 'λ', name: 'Wavelength', def: 'Of the light used. Must be monochromatic (a single wavelength), or the fringes of different colours land in different places and wash out.' },
    { symbol: 'D', name: 'Slit-to-screen distance', def: 'From the double slit to the screen. Bigger D spreads the pattern out.' },
    { symbol: 'a', name: 'Slit separation', def: 'Between the centres of the two slits. SMALLER a gives WIDER fringes — they are inversely related.' },
  ];

  return (
    <div className="double-slit-lab flex flex-col gap-5">
      {/* ---- Apparatus: full width ---- */}
      <div className="bg-white border border-[#e4ddcc] rounded overflow-hidden">
        <div className="flex justify-between items-baseline px-4 pt-3">
          <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">Young Double-Slit Bench</span>
          <span className={`font-mono text-[11px] tracking-wide uppercase font-bold ${isBright ? 'text-[#2e7d6b]' : isDark ? 'text-[#b34a3c]' : 'text-[#4a5a72]'}`}>
            {isBright ? `bright fringe · n = ${nNearest}` : isDark ? 'dark fringe' : `Δ = ${nExact.toFixed(2)} λ`}
          </span>
        </div>
        <canvas
          ref={canvasRef}
          className="block w-full touch-none cursor-ns-resize"
          style={{ height: 470 }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        />
        <div className="px-4 pb-2 -mt-1">
          <p className="text-[11.5px] text-[#4a5a72] leading-snug">
            <span className="text-[#2e7d6b] font-semibold">Drag P along the screen</span> and watch the path difference
            pass through whole numbers of λ (bright) and half numbers (dark). The{' '}
            <span className="text-[#8f6428] font-semibold">x bracket</span> marks one fringe spacing — check it against
            x = λD/a as you move the sliders.
          </p>
        </div>

        <div className="px-4 pb-5 pt-3 border-t border-[#eee6d3] grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-3">
          <div className="flex items-center gap-3">
            <label className="text-[13px] text-[#4a5a72] w-24 flex-shrink-0">Wavelength λ</label>
            <input
              type="range"
              min={LAMBDA_MIN}
              max={LAMBDA_MAX}
              step={5}
              value={lambdaNm}
              onChange={(e) => setLambda(parseFloat(e.target.value))}
              className="flex-1"
            />
            <span className="font-mono text-[13px] w-16 text-right">{lambdaNm} nm</span>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-[13px] text-[#4a5a72] w-24 flex-shrink-0">Slit sep. a</label>
            <input
              type="range"
              min={0.2}
              max={1.0}
              step={0.05}
              value={aMm}
              onChange={(e) => setA(parseFloat(e.target.value))}
              className="flex-1"
            />
            <span className="font-mono text-[13px] w-16 text-right">{aMm.toFixed(2)} mm</span>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-[13px] text-[#4a5a72] w-24 flex-shrink-0">Distance D</label>
            <input
              type="range"
              min={0.5}
              max={2.0}
              step={0.05}
              value={dM}
              onChange={(e) => setD(parseFloat(e.target.value))}
              className="flex-1"
            />
            <span className="font-mono text-[13px] w-16 text-right">{dM.toFixed(2)} m</span>
          </div>
          <div className="lg:col-span-3">
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
      </div>

      {/* ---- Notebook row, under the full-width bench ---- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="bg-white border border-[#e4ddcc] rounded p-4">
          <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">Live Readings</span>
          <div className="mt-3 space-y-2">
            <div className="flex justify-between border-b border-[#eee6d3] pb-1">
              <span className="text-[12.5px] text-[#4a5a72]">Fringe spacing x = λD/a</span>
              <span className="font-mono text-[13px] font-bold text-[#1b2a41]">{fringeSpacingMm.toFixed(2)} mm</span>
            </div>
            <div className="flex justify-between border-b border-[#eee6d3] pb-1">
              <span className="text-[12.5px] text-[#4a5a72]">Probe position y</span>
              <span className="font-mono text-[13px] text-[#1b2a41]">{probeYmm.toFixed(2)} mm</span>
            </div>
            <div className="flex justify-between border-b border-[#eee6d3] pb-1">
              <span className="text-[12.5px] text-[#4a5a72]">Path difference Δ</span>
              <span className="font-mono text-[13px] text-[#1b2a41]">{(deltaM * 1e6).toFixed(3)} µm</span>
            </div>
            <div className="flex justify-between border-b border-[#eee6d3] pb-1">
              <span className="text-[12.5px] text-[#4a5a72]">Δ in wavelengths</span>
              <span className={`font-mono text-[13px] font-bold ${isBright ? 'text-[#2e7d6b]' : isDark ? 'text-[#b34a3c]' : 'text-[#1b2a41]'}`}>
                {nExact.toFixed(2)} λ
              </span>
            </div>
          </div>
          <p className="text-[11.5px] text-[#4a5a72] mt-2.5 leading-snug">
            Bright where Δ = nλ (waves arrive in step), dark where Δ = (n + ½)λ (crest meets trough).
          </p>
        </div>

        <div className="bg-white border border-[#e4ddcc] rounded p-4">
          <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">Try This</span>
          <div className="mt-2 space-y-2.5 text-[12px] text-[#4a5a72] leading-snug">
            <p>
              <strong className="text-[#1b2a41]">1.</strong> Halve the slit separation a — the fringe spacing doubles.
              They are inversely related, which surprises most people the first time.
            </p>
            <p>
              <strong className="text-[#1b2a41]">2.</strong> Slide λ from red to violet with everything else fixed —
              shorter wavelength, tighter fringes. This is how the experiment measures λ itself.
            </p>
            <p>
              <strong className="text-[#1b2a41]">3.</strong> Park P on the 2nd bright fringe, then change D — P stays
              on a bright fringe only if you also track how x grows with D.
            </p>
            <p>
              <strong className="text-[#1b2a41]">4.</strong> Open the technical details and check how tiny the
              small-angle error is — that is why x = λD/a is safe to use here.
            </p>
          </div>
        </div>

        <div className="bg-white border border-[#e4ddcc] rounded p-4">
          <div className="bg-gradient-to-br from-[#fbf5e8] to-[#f6efdc] border border-[#e6d9b8] rounded px-4 py-3.5 text-center mb-3">
            <div className="italic text-[22px] text-[#8f6428]" style={{ fontFamily: 'Georgia, serif' }}>
              x = λD / a
            </div>
            <div className="italic text-[14px] text-[#8f6428] mt-1.5" style={{ fontFamily: 'Georgia, serif' }}>
              bright fringes where Δ = nλ
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
