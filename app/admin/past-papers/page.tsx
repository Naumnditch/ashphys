import { query } from '@/lib/db/client';
import { PastPaperManager } from '@/components/admin/PastPaperManager';
import { BulkPaperUpload } from '@/components/admin/BulkPaperUpload';

export const dynamic = 'force-dynamic';

async function getPapers() {
  const result = await query(
    `SELECT * FROM past_papers ORDER BY year DESC, session, paper_number ASC, variant ASC`
  );
  return result.rows;
}

export default async function AdminPastPapersPage() {
  const papers = await getPapers();
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Past Papers</h1>
      <p className="text-gray-500 text-sm mb-8">
        {papers.length} papers seeded from 2018 onward. Pick a session and paper below, attach the PDFs, and add the
        video link once a walkthrough is recorded. Entries with no files still appear to students with their buttons
        greyed out, so nothing ever shows as a broken link.
      </p>
      <BulkPaperUpload />
      <PastPaperManager initialPapers={papers} />
    </div>
  );
}
