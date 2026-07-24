'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Pressure in Liquids — p = ρgh, felt at every depth.
 *
 * Real physics throughout:
 *  - The probe reads p = ρgh from the actual depth you drag it to;
 *    the p–h chart collects your measurements as coloured dots, so
 *    tracing water and then mercury leaves two lines whose slopes
 *    differ by exactly the density ratio
 *  - The three wall spouts obey Torricelli's theorem: each jet leaves
 *    with v = √(2gh) and then follows true projectile kinematics.
 *    Deeper holes throw faster jets — the reason dam walls thicken
 *    toward the base
 *  - Gravity is a setting: the same tank on the Moon reads 6× less
 *    pressure at the same depth
 */

const IW = 1000;
const IH = 440;
// tank geometry: 2.0 m of liquid mapped to pixels
const TANK_X0 = 40;
const TANK_X1 = 400;
const SURFACE_Y = 50;
const BOTTOM_Y = 410;
const PX_PER_M = (BOTTOM_Y - SURFACE_Y) / 2.0; // 180 px per metre
const DEPTH_MAX = 2.0;
// wall spouts (depths in metres)
const SPOUT_DEPTHS = [0.5, 1.0, 1.5];
const BASIN_Y = 430;
// chart
const CX = 700;
const CY = 60;
const CW = 280;
const CH = 320;

const LIQUIDS = [
  { key: 'water', name: 'Water', rho: 1000, color: '#3d7ea6', light: 'rgba(61, 126, 166, 0.35)' },
  { key: 'seawater', name: 'Seawater', rho: 1025, color: '#2e7d6b', light: 'rgba(46, 125, 107, 0.35)' },
  { key: 'oil', name: 'Olive oil', rho: 920, color: '#b8823d', light: 'rgba(184, 130, 61, 0.35)' },
  { key: 'glycerine', name: 'Glycerine', rho: 1260, color: '#a05c7b', light: 'rgba(160, 92, 123, 0.35)' },
  { key: 'mercury', name: 'Mercury', rho: 13600, color: '#5a6472', light: 'rgba(90, 100, 114, 0.45)' },
] as const;

const GRAVITIES = [
  { key: 'moon', name: 'Moon', g: 1.6 },
  { key: 'earth', name: 'Earth', g: 9.8 },
  { key: 'jupiter', name: 'Jupiter', g: 24.8 },
] as const;

const P_ATM = 101.3; // kPa

export function PressureInLiquidsSimulator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const phaseRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);
  const draggingRef = useRef(false);

  const [liquidKey, setLiquidKey] = useState<string>('water');
  const [gKey, setGKey] = useState<string>('earth');
  const [depth, setDepth] = useState(1.2);
  const [absolute, setAbsolute] = useState(false);
  const [spoutsOn, setSpoutsOn] = useState(true);
  const [showTechnical, setShowTechnical] = useState(false);

  const simRef = useRef({
    liquidKey: 'water',
    gKey: 'earth',
    depth: 1.2,
    absolute: false,
    spoutsOn: true,
    showTechnical: false,
    dots: [] as { h: number; p: number; color: string }[],
    lastDotT: 0,
  });

  const liquid = LIQUIDS.find((l) => l.key === liquidKey) || LIQUIDS[0];
  const grav = GRAVITIES.find((g) => g.key === gKey) || GRAVITIES[1];
  const pGauge = (liquid.rho * grav.g * depth) / 1000; // kPa
  const pShown = absolute ? pGauge + P_ATM : pGauge;

  const currentLiquid = () => LIQUIDS.find((l) => l.key === simRef.current.liquidKey) || LIQUIDS[0];
  const currentG = () => GRAVITIES.find((g) => g.key === simRef.current.gKey) || GRAVITIES[1];

  const recordDot = () => {
    const s = simRef.current;
    const l = currentLiquid();
    const g = currentG();
    const now = performance.now();
    if (now - s.lastDotT < 120) return;
    s.lastDotT = now;
    s.dots.push({ h: s.depth, p: (l.rho * g.g * s.depth) / 1000, color: l.color });
    if (s.dots.length > 200) s.dots.shift();
  };

  const render = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const scale = rect.width / IW;
    ctx.setTransform(devicePixelRatio * scale, 0, 0, devicePixelRatio * scale, 0, 0);
    ctx.clearRect(0, 0, IW, IH);
    const s = simRef.current;
    const l = currentLiquid();
    const g = currentG();

    // ---- liquid with a gentle depth gradient ----
    const grad = ctx.createLinearGradient(0, SURFACE_Y, 0, BOTTOM_Y);
    grad.addColorStop(0, l.light);
    grad.addColorStop(1, l.color);
    ctx.fillStyle = grad;
    ctx.fillRect(TANK_X0, SURFACE_Y, TANK_X1 - TANK_X0, BOTTOM_Y - SURFACE_Y);

    // surface ripple line
    ctx.strokeStyle = l.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = TANK_X0; x <= TANK_X1; x += 4) {
      const y = SURFACE_Y + Math.sin(x * 0.07 + phaseRef.current * 2.2) * 1.5;
      if (x === TANK_X0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // tank walls (open top)
    ctx.strokeStyle = '#1b2a41';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(TANK_X0, SURFACE_Y - 18);
    ctx.lineTo(TANK_X0, BOTTOM_Y);
    ctx.lineTo(TANK_X1, BOTTOM_Y);
    ctx.lineTo(TANK_X1, SURFACE_Y - 18);
    ctx.stroke();

    // depth ruler on the left wall
    ctx.font = '500 9.5px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.fillStyle = '#4a5a72';
    ctx.textAlign = 'right';
    for (let h = 0; h <= DEPTH_MAX + 0.001; h += 0.5) {
      const y = SURFACE_Y + h * PX_PER_M;
      ctx.strokeStyle = 'rgba(27, 42, 65, 0.5)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(TANK_X0 - 8, y);
      ctx.lineTo(TANK_X0, y);
      ctx.stroke();
      ctx.fillText(`${h.toFixed(1)} m`, TANK_X0 - 11, y + 3);
    }

    // ---- Torricelli spouts on the right wall ----
    if (s.spoutsOn) {
      for (const hd of SPOUT_DEPTHS) {
        const hy = SURFACE_Y + hd * PX_PER_M;
        // the hole
        ctx.fillStyle = '#faf7f0';
        ctx.fillRect(TANK_X1 - 2, hy - 3, 8, 6);
        // jet: v = sqrt(2 g h), then projectile motion, drawn as droplets
        const v = Math.sqrt(2 * g.g * hd); // m/s
        ctx.fillStyle = l.color;
        const drop = 0.055; // s between droplets along the stream
        const t0 = (phaseRef.current % drop);
        for (let t = t0; t < 3; t += drop) {
          const x = TANK_X1 + 6 + v * t * PX_PER_M;
          const y = hy + 0.5 * g.g * t * t * PX_PER_M;
          if (y > BASIN_Y || x > IW - 320) break;
          ctx.beginPath();
          ctx.arc(x, y, 2.1, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = '#4a5a72';
        ctx.font = '500 9.5px ui-monospace, SFMono-Regular, Menlo, monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`v = ${v.toFixed(1)} m/s`, TANK_X1 + 12, hy - 7);
      }
      // basin line
      ctx.strokeStyle = '#8a94a3';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(TANK_X1, BASIN_Y);
      ctx.lineTo(IW - 330, BASIN_Y);
      ctx.stroke();
    }

    // ---- the probe ----
    const py = SURFACE_Y + s.depth * PX_PER_M;
    const pxx = (TANK_X0 + TANK_X1) / 2 - 40;
    // depth line from the surface
    ctx.strokeStyle = '#1b2a41';
    ctx.lineWidth = 1.4;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(pxx, SURFACE_Y);
    ctx.lineTo(pxx, py);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#1b2a41';
    ctx.font = 'italic 700 12px Georgia, serif';
    ctx.textAlign = 'right';
    ctx.fillText(`h = ${s.depth.toFixed(2)} m`, pxx - 8, (SURFACE_Y + py) / 2 + 4);
    // sensor
    ctx.fillStyle = '#faf7f0';
    ctx.strokeStyle = '#1b2a41';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(pxx, py, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#b34a3c';
    ctx.beginPath();
    ctx.arc(pxx, py, 3.5, 0, Math.PI * 2);
    ctx.fill();
    // pressure arrows from all sides (pressure acts in every direction)
    ctx.strokeStyle = 'rgba(27, 42, 65, 0.6)';
    ctx.lineWidth = 1.6;
    for (let a = 0; a < 8; a++) {
      const ang = (a / 8) * Math.PI * 2;
      const r0 = 24;
      const r1 = 15;
      ctx.beginPath();
      ctx.moveTo(pxx + Math.cos(ang) * r0, py + Math.sin(ang) * r0);
      ctx.lineTo(pxx + Math.cos(ang) * r1, py + Math.sin(ang) * r1);
      ctx.stroke();
    }
    const pHere = (l.rho * g.g * s.depth) / 1000 + (s.absolute ? P_ATM : 0);
    ctx.fillStyle = '#1b2a41';
    ctx.font = '700 12.5px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`p = ${pHere.toFixed(1)} kPa`, pxx + 32, py + 4);
    ctx.font = '500 10px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
    ctx.fillStyle = '#4a5a72';
    ctx.fillText('drag the probe', pxx + 32, py + 18);

    // ---- p–h chart ----
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(CX, CY, CW, CH);
    ctx.strokeStyle = '#1b2a41';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(CX, CY, CW, CH);
    const slopeMax = Math.max(
      (l.rho * g.g * DEPTH_MAX) / 1000,
      ...s.dots.map((d) => d.p),
      20
    );
    const pTop = (s.absolute ? P_ATM : 0) + slopeMax * 1.08;
    const hToX = (h: number) => CX + (h / DEPTH_MAX) * CW;
    const pToY = (p: number) => CY + CH - (Math.min(p, pTop) / pTop) * CH;

    // theory line for the current liquid and g
    ctx.strokeStyle = l.color;
    ctx.lineWidth = 1.8;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.moveTo(hToX(0), pToY(s.absolute ? P_ATM : 0));
    ctx.lineTo(hToX(DEPTH_MAX), pToY((s.absolute ? P_ATM : 0) + (l.rho * g.g * DEPTH_MAX) / 1000));
    ctx.stroke();
    ctx.setLineDash([]);

    // measured dots (colour-tagged by the liquid they were taken in)
    for (const d of s.dots) {
      ctx.fillStyle = d.color;
      ctx.beginPath();
      ctx.arc(hToX(d.h), pToY(d.p + (s.absolute ? P_ATM : 0)), 3, 0, Math.PI * 2);
      ctx.fill();
    }
    // live point
    ctx.fillStyle = '#b34a3c';
    ctx.beginPath();
    ctx.arc(hToX(s.depth), pToY(pHere), 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#1b2a41';
    ctx.font = '600 11px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('pressure vs depth  (slope = ρg)', CX + CW / 2, CY - 8);
    ctx.font = '500 10px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.fillStyle = '#4a5a72';
    ctx.textAlign = 'left';
    ctx.fillText('h (m) →', CX + CW - 48, CY + CH + 14);
    ctx.save();
    ctx.translate(CX - 8, CY + 44);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('p (kPa) →', 0, 0);
    ctx.restore();

    // ---- technical overlay ----
    if (s.showTechnical) {
      ctx.fillStyle = 'rgba(250, 247, 240, 0.93)';
      ctx.fillRect(CX + 8, CY + 8, 264, 90);
      ctx.strokeStyle = '#1b2a41';
      ctx.lineWidth = 1;
      ctx.strokeRect(CX + 8, CY + 8, 264, 90);
      ctx.fillStyle = '#1b2a41';
      ctx.font = '600 10px ui-monospace, SFMono-Regular, Menlo, monospace';
      ctx.textAlign = 'left';
      const lines = [
        `p = ρgh = ${l.rho} × ${g.g} × ${s.depth.toFixed(2)}`,
        `  = ${(l.rho * g.g * s.depth).toFixed(0)} Pa = ${((l.rho * g.g * s.depth) / 1000).toFixed(1)} kPa (gauge)`,
        `spout speeds: v = √(2gh) — no ρ in it!`,
        `a denser liquid pushes harder AND is harder`,
        `to accelerate; the two effects cancel exactly.`,
      ];
      lines.forEach((line, idx) => ctx.fillText(line, CX + 16, CY + 24 + idx * 15));
    }
  };

  const loop = (tNow: number) => {
    if (lastTimeRef.current === null) lastTimeRef.current = tNow;
    const dt = Math.min(0.05, (tNow - lastTimeRef.current) / 1000);
    lastTimeRef.current = tNow;
    phaseRef.current += dt;
    render();
    rafRef.current = requestAnimationFrame(loop);
  };

  // ---- probe dragging ----
  const depthFromPointer = (clientY: number): number | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const iy = ((clientY - rect.top) / rect.height) * IH;
    return Math.max(0.05, Math.min(DEPTH_MAX, (iy - SURFACE_Y) / PX_PER_M));
  };

  const setProbe = (h: number) => {
    simRef.current.depth = h;
    setDepth(h);
    recordDot();
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ix = ((e.clientX - rect.left) / rect.width) * IW;
    if (ix < TANK_X1 + 30) {
      (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
      draggingRef.current = true;
      const h = depthFromPointer(e.clientY);
      if (h !== null) setProbe(h);
    }
  };
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!draggingRef.current) return;
    const h = depthFromPointer(e.clientY);
    if (h !== null) setProbe(h);
  };
  const handlePointerUp = () => {
    draggingRef.current = false;
  };

  const handleLiquid = (key: string) => {
    setLiquidKey(key);
    simRef.current.liquidKey = key;
  };
  const handleG = (key: string) => {
    setGKey(key);
    simRef.current.gKey = key;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const resize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * devicePixelRatio;
      canvas.height = rect.height * devicePixelRatio;
      render();
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
    { symbol: 'p', name: 'Pressure', def: 'In pascal (Pa): the force the liquid exerts per square metre — in every direction, which is why the probe shows arrows all around.' },
    { symbol: 'ρ', name: 'Density', def: 'Of the liquid, in kg/m³. Mercury is 13.6× denser than water, so its pressure line is 13.6× steeper.' },
    { symbol: 'g', name: 'Gravitational field strength', def: 'In N/kg. The same tank on the Moon (g = 1.6) reads about 6× less pressure at every depth.' },
    { symbol: 'h', name: 'Depth', def: 'Below the SURFACE — not the height above the bottom. Only depth matters: the shape and width of the container are irrelevant.' },
  ];

  return (
    <div className="pressure-liquids-lab flex flex-col gap-5">
      {/* ---- Apparatus: full width ---- */}
      <div className="bg-white border border-[#e4ddcc] rounded overflow-hidden">
        <div className="flex justify-between items-baseline px-4 pt-3">
          <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">
            Liquid Column Bench · 2.0 m tank
          </span>
          <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">
            {liquid.name} · ρ = {liquid.rho} kg/m³ · g = {grav.g} N/kg
          </span>
        </div>
        <div className="px-4 pt-2">
          <canvas
            ref={canvasRef}
            className="block w-full rounded border border-[#e4ddcc] touch-none cursor-ns-resize"
            style={{ aspectRatio: '1000 / 440' }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          />
        </div>
        <div className="px-4 pb-2 pt-2">
          <p className="text-[11.5px] text-[#4a5a72] leading-snug">
            <span className="text-[#b34a3c] font-semibold">Drag the probe</span> and its measurements land as dots on the
            p–h chart — trace one liquid, switch, and trace again to compare slopes. The wall{' '}
            <span className="text-[#2e7d6b] font-semibold">spouts</span> obey Torricelli's theorem: deeper holes fire
            faster jets, which is why dam walls grow thicker toward the base.
          </p>
        </div>

        <div className="px-4 pb-5 pt-3 border-t border-[#eee6d3]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-3 mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[13px] text-[#4a5a72] w-16 flex-shrink-0">Liquid</span>
              {LIQUIDS.map((l) => (
                <button key={l.key} onClick={() => handleLiquid(l.key)}
                  className={`flex-1 min-w-20 text-[12px] font-semibold px-2 py-1.5 rounded border ${
                    liquidKey === l.key ? 'text-white' : 'bg-transparent text-[#1b2a41] border-[#d8cfb6] hover:bg-[#f5f0e2]'
                  }`}
                  style={liquidKey === l.key ? { backgroundColor: l.color, borderColor: l.color } : undefined}>
                  {l.name}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[13px] text-[#4a5a72] w-16 flex-shrink-0">Gravity</span>
              {GRAVITIES.map((g) => (
                <button key={g.key} onClick={() => handleG(g.key)}
                  className={`flex-1 text-[12px] font-semibold px-2 py-1.5 rounded border ${
                    gKey === g.key ? 'bg-[#1b2a41] text-white border-[#1b2a41]' : 'bg-transparent text-[#1b2a41] border-[#d8cfb6] hover:bg-[#f5f0e2]'
                  }`}>
                  {g.name} · {g.g}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <label className="text-[13px] text-[#4a5a72] w-16 flex-shrink-0">Depth h</label>
              <input type="range" min={0.05} max={DEPTH_MAX} step={0.01} value={depth}
                onChange={(e) => setProbe(parseFloat(e.target.value))} className="flex-1" />
              <span className="font-mono text-[13px] w-16 text-right">{depth.toFixed(2)} m</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const next = !absolute;
                  setAbsolute(next);
                  simRef.current.absolute = next;
                }}
                className={`flex-1 text-[12px] font-semibold px-2 py-1.5 rounded border ${
                  absolute ? 'bg-[#2e7d6b] text-white border-[#2e7d6b]' : 'bg-transparent text-[#1b2a41] border-[#d8cfb6] hover:bg-[#f5f0e2]'
                }`}>
                {absolute ? '✓ + Atmospheric (101 kPa)' : '+ Atmospheric?'}
              </button>
              <button
                onClick={() => {
                  const next = !spoutsOn;
                  setSpoutsOn(next);
                  simRef.current.spoutsOn = next;
                }}
                className={`flex-1 text-[12px] font-semibold px-2 py-1.5 rounded border ${
                  spoutsOn ? 'bg-[#1b2a41] text-white border-[#1b2a41]' : 'bg-transparent text-[#1b2a41] border-[#d8cfb6] hover:bg-[#f5f0e2]'
                }`}>
                {spoutsOn ? '✓ Wall Spouts' : 'Wall Spouts'}
              </button>
              <button
                onClick={() => { simRef.current.dots = []; }}
                className="flex-1 text-[12px] font-semibold px-2 py-1.5 rounded border bg-transparent text-[#1b2a41] border-[#d8cfb6] hover:bg-[#f5f0e2]">
                ⌫ Clear Dots
              </button>
            </div>
          </div>
          <button
            onClick={() => {
              const next = !showTechnical;
              setShowTechnical(next);
              simRef.current.showTechnical = next;
            }}
            className={`w-full text-[12.5px] font-semibold px-3 py-2 rounded border ${
              showTechnical ? 'bg-[#1b2a41] text-white border-[#1b2a41]' : 'bg-transparent text-[#1b2a41] border-[#d8cfb6] hover:bg-[#f5f0e2]'
            }`}>
            {showTechnical ? '✓ Technical Details Shown' : '⚙ Show Technical Details'}
          </button>
        </div>
      </div>

      {/* ---- Notebook row ---- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="bg-white border border-[#e4ddcc] rounded p-4">
          <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">Live Readings</span>
          <div className="mt-3 space-y-2">
            <div className="flex justify-between border-b border-[#eee6d3] pb-1">
              <span className="text-[12.5px] text-[#4a5a72]">Depth h</span>
              <span className="font-mono text-[13px] text-[#1b2a41]">{depth.toFixed(2)} m</span>
            </div>
            <div className="flex justify-between border-b border-[#eee6d3] pb-1">
              <span className="text-[12.5px] text-[#4a5a72]">Liquid pressure ρgh</span>
              <span className="font-mono text-[13px] font-bold text-[#1b2a41]">{pGauge.toFixed(1)} kPa</span>
            </div>
            <div className="flex justify-between border-b border-[#eee6d3] pb-1">
              <span className="text-[12.5px] text-[#4a5a72]">Total (with atmosphere)</span>
              <span className="font-mono text-[13px] text-[#1b2a41]">{(pGauge + P_ATM).toFixed(1)} kPa</span>
            </div>
            <div className="flex justify-between border-b border-[#eee6d3] pb-1">
              <span className="text-[12.5px] text-[#4a5a72]">Reading shown at probe</span>
              <span className="font-mono text-[13px] font-bold text-[#2e7d6b]">{pShown.toFixed(1)} kPa</span>
            </div>
          </div>
          <p className="text-[11.5px] text-[#4a5a72] mt-2.5 leading-snug">
            In water on Earth, every metre of depth adds about 9.8 kPa — so 10 m of water adds roughly one whole
            atmosphere. That is why divers feel double the surface pressure at just 10 m down.
          </p>
        </div>

        <div className="bg-white border border-[#e4ddcc] rounded p-4">
          <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">Try This</span>
          <div className="mt-2 space-y-2.5 text-[12px] text-[#4a5a72] leading-snug">
            <p>
              <strong className="text-[#1b2a41]">1.</strong> Drag the probe slowly from surface to bottom: the dots on
              the chart form a straight line through the origin. Pressure grows in exact proportion to depth.
            </p>
            <p>
              <strong className="text-[#1b2a41]">2.</strong> Trace water, then switch to mercury and trace again without
              clearing. Two lines, and the mercury one is 13.6× steeper — the density ratio, drawn by your own hand.
            </p>
            <p>
              <strong className="text-[#1b2a41]">3.</strong> Same depth, Moon gravity: about 6× less pressure. The
              formula has three dials, and g is one of them.
            </p>
            <p>
              <strong className="text-[#1b2a41]">4.</strong> Watch the three spouts: the deepest fires fastest. More
              depth, more pressure, more speed — the reason a dam is a wedge, thick at the bottom.
            </p>
            <p>
              <strong className="text-[#1b2a41]">5.</strong> Open the technical panel and look at the spout speeds when
              you switch liquids: they do not change. Pressure pushes harder on denser liquid, but denser liquid is
              harder to push — a beautiful exact cancellation.
            </p>
          </div>
        </div>

        <div className="bg-white border border-[#e4ddcc] rounded p-4">
          <div className="bg-gradient-to-br from-[#fbf5e8] to-[#f6efdc] border border-[#e6d9b8] rounded px-4 py-3.5 text-center mb-3">
            <div className="italic text-[22px] text-[#8f6428]" style={{ fontFamily: 'Georgia, serif' }}>
              p = ρgh
            </div>
            <div className="italic text-[14px] text-[#8f6428] mt-1.5" style={{ fontFamily: 'Georgia, serif' }}>
              pressure in a liquid, at depth h below the surface
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
