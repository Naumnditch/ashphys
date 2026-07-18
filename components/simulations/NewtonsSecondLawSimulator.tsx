'use client';

import { useEffect, useRef, useState } from 'react';

const MAX_TIME = 8; // seconds per run

function drawBlock(ctx: CanvasRenderingContext2D, x: number, trackY: number, forceN: number) {
  const size = 40;
  const top = trackY - size;

  // block
  const grad = ctx.createLinearGradient(x - size / 2, top, x + size / 2, trackY);
  grad.addColorStop(0, '#e0b871');
  grad.addColorStop(1, '#8f6428');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.roundRect(x - size / 2, top, size, size, 4);
  ctx.fill();
  ctx.strokeStyle = '#6b4a1c';
  ctx.lineWidth = 1.4;
  ctx.stroke();

  // mass label
  ctx.fillStyle = '#4a3620';
  ctx.font = '700 11px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('m', x, top + size / 2 + 4);
  ctx.textAlign = 'left';

  // force arrow (in front of the block, pointing right)
  if (forceN > 0) {
    const arrowLen = 24 + forceN * 6;
    const ay = top + size / 2;
    const ax0 = x + size / 2 + 6;
    const ax1 = ax0 + arrowLen;

    ctx.strokeStyle = '#b34a3c';
    ctx.fillStyle = '#b34a3c';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(ax0, ay);
    ctx.lineTo(ax1, ay);
    ctx.stroke();

    const headLen = 8;
    ctx.beginPath();
    ctx.moveTo(ax1, ay);
    ctx.lineTo(ax1 - headLen, ay - 5);
    ctx.lineTo(ax1 - headLen, ay + 5);
    ctx.closePath();
    ctx.fill();

    ctx.font = '700 11px "Courier New", monospace';
    ctx.fillText('F', ax1 + 6, ay + 4);
  }
}

export function NewtonsSecondLawSimulator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const traceRef = useRef<{ t: number; v: number }[]>([]);

  const [forceN, setForceN] = useState(4);
  const [massKg, setMassKg] = useState(2);
  const [isRunning, setIsRunning] = useState(false);
  const [finished, setFinished] = useState(false);

  const [elapsedDisplay, setElapsedDisplay] = useState('0.00');
  const [velocityDisplay, setVelocityDisplay] = useState('0.00');
  const [accelDisplay, setAccelDisplay] = useState('0.00');

  const stateRef = useRef({
    running: false,
    elapsed: 0,
    lastTime: null as number | null,
    forceN: 4,
    massKg: 2,
    position: 0, // m, for animating the block along the track
  });

  const resetSim = () => {
    const s = stateRef.current;
    s.running = false;
    s.elapsed = 0;
    s.lastTime = null;
    s.position = 0;
    traceRef.current = [];
    setIsRunning(false);
    setFinished(false);
    setElapsedDisplay('0.00');
    setVelocityDisplay('0.00');
    draw();
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

    const s = stateRef.current;
    const a = s.forceN / s.massKg;
    const v = a * s.elapsed;

    // --- Track ---
    const trackY = 66;
    const trackPadding = 24;
    const trackW = w - trackPadding * 2;
    ctx.strokeStyle = '#d8cfb6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(trackPadding, trackY);
    ctx.lineTo(trackPadding + trackW, trackY);
    ctx.stroke();

    // hatching underneath, indicating a surface
    for (let i = 0; i < trackW; i += 12) {
      ctx.strokeStyle = '#e6ded0';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(trackPadding + i, trackY + 3);
      ctx.lineTo(trackPadding + i - 5, trackY + 9);
      ctx.stroke();
    }

    const maxPositionM = 0.5 * (10 / 0.5) * MAX_TIME * MAX_TIME; // generous headroom (max a * t^2 /2)
    const blockX = trackPadding + Math.min(1, s.position / (maxPositionM * 0.06)) * trackW;

    drawBlock(ctx, Math.min(blockX, trackPadding + trackW - 24), trackY, s.forceN);

    // --- Graph: velocity-time ---
    const graphLeft = 50;
    const graphRight = w - 16;
    const graphTop = 96;
    const graphBottom = h - 34;
    const graphW = graphRight - graphLeft;
    const graphH = graphBottom - graphTop;

    const MAX_V = Math.max(8, (10 / 0.5) * MAX_TIME * 0.6); // headroom across the slider range

    const xForT = (t: number) => graphLeft + (t / MAX_TIME) * graphW;
    const yForV = (vel: number) => graphBottom - (vel / MAX_V) * graphH;

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
    for (let tt = 0; tt <= MAX_TIME; tt += 1) {
      const x = xForT(tt);
      ctx.beginPath();
      ctx.moveTo(x, graphTop);
      ctx.lineTo(x, graphBottom);
      ctx.stroke();
      ctx.textAlign = 'center';
      ctx.fillText(String(tt), x, graphBottom + 14);
    }
    const vStep = MAX_V / 4;
    for (let vv = 0; vv <= MAX_V + 0.01; vv += vStep) {
      const y = yForV(vv);
      ctx.beginPath();
      ctx.moveTo(graphLeft, y);
      ctx.lineTo(graphRight, y);
      ctx.stroke();
      ctx.textAlign = 'right';
      ctx.fillText(vv.toFixed(0), graphLeft - 6, y + 3);
    }
    ctx.textAlign = 'left';
    ctx.fillStyle = '#4a5a72';
    ctx.font = '600 10px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
    ctx.fillText('time (s)', graphRight - 44, graphBottom + 26);
    ctx.save();
    ctx.translate(16, graphTop + 10);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('velocity (m/s)', 0, 0);
    ctx.restore();

    const trace = traceRef.current;
    if (trace.length > 1) {
      ctx.strokeStyle = '#2e7d6b';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      trace.forEach((p, i) => {
        const x = xForT(p.t);
        const y = yForV(p.v);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }

    if (s.elapsed > 0 || trace.length > 0) {
      const cx = xForT(s.elapsed);
      const cy = yForV(v);
      ctx.fillStyle = '#b8823d';
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    setElapsedDisplay(s.elapsed.toFixed(2));
    setVelocityDisplay(v.toFixed(2));
    setAccelDisplay(a.toFixed(2));
  };

  const step = (ts: number) => {
    const s = stateRef.current;
    if (!s.running) return;
    if (s.lastTime === null) s.lastTime = ts;
    const dt = Math.min((ts - s.lastTime) / 1000, 0.032);
    s.lastTime = ts;
    s.elapsed = Math.min(s.elapsed + dt, MAX_TIME);

    const a = s.forceN / s.massKg;
    const v = a * s.elapsed;
    s.position += v * dt;
    traceRef.current.push({ t: s.elapsed, v });

    draw();

    if (s.elapsed >= MAX_TIME) {
      s.running = false;
      setIsRunning(false);
      setFinished(true);
      return;
    }
    if (s.running) requestAnimationFrame(step);
  };

  const handleStartPause = () => {
    const s = stateRef.current;
    if (finished) {
      resetSim();
      s.running = true;
      s.lastTime = null;
      setIsRunning(true);
      requestAnimationFrame(step);
      return;
    }
    if (s.running) {
      s.running = false;
      setIsRunning(false);
    } else {
      s.running = true;
      s.lastTime = null;
      setIsRunning(true);
      requestAnimationFrame(step);
    }
  };

  const handleForceChange = (val: number) => {
    setForceN(val);
    stateRef.current.forceN = val;
    if (!stateRef.current.running) resetSim();
  };

  const handleMassChange = (val: number) => {
    setMassKg(val);
    stateRef.current.massKg = val;
    if (!stateRef.current.running) resetSim();
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

  const acceleration = forceN / massKg;

  const variables = [
    { symbol: 'F', name: 'Force', def: 'The push applied to the block, in newtons (N).' },
    { symbol: 'm', name: 'Mass', def: 'How much matter is in the block, in kilograms (kg).' },
    { symbol: 'a', name: 'Acceleration', def: 'How quickly velocity increases: a = F/m, in metres per second squared (m/s²).' },
  ];

  return (
    <div className="newton-lab">
      <div className="bg-white border border-[#e4ddcc] rounded overflow-hidden mb-5">
        <div className="flex justify-between items-baseline px-4 pt-3">
          <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">
            Live Block & Graph
          </span>
          <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">
            a = {accelDisplay} m/s²
          </span>
        </div>
        <canvas ref={canvasRef} className="block w-full" style={{ height: 380 }} />

        {finished && (
          <div className="px-4 pt-1">
            <p className="text-[11.5px] text-[#1b2a41] font-semibold">
              ✓ Run finished ({MAX_TIME}s). Press Run Again to repeat.
            </p>
          </div>
        )}

        <div className="px-4 pb-5 pt-3 border-t border-[#eee6d3]">
          <div className="flex items-center gap-3 mb-3">
            <label className="text-[13px] text-[#4a5a72] w-24 flex-shrink-0">Force</label>
            <input
              type="range"
              min={1}
              max={10}
              step={0.5}
              value={forceN}
              onChange={(e) => handleForceChange(parseFloat(e.target.value))}
              disabled={isRunning}
              className="flex-1"
            />
            <span className="font-mono text-[13px] w-16 text-right">{forceN.toFixed(1)} N</span>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <label className="text-[13px] text-[#4a5a72] w-24 flex-shrink-0">Mass</label>
            <input
              type="range"
              min={0.5}
              max={5}
              step={0.5}
              value={massKg}
              onChange={(e) => handleMassChange(parseFloat(e.target.value))}
              disabled={isRunning}
              className="flex-1"
            />
            <span className="font-mono text-[13px] w-16 text-right">{massKg.toFixed(1)} kg</span>
          </div>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={handleStartPause}
              className="bg-[#b8823d] hover:bg-[#8f6428] text-white text-[13.5px] font-semibold px-3.5 py-2 rounded"
            >
              {finished ? '↻ Run Again' : isRunning ? '⏸ Pause' : '▶ Start'}
            </button>
            <button
              onClick={resetSim}
              className="bg-transparent border border-[#d8cfb6] hover:bg-[#f5f0e2] text-[#1b2a41] text-[13.5px] font-semibold px-3.5 py-2 rounded"
            >
              ⟲ Reset
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#e4ddcc] rounded p-4 mb-5">
        <h2 className="font-mono text-[15px] tracking-wide uppercase text-[#4a5a72] border-b border-[#eee6d3] pb-2 mb-3.5">
          Readouts
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
          <div className="bg-[#faf7f0] border border-[#eee6d3] rounded px-3 py-2.5">
            <div className="text-[11px] text-[#4a5a72] mb-1">Force F</div>
            <div className="font-mono text-lg font-bold text-[#b34a3c]">{forceN.toFixed(1)} N</div>
          </div>
          <div className="bg-[#faf7f0] border border-[#eee6d3] rounded px-3 py-2.5">
            <div className="text-[11px] text-[#4a5a72] mb-1">Mass m</div>
            <div className="font-mono text-lg font-bold text-[#8f6428]">{massKg.toFixed(1)} kg</div>
          </div>
          <div className="bg-[#faf7f0] border border-[#eee6d3] rounded px-3 py-2.5">
            <div className="text-[11px] text-[#4a5a72] mb-1">Acceleration a</div>
            <div className="font-mono text-lg font-bold text-[#2e7d6b]">{accelDisplay} m/s²</div>
          </div>
          <div className="bg-[#faf7f0] border border-[#eee6d3] rounded px-3 py-2.5">
            <div className="text-[11px] text-[#4a5a72] mb-1">Velocity now</div>
            <div className="font-mono text-lg font-bold">{velocityDisplay} m/s</div>
          </div>
        </div>
        <div className="bg-[#faf7f0] border border-[#eee6d3] rounded px-4 py-3 text-[12.5px] text-[#4a5a72] leading-relaxed">
          Force and mass stay constant during a run, so acceleration is constant too — that&rsquo;s why the
          velocity-time graph is a straight line. Its gradient <i>is</i> the acceleration.
        </div>
      </div>

      <div className="bg-gradient-to-br from-[#fbf5e8] to-[#f6efdc] border border-[#e6d9b8] rounded px-4 py-5 text-center mb-5">
        <div className="italic text-[26px] text-[#8f6428]" style={{ fontFamily: 'Georgia, serif' }}>
          F = m a
        </div>
        <div className="text-[12px] text-[#4a5a72] mt-2">
          the same resultant force accelerates a bigger mass more slowly
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
