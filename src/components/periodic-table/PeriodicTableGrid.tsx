'use client';

import { useRef, useState, type KeyboardEvent } from 'react';

import type { Dictionary, Locale } from '@/i18n/dict';
import {
  ACTINIDE_ROW,
  LANTHANIDE_ROW,
  fBlockPlaceholders,
  findKeyboardTarget,
  getElementGridPosition,
  isFBlockCategory,
  type GridNavigationKey,
} from '@/lib/periodic/table';
import type { PeriodicElement } from '@/types/periodic';
import PeriodicElementCell from './PeriodicElementCell';

const NAVIGATION_KEYS: readonly GridNavigationKey[] = [
  'ArrowLeft',
  'ArrowRight',
  'ArrowUp',
  'ArrowDown',
  'Home',
  'End',
];

interface PeriodicTableGridProps {
  elements: readonly PeriodicElement[];
  locale: Locale;
  dictionary: Dictionary;
  selectedAtomicNumber: number | null;
  matchingAtomicNumbers: ReadonlySet<number>;
  onSelect: (atomicNumber: number) => void;
}

export default function PeriodicTableGrid({
  elements,
  locale,
  dictionary,
  selectedAtomicNumber,
  matchingAtomicNumbers,
  onSelect,
}: PeriodicTableGridProps) {
  const t = dictionary.periodicTable;
  const [focusedAtomicNumber, setFocusedAtomicNumber] = useState(
    () => selectedAtomicNumber ?? elements[0]?.atomicNumber ?? 1,
  );
  const buttonRefs = useRef(new Map<number, HTMLButtonElement>());

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, atomicNumber: number) => {
    if (!NAVIGATION_KEYS.includes(event.key as GridNavigationKey)) return;
    event.preventDefault();
    const target = findKeyboardTarget(elements, atomicNumber, event.key as GridNavigationKey);
    if (!target) return;
    setFocusedAtomicNumber(target.atomicNumber);
    buttonRefs.current.get(target.atomicNumber)?.focus();
  };

  return (
    <div className="space-y-2">
      <p id="periodic-table-keyboard-hint" className="sr-only">
        {t.tableHint}
      </p>
      <div className="overflow-x-auto pb-2">
        <div
          role="group"
          aria-label={t.tableLabel}
          className="grid min-w-[1140px] gap-1 rounded-xl border border-zinc-200 bg-white p-2 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/60"
          style={{
            gridTemplateColumns: 'repeat(18, minmax(0, 1fr))',
            gridTemplateRows: 'repeat(7, minmax(68px, auto)) 1.25rem repeat(2, minmax(68px, auto))',
          }}
        >
          {elements.map((element) => {
            const position = getElementGridPosition(element);
            const isTabbable =
              focusedAtomicNumber === element.atomicNumber ||
              (focusedAtomicNumber === null && element.atomicNumber === 1);
            return (
              <PeriodicElementCell
                key={element.atomicNumber}
                element={element}
                position={position}
                locale={locale}
                dictionary={dictionary}
                selected={selectedAtomicNumber === element.atomicNumber}
                dimmed={!matchingAtomicNumbers.has(element.atomicNumber)}
                tabIndex={isTabbable ? 0 : -1}
                buttonRef={(node) => {
                  if (node) buttonRefs.current.set(element.atomicNumber, node);
                  else buttonRefs.current.delete(element.atomicNumber);
                }}
                onSelect={onSelect}
                onFocus={setFocusedAtomicNumber}
                onKeyDown={handleKeyDown}
              />
            );
          })}

          <div
            aria-hidden="true"
            style={{ gridRow: LANTHANIDE_ROW, gridColumn: '1 / span 2' }}
            className="flex items-center px-1 text-[10px] font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400"
          >
            {t.lanthanides}
          </div>
          <div
            aria-hidden="true"
            style={{ gridRow: ACTINIDE_ROW, gridColumn: '1 / span 2' }}
            className="flex items-center px-1 text-[10px] font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400"
          >
            {t.actinides}
          </div>

          {fBlockPlaceholders.map((placeholder) => (
            <div
              key={placeholder.category}
              aria-hidden="true"
              style={{ gridRow: placeholder.row, gridColumn: placeholder.column }}
              className="flex min-h-[68px] flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-1 text-center text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-400"
            >
              <span className="text-[8px] leading-tight font-semibold">
                {placeholder.category === 'lanthanide' ? t.lanthanides : t.actinides}
              </span>
              <span className="font-mono text-[9px]">
                {placeholder.from}–{placeholder.to}
              </span>
            </div>
          ))}

          <div
            aria-hidden="true"
            style={{ gridRow: LANTHANIDE_ROW, gridColumn: '18' }}
            className="flex items-center justify-center text-[9px] text-zinc-400"
          >
            {t.fBlockRange}
          </div>
          <div
            aria-hidden="true"
            style={{ gridRow: ACTINIDE_ROW, gridColumn: '18' }}
            className="flex items-center justify-center text-[9px] text-zinc-400"
          >
            {t.fBlockRange}
          </div>
        </div>
      </div>
      <p className="text-xs text-zinc-500 lg:hidden">{t.tableScrollHint}</p>
    </div>
  );
}

/** Re-exported for tests that need to prove the separate-row placement. */
export { isFBlockCategory };
