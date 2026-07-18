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
  P3: Pt; // spring breaks
}

function buildKeyPoints(k: number): KeyPoints {
  const FA = 6; // N, force at the limit of proportionality
  const xP1 = (FA / k) * 100; // cm
  const O: Pt = { x: 0, y: 0 };
  const P1: Pt = { x: xP1, y: FA };
  const P2: Pt = { x: xP1 * 1.22, y: FA * 1.1 };
  const P3: Pt = { x: xP1 * 3.4, y: FA * 1.18 };
  return { O, P1, P2, P3 };
}

function sampleCurve(k: number): Pt[] {
  const { O, P1, P2, P3 } = buildKeyPoints(k);
  const pts: Pt[] = [];

  const n1 = 20;
  for (let i = 0; i <= n1; i++) {
    const t = i / n1;
    pts.push({ x: O.x + (P1.x - O.x) * t, y: O.y + (P1.y - O.y) * t });
  }

  // quadratic bezier: bends from the steep line over to the shallow plateau
  const ctrl: Pt = { x: P2.x, y: P1.y };
  const n2 = 26;
  for (let i = 1; i <= n2; i++) {
    const t = i / n2;
    const x = (1 - t) * (1 - t) * P1.x + 2 * (1 - t) * t * ctrl.x + t * t * P2.x;
    const y = (1 - t) * (1 - t) * P1.y + 2 * (1 - t) * t * ctrl.y + t * t * P2.y;
    pts.push({ x, y });
  }

  const n3 = 20;
  for (let i = 1; i <= n3; i++) {
    const t = i / n3;
    pts.push({ x: P2.x + (P3.x - P2.x) * t, y: P2.y + (P3.y - P2.y) * t });
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

function drawSpring(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  topY: number,
  length: number,
  broken: boolean,
  breakFraction: number,
  straighten: number // 0 = normal coil, 1 = nearly straight wire
) {
  const baseCoilRadius = 15;
  const coilRadius = baseCoilRadius * (1 - straighten * 0.85);
  const baseLineWidth = 4.2;
  const lineWidth = baseLineWidth - straighten * 1.8;
  const coils = 11;
  const coilSpacing = length / coils;

  const drawCoilRun = (fromY: number, coilCount: number) => {
    for (let i = 0; i < coilCount; i++) {
      const y = fromY + i * coilSpacing;
      const grad = ctx.createLinearGradient(centerX - coilRadius, y, centerX + coilRadius, y);
      grad.addColorStop(0, '#f2f2f0');
      grad.addColorStop(0.35, '#c4c9cf');
      grad.addColorStop(0.65, '#8b93a0');
      grad.addColorStop(1, '#565f6d');
      ctx.strokeStyle = grad;
      ctx.lineWidth = Math.max(1.2, lineWidth);
      ctx.beginPath();
      ctx.ellipse(centerX, y, Math.max(1.5, coilRadius), 4.4 - straighten * 2.2, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
  };

  ctx.strokeStyle = '#8a94a3';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(centerX, topY - 10);
  ctx.lineTo(centerX, topY);
  ctx.stroke();

  if (!broken) {
    drawCoilRun(topY, coils);
    ctx.strokeStyle = '#8a94a3';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX, topY + length);
    ctx.lineTo(centerX, topY + length + 10);
    ctx.stroke();
    return;
  }

  const breakY = topY + length * breakFraction;
  const upperCoils = Math.max(1, Math.round(coils * breakFraction) - 1);
  const lowerCoils = Math.max(1, coils - upperCoils - 1);

  drawCoilRun(topY, upperCoils);
  const upperEndY = topY + upperCoils * coilSpacing;
  ctx.strokeStyle = '#8a94a3';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(centerX, upperEndY);
  ctx.lineTo(centerX - 6, upperEndY + 10);
  ctx.lineTo(centerX + 4, upperEndY + 18);
  ctx.stroke();

  const lowerStartY = breakY + 26;
  ctx.beginPath();
  ctx.moveTo(centerX - 4, lowerStartY - 18);
  ctx.lineTo(centerX + 6, lowerStartY - 10);
  ctx.lineTo(centerX, lowerStartY);
  ctx.stroke();
  drawCoilRun(lowerStartY, lowerCoils);

  ctx.beginPath();
  ctx.moveTo(centerX, lowerStartY + lowerCoils * coilSpacing);
  ctx.lineTo(centerX, lowerStartY + lowerCoils * coilSpacing + 10);
  ctx.stroke();
}

export function SpringSimulator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [k, setK] = useState(40);
  const [targetExtension, setTargetExtension] = useState(0);
  const [showTechnical, setShowTechnical] = useState(false);
  const [snapped, setSnapped] = useState(false);
  const [running, setRunning] = useState(false);

  const curveRef = useRef(sampleCurve(40));
  const keyPointsRef = useRef(buildKeyPoints(40));

  const animRef = useRef({
    currentExtension: 0,
    velocity: 0,
    targetExtension: 0,
    k: 40,
    showTechnical: false,
    running: false,
    snapped: false,
    breakFraction: 1,
  });

  const [forceDisplay, setForceDisplay] = useState('0.00');
  const [extensionDisplay, setExtensionDisplay] = useState('0.0');
  const [regionLabel, setRegionLabel] = useState('At rest');

  const maxExtensionCm = keyPointsRef.current.P3.x * 1.08;

  const regionFor = (xCm: number) => {
    const { P1, P2, P3 } = keyPointsRef.current;
    if (xCm <= P1.x) return "Hooke's law region (F = kx)";
    if (xCm <= P2.x) return 'Beyond the limit of proportionality';
    if (xCm <= P3.x) return 'Past the elastic limit — stretching permanently';
    return 'Broken';
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
    const forceN = forceAtExtension(curveRef.current, xCm);
    const { P1, P2, P3 } = keyPointsRef.current;

    const straighten = Math.max(0, Math.min(1, (xCm - P2.x) / Math.max(0.01, P3.x - P2.x)));

    // --- Spring panel (left) ---
    const springAreaW = Math.min(180, w * 0.3);
    const ceilingY = 26;
    const ceilingX = springAreaW / 2 + 10;
    const restLenPx = 70;
    const maxSpringLenPx = 260;
    const pxPerCm = (maxSpringLenPx - restLenPx) / Math.max(1, P3.x);
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

    drawSpring(ctx, ceilingX, ceilingY, springLenPx, a.snapped, a.breakFraction, straighten);

    if (!a.snapped) {
      const weightY = ceilingY + springLenPx + 10;
      const weightSize = 22;
      ctx.fillStyle = '#b8823d';
      ctx.beginPath();
      ctx.roundRect(ceilingX - weightSize / 2, weightY, weightSize, weightSize * 0.75, 3);
      ctx.fill();
      ctx.strokeStyle = '#6b4a1c';
      ctx.lineWidth = 1;
      ctx.stroke();
    } else {
      ctx.font = '600 22px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('💥', ceilingX, ceilingY + springLenPx * a.breakFraction + 20);
      ctx.textAlign = 'left';
    }

    // --- Graph panel (right) ---
    const graphLeft = springAreaW + 44;
    const graphRight = w - 16;
    const graphTop = 22;
    const graphBottom = h - 36;
    const graphW = graphRight - graphLeft;
    const graphH = graphBottom - graphTop;

    const MAX_X_CM = P3.x * 1.12;
    const MAX_F = P3.y * 1.3;

    const xForExt = (ext: number) => graphLeft + (ext / MAX_X_CM) * graphW;
    const yForForce = (f: number) => graphBottom - (f / MAX_F) * graphH;

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

    // faint background reference curve, colour-coded by region
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
    drawSegment(0, P1.x, '#c7d6e6'); // faint blue: Hooke's law region
    drawSegment(P1.x, P2.x, '#e8c3ba'); // faint red: proportionality -> elastic limit
    drawSegment(P2.x, P3.x, '#cfd2d6'); // faint dark: plastic plateau

    // key point labels
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
    labelPoint(P3, 'spring breaks', '#b8823d', 4);

    // live traced curve up to current extension
    const traced = curveRef.current.filter((p) => p.x <= xCm + 0.001);
    if (traced.length > 1) {
      ctx.strokeStyle = a.snapped ? '#b34a3c' : '#2e7d6b';
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      traced.forEach((p, i) => {
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
      ctx.fillStyle = a.snapped ? '#b34a3c' : '#b8823d';
      ctx.beginPath();
      ctx.arc(cx, cy, 4.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // technical overlay: gradient triangle in the linear region only
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
    setRegionLabel(a.snapped ? 'Broken' : regionFor(xCm));
  };

  const tick = () => {
    const a = animRef.current;
    const { P3 } = keyPointsRef.current;
    const diff = a.targetExtension - a.currentExtension;
    a.velocity += diff * 55 * (1 / 60) - a.velocity * 7.5 * (1 / 60);
    a.currentExtension += a.velocity * (1 / 60);

    if (a.currentExtension >= P3.x) {
      a.currentExtension = P3.x;
      a.snapped = true;
      a.running = false;
      setSnapped(true);
      setRunning(false);
      draw();
      return;
    }

    if (Math.abs(diff) < 0.02 && Math.abs(a.velocity) < 0.02) {
      a.currentExtension = a.targetExtension;
      a.velocity = 0;
      a.running = false;
      setRunning(false);
      draw();
      return;
    }
    draw();
    requestAnimationFrame(tick);
  };

  const handleRelease = () => {
    const a = animRef.current;
    if (a.snapped) return;
    a.currentExtension = 0;
    a.velocity = 0;
    a.targetExtension = targetExtension;
    a.running = true;
    setRunning(true);
    requestAnimationFrame(tick);
  };

  const handleReset = () => {
    const a = animRef.current;
    a.currentExtension = 0;
    a.velocity = 0;
    a.targetExtension = 0;
    a.running = false;
    a.snapped = false;
    a.breakFraction = 0.4 + Math.random() * 0.2;
    setSnapped(false);
    setRunning(false);
    setTargetExtension(0);
    draw();
  };

  const handleKChange = (val: number) => {
    setK(val);
    curveRef.current = sampleCurve(val);
    keyPointsRef.current = buildKeyPoints(val);
    animRef.current.k = val;
    handleReset();
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
    { symbol: 'k', name: 'Spring constant', def: 'k = F/x, but only up to the limit of proportionality — point P1 on the graph.' },
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
            <label className="text-[13px] text-[#4a5a72] w-28 flex-shrink-0">Set load (stretch to)</label>
            <input
              type="range"
              min={0}
              max={maxExtensionCm}
              step={0.2}
              value={targetExtension}
              onChange={(e) => setTargetExtension(parseFloat(e.target.value))}
              disabled={running || snapped}
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
              disabled={running}
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

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={handleRelease}
              disabled={running || snapped}
              className="bg-[#b8823d] hover:bg-[#8f6428] disabled:opacity-50 disabled:cursor-not-allowed text-white text-[13.5px] font-semibold px-3.5 py-2 rounded"
            >
              {running ? '… Releasing' : '▶ Release'}
            </button>
            <button
              onClick={handleReset}
              className="bg-transparent border border-[#d8cfb6] hover:bg-[#f5f0e2] text-[#1b2a41] text-[13.5px] font-semibold px-3.5 py-2 rounded"
            >
              ⟲ Reset
            </button>
          </div>

          {snapped && (
            <p className="text-[12px] text-[#b34a3c] font-medium mt-3">
              💥 Stretched thin and past its breaking point. Press Reset to fit a new spring.
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
          <p><b style={{ color: '#2e7d6b' }}>Elastic limit:</b> beyond this, the spring won&rsquo;t return to its original length once unloaded.</p>
          <p><b style={{ color: '#b8823d' }}>Spring breaks:</b> extension keeps growing with barely any extra force, until it snaps.</p>
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
