'use client';

import { useEffect, useRef, useState } from 'react';

interface PathPoint {
  x: number;
  y: number;
}

function buildLoopPath(left: number, top: number, right: number, bottom: number): PathPoint[] {
  // sampled points around a rounded rectangular loop, clockwise from top-left
  const pts: PathPoint[] = [];
  const steps = 60;
  const r = 10;

  const segments: [PathPoint, PathPoint][] = [
    [{ x: left + r, y: top }, { x: right - r, y: top }], // top
    [{ x: right, y: top + r }, { x: right, y: bottom - r }], // right
    [{ x: right - r, y: bottom }, { x: left + r, y: bottom }], // bottom
    [{ x: left, y: bottom - r }, { x: left, y: top + r }], // left
  ];

  segments.forEach(([a, b]) => {
    for (let i = 0; i < steps / 4; i++) {
      const t = i / (steps / 4);
      pts.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
    }
  });

  return pts;
}

function drawBattery(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  ctx.strokeStyle = '#1b2a41';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(cx - 14, cy);
  ctx.lineTo(cx - 5, cy);
  ctx.moveTo(cx - 5, cy - 10);
  ctx.lineTo(cx - 5, cy + 10);
  ctx.stroke();
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(cx + 5, cy - 6);
  ctx.lineTo(cx + 5, cy + 6);
  ctx.stroke();
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(cx + 5, cy);
  ctx.lineTo(cx + 14, cy);
  ctx.stroke();
  ctx.font = '700 10px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
  ctx.fillStyle = '#4a5a72';
  ctx.textAlign = 'center';
  ctx.fillText('+', cx - 9, cy - 14);
  ctx.fillText('−', cx + 9, cy - 14);
  ctx.textAlign = 'left';
}

function drawResistor(ctx: CanvasRenderingContext2D, cx: number, cy: number, hot: number) {
  const w = 46;
  const h = 14;
  const heat = `rgb(${180 + hot * 60}, ${74 + hot * 20}, ${60 - hot * 20})`;
  ctx.strokeStyle = heat;
  ctx.fillStyle = '#faf7f0';
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(cx - w / 2 - 12, cy);
  ctx.lineTo(cx - w / 2, cy);
  const zigzags = 5;
  const segW = w / zigzags;
  for (let i = 0; i < zigzags; i++) {
    const x0 = cx - w / 2 + i * segW;
    const x1 = x0 + segW / 2;
    const x2 = x0 + segW;
    ctx.lineTo(x1, cy + (i % 2 === 0 ? -h / 2 : h / 2));
    ctx.lineTo(x2, cy);
  }
  ctx.lineTo(cx + w / 2 + 12, cy);
  ctx.stroke();
}

export function OhmsLawSimulator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phaseRef = useRef(0);
  const pathRef = useRef<PathPoint[]>([]);
  const runningRef = useRef(false);

  const [voltage, setVoltage] = useState(6);
  const [resistance, setResistance] = useState(4);

  const current = voltage / resistance;

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    ctx.clearRect(0, 0, w, h);

    // --- Circuit panel ---
    const loopLeft = 40;
    const loopRight = w - 40;
    const loopTop = 24;
    const loopBottom = 130;
    pathRef.current = buildLoopPath(loopLeft, loopTop, loopRight, loopBottom);

    ctx.strokeStyle = '#8a94a3';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.roundRect(loopLeft, loopTop, loopRight - loopLeft, loopBottom - loopTop, 10);
    ctx.stroke();

    drawBattery(ctx, loopLeft, (loopTop + loopBottom) / 2);
    drawResistor(ctx, (loopLeft + loopRight) / 2, loopTop, Math.min(1, current / 4));

    // ammeter, in series on the right side
    const ammeterY = (loopTop + loopBottom) / 2;
    ctx.fillStyle = '#faf7f0';
    ctx.strokeStyle = '#4a5a72';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(loopRight, ammeterY, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#4a5a72';
    ctx.font = '700 12px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('A', loopRight, ammeterY + 4);

    // voltmeter, across the resistor
    const vmX = (loopLeft + loopRight) / 2;
    const vmY = loopTop - 26;
    ctx.strokeStyle = '#8a94a3';
    ctx.lineWidth = 1.4;
    ctx.setLineDash([2, 3]);
    ctx.beginPath();
    ctx.moveTo(vmX - 30, loopTop);
    ctx.lineTo(vmX - 30, vmY);
    ctx.lineTo(vmX + 30, vmY);
    ctx.lineTo(vmX + 30, loopTop);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#faf7f0';
    ctx.strokeStyle = '#7a4a8f';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(vmX, vmY, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#7a4a8f';
    ctx.fillText('V', vmX, vmY + 4);
    ctx.textAlign = 'left';

    // animated current dots
    const path = pathRef.current;
    if (path.length > 0 && current > 0.02) {
      const dotCount = 14;
      for (let i = 0; i < dotCount; i++) {
        const idx = Math.floor((phaseRef.current + (i / dotCount) * path.length) % path.length);
        const p = path[idx];
        ctx.fillStyle = '#2e7d6b';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // --- Graph: V against I ---
    const graphLeft = 54;
    const graphRight = w - 16;
    const graphTop = 158;
    const graphBottom = h - 34;
    const graphW = graphRight - graphLeft;
    const graphH = graphBottom - graphTop;

    const MAX_I = 6;
    const MAX_V = 14;

    const xForI = (i: number) => graphLeft + (i / MAX_I) * graphW;
    const yForV = (v: number) => graphBottom - (v / MAX_V) * graphH;

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
    for (let ii = 0; ii <= MAX_I; ii += 1) {
      const x = xForI(ii);
      ctx.beginPath();
      ctx.moveTo(x, graphTop);
      ctx.lineTo(x, graphBottom);
      ctx.stroke();
      ctx.textAlign = 'center';
      ctx.fillText(String(ii), x, graphBottom + 14);
    }
    for (let vv = 0; vv <= MAX_V; vv += 2) {
      const y = yForV(vv);
      ctx.beginPath();
      ctx.moveTo(graphLeft, y);
      ctx.lineTo(graphRight, y);
      ctx.stroke();
      ctx.textAlign = 'right';
      ctx.fillText(String(vv), graphLeft - 6, y + 3);
    }
    ctx.textAlign = 'left';
    ctx.fillStyle = '#4a5a72';
    ctx.font = '600 10px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
    ctx.fillText('Current (A)', graphRight - 62, graphBottom + 26);
    ctx.save();
    ctx.translate(18, graphTop + 10);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Voltage (V)', 0, 0);
    ctx.restore();

    // full characteristic line for the current resistance (through the origin)
    ctx.strokeStyle = '#c7d6e6';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(xForI(0), yForV(0));
    const iEdge = Math.min(MAX_I, MAX_V / resistance);
    ctx.lineTo(xForI(iEdge), yForV(iEdge * resistance));
    ctx.stroke();

    // live operating point + short trace from origin
    ctx.strokeStyle = '#2e7d6b';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(xForI(0), yForV(0));
    ctx.lineTo(xForI(Math.min(current, MAX_I)), yForV(Math.min(voltage, MAX_V)));
    ctx.stroke();

    ctx.fillStyle = '#b8823d';
    ctx.beginPath();
    ctx.arc(xForI(Math.min(current, MAX_I)), yForV(Math.min(voltage, MAX_V)), 4.5, 0, Math.PI * 2);
    ctx.fill();
  };

  const animate = () => {
    phaseRef.current += current * 0.9;
    draw();
    if (runningRef.current) requestAnimationFrame(animate);
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

    runningRef.current = true;
    requestAnimationFrame(animate);

    return () => {
      runningRef.current = false;
      window.removeEventListener('resize', resize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voltage, resistance]);

  const variables = [
    { symbol: 'V', name: 'Voltage (p.d.)', def: 'The push driving current through the circuit, in volts (V).' },
    { symbol: 'I', name: 'Current', def: 'The rate of flow of charge, in amps (A) — shown by the moving dots.' },
    { symbol: 'R', name: 'Resistance', def: 'R = V/I, in ohms (Ω). A bigger R means less current for the same voltage.' },
  ];

  return (
    <div className="ohms-lab">
      <div className="bg-white border border-[#e4ddcc] rounded overflow-hidden mb-5">
        <div className="flex justify-between items-baseline px-4 pt-3">
          <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">
            Live Circuit & Graph
          </span>
          <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">
            I = {current.toFixed(2)} A
          </span>
        </div>
        <canvas ref={canvasRef} className="block w-full" style={{ height: 400 }} />

        <div className="px-4 pb-5 pt-3 border-t border-[#eee6d3]">
          <div className="flex items-center gap-3 mb-3">
            <label className="text-[13px] text-[#4a5a72] w-24 flex-shrink-0">Voltage</label>
            <input
              type="range"
              min={1}
              max={12}
              step={0.5}
              value={voltage}
              onChange={(e) => setVoltage(parseFloat(e.target.value))}
              className="flex-1"
            />
            <span className="font-mono text-[13px] w-16 text-right">{voltage.toFixed(1)} V</span>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-[13px] text-[#4a5a72] w-24 flex-shrink-0">Resistance</label>
            <input
              type="range"
              min={1}
              max={20}
              step={1}
              value={resistance}
              onChange={(e) => setResistance(parseFloat(e.target.value))}
              className="flex-1"
            />
            <span className="font-mono text-[13px] w-16 text-right">{resistance} Ω</span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#e4ddcc] rounded p-4 mb-5">
        <h2 className="font-mono text-[15px] tracking-wide uppercase text-[#4a5a72] border-b border-[#eee6d3] pb-2 mb-3.5">
          Readouts
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-4">
          <div className="bg-[#faf7f0] border border-[#eee6d3] rounded px-3 py-2.5">
            <div className="text-[11px] text-[#4a5a72] mb-1">Voltage V</div>
            <div className="font-mono text-xl font-bold text-[#7a4a8f]">{voltage.toFixed(1)} V</div>
          </div>
          <div className="bg-[#faf7f0] border border-[#eee6d3] rounded px-3 py-2.5">
            <div className="text-[11px] text-[#4a5a72] mb-1">Current I</div>
            <div className="font-mono text-xl font-bold text-[#2e7d6b]">{current.toFixed(2)} A</div>
          </div>
          <div className="bg-[#faf7f0] border border-[#eee6d3] rounded px-3 py-2.5">
            <div className="text-[11px] text-[#4a5a72] mb-1">Resistance R</div>
            <div className="font-mono text-xl font-bold text-[#b8823d]">{resistance} Ω</div>
          </div>
        </div>
        <div className="bg-[#faf7f0] border border-[#eee6d3] rounded px-4 py-3 text-[12.5px] text-[#4a5a72] leading-relaxed">
          For a fixed resistor, the V-I graph is a straight line through the origin — that&rsquo;s Ohm&rsquo;s
          law. The line&rsquo;s gradient is the resistance: a steeper line means a bigger R.
        </div>
      </div>

      <div className="bg-gradient-to-br from-[#fbf5e8] to-[#f6efdc] border border-[#e6d9b8] rounded px-4 py-5 text-center mb-5">
        <div className="italic text-[26px] text-[#8f6428]" style={{ fontFamily: 'Georgia, serif' }}>
          V = I R
        </div>
        <div className="text-[12px] text-[#4a5a72] mt-2">
          voltage = current × resistance
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
