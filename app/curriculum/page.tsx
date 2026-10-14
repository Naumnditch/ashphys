import { getCurrentUser } from '@/lib/auth/session';
import { getUserTier } from '@/lib/subscriptions/getUserTier';
import { CURRICULA, type CurriculumId } from '@/lib/curricula';
import { getLessonProgress, getLessonsByCurriculum, resolveCurriculum } from '@/lib/curricula/queries';
import { groupLessons, summarize, type LessonGroup } from '@/lib/curricula/lessons';
import { CurriculumSelector } from '@/components/curriculum/CurriculumSelector';
import { ChapterCard } from '@/components/curriculum/ChapterCard';
import type { LessonProgress } from '@/lib/curricula/courseLayout';
import { MASTERY_STREAK } from '@/lib/practice/attempts';

export const dynamic = 'force-dynamic';

async function loadGroups(curriculumId: CurriculumId): Promise<{ groups: LessonGroup[]; failed: boolean }> {
  try {
    return { groups: groupLessons(await getLessonsByCurriculum(curriculumId), curriculumId), failed: false };
  } catch (err) {
    console.error('Failed to load curriculum:', err);
    return { groups: [], failed: true };
  }
}

/** The viewer's practice records on these lessons, or undefined when logged out or on failure (the page then hides mastery). */
async function loadProgress(userId: string | undefined, groups: LessonGroup[]): Promise<Record<string, LessonProgress> | undefined> {
  if (!userId) return undefined;
  try {
    return await getLessonProgress(userId, groups.flatMap((g) => g.lessons.map((l) => l.id)), MASTERY_STREAK);
  } catch (err) {
    console.error('Failed to load lesson progress:', err);
    return undefined;
  }
}

const INTROS: Record<CurriculumId, string> = {
  igcse: 'Every chapter of the Cambridge IGCSE Physics coursebook, tagged with its 0625 syllabus section.',
  as: 'The Cambridge International AS Level (9702), following the coursebook: chapters 1–15 plus the P1 practical skills. Lessons that share an IGCSE simulation are listed under the chapter they support.',
  'a-level': 'The full Cambridge International A Level (9702), following the coursebook: all of AS plus chapters 16–31 and the P2 practical skills.',
  ib: 'IB Diploma Physics (SL & HL, first assessment 2025), by theme and subtopic. HL-only subtopics are marked (HL).',
};

/** Just this chapter's records, so each client card gets only what it shows. */
function progressFor(group: LessonGroup, progress: Record<string, LessonProgress>): Record<string, LessonProgress> {
  return Object.fromEntries(group.lessons.filter((l) => progress[l.id]).map((l) => [l.id, progress[l.id]]));
}

export default async function CurriculumPage({ searchParams }: { searchParams: { c?: string } }) {
  const user = await getCurrentUser();
  const [{ curriculumId, source }, tier] = await Promise.all([
    resolveCurriculum(searchParams.c, user?.id),
    user ? getUserTier(user.id) : Promise.resolve(0),
  ]);
  const curriculum = CURRICULA[curriculumId];
  const { groups, failed } = await loadGroups(curriculumId);
  const summary = summarize(groups);
  const progress = await loadProgress(user?.id, groups);
  const effectiveTier = user?.role === 'admin' ? Number.MAX_SAFE_INTEGER : tier;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Physics Curriculum</h1>
        <p className="text-gray-600">
          IGCSE, AS Level, A Level and IB Physics in one place. Simulations are shared by every curriculum; practice
          questions are written for each one.
        </p>
      </div>

      <CurriculumSelector selectedCurriculum={curriculumId} source={source} />

      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">{curriculum.name}</h2>
        <p className="text-sm text-gray-600 mt-1">{INTROS[curriculumId]}</p>
        {summary.lessons > 0 && (
          <p className="text-xs text-gray-500 mt-2">
            {summary.lessons} lessons · {summary.withSimulations} with simulations · {summary.questions}{' '}
            {curriculum.shortName} practice questions across {summary.withQuestions} lessons
          </p>
        )}
      </div>

      {failed && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center text-gray-700">
          We couldn&rsquo;t load the {curriculum.shortName} curriculum just now. Please refresh in a moment.
        </div>
      )}

      {!failed && groups.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center text-gray-700">
          <p className="font-medium">The {curriculum.name} lessons are being set up.</p>
          <p className="text-sm text-gray-500 mt-1">
            Check back soon, or switch to another curriculum above — the simulations work in all of them.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {groups.map((group) => (
          <ChapterCard
            key={group.key}
            group={group}
            curriculumId={curriculumId}
            tier={effectiveTier}
            progress={progress && progressFor(group, progress)}
            masteryStreak={MASTERY_STREAK}
            viewerId={user?.id}
          />
        ))}
      </div>
    </div>
  );
}
