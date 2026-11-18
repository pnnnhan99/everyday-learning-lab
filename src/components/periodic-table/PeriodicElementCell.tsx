'use client';

import type { KeyboardEvent } from 'react';

import type { Dictionary } from '@/i18n/dict';
import type { Locale } from '@/i18n/dict';
import { CATEGORY_ABBREVIATIONS, formatAtomicMass, type GridPosition } from '@/lib/periodic/table';
import type { PeriodicElement } from '@/types/periodic';
import { categoryStyles } from './categoryStyles';

interface PeriodicElementCellProps {
  element: PeriodicElement;
  position: GridPosition;
  locale: Locale;
  dictionary: Dictionary;
  selected: boolean;
  dimmed: boolean;
  tabIndex: number;
  buttonRef: (node: HTMLButtonElement | null) => void;
  onSelect: (atomicNumber: number) => void;
  onFocus: (atomicNumber: number) => void;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>, atomicNumber: number) => void;
}

export default function PeriodicElementCell({
  element,
  position,
  locale,
  dictionary,
  selected,
  dimmed,
  tabIndex,
  buttonRef,
  onSelect,
  onFocus,
  onKeyDown,
}: PeriodicElementCellProps) {
  const t = dictionary.periodicTable;
  const name = element.name[locale];
  const categoryLabel = t.categories[element.category];
  const style = categoryStyles[element.category];
  const groupPart = element.group === null ? '' : `, ${t.group} ${element.group}`;
  const ariaLabel = `${name} (${element.symbol}), ${t.atomicNumber} ${element.atomicNumber}, ${categoryLabel}, ${t.period} ${element.period}${groupPart}, ${t.blocks[element.block]}`;

  return (
    <button
      ref={buttonRef}
      type="button"
      tabIndex={tabIndex}
      aria-label={ariaLabel}
      aria-pressed={selected}
      aria-describedby="periodic-table-keyboard-hint"
      data-category={element.category}
      data-atomic-number={element.atomicNumber}
      title={categoryLabel}
      onClick={() => onSelect(element.atomicNumber)}
      onFocus={() => onFocus(element.atomicNumber)}
      onKeyDown={(event) => onKeyDown(event, element.atomicNumber)}
      style={{ gridRow: position.row, gridColumn: position.column }}
      className={`group relative flex min-h-[68px] min-w-0 flex-col rounded-lg border p-1.5 text-left text-zinc-900 transition-colors focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 motion-reduce:transition-none dark:text-zinc-50 ${style.cell} ${
        selected ? 'ring-2 ring-blue-700 ring-offset-1 dark:ring-blue-300 dark:ring-offset-zinc-950' : ''
      } ${dimmed ? 'opacity-30 grayscale' : ''}`}
    >
      <span className="flex w-full items-start justify-between gap-1 text-[9px] leading-none">
        <span aria-hidden className={`font-mono font-semibold tracking-tight ${style.text}`}>
          {CATEGORY_ABBREVIATIONS[element.category]}
        </span>
        <span className="font-mono tabular-nums opacity-70">{element.atomicNumber}</span>
      </span>
      <span className="mt-0.5 text-base leading-none font-bold tracking-tight sm:text-lg">{element.symbol}</span>
      <span className="mt-0.5 line-clamp-2 text-[9px] leading-tight font-medium sm:text-[10px]">{name}</span>
      <span className="mt-auto pt-1 font-mono text-[9px] leading-none opacity-70">{formatAtomicMass(element)}</span>
    </button>
  );
}
