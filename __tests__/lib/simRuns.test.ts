import { describe, expect, it } from 'vitest';

import {
  MAX_SAVED_RUNS,
  addSavedRun,
  createSavedRun,
  formatNumber,
  humanizeKey,
  parseSavedRuns,
  readSavedRuns,
  runStorageKey,
  writeSavedRuns,
  type SavedRun,
} from '@/lib/simRuns';

function run(id: string): SavedRun {
  return {
    id,
    at: 1_700_000_000_000,
    inputs: [{ key: 'angle', value: 45, unit: '°' }],
    scalars: [{ key: 'range', value: 12.5, unit: 'm' }],
  };
}

describe('runStorageKey', () => {
  it('scopes saved runs per simulation', () => {
    expect(runStorageKey('projectile')).toBe('ess:sim-runs:projectile');
    expect(runStorageKey('projectile')).not.toBe(runStorageKey('fractions'));
  });
});

describe('parseSavedRuns', () => {
  it('returns an empty list for missing, invalid, or non-array data', () => {
    expect(parseSavedRuns(null)).toEqual([]);
    expect(parseSavedRuns('')).toEqual([]);
    expect(parseSavedRuns('not json')).toEqual([]);
    expect(parseSavedRuns('{"id":"one"}')).toEqual([]);
  });

  it('keeps valid runs and drops malformed entries', () => {
    const raw = JSON.stringify([
      run('a'),
      { id: 'broken', at: 1, inputs: [{ key: 'x', value: 'nope' }], scalars: [] },
      { id: 'missing-inputs', at: 1, scalars: [] },
      run('b'),
    ]);

    expect(parseSavedRuns(raw).map((entry) => entry.id)).toEqual(['a', 'b']);
  });

  it('caps the list at the maximum number of saved runs', () => {
    const raw = JSON.stringify(Array.from({ length: MAX_SAVED_RUNS + 3 }, (_, index) => run(`run-${index}`)));
    expect(parseSavedRuns(raw)).toHaveLength(MAX_SAVED_RUNS);
  });
});

describe('addSavedRun', () => {
  it('puts the newest run first and drops the oldest beyond the cap', () => {
    const existing = Array.from({ length: MAX_SAVED_RUNS }, (_, index) => run(`old-${index}`));
    const next = addSavedRun(existing, run('newest'));

    expect(next[0].id).toBe('newest');
    expect(next).toHaveLength(MAX_SAVED_RUNS);
    expect(next.some((entry) => entry.id === `old-${MAX_SAVED_RUNS - 1}`)).toBe(false);
  });
});

describe('createSavedRun', () => {
  it('captures the inputs, scalars, and timestamp', () => {
    const inputs = [{ key: 'speed', value: 10, unit: 'm/s' }];
    const scalars = [{ key: 'range', value: 20.4, unit: 'm' }];
    const created = createSavedRun(inputs, scalars, 1_234);

    expect(created.at).toBe(1_234);
    expect(created.inputs).toEqual(inputs);
    expect(created.scalars).toEqual(scalars);
    expect(created.id).toContain('1234');
  });
});

describe('storage guards', () => {
  it('is a no-op without localStorage and never throws', () => {
    expect(readSavedRuns('projectile')).toEqual([]);
    expect(() => writeSavedRuns('projectile', [run('a')])).not.toThrow();
  });
});

describe('formatting helpers', () => {
  it('humanizes camelCase, snake_case, and kebab-case keys', () => {
    expect(humanizeKey('initialSpeed')).toBe('Initial Speed');
    expect(humanizeKey('max_height')).toBe('Max height');
    expect(humanizeKey('time-of-flight')).toBe('Time of flight');
  });

  it('formats numbers without trailing noise', () => {
    expect(formatNumber(5)).toBe('5');
    expect(formatNumber(12.5)).toBe('12.5');
    expect(formatNumber(1234.56)).toBe('1234.6');
  });
});
