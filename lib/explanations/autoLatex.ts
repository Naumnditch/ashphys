/**
 * Finds the equations in a plain-text explanation ("v = 2πr/T = (2π × 50) ÷ 9.0
 * = 34.9 m/s") and converts each one to LaTeX, leaving the prose untouched.
 * Pure string processing: no AI, no network, nothing stored. The practice page
 * typesets the result with KaTeX; anything KaTeX cannot parse is shown as the
 * original text.
 */

export type Segment = { math: false; text: string } | { math: true; latex: string; source: string };

const GREEK: Record<string, string> = {
  α: '\\alpha', β: '\\beta', γ: '\\gamma', δ: '\\delta', ε: '\\varepsilon', ζ: '\\zeta', η: '\\eta', θ: '\\theta',
  ι: '\\iota', κ: '\\kappa', λ: '\\lambda', μ: '\\mu', µ: '\\mu', ν: '\\nu', ξ: '\\xi', π: '\\pi', ρ: '\\rho',
  σ: '\\sigma', τ: '\\tau', φ: '\\phi', ϕ: '\\phi', χ: '\\chi', ψ: '\\psi', ω: '\\omega',
  Γ: '\\Gamma', Δ: '\\Delta', Θ: '\\Theta', Λ: '\\Lambda', Σ: '\\Sigma', Φ: '\\Phi', Ψ: '\\Psi', Ω: '\\Omega',
};
const SUP: Record<string, string> = {
  '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁻': '-', '⁺': '+', 'ⁿ': 'n',
};
const SUB: Record<string, string> = {
  '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9', '₊': '+', '₋': '-',
  'ₐ': 'a', 'ₑ': 'e', 'ₒ': 'o', 'ₓ': 'x', 'ₚ': 'p', 'ᵢ': 'i', 'ⱼ': 'j', 'ₖ': 'k', 'ₙ': 'n', 'ₘ': 'm', 'ₜ': 't', 'ₛ': 's',
};
const SYMBOLS: Record<string, string> = {
  '×': '\\times ', '÷': '\\div ', '−': '-', '–': '-', '·': '\\cdot ', '≈': '\\approx ', '≠': '\\neq ', '≤': '\\le ', '≥': '\\ge ',
  '→': '\\to ', '∝': '\\propto ', '±': '\\pm ', '∞': '\\infty ', '½': '{\\tfrac{1}{2}}', '⅓': '{\\tfrac{1}{3}}', '¼': '{\\tfrac{1}{4}}',
  '¾': '{\\tfrac{3}{4}}', '⅔': '{\\tfrac{2}{3}}', '°': '^{\\circ}', '%': '\\%', '…': '\\ldots ', '′': "'",
};
const SUP_RE = /[⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺ⁿ]+/g;
const SUB_RE = /[₀-₉₊₋ₐₑₒₓₚᵢⱼₖₙₘₜₛ]+/g;

const OP_CHARS = /[=×÷+−·≈≠≤≥→∝±√^<>*]/;
const STRONG = /[=×÷+−·≈≠≤≥→∝±√^⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺₀-₉α-ωΑ-Ωµ½⅓¼¾⅔]|\d\s*\/|\/\s*\d|[A-Za-z)]\/[A-Za-z(]/;

const STOPWORDS = new Set([
  'so', 'is', 'to', 'of', 'in', 'at', 'on', 'if', 'as', 'an', 'or', 'by', 'up', 'be', 'we', 'he', 'it', 'do', 'go', 'no', 'my', 'me',
  'us', 'am', 'a', 'i',
]);

// SI units and the prefixes used with them, for "after a number" detection.
const UNIT_ATOMS = new Set([
  'm', 's', 'g', 'kg', 'N', 'J', 'W', 'V', 'A', 'Ω', 'T', 'Hz', 'Pa', 'C', 'K', 'eV', 'mol', 'rad', 'h', 'min', 'L', 'F', 'Wb', 'Bq', 'Sv', 'Gy',
  'cm', 'mm', 'km', 'nm', 'μm', 'µm', 'pm', 'fm', 'ms', 'μs', 'µs', 'ns', 'kN', 'MN', 'kJ', 'MJ', 'GJ', 'kW', 'MW', 'GW', 'mW', 'kV', 'mV',
  'MV', 'mA', 'μA', 'µA', 'kΩ', 'MΩ', 'kHz', 'MHz', 'GHz', 'kPa', 'MPa', 'GPa', 'nC', 'μC', 'µC', 'mC', 'pC', 'μF', 'µF', 'nF', 'pF', 'mF',
  'MeV', 'keV', 'GeV', 'mT', 'μT', 'µT', 'u', 'yr', 'day', 'days', 'dB', 'kWh', 'g',
]);

function isUnitToken(tok: string): boolean {
  const parts = tok
    .replace(SUP_RE, '')
    .replace(/°C|°/g, ' ')
    .split(/[\/·\s]+/)
    .filter(Boolean);
  return tok.length > 0 && (tok === '°C' || (parts.length > 0 && parts.every((p) => UNIT_ATOMS.has(p))));
}

type Kind = 'op' | 'fn' | 'num' | 'var' | 'unit' | 'word';

const LABEL_RE = /^\([a-z]{1,3}\)$|^\((?:i|ii|iii|iv|v)\)$/;
const NUMERIC = /^[-−+]?\(?\d[\d.,]*\)?$/;

function classify(core: string, prev: Kind | null, afterNumber = false): Kind {
  if (!core) return 'word';
  if (LABEL_RE.test(core)) return 'word';
  if (/[“”"‘’'!?]/.test(core.replace(/^′|′$/g, ''))) return 'word';
  if (/^[=×÷+−·≈≠≤≥→∝±*<>/-]$/.test(core)) return 'op';
  if (/^(?:sin|cos|tan|ln|lg|log)$/.test(core)) return 'fn';
  if (NUMERIC.test(core)) return 'num';
  if (prev === 'num' || prev === 'unit' || afterNumber) {
    if (isUnitToken(core)) return 'unit';
  }
  if (/[a-zA-Z]{3,}/.test(core.replace(/\b(?:sin|cos|tan|ln|lg|log|max|min)\b|sin|cos|tan/g, ''))) {
    // A real word, unless it carries maths (s=ut+½at² is caught by STRONG).
    return STRONG.test(core) && !/[a-zA-Z]{4,}/.test(core.replace(/sin|cos|tan|max|min/g, '')) ? 'var' : 'word';
  }
  if (STRONG.test(core) || /\d/.test(core) || /[_|]/.test(core)) return 'var';
  if (/^\(?[A-Za-z]\)?$/.test(core)) return 'var';
  if (/^[A-Za-z]{2}$/.test(core) && !STOPWORDS.has(core.toLowerCase())) return 'var';
  return 'word';
}

function unitLatex(t: string): string {
  return t.replace(/(°C)|([A-Za-z]+)|([Ωµμ])|([⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺]+)|(°)/g, (_m, degC, word, greek, sup, deg) => {
    if (degC) return '{}^{\\circ}\\text{C}';
    if (word) return `\\text{${word}}`;
    if (greek) return greek === 'Ω' ? '\\Omega' : '\\mu';
    if (sup) return `^{${[...sup].map((c: string) => SUP[c]).join('')}}`;
    if (deg) return '^{\\circ}';
    return _m;
  });
}

/** Convert one run of maths from Unicode text to LaTeX. Tokens listed in unitTokens are units. */
export function toLatex(src: string, unitTokens: Set<number> = new Set()): string {
  const units: string[] = [];
  let i = -1;
  const marked = src
    .split(/(\s+)/)
    .map((t) => {
      if (/^\s+$/.test(t) || t === '') return t;
      i++;
      if (!unitTokens.has(i)) return t;
      units.push(unitLatex(t));
      return `\u0001${units.length - 1}\u0002`;
    })
    .join('');
  return convertExpr(marked)
    .replace(/\s*\u0001(\d+)\u0002/g, (_m, n) => `\\ ${units[Number(n)]}`)
    .replace(/\s+/g, ' ')
    .trim();
}

function convertExpr(t: string): string {
  let s = t;
  // √( … ) and √x
  s = replaceSqrt(s);
  // functions
  s = s.replace(/(?<![A-Za-z\\])(sin|cos|tan|ln|lg|log)(?![a-z])/g, '\\$1 ');
  // a_b subscripts written with an underscore
  s = s.replace(/_([A-Za-z]{2,})/g, '_{\\text{$1}}').replace(/_([A-Za-z0-9])/g, '_{$1}');
  s = s.replace(SUP_RE, (m) => `^{${[...m].map((c) => SUP[c]).join('')}}`);
  s = s.replace(SUB_RE, (m) => `_{${[...m].map((c) => SUB[c]).join('')}}`);
  s = s.replace(/[α-ωΑ-Ωµϕ]/g, (c) => `${GREEK[c] ?? c} `);
  s = s.replace(/([A-Za-z])½/g, '$1_{1/2}');
  s = s.replace(/[×÷−–·≈≠≤≥→∝±∞½⅓¼¾⅔°%…′]/g, (c) => SYMBOLS[c]);
  s = s.replace(/\*/g, '\\times ');
  // "x^{2}" after a closing brace of a function argument is fine; tidy "\theta ^" spacing.
  s = s.replace(/ (?=[\^_])/g, '');
  return s;
}

function replaceSqrt(s: string): string {
  let out = '';
  for (let i = 0; i < s.length; i++) {
    if (s[i] !== '√') {
      out += s[i];
      continue;
    }
    if (s[i + 1] === '(') {
      let depth = 0;
      let j = i + 1;
      for (; j < s.length; j++) {
        if (s[j] === '(') depth++;
        else if (s[j] === ')' && --depth === 0) break;
      }
      if (j < s.length) {
        out += `\\sqrt{${replaceSqrt(s.slice(i + 2, j))}}`;
        i = j;
        continue;
      }
      out += '\\sqrt ';
      continue;
    }
    const m = /^[A-Za-z0-9.α-ωΑ-Ω²³]+/.exec(s.slice(i + 1));
    if (m) {
      out += `\\sqrt{${m[0]}}`;
      i += m[0].length;
    } else out += '\\sqrt ';
  }
  return out;
}

interface Tok {
  raw: string; // as written, including any punctuation we split off
  lead: string; // punctuation before the maths
  core: string;
  trail: string; // punctuation after the maths
  kind: Kind;
}

function balance(s: string): number {
  let d = 0;
  for (const c of s) {
    if (c === '(') d++;
    else if (c === ')') d--;
  }
  return d;
}

/**
 * Splits text into prose and maths segments. Runs of maths must contain an
 * operator, Greek letter, power or root, so plain numbers ("24.0, 31.5") stay prose.
 */
export function segmentMath(text: string): Segment[] {
  try {
    const segments = segment(text);
    // Safety net: the pieces must rebuild the original text exactly (ignoring
    // spacing), or nothing is converted.
    const rebuilt = segments.map((g) => (g.math ? g.source : g.text)).join('');
    if (rebuilt.replace(/\s+/g, '') === text.replace(/\s+/g, '')) return segments;
  } catch {
    // fall through
  }
  return [{ math: false, text }];
}

function segment(text: string): Segment[] {
  const pieces = text.split(/(\s+)/);
  const toks: (Tok | string)[] = [];
  let prev: Kind | null = null;
  let prevCore = '';
  for (const p of pieces) {
    if (p === '' ) continue;
    if (/^\s+$/.test(p)) {
      toks.push(p);
      continue;
    }
    const m = /^([“"‘'[]*)(.*?)([.,;:!?”"’'\]]*)$/.exec(p)!;
    const lead = m[1];
    const core = m[2];
    const trail = m[3];
    // A final "." on a number is a full stop ("75.0 m." / "= 0.54."), never a decimal point.
    const kind = classify(core, prev, /[\d⁰¹²³⁴⁵⁶⁷⁸⁹]$/.test(prevCore));
    toks.push({ raw: p, lead, core, trail, kind });
    prev = kind === 'word' ? null : kind;
    prevCore = kind === 'word' ? '' : core;
  }

  const segments: Segment[] = [];
  const pushText = (t: string) => {
    if (!t) return;
    const last = segments[segments.length - 1];
    if (last && !last.math) last.text += t;
    else segments.push({ math: false, text: t });
  };

  let k = 0;
  while (k < toks.length) {
    const t = toks[k];
    if (typeof t === 'string' || t.kind === 'word') {
      pushText(typeof t === 'string' ? t : t.raw);
      k++;
      continue;
    }
    // Collect a run: math tokens separated by single spaces. Leading punctuation
    // may start it, trailing punctuation ends it.
    const run: Tok[] = [{ ...t }];
    let depth = balance(t.core);
    // A comma inside open brackets is part of the maths: "(−8.00, 8.00)".
    const absorbComma = (x: Tok) => {
      if (depth > 0 && x.trail === ',') {
        x.core += ',';
        x.trail = '';
      }
    };
    absorbComma(run[0]);
    let j = k + 1;
    if (!run[0].trail) {
      while (j + 1 < toks.length) {
        const sp = toks[j];
        const nx = toks[j + 1];
        if (typeof sp !== 'string' || typeof nx === 'string' || nx.kind === 'word' || nx.lead) break;
        const copy = { ...nx };
        depth += balance(copy.core);
        absorbComma(copy);
        run.push(copy);
        j += 2;
        if (copy.trail) break;
      }
    }

    // Trim edges that are only prose-like letters or dangling operators.
    let a = 0;
    let b = run.length - 1;
    const letterOnly = (x: Tok) => x.kind === 'var' && /^[A-Za-z]{1,2}$/.test(x.core);
    const joins = (x: Tok | undefined) => !!x && (x.kind === 'op' || x.kind === 'fn');
    while (a <= b) {
      const x = run[a];
      if (x.kind === 'op' || (letterOnly(x) && !joins(run[a + 1])) || (x.kind === 'fn' && a === b)) a++;
      else break;
    }
    while (b >= a) {
      const x = run[b];
      if (x.kind === 'op' || x.kind === 'fn' || (letterOnly(x) && !joins(run[b - 1]))) b--;
      else break;
    }
    const inner = run.slice(a, b + 1).map((x) => ({ ...x }));
    // Brackets opened or closed in the prose stay in the prose: "(giving 1.10 × 10⁻⁷ C), or".
    if (inner.length) {
      let bal = balance(inner.map((x) => x.core).join(''));
      const lastT = inner[inner.length - 1];
      while (bal < 0 && lastT.core.endsWith(')')) {
        lastT.core = lastT.core.slice(0, -1);
        lastT.trail = ')' + lastT.trail;
        bal++;
      }
      const firstT = inner[0];
      while (bal > 0 && firstT.core.startsWith('(')) {
        firstT.core = firstT.core.slice(1);
        firstT.lead += '(';
        bal--;
      }
      if (bal !== 0) inner.length = 0; // unbalanced in the middle: leave as text
    }
    const joined = inner.map((x) => x.core).join(' ');
    const accept = inner.length > 0 && inner.every((x) => x.core) && (inner.some((x) => STRONG.test(x.core)) || inner.some((x) => OP_CHARS.test(x.core)));

    // Emit: prose before, the maths, prose after.
    const rawSpan = (from: number, to: number) => {
      // original text for run[from..to], with spaces
      let s = '';
      for (let q = from; q <= to; q++) s += (q > from ? ' ' : '') + run[q].raw;
      return s;
    };
    if (!accept) {
      // Re-emit the whole run as prose, keeping original spacing.
      for (let q = k; q < j; q++) {
        const x = toks[q];
        pushText(typeof x === 'string' ? x : x.raw);
      }
      k = j;
      continue;
    }
    if (a > 0) pushText(rawSpan(0, a - 1) + ' ');
    const first = inner[0];
    const last = inner[inner.length - 1];
    pushText(first.lead);
    const unitIdx = new Set<number>();
    inner.forEach((x, q) => x.kind === 'unit' && unitIdx.add(q));
    segments.push({ math: true, latex: toLatex(joined, unitIdx), source: joined });
    pushText(last.trail);
    if (b < run.length - 1) pushText(' ' + rawSpan(b + 1, run.length - 1));
    k = j;
  }
  return segments;
}
