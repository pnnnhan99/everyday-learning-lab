import type { Simulation, SimulationContract, SimulationMetadata } from '@/core/simulation/types';

export interface FractionCompareInit {
  numeratorA: number;
  denominatorA: number;
  numeratorB: number;
  denominatorB: number;
  commonDenom?: number;
}

export interface FractionCompareResult {
  valueA: number;
  valueB: number;
  crossProductL: number;
  crossProductR: number;
  comparison: 'equal' | 'greater' | 'less';
  decimalA: number;
  decimalB: number;
  commonDenom: number;
  equivalentA: { num: number; denom: number };
  equivalentB: { num: number; denom: number };
  explanation: string;
}

const metadata: SimulationMetadata = {
  id: 'mathematics.fractions-compare',
  name: 'Comparing Fractions',
  domain: 'mathematics',
  description: 'Compare two fractions using cross multiplication and common denominators to determine which is larger.',
  assumptions: [
    'Denominators are non-zero integers.',
    'Fractions represent rational numbers in reduced/decimal form for learning.',
  ],
  limitations: [
    'Only integer numerators/denominators supported in inputs.',
    'Does not simplify fractions automatically.',
  ],
  references: [
    { title: 'Fractions (Khan Academy)', url: 'https://www.khanacademy.org/math/arithmetic/fraction-arithmetic' },
    { title: 'Cross-multiplication', url: 'https://en.wikipedia.org/wiki/Cross-multiplication' },
  ],
  units: {
    value: 'dimensionless',
  },
  validInputRanges: {
    numeratorA: { min: -50, max: 50 },
    denominatorA: { min: 1, max: 50 },
    numeratorB: { min: -50, max: 50 },
    denominatorB: { min: 1, max: 50 },
    commonDenom: { min: 1, max: 100 },
  },
  defaults: {
    numeratorA: 1,
    denominatorA: 2,
    numeratorB: 1,
    denominatorB: 3,
  },
};

function clampInt(n: number, r: { min: number; max: number }) {
  if (!Number.isFinite(n)) return Math.trunc(r.min);
  const t = Math.trunc(n);
  return Math.max(r.min, Math.min(r.max, t));
}

function gcd(a: number, b: number): number {
  a = Math.abs(a); b = Math.abs(b);
  while (b !== 0) {
    const t = a % b;
    a = b; b = t;
  }
  return a;
}

function lcm(a: number, b: number) {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / gcd(a, b);
}

function createContract(): SimulationContract<Partial<FractionCompareInit>, FractionCompareResult> {
  return {
    initialize() {},
    run(input?: Partial<FractionCompareInit>): FractionCompareResult {
      const na = clampInt(input?.numeratorA ?? 1, metadata.validInputRanges!.numeratorA);
      const da = clampInt(input?.denominatorA ?? 2, metadata.validInputRanges!.denominatorA);
      const nb = clampInt(input?.numeratorB ?? 1, metadata.validInputRanges!.denominatorB);
      const db = clampInt(input?.denominatorB ?? 3, metadata.validInputRanges!.denominatorB);
      const cdIn = input?.commonDenom;
      const cd = cdIn && Number.isFinite(cdIn)
        ? Math.max(1, Math.min(100, Math.trunc(cdIn)))
        : lcm(da, db);

      const valueA = na / da;
      const valueB = nb / db;
      const decimalA = Number(valueA.toFixed(6));
      const decimalB = Number(valueB.toFixed(6));
      const crossProductL = na * db;
      const crossProductR = nb * da;

      let comparison: FractionCompareResult['comparison'] = 'equal';
      if (Math.abs(valueA - valueB) > 1e-9) {
        comparison = valueA > valueB ? 'greater' : 'less';
      }
      const explain = comparison === 'equal'
        ? 'The fractions are equal (cross products equal).'
        : `Fraction A is ${comparison} than fraction B.`;

      return {
        valueA,
        valueB,
        crossProductL,
        crossProductR,
        comparison,
        decimalA,
        decimalB,
        commonDenom: cd,
        equivalentA: { num: Math.trunc(na * (cd / da)), denom: cd },
        equivalentB: { num: Math.trunc(nb * (cd / db)), denom: cd },
        explanation: explain,
      };
    },
  };
}

export const fractionsCompareSimulation: Simulation<Partial<FractionCompareInit>, FractionCompareResult> = {
  id: metadata.id,
  metadata,
  create: createContract,
};

export default fractionsCompareSimulation;
