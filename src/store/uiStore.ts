import { create } from 'zustand';
import type { Locale } from '@/i18n/dict';

interface UiState {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark';
  locale: Locale;
  hydrated: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  toggleCollapsed: () => void;
  toggleTheme: () => void;
  setLocale: (locale: Locale) => void;
  hydrate: () => void;
}

export const useUiStore = create<UiState>((set, get) => ({
  sidebarOpen: false,
  sidebarCollapsed: false,
  theme: 'light',
  locale: 'vi',
  hydrated: false,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  closeSidebar: () => set({ sidebarOpen: false }),
  toggleCollapsed: () => {
    const v = !get().sidebarCollapsed;
    set({ sidebarCollapsed: v });
    try { localStorage.setItem('ess:sidebar-collapsed', v ? '1' : '0'); } catch { /* ignore */ }
  },
  toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
  setLocale: (locale) => {
    set({ locale });
    try { localStorage.setItem('ess:locale', locale); } catch { /* ignore */ }
  },
  hydrate: () => {
    if (get().hydrated || typeof window === 'undefined') return;
    try {
      const theme = localStorage.getItem('ess:theme') === 'dark' ? 'dark' : 'light';
      const rawLocale = localStorage.getItem('ess:locale');
      const locale: Locale = rawLocale === 'en' ? 'en' : 'vi';
      const collapsed = localStorage.getItem('ess:sidebar-collapsed') === '1';
      set({ theme, locale, sidebarCollapsed: collapsed, hydrated: true });
      document.documentElement.classList.toggle('dark', theme === 'dark');
    } catch {
      set({ hydrated: true });
    }
  },
}));
