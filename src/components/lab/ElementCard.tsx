'use client';

import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Star } from 'lucide-react';
import type { Element } from '@/types/game';
import { elementTypeIcon } from './elementIcons';
import { useLabStore } from '@/store/labStore';

export default function ElementCard({ element, disabled }: { element: Element; disabled?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: element.id, disabled });
  const selected = useLabStore((s) => s.selected);
  const toggleSelect = useLabStore((s) => s.toggleSelect);
  const favorites = useLabStore((s) => s.favorites);
  const toggleFavorite = useLabStore((s) => s.toggleFavorite);
  const isSelected = selected.includes(element.id);
  const isFav = favorites.includes(element.id);
  const Icon = elementTypeIcon[element.type] ?? elementTypeIcon.chemical;

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), opacity: isDragging ? 0.6 : 1 }}
      className={`relative rounded-2xl border p-3 transition-colors ${
        isSelected
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
          : 'border-zinc-200 bg-white hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900'
      } ${disabled ? 'opacity-50' : ''}`}
    >
      <button
        {...listeners}
        {...attributes}
        aria-label={`Drag ${element.name}`}
        className="flex w-full cursor-grab items-center gap-3 text-left active:cursor-grabbing"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800">
          <Icon size={20} />
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold">{element.name}</span>
          <span className="block truncate text-xs text-zinc-500">{element.type} · {element.id}</span>
        </span>
      </button>
      <div className="mt-2 flex items-center gap-2">
        <button
          onClick={() => toggleSelect(element.id)}
          disabled={disabled}
          className="flex-1 rounded-lg bg-zinc-900 px-2 py-1.5 text-xs font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
        >
          {isSelected ? 'Remove' : 'Add to beaker'}
        </button>
        <button
          onClick={() => toggleFavorite(element.id)}
          aria-label="Toggle favorite"
          className={`rounded-lg border p-1.5 ${isFav ? 'border-amber-400 text-amber-500' : 'border-zinc-200 text-zinc-400 dark:border-zinc-700'}`}
        >
          <Star size={14} fill={isFav ? 'currentColor' : 'none'} />
        </button>
      </div>
    </div>
  );
}
