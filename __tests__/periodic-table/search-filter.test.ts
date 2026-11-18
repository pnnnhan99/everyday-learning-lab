import { describe, expect, it } from 'vitest';

import { periodicElements, getPeriodicElementBySymbol } from '@/data/periodic-table/elements';
import {
  EMPTY_FILTERS,
  filterElements,
  findKeyboardTarget,
  hasActiveFilters,
  isElementVisible,
  normalizeSearchText,
  searchElements,
  type PeriodicTableFilters,
} from '@/lib/periodic/table';

const symbols = (query: string) => searchElements(periodicElements, query).map((element) => element.symbol);

describe('periodic table search', () => {
  it('searches Vietnamese names with and without diacritics', () => {
    expect(symbols('Sắt')).toEqual(['Fe']);
    expect(symbols('sat')).toEqual(['Fe']);
    expect(symbols('lưu huỳnh')).toEqual(['S']);
    expect(symbols('luu huynh')).toEqual(['S']);
    expect(symbols('Đồng')).toEqual(['Cu']);
    expect(symbols('dong')).toEqual(['Cu']);
  });

  it('searches English names case-insensitively', () => {
    expect(symbols('iron')).toEqual(['Fe']);
    expect(symbols('HYDROGEN')).toEqual(['H']);
    expect(symbols('oganesson')).toEqual(['Og']);
  });

  it('searches by chemical symbol and atomic number', () => {
    expect(symbols('Fe')[0]).toBe('Fe');
    expect(symbols('fe')[0]).toBe('Fe');
    expect(symbols('26')).toEqual(['Fe']);
    expect(symbols('118')).toEqual(['Og']);
  });

  it('normalizes Vietnamese diacritics', () => {
    expect(normalizeSearchText('  Đồng  ')).toBe('dong');
    expect(normalizeSearchText('Lưu huỳnh')).toBe('luu huynh');
  });

  it('returns the full table for an empty query', () => {
    expect(searchElements(periodicElements, '   ')).toHaveLength(118);
  });
});

describe('periodic table filters', () => {
  const withFilters = (overrides: Partial<PeriodicTableFilters>): PeriodicTableFilters => ({
    ...EMPTY_FILTERS,
    ...overrides,
  });

  it('filters by category, group and period', () => {
    const lanthanides = filterElements(periodicElements, withFilters({ category: 'lanthanide' }));
    expect(lanthanides).toHaveLength(15);
    expect(lanthanides[0].symbol).toBe('La');
    expect(lanthanides[14].symbol).toBe('Lu');

    const groupThree = filterElements(periodicElements, withFilters({ group: 3 }));
    expect(groupThree.map((element) => element.symbol)).toEqual(['Sc', 'Y', 'La', 'Ac']);

    const periodOne = filterElements(periodicElements, withFilters({ period: 1 }));
    expect(periodOne.map((element) => element.symbol)).toEqual(['H', 'He']);

    const actinides = filterElements(periodicElements, withFilters({ category: 'actinide' }));
    expect(actinides).toHaveLength(15);
  });

  it('combines search with category, group and period filters', () => {
    const result = filterElements(
      periodicElements,
      withFilters({ query: 'iron', category: 'transition-metal', group: 8, period: 4 }),
    );
    expect(result.map((element) => element.symbol)).toEqual(['Fe']);

    const mixed = filterElements(
      periodicElements,
      withFilters({ query: 'hydro', category: 'nonmetal', period: 1 }),
    );
    expect(mixed.map((element) => element.symbol)).toEqual(['H']);

    const noMatch = filterElements(
      periodicElements,
      withFilters({ query: 'iron', category: 'noble-gas' }),
    );
    expect(noMatch).toHaveLength(0);
  });

  it('reports whether filters are active and dims non-matching cells', () => {
    expect(hasActiveFilters(EMPTY_FILTERS)).toBe(false);
    expect(hasActiveFilters(withFilters({ query: 'x' }))).toBe(true);

    const filters = withFilters({ category: 'noble-gas' });
    expect(isElementVisible(getPeriodicElementBySymbol('Ne')!, filters)).toBe(true);
    expect(isElementVisible(getPeriodicElementBySymbol('Fe')!, filters)).toBe(false);

    const searchFilters = withFilters({ query: 'vàng' });
    expect(isElementVisible(getPeriodicElementBySymbol('Au')!, searchFilters)).toBe(true);
    expect(isElementVisible(getPeriodicElementBySymbol('Ag')!, searchFilters)).toBe(false);
  });
});

describe('periodic table keyboard navigation', () => {
  it('moves horizontally and skips empty grid columns', () => {
    expect(findKeyboardTarget(periodicElements, 1, 'ArrowRight')?.symbol).toBe('He');
    expect(findKeyboardTarget(periodicElements, 2, 'ArrowLeft')?.symbol).toBe('H');
    expect(findKeyboardTarget(periodicElements, 26, 'ArrowRight')?.symbol).toBe('Co');
  });

  it('moves vertically through groups', () => {
    expect(findKeyboardTarget(periodicElements, 3, 'ArrowDown')?.symbol).toBe('Na');
    expect(findKeyboardTarget(periodicElements, 11, 'ArrowDown')?.symbol).toBe('K');
    expect(findKeyboardTarget(periodicElements, 26, 'ArrowUp')?.symbol).toBe('Fe');
    expect(findKeyboardTarget(periodicElements, 26, 'ArrowDown')?.symbol).toBe('Ru');
  });

  it('navigates the separate lanthanide and actinide rows', () => {
    expect(findKeyboardTarget(periodicElements, 57, 'ArrowRight')?.symbol).toBe('Ce');
    expect(findKeyboardTarget(periodicElements, 58, 'ArrowLeft')?.symbol).toBe('La');
    expect(findKeyboardTarget(periodicElements, 89, 'ArrowRight')?.symbol).toBe('Th');
    expect(findKeyboardTarget(periodicElements, 71, 'ArrowRight')?.symbol).toBe('Lu');
    expect(findKeyboardTarget(periodicElements, 103, 'ArrowLeft')?.symbol).toBe('No');
  });

  it('supports Home and End without leaving the current row', () => {
    expect(findKeyboardTarget(periodicElements, 26, 'Home')?.symbol).toBe('K');
    expect(findKeyboardTarget(periodicElements, 26, 'End')?.symbol).toBe('Kr');
    expect(findKeyboardTarget(periodicElements, 57, 'Home')?.symbol).toBe('La');
    expect(findKeyboardTarget(periodicElements, 57, 'End')?.symbol).toBe('Lu');
  });
});
