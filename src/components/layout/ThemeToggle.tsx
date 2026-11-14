'use client';

import { useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useUiStore } from '@/store/uiStore';
import { useDictionary } from '@/i18n/useDictionary';

export default function ThemeToggle() {
  const theme = useUiStore((s) => s.theme);
  const toggleTheme = useUiStore((s) => s.toggleTheme);
  const hydrate = useUiStore((s) => s.hydrate);
  const dictionary = useDictionary();

  useEffect(() => { hydrate(); }, [hydrate]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try { localStorage.setItem('ess:theme', theme); } catch { /* ignore */ }
  }, [theme]);

  return (
    <button onClick={toggleTheme} aria-label={dictionary.app.toggleTheme} className="rounded-lg border p-2">
      {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
