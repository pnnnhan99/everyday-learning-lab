import { describe, it, expect } from 'vitest';
import { projectileSimulation } from '../../../src/domains/physics/simulations/projectile';

function run(speed: number, angle: number, gravity: number) {
  const contract = projectileSimulation.create();
  contract.initialize();
  return contract.run({ speed, angle, gravity }) as {
    range: number;
    maxHeight: number;
    flightTime: number;
    peakTime: number;
    trajectory: Array<{ t: number; x: number; y: number }>;
  };
}

describe('projectileSimulation', () => {
  it('declares complete metadata with assumptions and references', () => {
    expect(projectileSimulation.id).toBe('physics.projectile');
    expect(projectileSimulation.metadata.domain).toBe('physics');
    expect(projectileSimulation.metadata.assumptions.length).toBeGreaterThan(0);
    expect(projectileSimulation.metadata.limitations.length).toBeGreaterThan(0);
    expect(projectileSimulation.metadata.references.length).toBeGreaterThan(0);
    expect(projectileSimulation.metadata.validInputRanges?.speed).toBeDefined();
    expect(projectileSimulation.metadata.units?.range).toBe('m');
  });

  it('computes the 45-degree range for v=10 m/s, g=10 m/s^2', () => {
    const result = run(10, 45, 10);
    expect(result.range).toBeCloseTo(10, 5);
    expect(result.maxHeight).toBeCloseTo(2.5, 5);
    expect(result.flightTime).toBeCloseTo(Math.sqrt(2), 5);
    expect(result.peakTime).toBeCloseTo(Math.sqrt(2) / 2, 5);
  });

  it('treats 30 and 60 degrees as complementary ranges (same range)', () => {
    const r30 = run(20, 30, 9.81).range;
    const r60 = run(20, 60, 9.81).range;
    expect(r30).toBeCloseTo(r60, 4);
  });

  it('max height grows with launch speed', () => {
    const slow = run(5, 45, 9.81).maxHeight;
    const fast = run(10, 45, 9.81).maxHeight;
    expect(fast).toBeGreaterThan(slow);
  });

  it('clamps out-of-range inputs instead of failing', () => {
    const result = run(9999, 89, 0);
    expect(Number.isFinite(result.range)).toBe(true);
    expect(Number.isFinite(result.maxHeight)).toBe(true);
    expect(Number.isFinite(result.flightTime)).toBe(true);
  });

  it('returns a trajectory that starts and ends at ground level', () => {
    const { trajectory } = run(15, 40, 9.81);
    expect(trajectory.length).toBeGreaterThan(1);
    expect(trajectory[0].y).toBeCloseTo(0, 6);
    expect(trajectory[trajectory.length - 1].y).toBeCloseTo(0, 6);
  });

  it('is testable without React, Next.js, or a browser', () => {
    expect(typeof projectileSimulation.create).toBe('function');
    expect(typeof run(1, 1, 1).range).toBe('number');
  });
});
