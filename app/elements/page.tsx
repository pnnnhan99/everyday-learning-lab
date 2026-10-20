import Link from 'next/link';
import { Search, PackageOpen } from 'lucide-react';

import { listElements } from '@/lib/db';
import { elementTypeIcon, elementTypeLabel } from '@/components/lab/elementIcons';
import FavoriteButton from '@/components/lab/FavoriteButton';
import type { ElementType } from '@/types/game';

const PAGE_SIZE = 12;
const TYPE_FILTERS: Array<'all' | ElementType> = ['all', 'acid', 'base', 'food', 'chemical'];

interface ElementsSearchParams {
  q?: string;
  type?: string;
  page?: string;
}

function buildHref(params: { q?: string; type?: string; page?: number }): string {
  const query = new URLSearchParams();
  if (params.q) query.set('q', params.q);
  if (params.type && params.type !== 'all') query.set('type', params.type);
  if (params.page && params.page > 1) query.set('page', String(params.page));
  const qs = query.toString();
  return qs ? `/elements?${qs}` : '/elements';
}

function SafetyMeter({ level }: { level: number }) {
  return (
    <span className="flex items-center gap-1.5 text-xs text-zinc-500">
      <span className="flex gap-0.5" aria-hidden>
        {[1, 2, 3, 4, 5].map((step) => (
          <span
            key={step}
            className={`h-1.5 w-1.5 rounded-full ${step <= level ? 'bg-rose-400' : 'bg-zinc-200 dark:bg-zinc-700'}`}
          />
        ))}
      </span>
      Safety {level}/5
    </span>
  );
}

export default async function ElementsPage({
  searchParams,
}: {
  searchParams: Promise<ElementsSearchParams>;
}) {
  const { q = '', type = 'all', page = '1' } = await searchParams;
  const query = q.trim().toLowerCase();
  const activeType = (TYPE_FILTERS as string[]).includes(type) ? type : 'all';

  const elements = await listElements();
  const filtered = elements.filter((el) => {
    const matchesQuery =
      query === '' ||
      el.name.toLowerCase().includes(query) ||
      el.id.toLowerCase().includes(query) ||
      el.description.toLowerCase().includes(query);
    const matchesType = activeType === 'all' || el.type === activeType;
    return matchesQuery && matchesType;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, Number(page) || 1), totalPages);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const hasFilters = query !== '' || activeType !== 'all';

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6">
      <div className="flex flex-col gap-4">
        <form method="GET" action="/elements" className="flex flex-wrap items-center gap-2">
          <label className="relative flex-1 basis-64">
            <span className="sr-only">Search elements</span>
            <Search size={15} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-zinc-400" />
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Search by name, id or description…"
              className="w-full rounded-xl border border-zinc-200 py-2 pr-3 pl-9 text-sm focus:border-blue-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900"
            />
          </label>
          <button
            type="submit"
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
          >
            Search
          </button>
          {hasFilters && (
            <Link href="/elements" className="px-1 text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300">
              Clear
            </Link>
          )}
        </form>

        <div className="flex flex-wrap items-center gap-2">
          {TYPE_FILTERS.map((value) => (
            <Link
              key={value}
              href={buildHref({ q, type: value })}
              aria-current={activeType === value ? 'true' : undefined}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                activeType === value
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-zinc-200 text-zinc-600 hover:border-zinc-300 dark:border-zinc-700 dark:text-zinc-300'
              }`}
            >
              {value === 'all' ? 'All types' : elementTypeLabel[value as ElementType]}
            </Link>
          ))}
          <span className="ml-auto text-xs text-zinc-500">
            {filtered.length} {filtered.length === 1 ? 'element' : 'elements'}
            {hasFilters ? ' matching' : ''}
          </span>
        </div>

        {visible.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-zinc-300 py-14 text-center dark:border-zinc-700">
            <PackageOpen size={28} className="text-zinc-400" />
            <p className="text-sm text-zinc-500">No elements match your filters.</p>
            <Link href="/elements" className="text-sm font-medium text-blue-600 hover:underline">
              Show all elements
            </Link>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((el) => {
              const Icon = elementTypeIcon[el.type] ?? elementTypeIcon.chemical;
              return (
                <article key={el.id} className="flex flex-col rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800">
                      <Icon size={20} aria-hidden />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{el.name}</p>
                      <p className="truncate text-xs text-zinc-500">
                        {el.id} · {elementTypeLabel[el.type] ?? el.type}
                      </p>
                    </div>
                    <FavoriteButton id={el.id} name={el.name} />
                  </div>
                  <p className="mt-2 flex-1 text-sm text-zinc-600 dark:text-zinc-300">{el.description}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-zinc-100 pt-3 dark:border-zinc-800">
                    {typeof el.ph === 'number' && (
                      <span className="text-xs text-zinc-500">pH ≈ {el.ph}</span>
                    )}
                    {typeof el.safetyLevel === 'number' && <SafetyMeter level={el.safetyLevel} />}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {totalPages > 1 && (
          <nav aria-label="Pagination" className="flex items-center justify-center gap-2 text-sm">
            {currentPage > 1 ? (
              <Link
                href={buildHref({ q, type: activeType, page: currentPage - 1 })}
                className="rounded-lg border border-zinc-200 px-3 py-1.5 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
              >
                ← Previous
              </Link>
            ) : (
              <span className="rounded-lg border border-zinc-100 px-3 py-1.5 text-zinc-300 dark:border-zinc-800 dark:text-zinc-700">
                ← Previous
              </span>
            )}
            <span className="px-2 text-xs text-zinc-500">
              Page {currentPage} of {totalPages}
            </span>
            {currentPage < totalPages ? (
              <Link
                href={buildHref({ q, type: activeType, page: currentPage + 1 })}
                className="rounded-lg border border-zinc-200 px-3 py-1.5 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
              >
                Next →
              </Link>
            ) : (
              <span className="rounded-lg border border-zinc-100 px-3 py-1.5 text-zinc-300 dark:border-zinc-800 dark:text-zinc-700">
                Next →
              </span>
            )}
          </nav>
        )}
      </div>
    </div>
  );
}
