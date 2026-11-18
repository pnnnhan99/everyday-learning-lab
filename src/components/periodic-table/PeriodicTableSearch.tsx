'use client';

import { Search, X } from 'lucide-react';

import type { Dictionary } from '@/i18n/dict';

interface PeriodicTableSearchProps {
  value: string;
  onChange: (value: string) => void;
  dictionary: Dictionary;
}

export default function PeriodicTableSearch({ value, onChange, dictionary }: PeriodicTableSearchProps) {
  const t = dictionary.periodicTable;
  return (
    <div className="relative w-full">
      <label htmlFor="periodic-table-search" className="sr-only">
        {t.searchLabel}
      </label>
      <Search
        size={16}
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-zinc-400"
      />
      <input
        id="periodic-table-search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={t.searchPlaceholder}
        autoComplete="off"
        className="w-full rounded-xl border border-zinc-300 bg-white py-2.5 pr-10 pl-9 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/30 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
      />
      {value !== '' && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label={dictionary.common.clear}
          className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-1 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
        >
          <X size={15} aria-hidden />
        </button>
      )}
    </div>
  );
}
