'use client';

import Link from 'next/link';
import { FlaskConical, Search } from 'lucide-react';

import { useDictionary } from '@/i18n/useDictionary';
import type { EffectType, Reaction } from '@/types/game';

const EFFECT_FILTERS: Array<'all' | EffectType> = ['all', 'toxic', 'informational'];

function buildHref(params: { q?: string; effect?: string; page?: number }): string {
  const query = new URLSearchParams();
  if (params.q) query.set('q', params.q);
  if (params.effect && params.effect !== 'all') query.set('effect', params.effect);
  if (params.page && params.page > 1) query.set('page', String(params.page));
  const qs = query.toString();
  return qs ? `/reactions?${qs}` : '/reactions';
}

const EFFECT_BADGES: Record<EffectType, string> = {
  toxic:
    'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-300',
  informational:
    'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-300',
};

function ReactionCard({ reaction, names }: { reaction: Reaction; names: Record<string, string> }) {
  const dictionary = useDictionary();
  const badge = EFFECT_BADGES[reaction.effectType];
  const effectLabel =
    reaction.effectType === 'toxic' ? dictionary.common.hazard : dictionary.common.model;
  const first = names[reaction.element1Id] ?? reaction.element1Id;
  const second = names[reaction.element2Id] ?? reaction.element2Id;
  const reviewLabel =
    reaction.reviewStatus === 'hazard-reviewed'
      ? dictionary.reactions.reviewedHazard
      : reaction.reviewStatus === 'reviewed'
        ? dictionary.reactions.reviewedScience
        : dictionary.reactions.notReviewed;

  return (
    <article className="flex flex-col rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold tracking-wide text-zinc-500 uppercase">
          <Link href={`/elements?q=${encodeURIComponent(reaction.element1Id)}`} className="hover:text-blue-600">
            {first}
          </Link>
          <span className="mx-1 text-zinc-400">+</span>
          <Link href={`/elements?q=${encodeURIComponent(reaction.element2Id)}`} className="hover:text-blue-600">
            {second}
          </Link>
        </p>
        <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase ${badge}`}>
          {effectLabel}
        </span>
      </div>

      <h2 className="mt-1.5 font-bold">{reaction.resultTitle}</h2>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">{reaction.observation}</p>

      <details className="mt-3 text-sm">
        <summary className="cursor-pointer text-xs font-medium text-blue-600 hover:underline dark:text-blue-400">
          {dictionary.reactions.details}
        </summary>
        <div className="mt-2 space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
          <p>
            <strong className="text-zinc-900 dark:text-zinc-100">{dictionary.common.explanation}:</strong>{' '}
            {reaction.explanation}
          </p>
          <p className="rounded-lg border border-rose-200 bg-rose-50 p-2.5 text-rose-800 dark:border-rose-900 dark:bg-rose-950/60 dark:text-rose-200">
            <strong>{dictionary.common.safety}:</strong> {reaction.safetyGuidance}
          </p>
          <div>
            <strong className="text-zinc-900 dark:text-zinc-100">{dictionary.reactions.modelAssumptions}</strong>
            <ul className="mt-1 list-disc pl-5">
              {reaction.assumptions.map((assumption) => (
                <li key={assumption}>{assumption}</li>
              ))}
            </ul>
          </div>
          <p className="text-xs text-zinc-500">
            {dictionary.common.reviewStatus}: {reviewLabel}
          </p>
          <div>
            <strong className="text-zinc-900 dark:text-zinc-100">{dictionary.common.references}</strong>
            <ul className="mt-1 list-disc pl-5">
              {reaction.references.map((reference) => (
                <li key={reference.url}>
                  <a
                    href={reference.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline underline-offset-2 hover:text-blue-500 dark:text-blue-400"
                  >
                    {reference.title} — {reference.publisher}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </details>
    </article>
  );
}

interface ReactionsViewProps {
  q: string;
  activeEffect: 'all' | EffectType;
  visible: Reaction[];
  filteredCount: number;
  currentPage: number;
  totalPages: number;
  hasFilters: boolean;
  names: Record<string, string>;
}

export default function ReactionsView({
  q,
  activeEffect,
  visible,
  filteredCount,
  currentPage,
  totalPages,
  hasFilters,
  names,
}: ReactionsViewProps) {
  const dictionary = useDictionary();
  const t = dictionary.reactions;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6">
      <div className="flex flex-col gap-4">
        <form method="GET" action="/reactions" className="flex flex-wrap items-center gap-2">
          <label className="relative flex-1 basis-64">
            <span className="sr-only">{t.searchLabel}</span>
            <Search size={15} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-zinc-400" />
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder={t.searchPlaceholder}
              className="w-full rounded-xl border border-zinc-200 py-2 pr-3 pl-9 text-sm focus:border-blue-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900"
            />
          </label>
          <button
            type="submit"
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
          >
            {dictionary.common.search}
          </button>
          {hasFilters && (
            <Link href="/reactions" className="px-1 text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300">
              {dictionary.common.clear}
            </Link>
          )}
        </form>

        <div className="flex flex-wrap items-center gap-2">
          {EFFECT_FILTERS.map((value) => (
            <Link
              key={value}
              href={buildHref({ q, effect: value })}
              aria-current={activeEffect === value ? 'true' : undefined}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                activeEffect === value
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-zinc-200 text-zinc-600 hover:border-zinc-300 dark:border-zinc-700 dark:text-zinc-300'
              }`}
            >
              {value === 'all'
                ? t.allReactions
                : value === 'toxic'
                  ? dictionary.common.hazard
                  : dictionary.common.model}
            </Link>
          ))}
          <span className="ml-auto text-xs text-zinc-500">
            {filteredCount} {filteredCount === 1 ? t.reaction : t.reactions}
            {hasFilters ? ` ${dictionary.common.matching}` : ''}
          </span>
        </div>

        {visible.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-zinc-300 py-14 text-center dark:border-zinc-700">
            <FlaskConical size={28} className="text-zinc-400" />
            <p className="text-sm text-zinc-500">{t.noMatches}</p>
            <Link href="/reactions" className="text-sm font-medium text-blue-600 hover:underline">
              {t.showAll}
            </Link>
          </div>
        ) : (
          <div className="grid gap-3 lg:grid-cols-2">
            {visible.map((reaction) => (
              <ReactionCard
                key={`${reaction.element1Id}-${reaction.element2Id}`}
                reaction={reaction}
                names={names}
              />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <nav aria-label={t.pagination} className="flex items-center justify-center gap-2 text-sm">
            {currentPage > 1 ? (
              <Link
                href={buildHref({ q, effect: activeEffect, page: currentPage - 1 })}
                className="rounded-lg border border-zinc-200 px-3 py-1.5 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
              >
                ← {dictionary.common.previous}
              </Link>
            ) : (
              <span className="rounded-lg border border-zinc-100 px-3 py-1.5 text-zinc-300 dark:border-zinc-800 dark:text-zinc-700">
                ← {dictionary.common.previous}
              </span>
            )}
            <span className="px-2 text-xs text-zinc-500">
              {dictionary.common.page} {currentPage} {dictionary.common.of} {totalPages}
            </span>
            {currentPage < totalPages ? (
              <Link
                href={buildHref({ q, effect: activeEffect, page: currentPage + 1 })}
                className="rounded-lg border border-zinc-200 px-3 py-1.5 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
              >
                {dictionary.common.next} →
              </Link>
            ) : (
              <span className="rounded-lg border border-zinc-100 px-3 py-1.5 text-zinc-300 dark:border-zinc-800 dark:text-zinc-700">
                {dictionary.common.next} →
              </span>
            )}
          </nav>
        )}
      </div>
    </div>
  );
}
