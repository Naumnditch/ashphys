'use client';

import { useEffect, useRef, useState } from 'react';

const ELASTIC_LIMIT_N = 6; // force at which the spring stops behaving linearly
const SOFTENED_FACTOR = 0.35; // effective stiffness multiplier beyond the limit

function extensionFor(forceN: number, k: number): number {
  if (forceN <= ELASTIC_LIMIT_N) {
    return forceN / k;
  }
  const xAtLimit = ELASTIC_LIMIT_N / k;
  const extra = (forceN - ELASTIC_LIMIT_N) / (k * SOFTENED_FACTOR);
  return xAtLimit + extra;
}

function drawSpring(
  ctx: CanvasRenderingContext2D,
  topX: number,
  topY: number,
  length: number,
  coilWidth: number
) {
  const coils = 9;
  const segH = length / (coils * 2);
  ctx.strokeStyle = '#8a94a3';
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(topX, topY);
  let y = topY;
  for (let i = 0; i < coils * 2; i++) {
    const dir = i % 2 === 0 ? 1 : -1;
    y += segH;
    ctx.lineTo(topX + dir * coilWidth, y);
  }
  ctx.lineTo(topX, topY + length);
  ctx.stroke();
}

export function SpringSimulator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [k, setK] = useState(40);
  const [forceTarget, setForceTarget] = useState(0);
  const [showTechnical, setShowTechnical] = useState(false);

  const animRef = useRef({
    forceDisplayed: 0,
    velocity: 0,
    k,
    forceTarget: 0,
    showTechnical: false,
    running: false,
  });

  const [forceDisplay, setForceDisplay] = useState('0.00');
  const [extensionDisplay, setExtensionDisplay] = useState('0.0');
  const [pastLimit, setPastLimit] = useState(false);

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
    const forceN = a.forceDisplayed;
    const xMeters = extensionFor(forceN, a.k);
    const xCm = xMeters * 100;

    // --- Spring panel (left) ---
    const springAreaW = Math.min(160, w * 0.28);
    const ceilingY = 30;
    const ceilingX = springAreaW / 2 + 10;
    const restLenPx = 60;
    const pxPerCm = 4.2;
    const springLenPx = restLenPx + xCm * pxPerCm;

    // ceiling bracket
    ctx.fillStyle = '#4a5a72';
    ctx.fillRect(ceilingX - 26, ceilingY - 8, 52, 8);
    for (let i = -20; i <= 20; i += 8) {
      ctx.strokeStyle = '#4a5a72';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(ceilingX + i, ceilingY);
      ctx.lineTo(ceilingX + i - 5, ceilingY + 6);
      ctx.stroke();
    }

    drawSpring(ctx, ceilingX, ceilingY, springLenPx, 12);

    // hook + weight
    const weightY = ceilingY + springLenPx;
    const weightSize = 16 + Math.min(14, forceN * 1.2);
    ctx.fillStyle = a.forceDisplayed > ELASTIC_LIMIT_N ? '#b34a3c' : '#b8823d';
    ctx.beginPath();
    ctx.roundRect(ceilingX - weightSize / 2, weightY, weightSize, weightSize * 0.8, 3);
    ctx.fill();
    ctx.strokeStyle = '#6b4a1c';
    ctx.lineWidth = 1;
    ctx.stroke();

    // measurement ticks along spring
    ctx.strokeStyle = '#d8cfb6';
    ctx.font = '9px "Courier New", monospace';
    ctx.fillStyle = '#8a94a3';
    ctx.textAlign = 'left';
    ctx.beginPath();
    ctx.moveTo(ceilingX + 30, ceilingY);
    ctx.lineTo(ceilingX + 30, weightY);
    ctx.stroke();
    ctx.fillText('x', ceilingX + 34, ceilingY + springLenPx / 2);

    // --- Graph panel (right) ---
    const graphLeft = springAreaW + 40;
    const graphRight = w - 16;
    const graphTop = 26;
    const graphBottom = h - 36;
    const graphW = graphRight - graphLeft;
    const graphH = graphBottom - graphTop;

    const MAX_X_CM = extensionFor(10, 20) * 100 + 5; // headroom based on softest spring at max force
    const MAX_F = 10;

    const xForExt = (ext: number) => graphLeft + (ext / MAX_X_CM) * graphW;
    const yForForce = (f: number) => graphBottom - (f / MAX_F) * graphH;

    ctx.strokeStyle = '#b8b0a0';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(graphLeft, graphTop);
    ctx.lineTo(graphLeft, graphBottom);
    ctx.lineTo(graphRight, graphBottom);
    ctx.stroke();

    ctx.font = '10px "Courier New", monospace';
    ctx.fillStyle = '#8a94a3';
    ctx.strokeStyle = '#eee6d3';
    for (let fx = 0; fx <= MAX_F; fx += 2) {
      const y = yForForce(fx);
      ctx.beginPath();
      ctx.moveTo(graphLeft, y);
      ctx.lineTo(graphRight, y);
      ctx.stroke();
      ctx.textAlign = 'right';
      ctx.fillText(String(fx), graphLeft - 6, y + 3);
    }
    for (let ex = 0; ex <= MAX_X_CM; ex += 5) {
      const x = xForExt(ex);
      ctx.beginPath();
      ctx.moveTo(x, graphTop);
      ctx.lineTo(x, graphBottom);
      ctx.stroke();
      ctx.textAlign = 'center';
      ctx.fillText(String(ex), x, graphBottom + 14);
    }
    ctx.textAlign = 'left';
    ctx.fillStyle = '#4a5a72';
    ctx.font = '600 10px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
    ctx.fillText('extension (cm)', graphRight - 78, graphBottom + 27);
    ctx.save();
    ctx.translate(graphLeft - 34, graphTop + 30);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('force (N)', 0, 0);
    ctx.restore();

    // limit of proportionality marker
    const limitX = extensionFor(ELASTIC_LIMIT_N, a.k) * 100;
    ctx.strokeStyle = '#b34a3c';
    ctx.setLineDash([3, 3]);
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(xForExt(limitX), graphTop);
    ctx.lineTo(xForExt(limitX), graphBottom);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#b34a3c';
    ctx.font = '600 9px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('limit of proportionality', xForExt(limitX) + 4, graphTop + 10);

    // F-x curve, traced from 0 to current force
    ctx.strokeStyle = '#2e7d6b';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    const steps = 60;
    for (let i = 0; i <= steps; i++) {
      const f = (forceN * i) / steps;
      const ext = extensionFor(f, a.k) * 100;
      const px = xForExt(ext);
      const py = yForForce(f);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // current point
    const curX = xForExt(xCm);
    const curY = yForForce(forceN);
    ctx.fillStyle = '#b8823d';
    ctx.beginPath();
    ctx.arc(curX, curY, 4, 0, Math.PI * 2);
    ctx.fill();

    // technical overlay: gradient triangle in the linear region
    if (a.showTechnical) {
      const sampleF = Math.min(forceN, ELASTIC_LIMIT_N * 0.8, 4);
      if (sampleF > 0.3) {
        const sampleExt = extensionFor(sampleF, a.k) * 100;
        const x0 = xForExt(0);
        const y0 = yForForce(0);
        const x1 = xForExt(sampleExt);
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
    }

    setForceDisplay(forceN.toFixed(2));
    setExtensionDisplay(xCm.toFixed(1));
    setPastLimit(forceN > ELASTIC_LIMIT_N);
  };

  const tick = () => {
    const a = animRef.current;
    const diff = a.forceTarget - a.forceDisplayed;
    a.velocity += diff * 60 * (1 / 60) - a.velocity * 8 * (1 / 60);
    a.forceDisplayed += a.velocity * (1 / 60);

    if (Math.abs(diff) < 0.01 && Math.abs(a.velocity) < 0.01) {
      a.forceDisplayed = a.forceTarget;
      a.velocity = 0;
      a.running = false;
      draw();
      return;
    }
    draw();
    requestAnimationFrame(tick);
  };

  const handleForceChange = (val: number) => {
    setForceTarget(val);
    const a = animRef.current;
    a.forceTarget = val;
    if (!a.running) {
      a.running = true;
      requestAnimationFrame(tick);
    }
  };

  const handleKChange = (val: number) => {
    setK(val);
    animRef.current.k = val;
    draw();
  };

  const handleToggleTechnical = () => {
    const next = !showTechnical;
    setShowTechnical(next);
    animRef.current.showTechnical = next;
    draw();
  };

  const handleReset = () => {
    const a = animRef.current;
    a.forceDisplayed = 0;
    a.velocity = 0;
    a.forceTarget = 0;
    a.running = false;
    setForceTarget(0);
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
    { symbol: 'x', name: 'Extension', def: 'How much longer the spring gets compared to its natural length, in metres (m).' },
    { symbol: 'k', name: 'Spring constant', def: 'How stiff the spring is: k = F/x, in newtons per metre (N/m). A bigger k means a stiffer spring.' },
  ];

  return (
    <div className="spring-lab">
      <div className="bg-white border border-[#e4ddcc] rounded overflow-hidden mb-5">
        <div className="flex justify-between items-baseline px-4 pt-3">
          <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">
            Live Spring & Graph
          </span>
          <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">
            {pastLimit ? 'Beyond limit of proportionality' : 'Linear region'}
          </span>
        </div>
        <canvas ref={canvasRef} className="block w-full" style={{ height: 380 }} />

        <div className="px-4 pb-5 pt-3 border-t border-[#eee6d3]">
          <div className="flex items-center gap-3 mb-3">
            <label className="text-[13px] text-[#4a5a72] w-28 flex-shrink-0">Load (Force)</label>
            <input
              type="range"
              min={0}
              max={10}
              step={0.2}
              value={forceTarget}
              onChange={(e) => handleForceChange(parseFloat(e.target.value))}
              className="flex-1"
            />
            <span className="font-mono text-[13px] w-16 text-right">{forceTarget.toFixed(1)} N</span>
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
            onClick={handleReset}
            className="bg-transparent border border-[#d8cfb6] hover:bg-[#f5f0e2] text-[#1b2a41] text-[13.5px] font-semibold px-3.5 py-2 rounded"
          >
            ⟲ Remove Load
          </button>

          {pastLimit && (
            <p className="text-[12px] text-[#b34a3c] font-medium mt-3">
              Past this point the spring stretches more per newton — it&rsquo;s no longer obeying Hooke&rsquo;s
              law, and won&rsquo;t spring all the way back once unloaded.
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

      <div className="bg-gradient-to-br from-[#fbf5e8] to-[#f6efdc] border border-[#e6d9b8] rounded px-4 py-5 text-center mb-5">
        <div className="italic text-[26px] text-[#8f6428]" style={{ fontFamily: 'Georgia, serif' }}>
          F = k x
        </div>
        <div className="text-[12px] text-[#4a5a72] mt-2">
          force = spring constant × extension — true only up to the limit of proportionality
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
