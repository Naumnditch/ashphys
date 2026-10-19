import { Courier_Prime } from 'next/font/google';
import 'katex/dist/katex.min.css';
import './cheatsheet.css';
import { CURRICULA } from '@/lib/curricula';
import {
  SECTION_ORDER,
  SECTION_TITLES,
  isALevelOnly,
  sheetPages,
  syllabusReference,
  tagLabel,
  type PagePart,
} from '@/lib/cheatsheets';
import type { CheatSheet, Diagram, SectionKey, Tagged } from '@/lib/cheatsheets/types';
import { rolesUsed } from '@/lib/cheatsheets/diagram';
import { pdfHrefs } from '@/lib/cheatsheets/pdfFiles';
import { MathBlock, MathText } from './Math';
import { SheetDiagram } from './Diagram';
import { SheetToolbar } from './SheetToolbar';

const typewriter = Courier_Prime({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-typewriter', display: 'swap' });

const ROLE_NAMES = { force: 'force', velocity: 'velocity', acceleration: 'acceleration' } as const;

function Tag({ item }: { item: Tagged }) {
  if (!item.tag) return null;
  return <span className="cs-tag">{tagLabel(item.tag, item.tagLabel)}</span>;
}

function Figure({ diagram, n }: { diagram: Diagram; n: number }) {
  return (
    <figure className="cs-fig">
      <div className="cs-fig__title">
        Fig. {n} · {diagram.title}
      </div>
      <SheetDiagram diagram={diagram} />
      <figcaption>
        <MathText text={diagram.caption} />
      </figcaption>
    </figure>
  );
}

/** "16.1–16.7" for a run of sections, "1.5.1, 6.1.1" otherwise. */
function sectionsLabel(codes: string[]) {
  return codes.length > 3 ? `${codes[0]}–${codes[codes.length - 1]}` : codes.join(', ');
}

function SectionHead({ k, continued }: { k: SectionKey; continued: boolean }) {
  return (
    <div className="cs-section__head">
      <h2 id={continued ? undefined : `cs-h-${k}`}>
        <span className="cs-num">{String(SECTION_ORDER.indexOf(k) + 1).padStart(2, '0')}</span>
        {SECTION_TITLES[k]}
        {continued && <span className="cs-continued"> (continued)</span>}
      </h2>
    </div>
  );
}

interface Ctx {
  sheet: CheatSheet;
  /** Figure numbers, in order of first appearance. */
  figNo: (id: string) => number;
  /** Where a figure is first shown in full: "explanation", "derivation:<i>" or "sample:<i>". */
  firstShownIn: (id: string) => string | undefined;
  diagram: (id: string) => Diagram;
}

function renderPart(ctx: Ctx, part: PagePart) {
  const { sheet } = ctx;
  const range = <T,>(items: T[]) => items.slice(part.from ?? 0, part.to ?? items.length);
  const offset = part.from ?? 0;
  const key = `${part.section}-${part.from ?? 0}`;

  switch (part.section) {
    case 'explanation': {
      const figs = sheet.explanation.figures ?? [];
      return (
        <section key={key} className="cs-section" aria-labelledby="cs-h-explanation">
          <SectionHead k="explanation" continued={part.continued} />
          <div className={figs.length === 1 ? 'cs-explain' : figs.length > 1 ? 'cs-explain cs-explain--row' : undefined}>
            <div>
              {sheet.explanation.paragraphs.map((p, i) => (
                <p key={i} className="cs-para">
                  <MathText text={p} />
                </p>
              ))}
            </div>
            {figs.length > 0 && (
              <div className="cs-explain__figs">
                {figs.map((id) => (
                  <Figure key={id} diagram={ctx.diagram(id)} n={ctx.figNo(id)} />
                ))}
              </div>
            )}
          </div>
          <dl className="cs-terms">
            {sheet.explanation.keyTerms.map((t) => (
              <div key={t.term} className={t.source === 'syllabus' ? 'cs-quote' : undefined}>
                <dt>
                  <MathText text={t.term} />
                  <Tag item={t} />{' '}
                  <span className="cs-source">[{t.source === 'syllabus' ? 'syllabus wording' : 'paraphrase'}]</span>
                </dt>
                <dd>
                  {t.source === 'syllabus' ? (
                    <q>
                      <MathText text={t.text} />
                    </q>
                  ) : (
                    <MathText text={t.text} />
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      );
    }

    case 'derivations':
      return (
        <section key={key} className="cs-section" aria-labelledby={part.continued ? undefined : 'cs-h-derivations'}>
          <SectionHead k="derivations" continued={part.continued} />
          {range(sheet.derivations).map((d, i) => (
            <article key={d.id} className="cs-deriv">
              <h3 className="cs-h3">
                <span className="cs-num">D{offset + i + 1}</span> {d.title}
                <Tag item={d} />
              </h3>
              <p className="cs-para">
                <MathText text={d.setup} />
              </p>
              <div className={d.figure ? 'cs-deriv__grid' : undefined}>
                {d.figure && <Figure diagram={ctx.diagram(d.figure)} n={ctx.figNo(d.figure)} />}
                <div>
                  <ol className="cs-dsteps">
                    {d.steps.map((s, j) => (
                      <li key={j}>
                        {s.text && (
                          <p className="m-0">
                            <MathText text={s.text} />
                          </p>
                        )}
                        {s.latex && <MathBlock latex={s.latex} />}
                      </li>
                    ))}
                  </ol>
                  <div className="cs-result">
                    <span className="cs-result__label">Result</span>
                    <MathBlock latex={d.result} />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>
      );

    case 'equations':
      return (
        <section key={key} className="cs-section" aria-labelledby="cs-h-equations">
          <SectionHead k="equations" continued={part.continued} />
          <div className="cs-boxes">
            {sheet.equations.map((e) => (
              <div key={e.name} className={`cs-box${e.tag && e.tag !== 'supplement' ? ' cs-flagged' : ''}`}>
                <div className="cs-box__name">
                  {e.name}
                  <Tag item={e} />
                </div>
                <MathBlock latex={e.latex} label={e.name} />
                {e.note && <div className="cs-box__note">{e.note}</div>}
              </div>
            ))}
          </div>
          <div className="cs-symbols" role="group" aria-labelledby="cs-symbols-title">
            <div id="cs-symbols-title" className="cs-symbols__title">
              Symbols and units
            </div>
            <ul>
              {sheet.symbols.map((s) => (
                <li key={s.symbol}>
                  <span className="cs-symbols__sym">
                    <MathText text={`$${s.symbol}$`} />
                  </span>
                  <span>{s.meaning}</span>
                  <span className="cs-symbols__unit">{s.unit ? <MathText text={`$${s.unit}$`} /> : 'no unit'}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      );

    case 'samples':
      return (
        <section key={key} className="cs-section" aria-labelledby={part.continued ? undefined : 'cs-h-samples'}>
          <SectionHead k="samples" continued={part.continued} />
          {range(sheet.samples).map((s, i) => (
            <article key={s.title} className="cs-sample">
              <p className="cs-question m-0">
                <b className="cs-tw">
                  Sample {offset + i + 1} · {s.title}
                </b>
                <Tag item={s} />
                <br />
                <MathText text={s.question} />
              </p>
              <div
                className={
                  !s.figure
                    ? undefined
                    : ctx.firstShownIn(s.figure) === `sample:${offset + i}`
                      ? 'cs-sample__grid cs-sample__grid--figure'
                      : 'cs-sample__grid'
                }
              >
                <ol className="cs-steps">
                  {s.steps.map((step, j) => (
                    <li key={j}>
                      <p className="cs-step__text m-0">
                        <MathText text={step.text} />
                      </p>
                      {step.latex && <MathBlock latex={step.latex} />}
                    </li>
                  ))}
                </ol>
                {s.figure &&
                  // A figure not shown earlier on the sheet appears here in full; otherwise a thumbnail refers back to it.
                  (ctx.firstShownIn(s.figure) === `sample:${offset + i}` ? (
                    <Figure diagram={ctx.diagram(s.figure)} n={ctx.figNo(s.figure)} />
                  ) : (
                    <div className="cs-sample__fig" aria-hidden="true">
                      <SheetDiagram diagram={ctx.diagram(s.figure)} />
                      <div className="cs-fig__ref">see Fig. {ctx.figNo(s.figure)}</div>
                    </div>
                  ))}
              </div>
              <div className="cs-answer">
                <b>Answer:</b> <MathText text={s.answer} />
              </div>
              {s.unitCheck && (
                <div className="cs-unitcheck">
                  Unit check: <MathText text={`$${s.unitCheck}\\ \\checkmark$`} />
                </div>
              )}
            </article>
          ))}
        </section>
      );

    case 'practice': {
      const items = range(sheet.practice);
      return (
        <section key={key} className="cs-section" aria-labelledby={part.continued ? undefined : 'cs-h-practice'}>
          <SectionHead k="practice" continued={part.continued} />
          <ol className="cs-practice">
            {items.map((p, i) => (
              <li key={i}>
                <span className="cs-practice__n">P{offset + i + 1}</span>
                <div>
                  <MathText text={p.question} />
                  <Tag item={p} />
                  <details className="cs-practice__ans">
                    <summary>Final answer</summary>
                    <MathText text={p.answer} />
                  </details>
                  <div className="cs-practice__printed">
                    Answer: <MathText text={p.answer} />
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>
      );
    }

    case 'other': {
      const o = sheet.other;
      return (
        <section key={key} className="cs-section" aria-labelledby="cs-h-other">
          <SectionHead k="other" continued={part.continued} />
          <div className="cs-other">
            <div className="cs-other__mistakes">
              <h3 className="cs-h3">Common mistakes</h3>
              <ul className="cs-mistakes">
                {o.mistakes.map((m, i) => (
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
            </div>
            <div>
              <h3 className="cs-h3">Exam tips</h3>
              <ul className="cs-bullets">
                {o.tips.map((t, i) => (
                  <li key={i}>
                    <MathText text={t} />
                  </li>
                ))}
              </ul>
              {o.links && o.links.length > 0 && (
                <>
                  <h3 className="cs-h3">Explore</h3>
                  <ul className="cs-bullets">
                    {o.links.map((l) => (
                      <li key={l.href}>
                        <a href={l.href}>{l.label}</a>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
            <div>
              <h3 className="cs-h3">What the syllabus asks</h3>
              <ul className="cs-bullets">
                {o.syllabus.map((t, i) => (
                  <li key={i}>
                    <MathText text={t} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      );
    }
  }
}

export function CheatSheetView({ sheet, url }: { sheet: CheatSheet; url: string }) {
  const curriculum = CURRICULA[sheet.curriculumId];
  const ref = syllabusReference(sheet);
  const pages = sheetPages(sheet);
  const roles = rolesUsed(sheet.diagrams);

  // Figures are numbered in the order they first appear on the sheet.
  const order: string[] = [];
  const firstShown = new Map<string, string>();
  const note = (id: string | undefined, where: string) => {
    if (!id || order.includes(id)) return;
    order.push(id);
    firstShown.set(id, where);
  };
  for (const page of pages) {
    for (const part of page) {
      const from = part.from ?? 0;
      if (part.section === 'explanation') (sheet.explanation.figures ?? []).forEach((id) => note(id, 'explanation'));
      if (part.section === 'derivations')
        sheet.derivations.slice(from, part.to).forEach((d, i) => note(d.figure, `derivation:${from + i}`));
      if (part.section === 'samples') sheet.samples.slice(from, part.to).forEach((s, i) => note(s.figure, `sample:${from + i}`));
    }
  }
  const ctx: Ctx = {
    sheet,
    figNo: (id) => order.indexOf(id) + 1,
    firstShownIn: (id) => firstShown.get(id),
    diagram: (id) => {
      const d = sheet.diagrams.find((x) => x.id === id);
      if (!d) throw new Error(`Cheat sheet ${sheet.slug}: no diagram "${id}"`);
      return d;
    },
  };

  return (
    <div id="cs-root" className={`cs-root ${typewriter.variable}`} data-ink="saver" data-print-answers="on" data-paper="a4">
      <SheetToolbar rootId="cs-root" pdfs={pdfHrefs(sheet.slug)} />
      {pages.map((parts, p) => (
        <article key={p} className="cs-page" aria-label={`Sheet ${p + 1} of ${pages.length}`}>
          {p === 0 ? (
            <header className="cs-header">
              <div className="cs-header__top">
                <h1 className="cs-title">{sheet.title}</h1>
                <div className="cs-kicker">
                  AshPhys · Revision cheat sheet
                  {pages.length > 1 ? ` · Sheet 1 of ${pages.length}` : ''}
                </div>
              </div>
              <div className="cs-chips">
                {/* The reference already names the level for AS and A Level ("9702 A Level Ch.16"). */}
                {!ref.includes(curriculum.shortName) && <span className="cs-chip">{curriculum.shortName}</span>}
                <span className="cs-chip cs-chip--code">{ref}</span>
                <span className="cs-chip">
                  Chapter {sheet.chapter.number}: {sheet.chapter.title}
                </span>
                <span className="cs-chip">Lesson {sheet.lessonCode}</span>
                <span className="cs-chip">
                  {sheet.curriculumId === 'igcse' ? 'Syllabus' : 'Sections'} {sectionsLabel(sheet.syllabusSections)}
                </span>
                {isALevelOnly(sheet) && <span className="cs-tag cs-tag--chip">{tagLabel('a-level-only')}</span>}
              </div>
              <div className="cs-header__bottom">
                <p className="cs-goal">
                  <b>Goal:</b> {sheet.goal}
                </p>
                {roles.length > 0 && (
                  <p className="cs-legend" aria-label="Colour key">
                    {roles.map((r) => (
                      <span key={r} className={`cs-role-${r}`}>
                        <i aria-hidden="true" />
                        {ROLE_NAMES[r as keyof typeof ROLE_NAMES]}
                      </span>
                    ))}
                  </p>
                )}
              </div>
            </header>
          ) : (
            <div className="cs-sheetbar">
              <span>
                {sheet.title} · {ref}
              </span>
              <span>
                Sheet {p + 1} of {pages.length}
              </span>
            </div>
          )}
          {parts.map((part) => renderPart(ctx, part))}
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
