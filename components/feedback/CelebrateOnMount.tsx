'use client';

import { useEffect, useRef } from 'react';
import { celebrateUpgrade } from '@/lib/feedback';

/**
 * Fires the upgrade celebration once when it mounts, anchored on its own
 * position. `onceKey` (e.g. the order id) keeps a reload of the same page from
 * celebrating again. The fanfare only sounds if the page has already had a
 * user interaction (browsers block audio on a fresh page load); the sparkle
 * always shows unless reduced motion is on.
 */
export function CelebrateOnMount({ onceKey, children }: { onceKey?: string; children?: React.ReactNode }) {
  const anchor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const key = onceKey ? `ashphys:celebrated:${onceKey}` : null;
    try {
      if (key && sessionStorage.getItem(key)) return;
      if (key) sessionStorage.setItem(key, '1');
    } catch {
      /* blocked storage: celebrate anyway */
    }
    celebrateUpgrade(anchor.current);
  }, [onceKey]);

  return <div ref={anchor}>{children}</div>;
}
