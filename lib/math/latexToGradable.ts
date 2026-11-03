/**
 * Turns the LaTeX a MathLive answer box produces into a plain linear form
 * the grader (lib/grading/numericAnswer.ts) and a human can both read:
 *
 *   3\times10^{8}      → 3*10^8
 *   \frac{1}{2}        → (1)/(2)
 *   \sqrt{x}           → sqrt(x)
 *   \sqrt[3]{x}        → (x)^(1/(3))
 *   x^{2}              → x^2
 *   \pi                → pi
 *   5\,\mathrm{m\,s^{-1}} → 5 m s^-1
 *
 * Pure string processing: nothing is ever evaluated here. Input that is not
 * LaTeX at all ("3.0e8", "1.8 x 10^10") comes back unchanged apart from
 * whitespace, so the old plain-text answers grade exactly as before.
 */

/** Greek letters spelled out in the linear form. µ and Ω keep their symbols so units (µC, kΩ) still resolve. */
const GREEK_NAMES = new Set([
  'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'varepsilon', 'zeta', 'eta', 'theta', 'vartheta', 'iota', 'kappa',
  'lambda', 'nu', 'xi', 'pi', 'varpi', 'rho', 'varrho', 'sigma', 'varsigma', 'tau', 'upsilon', 'phi', 'varphi', 'chi',
  'psi', 'omega', 'Gamma', 'Delta', 'Theta', 'Lambda', 'Xi', 'Pi', 'Sigma', 'Upsilon', 'Phi', 'Psi',
]);

const FUNCTIONS = new Set(['sin', 'cos', 'tan', 'arcsin', 'arccos', 'arctan', 'sinh', 'cosh', 'tanh', 'ln', 'log', 'lg', 'exp']);

/** Commands that map straight to a piece of linear text. */
const SIMPLE: Record<string, string> = {
  times: '*',
  cdot: '*',
  ast: '*',
  div: '/',
  pm: '+-',
  mp: '-+',
  le: '<=',
  leq: '<=',
  ge: '>=',
  geq: '>=',
  lt: '<',
  gt: '>',
  ne: '!=',
  neq: '!=',
  approx: '~=',
  equiv: '==',
  degree: '°',
  circ: '°',
  mu: 'µ',
  Omega: 'Ω',
  infty: 'inf',
  ldots: '...',
  cdots: '...',
  dots: '...',
  prime: "'",
  '%': '%',
  '{': '(',
  '}': ')',
  lbrace: '(',
  rbrace: ')',
  lbrack: '[',
  rbrack: ']',
  langle: '<',
  rangle: '>',
  vert: '|',
  lvert: '|',
  rvert: '|',
  exponentialE: 'e',
  imaginaryI: 'i',
  to: '->',
  rightarrow: '->',
  propto: '~',
  ',': ' ',
  // \[ \] and \( \) are maths delimiters, not brackets.
  '[': '',
  ']': '',
  '(': '',
  ')': '',
  ';': ' ',
  ':': ' ',
  '>': ' ',
  ' ': ' ',
  '!': '',
  quad: ' ',
  qquad: ' ',
  enspace: ' ',
  thinspace: ' ',
  medspace: ' ',
  thickspace: ' ',
  negthinspace: '',
  left: '',
  right: '',
  bigl: '',
  bigr: '',
  Bigl: '',
  Bigr: '',
  displaystyle: '',
  textstyle: '',
};

/** Commands whose single argument is shown as-is (fonts, text, decorations). */
const PASS_THROUGH = new Set([
  'text', 'textrm', 'textit', 'textbf', 'textnormal', 'mathrm', 'mathit', 'mathbf', 'mathsf', 'mathtt', 'mathnormal',
  'operatorname', 'mbox', 'boldsymbol', 'bm', 'mathbb', 'mathcal', 'vec', 'overrightarrow', 'hat', 'bar', 'overline',
  'underline', 'dot', 'ddot', 'tilde', 'widehat', 'boxed', 'color', 'textcolor',
]);

/** Text-mode commands: their argument keeps its spaces. */
const TEXT_MODE = new Set(['text', 'textrm', 'textit', 'textbf', 'textnormal', 'mbox', 'operatorname']);

/** True when the string contains LaTeX markup (a command or a brace group), not just plain text. */
export function looksLikeLatex(input: string): boolean {
  return /\\[A-Za-z,;:! %{}]|[{}]/.test(input);
}

class Reader {
  pos = 0;
  constructor(readonly src: string) {}
  get done() {
    return this.pos >= this.src.length;
  }
  peek() {
    return this.src[this.pos];
  }
  skipSpaces() {
    while (!this.done && /\s/.test(this.src[this.pos])) this.pos++;
  }
}

const MAX_DEPTH = 40;

/** Reads one "argument": a {group}, a \command, or a single character. Returns its linear form. */
function readArgument(r: Reader, depth: number, textMode: boolean): string {
  r.skipSpaces();
  if (r.done) return '';
  const ch = r.peek();
  if (ch === '{') {
    r.pos++;
    const inner = readSequence(r, depth + 1, textMode, '}');
    if (r.peek() === '}') r.pos++;
    return inner;
  }
  if (ch === '\\') return readCommand(r, depth, textMode);
  r.pos++;
  return ch;
}

/** Reads an optional [n] argument (for \sqrt[n]{x}). */
function readOptional(r: Reader, depth: number): string | null {
  r.skipSpaces();
  if (r.peek() !== '[') return null;
  r.pos++;
  const inner = readSequence(r, depth + 1, false, ']');
  if (r.peek() === ']') r.pos++;
  return inner;
}

/** An exponent or subscript needs parentheses unless it is a single number, letter or name. */
function wrapScript(inner: string): string {
  const s = inner.trim();
  if (/^[+-]?(?:\d+(?:\.\d+)?|[A-Za-zµΩ°']+)$/.test(s)) return s;
  return `(${s})`;
}

/** `before` is the output so far, so a name or unit is only spaced off where it would otherwise run into a letter or digit. */
function readCommand(r: Reader, depth: number, textMode: boolean, before = ''): string {
  r.pos++; // the backslash
  let name = '';
  if (!r.done && /[A-Za-z]/.test(r.peek())) {
    while (!r.done && /[A-Za-z]/.test(r.peek())) name += r.src[r.pos++];
  } else if (!r.done) {
    name = r.src[r.pos++];
  }
  if (!name) return '';

  if (name === 'frac' || name === 'dfrac' || name === 'tfrac' || name === 'cfrac') {
    const num = readArgument(r, depth, false).trim();
    const den = readArgument(r, depth, false).trim();
    return `(${num})/(${den})`;
  }
  if (name === 'sqrt') {
    const index = readOptional(r, depth);
    const radicand = readArgument(r, depth, false).trim();
    if (index !== null && index.trim() && index.trim() !== '2') return `(${radicand})^(1/(${index.trim()}))`;
    return `sqrt(${radicand})`;
  }
  if (name === 'placeholder') {
    readOptional(r, depth);
    readArgument(r, depth, false);
    return '';
  }
  if (name === 'textcolor' || name === 'color') {
    readArgument(r, depth, true); // the colour name is not part of the answer
    return name === 'textcolor' ? readArgument(r, depth, textMode) : '';
  }
  if (PASS_THROUGH.has(name)) {
    const inner = readArgument(r, depth, TEXT_MODE.has(name));
    if (TEXT_MODE.has(name)) return ` ${inner} `;
    // A unit straight after a number gets a space (5\mathrm{m} → 5 m); the
    // letters of one unit stay together (\mathrm{k}\Omega → kΩ).
    return (/[\d.]$/.test(before) ? ' ' : '') + inner;
  }
  if (name in SIMPLE) return SIMPLE[name];
  // 2\pi → 2pi, but \Delta x → Delta x and m\lambda → m lambda.
  if (GREEK_NAMES.has(name) || FUNCTIONS.has(name)) return (/[A-Za-z]$/.test(before) ? ' ' : '') + name + ' ';
  // Anything else: keep its name so nothing silently vanishes (the API
  // validator rejects commands it does not know before grading).
  return ` ${name} `;
}

function readSequence(r: Reader, depth: number, textMode: boolean, until?: string): string {
  if (depth > MAX_DEPTH) {
    // Pathologically nested input: give up on structure, keep the characters.
    const rest = r.src.slice(r.pos);
    r.pos = r.src.length;
    return rest.replace(/[\\{}]/g, ' ');
  }
  let out = '';
  while (!r.done) {
    const ch = r.peek();
    if (until && ch === until) break;
    if (ch === '}' && until !== '}') {
      // Stray closing brace: drop it.
      r.pos++;
      continue;
    }
    if (ch === '\\') {
      out += readCommand(r, depth, textMode, out);
      continue;
    }
    if (ch === '{') {
      out += readArgument(r, depth, textMode);
      continue;
    }
    if (ch === '^' || ch === '_') {
      r.pos++;
      const arg = readArgument(r, depth, false);
      // x^{\circ} is a degree sign, not a power.
      if (ch === '^' && arg.trim() === '°') {
        out = out.replace(/\s+$/, '') + '°';
        continue;
      }
      out = out.replace(/\s+$/, '') + ch + wrapScript(arg);
      continue;
    }
    if (ch === '~') {
      out += ' ';
      r.pos++;
      continue;
    }
    if (/\s/.test(ch)) {
      // Spaces are insignificant in math mode; in text they separate words.
      out += textMode ? ' ' : '';
      r.pos++;
      continue;
    }
    out += ch;
    r.pos++;
  }
  return out;
}

/** Collapses whitespace and tidies the spacing the conversion introduced. */
function tidy(s: string): string {
  return s
    .replace(/\$/g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s+([\^_)\]°,])/g, '$1')
    .replace(/([(\[])\s+/g, '$1')
    .replace(/\s*([*/=])\s*/g, '$1')
    .trim();
}

/**
 * Converts a MathLive LaTeX answer to the plain linear form the grader reads.
 * Plain-text input is returned with only its whitespace normalized.
 */
export function latexToGradable(latex: string): string {
  const src = String(latex ?? '');
  if (!looksLikeLatex(src)) return src.replace(/\s+/g, ' ').trim();
  const r = new Reader(src.replace(/\$\$?/g, ''));
  return tidy(readSequence(r, 0, false));
}

/**
 * A comparison key for text answers: case, spacing, braces and the different
 * ways of writing multiply and power are all folded, so "x^{2}", "x^2",
 * "x**2" and "X ^ 2" match, as do "3×10^8", "3x10^8" and "3*10^8".
 */
export function normalizeForComparison(answer: string): string {
  return latexToGradable(answer)
    .replace(/\*\*/g, '^')
    .replace(/[×✕·⋅]/g, '*')
    .replace(/(\d)\s*[xX]\s*(?=\d)/g, '$1*')
    .replace(/[−–—]/g, '-')
    .replace(/[{}]/g, '')
    .replace(/\s+/g, '')
    .toLowerCase();
}
