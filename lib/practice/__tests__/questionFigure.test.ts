import { describe, expect, it } from 'vitest';
import { MAX_FIGURE_BYTES, questionFigure, sanitizeFigureSvg } from '../figure';

const ok =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200" role="img" aria-labelledby="f-t f-d">' +
  '<title id="f-t">Circuit</title><desc id="f-d">A 6.0 V cell in series with a 2.0 Ω resistor.</desc>' +
  '<line x1="0" y1="0" x2="10" y2="10" style="stroke:var(--fig-accent,#1d4ed8)"/><text x="5" y="5" fill="currentColor">2.0 Ω</text></svg>';
const alt = 'A 6.0 V cell in series with a 2.0 Ω resistor.';

describe('sanitizeFigureSvg', () => {
  it('accepts a plain generated figure', () => {
    expect(sanitizeFigureSvg(ok)).toBe(ok);
  });

  it.each([
    ['script', ok.replace('</svg>', '<script>alert(1)</script></svg>')],
    ['foreignObject', ok.replace('</svg>', '<foreignObject><div/></foreignObject></svg>')],
    ['raster image', ok.replace('</svg>', '<image href="x.png"/></svg>')],
    ['event handler', ok.replace('<line ', '<line onclick="x()" ')],
    ['link', ok.replace('</svg>', '<a href="https://example.com"><text>x</text></a></svg>')],
    ['external css url', ok.replace('stroke:var', 'fill:url(https://x/y.svg);stroke:var')],
    ['style element (would leak to the page)', ok.replace('</svg>', '<style>body{display:none}</style></svg>')],
    ['two roots', ok + ok],
    ['not svg', '<div>hi</div>'],
  ])('refuses %s', (_label, svg) => {
    expect(sanitizeFigureSvg(svg)).toBeNull();
  });

  it('refuses oversize figures', () => {
    const big = ok.replace('</svg>', `<desc>${'x'.repeat(MAX_FIGURE_BYTES)}</desc></svg>`);
    expect(sanitizeFigureSvg(big)).toBeNull();
  });

  it('pairs the figure with its description or drops both', () => {
    expect(questionFigure(ok, alt)).toEqual({ figureSvg: ok, figureAlt: alt });
    expect(questionFigure(ok, null)).toEqual({ figureSvg: null, figureAlt: null });
    expect(questionFigure(null, alt)).toEqual({ figureSvg: null, figureAlt: null });
  });
});
