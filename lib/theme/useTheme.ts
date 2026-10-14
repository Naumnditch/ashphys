'use client';

import { useEffect, useState } from 'react';
import { onThemeChange, resolveTheme } from './theme';

/**
 * The applied theme ('light' | 'dark'). Starts as 'light' for SSR/hydration and
 * corrects after mount. Put the returned value in a canvas draw effect's deps
 * so the canvas repaints when the user switches themes.
 */
export function useResolvedTheme(): 'light' | 'dark' {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  useEffect(() => {
    setTheme(resolveTheme());
    return onThemeChange(() => setTheme(resolveTheme()));
  }, []);
  return theme;
}
