import { describe, it, expect } from 'vitest';
import { co2o2Simulation } from '../../../src/domains/biology/simulations/co2-o2';

function run(opts: any) {
  const contract = co2o2Simulation.create();
  contract.initialize();
  return contract.run(opts) as any;
}

describe('co2o2Simulation', () => {
  it('declares complete metadata', () => {
    expect(co2o2Simulation.id).toBe('biology.co2-o2');
    expect(co2o2Simulation.metadata.domain).toBe('biology');
    expect(co2o2Simulation.metadata.assumptions.length).toBeGreaterThan(0);
    expect(co2o2Simulation.metadata.limitations.length).toBeGreaterThan(0);
    expect(co2o2Simulation.metadata.references.length).toBeGreaterThan(0);
  });

  it('defaults produce finite, physically reasonable numbers', () => {
    const r = run(undefined);
    expect(Number.isFinite(r.photosynthesisRate)).toBe(true);
    expect(Number.isFinite(r.respirationRate)).toBe(true);
    expect(Number.isFinite(r.netRate)).toBe(true);
    expect(r.respirationRate).toBeGreaterThan(0);
  });

  it('net rate becomes negative in very low light', () => {
    const r = run({ sunlight: 0, co2: 0.5, water: 0.5, leafArea: 50 });
    expect(r.netRate).toBeLessThan(0);
  });

  it('increasing sunlight/co2 raises photosynthesis rate', () => {
    const low = run({ sunlight: 0.2, co2: 0.2, water: 0.8, leafArea: 80 }).photosynthesisRate;
    const high = run({ sunlight: 0.9, co2: 0.9, water: 0.8, leafArea: 80 }).photosynthesisRate;
    expect(high).toBeGreaterThan(low);
  });

  it('clamps out of range inputs', () => {
    const r = run({ sunlight: -1, co2: 5, water: -10, leafArea: 0 });
    expect(Number.isFinite(r.photosynthesisRate)).toBe(true);
  });

  it('includes explanatory notes', () => {
    const r = run({ sunlight: 0.9, co2: 0.9, water: 0.9, leafArea: 100 });
    expect(Array.isArray(r.notes)).toBe(true);
    expect(r.notes.length).toBeGreaterThan(0);
  });
});
