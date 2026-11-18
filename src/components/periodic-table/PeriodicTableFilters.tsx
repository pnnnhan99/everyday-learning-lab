'use client';

import type { Dictionary } from '@/i18n/dict';
import { ELEMENT_CATEGORIES, type ElementCategory } from '@/types/periodic';
import type { PeriodicTableFilters } from '@/lib/periodic/table';

const GROUPS = Array.from({ length: 18 }, (_, index) => index + 1);
const PERIODS = Array.from({ length: 7 }, (_, index) => index + 1);

interface PeriodicTableFiltersProps {
  filters: PeriodicTableFilters;
  onChange: (filters: PeriodicTableFilters) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
  dictionary: Dictionary;
}

const selectClass =
  'w-full rounded-lg border border-zinc-300 bg-white px-2.5 py-2 text-sm text-zinc-900 focus:border-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/30 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100';

export default function PeriodicTableFilters({
  filters,
  onChange,
  onClear,
  hasActiveFilters,
  dictionary,
}: PeriodicTableFiltersProps) {
  const t = dictionary.periodicTable;
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="space-y-1 text-xs font-medium text-zinc-600 dark:text-zinc-300">
          <span>{t.categoryFilter}</span>
          <select
            value={filters.category}
            onChange={(event) =>
              onChange({
                ...filters,
                category: event.target.value as ElementCategory | 'all',
              })
            }
            className={selectClass}
          >
            <option value="all">{t.allCategories}</option>
            {ELEMENT_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {t.categories[category]}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1 text-xs font-medium text-zinc-600 dark:text-zinc-300">
          <span>{t.groupFilter}</span>
          <select
            value={String(filters.group)}
            onChange={(event) =>
              onChange({
                ...filters,
                group: event.target.value === 'all' ? 'all' : Number(event.target.value),
              })
            }
            className={selectClass}
          >
            <option value="all">{t.allGroups}</option>
            {GROUPS.map((group) => (
              <option key={group} value={group}>
                {t.groupOption} {group}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1 text-xs font-medium text-zinc-600 dark:text-zinc-300">
          <span>{t.periodFilter}</span>
          <select
            value={String(filters.period)}
            onChange={(event) =>
              onChange({
                ...filters,
                period: event.target.value === 'all' ? 'all' : Number(event.target.value),
              })
            }
            className={selectClass}
          >
            <option value="all">{t.allPeriods}</option>
            {PERIODS.map((period) => (
              <option key={period} value={period}>
                {t.periodOption} {period}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{t.legendHint}</p>
        <button
          type="button"
          onClick={onClear}
          disabled={!hasActiveFilters}
          className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:border-blue-400 hover:text-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-300 dark:hover:text-blue-300"
        >
          {t.clearFilters}
        </button>
      </div>
    </div>
  );
}
