import Link from 'next/link';
import { redirect, notFound } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { getUserTier } from '@/lib/subscriptions/getUserTier';
import { query } from '@/lib/db/client';
import { PracticeSession } from '@/components/practice/PracticeSession';
import { LockedContent } from '@/components/subscriptions/LockedContent';
import { CURRICULA, curriculumForTopic, lessonTitle, syllabusRefLabel, topicCodeFor } from '@/lib/curricula';
import { resolveCurriculum } from '@/lib/curricula/queries';

export const dynamic = 'force-dynamic';

async function getTopic(topicId: string) {
  const result = await query(
    `SELECT t.id, t.topic_name, t.required_tier, t.curriculum_ids,
            t.topic_code, t.as_topic_code, t.a_level_topic_code, t.ib_topic_code,
            c.id as chapter_id, c.chapter_number, c.title as chapter_title
     FROM topics t JOIN chapters c ON c.id = t.chapter_id
     WHERE t.id = $1`,
    [topicId]
  );
  return result.rows[0] || null;
}

export default async function PracticePage({
  params,
  searchParams,
}: {
  params: { topicId: string };
  searchParams: { c?: string };
}) {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');

  const topic = await getTopic(params.topicId);
  if (!topic) notFound();

  const [tier, { curriculumId: preferred }] = await Promise.all([getUserTier(user.id), resolveCurriculum(null, user.id)]);
  const allowed = user.role === 'admin' || tier >= topic.required_tier;
  // Which curriculum's question bank this session uses (see curriculumForTopic).
  const curriculumId = curriculumForTopic(topic.curriculum_ids, searchParams.c, preferred);
  const bank = `curriculum=${curriculumId}`;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link href={`/lessons/${topic.id}?c=${curriculumId}`} className="text-sm text-blue-600 hover:underline mb-6 inline-block">
        ← Back to the lesson
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
        <div>
          <div className="text-sm text-gray-400 font-medium mb-1">
            {syllabusRefLabel(curriculumId, topicCodeFor(topic, curriculumId))} · Practice
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{lessonTitle(topic.topic_name, curriculumId)}</h1>
          <p className="text-xs font-semibold text-[#5a67d8] mt-1">{CURRICULA[curriculumId].displayName} question bank</p>
        </div>
        {allowed && (
          <div className="flex flex-wrap gap-2">
            <a
              href={`/api/practice/${topic.id}/worksheet?${bank}`}
              download
              className="text-sm font-semibold bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-lg whitespace-nowrap"
            >
              Download PDF
            </a>
            {(user.role === 'teacher' || user.role === 'admin') && (
              <a
                href={`/api/practice/${topic.id}/worksheet?answers=1&${bank}`}
                download
                className="text-sm font-semibold border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg whitespace-nowrap"
              >
                Answer key PDF
              </a>
            )}
          </div>
        )}
      </div>

      {allowed ? (
        <PracticeSession key={curriculumId} topicId={topic.id} curriculumId={curriculumId} />
      ) : (
        <LockedContent requiredTier={topic.required_tier} title={topic.topic_name} />
      )}
    </div>
  );
}
