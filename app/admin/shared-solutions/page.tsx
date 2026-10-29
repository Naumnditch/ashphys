import { SharedSolutionReview } from '@/components/admin/SharedSolutionReview';

export const dynamic = 'force-dynamic';

export default function AdminSharedSolutionsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Student solutions</h1>
      <p className="text-gray-500 text-sm mb-6">
        Solutions students shared from their practice workspace, next to your handwritten solution. Approved ones appear on
        the question as &ldquo;Student solution by …&rdquo; beside the teacher solution, for students who open that
        question&rsquo;s worked solutions. Students can withdraw theirs at any time.
      </p>
      <SharedSolutionReview />
    </div>
  );
}
