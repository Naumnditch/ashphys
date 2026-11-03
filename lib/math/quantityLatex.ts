/**
 * Turns an answer-key label ("2.5e7 m/s²", "3.0 × 10⁸ N", "53.1 °") into
 * LaTeX for display: 2.5\times10^{7}\ \mathrm{m}/\mathrm{s}^{2}. Returns null
 * when the label is not a number-and-unit, so the caller shows it as text.
 */

const SUP: Record<string, string> = {
  '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁻': '-', '⁺': '+',
};

const NUMBER =
  /^([+\-−]?(?:\d+(?:\.\d*)?|\.\d+))(?:\s*[eE]\s*([+\-−]?\d+)|\s*[×xX*]\s*10\s*(?:\^\s*\{?\s*([+\-−]?\d+)\s*\}?|([⁻⁺]?[⁰¹²³⁴⁵⁶⁷⁸⁹]+)))?/;

function minus(s: string): string {
  return s.replace(/−/g, '-');
}

function unitToLatex(unit: string): string | null {
  if (!/^[A-Za-zµμΩ°%/·⋅.\s⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺^\-\d]*$/.test(unit)) return null;
  let out = '';
  const re = /([A-Za-z]+)|([µμ])|(Ω)|(°)|(%)|([⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺]+)|\^\s*([+\-]?\d+)|(\/)|([·⋅.])|(\s+)/g;
  let last = 0;
  for (const m of unit.matchAll(re)) {
    if (m.index !== last) return null; // something we did not expect
    last = m.index + m[0].length;
    const [, word, micro, ohm, deg, pct, sup, caret, slash, dot, space] = m;
    if (word) out += `\\mathrm{${word}}`;
    else if (micro) out += '\\mu ';
    else if (ohm) out += '\\Omega ';
    else if (deg) out += '^{\\circ}';
    else if (pct) out += '\\%';
    else if (sup) out += `^{${[...sup].map((c) => SUP[c]).join('')}}`;
    else if (caret) out += `^{${caret}}`;
    else if (slash) out += '/';
    else if (dot) out += '\\cdot ';
    else if (space) out += '\\,';
  }
  if (last !== unit.length) return null;
  return out;
}

export function quantityToLatex(label: string): string | null {
  const text = String(label ?? '').trim();
  if (!text) return null;
  const m = NUMBER.exec(text);
  if (!m) return null;
  const [whole, mantissa, eExp, caretExp, supExp] = m;
  let num = minus(mantissa);
  const exponent = eExp ?? caretExp ?? (supExp ? [...supExp].map((c) => SUP[c]).join('') : undefined);
  if (exponent !== undefined) num += `\\times10^{${minus(exponent).replace(/^\+/, '')}}`;
  const rest = text.slice(whole.length).trim();
  if (!rest) return num;
  const unit = unitToLatex(rest);
  if (unit === null) return null;
  // Degrees and percent sit right against the number.
  return /^(\^\{\\circ\}|\\%)/.test(unit) ? `${num}${unit}` : `${num}\\ ${unit}`;
}
