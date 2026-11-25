import { describe, expect, it } from 'vitest';

import {
  getQualitySettings,
  isLab3DQuality,
  LAB3D_QUALITY_SETTINGS,
  resolveQuality,
} from '@/components/lab3d/quality';

describe('lab 3D quality presets', () => {
  it('resolves only supported preset values', () => {
    expect(resolveQuality('low')).toBe('low');
    expect(resolveQuality('standard')).toBe('standard');
    expect(resolveQuality('ultra')).toBe('standard');
    expect(resolveQuality(null)).toBe('standard');
    expect(isLab3DQuality('low')).toBe(true);
    expect(isLab3DQuality('high')).toBe(false);
  });

  it('caps resolution and mesh detail in both presets', () => {
    for (const settings of Object.values(LAB3D_QUALITY_SETTINGS)) {
      expect(settings.dpr[0]).toBeGreaterThanOrEqual(1);
      expect(settings.dpr[1]).toBeLessThanOrEqual(1.5);
      expect(settings.sphereSegments).toBeGreaterThan(0);
      expect(settings.cylinderSegments).toBeGreaterThan(0);
    }

    const low = getQualitySettings('low');
    const standard = getQualitySettings('standard');
    expect(low.dpr[1]).toBeLessThan(standard.dpr[1]);
    expect(low.sphereSegments).toBeLessThan(standard.sphereSegments);
    expect(low.cylinderSegments).toBeLessThan(standard.cylinderSegments);
  });
});
