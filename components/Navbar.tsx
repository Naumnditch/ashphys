import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function Navbar() {
  const session = await getServerSession(authOptions);

  return (
    <header className="border-b border-gray-200">
      <div className="container-max py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-semibold">AshPhys</Link>
        <nav className="flex items-center gap-4">
          <Link className="text-sm hover:underline" href="/">Home</Link>
          <Link className="text-sm hover:underline" href="/about">About Us</Link>
          <Link className="text-sm hover:underline" href="/resources">Resources</Link>
          <Link className="text-sm hover:underline" href="/contact">Contact</Link>
          {session ? (
            <form action="/api/auth/signout" method="post">
              <button className="btn btn-secondary text-sm" type="submit">Sign out</button>
            </form>
          ) : (
            <Link className="btn btn-primary text-sm" href="/signin">Sign In / Create Account</Link>
          )}
        </nav>
      </div>
    </header>
  );
}


