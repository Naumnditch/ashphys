/**
 * POST /api/payments/shopier/callback
 * Shopier posts here after every payment attempt — this exact URL
 * must be pasted into the Shopier panel under
 * Özelleştirmeler → API Bilgileri → Geri Dönüş URL. Shopier does not
 * accept a per-request callback URL; it's one URL for the whole account.
 *
 * Security: this endpoint is PUBLIC (Shopier's servers call it directly,
 * no session cookie). The only thing that makes a callback trustworthy
 * is the HMAC signature — verify it before touching any data.
 */

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db/client';
import { verifyShopierCallback } from '@/lib/shopier/client';

function resultPage(status: string, orderId?: string) {
  const dest = `/payments/result?status=${status}${orderId ? `&orderId=${orderId}` : ''}`;
  // 200 OK with a meta-refresh: Shopier's server-to-server notification
  // (including the OSB test tool) almost certainly checks the immediate
  // HTTP status and does not follow redirects, so this endpoint must
  // answer 200 no matter what. A real shopper's browser still gets
  // bounced on to the proper results page via the meta-refresh.
  const html = `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0;url=${dest}"></head><body>OK</body></html>`;
  return new NextResponse(html, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}

// Some webhook/notification testers ping with a plain GET first to check
// reachability before sending the real POST — answer that too, just in case.
export async function GET() {
  return new NextResponse('OK', { status: 200 });
}

export async function POST(req: NextRequest) {
  const apiSecret = process.env.SHOPIER_API_SECRET;
  if (!apiSecret) {
    return new NextResponse('Not configured', { status: 200 });
  }

  const form = await req.formData();
  const fields = {
    status: String(form.get('status') || ''),
    platform_order_id: String(form.get('platform_order_id') || ''),
    payment_id: String(form.get('payment_id') || ''),
    installment: String(form.get('installment') || '0'),
    random_nr: String(form.get('random_nr') || ''),
    total_order_value: String(form.get('total_order_value') || ''),
    currency: String(form.get('currency') || '0'),
    signature: String(form.get('signature') || ''),
  };

  const rawBody: Record<string, string> = {};
  form.forEach((v, k) => { rawBody[k] = String(v); });

  // Always log the raw callback, signature outcome included — this is
  // the only way to see exactly what Shopier's OSB test actually sends,
  // since there's no public spec for its payload shape.
  const signatureValid = !!fields.platform_order_id && verifyShopierCallback(fields, apiSecret);

  if (!signatureValid) {
    await query(
      `UPDATE shopier_orders SET status = 'failed', raw_callback = $2, updated_at = now()
       WHERE platform_order_id = $1`,
      [fields.platform_order_id, JSON.stringify({ ...rawBody, signatureValid: false })]
    );
    return resultPage('invalid');
  }

  const orderResult = await query(`SELECT * FROM shopier_orders WHERE platform_order_id = $1`, [fields.platform_order_id]);
  if (orderResult.rows.length === 0) {
    // A real, valid, signed notification for an order we don't have a row
    // for (e.g. a purchase made through Shopier's own storefront rather
    // than our checkout) — still acknowledge with 200 so Shopier considers
    // the notification delivered; there's just nothing to update locally.
    return resultPage('unknown', fields.platform_order_id);
  }
  const order = orderResult.rows[0];

  const succeeded = fields.status.toLowerCase() === 'success';
  const newStatus = succeeded ? 'success' : 'failed';

  await query(
    `UPDATE shopier_orders
     SET status = $2, shopier_payment_id = $3, installment = $4, raw_callback = $5, updated_at = now()
     WHERE platform_order_id = $1`,
    [fields.platform_order_id, newStatus, fields.payment_id, parseInt(fields.installment, 10) || 0, JSON.stringify({ ...rawBody, signatureValid: true })]
  );

  if (succeeded) {
    await query(
      `INSERT INTO payment_logs (subscription_id, amount, currency, payment_method, status, iyzico_payment_id)
       VALUES (NULL, $1, 'TRY', 'shopier', 'success', $2)`,
      [order.amount, fields.payment_id]
    );

    // Real (non-test) orders activate/extend the student's subscription
    if (!order.is_test && order.student_id && order.plan_id) {
      const months = order.billing_cycle === 'yearly' ? 12 : 1;
      await query(
        `INSERT INTO subscriptions (student_id, plan_id, tier, status, billing_cycle, start_date, end_date)
         VALUES ($1, $2, 'premium', 'active', $3, now(), now() + ($4 || ' months')::interval)
         ON CONFLICT (student_id) DO UPDATE SET
           plan_id = EXCLUDED.plan_id,
           tier = 'premium',
           status = 'active',
           billing_cycle = EXCLUDED.billing_cycle,
           end_date = GREATEST(subscriptions.end_date, now()) + ($4 || ' months')::interval,
           updated_at = now()`,
        [order.student_id, order.plan_id, order.billing_cycle || 'monthly', months]
      );
    }
  }

  return resultPage(newStatus, fields.platform_order_id);
}
