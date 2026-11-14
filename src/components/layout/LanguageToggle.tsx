'use client';

import { Languages } from 'lucide-react';
import { useUiStore } from '@/store/uiStore';
import { useDictionary } from '@/i18n/useDictionary';
import type { Locale } from '@/i18n/dict';

export default function LanguageToggle() {
  const locale = useUiStore((s) => s.locale);
  const setLocale = useUiStore((s) => s.setLocale);
  const dictionary = useDictionary();

  function toggle() {
    const next: Locale = locale === 'vi' ? 'en' : 'vi';
    setLocale(next);
  }

  return (
    <button
      onClick={toggle}
      aria-label={dictionary.app.toggleLanguage}
      title={dictionary.languages[locale === 'vi' ? 'en' : 'vi']}
      className="flex items-center gap-1 rounded-lg border px-2 py-2 text-xs font-semibold"
    >
      <Languages size={16} /> {dictionary.languages.short[locale]}
    </button>
  );
}
