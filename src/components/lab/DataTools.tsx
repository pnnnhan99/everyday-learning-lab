'use client';

import { useMemo } from 'react';
import { Search } from 'lucide-react';
import { useLabStore } from '@/store/labStore';

const TYPES = ['all', 'acid', 'base', 'food', 'chemical'] as const;

export default function DataTools({ total }: { total: number }) {
  const query = useLabStore((s) => s.query);
  const setQuery = useLabStore((s) => s.setQuery);
  const typeFilter = useLabStore((s) => s.typeFilter);
  const setTypeFilter = useLabStore((s) => s.setTypeFilter);

  const hint = useMemo(() => (total === 0 ? 'No elements to search' : `${total} elements`), [total]);

  return (
    <div className="flex flex-col gap-3">
      <label className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900">
        <Search size={16} className="text-zinc-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search elements by name or id…"
          className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-400"
        />
      </label>
      <div className="flex flex-wrap items-center gap-2">
        {TYPES.map((t) => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
              typeFilter === t ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900' : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300'
            }`}
          >
            {t}
          </button>
        ))}
        <span className="ml-auto text-xs text-zinc-400">{hint}</span>
      </div>
    </div>
  );
}
