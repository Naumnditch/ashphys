/**
 * Server-side checks on a submitted answer before it is graded or stored.
 * Answers are only ever parsed (lib/math/latexToGradable.ts,
 * lib/math/safeEvaluate.ts) — never evaluated as code — but the API still
 * refuses anything that is not plausibly an answer: too long, characters
 * outside maths/units, or LaTeX commands the maths keyboard cannot produce.
 */

export const MAX_ANSWER_LENGTH = 200;

/**
 * Letters, digits, whitespace, ASCII maths punctuation and the maths/unit
 * symbols students type or paste (× ÷ − ± ≤ ≥ ° µ Ω, Greek, super/subscripts).
 * \s already covers no-break and thin spaces pasted from PDFs. Arabic-Indic
 * digits (٠١٢…٩, and ٫ as the decimal point) are allowed: the grader reads them.
 */
const ALLOWED_CHARS =
  /^[A-Za-z0-9\s.,;:!?'’"+\-*/=<>()[\]{}^_|\\%$~°×÷·⋅−–—±≤≥≈≠∞√∝→µμΩΑ-Ωα-ωϕϑ⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻ⁿ₀₁₂₃₄₅₆₇₈₉₊₋½⅓¼¾⅔′″…٠-٩۰-۹٫]*$/;

/** Every LaTeX command the answer box (MathLive) can emit for a physics answer. */
const ALLOWED_COMMANDS = new Set([
  // structure
  'frac', 'dfrac', 'tfrac', 'cfrac', 'sqrt', 'placeholder', 'left', 'right', 'bigl', 'bigr', 'Bigl', 'Bigr',
  'displaystyle', 'textstyle',
  // text and fonts (units)
  'text', 'textrm', 'textit', 'textbf', 'textnormal', 'mathrm', 'mathit', 'mathbf', 'mathsf', 'mathtt', 'mathnormal',
  'operatorname', 'mbox', 'boldsymbol', 'bm', 'mathbb', 'mathcal',
  // decorations
  'vec', 'overrightarrow', 'hat', 'bar', 'overline', 'underline', 'dot', 'ddot', 'tilde', 'widehat', 'boxed',
  // operators and relations
  'times', 'cdot', 'ast', 'div', 'pm', 'mp', 'le', 'leq', 'ge', 'geq', 'lt', 'gt', 'ne', 'neq', 'approx', 'equiv',
  'propto', 'to', 'rightarrow', 'degree', 'circ', 'infty', 'prime', 'ldots', 'cdots', 'dots',
  'lbrace', 'rbrace', 'lbrack', 'rbrack', 'langle', 'rangle', 'vert', 'lvert', 'rvert', 'exponentialE', 'imaginaryI',
  // functions
  'sin', 'cos', 'tan', 'arcsin', 'arccos', 'arctan', 'sinh', 'cosh', 'tanh', 'ln', 'log', 'lg', 'exp',
  // spacing
  'quad', 'qquad', 'enspace', 'thinspace', 'medspace', 'thickspace', 'negthinspace',
  // Greek
  'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'varepsilon', 'zeta', 'eta', 'theta', 'vartheta', 'iota', 'kappa',
  'lambda', 'mu', 'nu', 'xi', 'pi', 'varpi', 'rho', 'varrho', 'sigma', 'varsigma', 'tau', 'upsilon', 'phi', 'varphi',
  'chi', 'psi', 'omega', 'Gamma', 'Delta', 'Theta', 'Lambda', 'Xi', 'Pi', 'Sigma', 'Upsilon', 'Phi', 'Psi', 'Omega',
]);

/** One-character commands: \, \; \: \! \  \% \{ \}, and the \[ \] \( \) maths delimiters people paste. */
const ALLOWED_SYMBOL_COMMANDS = new Set([',', ';', ':', '!', ' ', '%', '{', '}', '>', '[', ']', '(', ')']);

const MAX_BRACE_DEPTH = 12;

export type AnswerValidation = { ok: true; answer: string } | { ok: false; error: string };

export function validateAnswer(input: unknown): AnswerValidation {
  if (typeof input !== 'string' && typeof input !== 'number') {
    return { ok: false, error: 'Missing answer' };
  }
  const answer = String(input).trim();
  if (!answer) return { ok: false, error: 'Missing answer' };
  if (answer.length > MAX_ANSWER_LENGTH) {
    return { ok: false, error: `That answer is too long — keep it under ${MAX_ANSWER_LENGTH} characters.` };
  }
  if (!ALLOWED_CHARS.test(answer)) {
    return { ok: false, error: 'That answer has a character I can’t read. Use numbers, letters, units and maths symbols only.' };
  }

  // Commands: \name or \<symbol>
  const commands = answer.matchAll(/\\([A-Za-z]+|[^A-Za-z])/g);
  for (const [, name] of commands) {
    const known = /^[A-Za-z]/.test(name) ? ALLOWED_COMMANDS.has(name) : ALLOWED_SYMBOL_COMMANDS.has(name);
    if (!known) {
      return { ok: false, error: `That answer uses "\\${name}", which I can’t grade. Type just the number and unit.` };
    }
  }

  // Braces must balance and not nest absurdly deep.
  let depth = 0;
  for (let i = 0; i < answer.length; i++) {
    const ch = answer[i];
    if (ch === '\\') {
      i++; // \{ and \} are literal braces
      continue;
    }
    if (ch === '{') depth++;
    else if (ch === '}') depth--;
    if (depth < 0 || depth > MAX_BRACE_DEPTH) {
      return { ok: false, error: 'That answer’s brackets don’t match up. Clear it and type it again.' };
    }
  }
  if (depth !== 0) return { ok: false, error: 'That answer’s brackets don’t match up. Clear it and type it again.' };

  return { ok: true, answer };
}
