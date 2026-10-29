/**
 * Answer feedback: confetti, small motion and synthesized sounds.
 *
 * Everything here is a layer *around* the app: no function returns anything a
 * caller has to wait for, nothing throws, and every call is a no-op on the
 * server or in a browser that lacks the API it needs. canvas-confetti and the
 * sound recipes (./sounds) are dynamic imports, so a page that never
 * celebrates never downloads them.
 *
 * Switches (see PROJECT_STATUS.md, "Answer feedback"):
 * - `localStorage['ashphys:sound-muted'] = '1'` mutes every sound (the speaker
 *   button in the practice top bar writes it).
 * - `localStorage['ashphys:confetti'] = 'off'` turns confetti off only.
 * - prefers-reduced-motion: no confetti and no transform animations (shake,
 *   pop, lift); opacity fades stay. Sounds still play unless muted.
 */

export type SoundName = 'correct' | 'incorrect' | 'fanfare';

const MUTE_KEY = 'ashphys:sound-muted';
const CONFETTI_KEY = 'ashphys:confetti';
/** Fired on window when the mute setting changes, so every toggle stays in sync. */
export const SOUND_MUTED_EVENT = 'ashphys:sound-muted';

// Brand accents: blue-600, the practice indigo, the chart blue/orange, green-500, amber-500.
const COLORS = ['#2563eb', '#5a67d8', '#2a78d6', '#eb6834', '#22c55e', '#f59e0b'];
const GOLD = ['#f59e0b', '#fbbf24', '#fde68a', '#2563eb', '#5a67d8'];

const isBrowser = () => typeof window !== 'undefined' && typeof document !== 'undefined';

function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ sound */

export function isSoundMuted(): boolean {
  return isBrowser() && read(MUTE_KEY) === '1';
}

export function setSoundMuted(muted: boolean): void {
  if (!isBrowser()) return;
  try {
    if (muted) localStorage.setItem(MUTE_KEY, '1');
    else localStorage.removeItem(MUTE_KEY);
  } catch {
    // Blocked storage: the choice lasts for this page only.
  }
  memoryMuted = muted;
  window.dispatchEvent(new CustomEvent(SOUND_MUTED_EVENT, { detail: muted }));
}

// Mirrors the last setSoundMuted() so a blocked localStorage still mutes this page.
let memoryMuted: boolean | null = null;
const muted = () => memoryMuted ?? isSoundMuted();

let ctx: AudioContext | null = null;
let primed = false;
let soundsModule: Promise<typeof import('./sounds')> | null = null;
const loadSounds = () => (soundsModule ??= import('./sounds'));

function audioContextClass(): typeof AudioContext | null {
  if (!isBrowser()) return null;
  const w = window as typeof window & { webkitAudioContext?: typeof AudioContext };
  return w.AudioContext ?? w.webkitAudioContext ?? null;
}

/** True once the page has had a click, tap or key press (browsers block audio before that). */
function hasUserActivation(): boolean {
  if (primed) return true;
  const ua = (navigator as Navigator & { userActivation?: { hasBeenActive: boolean } }).userActivation;
  return !!ua?.hasBeenActive;
}

/**
 * Call synchronously inside a click/tap/keydown handler (before any await):
 * creates and unlocks the AudioContext while the browser still counts the
 * user gesture, and starts fetching the sound recipes. Cheap and idempotent.
 */
export function primeFeedback(): void {
  if (!isBrowser()) return;
  primed = true;
  if (muted()) return;
  const Ctor = audioContextClass();
  if (!Ctor) return;
  try {
    ctx ??= new Ctor();
    if (ctx.state === 'suspended') void ctx.resume().catch(() => {});
    // iOS < 15 only unlocks after something has actually played: one silent frame.
    const buffer = ctx.createBuffer(1, 1, 22050);
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.connect(ctx.destination);
    src.start(0);
  } catch {
    ctx = null;
  }
  void loadSounds().catch(() => {});
}

/** Plays one of the synthesized cues. Silently does nothing when muted or before any user interaction. */
export function playSound(name: SoundName): void {
  if (!isBrowser() || muted() || !hasUserActivation()) return;
  const Ctor = audioContextClass();
  if (!Ctor) return;
  void (async () => {
    try {
      const audio = (ctx ??= new Ctor());
      // resume() never settles without a gesture: give it a moment, then drop the cue
      // rather than letting it play late.
      const running = () => audio.state === 'running';
      if (!running()) await Promise.race([audio.resume(), new Promise((r) => setTimeout(r, 150))]);
      if (!running()) return;
      const { playCue } = await loadSounds();
      playCue(audio, name);
    } catch {
      /* audio is decoration: never surface an error */
    }
  })();
}

/* ----------------------------------------------------------------- motion */

export function prefersReducedMotion(): boolean {
  return isBrowser() && typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function confettiAllowed(): boolean {
  return isBrowser() && !prefersReducedMotion() && read(CONFETTI_KEY) !== 'off';
}

type Confetti = import('canvas-confetti').CreateTypes;
let confettiInstance: Promise<Confetti> | null = null;

function getConfetti(): Promise<Confetti> {
  return (confettiInstance ??= import('canvas-confetti').then(({ default: confetti }) => {
    // One full-screen canvas for every burst, above everything (incl. the practice
    // shell and modals) and transparent to clicks, so "Next" works mid-burst.
    const canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:200';
    document.body.appendChild(canvas);
    return confetti.create(canvas, { resize: true, useWorker: true, disableForReducedMotion: true });
  }));
}

function fire(run: (confetti: Confetti) => void): void {
  if (!confettiAllowed()) return;
  getConfetti()
    .then(run)
    .catch(() => {
      confettiInstance = null;
    });
}

/** Viewport-relative centre of an element, as canvas-confetti's origin; top-centre without one. */
function originOf(el?: Element | null): { x: number; y: number } {
  if (!el || !isBrowser()) return { x: 0.5, y: 0.25 };
  const r = el.getBoundingClientRect();
  const x = (r.left + r.width / 2) / window.innerWidth;
  const y = (r.top + Math.min(r.height / 2, 40)) / window.innerHeight;
  const clamp = (v: number) => Math.min(0.95, Math.max(0.05, v));
  return { x: clamp(x), y: clamp(y) };
}

// ~60 ticks a second: 100 ticks keeps a correct-answer burst under two seconds.
const SHORT = 100;

/** Correct answer: a burst from `origin` (the feedback box) plus one from each side, and the chime. */
export function celebrateCorrect(origin?: Element | null): void {
  playSound('correct');
  const at = originOf(origin);
  const small = isBrowser() && window.innerWidth < 640;
  fire((confetti) => {
    const base = { colors: COLORS, ticks: SHORT, gravity: 1.1, scalar: small ? 0.75 : 0.9, disableForReducedMotion: true };
    void confetti({ ...base, particleCount: small ? 30 : 45, spread: 70, startVelocity: 30, origin: at });
    void confetti({ ...base, particleCount: small ? 18 : 28, angle: 60, spread: 50, startVelocity: 45, origin: { x: 0, y: 0.7 } });
    void confetti({ ...base, particleCount: small ? 18 : 28, angle: 120, spread: 50, startVelocity: 45, origin: { x: 1, y: 0.7 } });
  });
}

/** Finished a whole set or mastered the lesson: three waves over ~1.5 s that settle by ~3.5 s, and the fanfare. */
export function celebrateMilestone(origin?: Element | null): void {
  playSound('fanfare');
  const at = originOf(origin);
  fire((confetti) => {
    const base = { colors: COLORS, ticks: 200, disableForReducedMotion: true };
    void confetti({ ...base, particleCount: 90, spread: 100, startVelocity: 38, origin: at });
    [0, 350, 700].forEach((delay, i) =>
      setTimeout(() => {
        void confetti({ ...base, particleCount: 40 - i * 8, angle: 60, spread: 60, startVelocity: 55, origin: { x: 0, y: 0.75 } });
        void confetti({ ...base, particleCount: 40 - i * 8, angle: 120, spread: 60, startVelocity: 55, origin: { x: 1, y: 0.75 } });
      }, delay),
    );
    setTimeout(() => void confetti({ ...base, particleCount: 60, spread: 160, startVelocity: 25, origin: { x: 0.5, y: 0.2 } }), 1100);
  });
}

/** A plan was just upgraded: one gentle sparkle burst and the milestone fanfare. */
export function celebrateUpgrade(origin?: Element | null): void {
  playSound('fanfare');
  const at = originOf(origin);
  fire((confetti) => {
    void confetti({
      colors: GOLD,
      shapes: ['star', 'circle'],
      particleCount: 60,
      spread: 90,
      startVelocity: 26,
      gravity: 0.8,
      ticks: 160,
      scalar: 0.9,
      origin: at,
      disableForReducedMotion: true,
    });
  });
}

function canAnimate(el: Element | null | undefined): el is HTMLElement {
  return !!el && typeof (el as HTMLElement).animate === 'function';
}

/**
 * Wrong answer: a short sideways shake (skipped under reduced motion) and a red
 * ring that pulses once, plus the soft error tone unless `sound` is false.
 */
export function shakeIncorrect(el: Element | null | undefined, { sound = true }: { sound?: boolean } = {}): void {
  if (sound) playSound('incorrect');
  if (!canAnimate(el)) return;
  try {
    if (!prefersReducedMotion()) {
      el.animate(
        [
          { transform: 'translateX(0)' },
          { transform: 'translateX(-6px)' },
          { transform: 'translateX(5px)' },
          { transform: 'translateX(-4px)' },
          { transform: 'translateX(3px)' },
          { transform: 'translateX(0)' },
        ],
        { duration: 300, easing: 'ease-out' },
      );
    }
    el.animate(
      [
        { boxShadow: '0 0 0 0 rgb(239 68 68 / 0.55)' },
        { boxShadow: '0 0 0 4px rgb(239 68 68 / 0.35)', offset: 0.35 },
        { boxShadow: '0 0 0 7px rgb(239 68 68 / 0)' },
      ],
      { duration: 650, easing: 'ease-out' },
    );
  } catch {
    /* ignore */
  }
}

/**
 * Expands a freshly shown block: height 0 → natural and a fade, ease-out ~280 ms.
 * Reduced motion keeps only the fade. Height is released afterwards, so content
 * that loads later grows the block normally.
 */
export function animateReveal(el: Element | null | undefined): void {
  if (!canAnimate(el)) return;
  try {
    if (prefersReducedMotion()) {
      el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 150, easing: 'ease-out' });
      return;
    }
    const height = el.scrollHeight;
    const prevOverflow = el.style.overflow;
    el.style.overflow = 'hidden';
    const anim = el.animate(
      [
        { height: '0px', opacity: 0 },
        { height: `${height}px`, opacity: 1 },
      ],
      { duration: 280, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
    );
    const restore = () => {
      el.style.overflow = prevOverflow;
    };
    anim.onfinish = restore;
    anim.oncancel = restore;
  } catch {
    /* ignore */
  }
}
