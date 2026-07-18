'use client';

import { useEffect, useRef, useState } from 'react';

const MAX_TIME = 10; // seconds, length of one recording

type Mode = 'stationary' | 'constant' | 'accelerating' | 'decelerating';

interface ModeParams {
  v0: number;
  a: number; // signed
}

function getModeParams(mode: Mode, constantSpeed: number, accel: number, decelStart: number): ModeParams {
  switch (mode) {
    case 'stationary':
      return { v0: 0, a: 0 };
    case 'constant':
      return { v0: constantSpeed, a: 0 };
    case 'accelerating':
      return { v0: 0, a: accel };
    case 'decelerating':
      return { v0: decelStart, a: -1.2 };
  }
}

// distance & speed at time t, given v0/a, with decelerating clamped at v=0
function kinematics(t: number, v0: number, a: number) {
  if (a === 0) {
    return { s: v0 * t, v: v0 };
  }
  if (a > 0) {
    return { s: v0 * t + 0.5 * a * t * t, v: v0 + a * t };
  }
  // decelerating: clamp at v = 0
  const tStop = v0 / -a;
  if (t >= tStop) {
    const sStop = v0 * tStop + 0.5 * a * tStop * tStop;
    return { s: sStop, v: 0 };
  }
  return { s: v0 * t + 0.5 * a * t * t, v: v0 + a * t };
}

function estimateMaxDistance(mode: Mode, constantSpeed: number, accel: number, decelStart: number): number {
  const { v0, a } = getModeParams(mode, constantSpeed, accel, decelStart);
  const { s } = kinematics(MAX_TIME, v0, a);
  const raw = Math.max(s, 2);
  const step = raw > 40 ? 10 : raw > 15 ? 5 : 2;
  return Math.ceil(raw / step) * step;
}

const MODE_LABELS: Record<Mode, string> = {
  stationary: 'Stationary',
  constant: 'Constant Speed',
  accelerating: 'Accelerating',
  decelerating: 'Decelerating',
};

export function DistanceTimeGraphSimulator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const traceRef = useRef<{ t: number; s: number }[]>([]);

  const [mode, setMode] = useState<Mode>('constant');
  const [constantSpeed, setConstantSpeed] = useState(4);
  const [accel, setAccel] = useState(1.2);
  const [decelStart, setDecelStart] = useState(8);
  const [showTechnical, setShowTechnical] = useState(false);

  const [isRunning, setIsRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [elapsedDisplay, setElapsedDisplay] = useState('0.00');
  const [distanceDisplay, setDistanceDisplay] = useState('0.00');
  const [speedDisplay, setSpeedDisplay] = useState('0.00');

  const stateRef = useRef({
    running: false,
    elapsed: 0,
    lastTime: null as number | null,
    mode: mode as Mode,
    constantSpeed,
    accel,
    decelStart,
    showTechnical: false,
    maxDistance: estimateMaxDistance('constant', 4, 1.2, 8),
  });

  const resetSim = () => {
    const s = stateRef.current;
    s.running = false;
    s.elapsed = 0;
    s.lastTime = null;
    s.maxDistance = estimateMaxDistance(s.mode, s.constantSpeed, s.accel, s.decelStart);
    traceRef.current = [];
    setIsRunning(false);
    setFinished(false);
    setElapsedDisplay('0.00');
    setDistanceDisplay('0.00');
    setSpeedDisplay('0.00');
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
    const { v0, a } = getModeParams(s.mode, s.constantSpeed, s.accel, s.decelStart);
    const { s: dist, v: speed } = kinematics(s.elapsed, v0, a);

    // --- Track (top strip) ---
    const trackY = 34;
    const trackPadding = 20;
    const trackW = w - trackPadding * 2;
    ctx.strokeStyle = '#d8cfb6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(trackPadding, trackY);
    ctx.lineTo(trackPadding + trackW, trackY);
    ctx.stroke();

    const objX = trackPadding + Math.min(1, dist / s.maxDistance) * trackW;
    ctx.fillStyle = '#2e7d6b';
    ctx.beginPath();
    ctx.arc(objX, trackY, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#1c4a3f';
    ctx.lineWidth = 1;
    ctx.stroke();

    // --- Graph area ---
    const graphTop = 64;
    const graphBottom = h - 34;
    const graphLeft = 46;
    const graphRight = w - 14;
    const graphH = graphBottom - graphTop;
    const graphW = graphRight - graphLeft;

    const xForT = (t: number) => graphLeft + (t / MAX_TIME) * graphW;
    const yForS = (dVal: number) => graphBottom - (dVal / s.maxDistance) * graphH;

    // axes
    ctx.strokeStyle = '#b8b0a0';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(graphLeft, graphTop);
    ctx.lineTo(graphLeft, graphBottom);
    ctx.lineTo(graphRight, graphBottom);
    ctx.stroke();

    // gridlines + labels
    ctx.font = '10px "Courier New", monospace';
    ctx.fillStyle = '#8a94a3';
    ctx.strokeStyle = '#eee6d3';
    for (let tt = 0; tt <= MAX_TIME; tt += 2) {
      const x = xForT(tt);
      ctx.beginPath();
      ctx.moveTo(x, graphTop);
      ctx.lineTo(x, graphBottom);
      ctx.stroke();
      ctx.textAlign = 'center';
      ctx.fillText(String(tt), x, graphBottom + 14);
    }
    const distStep = s.maxDistance / 4;
    for (let dd = 0; dd <= s.maxDistance + 0.01; dd += distStep) {
      const y = yForS(dd);
      ctx.beginPath();
      ctx.moveTo(graphLeft, y);
      ctx.lineTo(graphRight, y);
      ctx.stroke();
      ctx.textAlign = 'right';
      ctx.fillText(dd.toFixed(0), graphLeft - 6, y + 3);
    }
    ctx.textAlign = 'left';
    ctx.fillStyle = '#4a5a72';
    ctx.font = '600 10px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
    ctx.fillText('time (s)', graphRight - 44, graphBottom + 26);
    ctx.save();
    ctx.translate(14, graphTop + 10);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('distance (m)', 0, 0);
    ctx.restore();

    // trace line
    const trace = traceRef.current;
    if (trace.length > 1) {
      ctx.strokeStyle = '#2e7d6b';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      trace.forEach((p, i) => {
        const x = xForT(p.t);
        const y = yForS(p.s);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }

    // current point marker
    if (s.elapsed > 0 || trace.length > 0) {
      const cx = xForT(s.elapsed);
      const cy = yForS(dist);
      ctx.fillStyle = '#b8823d';
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fill();

      // technical overlay: tangent / gradient triangle at current point
      if (s.showTechnical && s.elapsed > 0.4) {
        const dt = 0.6;
        const tBack = Math.max(0, s.elapsed - dt);
        const { s: sBack } = kinematics(tBack, v0, a);
        const x0 = xForT(tBack);
        const y0 = yForS(sBack);

        ctx.strokeStyle = '#b34a3c';
        ctx.setLineDash([4, 3]);
        ctx.lineWidth = 1.4;
        // horizontal leg
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(cx, y0);
        ctx.stroke();
        // vertical leg
        ctx.beginPath();
        ctx.moveTo(cx, y0);
        ctx.lineTo(cx, cy);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.font = '600 10px "Courier New", monospace';
        ctx.fillStyle = '#b34a3c';
        ctx.textAlign = 'center';
        ctx.fillText('Δt', (x0 + cx) / 2, y0 + 13);
        ctx.textAlign = 'left';
        ctx.fillText('Δs', cx + 6, (y0 + cy) / 2);

        // info box
        const boxX = graphLeft + 6;
        const boxY = graphTop + 4;
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.strokeStyle = '#e4ddcc';
        ctx.beginPath();
        ctx.roundRect(boxX, boxY, 148, 34, 4);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#1b2a41';
        ctx.font = '600 11px "Courier New", monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`gradient = Δs/Δt`, boxX + 7, boxY + 14);
        ctx.fillText(`= ${speed.toFixed(2)} m/s`, boxX + 7, boxY + 27);
      }
    }

    setElapsedDisplay(s.elapsed.toFixed(2));
    setDistanceDisplay(dist.toFixed(2));
    setSpeedDisplay(speed.toFixed(2));
  };

  const step = (ts: number) => {
    const s = stateRef.current;
    if (!s.running) return;
    if (s.lastTime === null) s.lastTime = ts;
    const dt = Math.min((ts - s.lastTime) / 1000, 0.032);
    s.lastTime = ts;
    s.elapsed = Math.min(s.elapsed + dt, MAX_TIME);

    const { v0, a } = getModeParams(s.mode, s.constantSpeed, s.accel, s.decelStart);
    const { s: dist } = kinematics(s.elapsed, v0, a);
    traceRef.current.push({ t: s.elapsed, s: dist });

    draw();

    if (s.elapsed >= MAX_TIME) {
      s.running = false;
      setIsRunning(false);
      setFinished(true);
      return;
    }
    if (s.running) requestAnimationFrame(step);
  };

  const handlePlayPause = () => {
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

  const handleModeChange = (m: Mode) => {
    setMode(m);
    stateRef.current.mode = m;
    if (!stateRef.current.running) resetSim();
  };

  const handleConstantSpeedChange = (v: number) => {
    setConstantSpeed(v);
    stateRef.current.constantSpeed = v;
    if (!stateRef.current.running) resetSim();
  };

  const handleAccelChange = (v: number) => {
    setAccel(v);
    stateRef.current.accel = v;
    if (!stateRef.current.running) resetSim();
  };

  const handleDecelStartChange = (v: number) => {
    setDecelStart(v);
    stateRef.current.decelStart = v;
    if (!stateRef.current.running) resetSim();
  };

  const handleToggleTechnical = () => {
    const next = !showTechnical;
    setShowTechnical(next);
    stateRef.current.showTechnical = next;
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
    { symbol: 's', name: 'Distance', def: 'How far the object has travelled, in metres (m).' },
    { symbol: 't', name: 'Time', def: 'How long the object has been moving, in seconds (s).' },
    { symbol: 'v', name: 'Speed', def: 'The gradient of the distance-time graph: v = Δs / Δt, in metres per second (m/s).' },
  ];

  return (
    <div className="dt-graph-lab">
      <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-5">
        <div className="bg-white border border-[#e4ddcc] rounded overflow-hidden">
          <div className="flex justify-between items-baseline px-4 pt-3">
            <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">
              Live Track & Graph
            </span>
            <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">
              {MODE_LABELS[mode]}
            </span>
          </div>
          <canvas ref={canvasRef} className="block w-full" style={{ height: 300 }} />

          {finished && (
            <div className="px-4 pt-1">
              <p className="text-[11.5px] text-[#1b2a41] font-semibold">
                ✓ Recording finished ({MAX_TIME}s). Press Release Again to re-run.
              </p>
            </div>
          )}

          <div className="px-4 pb-5 pt-3 border-t border-[#eee6d3]">
            <div className="flex flex-wrap gap-1.5 mb-4">
              {(Object.keys(MODE_LABELS) as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => handleModeChange(m)}
                  className={`text-[12px] font-semibold px-3 py-1.5 rounded-full border ${
                    mode === m
                      ? 'bg-[#1b2a41] text-white border-[#1b2a41]'
                      : 'bg-transparent text-[#1b2a41] border-[#d8cfb6] hover:bg-[#f5f0e2]'
                  }`}
                >
                  {MODE_LABELS[m]}
                </button>
              ))}
            </div>

            {mode === 'constant' && (
              <div className="flex items-center gap-3 mb-3">
                <label className="text-[13px] text-[#4a5a72] w-28 flex-shrink-0">Speed</label>
                <input
                  type="range"
                  min={1}
                  max={8}
                  step={0.5}
                  value={constantSpeed}
                  onChange={(e) => handleConstantSpeedChange(parseFloat(e.target.value))}
                  className="flex-1"
                />
                <span className="font-mono text-[13px] w-16 text-right">{constantSpeed.toFixed(1)} m/s</span>
              </div>
            )}
            {mode === 'accelerating' && (
              <div className="flex items-center gap-3 mb-3">
                <label className="text-[13px] text-[#4a5a72] w-28 flex-shrink-0">Acceleration</label>
                <input
                  type="range"
                  min={0.3}
                  max={3}
                  step={0.1}
                  value={accel}
                  onChange={(e) => handleAccelChange(parseFloat(e.target.value))}
                  className="flex-1"
                />
                <span className="font-mono text-[13px] w-16 text-right">{accel.toFixed(1)} m/s²</span>
              </div>
            )}
            {mode === 'decelerating' && (
              <div className="flex items-center gap-3 mb-3">
                <label className="text-[13px] text-[#4a5a72] w-28 flex-shrink-0">Start speed</label>
                <input
                  type="range"
                  min={3}
                  max={10}
                  step={0.5}
                  value={decelStart}
                  onChange={(e) => handleDecelStartChange(parseFloat(e.target.value))}
                  className="flex-1"
                />
                <span className="font-mono text-[13px] w-16 text-right">{decelStart.toFixed(1)} m/s</span>
              </div>
            )}

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
                onClick={handlePlayPause}
                className="bg-[#b8823d] hover:bg-[#8f6428] text-white text-[13.5px] font-semibold px-3.5 py-2 rounded"
              >
                {finished ? '↻ Release Again' : isRunning ? '⏸ Pause' : '▶ Start'}
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

        <div className="bg-white border border-[#e4ddcc] rounded p-4">
          <h2 className="font-mono text-[15px] tracking-wide uppercase text-[#4a5a72] border-b border-[#eee6d3] pb-2 mb-3.5">
            Readouts
          </h2>
          <div className="grid grid-cols-2 gap-2.5 mb-4">
            <div className="bg-[#faf7f0] border border-[#eee6d3] rounded px-3 py-2.5">
              <div className="text-[11px] text-[#4a5a72] mb-1">Elapsed time</div>
              <div className="font-mono text-xl font-bold">{elapsedDisplay} s</div>
            </div>
            <div className="bg-[#faf7f0] border border-[#eee6d3] rounded px-3 py-2.5">
              <div className="text-[11px] text-[#4a5a72] mb-1">Distance covered</div>
              <div className="font-mono text-xl font-bold text-[#2e7d6b]">{distanceDisplay} m</div>
            </div>
            <div className="bg-[#faf7f0] border border-[#eee6d3] rounded px-3 py-2.5 col-span-2">
              <div className="text-[11px] text-[#4a5a72] mb-1">Current speed (gradient)</div>
              <div className="font-mono text-xl font-bold text-[#b8823d]">{speedDisplay} m/s</div>
            </div>
          </div>

          <div className="bg-[#faf7f0] border border-[#eee6d3] rounded px-4 py-3 text-[12.5px] text-[#4a5a72] leading-relaxed mb-4">
            {mode === 'stationary' && 'A flat line: distance never changes, so the object is at rest.'}
            {mode === 'constant' && 'A straight line with steady slope: equal distances covered in equal times.'}
            {mode === 'accelerating' && 'A curve that gets steeper: the gradient — and so the speed — keeps increasing.'}
            {mode === 'decelerating' && 'A curve that flattens out: the gradient shrinks toward zero as the object slows to a stop.'}
          </div>

          <h2 className="font-mono text-[15px] tracking-wide uppercase text-[#4a5a72] border-b border-[#eee6d3] pb-2 mb-3.5">
            What Each Variable Means
          </h2>
          <div className="space-y-2.5">
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
    </div>
  );
}
