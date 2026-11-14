'use client';

import Link from 'next/link';
import { User } from 'lucide-react';
import { useLabStore } from '@/store/labStore';
import { useDictionary } from '@/i18n/useDictionary';

export default function ProfileButton() {
  const favCount = useLabStore((s) => s.favorites.length);
  const historyCount = useLabStore((s) => s.history.length);
  const dictionary = useDictionary();

  return (
    <Link
      href="/profile"
      aria-label={dictionary.app.openProfile}
      title={`${favCount} ${dictionary.app.favorites} · ${historyCount} ${dictionary.app.mixes}`}
      className="flex items-center gap-2 rounded-lg border px-2 py-2 text-xs font-semibold"
    >
      <User size={16} />
      <span className="hidden sm:block">Lab {favCount}/{historyCount}</span>
    </Link>
  );
}
