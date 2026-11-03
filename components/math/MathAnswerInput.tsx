'use client';

/**
 * The answer box students type maths into: a MathLive <math-field> that
 * behaves like writing on paper (and like the Desmos keyboard).
 *
 *   ^        superscript — → (right arrow) leaves the exponent
 *   /        fraction
 *   _        subscript
 *   sqrt     √ template, nthroot / root for ⁿ√
 *   pi theta Delta lambda omega mu rho   Greek letters
 *   +-  *  divide  <=  >=  deg   ± × ÷ ≤ ≥ °
 *   "        text mode (words)
 *
 * The value is LaTeX ("3\times10^{8}"); the grader reads it through
 * lib/math/latexToGradable.ts. MathLive needs the DOM, so it is imported
 * only in the browser, after mount. Until it is ready (or if it ever fails
 * to load) a plain text input stands in, and anything typed there is graded
 * the same way.
 *
 * On touch devices MathLive's on-screen keyboard opens on focus; elsewhere
 * the ⌨ button opens it. While it is open its height is published as the CSS
 * variable --math-kbd-h on <html> (the practice page shrinks by that much)
 * and the field is scrolled to sit just above it, so the keyboard never sits
 * on top of the question.
 */

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { MathfieldElement } from 'mathlive';

export interface MathAnswerInputProps {
  /** LaTeX (or plain text) — the raw value, stored as typed. */
  value: string;
  onChange: (latex: string) => void;
  /** Called on Enter (physical keyboard or the on-screen ⏎ key). */
  onSubmit?: () => void;
  disabled?: boolean;
  placeholder?: string;
  'aria-label': string;
  /** Red border after a wrong answer. */
  invalid?: boolean;
  /** Compact size and no helper toolbar, for small inline fields (simulations). */
  compact?: boolean;
  className?: string;
  /** Extra attributes for tests and the feedback shake. */
  id?: string;
}

type MathLiveModule = typeof import('mathlive');

let mathLivePromise: Promise<MathLiveModule> | null = null;

/** Loads MathLive once per page and applies the site-wide settings. */
function loadMathLive(): Promise<MathLiveModule> {
  if (!mathLivePromise) {
    mathLivePromise = import('mathlive').then((ml) => {
      // Self-hosted fonts (public/mathlive/fonts); no keyclick sounds — the
      // practice page has its own answer sounds.
      ml.MathfieldElement.fontsDirectory = '/mathlive/fonts';
      ml.MathfieldElement.soundsDirectory = null;
      ml.MathfieldElement.keypressSound = null;
      ml.MathfieldElement.plonkSound = null;
      configureKeyboard();
      return ml;
    });
    mathLivePromise.catch(() => {
      mathLivePromise = null;
    });
  }
  return mathLivePromise;
}

/** A physics layer first (powers of ten, Greek, units), then MathLive's own layers. */
function configureKeyboard() {
  const kbd = window.mathVirtualKeyboard;
  if (!kbd) return;
  kbd.layouts = [
    {
      label: 'phys',
      tooltip: 'Numbers, powers and physics symbols',
      rows: [
        [
          { latex: '7' }, { latex: '8' }, { latex: '9' }, { latex: '\\div', insert: '\\div' },
          { label: '×10ⁿ', insert: '\\times10^{#?}', class: 'small', tooltip: 'Times ten to the power' },
          { latex: '#@^{#?}', insert: '#@^{#?}', tooltip: 'Power' },
          { latex: '#@_{#?}', insert: '#@_{#?}', tooltip: 'Subscript' },
          { latex: '\\pi' }, { latex: '\\theta' }, { latex: '\\lambda' },
        ],
        [
          { latex: '4' }, { latex: '5' }, { latex: '6' }, { latex: '\\times', insert: '\\times' },
          { latex: '\\frac{#@}{#?}', insert: '\\frac{#@}{#?}', tooltip: 'Fraction' },
          { latex: '\\sqrt{#0}', insert: '\\sqrt{#0}', tooltip: 'Square root' },
          { latex: '\\sqrt[#?]{#0}', insert: '\\sqrt[#?]{#0}', tooltip: 'nth root' },
          { latex: '\\Delta' }, { latex: '\\omega' }, { latex: '\\mu' },
        ],
        [
          { latex: '1' }, { latex: '2' }, { latex: '3' }, { latex: '-' },
          { latex: '\\pm' }, { latex: '\\le' }, { latex: '\\ge' },
          { latex: '(', insert: '(' }, { latex: ')', insert: ')' }, { latex: '\\rho' },
        ],
        [
          { latex: '0' }, { latex: '.' }, { latex: '+' },
          { label: '°', insert: '\\degree', tooltip: 'Degrees' },
          { label: 'unit', insert: '\\mathrm{#?}', class: 'small', tooltip: 'Upright unit, e.g. m s⁻¹' },
          '[left]', '[right]', '[backspace]', { label: '[return]', width: 2 },
        ],
      ],
    },
    'numeric',
    'alphabetic',
    'greek',
  ];
  // The edit toolbar (undo/redo/cut/copy/paste) stays; it costs no height.
}

/** Publishes the on-screen keyboard's height so layouts can make room for it. */
function useKeyboardSpace(active: boolean, fieldRef: React.RefObject<HTMLElement>) {
  useEffect(() => {
    if (!active) return;
    const kbd = window.mathVirtualKeyboard as (Window['mathVirtualKeyboard'] & EventTarget) | undefined;
    if (!kbd) return;
    const update = () => {
      const h = kbd.visible ? Math.round(kbd.boundingRect?.height ?? 0) : 0;
      document.documentElement.style.setProperty('--math-kbd-h', `${h}px`);
      document.documentElement.toggleAttribute('data-math-kbd', h > 0);
      // Keep the field (and as much of the question above it as fits) in view.
      const field = fieldRef.current;
      if (h > 0 && field && field.matches(':focus-within')) {
        requestAnimationFrame(() => field.scrollIntoView({ block: 'nearest', behavior: 'smooth' }));
      }
    };
    kbd.addEventListener('geometrychange', update);
    kbd.addEventListener('virtual-keyboard-toggle', update);
    return () => {
      kbd.removeEventListener('geometrychange', update);
      kbd.removeEventListener('virtual-keyboard-toggle', update);
    };
  }, [active, fieldRef]);
}

const HELPERS: Array<{ label: string; title: string; latex: string }> = [
  { label: '× 10ⁿ', title: 'Insert × 10 to a power (standard form)', latex: '\\times10^{#?}' },
  { label: 'xⁿ', title: 'Power (or type ^)', latex: '#@^{#?}' },
  { label: 'a⁄b', title: 'Fraction (or type /)', latex: '\\frac{#@}{#?}' },
  { label: '√', title: 'Square root (or type sqrt)', latex: '\\sqrt{#0}' },
  { label: 'unit', title: 'Unit in upright letters, e.g. m s⁻¹', latex: '\\mathrm{#?}' },
];

export default function MathAnswerInput({
  value,
  onChange,
  onSubmit,
  disabled = false,
  placeholder = 'Your answer',
  'aria-label': ariaLabel,
  invalid = false,
  compact = false,
  className = '',
  id,
}: MathAnswerInputProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<MathfieldElement | null>(null);
  const [ready, setReady] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const hintId = useId();

  // Latest callbacks without re-binding listeners.
  const onChangeRef = useRef(onChange);
  const onSubmitRef = useRef(onSubmit);
  onChangeRef.current = onChange;
  onSubmitRef.current = onSubmit;

  // Mount the <math-field> once MathLive has loaded in the browser.
  useEffect(() => {
    let cancelled = false;
    let mf: MathfieldElement | null = null;
    loadMathLive()
      .then((ml) => {
        if (cancelled || !hostRef.current) return;
        mf = new ml.MathfieldElement();
        mf.setAttribute('aria-label', ariaLabel);
        if (!compact) mf.setAttribute('aria-describedby', hintId);
        if (id) mf.id = id;
        mf.className = 'math-answer-field';
        mf.dataset.mathAnswer = '';
        hostRef.current.appendChild(mf);
        // Settings only take effect once the element is in the document.
        mf.mathVirtualKeyboardPolicy = 'auto';
        mf.smartSuperscript = false; // x^34 stays in the exponent until →
        mf.smartFence = true;
        mf.mathModeSpace = '\\,'; // a typed space separates number and unit
        mf.menuItems = [];
        mf.inlineShortcuts = {
          ...mf.inlineShortcuts,
          '*': '\\times',
          degree: '\\degree',
          root: '\\sqrt[#?]{#?}',
          ohm: '\\Omega',
        };
        // \mathrm, not \text: a text zone gets a highlight box while focused.
        mf.placeholder = `\\mathrm{${placeholder.replace(/[\\{}]/g, '').replace(/ /g, '\\ ')}}`;
        mf.value = value;
        fieldRef.current = mf;
        setReady(true);
      })
      .catch(() => {
        // Stay on the plain text fallback.
      });
    return () => {
      cancelled = true;
      if (mf) mf.remove();
      fieldRef.current = null;
    };
    // Mount once; later prop changes are synced below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Events from the field.
  useEffect(() => {
    const mf = fieldRef.current;
    if (!ready || !mf) return;
    const onInput = (ev: Event) => {
      if ((ev as InputEvent).inputType === 'insertLineBreak') {
        onSubmitRef.current?.();
        return;
      }
      onChangeRef.current(mf.value);
    };
    const kbd = window.mathVirtualKeyboard as (Window['mathVirtualKeyboard'] & EventTarget) | undefined;
    // Only the field the keyboard is typing into shows its button as pressed.
    const sync = () => setKeyboardOpen(!!kbd?.visible && (document.activeElement === mf || mf.hasFocus()));
    const onBlur = () => setTimeout(sync, 0);
    mf.addEventListener('input', onInput);
    mf.addEventListener('focusin', sync);
    mf.addEventListener('focusout', onBlur);
    kbd?.addEventListener('virtual-keyboard-toggle', sync);
    return () => {
      mf.removeEventListener('input', onInput);
      mf.removeEventListener('focusin', sync);
      mf.removeEventListener('focusout', onBlur);
      kbd?.removeEventListener('virtual-keyboard-toggle', sync);
    };
  }, [ready]);

  // Parent → field: a new question clears the box, etc.
  useEffect(() => {
    const mf = fieldRef.current;
    if (ready && mf && mf.value !== value) mf.value = value;
  }, [value, ready]);

  useEffect(() => {
    const mf = fieldRef.current;
    if (!ready || !mf) return;
    mf.readOnly = disabled;
    mf.toggleAttribute('aria-disabled', disabled);
    if (disabled && document.activeElement === mf && window.mathVirtualKeyboard?.visible) {
      window.mathVirtualKeyboard.hide();
    }
  }, [disabled, ready]);

  useEffect(() => {
    if (ready) fieldRef.current?.setAttribute('aria-label', ariaLabel);
  }, [ariaLabel, ready]);

  // Hide the keyboard when this field goes away (next question, page change).
  useEffect(
    () => () => {
      if (window.mathVirtualKeyboard?.visible) window.mathVirtualKeyboard.hide();
      document.documentElement.style.setProperty('--math-kbd-h', '0px');
      document.documentElement.removeAttribute('data-math-kbd');
    },
    [],
  );

  useKeyboardSpace(ready, wrapRef);

  const insert = useCallback((latex: string) => {
    const mf = fieldRef.current;
    if (!mf || mf.readOnly) return;
    mf.focus();
    mf.insert(latex, { selectionMode: 'placeholder', focus: true });
    onChangeRef.current(mf.value);
  }, []);

  const toggleKeyboard = useCallback(() => {
    const mf = fieldRef.current;
    const kbd = window.mathVirtualKeyboard;
    if (!mf || !kbd) return;
    if (kbd.visible) {
      kbd.hide();
      setKeyboardOpen(false);
    } else {
      mf.focus();
      kbd.show();
      setKeyboardOpen(true);
    }
  }, []);

  const border = invalid ? 'border-red-400' : 'border-gray-300';
  const size = compact ? 'min-h-[34px] text-[15px]' : 'min-h-[46px] text-[18px]';

  return (
    <div ref={wrapRef} className={className}>
      <div
        className={`math-answer flex items-stretch rounded-lg border bg-white transition-colors duration-200 focus-within:border-transparent focus-within:ring-2 focus-within:ring-blue-500 ${border} ${
          disabled ? 'bg-gray-50' : ''
        }`}
      >
        <div ref={hostRef} className={`flex min-w-0 flex-1 items-center ${size} ${ready ? '' : 'hidden'}`} />
        {!ready && (
          // Fallback while MathLive loads (or if it cannot): a plain input
          // whose text the grader reads just the same.
          <input
            type="text"
            inputMode="text"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            id={id}
            data-math-answer=""
            aria-label={ariaLabel}
            value={value}
            disabled={disabled}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSubmit?.()}
            className={`w-full min-w-0 flex-1 rounded-lg bg-transparent px-3 focus:outline-none ${size}`}
          />
        )}
        <button
          type="button"
          onClick={toggleKeyboard}
          onMouseDown={(e) => e.preventDefault()}
          disabled={!ready || disabled}
          aria-pressed={keyboardOpen}
          aria-label={keyboardOpen ? 'Hide the maths keyboard' : 'Show the maths keyboard'}
          title={keyboardOpen ? 'Hide the maths keyboard' : 'Show the maths keyboard'}
          className={`shrink-0 rounded-r-lg border-l border-gray-200 px-2.5 text-gray-500 hover:bg-gray-50 hover:text-gray-800 disabled:opacity-40 ${
            keyboardOpen ? 'bg-blue-50 text-blue-700' : ''
          }`}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
            <rect x="2.5" y="6" width="19" height="12" rx="2" />
            <path d="M6 9.5h1M9 9.5h1M12 9.5h1M15 9.5h1M18 9.5h0.5M6 12h1M9 12h1M12 12h1M15 12h1M18 12h0.5M8 15h8" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      {!compact && (
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          {HELPERS.map((h) => (
            <button
              key={h.label}
              type="button"
              title={h.title}
              aria-label={h.title}
              disabled={!ready || disabled}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => insert(h.latex)}
              className="rounded-md border border-gray-200 bg-white px-2 py-0.5 text-[13px] font-medium text-gray-700 hover:border-gray-300 hover:bg-gray-50 disabled:opacity-40"
            >
              {h.label}
            </button>
          ))}
          <span id={hintId} className="text-[11px] text-gray-400">
            Type ^ for a power (→ to leave it), / for a fraction
          </span>
        </div>
      )}
    </div>
  );
}
