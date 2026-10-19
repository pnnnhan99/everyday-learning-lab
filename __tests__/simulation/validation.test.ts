import { describe, expect, it } from 'vitest';

import { validateSimulationInput } from '../../src/core/simulation/validation';
import { SimulationRegistry } from '../../src/core/simulation/registry';
import { projectileSimulation } from '../../src/domains/physics/simulations/projectile';
import { fractionsCompareSimulation } from '../../src/domains/mathematics/simulations/fractions-compare';
import type { Simulation, SimulationContract } from '../../src/core/simulation/types';

const projectileMeta = projectileSimulation.metadata;

describe('validateSimulationInput', () => {
  it('accepts in-range inputs and returns normalized values', () => {
    const result = validateSimulationInput({ speed: 20, angle: 45, gravity: 9.81 }, projectileMeta);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.values).toEqual({ speed: 20, angle: 45, gravity: 9.81 });
    }
  });

  it('falls back to defaults when input is undefined or null', () => {
    for (const input of [undefined, null]) {
      const result = validateSimulationInput(input, projectileMeta);
      expect(result.ok).toBe(true);
      if (result.ok) expect(result.values).toEqual(projectileMeta.defaults);
    }
  });

  it('rejects out-of-range values with a message naming the key and bounds', () => {
    const result = validateSimulationInput({ speed: 9999, angle: 45, gravity: 9.81 }, projectileMeta);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain('speed');
      expect(result.errors[0]).toContain('between 0.1 and 200');
    }
  });

  it('rejects boundary-violating low values', () => {
    const result = validateSimulationInput({ speed: 10, angle: 0, gravity: 9.81 }, projectileMeta);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors[0]).toContain('angle');
  });

  it('accepts exact boundary values', () => {
    const low = validateSimulationInput({ speed: 0.1, angle: 1, gravity: 0.1 }, projectileMeta);
    const high = validateSimulationInput({ speed: 200, angle: 89, gravity: 30 }, projectileMeta);
    expect(low.ok).toBe(true);
    expect(high.ok).toBe(true);
  });

  it('rejects non-finite numbers (NaN, Infinity)', () => {
    for (const value of [Number.NaN, Number.POSITIVE_INFINITY]) {
      const result = validateSimulationInput({ speed: value, angle: 45, gravity: 9.81 }, projectileMeta);
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.errors[0]).toContain('finite number');
    }
  });

  it('rejects non-numeric and non-object inputs', () => {
    expect(validateSimulationInput('fast', projectileMeta).ok).toBe(false);
    expect(validateSimulationInput(42, projectileMeta).ok).toBe(false);
    expect(validateSimulationInput([20], projectileMeta).ok).toBe(false);
  });

  it('rejects undeclared keys', () => {
    const result = validateSimulationInput(
      { speed: 20, angle: 45, gravity: 9.81, wind: 3 },
      projectileMeta,
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors[0]).toContain('not a valid input');
  });

  it('treats range keys without defaults as optional (math commonDenom)', () => {
    const meta = fractionsCompareSimulation.metadata;
    const result = validateSimulationInput(
      { numeratorA: 1, denominatorA: 2, numeratorB: 1, denominatorB: 3 },
      meta,
    );
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.values.commonDenom).toBeUndefined();
  });

  it('still validates the optional key when it is supplied', () => {
    const meta = fractionsCompareSimulation.metadata;
    const good = validateSimulationInput(
      { numeratorA: 1, denominatorA: 2, numeratorB: 1, denominatorB: 3, commonDenom: 6 },
      meta,
    );
    const bad = validateSimulationInput(
      { numeratorA: 1, denominatorA: 2, numeratorB: 1, denominatorB: 3, commonDenom: 0 },
      meta,
    );
    expect(good.ok).toBe(true);
    expect(bad.ok).toBe(false);
    if (!bad.ok) expect(bad.errors[0]).toContain('commonDenom');
  });

  it('reports every problem at once, not just the first', () => {
    const result = validateSimulationInput(
      { speed: 9999, angle: 0, gravity: Number.NaN },
      projectileMeta,
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors).toHaveLength(3);
  });

  it('validates values returned by a successful validation through the real contract', () => {
    const validation = validateSimulationInput({ speed: 25, angle: 30, gravity: 9.81 }, projectileMeta);
    expect(validation.ok).toBe(true);
    if (validation.ok) {
      const contract = projectileSimulation.create();
      contract.initialize();
      const result = contract.run(validation.values as { speed: number; angle: number; gravity: number }) as {
        range: number;
      };
      expect(Number.isFinite(result.range)).toBe(true);
    }
  });
});

describe('adding a new simulation without touching shared internals', () => {
  it('a new Simulation registers, validates, and runs through the generic contract API', () => {
    interface DoubleInit { value: number }
    interface DoubleResult { doubled: number }

    const doubleSimulation: Simulation<DoubleInit, DoubleResult> = {
      id: 'test.double',
      metadata: {
        id: 'test.double',
        name: 'Double',
        domain: 'mathematics',
        description: 'Test-only simulation that doubles a number.',
        assumptions: [],
        limitations: [],
        references: [],
        units: { value: 'dimensionless' },
        validInputRanges: { value: { min: -100, max: 100 } },
        defaults: { value: 2 },
      },
      create: (): SimulationContract<DoubleInit, DoubleResult> => ({
        initialize() {},
        run(input) {
          return { doubled: (input?.value ?? 0) * 2 };
        },
      }),
    };

    const registry = new SimulationRegistry();
    registry.register(doubleSimulation);

    const registered = registry.get<DoubleInit, DoubleResult>('test.double');
    expect(registered).toBeDefined();
    if (!registered) return;

    const validation = validateSimulationInput({ value: 21 }, registered.metadata);
    expect(validation.ok).toBe(true);
    if (!validation.ok) return;

    const contract = registered.create();
    contract.initialize();
    expect(contract.run(validation.values as unknown as DoubleInit)).toEqual({ doubled: 42 });

    const invalid = validateSimulationInput({ value: 500 }, registered.metadata);
    expect(invalid.ok).toBe(false);
  });
});
