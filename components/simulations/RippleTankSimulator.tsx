'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Ripple Tank — the 2D wave equation, solved live.
 *
 * Real physics, not a canned animation:
 *  - A finite-difference solution of u_tt = c²∇²u on a grid, stepped
 *    120 times a second. Nothing here is scripted: reflection happens
 *    because waves genuinely bounce off barrier cells, diffraction
 *    happens because a gap is just an opening, and refraction happens
 *    because the shallow shelf is simply a region with a lower c
 *  - Scaled to a real tank: 1 cell = 0.5 cm, so the tank is ~88 × 52 cm
 *    and waves travel at 30 cm/s in deep water (18 cm/s over the shelf)
 *    — the numbers a school ripple tank actually produces
 *  - Absorbing "beaches" line the tank edges, like the sloped foam in a
 *    real tank, so waves don't slosh back off the walls
 *  - A stroboscope re-renders the field exactly once per source period,
 *    freezing the pattern the way a real strobe lamp does
 */

const GW = 176; // grid cells across
const GH = 104; // grid cells down
const CM_PER_CELL = 0.5;
const C_DEEP = 0.5; // cells per step (Courant-stable: c·dt/dx < 1/√2)
const C_SHALLOW = 0.3;
const STEPS_PER_FRAME = 2;
const STEPS_PER_SEC = 120; // 60 fps × 2
const V_DEEP = C_DEEP * STEPS_PER_SEC * CM_PER_CELL; // 30 cm/s
const V_SHALLOW = C_SHALLOW * STEPS_PER_SEC * CM_PER_CELL; // 18 cm/s
const SPONGE = 10; // absorbing beach width, cells

type SceneKey = 'open' | 'reflection' | 'narrow-gap' | 'wide-gap' | 'refraction' | 'two-point';

interface Scene {
  key: SceneKey;
  name: string;
  lesson: string;
  blurb: string;
  watch: string;
}

const SCENES: Scene[] = [
  {
    key: 'open',
    name: 'Plane waves',
    lesson: '14.1 · 14.2',
    blurb: 'A straight dipper sends plane waves down the tank.',
    watch: 'Pause or strobe the tank and measure the crest spacing against the 10 cm grid — that distance is the wavelength. Change f and check that λ = v/f, with v fixed by the water.',
  },
  {
    key: 'reflection',
    name: 'Reflection',
    lesson: '14.3',
    blurb: 'Plane waves strike an angled straight barrier.',
    watch: 'The reflected wavefronts leave at the same angle they arrived — angle of incidence = angle of reflection — and their wavelength is unchanged, because the water (and so the speed) is the same.',
  },
  {
    key: 'narrow-gap',
    name: 'Diffraction — narrow gap',
    lesson: '14.3',
    blurb: 'The gap is about one wavelength wide.',
    watch: 'The waves emerge as near-perfect semicircles, spreading into the shadow. Diffraction is strongest when the gap width is comparable to λ. Raise f (shorter λ) and watch the spreading weaken.',
  },
  {
    key: 'wide-gap',
    name: 'Diffraction — wide gap',
    lesson: '14.3',
    blurb: 'The gap is several wavelengths wide.',
    watch: 'Most of the wave passes straight on, with only gentle curling at the edges. Compare with the narrow gap: same physics, but a gap much larger than λ produces far less spreading.',
  },
  {
    key: 'refraction',
    name: 'Refraction — shallow shelf',
    lesson: '14.3',
    blurb: 'The tinted region is a submerged shelf where waves travel slower (18 cm/s instead of 30 cm/s).',
    watch: 'Crossing the boundary at an angle, the wavefronts bend and bunch together: speed and wavelength both drop, but the frequency cannot change — every crest that arrives must leave.',
  },
  {
    key: 'two-point',
    name: 'Two-point interference',
    lesson: 'extension',
    blurb: 'Two dippers bob in phase.',
    watch: 'Lines of extra-large ripples (crest meets crest) alternate with calm lines (crest meets trough). This interference pattern is beyond the core syllabus, but it is the clearest possible evidence that ripples are waves.',
  },
];

interface Field {
  u: Float32Array;
  uPrev: Float32Array;
  c2: Float32Array; // (c·dt/dx)² per cell
  wall: Uint8Array;
  damp: Float32Array;
  shallow: Uint8Array;
}

function buildField(scene: SceneKey): Field {
  const n = GW * GH;
  const u = new Float32Array(n);
  const uPrev = new Float32Array(n);
  const c2 = new Float32Array(n);
  const wall = new Uint8Array(n);
  const damp = new Float32Array(n);
  const shallow = new Uint8Array(n);

  for (let y = 0; y < GH; y++) {
    for (let x = 0; x < GW; x++) {
      const i = y * GW + x;
      let c = C_DEEP;
      if (scene === 'refraction') {
        // shelf boundary runs diagonally so plane waves hit it at an angle
        if (x > GW * 0.42 + 0.5 * y) {
          c = C_SHALLOW;
          shallow[i] = 1;
        }
      }
      c2[i] = c * c;

      // absorbing beach: damping ramps up towards every edge
      const edge = Math.min(x, y, GW - 1 - x, GH - 1 - y);
      damp[i] = edge < SPONGE ? 0.06 * (1 - edge / SPONGE) : 0;

      // barriers
      if (scene === 'reflection') {
        // straight barrier at ~34° in the right half
        const bx = GW * 0.62;
        if (Math.abs(x - bx - 0.68 * (y - GH * 0.5)) < 1.6 && y > 8 && y < GH - 8) wall[i] = 1;
      } else if (scene === 'narrow-gap' || scene === 'wide-gap') {
        const half = scene === 'narrow-gap' ? 5 : 22; // gap ≈ 5 cm vs ≈ 22 cm
        const bx = Math.round(GW * 0.5);
        if (Math.abs(x - bx) < 2 && Math.abs(y - GH / 2) > half) wall[i] = 1;
      }
    }
  }
  return { u, uPrev, c2, wall, damp, shallow };
}

export function RippleTankSimulator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offscreenRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<ImageData | null>(null);
  const fieldRef = useRef<Field>(buildField('open'));
  const rafRef = useRef<number | null>(null);
  const timeRef = useRef(0); // simulated seconds
  const lastStrobeCycleRef = useRef(-1);

  const [scene, setScene] = useState<SceneKey>('open');
  const [freq, setFreq] = useState(6);
  const [paused, setPaused] = useState(false);
  const [strobe, setStrobe] = useState(false);
  const [showTechnical, setShowTechnical] = useState(false);

  const simRef = useRef({ scene: 'open' as SceneKey, freq: 6, paused: false, strobe: false, showTechnical: false });

  const stepPhysics = () => {
    const s = simRef.current;
    const f = fieldRef.current;
    const { u, uPrev, c2, wall, damp } = f;

    for (let sub = 0; sub < STEPS_PER_FRAME; sub++) {
      timeRef.current += 1 / STEPS_PER_SEC;
      const t = timeRef.current;

      // leapfrog update: uNext overwrites uPrev in place, then swap
      for (let y = 1; y < GH - 1; y++) {
        const row = y * GW;
        for (let x = 1; x < GW - 1; x++) {
          const i = row + x;
          if (wall[i]) {
            uPrev[i] = 0;
            continue;
          }
          const lap = u[i - 1] + u[i + 1] + u[i - GW] + u[i + GW] - 4 * u[i];
          let next = 2 * u[i] - uPrev[i] + c2[i] * lap;
          next *= 1 - damp[i];
          uPrev[i] = next;
        }
      }
      // swap so u holds the newest field
      const tmp = f.u;
      f.u = f.uPrev;
      f.uPrev = tmp;

      // drive the sources on the fresh field
      const drive = Math.sin(2 * Math.PI * s.freq * t);
      const newU = f.u;
      if (s.scene === 'two-point') {
        const y1 = Math.round(GH / 2 - 13);
        const y2 = Math.round(GH / 2 + 13);
        newU[y1 * GW + 12] = drive * 1.4;
        newU[y2 * GW + 12] = drive * 1.4;
      } else {
        // straight dipper: a vertical line near the left wall
        for (let y = SPONGE + 2; y < GH - SPONGE - 2; y++) {
          newU[y * GW + 8] = drive;
        }
      }
    }
  };

  const render = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (!offscreenRef.current) {
      offscreenRef.current = document.createElement('canvas');
      offscreenRef.current.width = GW;
      offscreenRef.current.height = GH;
    }
    const off = offscreenRef.current;
    const offCtx = off.getContext('2d');
    if (!offCtx) return;
    if (!imageRef.current) imageRef.current = offCtx.createImageData(GW, GH);
    const img = imageRef.current;
    const data = img.data;

    const f = fieldRef.current;
    for (let i = 0; i < GW * GH; i++) {
      const p = i * 4;
      if (f.wall[i]) {
        data[p] = 184; data[p + 1] = 130; data[p + 2] = 61; data[p + 3] = 255; // brass barrier
        continue;
      }
      // water: mid-tone teal paper, crests brighten, troughs deepen to ink
      const v = Math.max(-1, Math.min(1, f.u[i] * 1.15));
      const sh = f.shallow[i] ? 1 : 0;
      const baseR = 205 - sh * 22;
      const baseG = 224 - sh * 8;
      const baseB = 218 - sh * 14;
      if (v >= 0) {
        const k = v;
        data[p] = baseR + (250 - baseR) * k;
        data[p + 1] = baseG + (250 - baseG) * k;
        data[p + 2] = baseB + (247 - baseB) * k;
      } else {
        const k = -v;
        data[p] = baseR + (27 - baseR) * k;
        data[p + 1] = baseG + (62 - baseG) * k;
        data[p + 2] = baseB + (88 - baseB) * k;
      }
      data[p + 3] = 255;
    }
    offCtx.putImageData(img, 0, 0);

    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    ctx.imageSmoothingEnabled = true;
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(off, 0, 0, w, h);

    // 10 cm reference grid (every 20 cells)
    ctx.strokeStyle = 'rgba(27, 42, 65, 0.16)';
    ctx.lineWidth = 1;
    ctx.font = '500 9px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.fillStyle = 'rgba(27, 42, 65, 0.45)';
    for (let cm = 10; cm < GW * CM_PER_CELL; cm += 10) {
      const x = (cm / (GW * CM_PER_CELL)) * w;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
      ctx.fillText(`${cm}`, x + 2, h - 4);
    }
    for (let cm = 10; cm < GH * CM_PER_CELL; cm += 10) {
      const y = (cm / (GH * CM_PER_CELL)) * h;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    const s = simRef.current;
    if (s.showTechnical) {
      ctx.font = '600 11px ui-monospace, SFMono-Regular, Menlo, monospace';
      ctx.fillStyle = '#1b2a41';
      const lines = [
        `wave equation u_tt = c²·∇²u on ${GW}×${GH} cells, ${STEPS_PER_SEC} steps/s`,
        `deep: v = ${V_DEEP.toFixed(0)} cm/s   λ = ${(V_DEEP / s.freq).toFixed(1)} cm`,
        s.scene === 'refraction' ? `shelf: v = ${V_SHALLOW.toFixed(0)} cm/s   λ = ${(V_SHALLOW / s.freq).toFixed(1)} cm` : '',
        `absorbing beach ${SPONGE * CM_PER_CELL} cm wide on every side`,
      ].filter(Boolean);
      lines.forEach((line, idx) => {
        ctx.fillText(line, 10, 18 + idx * 15);
      });
    }
  };

  const loop = () => {
    const s = simRef.current;
    if (!s.paused) {
      stepPhysics();
      if (s.strobe) {
        // re-render exactly once per source period, like a strobe lamp
        const cycle = Math.floor(timeRef.current * s.freq);
        if (cycle !== lastStrobeCycleRef.current) {
          lastStrobeCycleRef.current = cycle;
          render();
        }
      } else {
        render();
      }
    }
    rafRef.current = requestAnimationFrame(loop);
  };

  const resetField = (nextScene: SceneKey) => {
    fieldRef.current = buildField(nextScene);
    timeRef.current = 0;
    lastStrobeCycleRef.current = -1;
  };

  const handleScene = (key: SceneKey) => {
    setScene(key);
    simRef.current.scene = key;
    resetField(key);
    render();
  };

  const handleFreq = (f: number) => {
    setFreq(f);
    simRef.current.freq = f;
  };

  const handlePause = () => {
    const next = !simRef.current.paused;
    simRef.current.paused = next;
    setPaused(next);
    if (!next) lastStrobeCycleRef.current = -1;
  };

  const handleStrobe = () => {
    const next = !simRef.current.strobe;
    simRef.current.strobe = next;
    setStrobe(next);
    lastStrobeCycleRef.current = -1;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const resize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * devicePixelRatio;
      canvas.height = rect.height * devicePixelRatio;
      canvas.getContext('2d')?.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
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

  const active = SCENES.find((sc) => sc.key === scene) || SCENES[0];
  const lambdaDeep = V_DEEP / freq;
  const lambdaShallow = V_SHALLOW / freq;

  const variables = [
    { symbol: 'v', name: 'Wave speed', def: 'How fast the wavefronts travel, in cm/s here. Set by the water depth, NOT by the dipper.' },
    { symbol: 'f', name: 'Frequency', def: 'How many waves the dipper makes each second, in hertz (Hz). Set by the source, and unchanged by reflection or refraction.' },
    { symbol: 'λ', name: 'Wavelength', def: 'The distance between two adjacent crests, in cm. Measure it against the 10 cm grid.' },
  ];

  return (
    <div className="ripple-tank-lab">
      <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-5">
        {/* ---- Tank ---- */}
        <div className="bg-white border border-[#e4ddcc] rounded overflow-hidden">
          <div className="flex justify-between items-baseline px-4 pt-3">
            <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">
              Ripple Tank · {Math.round(GW * CM_PER_CELL)} × {Math.round(GH * CM_PER_CELL)} cm
            </span>
            <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">
              {paused ? 'paused' : strobe ? 'strobe' : 'live'}
            </span>
          </div>
          <div className="px-4 pt-2">
            <canvas ref={canvasRef} className="block w-full rounded border border-[#e4ddcc]" style={{ aspectRatio: '176 / 104' }} />
          </div>
          <div className="px-4 pb-2 pt-2">
            <p className="text-[11.5px] text-[#4a5a72] leading-snug">
              <span className="text-[#1b2a41] font-semibold">Bright bands</span> = crests,{' '}
              <span className="text-[#1b2a41] font-semibold">dark bands</span> = troughs — just like the light table
              under a real tank. <span className="text-[#b8823d] font-semibold">Brass</span> = barriers. Gridlines are
              10 cm apart, for measuring λ.
            </p>
          </div>

          <div className="px-4 pb-5 pt-3 border-t border-[#eee6d3]">
            <div className="flex flex-wrap gap-1.5 mb-3">
              {SCENES.map((sc) => (
                <button
                  key={sc.key}
                  onClick={() => handleScene(sc.key)}
                  className={`text-[12px] font-medium px-2.5 py-1.5 rounded border ${
                    scene === sc.key
                      ? 'bg-[#1b2a41] text-white border-[#1b2a41]'
                      : 'bg-transparent text-[#1b2a41] border-[#d8cfb6] hover:bg-[#f5f0e2]'
                  }`}
                >
                  {sc.name}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 mb-3">
              <label className="text-[13px] text-[#4a5a72] w-28 flex-shrink-0">Dipper f</label>
              <input
                type="range"
                min={3}
                max={12}
                step={0.5}
                value={freq}
                onChange={(e) => handleFreq(parseFloat(e.target.value))}
                className="flex-1"
              />
              <span className="font-mono text-[13px] w-16 text-right">{freq.toFixed(1)} Hz</span>
            </div>

            <div className="flex gap-2 mb-3">
              <button
                onClick={handlePause}
                className="flex-1 text-[12.5px] font-semibold px-3 py-2 rounded border bg-transparent text-[#1b2a41] border-[#d8cfb6] hover:bg-[#f5f0e2]"
              >
                {paused ? '▶ Resume' : '⏸ Pause'}
              </button>
              <button
                onClick={handleStrobe}
                className={`flex-1 text-[12.5px] font-semibold px-3 py-2 rounded border ${
                  strobe
                    ? 'bg-[#2e7d6b] text-white border-[#2e7d6b]'
                    : 'bg-transparent text-[#1b2a41] border-[#d8cfb6] hover:bg-[#f5f0e2]'
                }`}
              >
                {strobe ? '✓ Stroboscope' : '◉ Stroboscope'}
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

        {/* ---- Notebook ---- */}
        <div className="flex flex-col gap-5">
          <div className="bg-white border border-[#e4ddcc] rounded p-4">
            <div className="flex justify-between items-baseline">
              <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">Live Readings</span>
              <span className="font-mono text-[11px] text-[#8f6428]">{active.lesson}</span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3">
              <div className="flex justify-between border-b border-[#eee6d3] pb-1">
                <span className="text-[12.5px] text-[#4a5a72]">Frequency f</span>
                <span className="font-mono text-[13px] text-[#1b2a41]">{freq.toFixed(1)} Hz</span>
              </div>
              <div className="flex justify-between border-b border-[#eee6d3] pb-1">
                <span className="text-[12.5px] text-[#4a5a72]">Period T</span>
                <span className="font-mono text-[13px] text-[#1b2a41]">{(1 / freq).toFixed(2)} s</span>
              </div>
              <div className="flex justify-between border-b border-[#eee6d3] pb-1">
                <span className="text-[12.5px] text-[#4a5a72]">v (deep water)</span>
                <span className="font-mono text-[13px] text-[#1b2a41]">{V_DEEP.toFixed(0)} cm/s</span>
              </div>
              <div className="flex justify-between border-b border-[#eee6d3] pb-1">
                <span className="text-[12.5px] text-[#4a5a72]">λ (deep water)</span>
                <span className="font-mono text-[13px] text-[#2e7d6b]">{lambdaDeep.toFixed(1)} cm</span>
              </div>
              {scene === 'refraction' && (
                <>
                  <div className="flex justify-between border-b border-[#eee6d3] pb-1">
                    <span className="text-[12.5px] text-[#4a5a72]">v (shelf)</span>
                    <span className="font-mono text-[13px] text-[#1b2a41]">{V_SHALLOW.toFixed(0)} cm/s</span>
                  </div>
                  <div className="flex justify-between border-b border-[#eee6d3] pb-1">
                    <span className="text-[12.5px] text-[#4a5a72]">λ (shelf)</span>
                    <span className="font-mono text-[13px] text-[#2e7d6b]">{lambdaShallow.toFixed(1)} cm</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="bg-white border border-[#e4ddcc] rounded p-4">
            <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">What To Look For</span>
            <p className="text-[12.5px] text-[#1b2a41] font-semibold mt-1.5">{active.blurb}</p>
            <p className="text-[12px] text-[#4a5a72] mt-1.5 leading-snug">{active.watch}</p>
          </div>

          <div className="bg-white border border-[#e4ddcc] rounded p-4">
            <div className="bg-gradient-to-br from-[#fbf5e8] to-[#f6efdc] border border-[#e6d9b8] rounded px-4 py-3.5 text-center mb-3">
              <div className="italic text-[22px] text-[#8f6428]" style={{ fontFamily: 'Georgia, serif' }}>
                v = f λ
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
    </div>
  );
}
