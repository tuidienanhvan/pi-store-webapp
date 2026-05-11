import { create } from 'zustand';

import { persist } from 'zustand/middleware';

import { applyTheme, normalizeTheme, DEFAULT_THEME } from '../lib/theme';



/**

 * UI store ? theme (dark|light only).

 *

 * Theme actions push the new value to <html data-theme="..."> immediately so

 * React doesn't need a separate useEffect to sync DOM with state.

 */

export const useUiStore = create(

  persist(

    (set) => ({

      theme: DEFAULT_THEME,



      setTheme: (theme) => {

        const next = normalizeTheme(theme);

        applyTheme(next);

        set({ theme: next });

      },

      toggleTheme: () => set((s) => {

        const next = s.theme === 'dark' ? 'light' : 'dark';

        applyTheme(next);

        return { theme: next };

      }),

    }),

    {

      name: 'pi-ui',

      partialize: (s) => ({ theme: s.theme }),

      // Reconcile DOM with persisted theme after rehydration.

      onRehydrateStorage: () => (state) => {

        if (state) applyTheme(state.theme);

      },

    }

  )

);

