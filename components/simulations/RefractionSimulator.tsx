'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Refraction & Total Internal Reflection — an optics bench.
 *
 * Real physics, not a canned animation:
 *  - Snell's law solved live: n₁ sin i = n₂ sin r
 *  - Fresnel equations (unpolarized average) split the light's intensity
 *    between the reflected and refracted rays, so the reflected ray
 *    brightens continuously as i approaches the critical angle
 *  - Wavefronts travel at v = c/n, so students SEE the wave slow down
 *    and its wavelength shrink in the denser medium
 *  - A data notebook records (sin i, sin r) points and fits a straight
 *    line through the origin — its gradient measures n₁/n₂, exactly
 *    like the classic IGCSE glass-block practical
 */

interface Medium {
  key: string;
  name: string;
  n: number;
  tint: string; // wash drawn over the paper background
  label: string;
}

const MEDIA: Medium[] = [
  { key: 'air', name: 'Air', n: 1.0, tint: 'rgba(250, 247, 240, 0)', label: 'n = 1.00' },
  { key: 'water', name: 'Water', n: 1.33, tint: 'rgba(46, 125, 107, 0.10)', label: 'n = 1.33' },
  { key: 'perspex', name: 'Perspex', n: 1.5, tint: 'rgba(74, 90, 114, 0.10)', label: 'n = 1.50' },
  { key: 'glass', name: 'Glass', n: 1.52, tint: 'rgba(27, 42, 65, 0.12)', label: 'n = 1.52' },
  { key: 'diamond', name: 'Diamond', n: 2.42, tint: 'rgba(122, 82, 179, 0.12)', label: 'n = 2.42' },
];

const mediumByKey = (key: string): Medium => MEDIA.find((m) => m.key === key) || MEDIA[0];

const DEG = Math.PI / 180;
const C_LIGHT = 3.0e8; // m/s

/** Unpolarized Fresnel reflectance at a planar interface. Returns 1 under TIR. */
function fresnelReflectance(n1: number, n2: number, iRad: number): number {
  const sinT = (n1 / n2) * Math.sin(iRad);
  if (sinT >= 1) return 1; // total internal reflection
  const cosI = Math.cos(iRad);
  const cosT = Math.sqrt(1 - sinT * sinT);
  const rs = (n1 * cosI - n2 * cosT) / (n1 * cosI + n2 * cosT);
  const rp = (n1 * cosT - n2 * cosI) / (n1 * cosT + n2 * cosI);
  return Math.min(1, (rs * rs + rp * rp) / 2);
}

interface RecordedPoint {
  sinI: number;
  sinR: number;
}

/** Least-squares slope of a line through the origin: sinR = k · sinI. */
function fitThroughOrigin(points: RecordedPoint[]): number | null {
  if (points.length < 2) return null;
  let num = 0;
  let den = 0;
  points.forEach((p) => {
    num += p.sinI * p.sinR;
    den += p.sinI * p.sinI;
  });
  return den > 0 ? num / den : null;
}

export function RefractionSimulator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const plotRef = useRef<HTMLCanvasElement>(null);
  const phaseRef = useRef(0); // wave phase, in cycles
  const lastTimeRef = useRef<number | null>(null);
  const draggingRef = useRef(false);
  const pointsRef = useRef<RecordedPoint[]>([]);
  const rafRef = useRef<number | null>(null);

  const [incidentDeg, setIncidentDeg] = useState(40);
  const [topKey, setTopKey] = useState('glass');
  const [bottomKey, setBottomKey] = useState('air');
  const [showWavefronts, setShowWavefronts] = useState(true);
  const [showTechnical, setShowTechnical] = useState(false);
  const [recorded, setRecorded] = useState<RecordedPoint[]>([]);

  // live values kept in refs so the RAF loop never re-subscribes
  const simRef = useRef({ incidentDeg: 40, topKey: 'glass', bottomKey: 'air', showWavefronts: true, showTechnical: false });

  const top = mediumByKey(topKey);
  const bottom = mediumByKey(bottomKey);
  const iRad = incidentDeg * DEG;
  const sinR = (top.n / bottom.n) * Math.sin(iRad);
  const isTIR = sinR >= 1;
  const rRad = isTIR ? NaN : Math.asin(sinR);
  const criticalDeg = top.n > bottom.n ? Math.asin(bottom.n / top.n) / DEG : null;
  const reflectance = fresnelReflectance(top.n, bottom.n, iRad);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const s = simRef.current;
    const topM = mediumByKey(s.topKey);
    const botM = mediumByKey(s.bottomKey);
    const i = s.incidentDeg * DEG;
    const sinRr = (topM.n / botM.n) * Math.sin(i);
    const tir = sinRr >= 1;
    const r = tir ? NaN : Math.asin(sinRr);
    const R = fresnelReflectance(topM.n, botM.n, i);
    const critical = topM.n > botM.n ? Math.asin(botM.n / topM.n) : null;

    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    ctx.clearRect(0, 0, w, h);

    const oy = h * 0.52; // interface height
    const ox = w / 2; // point of incidence
    const rayLen = Math.min(w, h) * 0.46;

    // --- media washes ---
    ctx.fillStyle = topM.tint;
    ctx.fillRect(0, 0, w, oy);
    ctx.fillStyle = botM.tint;
    ctx.fillRect(0, oy, w, h - oy);

    // medium labels
    ctx.font = '600 12px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
    ctx.fillStyle = '#4a5a72';
    ctx.textAlign = 'left';
    ctx.fillText(`${topM.name}  ·  ${topM.label}`, 12, 20);
    ctx.fillText(`${botM.name}  ·  ${botM.label}`, 12, h - 12);

    // --- interface line ---
    ctx.strokeStyle = '#1b2a41';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, oy);
    ctx.lineTo(w, oy);
    ctx.stroke();

    // --- normal (dashed vertical) ---
    ctx.strokeStyle = '#8a94a3';
    ctx.lineWidth = 1.4;
    ctx.setLineDash([6, 5]);
    ctx.beginPath();
    ctx.moveTo(ox, oy - rayLen - 14);
    ctx.lineTo(ox, oy + rayLen + 14);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.font = '500 10.5px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
    ctx.fillStyle = '#8a94a3';
    ctx.textAlign = 'center';
    ctx.fillText('normal', ox, oy - rayLen - 20);

    // --- protractor arcs etched around the point of incidence ---
    ctx.strokeStyle = 'rgba(27, 42, 65, 0.22)';
    ctx.lineWidth = 1;
    [0.32, 0.44].forEach((f) => {
      ctx.beginPath();
      ctx.arc(ox, oy, rayLen * f, 0, Math.PI * 2);
      ctx.stroke();
    });
    // 10° graduations
    for (let a = 0; a < 360; a += 10) {
      const rad = a * DEG;
      const rIn = rayLen * 0.44;
      const rOut = rayLen * (a % 30 === 0 ? 0.485 : 0.465);
      ctx.beginPath();
      ctx.moveTo(ox + rIn * Math.sin(rad), oy - rIn * Math.cos(rad));
      ctx.lineTo(ox + rOut * Math.sin(rad), oy - rOut * Math.cos(rad));
      ctx.stroke();
    }

    // ray endpoints (angles measured from the normal)
    const srcX = ox - rayLen * Math.sin(i);
    const srcY = oy - rayLen * Math.cos(i);
    const reflX = ox + rayLen * Math.sin(i);
    const reflY = oy - rayLen * Math.cos(i);

    const rayColor = (alpha: number) => `rgba(184, 130, 61, ${alpha})`;
    const glow = (alpha: number) => `rgba(201, 146, 45, ${alpha * 0.35})`;

    const drawRay = (x0: number, y0: number, x1: number, y1: number, intensity: number, arrow: boolean) => {
      const a = 0.25 + 0.75 * intensity;
      ctx.strokeStyle = glow(a);
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.stroke();
      ctx.strokeStyle = rayColor(a);
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.stroke();
      if (arrow) {
        const mx = x0 + (x1 - x0) * 0.55;
        const my = y0 + (y1 - y0) * 0.55;
        const ang = Math.atan2(y1 - y0, x1 - x0);
        ctx.fillStyle = rayColor(a);
        ctx.beginPath();
        ctx.moveTo(mx + 9 * Math.cos(ang), my + 9 * Math.sin(ang));
        ctx.lineTo(mx + 9 * Math.cos(ang + 2.5), my + 9 * Math.sin(ang + 2.5));
        ctx.lineTo(mx + 9 * Math.cos(ang - 2.5), my + 9 * Math.sin(ang - 2.5));
        ctx.closePath();
        ctx.fill();
      }
    };

    // wavefront ticks: perpendicular marks whose spacing is λ ∝ 1/n,
    // marching along the ray at v = c/n — same frequency in both media
    const drawWavefronts = (x0: number, y0: number, x1: number, y1: number, n: number, intensity: number) => {
      if (!s.showWavefronts) return;
      const len = Math.hypot(x1 - x0, y1 - y0);
      const ux = (x1 - x0) / len;
      const uy = (y1 - y0) / len;
      const spacing = 34 / n; // λ shrinks in the denser medium
      const offset = ((phaseRef.current % 1) + 1) % 1;
      ctx.strokeStyle = `rgba(46, 125, 107, ${0.35 + 0.45 * intensity})`;
      ctx.lineWidth = 1.6;
      for (let d = offset * spacing; d < len; d += spacing) {
        const px = x0 + ux * d;
        const py = y0 + uy * d;
        const tick = 7;
        ctx.beginPath();
        ctx.moveTo(px - uy * tick, py + ux * tick);
        ctx.lineTo(px + uy * tick, py - ux * tick);
        ctx.stroke();
      }
    };

    // incident ray (always full intensity)
    drawRay(srcX, srcY, ox, oy, 1, true);
    drawWavefronts(srcX, srcY, ox, oy, topM.n, 1);

    // reflected ray — Fresnel share R
    drawRay(ox, oy, reflX, reflY, R, R > 0.06);
    if (R > 0.1) drawWavefronts(ox, oy, reflX, reflY, topM.n, R);

    // refracted ray — share 1 − R (absent under TIR)
    if (!tir) {
      const refrX = ox + rayLen * Math.sin(r);
      const refrY = oy + rayLen * Math.cos(r);
      drawRay(ox, oy, refrX, refrY, 1 - R, true);
      drawWavefronts(ox, oy, refrX, refrY, botM.n, 1 - R);
    }

    // --- angle arcs & labels ---
    const labelFont = '700 13px Georgia, serif';

    // angle of incidence i (between upward normal and incident ray, left side)
    ctx.strokeStyle = '#1b2a41';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(ox, oy, rayLen * 0.2, -Math.PI / 2 - i, -Math.PI / 2);
    ctx.stroke();
    ctx.font = labelFont;
    ctx.fillStyle = '#1b2a41';
    ctx.textAlign = 'center';
    const iMid = -Math.PI / 2 - i / 2;
    ctx.fillText(`i = ${s.incidentDeg.toFixed(0)}°`, ox + rayLen * 0.29 * Math.cos(iMid), oy + rayLen * 0.29 * Math.sin(iMid) + 4);

    if (!tir) {
      // angle of refraction r (between downward normal and refracted ray, right side)
      ctx.strokeStyle = '#2e7d6b';
      ctx.beginPath();
      ctx.arc(ox, oy, rayLen * 0.2, Math.PI / 2 - r, Math.PI / 2);
      ctx.stroke();
      ctx.fillStyle = '#2e7d6b';
      const rMid = Math.PI / 2 - r / 2;
      ctx.fillText(`r = ${(r / DEG).toFixed(1)}°`, ox + rayLen * 0.3 * Math.cos(rMid), oy + rayLen * 0.3 * Math.sin(rMid) + 4);
    } else {
      ctx.fillStyle = '#b34a3c';
      ctx.font = '700 14px Georgia, serif';
      ctx.fillText('Total internal reflection — no light escapes', ox, oy + 34);
    }

    // critical angle marker (dashed red ray in the top medium)
    if (critical !== null) {
      ctx.strokeStyle = 'rgba(179, 74, 60, 0.6)';
      ctx.lineWidth = 1.4;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(ox, oy);
      ctx.lineTo(ox - rayLen * 0.66 * Math.sin(critical), oy - rayLen * 0.66 * Math.cos(critical));
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#b34a3c';
      ctx.font = '600 11px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`c = ${(critical / DEG).toFixed(1)}°`, ox - rayLen * 0.72 * Math.sin(critical) - 30, oy - rayLen * 0.72 * Math.cos(critical));
    }

    // --- ray box (draggable source) ---
    const boxAng = Math.atan2(oy - srcY, ox - srcX);
    ctx.save();
    ctx.translate(srcX, srcY);
    ctx.rotate(boxAng);
    ctx.fillStyle = '#1b2a41';
    ctx.fillRect(-34, -11, 30, 22);
    ctx.fillStyle = '#b8823d';
    ctx.fillRect(-6, -6, 6, 12); // aperture
    ctx.restore();
    ctx.fillStyle = '#4a5a72';
    ctx.font = '500 10.5px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('drag me', srcX - 30 * Math.cos(boxAng), srcY - 30 * Math.sin(boxAng) - 14);

    // technical overlay
    if (s.showTechnical) {
      ctx.textAlign = 'right';
      ctx.font = '600 11px ui-monospace, SFMono-Regular, Menlo, monospace';
      ctx.fillStyle = '#4a5a72';
      const lines = [
        `n₁ sin i = ${(topM.n * Math.sin(i)).toFixed(3)}`,
        tir ? 'n₂ sin r — (no refracted ray)' : `n₂ sin r = ${(botM.n * Math.sin(r)).toFixed(3)}`,
        `reflected ${(R * 100).toFixed(1)}%  ·  refracted ${((1 - R) * 100).toFixed(1)}%`,
        `v₁ = ${(C_LIGHT / topM.n / 1e8).toFixed(2)} × 10⁸ m/s`,
        `v₂ = ${(C_LIGHT / botM.n / 1e8).toFixed(2)} × 10⁸ m/s`,
      ];
      lines.forEach((t, idx) => ctx.fillText(t, w - 12, 22 + idx * 16));
    }
    ctx.textAlign = 'left';
  };

  const drawPlot = () => {
    const canvas = plotRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    ctx.clearRect(0, 0, w, h);

    const pad = { l: 40, r: 12, t: 12, b: 30 };
    const pw = w - pad.l - pad.r;
    const ph = h - pad.t - pad.b;
    const X = (sinI: number) => pad.l + sinI * pw;
    const Y = (sR: number) => pad.t + (1 - Math.min(1, sR)) * ph;

    // frame + gridlines
    ctx.strokeStyle = '#e4ddcc';
    ctx.lineWidth = 1;
    for (let g = 0; g <= 1.001; g += 0.25) {
      ctx.beginPath();
      ctx.moveTo(X(g), pad.t);
      ctx.lineTo(X(g), pad.t + ph);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(pad.l, Y(g));
      ctx.lineTo(pad.l + pw, Y(g));
      ctx.stroke();
    }
    ctx.strokeStyle = '#1b2a41';
    ctx.lineWidth = 1.4;
    ctx.strokeRect(pad.l, pad.t, pw, ph);

    ctx.font = '500 10px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
    ctx.fillStyle = '#4a5a72';
    ctx.textAlign = 'center';
    [0, 0.5, 1].forEach((g) => ctx.fillText(g.toFixed(1), X(g), pad.t + ph + 14));
    ctx.fillText('sin i', pad.l + pw / 2, h - 4);
    ctx.save();
    ctx.translate(11, pad.t + ph / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('sin r', 0, 0);
    ctx.restore();
    ctx.textAlign = 'right';
    [0, 0.5, 1].forEach((g) => ctx.fillText(g.toFixed(1), pad.l - 5, Y(g) + 3));

    // theory line: sin r = (n₁/n₂) sin i, clipped to the box
    const topM = mediumByKey(simRef.current.topKey);
    const botM = mediumByKey(simRef.current.bottomKey);
    const k = topM.n / botM.n;
    ctx.strokeStyle = 'rgba(46, 125, 107, 0.45)';
    ctx.lineWidth = 1.4;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.moveTo(X(0), Y(0));
    const xEnd = Math.min(1, 1 / k);
    ctx.lineTo(X(xEnd), Y(k * xEnd));
    ctx.stroke();
    ctx.setLineDash([]);

    // recorded points (brass) + best-fit through origin (ink)
    const pts = pointsRef.current;
    const fit = fitThroughOrigin(pts);
    if (fit !== null) {
      ctx.strokeStyle = '#1b2a41';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(X(0), Y(0));
      const xe = Math.min(1, 1 / fit);
      ctx.lineTo(X(xe), Y(fit * xe));
      ctx.stroke();
    }
    pts.forEach((p) => {
      ctx.fillStyle = '#b8823d';
      ctx.beginPath();
      ctx.arc(X(p.sinI), Y(p.sinR), 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#faf7f0';
      ctx.lineWidth = 1.2;
      ctx.stroke();
    });
  };

  const loop = (t: number) => {
    if (lastTimeRef.current === null) lastTimeRef.current = t;
    const dt = Math.min(0.05, (t - lastTimeRef.current) / 1000);
    lastTimeRef.current = t;
    phaseRef.current += dt * 0.9; // wave frequency (cycles per second, scaled)
    draw();
    rafRef.current = requestAnimationFrame(loop);
  };

  // pointer drag: angle of incidence follows the pointer in the top-left quadrant
  const angleFromPointer = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const ox = rect.width / 2;
    const oy = rect.height * 0.52;
    const dx = ox - x;
    const dy = oy - y;
    if (dy <= 4) return null; // must stay in the top medium
    return Math.max(1, Math.min(89, Math.atan2(Math.abs(dx), dy) / DEG));
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const a = angleFromPointer(e.clientX, e.clientY);
    if (a === null) return;
    draggingRef.current = true;
    (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
    setIncident(a);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!draggingRef.current) return;
    const a = angleFromPointer(e.clientX, e.clientY);
    if (a !== null) setIncident(a);
  };

  const handlePointerUp = () => {
    draggingRef.current = false;
  };

  const setIncident = (deg: number) => {
    setIncidentDeg(deg);
    simRef.current.incidentDeg = deg;
  };

  const handleTop = (key: string) => {
    setTopKey(key);
    simRef.current.topKey = key;
    drawPlot();
  };

  const handleBottom = (key: string) => {
    setBottomKey(key);
    simRef.current.bottomKey = key;
    drawPlot();
  };

  const handleSwap = () => {
    const t = simRef.current.topKey;
    handleTop(simRef.current.bottomKey);
    handleBottom(t);
  };

  const syncPts = (pts: RecordedPoint[]) => {
    pointsRef.current = pts;
    setRecorded(pts);
    drawPlot();
  };

  const handleRecord = () => {
    if (isTIR) return;
    const pt = { sinI: Math.sin(iRad), sinR: Math.sin(rRad) };
    syncPts([...recorded, pt]);
  };

  const handleClearPoints = () => syncPts([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const plot = plotRef.current;

    const resize = () => {
      [canvas, plot].forEach((c) => {
        if (!c) return;
        const rect = c.getBoundingClientRect();
        c.width = rect.width * devicePixelRatio;
        c.height = rect.height * devicePixelRatio;
        c.getContext('2d')?.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      });
      draw();
      drawPlot();
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

  const fitSlope = fitThroughOrigin(recorded);
  const measuredRatio = fitSlope !== null && fitSlope > 0 ? 1 / fitSlope : null;

  const variables = [
    { symbol: 'i', name: 'Angle of incidence', def: 'Angle between the incoming ray and the normal, in degrees.' },
    { symbol: 'r', name: 'Angle of refraction', def: 'Angle between the refracted ray and the normal, in degrees.' },
    { symbol: 'n', name: 'Refractive index', def: 'How much a medium slows light down: n = c/v. Air ≈ 1.00.' },
    { symbol: 'c', name: 'Critical angle', def: 'The angle of incidence for which r = 90°. Beyond it, total internal reflection.' },
  ];

  const mediumButtons = (current: string, onPick: (k: string) => void) => (
    <div className="flex flex-wrap gap-1.5">
      {MEDIA.map((m) => (
        <button
          key={m.key}
          onClick={() => onPick(m.key)}
          className={`text-[12px] font-medium px-2.5 py-1 rounded border ${
            current === m.key
              ? 'bg-[#1b2a41] text-white border-[#1b2a41]'
              : 'bg-transparent text-[#1b2a41] border-[#d8cfb6] hover:bg-[#f5f0e2]'
          }`}
        >
          {m.name}
        </button>
      ))}
    </div>
  );

  return (
    <div className="refraction-lab">
      <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-5">
        {/* ---- Apparatus ---- */}
        <div className="bg-white border border-[#e4ddcc] rounded overflow-hidden">
          <div className="flex justify-between items-baseline px-4 pt-3">
            <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">Optics Bench</span>
            <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">
              {isTIR ? 'TIR' : `r = ${(rRad / DEG).toFixed(1)}°`}
            </span>
          </div>
          <canvas
            ref={canvasRef}
            className="block w-full touch-none cursor-crosshair"
            style={{ height: 400 }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          />
          <div className="px-4 pb-2 -mt-1">
            <p className="text-[11.5px] text-[#4a5a72] leading-snug">
              <span className="text-[#b8823d] font-semibold">Drag the ray box</span> to change the angle of incidence.{' '}
              <span className="text-[#2e7d6b] font-semibold">Green ticks</span> are wavefronts — watch them squeeze together
              in the slower medium.{' '}
              <span className="text-[#b34a3c] font-semibold">Dashed red line</span> = critical angle (when it exists).
            </p>
          </div>

          <div className="px-4 pb-5 pt-3 border-t border-[#eee6d3]">
            <div className="flex items-center gap-3 mb-3">
              <label className="text-[13px] text-[#4a5a72] w-28 flex-shrink-0">Incidence (i)</label>
              <input
                type="range"
                min={1}
                max={89}
                step={0.5}
                value={incidentDeg}
                onChange={(e) => setIncident(parseFloat(e.target.value))}
                className="flex-1"
              />
              <span className="font-mono text-[13px] w-14 text-right">{incidentDeg.toFixed(1)}°</span>
            </div>

            <div className="flex items-start gap-3 mb-2.5">
              <label className="text-[13px] text-[#4a5a72] w-28 flex-shrink-0 pt-1">Top medium</label>
              {mediumButtons(topKey, handleTop)}
            </div>
            <div className="flex items-start gap-3 mb-3">
              <label className="text-[13px] text-[#4a5a72] w-28 flex-shrink-0 pt-1">Bottom medium</label>
              {mediumButtons(bottomKey, handleBottom)}
            </div>

            <div className="flex gap-2 mb-3">
              <button
                onClick={handleSwap}
                className="flex-1 text-[12.5px] font-semibold px-3 py-2 rounded border bg-transparent text-[#1b2a41] border-[#d8cfb6] hover:bg-[#f5f0e2]"
              >
                ⇅ Swap media
              </button>
              <button
                onClick={() => {
                  const next = !showWavefronts;
                  setShowWavefronts(next);
                  simRef.current.showWavefronts = next;
                }}
                className={`flex-1 text-[12.5px] font-semibold px-3 py-2 rounded border ${
                  showWavefronts
                    ? 'bg-[#2e7d6b] text-white border-[#2e7d6b]'
                    : 'bg-transparent text-[#1b2a41] border-[#d8cfb6] hover:bg-[#f5f0e2]'
                }`}
              >
                {showWavefronts ? '✓ Wavefronts' : 'Wavefronts'}
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

        {/* ---- Data notebook ---- */}
        <div className="flex flex-col gap-5">
          <div className="bg-white border border-[#e4ddcc] rounded p-4">
            <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">Live Readings</span>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3">
              <div className="flex justify-between border-b border-[#eee6d3] pb-1">
                <span className="text-[12.5px] text-[#4a5a72]">Angle of incidence i</span>
                <span className="font-mono text-[13px] text-[#1b2a41]">{incidentDeg.toFixed(1)}°</span>
              </div>
              <div className="flex justify-between border-b border-[#eee6d3] pb-1">
                <span className="text-[12.5px] text-[#4a5a72]">Angle of refraction r</span>
                <span className={`font-mono text-[13px] ${isTIR ? 'text-[#b34a3c] font-bold' : 'text-[#2e7d6b]'}`}>
                  {isTIR ? 'TIR' : `${(rRad / DEG).toFixed(1)}°`}
                </span>
              </div>
              <div className="flex justify-between border-b border-[#eee6d3] pb-1">
                <span className="text-[12.5px] text-[#4a5a72]">n₁ sin i</span>
                <span className="font-mono text-[13px] text-[#1b2a41]">{(top.n * Math.sin(iRad)).toFixed(3)}</span>
              </div>
              <div className="flex justify-between border-b border-[#eee6d3] pb-1">
                <span className="text-[12.5px] text-[#4a5a72]">n₂ sin r</span>
                <span className="font-mono text-[13px] text-[#1b2a41]">{isTIR ? '—' : (bottom.n * Math.sin(rRad)).toFixed(3)}</span>
              </div>
              <div className="flex justify-between border-b border-[#eee6d3] pb-1">
                <span className="text-[12.5px] text-[#4a5a72]">Critical angle c</span>
                <span className="font-mono text-[13px] text-[#b34a3c]">
                  {criticalDeg !== null ? `${criticalDeg.toFixed(1)}°` : 'none'}
                </span>
              </div>
              <div className="flex justify-between border-b border-[#eee6d3] pb-1">
                <span className="text-[12.5px] text-[#4a5a72]">Light reflected</span>
                <span className="font-mono text-[13px] text-[#1b2a41]">{(reflectance * 100).toFixed(1)}%</span>
              </div>
            </div>
            {criticalDeg === null && (
              <p className="text-[11.5px] text-[#4a5a72] mt-2 leading-snug">
                No critical angle here: light is entering a <em>denser</em> medium, so it always gets in. Try swapping the media.
              </p>
            )}
          </div>

          <div className="bg-white border border-[#e4ddcc] rounded p-4">
            <div className="flex justify-between items-baseline">
              <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">
                Measure n yourself
              </span>
              <span className="font-mono text-[11px] text-[#4a5a72]">{recorded.length} pts</span>
            </div>
            <p className="text-[11.5px] text-[#4a5a72] mt-1.5 leading-snug">
              Set an angle, press <strong>Record point</strong>, repeat for 5+ angles. The gradient of your line is
              n₁/n₂ — exactly how the glass-block practical works.
            </p>
            <canvas ref={plotRef} className="block w-full mt-2" style={{ height: 210 }} />
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleRecord}
                disabled={isTIR}
                className={`flex-1 text-[12.5px] font-semibold px-3 py-2 rounded border ${
                  isTIR
                    ? 'bg-[#f5f0e2] text-[#8a94a3] border-[#e4ddcc] cursor-not-allowed'
                    : 'bg-[#b8823d] text-white border-[#b8823d] hover:bg-[#a06f2f]'
                }`}
              >
                ● Record point
              </button>
              <button
                onClick={handleClearPoints}
                className="text-[12.5px] font-semibold px-3 py-2 rounded border bg-transparent text-[#1b2a41] border-[#d8cfb6] hover:bg-[#f5f0e2]"
              >
                Clear
              </button>
            </div>
            {measuredRatio !== null && (
              <div className="mt-2.5 bg-[#faf7f0] border border-[#eee6d3] rounded p-2.5">
                <span className="text-[12.5px] text-[#4a5a72]">Your measured n₂/n₁ = </span>
                <span className="font-mono text-[14px] font-bold text-[#1b2a41]">{measuredRatio.toFixed(3)}</span>
                <span className="text-[12.5px] text-[#4a5a72]"> (true value {(bottom.n / top.n).toFixed(3)})</span>
              </div>
            )}
          </div>

          <div className="bg-white border border-[#e4ddcc] rounded p-4">
            <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">Variables</span>
            <div className="mt-2 space-y-2">
              {variables.map((v) => (
                <div key={v.symbol} className="flex gap-3">
                  <span className="font-serif italic font-bold text-[15px] text-[#1b2a41] w-5 flex-shrink-0">{v.symbol}</span>
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
