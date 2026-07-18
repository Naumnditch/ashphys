'use client';

import { useEffect, useRef, useState } from 'react';

const G = 9.8;
const DAMPING = 0.12; // energy loss coefficient (air resistance + pivot friction)
const TRAIL_SECONDS = 3.5;
const FLASH_DURATION = 1.2; // seconds, how long the "lost distance" flash takes to fade
const SETTLE_THRESHOLD_DEG = 0.2; // stop the clock once amplitude decays to this

function theoreticalPeriod(L: number) {
  return 2 * Math.PI * Math.sqrt(L / G);
}

interface TrailPoint {
  x: number;
  y: number;
  t: number;
}

interface Flash {
  startAngle: number;
  endAngle: number;
  createdAt: number;
}

function drawArrow(
  ctx: CanvasRenderingContext2D,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  color: string,
  label?: string
) {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const len = Math.hypot(dx, dy);
  if (len < 3) return;

  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.stroke();

  const headLen = 7;
  const angle = Math.atan2(dy, dx);
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x1 - headLen * Math.cos(angle - Math.PI / 6), y1 - headLen * Math.sin(angle - Math.PI / 6));
  ctx.lineTo(x1 - headLen * Math.cos(angle + Math.PI / 6), y1 - headLen * Math.sin(angle + Math.PI / 6));
  ctx.closePath();
  ctx.fill();

  if (label) {
    ctx.font = '600 11px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
    ctx.fillStyle = color;
    ctx.textAlign = dx >= 0 ? 'left' : 'right';
    ctx.fillText(label, x1 + (dx >= 0 ? 5 : -5), y1 + 4);
    ctx.textAlign = 'left';
  }
}

export function PendulumSimulator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trailRef = useRef<TrailPoint[]>([]);
  const flashesRef = useRef<Flash[]>([]);

  const stateRef = useRef({
    length: 0.8,
    amplitude: 15,
    mass: 0.2,
    angle: 0,
    angularVel: 0,
    running: false,
    elapsed: 0,
    lastTime: null as number | null,
    swingCount: 0,
    lastSign: null as number | null,
    lastAngularVelSign: null as number | null,
    currentAmplitudeDeg: 15,
    prevRightPeakDeg: null as number | null,
    prevLeftPeakDeg: null as number | null,
    settled: false,
    lastTurningPointTime: null as number | null,
    measuredHalfCycle: null as number | null,
    showTechnical: false,
  });

  const [length, setLength] = useState(0.8);
  const [amplitude, setAmplitude] = useState(15);
  const [mass, setMass] = useState(0.2);
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedDisplay, setElapsedDisplay] = useState('0.00');
  const [angleDisplay, setAngleDisplay] = useState('0.0');
  const [swingCount, setSwingCount] = useState(0);
  const [currentAmplitude, setCurrentAmplitude] = useState('15.0');
  const [settled, setSettled] = useState(false);
  const [showTechnical, setShowTechnical] = useState(false);
  const [measuredHalfCycleDisplay, setMeasuredHalfCycleDisplay] = useState('—');

  const theory = theoreticalPeriod(length);

  const resetPendulum = () => {
    const s = stateRef.current;
    s.running = false;
    s.elapsed = 0;
    s.angle = (amplitude * Math.PI) / 180;
    s.angularVel = 0;
    s.lastTime = null;
    s.swingCount = 0;
    s.lastSign = null;
    s.lastAngularVelSign = null;
    s.currentAmplitudeDeg = amplitude;
    s.prevRightPeakDeg = amplitude;
    s.prevLeftPeakDeg = null;
    s.settled = false;
    s.lastTurningPointTime = null;
    s.measuredHalfCycle = null;
    trailRef.current = [];
    flashesRef.current = [];
    setIsRunning(false);
    setElapsedDisplay('0.00');
    setSwingCount(0);
    setCurrentAmplitude(amplitude.toFixed(1));
    setSettled(false);
    setMeasuredHalfCycleDisplay('—');
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

    // faint full-swing guide arc
    const origAmpRad = (amplitude * Math.PI) / 180;
    ctx.strokeStyle = '#e9e1cd';
    ctx.setLineDash([3, 4]);
    ctx.beginPath();
    ctx.arc(pivotX, pivotY, rodLen, Math.PI / 2 - origAmpRad, Math.PI / 2 + origAmpRad);
    ctx.stroke();
    ctx.setLineDash([]);

    // lost-distance flashes
    for (const flash of flashesRef.current) {
      const age = s.elapsed - flash.createdAt;
      const alpha = Math.max(0, 1 - age / FLASH_DURATION) * 0.85;
      if (alpha <= 0.01) continue;
      ctx.beginPath();
      ctx.arc(pivotX, pivotY, rodLen, flash.startAngle, flash.endAngle);
      ctx.strokeStyle = `rgba(179, 74, 60, ${alpha})`;
      ctx.lineWidth = 4;
      ctx.stroke();
    }

    // motion trace
    const trail = trailRef.current;
    for (let i = 1; i < trail.length; i++) {
      const age = s.elapsed - trail[i].t;
      const trailAlpha = Math.max(0, 1 - age / TRAIL_SECONDS) * 0.55;
      if (trailAlpha <= 0.01) continue;
      ctx.beginPath();
      ctx.moveTo(trail[i - 1].x, trail[i - 1].y);
      ctx.lineTo(trail[i].x, trail[i].y);
      ctx.strokeStyle = `rgba(46, 125, 107, ${trailAlpha})`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // --- technical overlay: vertical reference + angle arc ---
    if (s.showTechnical) {
      ctx.strokeStyle = '#c3ccd6';
      ctx.setLineDash([2, 3]);
      ctx.beginPath();
      ctx.moveTo(pivotX, pivotY);
      ctx.lineTo(pivotX, pivotY + rodLen);
      ctx.stroke();
      ctx.setLineDash([]);

      const arcR = 34;
      const a0 = Math.PI / 2;
      const a1 = Math.PI / 2 - s.angle;
      ctx.strokeStyle = '#8a94a3';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(pivotX, pivotY, arcR, Math.min(a0, a1), Math.max(a0, a1));
      ctx.stroke();

      const mid = (a0 + a1) / 2;
      const labelR = arcR + 15;
      const lx = pivotX + labelR * Math.cos(mid);
      const ly = pivotY + labelR * Math.sin(mid);
      ctx.font = '600 12px "Courier New", monospace';
      ctx.fillStyle = '#1b2a41';
      ctx.textAlign = 'center';
      ctx.fillText(`${Math.abs((s.angle * 180) / Math.PI).toFixed(1)}°`, lx, ly);
      ctx.textAlign = 'left';
    }

    // pivot bracket
    ctx.fillStyle = '#4a5a72';
    ctx.fillRect(pivotX - 30, pivotY - 8, 60, 8);
    ctx.beginPath();
    ctx.arc(pivotX, pivotY, 4, 0, Math.PI * 2);
    ctx.fill();

    // string
    ctx.strokeStyle = '#8a94a3';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(pivotX, pivotY);
    ctx.lineTo(bobX, bobY);
    ctx.stroke();

    // bob
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

    // --- technical overlay: force & motion vectors + info box ---
    if (s.showTechnical) {
      const weightN = s.mass * G;
      const tensionN = s.mass * G * Math.cos(s.angle) + (s.mass * (s.length * s.angularVel) ** 2) / s.length;
      const restoringN = -s.mass * G * Math.sin(s.angle); // tangential component of weight
      const speed = s.length * s.angularVel; // signed, m/s

      const pxPerN = 55 / Math.max(weightN, 0.001);
      const tangentX = Math.cos(s.angle);
      const tangentY = -Math.sin(s.angle);

      // Weight: straight down
      drawArrow(ctx, bobX, bobY, bobX, bobY + Math.min(55, weightN * pxPerN), '#2e5a8f', 'W');

      // Tension: along string toward pivot
      const dirToPivotX = (pivotX - bobX) / rodLen;
      const dirToPivotY = (pivotY - bobY) / rodLen;
      const tensLen = Math.min(70, tensionN * pxPerN);
      drawArrow(ctx, bobX, bobY, bobX + dirToPivotX * tensLen, bobY + dirToPivotY * tensLen, '#7a4a8f', 'Tension');

      // Restoring force: tangential component of weight
      const restLen = Math.min(60, Math.abs(restoringN) * pxPerN);
      const restSign = Math.sign(restoringN) || 1;
      drawArrow(
        ctx,
        bobX,
        bobY,
        bobX + tangentX * restLen * restSign,
        bobY + tangentY * restLen * restSign,
        '#b8467a',
        'Restoring'
      );

      // Velocity: tangential, direction of motion
      const pxPerV = 55;
      const vLen = Math.min(65, Math.abs(speed) * pxPerV);
      const vSign = Math.sign(speed) || 1;
      drawArrow(
        ctx,
        bobX,
        bobY,
        bobX + tangentX * vLen * vSign,
        bobY + tangentY * vLen * vSign,
        '#2e7d6b',
        'v'
      );

      // info box (top-left of canvas)
      const boxX = 10;
      const boxY = 44;
      const boxW = 168;
      const boxH = 74;
      ctx.fillStyle = 'rgba(255,255,255,0.88)';
      ctx.strokeStyle = '#e4ddcc';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(boxX, boxY, boxW, boxH, 4);
      ctx.fill();
      ctx.stroke();

      ctx.font = '600 11px "Courier New", monospace';
      ctx.fillStyle = '#1b2a41';
      ctx.textAlign = 'left';
      const lines = [
        `θ = ${Math.abs((s.angle * 180) / Math.PI).toFixed(1)}°`,
        `T = ${theoreticalPeriod(s.length).toFixed(2)} s`,
        `T/2 = ${(theoreticalPeriod(s.length) / 2).toFixed(2)} s`,
        `measured T/2 = ${s.measuredHalfCycle !== null ? s.measuredHalfCycle.toFixed(2) + ' s' : '—'}`,
        `W = mg = ${weightN.toFixed(2)} N`,
      ];
      lines.forEach((line, i) => ctx.fillText(line, boxX + 8, boxY + 15 + i * 13));
    }

    setAngleDisplay(Math.abs((s.angle * 180) / Math.PI).toFixed(1));
  };

  const step = (ts: number) => {
    const s = stateRef.current;
    if (!s.running) return;
    if (s.lastTime === null) s.lastTime = ts;
    const dt = Math.min((ts - s.lastTime) / 1000, 0.032);
    s.lastTime = ts;
    s.elapsed += dt;

    const omega2 = G / s.length;
    const angularAcc = -omega2 * s.angle - DAMPING * s.angularVel;
    s.angularVel += angularAcc * dt;
    s.angle += s.angularVel * dt;

    const sign = Math.sign(s.angle);
    if (s.lastSign !== null && sign !== 0 && sign !== s.lastSign) {
      s.swingCount += 0.5;
      setSwingCount(Math.floor(s.swingCount));
    }
    if (sign !== 0) s.lastSign = sign;

    const velSign = Math.sign(s.angularVel);
    if (s.lastAngularVelSign !== null && velSign !== 0 && velSign !== s.lastAngularVelSign) {
      const peakDeg = Math.abs((s.angle * 180) / Math.PI);
      const angleRad = Math.abs(s.angle);
      s.currentAmplitudeDeg = peakDeg;
      setCurrentAmplitude(peakDeg.toFixed(1));

      // measured half-cycle: time between consecutive turning points
      if (s.lastTurningPointTime !== null) {
        s.measuredHalfCycle = s.elapsed - s.lastTurningPointTime;
        setMeasuredHalfCycleDisplay(s.measuredHalfCycle.toFixed(2));
      }
      s.lastTurningPointTime = s.elapsed;

      if (s.angle > 0) {
        if (s.prevRightPeakDeg !== null && peakDeg < s.prevRightPeakDeg - 0.05) {
          const prevRad = (s.prevRightPeakDeg * Math.PI) / 180;
          flashesRef.current.push({
            startAngle: Math.PI / 2 - prevRad,
            endAngle: Math.PI / 2 - angleRad,
            createdAt: s.elapsed,
          });
        }
        s.prevRightPeakDeg = peakDeg;
      } else if (s.angle < 0) {
        if (s.prevLeftPeakDeg !== null && peakDeg < s.prevLeftPeakDeg - 0.05) {
          const prevRad = (s.prevLeftPeakDeg * Math.PI) / 180;
          flashesRef.current.push({
            startAngle: Math.PI / 2 + angleRad,
            endAngle: Math.PI / 2 + prevRad,
            createdAt: s.elapsed,
          });
        }
        s.prevLeftPeakDeg = peakDeg;
      }

      if (peakDeg <= SETTLE_THRESHOLD_DEG) {
        s.settled = true;
      }
    }
    if (velSign !== 0) s.lastAngularVelSign = velSign;

    flashesRef.current = flashesRef.current.filter((f) => s.elapsed - f.createdAt < FLASH_DURATION);

    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const pivotX = rect.width / 2;
      const pivotY = 36;
      const pxPerMeter = (rect.height - 90) / 1.5;
      const rodLen = s.length * pxPerMeter;
      const bobX = pivotX + rodLen * Math.sin(s.angle);
      const bobY = pivotY + rodLen * Math.cos(s.angle);
      trailRef.current.push({ x: bobX, y: bobY, t: s.elapsed });
      trailRef.current = trailRef.current.filter((p) => s.elapsed - p.t < TRAIL_SECONDS);
    }

    setElapsedDisplay(s.elapsed.toFixed(2));
    draw();

    if (s.settled) {
      s.running = false;
      setIsRunning(false);
      setSettled(true);
      return;
    }

    if (s.running) requestAnimationFrame(step);
  };

  const handlePlayPause = () => {
    const s = stateRef.current;
    if (s.settled) {
      resetPendulum();
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

  const handleMassChange = (val: number) => {
    setMass(val);
    stateRef.current.mass = val;
    if (!stateRef.current.running) draw();
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

    stateRef.current.angle = (amplitude * Math.PI) / 180;
    stateRef.current.prevRightPeakDeg = amplitude;
    draw();

    return () => window.removeEventListener('resize', resize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const variables = [
    { symbol: 'T', name: 'Period', def: 'Time for one complete swing (there and back), in seconds (s).' },
    { symbol: 'L', name: 'Length', def: 'Distance from the pivot to the centre of the bob, in metres (m).' },
    { symbol: 'g', name: 'Gravitational acceleration', def: "How strongly gravity pulls near Earth's surface, ≈ 9.8 m/s²." },
  ];

  return (
    <div className="pendulum-lab">
      <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-5">
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

          <div className="px-4 pb-2 -mt-1">
            <p className="text-[11.5px] text-[#4a5a72] leading-snug">
              <span className="text-[#2e7d6b] font-semibold">Teal trail</span> = recent path.{' '}
              <span className="text-[#b34a3c] font-semibold">Red flash</span> = distance no longer reached.
              {settled && (
                <span className="block mt-1 text-[#1b2a41] font-semibold">
                  ✓ Settled — the pendulum has come to rest. Elapsed time stopped.
                </span>
              )}
            </p>
          </div>

          <div className="px-4 pb-5 pt-3 border-t border-[#eee6d3]">
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
            <div className="flex items-center gap-3 mb-3">
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

            <button
              onClick={handleToggleTechnical}
              className={`w-full mb-3 text-[12.5px] font-semibold px-3 py-2 rounded border ${
                showTechnical
                  ? 'bg-[#1b2a41] text-white border-[#1b2a41]'
                  : 'bg-transparent text-[#1b2a41] border-[#d8cfb6] hover:bg-[#f5f0e2]'
              }`}
            >
              {showTechnical ? '✓ Technical Details Shown' : '⚙ Show Technical Details'}
            </button>

            {showTechnical && (
              <div className="mb-3 bg-[#faf7f0] border border-[#eee6d3] rounded p-3">
                <div className="flex items-center gap-3 mb-2.5">
                  <label className="text-[13px] text-[#4a5a72] w-28 flex-shrink-0">Bob mass</label>
                  <input
                    type="range"
                    min={0.05}
                    max={1}
                    step={0.05}
                    value={mass}
                    onChange={(e) => handleMassChange(parseFloat(e.target.value))}
                    className="flex-1"
                  />
                  <span className="font-mono text-[13px] w-14 text-right">{mass.toFixed(2)} kg</span>
                </div>
                <p className="text-[11px] text-[#4a5a72] leading-snug mb-2.5">
                  Notice the period doesn&rsquo;t change with mass — only length and gravity affect it.
                </p>
                <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-[11px]">
                  <LegendDot color="#2e7d6b" label="Velocity" />
                  <LegendDot color="#2e5a8f" label="Weight" />
                  <LegendDot color="#7a4a8f" label="Tension" />
                  <LegendDot color="#b8467a" label="Restoring force" />
                </div>
              </div>
            )}

            <div className="flex gap-2 flex-wrap">
              <button
                onClick={handlePlayPause}
                className="bg-[#b8823d] hover:bg-[#8f6428] text-white text-[13.5px] font-semibold px-3.5 py-2 rounded"
              >
                {settled ? '↻ Release Again' : isRunning ? '⏸ Pause' : '▶ Release'}
              </button>
              <button
                onClick={resetPendulum}
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
              <div className="text-[11px] text-[#4a5a72] mb-1">
                Elapsed time {settled && <span className="text-[#b34a3c]">(stopped)</span>}
              </div>
              <div className="font-mono text-xl font-bold">{elapsedDisplay} s</div>
            </div>
            <div className="bg-[#faf7f0] border border-[#eee6d3] rounded px-3 py-2.5">
              <div className="text-[11px] text-[#4a5a72] mb-1">Swings completed</div>
              <div className="font-mono text-xl font-bold">{swingCount}</div>
            </div>
            <div className="bg-[#faf7f0] border border-[#eee6d3] rounded px-3 py-2.5">
              <div className="text-[11px] text-[#4a5a72] mb-1">Theoretical period T</div>
              <div className="font-mono text-xl font-bold text-[#2e7d6b]">{theory.toFixed(2)} s</div>
            </div>
            <div className="bg-[#faf7f0] border border-[#eee6d3] rounded px-3 py-2.5">
              <div className="text-[11px] text-[#4a5a72] mb-1">Amplitude now</div>
              <div className="font-mono text-xl font-bold text-[#b34a3c]">{currentAmplitude}°</div>
            </div>
          </div>

          {showTechnical && (
            <div className="grid grid-cols-2 gap-2.5 mb-4">
              <div className="bg-[#faf7f0] border border-[#eee6d3] rounded px-3 py-2.5">
                <div className="text-[11px] text-[#4a5a72] mb-1">Theoretical T/2</div>
                <div className="font-mono text-lg font-bold">{(theory / 2).toFixed(2)} s</div>
              </div>
              <div className="bg-[#faf7f0] border border-[#eee6d3] rounded px-3 py-2.5">
                <div className="text-[11px] text-[#4a5a72] mb-1">Measured last T/2</div>
                <div className="font-mono text-lg font-bold">{measuredHalfCycleDisplay} s</div>
              </div>
            </div>
          )}

          <div className="bg-gradient-to-br from-[#fbf5e8] to-[#f6efdc] border border-[#e6d9b8] rounded px-4 py-3.5 text-center mb-4">
            <div className="italic text-[22px] text-[#8f6428]" style={{ fontFamily: 'Georgia, serif' }}>
              T = 2π √(L / g)
            </div>
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

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-[#4a5a72]">
      <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}
