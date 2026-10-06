import Link from 'next/link';
import { redirect } from 'next/navigation';
import { query } from '@/lib/db/client';
import { getCurrentUser } from '@/lib/auth/session';
import { paymentReference, getBankSettings } from '@/lib/settings';
import { ReceiptUploadForm } from '@/components/ReceiptUploadForm';

export const dynamic = 'force-dynamic';

export default async function VerifyPaymentPage({ searchParams }: { searchParams: { course?: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login?next=/subscribe/verify');

  // Paid courses are optional here. The live `courses` table is shared with the
  // curriculum courses and may not have the paid-course columns (slug, price_try,
  // order), so a failure must not take down the receipt upload page.
  const emptyCourses = { rows: [] as any[] };
  const [plansRes, coursesRes, bank] = await Promise.all([
    query(`SELECT id, name, price_monthly, price_yearly, tier_level FROM subscription_plans WHERE is_active AND tier_level > 0 ORDER BY tier_level`),
    query(`SELECT id, title, slug, price_try FROM courses WHERE status = 'published' AND slug IS NOT NULL AND price_try IS NOT NULL ORDER BY "order", created_at`).catch((err: unknown) => {
      console.error('[subscribe/verify] paid courses unavailable, continuing without them:', err);
      return emptyCourses;
    }),
    getBankSettings(),
  ]);
  const preselectedCourse = searchParams.course
    ? coursesRes.rows.find((c: any) => c.slug === searchParams.course)?.id ?? ''
    : '';

  return (
    <div className="min-h-screen bg-[#faf7f0]" style={{ backgroundImage: 'radial-gradient(#e6ddc4 0.6px, transparent 0.6px)', backgroundSize: '18px 18px' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <p className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72] mb-2">Activate your access</p>
        <h1 className="text-[30px] font-bold text-[#1b2a41] mb-3" style={{ fontFamily: 'Georgia, serif' }}>
          Upload your payment receipt
        </h1>
        <p className="text-[14px] text-[#4a5a72] leading-snug mb-8 max-w-2xl">
          Already paid — by bank transfer or any other method? Upload the receipt here and your access will be
          activated once it has been checked. {bank.note}
        </p>

        <ReceiptUploadForm plans={plansRes.rows} courses={coursesRes.rows} preselectedCourse={preselectedCourse} reference={paymentReference(user.id)} />

        <p className="text-[12px] text-[#a8a196] mt-6">
          Not paid yet? See the <Link href="/pricing" className="text-[#2e7d6b] underline font-semibold">plans and payment details</Link>.
        </p>
      </div>
    </div>
  );
}
