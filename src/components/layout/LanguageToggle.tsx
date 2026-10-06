'use client';

import { Languages } from 'lucide-react';
import { useUiStore } from '@/store/uiStore';
import { t, type Locale } from '@/i18n/dict';

export default function LanguageToggle() {
  const locale = useUiStore((s) => s.locale);
  const setLocale = useUiStore((s) => s.setLocale);

  function toggle() {
    const next: Locale = locale === 'vi' ? 'en' : 'vi';
    setLocale(next);
  }

  return (
    <button onClick={toggle} aria-label="Toggle language" title={t(locale, 'language') as string} className="flex items-center gap-1 rounded-lg border px-2 py-2 text-xs font-semibold">
      <Languages size={16} /> {locale.toUpperCase()}
    </button>
  );
}
