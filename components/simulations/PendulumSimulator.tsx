'use client';

import { useEffect, useRef, useState } from 'react';

const G = 9.8;

function theoreticalPeriod(L: number) {
  return 2 * Math.PI * Math.sqrt(L / G);
}

export function PendulumSimulator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Physics state kept in refs so the animation loop always reads the latest values
  const stateRef = useRef({
    length: 0.8,
    amplitude: 15,
    angle: 0,
    angularVel: 0,
    running: false,
    elapsed: 0,
    lastTime: null as number | null,
    timingMode: false,
    swingCount: 0,
    lastSign: null as number | null,
    timingStart: null as number | null,
  });

  const [length, setLength] = useState(0.8);
  const [amplitude, setAmplitude] = useState(15);
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedDisplay, setElapsedDisplay] = useState('0.00');
  const [angleDisplay, setAngleDisplay] = useState('0.0');
  const [swingCount, setSwingCount] = useState(0);
  const [timingActive, setTimingActive] = useState(false);
  const [result, setResult] = useState<{ measured: number; pctDiff: number } | null>(null);

  const theory = theoreticalPeriod(length);

  const resetPendulum = () => {
    const s = stateRef.current;
    s.running = false;
    s.elapsed = 0;
    s.angle = (amplitude * Math.PI) / 180;
    s.angularVel = 0;
    s.lastTime = null;
    s.timingMode = false;
    s.swingCount = 0;
    s.lastSign = null;
    s.timingStart = null;
    setIsRunning(false);
    setElapsedDisplay('0.00');
    setSwingCount(0);
    setTimingActive(false);
    setResult(null);
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
    const pivotX = w / 2;
    const pivotY = 36;
    const maxRodPx = h - 90;
    const pxPerMeter = maxRodPx / 1.5;
    const rodLen = s.length * pxPerMeter;

    const bobX = pivotX + rodLen * Math.sin(s.angle);
    const bobY = pivotY + rodLen * Math.cos(s.angle);

    ctx.strokeStyle = '#e9e1cd';
    ctx.setLineDash([3, 4]);
    ctx.beginPath();
    ctx.arc(pivotX, pivotY, rodLen, Math.PI / 2 - 0.7, Math.PI / 2 + 0.7);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#4a5a72';
    ctx.fillRect(pivotX - 30, pivotY - 8, 60, 8);
    ctx.beginPath();
    ctx.arc(pivotX, pivotY, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#8a94a3';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(pivotX, pivotY);
    ctx.lineTo(bobX, bobY);
    ctx.stroke();

    const grad = ctx.createRadialGradient(bobX - 5, bobY - 5, 2, bobX, bobY, 16);
    grad.addColorStop(0, '#e0b871');
    grad.addColorStop(1, '#8f6428');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(bobX, bobY, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#6b4a1c';
    ctx.lineWidth = 1;
    ctx.stroke();

    setAngleDisplay(Math.abs((s.angle * 180) / Math.PI).toFixed(1));
  };

  const finishTiming = (totalTimeForTenSwings: number) => {
    const s = stateRef.current;
    s.timingMode = false;
    s.running = false;
    setIsRunning(false);
    setTimingActive(false);

    const measured = totalTimeForTenSwings / 10;
    const th = theoreticalPeriod(s.length);
    const pctDiff = (Math.abs(measured - th) / th) * 100;
    setResult({ measured, pctDiff });
  };

  const step = (ts: number) => {
    const s = stateRef.current;
    if (!s.running) return;
    if (s.lastTime === null) s.lastTime = ts;
    const dt = Math.min((ts - s.lastTime) / 1000, 0.032);
    s.lastTime = ts;
    s.elapsed += dt;

    const omega2 = G / s.length;
    const angularAcc = -omega2 * s.angle;
    s.angularVel += angularAcc * dt;
    s.angle += s.angularVel * dt;

    const sign = Math.sign(s.angle);
    if (s.lastSign !== null && sign !== 0 && sign !== s.lastSign && s.timingMode) {
      s.swingCount += 0.5;
      setSwingCount(Math.min(s.swingCount, 10));
      if (s.swingCount >= 10 && s.timingStart !== null) {
        finishTiming((performance.now() - s.timingStart) / 1000);
      }
    }
    if (sign !== 0) s.lastSign = sign;

    setElapsedDisplay(s.elapsed.toFixed(2));
    draw();
    if (s.running) requestAnimationFrame(step);
  };

  const handlePlayPause = () => {
    const s = stateRef.current;
    if (s.running) {
      s.running = false;
      setIsRunning(false);
    } else {
      s.running = true;
      s.lastTime = null;
      setIsRunning(true);
      if (s.timingMode && s.timingStart === null) {
        s.timingStart = performance.now();
      }
      requestAnimationFrame(step);
    }
  };

  const handleStartTiming = () => {
    resetPendulum();
    const s = stateRef.current;
    s.timingMode = true;
    setTimingActive(true);
  };

  const handleLengthChange = (val: number) => {
    setLength(val);
    stateRef.current.length = val;
    if (!stateRef.current.running) resetPendulum();
  };

  const handleAmplitudeChange = (val: number) => {
    setAmplitude(val);
    stateRef.current.amplitude = val;
    if (!stateRef.current.running) resetPendulum();
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

    // initialize
    stateRef.current.angle = (amplitude * Math.PI) / 180;
    draw();

    return () => window.removeEventListener('resize', resize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="pendulum-lab">
      <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-5">
        {/* Apparatus */}
        <div className="bg-white border border-[#e4ddcc] rounded overflow-hidden">
          <div className="flex justify-between items-baseline px-4 pt-3">
            <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">
              Live Apparatus
            </span>
            <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">
              θ = {angleDisplay}°
            </span>
          </div>
          <canvas ref={canvasRef} className="block w-full" style={{ height: 340 }} />

          <div className="px-4 pb-5 pt-4 border-t border-[#eee6d3]">
            <div className="flex items-center gap-3 mb-3">
              <label className="text-[13px] text-[#4a5a72] w-28 flex-shrink-0">Length (L)</label>
              <input
                type="range"
                min={0.2}
                max={1.5}
                step={0.05}
                value={length}
                onChange={(e) => handleLengthChange(parseFloat(e.target.value))}
                className="flex-1"
              />
              <span className="font-mono text-[13px] w-14 text-right">{length.toFixed(2)} m</span>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <label className="text-[13px] text-[#4a5a72] w-28 flex-shrink-0">Start angle</label>
              <input
                type="range"
                min={5}
                max={30}
                step={1}
                value={amplitude}
                onChange={(e) => handleAmplitudeChange(parseFloat(e.target.value))}
                className="flex-1"
              />
              <span className="font-mono text-[13px] w-14 text-right">{amplitude}°</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={handlePlayPause}
                className="bg-[#b8823d] hover:bg-[#8f6428] text-white text-[13.5px] font-semibold px-3.5 py-2 rounded"
              >
                {isRunning ? '⏸ Pause' : '▶ Release'}
              </button>
              <button
                onClick={resetPendulum}
                className="bg-transparent border border-[#d8cfb6] hover:bg-[#f5f0e2] text-[#1b2a41] text-[13.5px] font-semibold px-3.5 py-2 rounded"
              >
                ⟲ Reset
              </button>
              <button
                onClick={handleStartTiming}
                className={`text-white text-[13.5px] font-semibold px-3.5 py-2 rounded ${
                  timingActive ? 'bg-[#b34a3c]' : 'bg-[#2e7d6b] hover:bg-[#24685a]'
                }`}
              >
                ⏱ {timingActive ? 'Timing… release now' : 'Start Timing 10 Swings'}
              </button>
            </div>
          </div>
        </div>

        {/* Readouts */}
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
              <div className="text-[11px] text-[#4a5a72] mb-1">Theoretical period T</div>
              <div className="font-mono text-xl font-bold text-[#2e7d6b]">{theory.toFixed(2)} s</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#fbf5e8] to-[#f6efdc] border border-[#e6d9b8] rounded px-4 py-3.5 text-center mb-4">
            <div className="italic text-[22px] text-[#8f6428]" style={{ fontFamily: 'Georgia, serif' }}>
              T = 2π √(L / g)
            </div>
            <div className="text-[11.5px] text-[#4a5a72] mt-1.5">
              g ≈ 9.8 m/s² · small-angle approximation
            </div>
          </div>

          <h2 className="font-mono text-[15px] tracking-wide uppercase text-[#4a5a72] border-b border-[#eee6d3] pb-2 mb-3.5">
            Measure It Yourself
          </h2>
          <div className="bg-white border border-dashed border-[#d8cfb6] rounded px-4 py-3.5">
            <p className="text-[12.5px] text-[#4a5a72] leading-relaxed mb-2.5">
              Press <b>Start Timing</b>, then <b>Release</b>. The lab counts 10 full swings automatically —
              the technique used to reduce timing error.
            </p>
            <div className="font-mono text-[13px] mb-2.5">
              Swings counted: <b className="text-[#2e7d6b] text-[15px]">{swingCount}</b> / 10
            </div>
            {result && (
              <div className="mt-3.5 pt-3 border-t border-[#eee6d3] text-[12.5px] text-[#4a5a72] leading-relaxed">
                Measured period: <b className="text-[#1b2a41]">{result.measured.toFixed(2)} s</b>{' '}
                <span className="inline-block font-mono text-[11px] px-1.5 py-0.5 rounded-full bg-[#cfe4de] text-[#2e7d6b] ml-1">
                  {result.pctDiff < 3
                    ? `within ${result.pctDiff.toFixed(1)}% of theory ✓`
                    : `${result.pctDiff.toFixed(1)}% off — check timing`}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
