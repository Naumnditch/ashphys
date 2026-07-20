/**
 * Server-side session helper.
 * Reads the JWT from the httpOnly cookie (set at login/signup) so
 * Server Components and API routes can identify the current user
 * without relying on client-side localStorage.
 */

import { cookies } from 'next/headers';
import { verifyToken } from './jwt';
import { query } from '@/lib/db/client';

export interface CurrentUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'teacher' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  sectionId: string | null;
}

/**
 * Returns the current user with FRESH status/role from the database
 * (not just what was in the JWT at login time), since a teacher's
 * approval status can change after their token was issued.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const token = cookies().get('token')?.value;
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  try {
    const result = await query(
      `SELECT id, email, first_name, last_name, role, status, section_id
       FROM users WHERE id = $1`,
      [payload.id]
    );
    if (result.rows.length === 0) return null;
    const row = result.rows[0];
    return {
      id: row.id,
      email: row.email,
      firstName: row.first_name,
      lastName: row.last_name,
      role: row.role,
      status: row.status,
      sectionId: row.section_id,
    };
  } catch (err) {
    console.error('getCurrentUser: failed to load user', err);
    return null;
  }
}
