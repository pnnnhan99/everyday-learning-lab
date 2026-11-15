import { describe, it, expect } from 'vitest';
import { fractionsCompareSimulation } from '../../../src/domains/mathematics/simulations/fractions-compare';
import type { FractionCompareInit } from '../../../src/domains/mathematics/simulations/fractions-compare';

function run(opts?: Partial<FractionCompareInit>) {
  const c = fractionsCompareSimulation.create();
  c.initialize();
  return c.run(opts) as Awaited<ReturnType<ReturnType<typeof fractionsCompareSimulation.create>['run']>>;
}

describe('fractionsCompareSimulation', () => {
  it('meta complete', () => {
    expect(fractionsCompareSimulation.id).toBe('mathematics.fractions-compare');
    expect(fractionsCompareSimulation.metadata.domain).toBe('mathematics');
  });

  it('1/2 > 1/3', () => {
    const r = run({ numeratorA: 1, denominatorA: 2, numeratorB: 1, denominatorB: 3 });
    expect(r.comparison).toBe('greater');
  });

  it('equal when cross product equal', () => {
    const r = run({ numeratorA: 1, denominatorA: 2, numeratorB: 2, denominatorB: 4 });
    expect(r.comparison).toBe('equal');
  });

  it('gives equivalents and decimals', () => {
    const r = run({ numeratorA: 1, denominatorA: 2, numeratorB: 2, denominatorB: 5 });
    expect(Number.isFinite(r.decimalA)).toBe(true);
    expect(r.equivalentA.denom).toBeGreaterThan(0);
  });

  it('clamps inputs', () => {
    const r = run({ numeratorA: 1000, denominatorA: 0, numeratorB: -100, denominatorB: 5 });
    expect(Number.isFinite(r.valueA)).toBe(true);
    expect(Number.isFinite(r.valueB)).toBe(true);
  });

  it('compares negative and zero numerators correctly', () => {
    const negative = run({ numeratorA: -1, denominatorA: 2, numeratorB: 1, denominatorB: 3 });
    expect(negative.comparison).toBe('less');
    expect(negative.crossProductL).toBe(-3);
    expect(negative.crossProductR).toBe(2);

    const zero = run({ numeratorA: 0, denominatorA: 5, numeratorB: 0, denominatorB: 7 });
    expect(zero.comparison).toBe('equal');
    expect(zero.valueA).toBe(0);
  });

  it('uses a valid supplied common denominator for equivalent fractions', () => {
    const r = run({ numeratorA: 1, denominatorA: 2, numeratorB: 1, denominatorB: 3, commonDenom: 6 });
    expect(r.commonDenom).toBe(6);
    expect(r.equivalentA).toEqual({ num: 3, denom: 6 });
    expect(r.equivalentB).toEqual({ num: 2, denom: 6 });
  });

  it('falls back to the least common multiple when the supplied denominator is not a multiple of both', () => {
    const r = run({ numeratorA: 1, denominatorA: 2, numeratorB: 1, denominatorB: 3, commonDenom: 5 });
    expect(r.commonDenom).toBe(6);
    // Equivalents must stay exact instead of truncating fractional numerators.
    expect(r.equivalentA).toEqual({ num: 3, denom: 6 });
    expect(r.equivalentB).toEqual({ num: 2, denom: 6 });
  });
});
