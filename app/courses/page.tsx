import Link from 'next/link';
import { getPublishedCourses } from '@/lib/courses';
import { getUsdRate, tryToUsd } from '@/lib/settings';

export const dynamic = 'force-dynamic';

export default async function CoursesPage() {
  const [courses, usdRate] = await Promise.all([getPublishedCourses(), getUsdRate()]);
  const categories = Array.from(new Set(courses.map((c) => c.category)));

  return (
    <div className="min-h-screen bg-[#faf7f0]" style={{ backgroundImage: 'radial-gradient(#e6ddc4 0.6px, transparent 0.6px)', backgroundSize: '18px 18px' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <p className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72] mb-2">Beyond the syllabus</p>
        <h1 className="text-[34px] font-bold text-[#1b2a41] mb-3" style={{ fontFamily: 'Georgia, serif' }}>
          Engineering Courses
        </h1>
        <p className="text-[14.5px] text-[#4a5a72] leading-snug mb-10 max-w-2xl">
          Practical engineering skills taught by a mechanical engineer and physics teacher — CAD, 3D printing, and the
          tools students actually meet at university and in industry. Separate from the IGCSE Physics course, bought
          individually.
        </p>

        {courses.length === 0 ? (
          <div className="bg-white border border-[#e4ddcc] rounded-xl p-8 text-center">
            <p className="text-[14px] text-[#4a5a72]">Courses are being prepared — check back soon.</p>
          </div>
        ) : (
          categories.map((cat) => (
            <div key={cat} className="mb-9">
              <h2 className="text-[15px] font-bold text-[#1b2a41] mb-3" style={{ fontFamily: 'Georgia, serif' }}>{cat}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courses.filter((c) => c.category === cat).map((c) => (
                  <Link
                    key={c.id}
                    href={`/courses/${c.slug}`}
                    className="bg-white border border-[#e4ddcc] rounded-xl p-5 hover:border-[#b8823d] transition-colors flex flex-col"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="text-[17px] font-bold text-[#1b2a41] leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
                        {c.title}
                      </h3>
                      {c.level && (
                        <span className="flex-shrink-0 text-[10px] font-bold uppercase tracking-wide bg-[#f6efdc] text-[#8f6428] px-2 py-0.5 rounded-full">
                          {c.level}
                        </span>
                      )}
                    </div>
                    {c.summary && <p className="text-[12.5px] text-[#4a5a72] leading-snug mb-3 flex-1">{c.summary}</p>}
                    <div className="flex items-baseline justify-between pt-2 border-t border-[#eee6d3]">
                      <div>
                        <span className="text-[19px] font-bold text-[#1b2a41]">{parseFloat(c.price_try).toFixed(0)}</span>
                        <span className="text-[12px] text-[#4a5a72] ml-1">TRY</span>
                        <span className="text-[11.5px] text-[#a8a196] ml-2">approx. ${tryToUsd(parseFloat(c.price_try), usdRate)}</span>
                      </div>
                      <span className="text-[11.5px] text-[#4a5a72]">{c.module_count} lesson{c.module_count === 1 ? '' : 's'}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
