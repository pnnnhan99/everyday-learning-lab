'use client';

import { Star } from 'lucide-react';

import { useLabStore } from '@/store/labStore';

interface FavoriteButtonProps {
  id: string;
  name: string;
  size?: number;
}

export default function FavoriteButton({ id, name, size = 15 }: FavoriteButtonProps) {
  const favorites = useLabStore((s) => s.favorites);
  const toggleFavorite = useLabStore((s) => s.toggleFavorite);
  const active = favorites.includes(id);

  return (
    <button
      type="button"
      onClick={() => toggleFavorite(id)}
      aria-pressed={active}
      aria-label={active ? `Remove ${name} from favorites` : `Add ${name} to favorites`}
      title={active ? 'Remove from favorites' : 'Add to favorites'}
      className={`inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-xs transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
        active
          ? 'border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-300'
          : 'border-zinc-200 text-zinc-500 hover:border-zinc-300 hover:text-zinc-700 dark:border-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'
      }`}
    >
      <Star size={size} fill={active ? 'currentColor' : 'none'} aria-hidden />
      <span className="hidden sm:inline">{active ? 'Saved' : 'Save'}</span>
    </button>
  );
}
