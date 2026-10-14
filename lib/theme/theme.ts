// Shared theme plumbing. The source of truth for the *applied* theme is the
// data-theme attribute on <html> (set before first paint by THEME_INIT_SCRIPT);
// when there is none, the OS preference decides (see app/theme.css).

export type ThemeChoice = 'light' | 'dark' | 'system';
export const THEME_STORAGE_KEY = 'ashphys-theme';
/** Fired on window whenever the applied theme changes, so canvas sims can repaint. */
export const THEME_CHANGE_EVENT = 'ashphys:themechange';

// Inline <head> script: runs before first paint so there is no flash of the
// wrong theme. localStorage can throw (blocked storage, private windows), so
// everything is inside try/catch and the CSS media query is the fallback.
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

export function readStoredTheme(): ThemeChoice {
  try {
    const t = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (t === 'light' || t === 'dark') return t;
  } catch {
    /* storage unavailable */
  }
  return 'system';
}

export function storeTheme(choice: ThemeChoice) {
  try {
    if (choice === 'system') window.localStorage.removeItem(THEME_STORAGE_KEY);
    else window.localStorage.setItem(THEME_STORAGE_KEY, choice);
  } catch {
    /* storage unavailable: the choice still applies for this page view */
  }
}

export function applyTheme(choice: ThemeChoice) {
  const root = document.documentElement;
  if (choice === 'system') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', choice);
}

/** The theme actually in effect right now. */
export function resolveTheme(): 'light' | 'dark' {
  const attr = document.documentElement.getAttribute('data-theme');
  if (attr === 'light' || attr === 'dark') return attr;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/** Calls `cb` whenever the applied theme may have changed. Returns an unsubscribe. */
export function onThemeChange(cb: () => void): () => void {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  mq.addEventListener('change', cb);
  return () => {
    mo.disconnect();
    mq.removeEventListener('change', cb);
  };
}
