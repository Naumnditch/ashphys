'use client';

import { usePathname } from 'next/navigation';

/**
 * Re-mounts on every navigation, so the main content fades and rises in
 * (~200 ms, see .fb-page-enter in globals.css). The practice page is a
 * position:fixed app: a transform on this wrapper would re-anchor it for the
 * length of the animation, so it only fades.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const fadeOnly = pathname?.startsWith('/practice/');
  return <div className={fadeOnly ? 'fb-page-enter-fade' : 'fb-page-enter'}>{children}</div>;
}
