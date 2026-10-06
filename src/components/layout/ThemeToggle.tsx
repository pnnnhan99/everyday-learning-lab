'use client';

import { useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useUiStore } from '@/store/uiStore';

export default function ThemeToggle() {
  const theme = useUiStore((s) => s.theme);
  const toggleTheme = useUiStore((s) => s.toggleTheme);
  const hydrate = useUiStore((s) => s.hydrate);

  useEffect(() => { hydrate(); }, [hydrate]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try { localStorage.setItem('ess:theme', theme); } catch { /* ignore */ }
  }, [theme]);

  return (
    <button onClick={toggleTheme} aria-label="Toggle theme" className="rounded-lg border p-2">
      {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
