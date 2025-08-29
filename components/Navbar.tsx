import Link from 'next/link';
import Image from 'next/image';

export function Navbar() {

  return (
    <header className="border-b border-gray-200">
      <div className="container-max py-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex items-center">
            <div className="h-px bg-black w-16 relative">
              <div className="absolute right-0 top-0 w-px h-4 bg-black"></div>
            </div>
            <Link href="/" className="text-xl font-semibold mx-4">
              <Image src="/assets/logo.png" alt="AshPhys" width={140} height={100} />
            </Link>
            <div className="flex items-center">
              <div className="h-px bg-black w-16 relative">
                <div className="absolute left-0 top-0 w-px h-4 bg-black"></div>
              </div>
            </div>
          </div>
        </div>
        <nav className="flex items-center gap-4">
          <Link className="text-sm hover:underline" href="/">Home</Link>
          <Link className="text-sm hover:underline" href="/about">About Us</Link>
          <Link className="text-sm hover:underline" href="/resources">Resources</Link>
          <Link className="text-sm hover:underline" href="/contact">Contact</Link>
          
        </nav>
      </div>
    </header>
  );
}


