import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';
import hexList from './app/theme-hex.json';

// Colors resolve through CSS variables (app/theme.css) so every existing
// bg-/text-/border- class follows the active theme. Variables hold RGB triplets
// so opacity modifiers (bg-white/20) keep working.
const v = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const grayVars = Object.fromEntries(
  [50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((s) => [s, v(`gray-${s}`)]),
);

// Accent hues: pale shades (backgrounds/borders) become dark tints and the
// text shades become lighter in dark mode. Solid fills (bg-*-500..900) are
// deliberately left alone: they carry white text and read fine on both themes.
const hues = ['blue', 'red', 'green', 'amber', 'violet', 'purple', 'rose', 'teal', 'emerald', 'indigo', 'yellow'];
const shades = (list: number[], hue: string) => Object.fromEntries(list.map((s) => [s, v(`${hue}-${s}`)]));
const perHue = (list: number[]) => Object.fromEntries(hues.map((h) => [h, shades(list, h)]));

// bg-h-faf7f0 etc.: one color per hard-coded hex that used to be written as
// bg-[#faf7f0]. Regenerate with scripts/theme-hex-vars.py when adding hexes.
const hexColors = Object.fromEntries((hexList as string[]).map((h) => [h, v(`h-${h}`)]));

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        xs: '400px',
      },
      colors: {
        black: v('ink'),
        // `white` stays literal white for text/gradients/overlays; surfaces use
        // the backgroundColor/borderColor overrides below.
        white: '#FFFFFF',
        gray: grayVars,
        h: hexColors,
        // Literal colors that must not flip with the theme.
        scrim: '#000000',
        'on-ink': v('on-ink'),
      },
      backgroundColor: {
        white: v('surface'),
        ...perHue([50, 100, 200, 300]),
        // Solid -600 fills carry white text; these hues only reach 4.5:1 with it in a
        // darker shade, so dark mode steps them down to -700 (light keeps -600).
        ...Object.fromEntries(
          ['green', 'amber', 'teal', 'emerald', 'yellow'].map((h) => [h, { ...perHue([50, 100, 200, 300])[h], 600: v(`bg-${h}-600`) }]),
        ),
      },
      borderColor: {
        white: v('surface'),
        ...perHue([50, 100, 200, 300]),
      },
      divideColor: { white: v('surface') },
      ringOffsetColor: { white: v('surface') },
      textColor: perHue([400, 500, 600, 700, 800, 900]),
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
      },
    },
  },
  plugins: [
    // Practice page: question and solution side by side on desktop, iPad
    // landscape and large phones held sideways; stacked otherwise. A variant
    // rather than a `screens` entry: an object screen would switch off the
    // `min-[900px]:` style variants other pages use.
    plugin(({ addVariant }) => {
      addVariant('split', '@media (min-width: 1024px), (min-width: 700px) and (orientation: landscape)');
    }),
  ],
};

export default config;
