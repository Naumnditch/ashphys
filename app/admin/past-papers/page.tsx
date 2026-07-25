import { query } from '@/lib/db/client';
import { PastPaperManager } from '@/components/admin/PastPaperManager';

export const dynamic = 'force-dynamic';

async function getPapers() {
  const result = await query(`SELECT * FROM past_papers ORDER BY year DESC, paper_number ASC, variant ASC`);
  return result.rows;
}

export default async function AdminPastPapersPage() {
  const papers = await getPapers();
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Past Papers</h1>
      <p className="text-gray-500 text-sm mb-8">
        {papers.length} {papers.length === 1 ? 'entry' : 'entries'}. Question-paper and mark-scheme fields take a URL —
        upload the PDF to storage first, then paste its link here.
      </p>
      <PastPaperManager initialPapers={papers} />
    </div>
  );
}
