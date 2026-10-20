import { describe, expect, it } from 'vitest';
import { isLab3DModel, resolveInitialModel } from '@/components/lab3d/params';

describe('isLab3DModel', () => {
  it('accepts every supported model id', () => {
    expect(isLab3DModel('water')).toBe(true);
    expect(isLab3DModel('projectile')).toBe(true);
    expect(isLab3DModel('plant-cell')).toBe(true);
  });

  it('rejects unknown, empty, and non-string values', () => {
    expect(isLab3DModel('molecule')).toBe(false);
    expect(isLab3DModel('')).toBe(false);
    expect(isLab3DModel(null)).toBe(false);
    expect(isLab3DModel(undefined)).toBe(false);
  });
});

describe('resolveInitialModel', () => {
  it('returns a supported model when given a valid one', () => {
    expect(resolveInitialModel('projectile')).toBe('projectile');
    expect(resolveInitialModel('plant-cell')).toBe('plant-cell');
  });

  it('falls back to water for a missing or invalid query param', () => {
    expect(resolveInitialModel(null)).toBe('water');
    expect(resolveInitialModel(undefined)).toBe('water');
    expect(resolveInitialModel('nope')).toBe('water');
  });
});
