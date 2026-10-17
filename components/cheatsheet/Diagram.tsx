import type { Diagram } from '@/lib/cheatsheets/types';
import { labelRuns, renderDiagram } from '@/lib/cheatsheets/diagram';

const MATH_SIZE = 17;
const NOTE_SIZE = 12.5;

/**
 * A precise vector diagram, rendered on the server. Scales with its container
 * through the viewBox. Colours come from the role classes in cheatsheet.css,
 * so the same SVG works in light, dark and print. Math labels use the KaTeX
 * fonts, so a symbol looks the same in a figure as in an equation.
 */
export function SheetDiagram({ diagram }: { diagram: Diagram }) {
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
          className={`cs-role-${p.role}${p.fill === 'soft' ? ' cs-soft' : ''}`}
          d={p.d}
          stroke={p.strokeWidth > 0 ? 'currentColor' : 'none'}
          strokeWidth={p.strokeWidth || undefined}
          fill={p.fill === 'soft' ? undefined : p.fill}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={p.dashed ? '5 4' : undefined}
        />
      ))}
      {labels.map((l, i) =>
        l.style === 'note' ? (
          <text
            key={`l${i}`}
            className={`cs-role-${l.role} cs-fig-note`}
            x={l.at[0]}
            y={l.at[1]}
            textAnchor={l.anchor}
            fontSize={NOTE_SIZE}
          >
            {l.text}
          </text>
        ) : (
          <text
            key={`l${i}`}
            className={`cs-role-${l.role} cs-fig-math`}
            x={l.at[0]}
            y={l.at[1]}
            textAnchor={l.anchor}
            fontSize={MATH_SIZE}
          >
            {labelRuns(l.text).map((r, j, runs) => (
              <tspan
                key={j}
                className={r.upright ? 'cs-fig-upright' : undefined}
                fontSize={r.sub ? MATH_SIZE * 0.68 : undefined}
                // A subscript drops the baseline; the run after it lifts it back.
                dy={r.sub ? 4 : j > 0 && runs[j - 1].sub ? -4 : undefined}
              >
                {r.text}
              </tspan>
            ))}
          </text>
        ),
      )}
    </svg>
  );
}
