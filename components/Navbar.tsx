import Link from 'next/link';
import Image from 'next/image';
import { query } from '@/lib/db/client';
import { CurriculumDropdown } from './CurriculumDropdown';
import { SearchBar } from './SearchBar';
import { getCurrentUser } from '@/lib/auth/session';

async function getChapters() {
  try {
    const result = await query(
      `SELECT id, chapter_number, title FROM chapters WHERE status = 'published' ORDER BY chapter_number ASC`
    );
    return result.rows;
  } catch (err) {
    console.error('Navbar: failed to load chapters', err);
    return [];
  }
}

function dashboardHref(user: NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>) {
  if (user.role === 'admin') return '/admin/teacher-applications';
  if (user.role === 'teacher') return user.status === 'active' ? '/teacher/dashboard' : '/teacher/pending';
  return '/dashboard';
}

export async function Navbar() {
  const [chapters, user] = await Promise.all([getChapters(), getCurrentUser()]);

  return (
    <header className="border-b border-gray-200">
      <div className="container-max py-4 flex items-center justify-between">
        <div className="flex items-center mr-4">
          <Link href="/" className="inline-flex items-center">
            <Image
              src="/assets/logo.png"
              alt="AshPhys"
              width={730}
              height={185}
              priority
              className="w-[210px] sm:w-[270px] h-auto"
            />
          </Link>
        </div>
        <nav className="flex items-center gap-3 sm:gap-4">
          <Link className="text-sm hover:underline hidden lg:inline-block" href="/">Home</Link>
          <CurriculumDropdown chapters={chapters} />
          <Link className="text-sm hover:underline hidden lg:inline-block" href="/about">About Us</Link>
          <Link className="text-sm hover:underline hidden xl:inline-block" href="/resources">Resources</Link>
          <Link className="text-sm hover:underline hidden xl:inline-block" href="/past-papers">Past Papers</Link>
          <Link className="text-sm hover:underline hidden xl:inline-block" href="/booklets">Booklets</Link>
          <Link className="text-sm hover:underline hidden lg:inline-block" href="/courses">Courses</Link>
          <Link className="text-sm hover:underline hidden lg:inline-block font-semibold text-blue-600" href="/pricing">Pricing</Link>
          <Link className="text-sm hover:underline hidden xl:inline-block" href="/contact">Contact</Link>
          <SearchBar />
          {user ? (
            <Link className="btn btn-primary text-sm whitespace-nowrap" href={dashboardHref(user)}>
              {user.role === 'admin' ? 'Admin' : 'Dashboard'}
            </Link>
          ) : (
            <>
              <Link className="text-sm hover:underline text-blue-600 font-medium whitespace-nowrap" href="/auth/login">Sign In</Link>
              <Link className="btn btn-primary text-sm whitespace-nowrap" href="/auth/signup">Sign Up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
