/**
 * The feedback cues, synthesized with the Web Audio API instead of shipped as
 * files: no request, nothing to preload or license, and they start instantly.
 * Loaded on demand by lib/feedback (never in the initial bundle).
 *
 * - correct: two bright notes rising a fourth (E5 660 Hz → A5 880 Hz), ~0.26 s, peak gain 0.2.
 * - incorrect: two soft low notes falling (E4 330 Hz → A3 220 Hz), triangle through a
 *   low-pass, ~0.34 s, peak gain 0.12, so it reads as "not quite" rather than a buzzer.
 * - fanfare: a C-major arpeggio (C5 E5 G5 C6) with the top note held, ~0.8 s.
 */
import type { SoundName } from './index';

interface Note {
  freq: number;
  /** Seconds after the cue starts. */
  at: number;
  /** Seconds until the note has decayed to silence. */
  length: number;
  gain: number;
  type?: OscillatorType;
}

const CUES: Record<SoundName, { notes: Note[]; lowpass?: number }> = {
  correct: {
    notes: [
      { freq: 659.25, at: 0, length: 0.14, gain: 0.2 },
      { freq: 880, at: 0.09, length: 0.17, gain: 0.2 },
      // A quiet octave on the top note for a little sparkle.
      { freq: 1760, at: 0.09, length: 0.12, gain: 0.035 },
    ],
  },
  incorrect: {
    lowpass: 1100,
    notes: [
      { freq: 329.63, at: 0, length: 0.16, gain: 0.12, type: 'triangle' },
      { freq: 220, at: 0.13, length: 0.21, gain: 0.11, type: 'triangle' },
    ],
  },
  fanfare: {
    notes: [
      { freq: 523.25, at: 0, length: 0.16, gain: 0.16, type: 'triangle' },
      { freq: 659.25, at: 0.1, length: 0.16, gain: 0.16, type: 'triangle' },
      { freq: 783.99, at: 0.2, length: 0.18, gain: 0.16, type: 'triangle' },
      { freq: 1046.5, at: 0.3, length: 0.5, gain: 0.18 },
      { freq: 783.99, at: 0.3, length: 0.45, gain: 0.06 },
      { freq: 2093, at: 0.3, length: 0.25, gain: 0.025 },
    ],
  },
};

export function playCue(ctx: AudioContext, name: SoundName): void {
  const cue = CUES[name];
  const start = ctx.currentTime + 0.01;
  let out: AudioNode = ctx.destination;
  if (cue.lowpass) {
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = cue.lowpass;
    filter.connect(ctx.destination);
    out = filter;
  }
  for (const n of cue.notes) {
    const osc = ctx.createOscillator();
    const amp = ctx.createGain();
    osc.type = n.type ?? 'sine';
    osc.frequency.value = n.freq;
    const t0 = start + n.at;
    // Quick attack, exponential decay (exponential ramps can't reach 0, hence 0.0001).
    amp.gain.setValueAtTime(0.0001, t0);
    amp.gain.exponentialRampToValueAtTime(n.gain, t0 + 0.008);
    amp.gain.exponentialRampToValueAtTime(0.0001, t0 + n.length);
    osc.connect(amp).connect(out);
    osc.start(t0);
    osc.stop(t0 + n.length + 0.02);
  }
}

/** Total length of a cue in seconds (tests keep every cue inside its budget). */
export function cueDuration(name: SoundName): number {
  return Math.max(...CUES[name].notes.map((n) => n.at + n.length));
}

export function cuePeakGain(name: SoundName): number {
  return Math.max(...CUES[name].notes.map((n) => n.gain));
}
