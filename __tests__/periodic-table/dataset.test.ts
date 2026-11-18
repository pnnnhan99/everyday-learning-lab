import { describe, expect, it } from 'vitest';

import { periodicElements, getPeriodicElement, getPeriodicElementBySymbol } from '@/data/periodic-table/elements';
import { periodicTableReferences } from '@/data/periodic-table/references';
import { getElementGridPosition } from '@/lib/periodic/table';
import { validatePeriodicDataset, validatePeriodicElement } from '@/types/periodic';

describe('periodic table dataset', () => {
  it('contains exactly 118 elements with unique atomic numbers and symbols', () => {
    expect(periodicElements).toHaveLength(118);
    expect(new Set(periodicElements.map((element) => element.atomicNumber)).size).toBe(118);
    expect(new Set(periodicElements.map((element) => element.symbol)).size).toBe(118);
    expect(periodicElements.map((element) => element.atomicNumber)).toEqual(
      Array.from({ length: 118 }, (_, index) => index + 1),
    );
  });

  it('passes full runtime validation against the reference registry', () => {
    const result = validatePeriodicDataset(periodicElements, periodicTableReferences);
    if (!result.ok) console.error(result.errors);
    expect(result.ok).toBe(true);
  });

  it('validates individual records and rejects malformed input', () => {
    expect(validatePeriodicElement(periodicElements[0]).ok).toBe(true);
    expect(validatePeriodicElement({ ...periodicElements[0], atomicNumber: 119 }).ok).toBe(false);
    expect(validatePeriodicElement({ ...periodicElements[0], symbol: 'hydrogen' }).ok).toBe(false);
    expect(validatePeriodicElement({ ...periodicElements[0], category: 'unknown' }).ok).toBe(false);
  });

  it('assigns the standard period for every element', () => {
    const expectedPeriod = (z: number) =>
      z <= 2 ? 1 : z <= 10 ? 2 : z <= 18 ? 3 : z <= 36 ? 4 : z <= 54 ? 5 : z <= 86 ? 6 : 7;
    periodicElements.forEach((element) => {
      expect(element.period, element.symbol).toBe(expectedPeriod(element.atomicNumber));
    });
  });

  it('assigns groups and blocks for representative main-table elements', () => {
    expect(getPeriodicElement(1)).toMatchObject({ group: 1, period: 1, block: 's' });
    expect(getPeriodicElement(2)).toMatchObject({ group: 18, period: 1, block: 's' });
    expect(getPeriodicElement(11)).toMatchObject({ group: 1, period: 3, block: 's' });
    expect(getPeriodicElement(26)).toMatchObject({ group: 8, period: 4, block: 'd' });
    expect(getPeriodicElement(35)).toMatchObject({ group: 17, period: 4, block: 'p' });
    expect(getPeriodicElement(118)).toMatchObject({ group: 18, period: 7, block: 'p' });
  });

  it('keeps lanthanides and actinides in their own rows with the correct columns', () => {
    const lanthanides = periodicElements.filter((element) => element.category === 'lanthanide');
    const actinides = periodicElements.filter((element) => element.category === 'actinide');
    expect(lanthanides).toHaveLength(15);
    expect(actinides).toHaveLength(15);

    expect(getElementGridPosition(getPeriodicElementBySymbol('La')!)).toEqual({ row: 8, column: 3 });
    expect(getElementGridPosition(getPeriodicElementBySymbol('Ce')!)).toEqual({ row: 8, column: 4 });
    expect(getElementGridPosition(getPeriodicElementBySymbol('Lu')!)).toEqual({ row: 8, column: 17 });
    expect(getElementGridPosition(getPeriodicElementBySymbol('Ac')!)).toEqual({ row: 9, column: 3 });
    expect(getElementGridPosition(getPeriodicElementBySymbol('U')!)).toEqual({ row: 9, column: 6 });
    expect(getElementGridPosition(getPeriodicElementBySymbol('Lr')!)).toEqual({ row: 9, column: 17 });

    expect(getPeriodicElementBySymbol('La')?.group).toBe(3);
    expect(getPeriodicElementBySymbol('Ac')?.group).toBe(3);
    expect(getPeriodicElementBySymbol('Ce')?.group).toBeNull();
    expect(getPeriodicElementBySymbol('U')?.group).toBeNull();
  });

  it('covers every element category with the expected classification', () => {
    expect(getPeriodicElementBySymbol('Li')?.category).toBe('alkali-metal');
    expect(getPeriodicElementBySymbol('Ca')?.category).toBe('alkaline-earth-metal');
    expect(getPeriodicElementBySymbol('Fe')?.category).toBe('transition-metal');
    expect(getPeriodicElementBySymbol('Al')?.category).toBe('post-transition-metal');
    expect(getPeriodicElementBySymbol('B')?.category).toBe('metalloid');
    expect(getPeriodicElementBySymbol('C')?.category).toBe('nonmetal');
    expect(getPeriodicElementBySymbol('F')?.category).toBe('halogen');
    expect(getPeriodicElementBySymbol('Ne')?.category).toBe('noble-gas');
    expect(getPeriodicElementBySymbol('Ce')?.category).toBe('lanthanide');
    expect(getPeriodicElementBySymbol('U')?.category).toBe('actinide');
  });

  it('marks isotope-dependent and superheavy data explicitly', () => {
    const technetium = getPeriodicElementBySymbol('Tc')!;
    expect(technetium.atomicMass.qualifier).toBe('isotope-dependent');
    expect(technetium.dataNotes.some((note) => note.en.includes('No stable isotopes'))).toBe(true);

    const oganesson = getPeriodicElementBySymbol('Og')!;
    expect(oganesson.atomicMass.qualifier).toBe('isotope-dependent');
    expect(oganesson.standardState).toBe('unknown');
    expect(oganesson.standardStateQualifier).toBe('unknown');
    expect(oganesson.physical.meltingPointK.value).toBeNull();
    expect(oganesson.reviewStatus).toBe('draft');
    expect(oganesson.dataNotes.length).toBeGreaterThan(0);
  });

  it('has complete bilingual learner content for every element', () => {
    periodicElements.forEach((element) => {
      expect(element.name.en.trim(), element.symbol).not.toBe('');
      expect(element.name.vi.trim(), element.symbol).not.toBe('');
      expect(element.occurrence.en.trim(), element.symbol).not.toBe('');
      expect(element.occurrence.vi.trim(), element.symbol).not.toBe('');
      expect(element.applications.length, element.symbol).toBeGreaterThan(0);
      element.applications.forEach((application) => {
        expect(application.en.trim(), element.symbol).not.toBe('');
        expect(application.vi.trim(), element.symbol).not.toBe('');
      });
      expect(element.referenceIds.length, element.symbol).toBeGreaterThan(0);
    });
  });
});
