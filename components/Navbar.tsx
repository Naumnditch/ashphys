import Link from 'next/link';
import Image from 'next/image';

export function Navbar() {

  return (
    <header className="border-b border-gray-200">
      <div className="container-max py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-semibold">
        <Image src="/assets/logo.png" alt="AshPhys" width={140} height={100} />
        </Link>
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


