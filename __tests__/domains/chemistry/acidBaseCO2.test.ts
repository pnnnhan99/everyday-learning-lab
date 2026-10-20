import { describe, it, expect } from 'vitest';
import { acidBaseCO2Simulation } from '../../../src/domains/chemistry/simulations/acidBaseCO2';

async function run(
  baseAmount: number,
  acidAmount: number,
) {
  const contract = acidBaseCO2Simulation.create();
  contract.initialize();
  return await Promise.resolve(contract.run({ baseAmount, acidAmount }));
}

describe('acidBaseCO2Simulation', () => {
  it('has complete metadata with assumptions and references', () => {
    expect(acidBaseCO2Simulation.id).toBe('chemistry.acid-base.co2');
    expect(acidBaseCO2Simulation.metadata.domain).toBe('chemistry');
    expect(acidBaseCO2Simulation.metadata.assumptions.length).toBeGreaterThan(0);
    expect(acidBaseCO2Simulation.metadata.limitations.length).toBeGreaterThan(0);
    expect(acidBaseCO2Simulation.metadata.references.length).toBeGreaterThan(0);
    expect(acidBaseCO2Simulation.metadata.references[0].url).toMatch(/^https?:\/\//);
  });

  it('runs without explicit initialization (auto-initializes)', async () => {
    const contract = acidBaseCO2Simulation.create();
    const result = await Promise.resolve(contract.run({ baseAmount: 5, acidAmount: 10 }));
    expect(typeof result.co2Produced).toBe('number');
    expect(result.neutralized).toBe(true);
  });

  it('respects input ranges and produces reasonable results', async () => {
    const result = await run(10, 20);
    expect(result.co2Produced).toBeGreaterThan(0);
    expect(result.observation).toContain('bubbles');
  });

  it('clamps values outside valid ranges instead of failing', async () => {
    const result = await run(100, -5);
    expect(Number.isFinite(result.co2Produced)).toBe(true);
  });

  it('can be tested without React or Next.js', async () => {
    const sim = acidBaseCO2Simulation.create();
    sim.initialize();
    const res = await Promise.resolve(sim.run({ baseAmount: 1, acidAmount: 1 }));
    expect(res.excess).toBeDefined();
  });

  it('exposes units for its input and output fields', () => {
    expect(acidBaseCO2Simulation.metadata.units?.baseAmount).toBe('g');
    expect(acidBaseCO2Simulation.metadata.units?.acidAmount).toBe('mL');
  });
});
