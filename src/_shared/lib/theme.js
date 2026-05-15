/**

 * Theme module ? exactly 2 modes: 'dark' | 'light'.

 *

 * Source of truth: `useUiStore` (Zustand persisted to localStorage key 'pi-ui').

 * Initial paint: handled by the inline <script> in index.html that runs BEFORE

 * React mounts ? prevents flash-of-wrong-theme (FOUC).

 *

 * CSS in `index.css` targets `[data-theme="dark"]` / `[data-theme="light"]`

 * on the <html> element. Nothing else is needed.

 */



export const DEFAULT_THEME = 'dark';



/** Coerce any value to a valid theme name. Anything that isn't 'light' becomes 'dark'. */

export function normalizeTheme(value) {

  return value === 'light' ? 'light' : 'dark';

}



/**

 * Apply a theme to <html>. Idempotent ? calling repeatedly with the same value

 * does no extra work because writing the same dataset value is a no-op repaint.

 */

export function applyTheme(mode) {

  if (typeof document === 'undefined') return;

  document.documentElement.dataset.theme = normalizeTheme(mode);

}

