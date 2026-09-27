/**
 * Reads a student's uploaded bank-transfer receipt (image or PDF, any of
 * the formats accepted in app/api/payment-requests/route.ts) and extracts
 * the amount actually transferred, using the Anthropic API directly (no
 * SDK dependency — this app already talks to a few other HTTP APIs by
 * fetch, so this follows the same pattern as lib/storage/signed.ts).
 *
 * This never decides who gets what plan — see lib/receipts/match-plan.ts
 * for that. This module's only job is: "what number, in what currency,
 * does this receipt say was paid, and how sure are we?"
 */

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-haiku-4-5-20251001';

export interface ReceiptAnalysis {
  amount: number | null;
  currency: string | null;
  confidence: 'high' | 'medium' | 'low' | 'none';
  note: string;
}

const NOT_CONFIGURED: ReceiptAnalysis = {
  amount: null,
  currency: null,
  confidence: 'none',
  note: 'Receipt scanning is not configured yet (missing ANTHROPIC_API_KEY).',
};

const PROMPT = `This image or PDF is a bank transfer / IBAN payment receipt sent by a student to pay for a physics tutoring subscription. Read it carefully and find:

1. The amount actually transferred (the total sent, not any balance-after figure).
2. The currency (assume TRY / Turkish Lira if the receipt is from a Turkish bank and no currency is shown).
3. How confident you are that you read the amount correctly.

Respond with ONLY a JSON object, no other text, in exactly this shape:
{"amount": <number or null>, "currency": "<3-letter code or null>", "confidence": "high" | "medium" | "low", "note": "<one short sentence, e.g. what you saw or why you're unsure>"}

If this doesn't look like a payment receipt at all, or you cannot find a clear amount, set "amount" to null and "confidence" to "low" and say why in "note".`;

function mediaTypeFor(mimeType: string): string {
  // Anthropic's vision input only recognizes these four image types.
  if (['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(mimeType)) return mimeType;
  return 'image/jpeg';
}

export async function analyzeReceipt(bytes: ArrayBuffer, mimeType: string): Promise<ReceiptAnalysis> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return NOT_CONFIGURED;

  const base64 = Buffer.from(bytes).toString('base64');
  const isPdf = mimeType === 'application/pdf';

  const contentBlock = isPdf
    ? { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: base64 } }
    : { type: 'image', source: { type: 'base64', media_type: mediaTypeFor(mimeType), data: base64 } };

  let res: Response;
  try {
    res = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 300,
        messages: [
          {
            role: 'user',
            content: [contentBlock, { type: 'text', text: PROMPT }],
          },
        ],
      }),
    });
  } catch (err: any) {
    return { amount: null, currency: null, confidence: 'none', note: `Could not reach the scanning service: ${err?.message ?? err}` };
  }

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    return { amount: null, currency: null, confidence: 'none', note: `Scanning service error (${res.status}): ${detail.slice(0, 200)}` };
  }

  const data = await res.json();
  const text: string = data?.content?.find((b: any) => b.type === 'text')?.text ?? '';

  try {
    const match = text.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(match ? match[0] : text);
    const amount = typeof parsed.amount === 'number' && Number.isFinite(parsed.amount) ? parsed.amount : null;
    const confidence = ['high', 'medium', 'low'].includes(parsed.confidence) ? parsed.confidence : 'low';
    return {
      amount,
      currency: typeof parsed.currency === 'string' ? parsed.currency.toUpperCase() : null,
      confidence: amount === null ? 'none' : confidence,
      note: typeof parsed.note === 'string' ? parsed.note.slice(0, 300) : '',
    };
  } catch {
    return { amount: null, currency: null, confidence: 'none', note: 'Could not parse the scanning result.' };
  }
}
