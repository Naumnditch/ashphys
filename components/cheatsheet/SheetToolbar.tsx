'use client';

import { useEffect, useState } from 'react';
import { PAPER_MM, type Paper } from '@/lib/cheatsheets/pdfFiles';

const PREFS_KEY = 'ashphys-cheatsheet-prefs';

interface Prefs {
  paper: Paper;
  tint: boolean;
  answers: boolean;
}
const DEFAULTS: Prefs = { paper: 'a4', tint: false, answers: false };

function readPrefs(): Prefs {
  try {
    const raw = JSON.parse(localStorage.getItem(PREFS_KEY) ?? '{}');
    return {
      paper: raw.paper === 'letter' ? 'letter' : 'a4',
      tint: raw.tint === true,
      answers: raw.answers === true,
    };
  } catch {
    return DEFAULTS;
  }
}

function writePrefs(p: Prefs) {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(p));
  } catch {
    // Blocked storage: the choice still applies to this visit.
  }
}

/**
 * Print and PDF controls above a cheat sheet: paper size, paper tint (off =
 * ink saver), whether the quick-recall answers print, Print, and a link to the
 * prebuilt PDF for the chosen paper. The choices are data attributes on the
 * sheet root plus one @page rule, so the browser's own Print → Save as PDF
 * matches the downloadable file.
 */
export function SheetToolbar({ rootId, pdfs }: { rootId: string; pdfs: Partial<Record<Paper, string>> }) {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULTS);

  useEffect(() => setPrefs(readPrefs()), []);

  useEffect(() => {
    const root = document.getElementById(rootId);
    if (!root) return;
    root.dataset.paper = prefs.paper;
    root.dataset.ink = prefs.tint ? 'tint' : 'saver';
    root.dataset.printAnswers = prefs.answers ? 'on' : 'off';
    let style = document.getElementById('cs-page-size') as HTMLStyleElement | null;
    if (!style) {
      style = document.createElement('style');
      style.id = 'cs-page-size';
      document.head.appendChild(style);
    }
    const { w, h } = PAPER_MM[prefs.paper];
    style.textContent = `@page { size: ${w}mm ${h}mm; margin: 10mm 12mm; }`;
    return () => style?.remove();
  }, [prefs, rootId]);

  function update(next: Partial<Prefs>) {
    const merged = { ...prefs, ...next };
    setPrefs(merged);
    writePrefs(merged);
  }

  return (
    <div className="cs-toolbar cs-noprint" role="toolbar" aria-label="Print and download">
      <fieldset>
        <legend>Paper</legend>
        {(['a4', 'letter'] as const).map((p) => (
          <button key={p} type="button" className="cs-seg" aria-pressed={prefs.paper === p} onClick={() => update({ paper: p })}>
            {p === 'a4' ? 'A4' : 'Letter'}
          </button>
        ))}
      </fieldset>
      <label className="cs-check">
        <input type="checkbox" checked={prefs.tint} onChange={(e) => update({ tint: e.target.checked })} />
        Print paper tint
      </label>
      <label className="cs-check">
        <input type="checkbox" checked={prefs.answers} onChange={(e) => update({ answers: e.target.checked })} />
        Print recall answers
      </label>
      <span className="flex gap-2 ml-auto">
        <button type="button" className="cs-btn" onClick={() => window.print()}>
          Print
        </button>
        {pdfs[prefs.paper] && (
          <a
            className="cs-btn cs-btn--primary"
            href={pdfs[prefs.paper]}
            download
            title={`${prefs.paper === 'a4' ? 'A4' : 'US Letter'} PDF, quick-recall answers included`}
          >
            Download PDF
          </a>
        )}
      </span>
    </div>
  );
}
