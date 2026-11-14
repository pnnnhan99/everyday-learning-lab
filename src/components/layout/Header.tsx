'use client';

import { Menu } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';
import ProfileButton from './ProfileButton';
import { useUiStore } from '@/store/uiStore';
import { useDictionary } from '@/i18n/useDictionary';

export default function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const dictionary = useDictionary();

  return (
    <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/90 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/90">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-2 px-4 py-3">
        <button onClick={toggleSidebar} aria-label={dictionary.app.toggleMenu} className="rounded-lg border p-2 lg:hidden">
          <Menu size={18} />
        </button>
        <div className="min-w-0">
          <h1 className="truncate text-base font-bold">{title}</h1>
          {subtitle && <p className="truncate text-xs text-zinc-500">{subtitle}</p>}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
          <ProfileButton />
        </div>
      </div>
    </header>
  );
}
