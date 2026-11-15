import { describe, expect, it } from 'vitest';

import { describeResult, initialSimulationInputs, simulationInputKeys } from '@/lib/simulationView';
import { projectileSimulation } from '@/domains/physics/simulations/projectile';

describe('simulationView', () => {
  it('separates scalars, lists, and everything else', () => {
    const view = describeResult(
      { range: 40.8, trajectory: [{ x: 1, y: 2 }], note: 'ok', broken: Number.NaN },
      projectileSimulation.metadata,
    );

    expect(view.scalars).toEqual([{ key: 'range', value: 40.8, unit: 'm' }]);
    expect(view.lists).toHaveLength(1);
    expect(view.lists[0].key).toBe('trajectory');
    expect(view.others.map((entry) => entry.key)).toEqual(['note', 'broken']);
  });

  it('describes primitive results without throwing', () => {
    const view = describeResult(42, projectileSimulation.metadata);
    expect(view.scalars).toHaveLength(0);
    expect(view.others).toEqual([{ key: 'Result', value: '42' }]);
  });

  it('collects input keys from ranges and defaults', () => {
    const metadata = {
      ...projectileSimulation.metadata,
      defaults: { ...(projectileSimulation.metadata.defaults ?? {}), extra: 1 },
    };
    const keys = simulationInputKeys(metadata);
    expect(keys).toContain('speed');
    expect(keys).toContain('extra');
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('starts from defaults but keeps learner-set values', () => {
    const values = initialSimulationInputs(projectileSimulation.metadata, { speed: 12 });
    expect(values.speed).toBe(12);
    expect(values.angle).toBe(projectileSimulation.metadata.defaults?.angle);
  });
});
