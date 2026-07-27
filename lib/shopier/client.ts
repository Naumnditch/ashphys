/**
 * Shopier payment gateway helper.
 *
 * Shopier is NOT a JSON/REST API — it's a classic form-post gateway:
 * the browser is redirected with a signed HTML form to
 * https://www.shopier.com/ShowProduct/api_pay4.php, the shopper pays
 * there, and Shopier POSTs the result back to a callback URL that is
 * configured once in the Shopier merchant panel (Özelleştirmeler →
 * API Bilgileri → Geri Dönüş URL) — NOT passed per-request.
 *
 * Signature (both directions): base64(HMAC-SHA256(random_nr +
 * platform_order_id + total_order_value + currency, api_secret))
 * Reverse-engineered from Shopier's own PHP examples; there is no
 * official public spec.
 */

import crypto from 'crypto';

export const SHOPIER_PAYMENT_URL = 'https://www.shopier.com/ShowProduct/api_pay4.php';

// Shopier's currency codes for this form (not ISO 4217)
export const CURRENCY_CODE: Record<string, number> = { TRY: 0, USD: 1, EUR: 2 };

export interface ShopierBuyer {
  id: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
}

export interface ShopierOrder {
  platformOrderId: string;
  productName: string;
  totalOrderValue: string; // fixed 2-decimal string, e.g. "99.00" — must match exactly what's signed
  currency: 'TRY' | 'USD' | 'EUR';
  randomNr: string;
}

function buildSignature(randomNr: string, platformOrderId: string, totalOrderValue: string, currencyCode: number, apiSecret: string): string {
  const data = `${randomNr}${platformOrderId}${totalOrderValue}${currencyCode}`;
  return crypto.createHmac('sha256', apiSecret).update(data, 'utf8').digest('base64');
}

/** Builds the full field set for the auto-submitting payment form. */
export function buildShopierFormFields(
  order: ShopierOrder,
  buyer: ShopierBuyer,
  apiKey: string,
  apiSecret: string
): Record<string, string> {
  const currencyCode = CURRENCY_CODE[order.currency];
  const signature = buildSignature(order.randomNr, order.platformOrderId, order.totalOrderValue, currencyCode, apiSecret);

  return {
    API_key: apiKey,
    website_index: '1',
    platform_order_id: order.platformOrderId,
    product_name: order.productName,
    product_type: '1', // 1 = digital/downloadable, 0 = physical — AshPhys sells digital access
    buyer_name: buyer.name,
    buyer_surname: buyer.surname,
    buyer_email: buyer.email,
    buyer_account_age: '0',
    buyer_id_nr: buyer.id,
    buyer_phone: buyer.phone,
    billing_address: 'Online delivery — no physical address',
    billing_city: 'Istanbul',
    billing_country: 'Turkey',
    billing_postcode: '34000',
    shipping_address: 'Online delivery — no physical address',
    shipping_city: 'Istanbul',
    shipping_country: 'Turkey',
    shipping_postcode: '34000',
    total_order_value: order.totalOrderValue,
    currency: String(currencyCode),
    platform: '0',
    is_in_frame: '0',
    current_language: '0',
    modul_version: '1.0.4',
    random_nr: order.randomNr,
    signature,
  };
}

export interface ShopierCallbackFields {
  status: string;
  platform_order_id: string;
  payment_id: string;
  installment: string;
  random_nr: string;
  total_order_value: string;
  currency: string;
  signature: string;
}

/** Verifies a callback's signature using the values Shopier itself sent. */
export function verifyShopierCallback(fields: ShopierCallbackFields, apiSecret: string): boolean {
  const expected = buildSignature(
    fields.random_nr,
    fields.platform_order_id,
    fields.total_order_value,
    parseInt(fields.currency, 10),
    apiSecret
  );
  const a = Buffer.from(expected);
  const b = Buffer.from(fields.signature || '');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export function generatePlatformOrderId(): string {
  return `ashp-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
}

export function generateRandomNr(): string {
  return crypto.randomBytes(16).toString('hex');
}
