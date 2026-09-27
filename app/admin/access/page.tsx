import { query } from '@/lib/db/client';
import { AccessManager } from '@/components/admin/AccessManager';

export const dynamic = 'force-dynamic';

async function getData() {
  const [plans, subs] = await Promise.all([
    query(`SELECT id, name, tier_level, price_monthly, price_yearly FROM subscription_plans WHERE is_active ORDER BY tier_level`),
    query(`
      SELECT u.id AS student_id, u.email, u.first_name, u.last_name,
             s.plan_id, p.name AS plan_name, p.tier_level,
             s.status::text AS status, s.end_date,
             FLOOR(EXTRACT(EPOCH FROM (s.end_date - now())) / 86400)::int AS days_left
      FROM users u
      LEFT JOIN subscriptions s ON s.student_id = u.id
      LEFT JOIN subscription_plans p ON p.id = s.plan_id
      WHERE u.role = 'student'
      ORDER BY (s.status = 'active') DESC, s.end_date DESC NULLS LAST, u.first_name NULLS LAST
    `),
  ]);
  return { plans: plans.rows, subs: subs.rows };
}

export default async function AdminAccessPage() {
  const { plans, subs } = await getData();
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Subscriber Access</h1>
      <p className="text-gray-500 text-sm mb-8 max-w-2xl">
        Most bank-transfer receipts now open the right tier automatically once the amount matches a plan price — see{' '}
        <a href="/admin/payment-requests" className="underline">Payment Receipts</a> for those still awaiting review.
        Use this page to grant access directly, correct a tier, or extend/revoke — for every student, not just those
        who already have a subscription.
      </p>
      <AccessManager plans={plans} initialSubs={subs} />
    </div>
  );
}
