// Canvas 2D can't read CSS variables, so sims write their colors as CSS-variable
// expressions (e.g. 'rgb(var(--h-1b2a41) / 0.4)', the same strings SVG and DOM
// use) and draw through a context from `themedContext`, which resolves them
// against the canvas's computed theme at assignment time.

const VAR_RGB = /rgb\(\s*var\((--[\w-]+)\)\s*(?:\/\s*([^)]+?)\s*)?\)/g;

type ColorProp = 'fillStyle' | 'strokeStyle' | 'shadowColor';
const COLOR_PROPS: ColorProp[] = ['fillStyle', 'strokeStyle', 'shadowColor'];

export function resolveThemeColor(value: string, el: Element): string {
  if (!value.includes('var(')) return value;
  const cs = getComputedStyle(el);
  return value.replace(VAR_RGB, (whole, name: string, alpha?: string) => {
    const triplet = cs.getPropertyValue(name).trim();
    if (!triplet) return whole;
    return alpha ? `rgb(${triplet} / ${alpha})` : `rgb(${triplet})`;
  });
}

/**
 * `canvas.getContext('2d')` whose fillStyle / strokeStyle / shadowColor /
 * gradient stops accept theme-variable colors. Call the sim's draw routine
 * again after a theme change (see useResolvedTheme).
 */
export function themedContext(
  canvas: HTMLCanvasElement,
  options?: CanvasRenderingContext2DSettings,
): CanvasRenderingContext2D | null {
  const ctx = canvas.getContext('2d', options);
  if (!ctx) return null;
  const patched = ctx as CanvasRenderingContext2D & { __themed?: boolean };
  if (patched.__themed) return ctx;
  patched.__themed = true;

  // Offscreen (detached) canvases have no cascade: fall back to the page theme.
  const resolve = (v: string) => resolveThemeColor(v, canvas.isConnected ? canvas : document.documentElement);

  for (const prop of COLOR_PROPS) {
    const desc = Object.getOwnPropertyDescriptor(CanvasRenderingContext2D.prototype, prop);
    if (!desc?.get || !desc.set) continue;
    const { get, set } = desc;
    Object.defineProperty(ctx, prop, {
      configurable: true,
      get() {
        return get.call(ctx);
      },
      set(v: unknown) {
        set.call(ctx, typeof v === 'string' ? resolve(v) : v);
      },
    });
  }

  const wrapGradient = <K extends 'createLinearGradient' | 'createRadialGradient'>(name: K) => {
    const orig = ctx[name].bind(ctx) as (...a: number[]) => CanvasGradient;
    (ctx as unknown as Record<string, unknown>)[name] = (...args: number[]) => {
      const g = orig(...args);
      const add = g.addColorStop.bind(g);
      g.addColorStop = (offset: number, color: string) => add(offset, resolve(color));
      return g;
    };
  };
  wrapGradient('createLinearGradient');
  wrapGradient('createRadialGradient');

  return ctx;
}

/** True when the canvas sits in a dark-themed region (reads the cascaded color-scheme). */
export function isDarkCanvas(canvas: HTMLCanvasElement): boolean {
  return getComputedStyle(canvas.isConnected ? canvas : document.documentElement).colorScheme === 'dark';
}
