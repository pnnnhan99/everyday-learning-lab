import type { ElementCategory, PeriodicElement } from '@/types/periodic';

export const GRID_COLUMNS = 18;
export const MAIN_TABLE_ROWS = 7;
export const LANTHANIDE_ROW = 8;
export const ACTINIDE_ROW = 9;

export interface GridPosition {
  row: number;
  column: number;
}

export interface PeriodicTableFilters {
  query: string;
  category: ElementCategory | 'all';
  group: number | 'all';
  period: number | 'all';
}

export const EMPTY_FILTERS: PeriodicTableFilters = {
  query: '',
  category: 'all',
  group: 'all',
  period: 'all',
};

export function isFBlockCategory(category: ElementCategory): boolean {
  return category === 'lanthanide' || category === 'actinide';
}

/**
 * Maps an element to its cell in the 18-column grid. Lanthanides and actinides
 * occupy two dedicated rows below the main table (rows 8 and 9).
 */
export function getElementGridPosition(element: PeriodicElement): GridPosition {
  if (element.category === 'lanthanide') {
    return { row: LANTHANIDE_ROW, column: 3 + (element.atomicNumber - 57) };
  }
  if (element.category === 'actinide') {
    return { row: ACTINIDE_ROW, column: 3 + (element.atomicNumber - 89) };
  }
  if (element.group === null) {
    throw new Error(`Element ${element.symbol} has no group and is not a lanthanide or actinide`);
  }
  return { row: element.period, column: element.group };
}

/** Marker shown in group 3 where the f-block rows are split out. */
export const fBlockPlaceholders: readonly {
  row: number;
  column: number;
  from: number;
  to: number;
  category: 'lanthanide' | 'actinide';
}[] = [
  { row: 6, column: 3, from: 57, to: 71, category: 'lanthanide' },
  { row: 7, column: 3, from: 89, to: 103, category: 'actinide' },
];

/** Case- and diacritic-insensitive text used for Vietnamese-friendly search. */
export function normalizeSearchText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}

export function searchElements(
  elements: readonly PeriodicElement[],
  query: string,
): PeriodicElement[] {
  const normalized = normalizeSearchText(query);
  if (!normalized) return [...elements];

  const scored: Array<{ element: PeriodicElement; score: number }> = [];

  elements.forEach((element) => {
    const nameEn = normalizeSearchText(element.name.en);
    const nameVi = normalizeSearchText(element.name.vi);
    const symbol = normalizeSearchText(element.symbol);
    const atomicNumber = String(element.atomicNumber);

    if (symbol === normalized || atomicNumber === normalized) {
      scored.push({ element, score: 0 });
    } else if (
      symbol.startsWith(normalized) ||
      atomicNumber.startsWith(normalized) ||
      nameEn.startsWith(normalized) ||
      nameVi.startsWith(normalized)
    ) {
      scored.push({ element, score: 1 });
    } else if (
      symbol.includes(normalized) ||
      atomicNumber.includes(normalized) ||
      nameEn.includes(normalized) ||
      nameVi.includes(normalized)
    ) {
      scored.push({ element, score: 2 });
    }
  });

  return scored
    .sort((a, b) => a.score - b.score || a.element.atomicNumber - b.element.atomicNumber)
    .map((entry) => entry.element);
}

export function filterElements(
  elements: readonly PeriodicElement[],
  filters: PeriodicTableFilters,
): PeriodicElement[] {
  const searched = searchElements(elements, filters.query);
  return searched.filter((element) => {
    if (filters.category !== 'all' && element.category !== filters.category) return false;
    if (filters.group !== 'all' && element.group !== filters.group) return false;
    if (filters.period !== 'all' && element.period !== filters.period) return false;
    return true;
  });
}

export function hasActiveFilters(filters: PeriodicTableFilters): boolean {
  return (
    filters.query.trim() !== '' ||
    filters.category !== 'all' ||
    filters.group !== 'all' ||
    filters.period !== 'all'
  );
}

export type GridNavigationKey = 'ArrowLeft' | 'ArrowRight' | 'ArrowUp' | 'ArrowDown' | 'Home' | 'End';

/**
 * Returns the element that should receive focus for a keyboard command, or the
 * same element when no neighbour exists. Keeps focus on real occupied cells so
 * arrow navigation never lands in a gap.
 */
export function findKeyboardTarget(
  elements: readonly PeriodicElement[],
  currentAtomicNumber: number,
  key: GridNavigationKey,
): PeriodicElement | undefined {
  const positions = new Map<number, GridPosition>();
  const byCoordinate = new Map<string, PeriodicElement>();

  elements.forEach((element) => {
    const position = getElementGridPosition(element);
    positions.set(element.atomicNumber, position);
    byCoordinate.set(`${position.row}:${position.column}`, element);
  });

  const current = elements.find((element) => element.atomicNumber === currentAtomicNumber);
  if (!current) return undefined;
  const start = positions.get(current.atomicNumber);
  if (!start) return undefined;

  const sameRow = elements
    .filter((element) => positions.get(element.atomicNumber)?.row === start.row)
    .sort(
      (a, b) =>
        (positions.get(a.atomicNumber)?.column ?? 0) - (positions.get(b.atomicNumber)?.column ?? 0),
    );

  if (key === 'Home') return sameRow[0];
  if (key === 'End') return sameRow[sameRow.length - 1];

  const direction =
    key === 'ArrowLeft'
      ? { row: 0, column: -1 }
      : key === 'ArrowRight'
        ? { row: 0, column: 1 }
        : key === 'ArrowUp'
          ? { row: -1, column: 0 }
          : { row: 1, column: 0 };

  for (let step = 1; step <= Math.max(GRID_COLUMNS, ACTINIDE_ROW); step += 1) {
    const row = start.row + direction.row * step;
    const column = start.column + direction.column * step;
    if (row < 1 || row > ACTINIDE_ROW || column < 1 || column > GRID_COLUMNS) break;
    const candidate = byCoordinate.get(`${row}:${column}`);
    if (candidate) return candidate;
  }

  return current;
}

/**
 * Short visible code shown in every cell, so categories are not communicated by
 * colour alone. Full names come from the localized dictionary.
 */
export const CATEGORY_ABBREVIATIONS: Record<ElementCategory, string> = {
  'alkali-metal': 'AM',
  'alkaline-earth-metal': 'AE',
  'transition-metal': 'TM',
  'post-transition-metal': 'PT',
  metalloid: 'ML',
  nonmetal: 'NM',
  halogen: 'HX',
  'noble-gas': 'NG',
  lanthanide: 'LN',
  actinide: 'AN',
};

export function formatAtomicMass(element: PeriodicElement): string {
  const { value, qualifier } = element.atomicMass;
  if (value === null) return '—';
  const formatted = Number.isInteger(value) ? String(value) : String(Number(value.toFixed(4)));
  return qualifier === 'isotope-dependent' ? `[${formatted}]` : formatted;
}

/** True when the query matches an element, used for dimming non-matches. */
export function isElementVisible(element: PeriodicElement, filters: PeriodicTableFilters): boolean {
  if (filters.category !== 'all' && element.category !== filters.category) return false;
  if (filters.group !== 'all' && element.group !== filters.group) return false;
  if (filters.period !== 'all' && element.period !== filters.period) return false;
  return searchElements([element], filters.query).length === 1;
}
