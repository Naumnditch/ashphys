import { query } from '@/lib/db/client';
import { AccessManager } from '@/components/admin/AccessManager';

export const dynamic = 'force-dynamic';

async function getData() {
  const [plans, subs] = await Promise.all([
    query(`SELECT id, name, tier_level, price_monthly, price_yearly FROM subscription_plans WHERE is_active ORDER BY tier_level`),
    query(`
      SELECT s.student_id, u.email, u.first_name, u.last_name, p.name AS plan_name,
             s.status::text AS status, s.end_date,
             FLOOR(EXTRACT(EPOCH FROM (s.end_date - now())) / 86400)::int AS days_left
      FROM subscriptions s
      JOIN users u ON u.id = s.student_id
      LEFT JOIN subscription_plans p ON p.id = s.plan_id
      ORDER BY s.end_date DESC NULLS LAST
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
        Grant access after a student pays through a Shopier product link or bank transfer. This works today and needs
        no payment API — the student pays, you confirm the order in your Shopier panel, then grant here.
      </p>
      <AccessManager plans={plans} initialSubs={subs} />
    </div>
  );
}
