// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cueDuration, cuePeakGain, playCue } from '@/lib/feedback/sounds';

// A fake Web Audio graph: records every oscillator started.
class FakeParam {
  value = 0;
  setValueAtTime() {}
  exponentialRampToValueAtTime() {}
}
class FakeNode {
  connect(n: unknown) {
    return n;
  }
}
const started: number[] = [];
class FakeAudioContext {
  state: 'running' | 'suspended' = 'running';
  currentTime = 0;
  destination = new FakeNode();
  resume = vi.fn(async () => {
    this.state = 'running';
  });
  createOscillator() {
    const osc = Object.assign(new FakeNode(), { type: 'sine', frequency: new FakeParam(), start: (t: number) => started.push(t), stop() {} });
    return osc;
  }
  createGain() {
    return Object.assign(new FakeNode(), { gain: new FakeParam() });
  }
  createBiquadFilter() {
    return Object.assign(new FakeNode(), { type: 'lowpass', frequency: new FakeParam() });
  }
  createBuffer() {
    return {};
  }
  createBufferSource() {
    return Object.assign(new FakeNode(), { buffer: null, start() {} });
  }
}

function setReducedMotion(reduce: boolean) {
  window.matchMedia = ((q: string) => ({ matches: reduce && q.includes('reduce'), media: q })) as unknown as typeof window.matchMedia;
}

async function freshModule() {
  vi.resetModules();
  return import('@/lib/feedback');
}

beforeEach(() => {
  localStorage.clear();
  started.length = 0;
  (window as unknown as { AudioContext: unknown }).AudioContext = FakeAudioContext;
  setReducedMotion(false);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('sound cues', () => {
  it('stay inside their length budgets', () => {
    expect(cueDuration('correct')).toBeGreaterThanOrEqual(0.15);
    expect(cueDuration('correct')).toBeLessThanOrEqual(0.3);
    expect(cueDuration('incorrect')).toBeLessThan(0.4);
    expect(cueDuration('fanfare')).toBeLessThan(1);
  });

  it('makes the wrong-answer tone noticeably quieter than the chime', () => {
    expect(cuePeakGain('incorrect')).toBeLessThanOrEqual(0.15);
    expect(cuePeakGain('incorrect')).toBeLessThan(cuePeakGain('correct') * 0.75);
  });

  it('schedules one oscillator per note', () => {
    playCue(new FakeAudioContext() as unknown as AudioContext, 'correct');
    expect(started.length).toBe(3);
  });
});

describe('mute setting', () => {
  it('defaults to sound on and persists the choice', async () => {
    const fb = await freshModule();
    expect(fb.isSoundMuted()).toBe(false);
    const heard = vi.fn();
    window.addEventListener(fb.SOUND_MUTED_EVENT, heard);
    fb.setSoundMuted(true);
    expect(localStorage.getItem('ashphys:sound-muted')).toBe('1');
    expect(heard).toHaveBeenCalledTimes(1);
    expect((await freshModule()).isSoundMuted()).toBe(true);
    fb.setSoundMuted(false);
    expect(localStorage.getItem('ashphys:sound-muted')).toBeNull();
    window.removeEventListener(fb.SOUND_MUTED_EVENT, heard);
  });

  it('plays nothing before a user interaction or while muted', async () => {
    const fb = await freshModule();
    fb.playSound('correct');
    await new Promise((r) => setTimeout(r, 20));
    expect(started.length).toBe(0);

    fb.setSoundMuted(true);
    fb.primeFeedback();
    fb.playSound('correct');
    await new Promise((r) => setTimeout(r, 20));
    expect(started.length).toBe(0);
  });

  it('plays once primed by a gesture', async () => {
    const fb = await freshModule();
    fb.primeFeedback();
    fb.playSound('incorrect');
    await vi.waitFor(() => expect(started.length).toBe(2));
  });
});

describe('motion', () => {
  it('shakes and pulses a wrong answer, but only pulses under reduced motion', async () => {
    const fb = await freshModule();
    const el = document.createElement('div');
    const animate = vi.fn((..._args: unknown[]) => ({}) as Animation);
    (el as unknown as { animate: typeof animate }).animate = animate;

    fb.shakeIncorrect(el, { sound: false });
    expect(animate).toHaveBeenCalledTimes(2);
    expect(JSON.stringify(animate.mock.calls[0])).toContain('translateX');

    animate.mockClear();
    setReducedMotion(true);
    fb.shakeIncorrect(el, { sound: false });
    expect(animate).toHaveBeenCalledTimes(1);
    expect(JSON.stringify(animate.mock.calls[0])).not.toContain('transform');
  });

  it('reveals with height and opacity, or opacity alone under reduced motion', async () => {
    const fb = await freshModule();
    const el = document.createElement('div');
    const animate = vi.fn((..._args: unknown[]) => ({}) as Animation);
    (el as unknown as { animate: typeof animate }).animate = animate;

    fb.animateReveal(el);
    expect(JSON.stringify(animate.mock.calls[0][0])).toContain('height');

    setReducedMotion(true);
    fb.animateReveal(el);
    expect(JSON.stringify(animate.mock.calls[1][0])).toBe(JSON.stringify([{ opacity: 0 }, { opacity: 1 }]));
  });

  it('never throws where the browser lacks the APIs', async () => {
    const fb = await freshModule();
    delete (window as unknown as { AudioContext?: unknown }).AudioContext;
    expect(() => {
      fb.primeFeedback();
      fb.playSound('fanfare');
      fb.shakeIncorrect(null);
      fb.animateReveal(document.createElement('div'));
    }).not.toThrow();
  });

  it('loads no confetti under reduced motion or with confetti switched off', async () => {
    const fb = await freshModule();
    setReducedMotion(true);
    fb.celebrateCorrect(null);
    setReducedMotion(false);
    localStorage.setItem('ashphys:confetti', 'off');
    fb.celebrateMilestone(null);
    expect(document.querySelector('canvas')).toBeNull();
  });
});
