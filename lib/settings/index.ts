import { query } from '@/lib/db/client';

export interface BankSettings {
  enabled: boolean;
  accountName: string;
  iban: string;
  bankName: string;
  note: string;
}

/** Reads the site settings used by the public pricing page. */
export async function getBankSettings(): Promise<BankSettings> {
  const res = await query(`SELECT key, value FROM site_settings`);
  const map: Record<string, string> = {};
  for (const r of res.rows) map[r.key] = r.value ?? '';
  return {
    enabled: map['bank_transfer_enabled'] === 'true',
    accountName: map['bank_account_name'] ?? '',
    iban: map['bank_iban'] ?? '',
    bankName: map['bank_name'] ?? '',
    note: map['bank_note'] ?? '',
  };
}

/**
 * Short, stable reference a student quotes on their transfer so the payment
 * can be matched back to their account. Derived from the account id, so it
 * never changes and never needs storing separately.
 */
export function paymentReference(userId: string): string {
  return `ASH-${userId.replace(/-/g, '').slice(0, 6).toUpperCase()}`;
}
