import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { getUserTier, tierName } from '@/lib/subscriptions/getUserTier';
import {
  CURRICULA,
  chapterLabel,
  curriculumForTopic,
  findSection,
  lessonTitle,
  syllabusRefLabel,
  topicCodeFor,
  tryParseCurriculum,
  type CurriculumId,
} from '@/lib/curricula';
import { getLesson, resolveCurriculum } from '@/lib/curricula/queries';
import { SimulationIcon } from '@/components/icons/SimulationIcon';
import { ChapterViewTracker } from '@/components/analytics/ChapterViewTracker';

export const dynamic = 'force-dynamic';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * One lesson, seen through one curriculum: its syllabus code and reference
 * for that curriculum, the simulations every curriculum shares, and that
 * curriculum's own practice questions.
 */
export default async function LessonPage({
  params,
  searchParams,
}: {
  params: { topicId: string };
  searchParams: { c?: string };
}) {
  if (!UUID.test(params.topicId)) notFound();
  const lesson = await getLesson(params.topicId).catch((err) => {
    console.error('Failed to load lesson', err);
    return null;
  });
  if (!lesson) notFound();

  const user = await getCurrentUser();
  const [{ curriculumId: preferred }, tier] = await Promise.all([
    resolveCurriculum(null, user?.id),
    user ? getUserTier(user.id) : Promise.resolve(0),
  ]);
  const requested = tryParseCurriculum(searchParams.c);
  const curriculumId = curriculumForTopic(lesson.curriculum_ids, requested, preferred);
  const curriculum = CURRICULA[curriculumId];
  const topicCode = topicCodeFor(lesson, curriculumId);
  const found = findSection(curriculumId, topicCode);
  const title = lessonTitle(lesson.topic_name, curriculumId);
  const counts = lesson.question_counts ?? {};
  const questionCount = counts[curriculumId] ?? 0;
  const otherBanks = (Object.entries(counts) as [CurriculumId, number][]).filter(
    ([id, n]) => id !== curriculumId && n > 0 && id in CURRICULA
  );
  const alsoIn = (lesson.curriculum_ids ?? []).filter((c): c is CurriculumId => c !== curriculumId && c in CURRICULA);
  const locked = user?.role !== 'admin' && tier < lesson.required_tier;
  const practiceHref = (c: CurriculumId) => `/practice/${lesson.id}?c=${c}`;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <ChapterViewTracker topicIds={[lesson.id]} />
      <Link href={`/curriculum?c=${curriculumId}`} className="text-sm text-blue-600 hover:underline mb-6 inline-block">
        ← {curriculum.displayName} curriculum
      </Link>

      {requested && requested !== curriculumId && (
        <div className="mb-6 text-sm bg-amber-50 border border-amber-200 text-amber-800 rounded-lg px-4 py-3">
          This lesson isn&rsquo;t part of {CURRICULA[requested].name}, so it&rsquo;s shown as {curriculum.name}.{' '}
          <Link href={`/curriculum?c=${requested}`} className="font-semibold underline">
            Browse {CURRICULA[requested].shortName} lessons
          </Link>
        </div>
      )}

      <header className="mb-8">
        <p className="text-sm italic text-gray-500 mb-1">
          {syllabusRefLabel(curriculumId, topicCode)}
          {found && topicCode !== 'Maths' && <> · {found.unit.title}</>}
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex flex-wrap items-center gap-3">
          {curriculumId !== 'igcse' && topicCode && topicCode !== 'Maths' && (
            <span className="font-mono text-base font-semibold text-[#5a67d8] bg-[#eef0fd] px-2 py-0.5 rounded">{topicCode}</span>
          )}
          {title}
        </h1>
        {found && topicCode !== 'Maths' && found.section.title !== title && (
          <p className="text-gray-600 mt-2">Syllabus section: {found.section.title}</p>
        )}
        {lesson.syllabus_reference && (
          <p className="mt-4 text-gray-700 bg-gray-50 border-l-[3px] border-[#667eea] px-4 py-2 rounded-r">
            {lesson.syllabus_reference}
          </p>
        )}
        {alsoIn.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-gray-500">Also in:</span>
            {alsoIn.map((c) => {
              const code = topicCodeFor(lesson, c);
              return (
                <Link
                  key={c}
                  href={`/lessons/${lesson.id}?c=${c}`}
                  className="border border-gray-200 hover:border-[#667eea] hover:text-[#5a67d8] rounded-full px-2.5 py-1 text-gray-700"
                >
                  {CURRICULA[c].shortName}
                  {code && code !== 'Maths' && <span className="font-mono ml-1 text-gray-500">{code}</span>}
                </Link>
              );
            })}
          </div>
        )}
        {locked && (
          <p className="mt-4 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2">
            🔒 This lesson is part of the <strong>{tierName(lesson.required_tier)}</strong> plan.{' '}
            <Link href="/pricing" className="underline font-semibold">
              See plans
            </Link>
          </p>
        )}
      </header>

      <section className="mb-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3 border-b pb-2">
          Interactive simulation
        </h2>
        {lesson.simulations.length > 0 ? (
          <>
            <ul className="grid gap-3 sm:grid-cols-2">
              {lesson.simulations.map((sim) => (
                <li key={sim.id}>
                  <Link
                    href={sim.urlPath}
                    className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-3 bg-white hover:border-blue-400 hover:shadow-sm"
                  >
                    <SimulationIcon className="w-6 h-6 text-blue-600 flex-shrink-0" />
                    <span className="font-medium text-gray-900">{sim.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="text-xs text-gray-500 mt-2">
              Simulations are the same in every curriculum — the physics doesn&rsquo;t change with the syllabus.
            </p>
          </>
        ) : (
          <p className="text-sm text-gray-500">There&rsquo;s no simulation for this lesson yet.</p>
        )}
      </section>

      <section className="mb-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3 border-b pb-2">
          Practice questions – {curriculum.displayName}
        </h2>
        {questionCount > 0 ? (
          <div className="flex flex-wrap items-center justify-between gap-3 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
            <p className="text-sm text-gray-700">
              <strong>{questionCount}</strong> {curriculum.shortName} question{questionCount === 1 ? '' : 's'}, written for
              this syllabus. Get 5 right in a row to master the lesson.
            </p>
            <Link
              href={practiceHref(curriculumId)}
              className="text-sm font-semibold text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-full whitespace-nowrap"
            >
              🎯 Start practice
            </Link>
          </div>
        ) : (
          <p className="text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
            There are no {curriculum.shortName} practice questions for this lesson yet.
          </p>
        )}
        {otherBanks.length > 0 && (
          <p className="text-xs text-gray-500 mt-3">
            Also available:{' '}
            {otherBanks.map(([id, n], i) => (
              <span key={id}>
                {i > 0 && ' · '}
                <Link href={practiceHref(id)} className="text-blue-600 hover:underline">
                  {n} {CURRICULA[id].shortName} question{n === 1 ? '' : 's'}
                </Link>
              </span>
            ))}
          </p>
        )}
      </section>

      <p className="text-xs text-gray-400 border-t pt-4">
        Filed under{' '}
        <Link href={`/curriculum/${lesson.chapter_id}?c=${curriculumId}`} className="hover:underline">
          {chapterLabel(lesson.course_code, lesson.chapter_number)} · {lesson.chapter_title}
        </Link>
      </p>
    </div>
  );
}
