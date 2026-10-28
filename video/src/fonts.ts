import { loadFont } from '@remotion/google-fonts/Inter';

/** The site's font (next/font/google Inter in app/layout.tsx). */
export const { fontFamily } = loadFont('normal', { weights: ['400', '500', '600', '700', '800'], subsets: ['latin'] });
