import { describe, it, expect } from 'vitest';
import { SimulationRegistry } from '../../src/core/simulation';
import { acidBaseCO2Simulation } from '../../src/domains/chemistry/simulations/acidBaseCO2';

describe('SimulationRegistry', () => {
  it('registers and creates simulations', () => {
    const registry = new SimulationRegistry();
    registry.register(acidBaseCO2Simulation);
    expect(registry.has('chemistry.acid-base.co2')).toBe(true);
    const contract = registry.create('chemistry.acid-base.co2');
    expect(contract).toBeDefined();
  });

  it('lists registered simulations', () => {
    const registry = new SimulationRegistry();
    registry.register(acidBaseCO2Simulation);
    expect(registry.list()).toHaveLength(1);
  });

  it('returns undefined for unknown simulation', () => {
    const registry = new SimulationRegistry();
    expect(registry.get('unknown')).toBeUndefined();
    expect(registry.create('unknown')).toBeUndefined();
  });
});
