import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function SignInPage() {
  const session = await getServerSession(authOptions);
  if (session) redirect('/');
  return (
    <div className="space-y-4 max-w-md mx-auto">
      <h1 className="text-2xl font-semibold">Sign In / Create Account</h1>
      <form action="/api/auth/signin/github" method="post">
        <button className="btn btn-primary w-full" type="submit">Continue with GitHub</button>
      </form>
      <p className="text-sm text-gray-600">
        You must be signed in to book sessions or purchase resources.
      </p>
      <Link href="/" className="text-sm underline">Back to Home</Link>
    </div>
  );
}


