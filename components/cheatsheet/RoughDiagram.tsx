import type { Diagram } from '@/lib/cheatsheets/types';
import { renderDiagram } from '@/lib/cheatsheets/rough';

const LABEL_SIZE = { sm: 13, md: 16 } as const;

/**
 * A hand-drawn diagram (Rough.js), rendered on the server. Scales with its
 * container through the viewBox. Colours come from the role classes in
 * cheatsheet.css, so the same SVG works in light, dark and print.
 */
export function RoughDiagram({ diagram }: { diagram: Diagram }) {
  const { paths, labels } = renderDiagram(diagram);
  const titleId = `cs-fig-${diagram.id}-title`;
  const descId = `cs-fig-${diagram.id}-desc`;
  return (
    <svg
      viewBox={`0 0 ${diagram.width} ${diagram.height}`}
      role="img"
      aria-labelledby={`${titleId} ${descId}`}
      preserveAspectRatio="xMidYMid meet"
    >
      <title id={titleId}>{diagram.title}</title>
      <desc id={descId}>{diagram.alt}</desc>
      {paths.map((p, i) => (
        <path
          key={i}
          className={`cs-role-${p.role}`}
          d={p.d}
          stroke="currentColor"
          strokeWidth={p.strokeWidth}
          fill={p.fill}
          strokeLinecap="round"
          strokeDasharray={p.dashed ? '6 5' : undefined}
        />
      ))}
      {labels.map((l, i) => (
        <text
          key={`l${i}`}
          className={`cs-role-${l.role}`}
          x={l.at[0]}
          y={l.at[1]}
          textAnchor={l.anchor}
          fontSize={LABEL_SIZE[l.size]}
          fontWeight={l.size === 'md' ? 700 : 400}
          fontStyle={l.size === 'md' ? 'italic' : undefined}
        >
          {l.text}
        </text>
      ))}
    </svg>
  );
}
