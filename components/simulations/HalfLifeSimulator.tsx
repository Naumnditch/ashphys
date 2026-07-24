'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Half-Life Lab — randomness becoming law.
 *
 * Real physics, not a canned animation:
 *  - Every nucleus decays independently at random: each frame, each
 *    surviving nucleus rolls against p = 1 − e^(−λ·dt), the exact
 *    survival probability. Nothing about "exponential decay" is
 *    programmed in — the curve EMERGES from the dice rolls.
 *  - The decay curve is measured from the population, plotted against
 *    the theory N₀·2^(−t/T½), and every time the population crosses a
 *    halving line the elapsed interval is recorded — so students can
 *    check the definition: each halving takes the same time.
 *  - One nucleus is singled out with a ring. You cannot predict when
 *    that one will decay. The population, though, is a clockwork. That
 *    tension is the whole of radioactivity.
 */

const IW = 1000;
const IH = 440;
// nuclei grid area
const GX = 30;
const GY = 46;
const GSIZE = 348;
// chart area
const CX = 520;
const CY = 60;
const CW = 450;
const CH = 320;

const T_MAX_HALVES = 4.5; // chart spans this many half-lives

interface Nucleus {
  alive: boolean;
  flash: number; // seconds remaining of decay flash
}

export function HalfLifeSimulator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  const [halfLife, setHalfLife] = useState(6);
  const [n0, setN0] = useState(400);
  const [running, setRunning] = useState(false);
  const [showTechnical, setShowTechnical] = useState(false);
  const [readout, setReadout] = useState({ alive: 400, t: 0, activity: 0, halves: [] as number[] });

  const simRef = useRef({
    halfLife: 6,
    n0: 400,
    running: false,
    showTechnical: false,
    t: 0,
    nuclei: [] as Nucleus[],
    watched: 0, // index of the spotlighted nucleus
    watchedDecayT: null as number | null,
    // decay curve: measured (t, N) samples
    curve: [] as { t: number; n: number }[],
    // measured halving crossings
    halvings: [] as number[],
    nextHalfTarget: 200,
    // activity: decays in the last second (ring buffer of per-frame counts)
    recentDecays: [] as { t: number; d: number }[],
  });

  const initNuclei = (count: number) => {
    const s = simRef.current;
    s.nuclei = Array.from({ length: count }, () => ({ alive: true, flash: 0 }));
    s.watched = Math.floor(count / 2) + Math.floor(Math.sqrt(count) / 2); // near centre
    s.watchedDecayT = null;
    s.t = 0;
    s.curve = [{ t: 0, n: count }];
    s.halvings = [];
    s.nextHalfTarget = count / 2;
    s.recentDecays = [];
  };

  const stepPhysics = (dt: number) => {
    const s = simRef.current;
    const lambda = Math.LN2 / s.halfLife;
    const pDecay = 1 - Math.exp(-lambda * dt); // exact per-frame decay probability
    let decays = 0;
    s.nuclei.forEach((nuc, idx) => {
      if (nuc.flash > 0) nuc.flash -= dt;
      if (!nuc.alive) return;
      if (Math.random() < pDecay) {
        nuc.alive = false;
        nuc.flash = 0.45;
        decays += 1;
        if (idx === s.watched && s.watchedDecayT === null) s.watchedDecayT = s.t;
      }
    });
    s.t += dt;
    const alive = s.nuclei.reduce((a, nuc) => a + (nuc.alive ? 1 : 0), 0);

    // record the curve at modest resolution
    const last = s.curve[s.curve.length - 1];
    if (!last || s.t - last.t > 0.1 || alive !== last.n) {
      s.curve.push({ t: s.t, n: alive });
      if (s.curve.length > 2400) s.curve.shift();
    }

    // halving crossings — the measured half-lives
    while (alive <= s.nextHalfTarget && s.nextHalfTarget >= s.n0 / 32) {
      s.halvings.push(s.t);
      s.nextHalfTarget /= 2;
    }

    // activity: decays per second over a sliding 1 s window
    s.recentDecays.push({ t: s.t, d: decays });
    while (s.recentDecays.length && s.recentDecays[0].t < s.t - 1) s.recentDecays.shift();
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

    // ---- nuclei grid ----
    const side = Math.round(Math.sqrt(s.nuclei.length));
    const cell = GSIZE / side;
    const rad = Math.max(2.2, cell * 0.32);
    s.nuclei.forEach((nuc, idx) => {
      const gx = GX + (idx % side) * cell + cell / 2;
      const gy = GY + Math.floor(idx / side) * cell + cell / 2;
      if (nuc.alive) {
        ctx.fillStyle = '#b8823d';
        ctx.beginPath();
        ctx.arc(gx, gy, rad, 0, Math.PI * 2);
        ctx.fill();
      } else if (nuc.flash > 0) {
        ctx.fillStyle = `rgba(179, 74, 60, ${Math.min(1, nuc.flash / 0.45)})`;
        ctx.beginPath();
        ctx.arc(gx, gy, rad * 1.5, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.strokeStyle = 'rgba(46, 125, 107, 0.45)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(gx, gy, rad * 0.8, 0, Math.PI * 2);
        ctx.stroke();
      }
      if (idx === s.watched) {
        ctx.strokeStyle = '#1b2a41';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(gx, gy, rad + 3, 0, Math.PI * 2);
        ctx.stroke();
      }
    });
    ctx.fillStyle = '#4a5a72';
    ctx.font = '600 10.5px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
    ctx.textAlign = 'left';
    const watchedNote =
      s.watchedDecayT === null
        ? 'the ringed nucleus: nobody can say when it will go'
        : `the ringed nucleus went at t = ${s.watchedDecayT.toFixed(1)} s — pure chance`;
    ctx.fillText(watchedNote, GX, GY + GSIZE + 20);
    ctx.font = '600 11px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.fillStyle = '#1b2a41';
    const aliveNow = s.nuclei.reduce((a, nuc) => a + (nuc.alive ? 1 : 0), 0);
    ctx.fillText(`undecayed: ${aliveNow} / ${s.n0}`, GX, GY - 12);

    // ---- decay curve ----
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(CX, CY, CW, CH);
    ctx.strokeStyle = '#1b2a41';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(CX, CY, CW, CH);
    const tMax = T_MAX_HALVES * s.halfLife;
    const tToX = (t: number) => CX + (Math.min(t, tMax) / tMax) * CW;
    const nToY = (n: number) => CY + CH - (n / s.n0) * CH;

    // halving guide lines with measured crossings
    ctx.font = '500 9.5px ui-monospace, SFMono-Regular, Menlo, monospace';
    for (let k = 1; k <= 3; k++) {
      const level = s.n0 / Math.pow(2, k);
      ctx.strokeStyle = 'rgba(27, 42, 65, 0.18)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 4]);
      ctx.beginPath();
      ctx.moveTo(CX, nToY(level));
      ctx.lineTo(CX + CW, nToY(level));
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#4a5a72';
      ctx.textAlign = 'left';
      ctx.fillText(`N₀/${Math.pow(2, k)}`, CX + 4, nToY(level) - 3);
    }

    // theory: N = N0 · 2^(−t/T½)
    ctx.strokeStyle = '#2e7d6b';
    ctx.lineWidth = 1.8;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    for (let k = 0; k <= 120; k++) {
      const t = (tMax * k) / 120;
      const n = s.n0 * Math.pow(2, -t / s.halfLife);
      if (k === 0) ctx.moveTo(tToX(t), nToY(n));
      else ctx.lineTo(tToX(t), nToY(n));
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // measured curve
    if (s.curve.length > 1) {
      ctx.strokeStyle = '#1b2a41';
      ctx.lineWidth = 2;
      ctx.beginPath();
      s.curve.forEach((pt, idx) => {
        if (idx === 0) ctx.moveTo(tToX(pt.t), nToY(pt.n));
        else ctx.lineTo(tToX(pt.t), nToY(pt.n));
      });
      ctx.stroke();
    }

    // measured halving ticks + intervals
    ctx.fillStyle = '#b34a3c';
    s.halvings.forEach((t, k) => {
      ctx.beginPath();
      ctx.arc(tToX(t), nToY(s.n0 / Math.pow(2, k + 1)), 4, 0, Math.PI * 2);
      ctx.fill();
    });
    if (s.halvings.length > 0) {
      ctx.font = '600 10px ui-monospace, SFMono-Regular, Menlo, monospace';
      ctx.fillStyle = '#b34a3c';
      ctx.textAlign = 'left';
      const gaps = s.halvings.map((t, k) => (k === 0 ? t : t - s.halvings[k - 1]));
      ctx.fillText(`measured halvings: ${gaps.map((g) => g.toFixed(1) + ' s').join(' · ')}`, CX + 8, CY + CH - 8);
    }

    ctx.fillStyle = '#1b2a41';
    ctx.font = '600 11px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('undecayed nuclei vs time  (ink: measured · dashes: N₀·2^(−t/T½))', CX + CW / 2, CY - 8);
    ctx.font = '500 10px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.fillStyle = '#4a5a72';
    ctx.textAlign = 'left';
    ctx.fillText('t →', CX + CW - 28, CY + CH + 14);
    ctx.save();
    ctx.translate(CX - 8, CY + 24);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('N →', 0, 0);
    ctx.restore();

    // ---- technical overlay ----
    if (s.showTechnical) {
      const lambda = Math.LN2 / s.halfLife;
      const act = s.recentDecays.reduce((a, r) => a + r.d, 0);
      const aliveN = s.nuclei.reduce((a, nuc) => a + (nuc.alive ? 1 : 0), 0);
      ctx.fillStyle = 'rgba(250, 247, 240, 0.93)';
      ctx.fillRect(CX + 8, CY + 8, 300, 76);
      ctx.strokeStyle = '#1b2a41';
      ctx.lineWidth = 1;
      ctx.strokeRect(CX + 8, CY + 8, 300, 76);
      ctx.fillStyle = '#1b2a41';
      ctx.font = '600 10.5px ui-monospace, SFMono-Regular, Menlo, monospace';
      ctx.textAlign = 'left';
      const lines = [
        `λ = ln2 / T½ = ${lambda.toFixed(3)} per s`,
        `each nucleus, each frame: P(decay) = 1 − e^(−λ·dt)`,
        `activity measured = ${act} decays/s   λN = ${(lambda * aliveN).toFixed(1)}`,
        `the exponential is never programmed — only the dice`,
      ];
      lines.forEach((line, idx) => ctx.fillText(line, CX + 16, CY + 24 + idx * 15));
    }
  };

  const loop = (tNow: number) => {
    if (lastTimeRef.current === null) lastTimeRef.current = tNow;
    const dt = Math.min(0.05, (tNow - lastTimeRef.current) / 1000);
    lastTimeRef.current = tNow;
    const s = simRef.current;
    if (s.running) {
      stepPhysics(dt);
      const alive = s.nuclei.reduce((a, nuc) => a + (nuc.alive ? 1 : 0), 0);
      const act = s.recentDecays.reduce((a, r) => a + r.d, 0);
      setReadout({
        alive,
        t: s.t,
        activity: act,
        halves: s.halvings.map((t, k) => (k === 0 ? t : t - s.halvings[k - 1])),
      });
      if (alive === 0) {
        s.running = false;
        setRunning(false);
      }
    }
    render();
    rafRef.current = requestAnimationFrame(loop);
  };

  const reset = (count?: number) => {
    const s = simRef.current;
    const n = count ?? s.n0;
    s.n0 = n;
    setN0(n);
    initNuclei(n);
    s.running = false;
    setRunning(false);
    setReadout({ alive: n, t: 0, activity: 0, halves: [] });
  };

  const handleStart = () => {
    const s = simRef.current;
    if (s.nuclei.length === 0) initNuclei(s.n0);
    const alive = s.nuclei.some((nuc) => nuc.alive);
    if (!alive) initNuclei(s.n0);
    s.running = !s.running;
    setRunning(s.running);
  };

  const handleHalfLife = (v: number) => {
    setHalfLife(v);
    simRef.current.halfLife = v;
  };

  useEffect(() => {
    initNuclei(400);
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
    { symbol: 'T½', name: 'Half-life', def: 'The time taken for HALF the undecayed nuclei to decay — the same however many you start with, and the same for every successive halving.' },
    { symbol: 'N', name: 'Undecayed nuclei', def: 'The population still waiting to decay. After one half-life: N₀/2. After two: N₀/4. After three: N₀/8.' },
    { symbol: 'A', name: 'Activity', def: 'Decays per second (measured in becquerel, Bq). Proportional to N — so activity also halves every half-life.' },
    { symbol: 'λ', name: 'Decay constant', def: 'The fixed probability per second that any one nucleus decays. Nuclei have no memory: an old nucleus is no more likely to decay than a fresh one.' },
  ];

  return (
    <div className="half-life-lab flex flex-col gap-5">
      {/* ---- Apparatus: full width ---- */}
      <div className="bg-white border border-[#e4ddcc] rounded overflow-hidden">
        <div className="flex justify-between items-baseline px-4 pt-3">
          <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">
            Radioactive Sample · {n0} nuclei
          </span>
          <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">
            {running ? 'decaying' : readout.t > 0 ? 'stopped' : 'ready'} · t = {readout.t.toFixed(1)} s
          </span>
        </div>
        <div className="px-4 pt-2">
          <canvas ref={canvasRef} className="block w-full rounded border border-[#e4ddcc]" style={{ aspectRatio: '1000 / 440' }} />
        </div>
        <div className="px-4 pb-2 pt-2">
          <p className="text-[11.5px] text-[#4a5a72] leading-snug">
            Every <span className="text-[#8f6428] font-semibold">brass nucleus</span> rolls the same dice every instant —
            when one loses, it <span className="text-[#b34a3c] font-semibold">flashes</span> and becomes a faint ring. No
            nucleus knows what the others are doing, yet the population traces the{' '}
            <span className="text-[#2e7d6b] font-semibold">dashed theory curve</span>, and every{' '}
            <span className="text-[#b34a3c] font-semibold">red dot</span> marks a measured halving. Randomness up close,
            law at a distance.
          </p>
        </div>

        <div className="px-4 pb-5 pt-3 border-t border-[#eee6d3]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-3 mb-3">
            <div className="flex items-center gap-3">
              <label className="text-[13px] text-[#4a5a72] w-24 flex-shrink-0">Half-life T½</label>
              <input type="range" min={2} max={20} step={0.5} value={halfLife}
                onChange={(e) => handleHalfLife(parseFloat(e.target.value))} className="flex-1" />
              <span className="font-mono text-[13px] w-16 text-right">{halfLife.toFixed(1)} s</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[13px] text-[#4a5a72] w-24 flex-shrink-0">Sample size</span>
              {[100, 400, 900].map((n) => (
                <button key={n} onClick={() => reset(n)}
                  className={`flex-1 text-[12.5px] font-semibold px-2 py-1.5 rounded border ${
                    n0 === n ? 'bg-[#1b2a41] text-white border-[#1b2a41]' : 'bg-transparent text-[#1b2a41] border-[#d8cfb6] hover:bg-[#f5f0e2]'
                  }`}>
                  {n}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={handleStart}
                className={`flex-1 text-[12.5px] font-semibold px-3 py-2 rounded border ${
                  running ? 'bg-transparent text-[#1b2a41] border-[#d8cfb6] hover:bg-[#f5f0e2]' : 'bg-[#2e7d6b] text-white border-[#2e7d6b]'
                }`}>
                {running ? '⏸ Pause' : readout.t > 0 && readout.alive > 0 ? '▶ Resume' : '▶ Start Decay'}
              </button>
              <button onClick={() => reset()}
                className="flex-1 text-[12.5px] font-semibold px-3 py-2 rounded border bg-transparent text-[#1b2a41] border-[#d8cfb6] hover:bg-[#f5f0e2]">
                ↺ New Sample
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
              <span className="text-[12.5px] text-[#4a5a72]">Undecayed nuclei N</span>
              <span className="font-mono text-[13px] font-bold text-[#1b2a41]">{readout.alive}</span>
            </div>
            <div className="flex justify-between border-b border-[#eee6d3] pb-1">
              <span className="text-[12.5px] text-[#4a5a72]">Elapsed time</span>
              <span className="font-mono text-[13px] text-[#1b2a41]">{readout.t.toFixed(1)} s</span>
            </div>
            <div className="flex justify-between border-b border-[#eee6d3] pb-1">
              <span className="text-[12.5px] text-[#4a5a72]">Activity (decays/s)</span>
              <span className="font-mono text-[13px] font-bold text-[#b34a3c]">{readout.activity}</span>
            </div>
            <div className="flex justify-between border-b border-[#eee6d3] pb-1">
              <span className="text-[12.5px] text-[#4a5a72]">Measured half-lives</span>
              <span className="font-mono text-[12px] text-[#2e7d6b]">
                {readout.halves.length > 0 ? readout.halves.map((h) => h.toFixed(1)).join(' · ') + ' s' : '—'}
              </span>
            </div>
          </div>
          <p className="text-[11.5px] text-[#4a5a72] mt-2.5 leading-snug">
            Watch the activity fall with N: fewer undecayed nuclei means fewer decays per second. Both halve every
            half-life — which is why old radioactive sources grow quiet but never quite reach zero.
          </p>
        </div>

        <div className="bg-white border border-[#e4ddcc] rounded p-4">
          <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">Try This</span>
          <div className="mt-2 space-y-2.5 text-[12px] text-[#4a5a72] leading-snug">
            <p>
              <strong className="text-[#1b2a41]">1.</strong> Before pressing Start, pick the ringed nucleus and guess when
              it will decay. You will be wrong — everyone is. Single decays are genuinely unpredictable.
            </p>
            <p>
              <strong className="text-[#1b2a41]">2.</strong> Compare the measured halvings printed in red: first halving,
              second, third. All roughly equal — the definition of half-life, checked by experiment.
            </p>
            <p>
              <strong className="text-[#1b2a41]">3.</strong> Run the same settings twice. The individual flashes are
              completely different; the curve is nearly the same. Chance in the small, law in the large.
            </p>
            <p>
              <strong className="text-[#1b2a41]">4.</strong> Try 100 nuclei, then 900. The small sample gives a ragged
              staircase, the big one hugs the theory curve — this is why real labs measure with billions of atoms.
            </p>
            <p>
              <strong className="text-[#1b2a41]">5.</strong> After two half-lives, is the sample half gone? No — three
              quarters gone. Each halving acts on what remains, not on the original amount.
            </p>
          </div>
        </div>

        <div className="bg-white border border-[#e4ddcc] rounded p-4">
          <div className="bg-gradient-to-br from-[#fbf5e8] to-[#f6efdc] border border-[#e6d9b8] rounded px-4 py-3.5 text-center mb-3">
            <div className="italic text-[22px] text-[#8f6428]" style={{ fontFamily: 'Georgia, serif' }}>
              N₀ → N₀/2 → N₀/4 → N₀/8
            </div>
            <div className="italic text-[14px] text-[#8f6428] mt-1.5" style={{ fontFamily: 'Georgia, serif' }}>
              one half-life per arrow — activity follows the same ladder
            </div>
          </div>
          <h2 className="font-mono text-[13px] tracking-wide uppercase text-[#4a5a72] border-b border-[#eee6d3] pb-2 mb-3">
            What Each Variable Means
          </h2>
          <div className="space-y-2.5">
            {variables.map((v) => (
              <div key={v.symbol} className="flex gap-3 items-start">
                <div
                  className="flex-shrink-0 w-9 h-9 rounded bg-[#faf7f0] border border-[#eee6d3] flex items-center justify-center text-[15px] font-bold italic text-[#8f6428]"
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
