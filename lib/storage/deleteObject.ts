/**
 * Deletes one object from a Supabase Storage bucket with the service key
 * (server only). Used to roll back a screenshot whose request could not be
 * saved. Best effort: returns false instead of throwing.
 */
export async function deleteStorageObject(bucket: string, path: string): Promise<boolean> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey || !path) return false;
  try {
    const res = await fetch(`${supabaseUrl}/storage/v1/object/${bucket}/${path}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${serviceKey}`, apikey: serviceKey },
    });
    return res.ok;
  } catch (err) {
    console.error('deleteStorageObject failed', err);
    return false;
  }
}
