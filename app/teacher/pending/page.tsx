import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

export default async function TeacherPendingPage() {
  const user = await getCurrentUser();

  if (!user) redirect('/auth/login');
  if (user.role !== 'teacher') redirect('/dashboard');
  if (user.status === 'active') redirect('/teacher/dashboard');

  const isSuspended = user.status === 'suspended';

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div
          className={`w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center text-2xl ${
            isSuspended ? 'bg-red-50' : 'bg-amber-50'
          }`}
        >
          {isSuspended ? '⛔' : '⏳'}
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {isSuspended ? 'Account suspended' : 'Application under review'}
        </h1>

        <p className="text-gray-500 leading-relaxed mb-8">
          {isSuspended
            ? 'This teacher account has been suspended. If you believe this is a mistake, please get in touch.'
            : `Thanks for applying, ${user.firstName}. Abdelrahman reviews new teacher applications personally, usually within a day or two. You'll be able to access your dashboard here as soon as you're approved — no need to reapply.`}
        </p>

        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-50"
          >
            Back to Home
          </Link>
          <Link
            href="/contact"
            className="px-5 py-2.5 rounded-lg bg-gray-900 text-white font-medium text-sm hover:bg-black"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
