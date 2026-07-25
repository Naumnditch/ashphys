import Link from 'next/link';
import { query } from '@/lib/db/client';

export const dynamic = 'force-dynamic';

interface PastPaper {
  id: string;
  year: number;
  session: string;
  paper_number: number;
  variant: number;
  question_paper_url: string | null;
  mark_scheme_url: string | null;
  explanation_status: 'coming_soon' | 'published';
  explanation_video_url: string | null;
}

const PAPER_LABELS: Record<number, string> = {
  1: 'Paper 1 · Multiple Choice (Core)',
  2: 'Paper 2 · Multiple Choice (Extended)',
  3: 'Paper 3 · Theory (Core)',
  4: 'Paper 4 · Theory (Extended)',
  5: 'Paper 5 · Practical Test',
  6: 'Paper 6 · Alternative to Practical',
};

const SESSION_ORDER: Record<string, number> = { 'Feb/Mar': 0, 'May/Jun': 1, 'Oct/Nov': 2 };

async function getPapers(): Promise<PastPaper[]> {
  const result = await query(`
    SELECT id, year, session, paper_number, variant, question_paper_url, mark_scheme_url,
           explanation_status, explanation_video_url
    FROM past_papers
    ORDER BY year DESC, paper_number ASC, variant ASC
  `);
  return result.rows;
}

export default async function PastPapersPage({
  searchParams,
}: {
  searchParams: { paper?: string; year?: string };
}) {
  const papers = await getPapers();
  const paperFilter = searchParams.paper ? parseInt(searchParams.paper, 10) : null;
  const yearFilter = searchParams.year ? parseInt(searchParams.year, 10) : null;

  const years = Array.from(new Set(papers.map((p) => p.year))).sort((a, b) => b - a);
  const filtered = papers.filter(
    (p) => (paperFilter === null || p.paper_number === paperFilter) && (yearFilter === null || p.year === yearFilter)
  );

  const grouped = new Map<string, PastPaper[]>();
  for (const p of filtered) {
    const key = `${p.year} · ${p.session}`;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(p);
  }
  const groupKeys = Array.from(grouped.keys()).sort((a, b) => {
    const [ya, sa] = a.split(' · ');
    const [yb, sb] = b.split(' · ');
    if (ya !== yb) return parseInt(yb, 10) - parseInt(ya, 10);
    return SESSION_ORDER[sb] - SESSION_ORDER[sa];
  });

  const buildHref = (params: { paper?: number | null; year?: number | null }) => {
    const sp = new URLSearchParams();
    const p = params.paper !== undefined ? params.paper : paperFilter;
    const y = params.year !== undefined ? params.year : yearFilter;
    if (p !== null && p !== undefined) sp.set('paper', String(p));
    if (y !== null && y !== undefined) sp.set('year', String(y));
    const qs = sp.toString();
    return qs ? `/past-papers?${qs}` : '/past-papers';
  };

  return (
    <div className="min-h-screen bg-[#faf7f0]" style={{ backgroundImage: 'radial-gradient(#e6ddc4 0.6px, transparent 0.6px)', backgroundSize: '18px 18px' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <p className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72] mb-2">
          Cambridge IGCSE Physics · 0625
        </p>
        <h1 className="text-[32px] font-bold text-[#1b2a41] mb-2" style={{ fontFamily: 'Georgia, serif' }}>
          Past Papers
        </h1>
        <p className="text-[14px] text-[#4a5a72] leading-snug mb-8 max-w-2xl">
          The question papers and mark schemes here are for reference — download your copy from{' '}
          <a
            href="https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-igcse-physics-0625/past-papers/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#2e7d6b] font-semibold underline"
          >
            Cambridge International's own past-papers portal
          </a>{' '}
          or your school's access point. Every paper here is paired with a full video walkthrough — solved and
          explained lesson by lesson, not just answered.
        </p>

        {/* Paper number filter */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Link
            href={buildHref({ paper: null })}
            className={`text-[13px] font-semibold px-3.5 py-1.5 rounded-full border ${
              paperFilter === null
                ? 'bg-[#1b2a41] text-white border-[#1b2a41]'
                : 'bg-white text-[#1b2a41] border-[#d8cfb6] hover:bg-[#f5f0e2]'
            }`}
          >
            All Papers
          </Link>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <Link
              key={n}
              href={buildHref({ paper: n })}
              className={`text-[13px] font-semibold px-3.5 py-1.5 rounded-full border ${
                paperFilter === n
                  ? 'bg-[#1b2a41] text-white border-[#1b2a41]'
                  : 'bg-white text-[#1b2a41] border-[#d8cfb6] hover:bg-[#f5f0e2]'
              }`}
            >
              Paper {n}
            </Link>
          ))}
        </div>

        {/* Year filter */}
        {years.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <Link
              href={buildHref({ year: null })}
              className={`text-[12px] font-semibold px-3 py-1 rounded-full border ${
                yearFilter === null
                  ? 'bg-[#2e7d6b] text-white border-[#2e7d6b]'
                  : 'bg-white text-[#4a5a72] border-[#e4ddcc] hover:bg-[#f5f0e2]'
              }`}
            >
              All Years
            </Link>
            {years.map((y) => (
              <Link
                key={y}
                href={buildHref({ year: y })}
                className={`text-[12px] font-semibold px-3 py-1 rounded-full border ${
                  yearFilter === y
                    ? 'bg-[#2e7d6b] text-white border-[#2e7d6b]'
                    : 'bg-white text-[#4a5a72] border-[#e4ddcc] hover:bg-[#f5f0e2]'
                }`}
              >
                {y}
              </Link>
            ))}
          </div>
        )}

        {groupKeys.length === 0 && (
          <div className="bg-white border border-[#e4ddcc] rounded-xl p-8 text-center">
            <p className="text-[14px] text-[#4a5a72]">
              No papers match this filter yet — the library is being built out session by session.
            </p>
          </div>
        )}

        {groupKeys.map((key) => (
          <div key={key} className="mb-8">
            <h2 className="text-[15px] font-bold text-[#1b2a41] mb-3" style={{ fontFamily: 'Georgia, serif' }}>
              {key}
            </h2>
            <div className="bg-white border border-[#e4ddcc] rounded-xl overflow-hidden divide-y divide-[#eee6d3]">
              {grouped.get(key)!.map((p) => (
                <div key={p.id} className="px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-semibold text-[#1b2a41] text-[14.5px]">
                      {PAPER_LABELS[p.paper_number] || `Paper ${p.paper_number}`}
                    </div>
                    <div className="text-[12px] text-[#4a5a72]">Variant {p.variant} · 0625</div>
                  </div>
                  <div className="flex items-center gap-4 flex-wrap">
                    {p.question_paper_url ? (
                      <a href={p.question_paper_url} target="_blank" rel="noopener noreferrer" className="text-[13px] font-semibold text-[#2e7d6b] underline">
                        Question Paper
                      </a>
                    ) : (
                      <span className="text-[13px] text-[#a8a196]">Question Paper</span>
                    )}
                    {p.mark_scheme_url ? (
                      <a href={p.mark_scheme_url} target="_blank" rel="noopener noreferrer" className="text-[13px] font-semibold text-[#2e7d6b] underline">
                        Mark Scheme
                      </a>
                    ) : (
                      <span className="text-[13px] text-[#a8a196]">Mark Scheme</span>
                    )}
                    {p.explanation_status === 'published' && p.explanation_video_url ? (
                      <a
                        href={p.explanation_video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[12px] font-bold px-3 py-1 rounded-full bg-[#1b2a41] text-white"
                      >
                        ▶ Watch Explanation
                      </a>
                    ) : (
                      <span className="text-[12px] font-semibold px-3 py-1 rounded-full bg-[#f6efdc] text-[#8f6428] border border-[#e6d9b8]">
                        Explanation: Coming Soon
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
