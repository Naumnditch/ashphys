/**
 * Signed-URL helper for the private `receipts` bucket.
 *
 * Payment receipts carry names, bank details and amounts, so the bucket is
 * deliberately private — a guessable public URL would expose one student's
 * banking information to anyone. Admin views go through short-lived signed
 * links generated server-side instead.
 */
export async function signedReceiptUrl(path: string, expiresIn = 600): Promise<string | null> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey || !path) return null;
  const res = await fetch(`${supabaseUrl}/storage/v1/object/sign/receipts/${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${serviceKey}`,
      apikey: serviceKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ expiresIn }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data?.signedURL ? `${supabaseUrl}/storage/v1${data.signedURL}` : null;
}
