/**
 * Renders a question's inline SVG figure (problems.figure_svg).
 *
 * The markup has already been through sanitizeFigureSvg on the server; it is
 * drawn in currentColor and the --fig-* theme variables, so it inherits the
 * surrounding text colour and follows light/dark mode. The SVG carries its own
 * <title>/<desc>; the full description (figure_alt) is also available to
 * everyone under a small "Describe the figure" disclosure.
 */

interface Props {
  svg: string;
  alt: string;
}

export function QuestionFigure({ svg, alt }: Props) {
  return (
    <figure className="question-figure mx-auto mb-4 w-full max-w-md text-gray-900" data-testid="question-figure">
      <div className="question-figure-svg" dangerouslySetInnerHTML={{ __html: svg }} />
      <details className="mt-1 text-xs text-gray-500">
        <summary className="cursor-pointer select-none">Describe the figure</summary>
        <p className="mt-1 leading-relaxed text-gray-600">{alt}</p>
      </details>
    </figure>
  );
}
