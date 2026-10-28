'use client';

/**
 * Fullscreen for one element: the Fullscreen API where the browser allows it
 * on arbitrary elements (desktop, Android, iPadOS Safari), otherwise a CSS
 * fallback (iPhone Safari only allows it for <video>): the caller pins the
 * element with `fixed inset-0` while `fallback` is true, and page scrolling
 * underneath is locked.
 */

import { useCallback, useEffect, useState, type RefObject } from 'react';

type FsDocument = Document & { webkitFullscreenElement?: Element | null; webkitExitFullscreen?: () => Promise<void> | void };
type FsElement = HTMLElement & { webkitRequestFullscreen?: () => Promise<void> | void };

function fullscreenElement(): Element | null {
  const d = document as FsDocument;
  return d.fullscreenElement ?? d.webkitFullscreenElement ?? null;
}

export function useFullscreen(ref: RefObject<HTMLElement>) {
  const [native, setNative] = useState(false);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const onChange = () => setNative(!!ref.current && fullscreenElement() === ref.current);
    document.addEventListener('fullscreenchange', onChange);
    document.addEventListener('webkitfullscreenchange', onChange);
    return () => {
      document.removeEventListener('fullscreenchange', onChange);
      document.removeEventListener('webkitfullscreenchange', onChange);
    };
  }, [ref]);

  // Fallback: Escape exits, and the page behind can't scroll.
  useEffect(() => {
    if (!fallback) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setFallback(false);
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      html.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [fallback]);

  const enter = useCallback(async () => {
    const el = ref.current as FsElement | null;
    if (!el) return;
    const request = el.requestFullscreen ?? el.webkitRequestFullscreen;
    if (request) {
      try {
        await request.call(el);
        return;
      } catch {
        // Refused (iframe policy, iOS): fall through to the CSS version.
      }
    }
    setFallback(true);
  }, [ref]);

  const exit = useCallback(() => {
    const d = document as FsDocument;
    if (fullscreenElement()) {
      const leave = d.exitFullscreen ?? d.webkitExitFullscreen;
      leave?.call(d);
    }
    setFallback(false);
  }, []);

  const isFullscreen = native || fallback;
  const toggle = useCallback(() => (isFullscreen ? exit() : enter()), [isFullscreen, enter, exit]);

  return { isFullscreen, fallback, enter, exit, toggle };
}
