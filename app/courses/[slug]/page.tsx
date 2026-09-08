import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCourseBySlug, getModules, isEnrolled } from '@/lib/courses';
import { getCurrentUser } from '@/lib/auth/session';
import { getUsdRate, tryToUsd, getBankSettings, paymentReference } from '@/lib/settings';

export const dynamic = 'force-dynamic';

export default async function CourseDetailPage({ params }: { params: { slug: string } }) {
  const course = await getCourseBySlug(params.slug);
  if (!course || course.status !== 'published') notFound();

  const [modules, user, usdRate, bank] = await Promise.all([
    getModules(course.id),
    getCurrentUser(),
    getUsdRate(),
    getBankSettings(),
  ]);

  const enrolled = user ? await isEnrolled(user.id, course.id) : false;
  const price = parseFloat(course.price_try);

  return (
    <div className="min-h-screen bg-[#faf7f0]" style={{ backgroundImage: 'radial-gradient(#e6ddc4 0.6px, transparent 0.6px)', backgroundSize: '18px 18px' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <Link href="/courses" className="text-[12.5px] text-[#4a5a72] hover:underline">← All courses</Link>

        <div className="flex flex-wrap items-start justify-between gap-3 mt-4 mb-2">
          <div>
            <p className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72] mb-1">{course.category}</p>
            <h1 className="text-[30px] font-bold text-[#1b2a41] leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
              {course.title}
            </h1>
          </div>
          {enrolled && (
            <span className="text-[11px] font-bold uppercase tracking-wide bg-[#e6f2ee] text-[#1b5c4d] px-3 py-1 rounded-full">
              ✓ Enrolled
            </span>
          )}
        </div>

        {course.summary && <p className="text-[14.5px] text-[#4a5a72] leading-snug mb-6 max-w-2xl">{course.summary}</p>}

        {course.description && (
          <div className="bg-white border border-[#e4ddcc] rounded-xl p-5 mb-6">
            <p className="text-[13.5px] text-[#4a5a72] leading-relaxed whitespace-pre-line">{course.description}</p>
          </div>
        )}

        {/* ---- purchase panel ---- */}
        {!enrolled && (
          <div className="bg-white border-2 border-[#b8823d] rounded-xl p-6 mb-8">
            <div className="flex flex-wrap items-baseline justify-between gap-3 mb-3">
              <div>
                <span className="text-[30px] font-bold text-[#1b2a41]">{price.toFixed(0)}</span>
                <span className="text-[13px] text-[#4a5a72] ml-1">TRY</span>
                <span className="text-[12.5px] text-[#a8a196] ml-2">approx. ${tryToUsd(price, usdRate)} USD</span>
              </div>
              <span className="text-[12px] text-[#4a5a72]">
                {modules.length} lesson{modules.length === 1 ? '' : 's'} · lifetime access
              </span>
            </div>

            {bank.enabled && bank.iban ? (
              <>
                <p className="text-[13px] text-[#4a5a72] leading-snug mb-3">
                  Transfer {price.toFixed(0)} TRY to the account below{user ? '' : ' after creating your account'}, then
                  upload the receipt to unlock the course.
                </p>
                <div className="bg-[#faf7f0] border border-[#eee6d3] rounded-lg p-3.5 mb-3 space-y-1.5">
                  {bank.accountName && (
                    <div className="flex flex-wrap justify-between gap-2">
                      <span className="text-[12px] text-[#4a5a72]">Account holder</span>
                      <span className="font-mono text-[12.5px] font-bold text-[#1b2a41]">{bank.accountName}</span>
                    </div>
                  )}
                  <div className="flex flex-wrap justify-between gap-2">
                    <span className="text-[12px] text-[#4a5a72]">IBAN</span>
                    <span className="font-mono text-[13px] font-bold text-[#1b2a41] break-all">{bank.iban}</span>
                  </div>
                  {user && (
                    <div className="flex flex-wrap justify-between gap-2 border-t border-[#eee6d3] pt-1.5">
                      <span className="text-[12px] text-[#4a5a72]">Your reference</span>
                      <span className="font-mono text-[13px] font-bold text-[#1b5c4d]">{paymentReference(user.id)}</span>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <p className="text-[13px] text-[#4a5a72] leading-snug mb-3">
                Contact your teacher to arrange payment for this course.
              </p>
            )}

            <Link
              href={user ? `/subscribe/verify?course=${course.slug}` : `/auth/signup?next=/courses/${course.slug}`}
              className="block text-center text-[13.5px] font-semibold px-4 py-2.5 rounded-lg bg-[#1b2a41] text-white hover:bg-[#243a5e]"
            >
              {user ? 'Already paid? Upload your receipt →' : 'Create an account to enrol →'}
            </Link>
          </div>
        )}

        {/* ---- module list ---- */}
        <h2 className="text-[15px] font-bold text-[#1b2a41] mb-3" style={{ fontFamily: 'Georgia, serif' }}>
          Course content
        </h2>
        {modules.length === 0 ? (
          <div className="bg-white border border-[#e4ddcc] rounded-xl p-6 text-center text-[13px] text-[#4a5a72]">
            Lessons are being added to this course.
          </div>
        ) : (
          <div className="bg-white border border-[#e4ddcc] rounded-xl overflow-hidden divide-y divide-[#eee6d3]">
            {modules.map((m, i) => {
              const open = enrolled || m.is_free_preview;
              return (
                <div key={m.id} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-[11px] text-[#a8a196]">{String(i + 1).padStart(2, '0')}</span>
                        <span className="font-semibold text-[14.5px] text-[#1b2a41]">{m.title}</span>
                        {m.is_free_preview && !enrolled && (
                          <span className="text-[9.5px] font-bold uppercase tracking-wide bg-[#e6f2ee] text-[#1b5c4d] px-1.5 py-0.5 rounded">
                            free preview
                          </span>
                        )}
                      </div>
                      {m.description && <p className="text-[12.5px] text-[#4a5a72] leading-snug mt-1">{m.description}</p>}
                      {open && (
                        <div className="flex gap-3 mt-2">
                          {m.video_url && (
                            <a href={m.video_url} target="_blank" rel="noopener noreferrer"
                              className="text-[12.5px] font-semibold text-[#2e7d6b] underline">▶ Watch lesson</a>
                          )}
                          {m.resource_url && (
                            <a href={m.resource_url} target="_blank" rel="noopener noreferrer"
                              className="text-[12.5px] font-semibold text-[#8f6428] underline">↓ Files</a>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex-shrink-0 text-right">
                      {m.duration_minutes ? <div className="text-[11.5px] text-[#a8a196]">{m.duration_minutes} min</div> : null}
                      {!open && <div className="text-[15px] text-[#c9c0aa] mt-0.5">🔒</div>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
