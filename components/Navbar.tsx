import Link from 'next/link';
import Image from 'next/image';
import { query } from '@/lib/db/client';
import { CurriculumDropdown } from './CurriculumDropdown';

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

export async function Navbar() {
  const chapters = await getChapters();

  return (
    <header className="border-b border-gray-200">
      <div className="container-max py-4 flex items-center justify-between">
        <div className="flex items-center flex-1 mr-4">
          <div className="bg-black w-16 relative" style={{ height: '2.7px' }}>
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black" style={{ width: '2.7px', height: '10px' }}></div>
          </div>
          <Link href="/" className="text-xl font-semibold mx-1">
            <Image src="/assets/logo.png" alt="AshPhys" width={140} height={100} />
          </Link>
          <div className="bg-black flex-1 relative" style={{ height: '2.7px' }}>
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black" style={{ width: '2.7px', height: '10px' }}></div>
          </div>
        </div>
        <nav className="flex items-center gap-4">
          <Link className="text-sm hover:underline" href="/">Home</Link>
          <CurriculumDropdown chapters={chapters} />
          <Link className="text-sm hover:underline" href="/about">About Us</Link>
          <Link className="text-sm hover:underline" href="/resources">Resources</Link>
          <Link className="text-sm hover:underline" href="/contact">Contact</Link>
          <Link className="text-sm hover:underline text-blue-600 font-medium" href="/auth/login">Sign In</Link>
          <Link className="btn btn-primary text-sm" href="/auth/signup">Sign Up</Link>
          <Link className="btn btn-primary text-sm" href="/book">Book Now</Link>
        </nav>
      </div>
    </header>
  );
}
