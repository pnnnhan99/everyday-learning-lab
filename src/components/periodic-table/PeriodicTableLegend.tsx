'use client';

import type { Dictionary } from '@/i18n/dict';
import { CATEGORY_ABBREVIATIONS } from '@/lib/periodic/table';
import { ELEMENT_CATEGORIES, type ElementCategory } from '@/types/periodic';
import { categoryStyles } from './categoryStyles';

interface PeriodicTableLegendProps {
  activeCategory: ElementCategory | 'all';
  onSelectCategory: (category: ElementCategory | 'all') => void;
  dictionary: Dictionary;
}

export default function PeriodicTableLegend({
  activeCategory,
  onSelectCategory,
  dictionary,
}: PeriodicTableLegendProps) {
  const t = dictionary.periodicTable;
  return (
    <section aria-labelledby="periodic-legend-heading" className="space-y-2">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="periodic-legend-heading" className="text-sm font-semibold">
          {t.legend}
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{t.legendHint}</p>
      </div>
      <ul className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-5">
        {ELEMENT_CATEGORIES.map((category) => {
          const active = activeCategory === category;
          const style = categoryStyles[category];
          return (
            <li key={category}>
              <button
                type="button"
                aria-pressed={active}
                onClick={() => onSelectCategory(active ? 'all' : category)}
                title={t.categoryDescriptions[category]}
                className={`flex w-full items-center gap-2 rounded-lg border px-2 py-1.5 text-left text-xs transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 motion-reduce:transition-none ${
                  active
                    ? 'border-blue-600 bg-blue-50 text-blue-900 dark:border-blue-400 dark:bg-blue-950/50 dark:text-blue-100'
                    : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-300'
                }`}
              >
                <span
                  aria-hidden
                  className={`flex h-5 w-7 shrink-0 items-center justify-center rounded font-mono text-[9px] font-bold text-white ${style.swatch}`}
                >
                  {CATEGORY_ABBREVIATIONS[category]}
                </span>
                <span className="min-w-0 leading-tight">{t.categories[category]}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
