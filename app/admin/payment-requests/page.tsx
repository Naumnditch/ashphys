import { query } from '@/lib/db/client';
import { PaymentRequestQueue } from '@/components/admin/PaymentRequestQueue';

export const dynamic = 'force-dynamic';

export default async function AdminPaymentRequestsPage() {
  const plans = await query(
    `SELECT id, name, tier_level FROM subscription_plans WHERE is_active AND tier_level > 0 ORDER BY tier_level`
  );
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Payment Receipts</h1>
      <p className="text-gray-500 text-sm mb-8 max-w-2xl">
        Students upload proof of payment and the amount is read automatically — if it confidently matches a plan
        price, that student's tier opens immediately and never lands here at all. What you see below is what the
        scanner couldn't confidently place: correct the plan or duration and approve, or reject.
      </p>
      <PaymentRequestQueue plans={plans.rows} />
    </div>
  );
}
