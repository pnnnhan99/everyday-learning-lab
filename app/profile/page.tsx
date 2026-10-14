'use client';

import Link from 'next/link';
import { Star, History, RotateCcw } from 'lucide-react';
import { useLabStore } from '@/store/labStore';

export default function ProfilePage() {
  const favorites = useLabStore((s) => s.favorites);
  const history = useLabStore((s) => s.history);
  const clearHistory = useLabStore((s) => s.clearHistory);
  const reset = useLabStore((s) => s.reset);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-6">
      <div className="rounded-2xl border p-4">
        <h2 className="flex items-center gap-2 font-bold"><History size={16} /> Local progress</h2>
        <p className="mt-1 text-sm text-zinc-500">{favorites.length} favorites · {history.length} mixes stored in this browser.</p>
        <div className="mt-3 flex gap-2">
          <button onClick={clearHistory} className="rounded-xl border px-3 py-2 text-sm">Clear history</button>
          <button onClick={reset} className="flex items-center gap-1 rounded-xl border px-3 py-2 text-sm"><RotateCcw size={14} /> Reset lab</button>
        </div>
      </div>
      <div className="rounded-2xl border p-4">
        <h3 className="flex items-center gap-2 font-bold"><Star size={16} /> Favorites</h3>
        {favorites.length === 0 ? <p className="mt-1 text-sm text-zinc-500">No favorites yet. Star elements from the lab.</p> : (
          <ul className="mt-2 flex flex-wrap gap-2">{favorites.map((f) => <li key={f} className="rounded-full bg-zinc-100 px-3 py-1 text-xs dark:bg-zinc-800">{f}</li>)}</ul>
        )}
      </div>
      <Link href="/" className="text-sm font-medium text-blue-600 hover:underline">← Back to lab</Link>
    </div>
  );
}
