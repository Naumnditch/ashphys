import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import postcss from 'postcss';
import tailwindcss from 'tailwindcss';
import tailwindConfig from '../../../tailwind.config';
import {
  balanceColumns,
  chapterMastery,
  lessonKind,
  lessonNumber,
  rowCount,
  subTopicGroups,
  TWO_COLUMN_MIN_WIDTH,
  type SubTopicGroup,
} from '../courseLayout';
import type { CurriculumLesson, LessonGroup } from '../lessons';
import { LessonRow, lessonHref } from '@/components/curriculum/LessonRow';
import { ChapterCard } from '@/components/curriculum/ChapterCard';

let nextId = 0;
function lesson(overrides: Partial<CurriculumLesson> = {}): CurriculumLesson {
  nextId += 1;
  return {
    id: `00000000-0000-4000-8000-${String(nextId).padStart(12, '0')}`,
    title: `Lesson ${nextId}`,
    topicCode: null,
    sectionTitle: null,
    syllabusReference: null,
    description: null,
    requiredTier: 0,
    chapterId: 'ch',
    chapterNumber: 1,
    chapterTitle: 'Chapter',
    questionCount: 0,
    simulations: [],
    alsoIn: [],
    ...overrides,
  };
}

function groupsOfSizes(sizes: number[]): SubTopicGroup[] {
  return sizes.map((n, i) => ({ key: `g${i}`, heading: `Group ${i}`, lessons: Array.from({ length: n }, () => lesson()) }));
}

/** Small deterministic PRNG so the property test is repeatable. */
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) % 2 ** 31;
    return s / 2 ** 31;
  };
}

describe('balanceColumns', () => {
  it('keeps the two columns within one group of each other, never loses or reorders a lesson', () => {
    const random = rng(42);
    for (let trial = 0; trial < 500; trial++) {
      const sizes = Array.from({ length: 1 + Math.floor(random() * 7) }, () => 1 + Math.floor(random() * 9));
      const groups = groupsOfSizes(sizes);
      const total = sizes.reduce((a, b) => a + b, 0);
      const [left, right] = balanceColumns(groups);

      const unsplit = Math.max(0, ...groups.filter((g) => g.lessons.length <= total / 2).map((g) => g.lessons.length));
      const diff = Math.abs(rowCount(left) - rowCount(right));
      // A group bigger than half the chapter is split to half, so it can't
      // unbalance the columns by more than one row.
      expect(diff, `sizes ${sizes.join(',')}`).toBeLessThanOrEqual(Math.max(unsplit, 1));

      // Every lesson once; a group's lessons stay in order (head piece then continued piece).
      const pieces = [...left, ...right].sort((a, b) => a.order - b.order);
      expect(pieces.flatMap((p) => p.lessons.map((l) => l.id))).toEqual(groups.flatMap((g) => g.lessons.map((l) => l.id)));

      // Only a group larger than half the chapter is split.
      for (const g of groups) {
        const parts = pieces.filter((p) => p.key === g.key || p.key === `${g.key}:continued`);
        if (g.lessons.length <= total / 2) expect(parts).toHaveLength(1);
      }
    }
  });

  it('puts each group in the shorter column, in original order', () => {
    const [left, right] = balanceColumns(groupsOfSizes([3, 2, 2, 1]));
    expect(left.map((p) => p.key)).toEqual(['g0', 'g3']);
    expect(right.map((p) => p.key)).toEqual(['g1', 'g2']);
    expect(rowCount(left)).toBe(4);
    expect(rowCount(right)).toBe(4);
  });

  it('splits a group larger than half the chapter (e.g. 9702 Chapter 1, eight lessons, no sub-topics)', () => {
    const [left, right] = balanceColumns(groupsOfSizes([8]));
    expect(rowCount(left)).toBe(4);
    expect(rowCount(right)).toBe(4);
    expect(right[0].continued).toBe(true);
    const [l2, r2] = balanceColumns(groupsOfSizes([7]));
    expect([rowCount(l2), rowCount(r2)]).toEqual([4, 3]);
  });
});

describe('subTopicGroups', () => {
  it('makes a heading for each section two or more lessons share, and one unnamed group for the rest', () => {
    const a1 = { topicCode: 'A.1', sectionTitle: 'Kinematics' };
    const a2 = { topicCode: 'A.2', sectionTitle: 'Forces and momentum' };
    const lessons = [lesson(a1), lesson(a1), lesson(a2), lesson(a2), lesson(a2), lesson({ topicCode: 'A.5', sectionTitle: 'Relativity' })];
    const groups = subTopicGroups(lessons);
    expect(groups.map((g) => [g.heading, g.lessons.length])).toEqual([
      ['Kinematics', 2],
      ['Forces and momentum', 3],
      [null, 1],
    ]);
    expect(groups.flatMap((g) => g.lessons)).toEqual(lessons);
  });

  it('gives a chapter of one-lesson sections (9702 Kinematics) one unnamed group, in order', () => {
    const lessons = ['1.1', '1.2', '1.3', '1.4'].map((c) => lesson({ topicCode: c, sectionTitle: `Section ${c}` }));
    expect(subTopicGroups(lessons)).toEqual([{ key: '__unnamed', heading: null, lessons }]);
  });

  it('does not group IGCSE coursebook chapters by syllabus section', () => {
    const lessons = ['1.5.1', '1.3', '1.5.1'].map((c) => lesson({ topicCode: c, sectionTitle: c }));
    expect(subTopicGroups(lessons, false)).toHaveLength(1);
  });
});

describe('lesson kind, number and mastery', () => {
  it('maps lesson content to a type', () => {
    expect(lessonKind(lesson({ simulations: [{ id: 's', title: 'Sim', urlPath: '/simulations/x' }], questionCount: 20 }))).toBe('simulation');
    expect(lessonKind(lesson({ questionCount: 20 }))).toBe('practice');
    expect(lessonKind(lesson())).toBe('reading');
  });

  it('numbers rows from the IGCSE title or the curriculum code', () => {
    expect(lessonNumber(lesson({ title: '2.2 Distance-time graphs', topicCode: '1.2' }), 'igcse')).toEqual({
      number: '2.2',
      title: 'Distance-time graphs',
    });
    expect(lessonNumber(lesson({ title: 'Speed', topicCode: '1.1' }), 'as')).toEqual({ number: '1.1', title: 'Speed' });
    expect(lessonNumber(lesson({ title: 'Unit Prefixes', topicCode: 'Maths' }), 'as').number).toBeNull();
  });

  it('hides chapter mastery without progress data and counts only masterable lessons', () => {
    const ls = [lesson({ questionCount: 5 }), lesson({ questionCount: 5 }), lesson(), lesson({ questionCount: 3 })];
    expect(chapterMastery(ls, undefined)).toBeNull();
    expect(chapterMastery(ls, {})).toBeNull();
    expect(chapterMastery(ls, { [ls[0].id]: { mastered: true, fraction: 1 }, [ls[1].id]: { mastered: false, fraction: 0.4 } })).toEqual({
      percent: 33,
      mastered: 1,
      eligible: 3,
    });
  });
});

describe('LessonRow', () => {
  it('links the whole row to the same lesson route as before', () => {
    const l = lesson({ title: 'Speed', topicCode: '1.1', questionCount: 20, description: 'How fast something moves.' });
    const html = renderToStaticMarkup(<LessonRow lesson={l} curriculumId="as" tier={0} masteryStreak={5} />);
    const href = `/lessons/${l.id}?c=as`;
    expect(lessonHref(l.id, 'as')).toBe(href);
    expect(html).toMatch(new RegExp(`^<li id="lesson-${l.id}"[^>]*><a [^>]*href="${href.replace(/[?]/g, '\\?')}"`));
    expect(html.match(/<a /g)).toHaveLength(1);
    expect(html).toContain('aria-label="Practice set"');
    expect(html).toContain('20 questions');
    expect(html).toContain('title="How fast something moves."');
    expect(html.replace(/title="[^"]*"/g, '')).not.toContain('How fast something moves.');
    expect(html).not.toMatch(/Open lesson|Practice ·/);
  });

  it('keeps a locked lesson locked, with the same link', () => {
    const l = lesson({ title: 'Speed', topicCode: '1.1', questionCount: 20, requiredTier: 1 });
    const html = renderToStaticMarkup(<LessonRow lesson={l} curriculumId="as" tier={0} masteryStreak={5} />);
    expect(html).toContain('aria-label="Locked: requires Plus"');
    expect(html).not.toContain('20 questions');
    expect(html).toContain(`href="/lessons/${l.id}?c=as"`);
  });
});

describe('ChapterCard layout', () => {
  const group: LessonGroup = {
    key: '1',
    label: 'Chapter 1',
    title: 'Kinematics',
    level: 'AS',
    lessons: ['1.1', '1.2', '1.3', '1.4', '1.5'].map((c) => lesson({ topicCode: c, sectionTitle: c, questionCount: 20 })),
  };
  const html = renderToStaticMarkup(<ChapterCard group={group} curriculumId="as" tier={0} masteryStreak={5} />);

  it('uses section / h2 / button[aria-expanded] / li > a semantics and starts expanded', () => {
    expect(html).toMatch(/^<section id="unit-1" aria-labelledby="[^"]+"/);
    expect(html).toMatch(/<h2 [^>]*><button type="button" aria-expanded="true"/);
    expect(html).toContain('Chapter 1');
    expect(html).toContain('>AS<');
    expect(html.match(/<li [^>]*><a /g)).toHaveLength(5);
    expect(html).not.toContain('Chapter mastery');
  });

  it(`is one column below ${TWO_COLUMN_MIN_WIDTH}px and two columns from ${TWO_COLUMN_MIN_WIDTH}px`, async () => {
    const { css } = await postcss([
      tailwindcss({ ...tailwindConfig, content: [{ raw: html, extension: 'html' }], corePlugins: { preflight: false } }),
    ]).process('@tailwind utilities;', { from: undefined });
    const root = postcss.parse(css);

    const declsFor = (selector: string, inMedia: boolean) => {
      const found: Record<string, string> = {};
      root.walkRules((rule) => {
        const parent = rule.parent as postcss.AtRule | undefined;
        const media = parent?.type === 'atrule' && parent.name === 'media' ? parent.params : null;
        if (rule.selector !== selector || Boolean(media) !== inMedia) return;
        if (inMedia) expect(media).toBe(`(min-width: ${TWO_COLUMN_MIN_WIDTH}px)`);
        rule.walkDecls((d) => {
          found[d.prop] = d.value;
        });
      });
      return found;
    };

    const gridClasses = /data-lesson-grid/.test(html) && html.match(/class="([^"]*)" data-lesson-grid/)![1].split(' ');
    const columnClasses = html.match(/class="([^"]*)" data-column="0"/)![1].split(' ');
    expect(gridClasses).toBeTruthy();

    // Below the breakpoint: a single flex column, the column wrappers vanish
    // (display: contents) so lessons stack in their original order.
    const base = Object.assign({}, ...(gridClasses as string[]).filter((c) => !c.includes(':')).map((c) => declsFor(`.${c}`, false)));
    expect(base).toMatchObject({ display: 'flex', 'flex-direction': 'column' });
    expect(base['grid-template-columns']).toBeUndefined();
    expect(declsFor('.contents', false)).toEqual({ display: 'contents' });
    expect(columnClasses).toContain('contents');

    // From the breakpoint: a two-column grid of block columns.
    expect(declsFor('.min-\\[900px\\]\\:grid', true)).toEqual({ display: 'grid' });
    expect(declsFor('.min-\\[900px\\]\\:grid-cols-2', true)).toEqual({ 'grid-template-columns': 'repeat(2, minmax(0, 1fr))' });
    expect(declsFor('.min-\\[900px\\]\\:block', true)).toEqual({ display: 'block' });
    expect(columnClasses).toContain('min-[900px]:block');
  });

  it('shows chapter mastery only when the student has progress', () => {
    const withProgress = renderToStaticMarkup(
      <ChapterCard
        group={group}
        curriculumId="as"
        tier={0}
        masteryStreak={5}
        progress={{ [group.lessons[0].id]: { mastered: true, fraction: 1 } }}
      />
    );
    expect(withProgress).toContain('Chapter mastery: 20%');
    expect(withProgress).toContain('role="tooltip"');
    expect(withProgress).toContain('aria-label="Mastered"');
  });
});
