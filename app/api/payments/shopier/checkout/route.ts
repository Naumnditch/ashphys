/**
 * POST /api/payments/shopier/checkout
 * Admin-only for now (this is the test portal). Creates a pending
 * shopier_orders row and returns the signed form fields the client
 * auto-submits to Shopier's payment page.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { query } from '@/lib/db/client';
import {
  buildShopierFormFields,
  generatePlatformOrderId,
  generateRandomNr,
  SHOPIER_PAYMENT_URL,
} from '@/lib/shopier/client';

export async function POST(req: NextRequest) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Not authorized' }, { status: 403 });
  }

  const apiKey = process.env.SHOPIER_API_KEY;
  const apiSecret = process.env.SHOPIER_API_SECRET;
  if (!apiKey || !apiSecret) {
    return NextResponse.json(
      { success: false, error: 'Shopier is not configured — SHOPIER_API_KEY / SHOPIER_API_SECRET missing' },
      { status: 500 }
    );
  }

  const body = await req.json();
  const amount = Number(body.amount);
  if (!amount || amount <= 0) {
    return NextResponse.json({ success: false, error: 'A positive amount is required' }, { status: 400 });
  }
  const productName = (body.productName as string) || 'AshPhys test charge';

  const platformOrderId = generatePlatformOrderId();
  const randomNr = generateRandomNr();
  const totalOrderValue = amount.toFixed(2);

  await query(
    `INSERT INTO shopier_orders
       (platform_order_id, student_id, is_test, amount, currency, random_nr, status)
     VALUES ($1, $2, true, $3, 'TRY', $4, 'pending')`,
    [platformOrderId, admin.id, amount, randomNr]
  );

  const fields = buildShopierFormFields(
    {
      platformOrderId,
      productName,
      totalOrderValue,
      currency: 'TRY',
      randomNr,
    },
    {
      id: admin.id,
      name: admin.firstName || 'Test',
      surname: admin.lastName || 'User',
      email: admin.email,
      phone: '5555555555',
    },
    apiKey,
    apiSecret
  );

  return NextResponse.json({ success: true, paymentUrl: SHOPIER_PAYMENT_URL, fields });
}
