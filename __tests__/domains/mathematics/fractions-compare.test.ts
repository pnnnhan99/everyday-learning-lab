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
});
