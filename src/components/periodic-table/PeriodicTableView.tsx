'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Atom } from 'lucide-react';

import { periodicElements, getPeriodicElement } from '@/data/periodic-table/elements';
import { useDictionary, useLocale } from '@/i18n/useDictionary';
import {
  EMPTY_FILTERS,
  filterElements,
  hasActiveFilters,
  isElementVisible,
  type PeriodicTableFilters as PeriodicTableFilterState,
} from '@/lib/periodic/table';
import type { ElementCategory } from '@/types/periodic';
import PeriodicElementDetails from './PeriodicElementDetails';
import PeriodicTableFilters from './PeriodicTableFilters';
import PeriodicTableGrid from './PeriodicTableGrid';
import PeriodicTableLegend from './PeriodicTableLegend';
import PeriodicTableSearch from './PeriodicTableSearch';

export default function PeriodicTableView() {
  const dictionary = useDictionary();
  const locale = useLocale();
  const t = dictionary.periodicTable;
  const [filters, setFilters] = useState<PeriodicTableFilterState>(EMPTY_FILTERS);
  const [selectedAtomicNumber, setSelectedAtomicNumber] = useState<number | null>(null);
  const detailsRef = useRef<HTMLDivElement | null>(null);
  const selected = selectedAtomicNumber === null ? null : getPeriodicElement(selectedAtomicNumber) ?? null;
  const activeFilters = hasActiveFilters(filters);

  const filtered = useMemo(() => filterElements(periodicElements, filters), [filters]);
  const countLabel = filtered.length === 1 ? t.resultCountOne : t.resultCount;
  const matchingAtomicNumbers = useMemo(() => {
    if (!activeFilters) return new Set(periodicElements.map((element) => element.atomicNumber));
    return new Set(
      periodicElements
        .filter((element) => isElementVisible(element, filters))
        .map((element) => element.atomicNumber),
    );
  }, [activeFilters, filters]);

  useEffect(() => {
    if (selectedAtomicNumber === null || !detailsRef.current) return;
    if (!window.matchMedia('(max-width: 1023px)').matches) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    detailsRef.current.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  }, [selectedAtomicNumber]);

  const selectCategory = (category: ElementCategory | 'all') => {
    setFilters((current) => ({ ...current, category }));
  };

  return (
    <div className="mx-auto w-full max-w-[1500px] px-4 py-6">
      <div className="space-y-6">
        <header className="space-y-2">
          <p className="flex items-center gap-1.5 text-xs font-semibold tracking-[0.24em] text-blue-700 uppercase dark:text-blue-300">
            <Atom size={14} aria-hidden /> {t.eyebrow}
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t.title}</h1>
          <p className="max-w-4xl text-sm leading-6 text-zinc-600 dark:text-zinc-300">{t.intro}</p>
        </header>

        <section aria-label={t.filtersLabel} className="space-y-3">
          <PeriodicTableSearch
            value={filters.query}
            onChange={(query) => setFilters((current) => ({ ...current, query }))}
            dictionary={dictionary}
          />
          <PeriodicTableFilters
            filters={filters}
            onChange={setFilters}
            onClear={() => setFilters(EMPTY_FILTERS)}
            hasActiveFilters={activeFilters}
            dictionary={dictionary}
          />
          <p aria-live="polite" className="text-xs text-zinc-500 dark:text-zinc-400">
            {filtered.length} / {periodicElements.length}{' '}
            {activeFilters ? `${countLabel} ${t.matching}` : countLabel}
          </p>
          {filtered.length === 0 && (
            <div
              role="status"
              className="rounded-xl border border-dashed border-zinc-300 bg-white p-4 text-sm dark:border-zinc-700 dark:bg-zinc-900/40"
            >
              <p className="font-medium">{t.noMatches}</p>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{t.noMatchesHint}</p>
              <button
                type="button"
                onClick={() => setFilters(EMPTY_FILTERS)}
                className="mt-2 rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium hover:border-blue-400 hover:text-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-zinc-700 dark:hover:text-blue-300"
              >
                {t.clearFilters}
              </button>
            </div>
          )}
        </section>

        <PeriodicTableLegend
          activeCategory={filters.category}
          onSelectCategory={selectCategory}
          dictionary={dictionary}
        />

        <PeriodicTableGrid
          elements={periodicElements}
          locale={locale}
          dictionary={dictionary}
          selectedAtomicNumber={selectedAtomicNumber}
          matchingAtomicNumbers={matchingAtomicNumbers}
          onSelect={setSelectedAtomicNumber}
        />

        <div ref={detailsRef} className="scroll-mt-20">
          <PeriodicElementDetails
            element={selected}
            locale={locale}
            dictionary={dictionary}
            onClose={() => setSelectedAtomicNumber(null)}
          />
        </div>
      </div>
    </div>
  );
}
