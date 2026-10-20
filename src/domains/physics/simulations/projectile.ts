import type { Simulation, SimulationContract, SimulationMetadata } from '@/core/simulation/types';

export interface ProjectileInit {
  speed: number;
  angle: number;
  gravity: number;
}

export interface ProjectileResult {
  range: number;
  maxHeight: number;
  flightTime: number;
  peakTime: number;
  trajectory: Array<{ t: number; x: number; y: number }>;
}

const metadata: SimulationMetadata = {
  id: 'physics.projectile',
  name: 'Projectile Motion',
  domain: 'physics',
  description:
    'Mathematical model of projectile motion: computes range, peak height, and flight time from launch speed, angle, and gravity.',
  assumptions: [
    'Air resistance is ignored.',
    'Gravitational acceleration is constant and points straight down.',
    'Launch and landing heights are equal (both at y = 0).',
    'The projectile is a point mass with no spin or lift.',
  ],
  limitations: [
    'Not accurate for fast or long-range projectiles where drag matters.',
    'Does not model wind, terrain, or inelastic impacts.',
  ],
  references: [
    { title: 'Projectile motion — Wikipedia', url: 'https://en.wikipedia.org/wiki/Projectile_motion' },
    { title: 'Vectors and Projectiles — The Physics Classroom', url: 'https://www.physicsclassroom.com/class/vectors' },
  ],
  units: {
    speed: 'm/s',
    angle: 'degrees',
    gravity: 'm/s^2',
    range: 'm',
    maxHeight: 'm',
    flightTime: 's',
  },
  validInputRanges: {
    speed: { min: 0.1, max: 200 },
    angle: { min: 1, max: 89 },
    gravity: { min: 0.1, max: 30 },
  },
  defaults: {
    speed: 20,
    angle: 45,
    gravity: 9.81,
  },
  safetyNotes: ['This is a mathematical learning model; do not use it to aim real projectiles.'],
};

function clamp(value: number, range: { min: number; max: number }): number {
  if (Number.isNaN(value)) return range.min;
  return Math.min(Math.max(value, range.min), range.max);
}

function simulate(speed: number, angleDeg: number, gravity: number): ProjectileResult {
  const theta = (angleDeg * Math.PI) / 180;
  const vx = speed * Math.cos(theta);
  const vy = speed * Math.sin(theta);

  const flightTime = (2 * vy) / gravity;
  const peakTime = vy / gravity;
  const range = vx * flightTime;
  const maxHeight = (vy * vy) / (2 * gravity);

  const STEPS = 24;
  const trajectory = Array.from({ length: STEPS + 1 }, (_, i) => {
    const t = (flightTime * i) / STEPS;
    return { t, x: vx * t, y: vy * t - 0.5 * gravity * t * t };
  });

  return { range, maxHeight, flightTime, peakTime, trajectory };
}

function createContract(): SimulationContract<ProjectileInit, ProjectileResult> {
  return {
    initialize() {
      // Pure function; nothing to prepare.
    },
    run(input?: ProjectileInit): ProjectileResult {
      const speed = clamp(input?.speed ?? 10, metadata.validInputRanges!.speed);
      const angle = clamp(input?.angle ?? 45, metadata.validInputRanges!.angle);
      const gravity = clamp(input?.gravity ?? 9.81, metadata.validInputRanges!.gravity);
      return simulate(speed, angle, gravity);
    },
  };
}

export const projectileSimulation: Simulation<ProjectileInit, ProjectileResult> = {
  id: metadata.id,
  metadata,
  create: createContract,
};

export default projectileSimulation;
