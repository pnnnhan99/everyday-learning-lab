'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Clock, History, RotateCcw, Star, Trash2, Undo2, FlaskConical } from 'lucide-react';

import FavoriteButton from '@/components/lab/FavoriteButton';
import { elementTypeIcon, elementTypeLabel } from '@/components/lab/elementIcons';
import { useLabStore, type HistoryEntry } from '@/store/labStore';
import { useGameStore } from '@/store/useGameStore';
import type { Element } from '@/types/game';

interface ProfileViewProps {
  elements: Element[];
}

export default function ProfileView({ elements }: ProfileViewProps) {
  const favorites = useLabStore((s) => s.favorites);
  const history = useLabStore((s) => s.history);
  const hydrate = useLabStore((s) => s.hydrate);
  const clearHistory = useLabStore((s) => s.clearHistory);
  const undo = useLabStore((s) => s.undo);
  const reset = useLabStore((s) => s.reset);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  function undoLastMix() {
    const entry = history[0];
    if (!entry) return;
    undo();
    useGameStore.getState().restoreWorkspace(entry.elementIds);
  }

  function resetLab() {
    reset();
    useGameStore.getState().clearWorkspace();
  }

  const byId = new Map(elements.map((el) => [el.id, el]));

  function describeEntry(entry: HistoryEntry): { first: string; second: string } {
    const [firstId, secondId] = entry.elementIds;
    return {
      first: byId.get(firstId)?.name ?? firstId,
      second: byId.get(secondId)?.name ?? secondId,
    };
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-6">
      <section className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
        <h2 className="flex items-center gap-2 font-bold">
          <History size={16} aria-hidden /> Local progress
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          {favorites.length} {favorites.length === 1 ? 'favorite' : 'favorites'} · {history.length}{' '}
          {history.length === 1 ? 'mix' : 'mixes'} stored in this browser only. Nothing is uploaded.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={undoLastMix}
            disabled={history.length === 0}
            className="inline-flex items-center gap-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm disabled:opacity-40 dark:border-zinc-700"
          >
            <Undo2 size={14} aria-hidden /> Undo last mix
          </button>
          <button
            type="button"
            onClick={clearHistory}
            disabled={history.length === 0}
            className="inline-flex items-center gap-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm disabled:opacity-40 dark:border-zinc-700"
          >
            <Trash2 size={14} aria-hidden /> Clear history
          </button>
          <button
            type="button"
            onClick={resetLab}
            className="inline-flex items-center gap-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700"
          >
            <RotateCcw size={14} aria-hidden /> Reset lab
          </button>
          <Link href="/" className="ml-auto self-center text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300">
            Undo and Reset affect the lab bench →
          </Link>
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-bold">
            <Star size={16} aria-hidden /> Favorites
          </h3>
          <Link href="/elements" className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400">
            Browse elements
          </Link>
        </div>
        {favorites.length === 0 ? (
          <p className="mt-2 text-sm text-zinc-500">
            No favorites yet. Open the{' '}
            <Link href="/elements" className="text-blue-600 hover:underline dark:text-blue-400">
              elements catalog
            </Link>{' '}
            and press Save on anything you want to keep an eye on.
          </p>
        ) : (
          <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {favorites.map((id) => {
              const element = byId.get(id);
              const Icon = element ? (elementTypeIcon[element.type] ?? elementTypeIcon.chemical) : FlaskConical;
              return (
                <li
                  key={id}
                  className="flex items-start gap-3 rounded-xl border border-zinc-200 p-3 dark:border-zinc-800"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                    <Icon size={18} aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{element?.name ?? id}</p>
                    <p className="truncate text-xs text-zinc-500">
                      {element
                        ? `${elementTypeLabel[element.type] ?? element.type}${typeof element.ph === 'number' ? ` · pH ≈ ${element.ph}` : ''}`
                        : 'No longer in the catalog'}
                    </p>
                  </div>
                  <FavoriteButton id={id} name={element?.name ?? id} />
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-bold">
            <Clock size={16} aria-hidden /> Mix history
          </h3>
          <Link href="/reactions" className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400">
            Browse reactions
          </Link>
        </div>
        {history.length === 0 ? (
          <p className="mt-2 text-sm text-zinc-500">
            No mixes recorded yet. Drag two substances onto the bench in the{' '}
            <Link href="/" className="text-blue-600 hover:underline dark:text-blue-400">
              lab
            </Link>{' '}
            and reviewed outcomes will appear here.
          </p>
        ) : (
          <ol className="mt-3 space-y-2">
            {history.map((entry) => {
              const { first, second } = describeEntry(entry);
              return (
                <li
                  key={entry.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-zinc-200 px-3 py-2 dark:border-zinc-800"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {first} <span className="text-zinc-400">+</span> {second}
                    </p>
                    <p className="truncate text-xs text-zinc-500">
                      {entry.reaction?.resultTitle ?? 'Reviewed outcome'} ·{' '}
                      {new Date(entry.at).toLocaleString('vi-VN', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                      })}
                    </p>
                  </div>
                  {entry.reaction && (
                    <span
                      className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${
                        entry.reaction.effectType === 'toxic'
                          ? 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-300'
                          : 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-300'
                      }`}
                    >
                      {entry.reaction.effectType === 'toxic' ? 'Hazard' : 'Model'}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        )}
      </section>

      <Link href="/" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
        ← Back to lab
      </Link>
    </div>
  );
}
