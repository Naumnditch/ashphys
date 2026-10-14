// Dark-mode counterpart of a light-mode color: lightness flipped (pale -> dark
// tint, dark ink -> light ink), mid-tone inks/accents lifted to >= 4.5:1 on the
// dark paper. This is the same transform scripts/theme-hex-vars.py uses to write
// the --h-xxxxxx CSS variables (lib/theme/__tests__/darkVariant.test.ts keeps them in
// step); WebGL scenes use it directly since they can't read CSS variables.

const DARK_PAPER: [number, number, number] = [31, 28, 22]; // faf7f0 flipped

function rgbToHls(r: number, g: number, b: number): [number, number, number] {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (min + max) / 2;
  if (max === min) return [0, l, 0];
  const d = max - min;
  const s = l <= 0.5 ? d / (max + min) : d / (2 - max - min);
  const rc = (max - r) / d;
  const gc = (max - g) / d;
  const bc = (max - b) / d;
  let h = r === max ? bc - gc : g === max ? 2 + rc - bc : 4 + gc - rc;
  h = (h / 6) % 1;
  if (h < 0) h += 1;
  return [h, l, s];
}

function hlsToRgb(h: number, l: number, s: number): [number, number, number] {
  if (s === 0) return [l, l, l];
  const m2 = l <= 0.5 ? l * (1 + s) : l + s - l * s;
  const m1 = 2 * l - m2;
  const v = (hue: number) => {
    hue = ((hue % 1) + 1) % 1;
    if (hue < 1 / 6) return m1 + (m2 - m1) * hue * 6;
    if (hue < 0.5) return m2;
    if (hue < 2 / 3) return m1 + (m2 - m1) * (2 / 3 - hue) * 6;
    return m1;
  };
  return [v(h + 1 / 3), v(h), v(h - 1 / 3)];
}

function luminance([r, g, b]: [number, number, number]) {
  const f = (c: number) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

function contrast(a: [number, number, number], b: [number, number, number]) {
  const x = luminance(a);
  const y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

/** Python's round(): halves go to the even neighbour. */
function pyRound(x: number) {
  const f = Math.floor(x);
  const diff = x - f;
  if (diff < 0.5) return f;
  if (diff > 0.5) return f + 1;
  return f % 2 === 0 ? f : f + 1;
}

export function darkVariant(hex: number): [number, number, number] {
  const r = (hex >> 16) & 255;
  const g = (hex >> 8) & 255;
  const b = hex & 255;
  const [h, l, s0] = rgbToHls(r / 255, g / 255, b / 255);
  let l2 = 0.07 + (1 - l) * 0.86;
  let s = s0;
  if (l2 < 0.3) s *= 0.35;
  else if (l2 > 0.55) s *= 0.85;
  const out = (L: number) => hlsToRgb(h, L, s).map((x) => pyRound(x * 255)) as [number, number, number];
  if (l >= 0.2 && l <= 0.72) {
    while (contrast(out(l2), DARK_PAPER) < 4.5 && l2 < 0.95) l2 += 0.01;
  }
  return out(l2);
}

export function darkHex(hex: number): number {
  const [r, g, b] = darkVariant(hex);
  return (r << 16) | (g << 8) | b;
}
