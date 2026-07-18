'use client';

import { useEffect, useRef, useState } from 'react';

interface Pt {
  x: number; // cm
  y: number; // N
}

interface KeyPoints {
  O: Pt;
  P1: Pt; // limit of proportionality
  P2: Pt; // elastic limit
}

function buildKeyPoints(k: number): KeyPoints {
  const FA = 6; // N, force at the limit of proportionality (roughly a material property)
  const xP1 = (FA / k) * 100; // cm - a stiffer spring reaches this force at a smaller extension
  const O: Pt = { x: 0, y: 0 };
  const P1: Pt = { x: xP1, y: FA };
  const P2: Pt = { x: xP1 * 1.22, y: FA * 1.1 };
  return { O, P1, P2 };
}

// Fixed reference frame (based on the softest spring on the slider) so that
// changing stiffness visibly changes how much of the graph the curve uses,
// instead of everything auto-rescaling to look the same regardless of k.
const REFERENCE = buildKeyPoints(20);
const FIXED_MAX_EXTENSION_CM = REFERENCE.P2.x * 3;
const FIXED_MAX_FORCE = 14;

function cubicBezier(p0: Pt, c1: Pt, c2: Pt, p1: Pt, t: number): Pt {
  const mt = 1 - t;
  const x = mt * mt * mt * p0.x + 3 * mt * mt * t * c1.x + 3 * mt * t * t * c2.x + t * t * t * p1.x;
  const y = mt * mt * mt * p0.y + 3 * mt * mt * t * c1.y + 3 * mt * t * t * c2.y + t * t * t * p1.y;
  return { x, y };
}

function sampleCurve(k: number): Pt[] {
  const { O, P1, P2 } = buildKeyPoints(k);
  const pts: Pt[] = [];

  const n1 = 18;
  for (let i = 0; i <= n1; i++) {
    const t = i / n1;
    pts.push({ x: O.x + (P1.x - O.x) * t, y: O.y + (P1.y - O.y) * t });
  }

  const inSlope = P1.y / P1.x;
  const plateauSlope = inSlope * 0.07;
  const segDX = P2.x - P1.x;
  const c1: Pt = { x: P1.x + segDX * 0.4, y: P1.y + segDX * 0.4 * inSlope };
  const c2: Pt = { x: P2.x - segDX * 0.4, y: P2.y - segDX * 0.4 * plateauSlope };

  const n2 = 26;
  for (let i = 1; i <= n2; i++) {
    const t = i / n2;
    pts.push(cubicBezier(P1, c1, c2, P2, t));
  }

  // plateau continues all the way to the shared fixed bound, regardless of k
  const n3 = 30;
  for (let i = 1; i <= n3; i++) {
    const t = i / n3;
    const x = P2.x + (FIXED_MAX_EXTENSION_CM - P2.x) * t;
    pts.push({ x, y: P2.y + (x - P2.x) * plateauSlope });
  }

  return pts;
}

function forceAtExtension(curve: Pt[], xCm: number): number {
  if (xCm <= 0) return 0;
  for (let i = 1; i < curve.length; i++) {
    if (curve[i].x >= xCm) {
      const a = curve[i - 1];
      const b = curve[i];
      const t = b.x === a.x ? 0 : (xCm - a.x) / (b.x - a.x);
      return a.y + (b.y - a.y) * t;
    }
  }
  return curve[curve.length - 1].y;
}

function lerpColor(stops: [number, string][], t: number): string {
  const hexToRgb = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  for (let i = 0; i < stops.length - 1; i++) {
    const [t0, c0] = stops[i];
    const [t1, c1] = stops[i + 1];
    if (t >= t0 && t <= t1) {
      const localT = t1 === t0 ? 0 : (t - t0) / (t1 - t0);
      const rgb0 = hexToRgb(c0);
      const rgb1 = hexToRgb(c1);
      const rgb = rgb0.map((v, idx) => Math.round(v + (rgb1[idx] - v) * localT));
      return `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
    }
  }
  return stops[stops.length - 1][1];
}

const HEAT_STOPS: [number, string][] = [
  [0, '#8b93a0'],
  [0.4, '#d4b23c'],
  [0.7, '#c2703a'],
  [1, '#b34a3c'],
];

function drawZigzagSpring(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  topY: number,
  length: number,
  stressFraction: number
) {
  const coilWidth = 15;
  const turns = 9;
  const segH = length / (turns * 2);

  const points: Pt[] = [{ x: centerX, y: topY }];
  let y = topY;
  for (let i = 0; i < turns * 2; i++) {
    const dir = i % 2 === 0 ? 1 : -1;
    y += segH;
    points.push({ x: centerX + dir * coilWidth, y });
  }
  points.push({ x: centerX, y: topY + length });

  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  ctx.strokeStyle = '#3d4653';
  ctx.lineWidth = 7;
  ctx.beginPath();
  points.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
  ctx.stroke();

  const heatColor = lerpColor(HEAT_STOPS, stressFraction);
  const grad = ctx.createLinearGradient(centerX - coilWidth, topY, centerX + coilWidth, topY);
  grad.addColorStop(0, '#f2f0ea');
  grad.addColorStop(0.5, heatColor);
  grad.addColorStop(1, '#6b4a1c');
  ctx.strokeStyle = grad;
  ctx.lineWidth = 5;
  ctx.beginPath();
  points.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
  ctx.stroke();
}

export function SpringSimulator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [k, setK] = useState(40);
  const [targetExtension, setTargetExtension] = useState(0);
  const [showTechnical, setShowTechnical] = useState(false);

  const curveRef = useRef(sampleCurve(40));
  const keyPointsRef = useRef(buildKeyPoints(40));

  const animRef = useRef({
    currentExtension: 0,
    velocity: 0,
    targetExtension: 0,
    k: 40,
    showTechnical: false,
    running: false,
    maxExtensionEver: 0,
  });

  const [forceDisplay, setForceDisplay] = useState('0.00');
  const [extensionDisplay, setExtensionDisplay] = useState('0.0');
  const [regionLabel, setRegionLabel] = useState('At rest');
  const [permanentSetDisplay, setPermanentSetDisplay] = useState(0);

  const permanentSetFor = (maxEver: number, P2x: number) => {
    if (maxEver <= P2x) return 0;
    return (maxEver - P2x) * 0.75;
  };

  const forceWithHysteresis = (xCm: number) => {
    const a = animRef.current;
    const { P2 } = keyPointsRef.current;
    const permSet = permanentSetFor(a.maxExtensionEver, P2.x);
    if (permSet === 0) return forceAtExtension(curveRef.current, xCm);
    if (xCm <= permSet) return 0;
    if (xCm <= a.maxExtensionEver) {
      const fAtMax = forceAtExtension(curveRef.current, a.maxExtensionEver);
      const t = (xCm - permSet) / Math.max(0.001, a.maxExtensionEver - permSet);
      return fAtMax * t;
    }
    return forceAtExtension(curveRef.current, xCm);
  };

  const regionFor = (xCm: number, permSet: number) => {
    const { P1, P2 } = keyPointsRef.current;
    if (permSet > 0 && xCm <= permSet) return 'Permanently deformed — resting at new length';
    if (xCm <= P1.x) return "Hooke's law region (F = kx)";
    if (xCm <= P2.x) return 'Beyond the limit of proportionality';
    return 'Past the elastic limit — stretching permanently';
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    ctx.clearRect(0, 0, w, h);

    const a = animRef.current;
    const xCm = a.currentExtension;
    const { P1, P2 } = keyPointsRef.current;
    const permSet = permanentSetFor(a.maxExtensionEver, P2.x);
    const forceN = forceWithHysteresis(xCm);
    const stressFraction = Math.max(0, Math.min(1, xCm / FIXED_MAX_EXTENSION_CM));

    // --- Spring panel (left) ---
    const springAreaW = Math.min(180, w * 0.3);
    const ceilingY = 26;
    const ceilingX = springAreaW / 2 + 10;
    const restLenPx = 70;
    const maxSpringLenPx = 260;
    const pxPerCm = (maxSpringLenPx - restLenPx) / FIXED_MAX_EXTENSION_CM;
    const springLenPx = restLenPx + xCm * pxPerCm;

    ctx.fillStyle = '#4a5a72';
    ctx.fillRect(ceilingX - 30, ceilingY - 8, 60, 8);
    for (let i = -22; i <= 22; i += 8) {
      ctx.strokeStyle = '#4a5a72';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(ceilingX + i, ceilingY);
      ctx.lineTo(ceilingX + i - 5, ceilingY + 6);
      ctx.stroke();
    }

    drawZigzagSpring(ctx, ceilingX, ceilingY, springLenPx, stressFraction);

    const weightY = ceilingY + springLenPx + 10;
    const weightSize = 22;
    ctx.fillStyle = lerpColor(HEAT_STOPS, stressFraction);
    ctx.beginPath();
    ctx.roundRect(ceilingX - weightSize / 2, weightY, weightSize, weightSize * 0.75, 3);
    ctx.fill();
    ctx.strokeStyle = '#3d4653';
    ctx.lineWidth = 1;
    ctx.stroke();

    // --- Graph panel (right) ---
    const graphLeft = springAreaW + 44;
    const graphRight = w - 16;
    const graphTop = 22;
    const graphBottom = h - 36;
    const graphW = graphRight - graphLeft;
    const graphH = graphBottom - graphTop;

    const xForExt = (ext: number) => graphLeft + (ext / FIXED_MAX_EXTENSION_CM) * graphW;
    const yForForce = (f: number) => graphBottom - (f / FIXED_MAX_FORCE) * graphH;

    ctx.strokeStyle = '#b8b0a0';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(graphLeft, graphTop);
    ctx.lineTo(graphLeft, graphBottom);
    ctx.lineTo(graphRight, graphBottom);
    ctx.stroke();

    ctx.textAlign = 'right';
    ctx.font = '600 10px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
    ctx.fillStyle = '#4a5a72';
    ctx.fillText('Force (N)', graphLeft - 2, graphTop - 6);
    ctx.textAlign = 'left';
    ctx.fillText('Extension (cm)', graphRight - 78, graphBottom + 28);

    const drawSegment = (fromX: number, toX: number, color: string) => {
      const seg = curveRef.current.filter((p) => p.x >= fromX - 0.001 && p.x <= toX + 0.001);
      if (seg.length < 2) return;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      seg.forEach((p, i) => {
        const x = xForExt(p.x);
        const y = yForForce(p.y);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    };
    drawSegment(0, P1.x, '#c7d6e6');
    drawSegment(P1.x, P2.x, '#e8c3ba');
    drawSegment(P2.x, FIXED_MAX_EXTENSION_CM, '#d3d6da');

    const labelPoint = (p: Pt, text: string, color: string, dy: number) => {
      const px = xForExt(p.x);
      const py = yForForce(p.y);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(px, py, 2.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = '600 10.5px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
      ctx.fillText(text, px + 5, py + dy);
    };
    labelPoint(P1, 'limit of proportionality', '#7a4a8f', 14);
    labelPoint(P2, 'elastic limit', '#2e7d6b', -8);

    // persistent hysteresis reference line, once the spring has yielded
    if (permSet > 0) {
      const fAtMax = forceAtExtension(curveRef.current, a.maxExtensionEver);
      ctx.strokeStyle = '#8a94a3';
      ctx.setLineDash([3, 3]);
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(xForExt(permSet), yForForce(0));
      ctx.lineTo(xForExt(a.maxExtensionEver), yForForce(fAtMax));
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#4a5a72';
      ctx.font = '600 9.5px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
      ctx.fillText('unloads along here now', xForExt(permSet) + 4, yForForce(0) - 6);

      // little downward tick marking the permanent set on the x-axis
      ctx.strokeStyle = '#b34a3c';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(xForExt(permSet), graphBottom);
      ctx.lineTo(xForExt(permSet), graphBottom + 7);
      ctx.stroke();
    }

    // live traced curve
    const tracePts: Pt[] = [];
    const steps = 40;
    for (let i = 0; i <= steps; i++) {
      const x = (xCm * i) / steps;
      tracePts.push({ x, y: x <= permSet ? 0 : forceWithHysteresis(x) });
    }
    if (tracePts.length > 1) {
      ctx.strokeStyle = '#2e7d6b';
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      tracePts.forEach((p, i) => {
        const x = xForExt(p.x);
        const y = yForForce(p.y);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }

    if (xCm > 0) {
      const cx = xForExt(xCm);
      const cy = yForForce(forceN);
      ctx.fillStyle = lerpColor(HEAT_STOPS, stressFraction);
      ctx.beginPath();
      ctx.arc(cx, cy, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#3d4653';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    if (a.showTechnical) {
      const sampleX = P1.x * 0.7;
      const sampleF = forceAtExtension(curveRef.current, sampleX);
      const x0 = xForExt(0);
      const y0 = yForForce(0);
      const x1 = xForExt(sampleX);
      const y1 = yForForce(sampleF);

      ctx.strokeStyle = '#7a4a8f';
      ctx.setLineDash([4, 3]);
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(x0, y1);
      ctx.lineTo(x1, y1);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x1, y0);
      ctx.lineTo(x1, y1);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#7a4a8f';
      ctx.font = '600 10px "Courier New", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('Δx', (x0 + x1) / 2, y1 + 13);
      ctx.textAlign = 'left';
      ctx.fillText('ΔF', x1 + 6, (y0 + y1) / 2);

      const boxX = graphLeft + 8;
      const boxY = graphBottom - 44;
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.strokeStyle = '#e4ddcc';
      ctx.beginPath();
      ctx.roundRect(boxX, boxY, 150, 36, 4);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#1b2a41';
      ctx.font = '600 11px "Courier New", monospace';
      ctx.fillText(`k = ΔF/Δx`, boxX + 7, boxY + 15);
      ctx.fillText(`= ${a.k.toFixed(0)} N/m`, boxX + 7, boxY + 28);
    }

    setForceDisplay(forceN.toFixed(2));
    setExtensionDisplay(xCm.toFixed(1));
    setRegionLabel(regionFor(xCm, permSet));
    setPermanentSetDisplay(permSet);
  };

  const tick = () => {
    const a = animRef.current;
    const diff = a.targetExtension - a.currentExtension;
    a.velocity += diff * 55 * (1 / 60) - a.velocity * 7.5 * (1 / 60);
    a.currentExtension += a.velocity * (1 / 60);

    if (a.currentExtension > a.maxExtensionEver) {
      a.maxExtensionEver = a.currentExtension;
    }

    if (Math.abs(diff) < 0.02 && Math.abs(a.velocity) < 0.02) {
      a.currentExtension = a.targetExtension;
      a.velocity = 0;
      a.running = false;
      draw();
      return;
    }
    draw();
    requestAnimationFrame(tick);
  };

  const handleLoadChange = (val: number) => {
    const a = animRef.current;
    const { P2 } = keyPointsRef.current;
    const permSet = permanentSetFor(a.maxExtensionEver, P2.x);
    const clamped = Math.max(val, permSet);
    setTargetExtension(clamped);
    a.targetExtension = clamped;
    if (!a.running) {
      a.running = true;
      requestAnimationFrame(tick);
    }
  };

  const handleRemoveLoad = () => {
    handleLoadChange(0);
  };

  const handleKChange = (val: number) => {
    setK(val);
    curveRef.current = sampleCurve(val);
    keyPointsRef.current = buildKeyPoints(val);
    const a = animRef.current;
    a.k = val;
    a.currentExtension = 0;
    a.velocity = 0;
    a.targetExtension = 0;
    a.running = false;
    a.maxExtensionEver = 0;
    setTargetExtension(0);
    draw();
  };

  const handleToggleTechnical = () => {
    const next = !showTechnical;
    setShowTechnical(next);
    animRef.current.showTechnical = next;
    draw();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * devicePixelRatio;
      canvas.height = rect.height * devicePixelRatio;
      const ctx = canvas.getContext('2d');
      ctx?.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      draw();
    };

    resize();
    window.addEventListener('resize', resize);
    draw();

    return () => window.removeEventListener('resize', resize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const variables = [
    { symbol: 'F', name: 'Force (load)', def: 'The pulling force applied to the spring, in newtons (N).' },
    { symbol: 'x', name: 'Extension', def: 'How much longer the spring gets compared to its natural length, in cm.' },
    { symbol: 'k', name: 'Spring constant', def: 'k = F/x, but only up to the limit of proportionality. A bigger k means a steeper line — more force needed for the same stretch.' },
  ];

  return (
    <div className="spring-lab">
      <div className="bg-white border border-[#e4ddcc] rounded overflow-hidden mb-5">
        <div className="flex justify-between items-baseline px-4 pt-3">
          <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">
            Live Spring & Graph
          </span>
          <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">
            {regionLabel}
          </span>
        </div>
        <canvas ref={canvasRef} className="block w-full" style={{ height: 400 }} />

        <div className="px-4 pb-5 pt-3 border-t border-[#eee6d3]">
          <div className="flex items-center gap-3 mb-3">
            <label className="text-[13px] text-[#4a5a72] w-28 flex-shrink-0">Load</label>
            <input
              type="range"
              min={0}
              max={FIXED_MAX_EXTENSION_CM}
              step={0.1}
              value={targetExtension}
              onChange={(e) => handleLoadChange(parseFloat(e.target.value))}
              className="flex-1"
            />
            <span className="font-mono text-[13px] w-16 text-right">{targetExtension.toFixed(1)} cm</span>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <label className="text-[13px] text-[#4a5a72] w-28 flex-shrink-0">Spring stiffness</label>
            <input
              type="range"
              min={20}
              max={60}
              step={2}
              value={k}
              onChange={(e) => handleKChange(parseFloat(e.target.value))}
              className="flex-1"
            />
            <span className="font-mono text-[13px] w-16 text-right">{k} N/m</span>
          </div>

          <button
            onClick={handleToggleTechnical}
            className={`w-full mb-3 text-[12.5px] font-semibold px-3 py-2 rounded border ${
              showTechnical
                ? 'bg-[#1b2a41] text-white border-[#1b2a41]'
                : 'bg-transparent text-[#1b2a41] border-[#d8cfb6] hover:bg-[#f5f0e2]'
            }`}
          >
            {showTechnical ? '✓ Gradient Details Shown' : '⚙ Show Gradient Details'}
          </button>

          <button
            onClick={handleRemoveLoad}
            className="bg-transparent border border-[#d8cfb6] hover:bg-[#f5f0e2] text-[#1b2a41] text-[13.5px] font-semibold px-3.5 py-2 rounded"
          >
            ⟲ Remove Load
          </button>

          {permanentSetDisplay > 0 && (
            <p className="text-[12px] text-[#b34a3c] font-medium mt-3">
              This spring has been permanently stretched by {permanentSetDisplay.toFixed(1)} cm. Removing
              the load won&rsquo;t bring it back below that.
            </p>
          )}
        </div>
      </div>

      <div className="bg-white border border-[#e4ddcc] rounded p-4 mb-5">
        <h2 className="font-mono text-[15px] tracking-wide uppercase text-[#4a5a72] border-b border-[#eee6d3] pb-2 mb-3.5">
          Readouts
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div className="bg-[#faf7f0] border border-[#eee6d3] rounded px-3 py-2.5">
            <div className="text-[11px] text-[#4a5a72] mb-1">Force applied</div>
            <div className="font-mono text-xl font-bold">{forceDisplay} N</div>
          </div>
          <div className="bg-[#faf7f0] border border-[#eee6d3] rounded px-3 py-2.5">
            <div className="text-[11px] text-[#4a5a72] mb-1">Extension</div>
            <div className="font-mono text-xl font-bold text-[#2e7d6b]">{extensionDisplay} cm</div>
          </div>
          <div className="bg-[#faf7f0] border border-[#eee6d3] rounded px-3 py-2.5">
            <div className="text-[11px] text-[#4a5a72] mb-1">Spring constant k</div>
            <div className="font-mono text-xl font-bold text-[#b8823d]">{k} N/m</div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#e4ddcc] rounded p-4 mb-5">
        <h2 className="font-mono text-[15px] tracking-wide uppercase text-[#4a5a72] border-b border-[#eee6d3] pb-2 mb-3.5">
          Reading the Curve
        </h2>
        <div className="space-y-1.5 text-[12.5px] text-[#4a5a72]">
          <p><b style={{ color: '#3a6ea8' }}>Hooke&rsquo;s law region:</b> straight line through the origin. F = kx.</p>
          <p><b style={{ color: '#7a4a8f' }}>Limit of proportionality:</b> the line stops being straight here.</p>
          <p><b style={{ color: '#2e7d6b' }}>Elastic limit:</b> beyond this, the spring won&rsquo;t return to its original length once unloaded. The dashed line shows its new, permanent path.</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-[#fbf5e8] to-[#f6efdc] border border-[#e6d9b8] rounded px-4 py-5 text-center mb-5">
        <div className="italic text-[26px] text-[#8f6428]" style={{ fontFamily: 'Georgia, serif' }}>
          F = k x
        </div>
        <div className="text-[12px] text-[#4a5a72] mt-2">
          true only in the Hooke&rsquo;s law region, up to the limit of proportionality
        </div>
      </div>

      <div className="bg-white border border-[#e4ddcc] rounded p-4">
        <h2 className="font-mono text-[15px] tracking-wide uppercase text-[#4a5a72] border-b border-[#eee6d3] pb-2 mb-3.5">
          What Each Variable Means
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {variables.map((v) => (
            <div key={v.symbol} className="flex gap-3 items-start">
              <div
                className="flex-shrink-0 w-9 h-9 rounded bg-[#faf7f0] border border-[#eee6d3] flex items-center justify-center font-mono text-[16px] font-bold text-[#8f6428]"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {v.symbol}
              </div>
              <div>
                <div className="text-[13px] font-semibold text-[#1b2a41]">{v.name}</div>
                <div className="text-[12.5px] text-[#4a5a72] leading-snug">{v.def}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
