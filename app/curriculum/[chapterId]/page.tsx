import Link from 'next/link';
import { notFound } from 'next/navigation';
import { query } from '@/lib/db/client';
import { SimulationIcon } from '@/components/icons/SimulationIcon';
import { ChapterViewTracker } from '@/components/analytics/ChapterViewTracker';
import { getCurrentUser } from '@/lib/auth/session';
import { getUserTier, tierName } from '@/lib/subscriptions/getUserTier';
import {
  CURRICULA,
  chapterLabel,
  curriculumForTopic,
  defaultCurriculumForCourse,
  syllabusRefLabel,
  topicCodeFor,
  topicInCurriculum,
  tryParseCurriculum,
  type CurriculumId,
  type CurriculumTopicFields,
} from '@/lib/curricula';

export const dynamic = 'force-dynamic';

interface ChapterDetail {
  id: string;
  course_id: string;
  course_code: string | null;
  chapter_number: number;
  title: string;
  learning_objectives: string | null;
}

interface TopicRow extends CurriculumTopicFields {
  id: string;
  topic_name: string;
  order: number;
  required_tier: number;
}

interface SimRow {
  id: string;
  topic_id: string | null;
  title: string;
  url_path: string;
}

async function getChapter(id: string): Promise<ChapterDetail | null> {
  try {
    const result = await query(
      `SELECT c.id, c.course_id, co.code AS course_code, c.chapter_number, c.title, c.learning_objectives
       FROM chapters c JOIN courses co ON co.id = c.course_id
       WHERE c.id = $1`,
      [id]
    );
    return result.rows[0] || null;
  } catch (err) {
    console.error('Failed to load chapter:', err);
    return null;
  }
}

async function getTopics(chapterId: string): Promise<TopicRow[]> {
  try {
    const result = await query(
      `SELECT id, topic_name, "order", required_tier, curriculum_ids,
              topic_code, as_topic_code, a_level_topic_code, ib_topic_code
       FROM topics WHERE chapter_id = $1 ORDER BY "order" ASC`,
      [chapterId]
    );
    return result.rows;
  } catch {
    return [];
  }
}

async function getSimulations(chapterId: string): Promise<SimRow[]> {
  try {
    const result = await query(
      `SELECT id, topic_id, title, url_path FROM simulations WHERE chapter_id = $1`,
      [chapterId]
    );
    return result.rows;
  } catch {
    return [];
  }
}

/** Question bank sizes per lesson and curriculum: "topicId:curriculum" -> count. */
async function getQuestionCounts(chapterId: string): Promise<Map<string, number>> {
  try {
    const result = await query(
      `SELECT p.topic_id, p.curriculum_id, COUNT(*)::int AS n
       FROM problems p JOIN topics t ON t.id = p.topic_id
       WHERE t.chapter_id = $1
       GROUP BY p.topic_id, p.curriculum_id`,
      [chapterId]
    );
    return new Map(result.rows.map((r: any) => [`${r.topic_id}:${r.curriculum_id}`, r.n]));
  } catch {
    return new Map();
  }
}

async function getAdjacentChapters(courseId: string, chapterNumber: number) {
  try {
    const result = await query(
      `SELECT id, chapter_number, title FROM chapters
       WHERE course_id = $1 AND status = 'published' AND chapter_number IN ($2, $3)`,
      [courseId, chapterNumber - 1, chapterNumber + 1]
    );
    const prev = result.rows.find((r: any) => r.chapter_number === chapterNumber - 1) || null;
    const next = result.rows.find((r: any) => r.chapter_number === chapterNumber + 1) || null;
    return { prev, next };
  } catch {
    return { prev: null, next: null };
  }
}

export default async function ChapterDetailPage({
  params,
  searchParams,
}: {
  params: { chapterId: string };
  searchParams: { c?: string };
}) {
  const chapter = await getChapter(params.chapterId);
  if (!chapter) notFound();

  const user = await getCurrentUser();
  const [topics, simulations, questionCounts, { prev, next }, tier] = await Promise.all([
    getTopics(chapter.id),
    getSimulations(chapter.id),
    getQuestionCounts(chapter.id),
    getAdjacentChapters(chapter.course_id, chapter.chapter_number),
    user ? getUserTier(user.id) : Promise.resolve(0),
  ]);

  // The curriculum this chapter is being read in: the one the link says, or
  // the one its course belongs to. A lesson that isn't in that curriculum
  // (an IGCSE-only lesson viewed from AS) falls back to one it is in.
  const courseCurriculum = defaultCurriculumForCourse(chapter.course_code, chapter.chapter_number);
  const curriculumId: CurriculumId = tryParseCurriculum(searchParams.c) ?? courseCurriculum;
  const curriculumFor = (topic: TopicRow): CurriculumId =>
    topicInCurriculum(topic, curriculumId) ? curriculumId : curriculumForTopic(topic.curriculum_ids, null, courseCurriculum);
  const practiceCount = (topic: TopicRow) => questionCounts.get(`${topic.id}:${curriculumFor(topic)}`) ?? 0;
  const hasAnyPractice = topics.some((t) => practiceCount(t) > 0);
  const chapterHref = (id: string) => `/curriculum/${id}${searchParams.c ? `?c=${curriculumId}` : ''}`;

  // a lesson can have more than one simulation — group, don't overwrite
  const simsByTopic = new Map<string, typeof simulations>();
  for (const s of simulations) {
    if (!s.topic_id) continue;
    const arr = simsByTopic.get(s.topic_id) || [];
    arr.push(s);
    simsByTopic.set(s.topic_id, arr);
  }
  const simShortName = (title: string) => title.split(':')[0].trim();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <ChapterViewTracker topicIds={topics.map((t) => t.id)} />
      <Link href={`/curriculum?c=${curriculumId}`} className="text-sm text-blue-600 hover:underline mb-6 inline-block">
        ← Back to the {CURRICULA[curriculumId].shortName} curriculum
      </Link>

      <div className="mb-6">
        <div className="text-sm text-gray-400 font-medium mb-1">{chapterLabel(chapter.course_code, chapter.chapter_number)}</div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-3">{chapter.title}</h1>
        {chapter.learning_objectives && (
          <p className="text-gray-600 leading-relaxed">{chapter.learning_objectives}</p>
        )}
      </div>

      {topics.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3 border-b pb-2">
            Lessons in this chapter
          </h2>
          <ul className="divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden bg-white">
            {topics.map((topic) => {
              const sims = simsByTopic.get(topic.id) || [];
              const topicCurriculum = curriculumFor(topic);
              const hasPractice = practiceCount(topic) > 0;
              const code = topicCodeFor(topic, topicCurriculum);
              const locked = tier < topic.required_tier;
              return (
                <li
                  key={topic.id}
                  id={`topic-${topic.id}`}
                  className="px-4 py-3 scroll-mt-24 flex items-center justify-between gap-3"
                >
                  <span className="min-w-0">
                    <span className="text-gray-800 flex flex-wrap items-center gap-2">
                      {locked && <span title={`Requires ${tierName(topic.required_tier)}`}>🔒</span>}
                      <Link href={`/lessons/${topic.id}?c=${topicCurriculum}`} className="hover:text-blue-700 hover:underline">
                        {topic.topic_name}
                      </Link>
                      {locked && (
                        <span className="text-[10px] font-bold uppercase tracking-wide bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded-full">
                          {tierName(topic.required_tier)}
                        </span>
                      )}
                    </span>
                    <span className="block text-xs italic text-gray-400 mt-0.5">{syllabusRefLabel(topicCurriculum, code)}</span>
                  </span>
                  <span className="flex-shrink-0 flex items-center gap-2">
                    {hasPractice && (
                      <Link
                        href={`/practice/${topic.id}?c=${topicCurriculum}`}
                        className="text-xs font-semibold text-white bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded-full whitespace-nowrap"
                      >
                        🎯 Practice
                      </Link>
                    )}
                    {sims.map((sim) => (
                      <Link
                        key={sim.id}
                        href={sim.url_path}
                        className="text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-full whitespace-nowrap flex items-center gap-1.5"
                      >
                        <SimulationIcon className="w-3.5 h-3.5" />
                        {sims.length > 1 ? simShortName(sim.title) : 'Launch Simulation'}
                      </Link>
                    ))}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {simulations.length === 0 && !hasAnyPractice && (
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-5 text-center mb-8">
          <p className="text-gray-700 font-medium mb-1">📹 Video lessons & practice problems coming soon</p>
          <p className="text-sm text-gray-500">Your teacher is preparing content for this chapter.</p>
        </div>
      )}

      <div className="flex justify-between items-center border-t pt-4">
        {prev ? (
          <Link href={chapterHref(prev.id)} className="text-sm text-gray-600 hover:text-blue-600">
            ← {chapterLabel(chapter.course_code, prev.chapter_number)}
          </Link>
        ) : <span />}
        {next ? (
          <Link href={chapterHref(next.id)} className="text-sm text-gray-600 hover:text-blue-600">
            {chapterLabel(chapter.course_code, next.chapter_number)} →
          </Link>
        ) : <span />}
      </div>
    </div>
  );
}
