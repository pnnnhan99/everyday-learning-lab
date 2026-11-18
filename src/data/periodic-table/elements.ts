import type { PeriodicElement } from '@/types/periodic';
import { buildPeriodicElement } from './seed';
import { elementSeedsA } from './seeds-a';
import { elementSeedsB } from './seeds-b';

/**
 * The complete periodic-table dataset (Z = 1–118), sorted by atomic number.
 * This module is pure data and has no React or database dependency.
 */
export const periodicElements: readonly PeriodicElement[] = [
  ...elementSeedsA,
  ...elementSeedsB,
]
  .map(buildPeriodicElement)
  .sort((a, b) => a.atomicNumber - b.atomicNumber);

const byAtomicNumber = new Map<number, PeriodicElement>(
  periodicElements.map((element) => [element.atomicNumber, element]),
);

const bySymbol = new Map<string, PeriodicElement>(
  periodicElements.map((element) => [element.symbol, element]),
);

export function getPeriodicElement(atomicNumber: number): PeriodicElement | undefined {
  return byAtomicNumber.get(atomicNumber);
}

export function getPeriodicElementBySymbol(symbol: string): PeriodicElement | undefined {
  return bySymbol.get(symbol);
}
