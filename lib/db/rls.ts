/**
 * Run queries under row-level security.
 *
 * The pool connects as the table owner, which bypasses RLS (see
 * database/seeds/2026-10-14-03-student-rls.sql). This helper opens a
 * transaction, drops to the non-owner role `ashphys_user` and records who
 * the caller is in `app.user_id`; the policies key off that. Both settings
 * are LOCAL, so they end with the transaction and never leak to the next
 * request that borrows this pooled connection.
 *
 * Pass the server-verified user from getCurrentUser() — never an id that
 * came from the request body. `null` means an anonymous visitor.
 */

import type { PoolClient } from 'pg';
import { getPool } from '@/lib/db/client';

export const RLS_ROLE = 'ashphys_user';

export async function withRlsContext<T>(
  user: { id: string } | null,
  fn: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await getPool().connect();
  try {
    await client.query('BEGIN');
    await client.query(`SET LOCAL ROLE ${RLS_ROLE}`);
    await client.query(`SELECT set_config('app.user_id', $1, true)`, [user?.id ?? '']);
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK').catch(() => undefined);
    throw err;
  } finally {
    client.release();
  }
}
