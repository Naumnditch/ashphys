/**
 * Draws saved handwriting (lib/reports/ink.ts) as an inline SVG, cropped to
 * what was written. Pure render: used on the report, in the note card and in
 * the editor's preview. Width keeps the writing at the size it was written
 * on the pad, so a short note stays small and a full page fills the card.
 */

import { inkBox, inkPaths, type Ink } from '@/lib/reports/ink';

export function InkImage({
  ink,
  label,
  height,
  className = '',
}: {
  ink: Ink;
  /** Accessible description (e.g. "Handwritten note from Mr. A"). */
  label: string;
  /** Render at this height in px with the width following (signatures). */
  height?: number;
  className?: string;
}) {
  const box = inkBox(ink);
  const widthPct = Math.min(100, (box.w / ink.w) * 100);
  return (
    <svg
      viewBox={`${box.x} ${box.y} ${box.w} ${box.h}`}
      role="img"
      aria-label={label}
      className={`block h-auto ${className}`}
      style={height ? { height, width: (height * box.w) / box.h, maxWidth: '100%' } : { width: `${widthPct}%`, maxWidth: '100%' }}
      preserveAspectRatio="xMinYMid meet"
    >
      {inkPaths(ink).map((p, i) => (
        <path key={i} d={p.d} fill={p.fill} />
      ))}
    </svg>
  );
}
