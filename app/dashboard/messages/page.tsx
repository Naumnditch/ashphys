import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

/**
 * Old address of the student inbox, still linked from sent emails
 * ("View in AshPhys", /dashboard/messages#m-<id>). The inbox now lives in the
 * dashboard's Messages tab; the #m- fragment survives the redirect.
 */
export default async function MessagesPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');
  // Admins manage every conversation from the admin mailbox.
  if (user.role === 'admin') redirect(`/admin/messages${searchParams.s ? `?s=${encodeURIComponent(searchParams.s)}` : ''}`);
  redirect('/dashboard?tab=messages');
}
