import { Courier_Prime } from 'next/font/google';
import 'katex/dist/katex.min.css';
import './cheatsheet.css';
import { CURRICULA } from '@/lib/curricula';
import { SECTION_TITLES, sheetParts, syllabusReference, tagLabel } from '@/lib/cheatsheets';
import type { CheatSheet, ContentTag, SectionKey, Tagged } from '@/lib/cheatsheets/types';
import { rolesUsed } from '@/lib/cheatsheets/rough';
import { pdfHrefs } from '@/lib/cheatsheets/pdfFiles';
import { MathBlock, MathText } from './Math';
import { RoughDiagram } from './RoughDiagram';
import { SheetToolbar } from './SheetToolbar';

const typewriter = Courier_Prime({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-typewriter',
  display: 'swap',
});

const ROLE_NAMES = {
  force: 'force',
  velocity: 'velocity',
  acceleration: 'acceleration',
} as const;

function Tag({ item }: { item: Tagged }) {
  if (!item.tag) return null;
  return <span className="cs-tag">{tagLabel(item.tag, item.tagLabel)}</span>;
}

/** Content plus its margin note: the note sits in the right margin from 768px, under the item on phones. */
function Item({ note, children, className }: { note?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className="cs-item">
      <div className={className}>{children}</div>
      {note ? <aside className="cs-note">{note}</aside> : <span aria-hidden="true" />}
    </div>
  );
}

/** A numbered section. `aside` sits on the heading's line (e.g. the diagram colour key). */
function Section({ k, n, aside, children }: { k: SectionKey; n: number; aside?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="cs-section" aria-labelledby={`cs-h-${k}`}>
      <div className="cs-section__head">
        <h2 id={`cs-h-${k}`}>
          <span className="cs-num">{String(n).padStart(2, '0')}</span>
          {SECTION_TITLES[k]}
        </h2>
        {aside}
      </div>
      {children}
    </section>
  );
}

function renderSection(sheet: CheatSheet, k: SectionKey, n: number) {
  switch (k) {
    case 'definitions':
      return (
        <Section key={k} k={k} n={n}>
          {sheet.definitions.map((d) => (
            <Item key={d.term} note={d.note}>
              <p className={`m-0 ${d.source === 'syllabus' ? 'cs-quote' : ''}`}>
                <span className="cs-term">{d.term}</span>
                <Tag item={d} />{' '}
                <span className="cs-source">[{d.source === 'syllabus' ? 'syllabus wording' : 'paraphrase'}]</span>
                <br />
                {d.source === 'syllabus' ? (
                  <q>
                    <MathText text={d.text} />
                  </q>
                ) : (
                  <MathText text={d.text} />
                )}
              </p>
            </Item>
          ))}
        </Section>
      );
    case 'equations':
      return (
        <Section key={k} k={k} n={n}>
          <div className="cs-eqs">
            {sheet.equations.map((e) => (
              <div key={e.name} className="cs-eq-wrap">
                <div className={`cs-eq ${e.tag && e.tag !== 'supplement' ? 'cs-flagged' : ''}`}>
                  <div className="cs-eq__name">
                    {e.name}
                    <Tag item={e} />
                  </div>
                  <MathBlock latex={e.latex} label={e.name} />
                  <table className="cs-symbols">
                    <caption className="sr-only">Symbols in {e.name}</caption>
                    <tbody>
                      {e.symbols.map((s) => (
                        <tr key={s.symbol}>
                          <td>
                            <MathText text={`$${s.symbol}$`} />
                          </td>
                          <td>{s.meaning}</td>
                          <td>{s.unit ? <MathText text={`$${s.unit}$`} /> : 'no unit'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {e.note && <aside className="cs-note">{e.note}</aside>}
              </div>
            ))}
          </div>
        </Section>
      );
    case 'diagrams': {
      const roles = rolesUsed(sheet.diagrams);
      return (
        <Section
          key={k}
          k={k}
          n={n}
          aside={
            roles.length > 0 ? (
              <p className="cs-legend" aria-label="Colour key">
                {roles.map((r) => (
                  <span key={r} className={`cs-role-${r}`}>
                    <i aria-hidden="true" />
                    {ROLE_NAMES[r as keyof typeof ROLE_NAMES]}
                  </span>
                ))}
              </p>
            ) : undefined
          }
        >
          <div className="cs-diagram-block">
            <div className="cs-figs">
              {sheet.diagrams.map((d, i) => (
                <figure key={d.id} className="cs-fig">
                  <div className="cs-fig__title">
                    Fig. {i + 1} · {d.title}
                  </div>
                  <RoughDiagram diagram={d} />
                  <figcaption>{d.caption}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </Section>
      );
    }
    case 'worked':
      return (
        <Section key={k} k={k} n={n}>
          {sheet.worked.map((w) => (
            <div key={w.title}>
              <p className="cs-question m-0">
                <b className="cs-tw">{w.title}</b>
                <Tag item={w} />
                <br />
                <MathText text={w.question} />
              </p>
              <ol className="cs-steps">
                {w.steps.map((s, i) => (
                  <li key={i}>
                    <Item note={s.note} className="cs-step">
                      <p className="cs-step__text m-0">
                        <MathText text={s.text} />
                      </p>
                      {(s.latex || s.units) && (
                        <div className="cs-step__math">
                          {s.latex && <MathBlock latex={s.latex} />}
                          {s.units && (
                            <div className="cs-units">
                              <b>Units:</b> <MathText text={`$${s.units}$`} />
                            </div>
                          )}
                        </div>
                      )}
                    </Item>
                  </li>
                ))}
              </ol>
              <p className="cs-answer m-0">
                <b>Answer:</b> <MathText text={`$${w.answer}$`} />
              </p>
            </div>
          ))}
        </Section>
      );
    case 'mistakes':
      return (
        <Section key={k} k={k} n={n}>
          <ul className="cs-mistakes">
            {sheet.mistakes.map((m, i) => (
              <li key={i}>
                <p className="cs-wrong">
                  <b>✗ Wrong:</b> <MathText text={m.wrong} />
                </p>
                <p className="cs-right">
                  <b>✓ Right:</b> <MathText text={m.right} />
                </p>
              </li>
            ))}
          </ul>
        </Section>
      );
    case 'recall':
      return (
        <Section key={k} k={k} n={n}>
          <ol className="cs-recall">
            {sheet.recall.map((q, i) => (
              <li key={i}>
                <details>
                  <summary>
                    <span className="cs-recall__n">Q{i + 1}</span>
                    <span>
                      <MathText text={q.question} />
                    </span>
                  </summary>
                  <p className="cs-recall__answer">
                    <b>A:</b> <MathText text={q.answer} />
                  </p>
                </details>
              </li>
            ))}
          </ol>
          <p className="cs-recall__printed m-0">
            <b>Answers</b>
            {sheet.recall.map((q, i) => (
              <span key={i}>
                {' '}
                <b>{i + 1}.</b> <MathText text={q.answer} />
              </span>
            ))}
          </p>
        </Section>
      );
    case 'summary':
      return (
        <Section key={k} k={k} n={n}>
          <div className="cs-summary">
            <ol>
              {sheet.summary.map((s, i) => (
                <li key={i}>
                  <MathText text={s} />
                </li>
              ))}
            </ol>
          </div>
        </Section>
      );
  }
}

export function CheatSheetView({ sheet, url }: { sheet: CheatSheet; url: string }) {
  const curriculum = CURRICULA[sheet.curriculumId];
  const ref = syllabusReference(sheet);
  const parts = sheetParts(sheet);
  let n = 0;

  return (
    <div id="cs-root" className={`cs-root ${typewriter.variable}`} data-ink="saver" data-print-answers="off" data-paper="a4">
      <SheetToolbar rootId="cs-root" pdfs={pdfHrefs(sheet.slug)} />
      {parts.map((keys, p) => (
        <article key={p} className="cs-page" aria-label={`Sheet ${p + 1} of ${parts.length}`}>
          {p === 0 ? (
            <header className="cs-header">
              <div className="cs-header__top">
                <h1 className="cs-title">{sheet.title}</h1>
                <div className="cs-kicker">
                  AshPhys · Revision cheat sheet
                  {parts.length > 1 ? ` · Sheet 1 of ${parts.length}` : ''}
                </div>
              </div>
              <div className="cs-chips">
                <span className="cs-chip">{curriculum.shortName}</span>
                <span className="cs-chip cs-chip--code">{ref}</span>
                <span className="cs-chip">
                  Chapter {sheet.chapter.number}: {sheet.chapter.title}
                </span>
                <span className="cs-chip">Lesson {sheet.lessonCode}</span>
                <span className="cs-chip">Syllabus {sheet.syllabusSections.join(', ')}</span>
              </div>
              <p className="cs-goal">
                <b>Goal:</b> {sheet.goal}
              </p>
            </header>
          ) : (
            <div className="cs-sheetbar">
              <span>
                {sheet.title} · {ref}
              </span>
              <span>
                Sheet {p + 1} of {parts.length}
              </span>
            </div>
          )}
          {keys.map((k) => renderSection(sheet, k, ++n))}
          <footer className="cs-footer">
            <span>{url.replace(/^https?:\/\//, '')}</span>
            <span>
              {curriculum.syllabusLabel} syllabus check {sheet.reviewed}
            </span>
          </footer>
        </article>
      ))}
    </div>
  );
}
