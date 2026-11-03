/**
 * A tiny arithmetic reader for the numbers at the start of an answer, so
 * "(1)/(2)", "sqrt(2)*3", "2pi" and "(27)^(1/(3))" can be graded.
 *
 * It is a hand-written recursive-descent parser over a fixed grammar — it
 * NEVER calls eval/Function and knows no names except pi and sqrt:
 *
 *   expr    := term                      (no binary + or -: see expr())
 *   term    := unary (('*' | '/' | 'x' | '÷') unary | implicit)*
 *   unary   := ('+' | '-') unary | power
 *   power   := primary ('^' unary)?
 *   primary := number | '(' expr ')' | 'pi' | 'π' | ('sqrt' | '√') primary
 *
 * "x" only multiplies when a number follows it (3 x 10^8), and implicit
 * multiplication only applies before '(', pi or sqrt (2pi, 3(4)), so a unit
 * after the number ("5 m/s", "3 e") is never read as part of the expression.
 */

export interface PrefixValue {
  value: number;
  /** How many characters of the input the expression used. */
  length: number;
  /** How many operators/functions it used (0 = it was a bare number). */
  operations: number;
}

const NUMBER = /^(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?/;
const MAX_DEPTH = 32;

class Parser {
  pos = 0;
  ops = 0;
  depth = 0;
  /** The last number read was written in e-notation. */
  eNumber = false;
  constructor(readonly s: string) {}

  private ws() {
    while (this.pos < this.s.length && this.s[this.pos] === ' ') this.pos++;
  }

  private peekAfterWs(): string {
    let p = this.pos;
    while (p < this.s.length && this.s[p] === ' ') p++;
    return this.s.slice(p);
  }

  private startsOperand(rest: string): boolean {
    return /^(?:[\d.(√]|pi(?![A-Za-z])|π|sqrt\s*\()/.test(rest);
  }

  /**
   * Sums and differences are deliberately not read: "8+6" is working, not an
   * answer, and "3.3 x 10 -6" is a mistyped power, not 33 - 6.
   */
  expr(): number | null {
    if (++this.depth > MAX_DEPTH) return null;
    const value = this.term();
    this.depth--;
    return value;
  }

  private term(): number | null {
    let left = this.unary();
    if (left === null) return null;
    for (;;) {
      const save = this.pos;
      this.ws();
      const ch = this.s[this.pos];
      let op: '*' | '/' | null = null;
      if (ch === '*' || ch === '×' || ch === '·') op = '*';
      else if (ch === '/' || ch === '÷') op = '/';
      else if ((ch === 'x' || ch === 'X') && this.startsOperand(this.s.slice(this.pos + 1).trimStart())) op = '*';
      if (op) {
        this.pos++;
        const right = this.unary();
        if (right === null) {
          this.pos = save;
          break;
        }
        this.ops++;
        left = op === '*' ? left * right : left / right;
        continue;
      }
      // Implicit multiplication: 2pi, 3(4), 2sqrt(3). Only with no space before
      // a bracket, so "5 (approx)" is not swallowed.
      this.pos = save;
      const rest = this.s.slice(this.pos);
      if (/^(?:\(|π|pi(?![A-Za-z])|sqrt\s*\(|√)/.test(rest)) {
        const right = this.unary();
        if (right === null) {
          this.pos = save;
          break;
        }
        this.ops++;
        left = left * right;
        continue;
      }
      break;
    }
    return left;
  }

  private unary(): number | null {
    this.ws();
    const ch = this.s[this.pos];
    if (ch === '-' || ch === '+') {
      const save = this.pos;
      this.pos++;
      const v = this.unary();
      if (v === null) {
        this.pos = save;
        return null;
      }
      return ch === '-' ? -v : v;
    }
    return this.power();
  }

  private power(): number | null {
    const base = this.primary();
    if (base === null) return null;
    const save = this.pos;
    this.ws();
    if (this.s[this.pos] === '^' && !this.eNumber) {
      this.pos++;
      if (++this.depth > MAX_DEPTH) return null;
      const exponent = this.unary();
      this.depth--;
      if (exponent === null) {
        this.pos = save;
        return base;
      }
      this.ops++;
      return Math.pow(base, exponent);
    }
    this.pos = save;
    return base;
  }

  private primary(): number | null {
    this.ws();
    const rest = this.s.slice(this.pos);
    const num = NUMBER.exec(rest);
    if (num) {
      this.pos += num[0].length;
      // 3.0e10^8 is a garbled power: do not raise an e-number to a power.
      this.eNumber = /[eE]/.test(num[0]);
      return Number(num[0]);
    }
    this.eNumber = false;
    if (rest[0] === '(') {
      const save = this.pos;
      this.pos++;
      const inner = this.expr();
      this.ws();
      if (inner === null || this.s[this.pos] !== ')') {
        this.pos = save;
        return null;
      }
      this.pos++;
      this.ops++;
      return inner;
    }
    const constant = /^(?:pi(?![A-Za-z])|π)/.exec(rest);
    if (constant) {
      this.pos += constant[0].length;
      this.ops++;
      return Math.PI;
    }
    const root = /^(?:sqrt|√)/.exec(rest);
    if (root) {
      const save = this.pos;
      this.pos += root[0].length;
      if (++this.depth > MAX_DEPTH) return null;
      const v = this.power();
      this.depth--;
      if (v === null) {
        this.pos = save;
        return null;
      }
      this.ops++;
      return Math.sqrt(v);
    }
    return null;
  }
}

/**
 * Reads the longest arithmetic expression at the start of `input`. Returns
 * null when it does not start with one or the result is not a finite number.
 */
export function evaluatePrefix(input: string): PrefixValue | null {
  if (input.length > 400) return null;
  const parser = new Parser(input);
  const value = parser.expr();
  if (value === null || !Number.isFinite(value)) return null;
  return { value, length: parser.pos, operations: parser.ops };
}
