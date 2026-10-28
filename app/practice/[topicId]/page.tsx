import { redirect, notFound } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { getUserTier } from '@/lib/subscriptions/getUserTier';
import { query } from '@/lib/db/client';
import { PracticeSession } from '@/components/practice/PracticeSession';
import { PracticeShell, PracticeTopBar } from '@/components/practice/PracticeShell';
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
  const isAdmin = user.role === 'admin';
  const allowed = isAdmin || tier >= topic.required_tier;
  // Which curriculum's question bank this session uses (see curriculumForTopic).
  const curriculumId = curriculumForTopic(topic.curriculum_ids, searchParams.c, preferred);
  const bank = `curriculum=${curriculumId}`;

  const lesson = {
    title: lessonTitle(topic.topic_name, curriculumId),
    refLabel: `${syllabusRefLabel(curriculumId, topicCodeFor(topic, curriculumId))} · Practice`,
    bankLabel: `${CURRICULA[curriculumId].displayName} question bank`,
    backHref: `/lessons/${topic.id}?c=${curriculumId}`,
  };
  const downloads = {
    worksheet: `/api/practice/${topic.id}/worksheet?${bank}`,
    answerKey: user.role === 'teacher' || isAdmin ? `/api/practice/${topic.id}/worksheet?answers=1&${bank}` : null,
  };

  return (
    <PracticeShell>
      {allowed ? (
        <PracticeSession
          key={curriculumId}
          topicId={topic.id}
          curriculumId={curriculumId}
          lesson={lesson}
          downloads={downloads}
          isAdmin={isAdmin}
        />
      ) : (
        <>
          <PracticeTopBar lesson={lesson} />
          <div className="flex-1 overflow-y-auto p-6">
            <LockedContent requiredTier={topic.required_tier} title={topic.topic_name} />
          </div>
        </>
      )}
    </PracticeShell>
  );
}
