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

/**
 * OSB (Otomatik Sipariş Bildirimi) — the ACTUAL notification contract,
 * taken verbatim from Shopier's own "OSB örnek kodunu görüntüle" example
 * (not reverse-engineered — this is straight from their panel). Totally
 * different shape from the classic-gateway callback fields above:
 *  - incoming POST fields are just `res` (base64 JSON) and `hash`
 *  - hash = hex HMAC-SHA256 of (res + osbUsername), keyed with osbSecret
 *    — HEX, not base64, and no random_nr/currency concatenation at all
 *  - the only valid success response is the literal text "success"
 */
export interface ShopierOsbOrder {
  email: string;
  orderid: string;
  currency: number; // 0 TRY, 1 USD, 2 EUR
  price: string;
  buyername: string;
  buyersurname: string;
  productcount: string;
  productid: string;
  productlist: string;
  chartdetails: string;
  customernote: string;
  istest: string; // '0' live, '1' test
}

export function verifyOsbHash(res: string, osbUsername: string, hash: string, osbSecret: string): boolean {
  const expected = crypto.createHmac('sha256', osbSecret).update(res + osbUsername, 'utf8').digest('hex');
  const a = Buffer.from(expected);
  const b = Buffer.from(hash || '');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export function decodeOsbPayload(res: string): ShopierOsbOrder {
  const json = Buffer.from(res, 'base64').toString('utf8');
  return JSON.parse(json);
}

export function generatePlatformOrderId(): string {
  return `ashp-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
}

export function generateRandomNr(): string {
  return crypto.randomBytes(16).toString('hex');
}
