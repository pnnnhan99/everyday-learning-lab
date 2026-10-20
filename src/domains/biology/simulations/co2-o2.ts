import type { Simulation, SimulationContract, SimulationMetadata } from '@/core/simulation/types';

export interface CO2O2Init {
  sunlight: number;
  co2: number;
  water: number;
  leafArea: number;
}

export interface CO2O2Result {
  photosynthesisRate: number;
  respirationRate: number;
  netRate: number;
  oxygenReleased: number;
  co2Consumed: number;
  notes: string[];
}

const metadata: SimulationMetadata = {
  id: 'biology.co2-o2',
  name: 'CO₂–O₂ Balance (Photosynthesis ↔ Respiration)',
  domain: 'biology',
  description:
    'Simplified model balancing photosynthesis (CO₂ uptake, O₂ release) and respiration (opposite) under light, CO₂, water, and leaf area. Purpose-built for learning, not for precise plant physiology.',
  assumptions: [
    'Photosynthesis rate scales roughly with sunlight, available CO₂, water, and leaf area up to an optimal range.',
    'Respiration rate is a baseline rate that increases with temperature effect (fixed here for simplicity).',
    'Net rate = photosynthesisRate − respirationRate.',
    'Mass/stoichiometry is approximated; units are arbitrary relative rates for learning.',
    'At night/very low light, respiration dominates (net negative).',
  ],
  limitations: [
    'Does not model temperature, enzyme kinetics, photoinhibition, humidity, or stomatal conductance.',
    'Ignores variation between plant species, leaf age, or nutrient limits.',
    'Only a heuristic approximation; real rates depend on many interacting factors.',
  ],
  references: [
    { title: 'Photosynthesis — Britannica', url: 'https://www.britannica.com/science/photosynthesis' },
    { title: 'Cellular respiration — Khan Academy', url: 'https://www.khanacademy.org/science/biology/cellular-respiration' },
  ],
  units: {
    sunlight: '0-1 fraction (1 = full light)',
    co2: '0-1 fraction (1 = high)',
    water: '0-1 fraction (1 = sufficient)',
    leafArea: 'cm² (scaled)',
    rate: 'arbitrary units',
    gas: 'arbitrary units',
  },
  validInputRanges: {
    sunlight: { min: 0, max: 1 },
    co2: { min: 0, max: 1 },
    water: { min: 0, max: 1 },
    leafArea: { min: 1, max: 500 },
  },
  defaults: {
    sunlight: 0.8,
    co2: 0.6,
    water: 0.7,
    leafArea: 100,
  },
  safetyNotes: [
    'This is an educational heuristic, not a validated crop model. Do not use for decision making in cultivation.',
  ],
};

function clamp(value: number, range: { min: number; max: number }): number {
  if (Number.isNaN(value)) return range.min;
  return Math.min(Math.max(value, range.min), range.max);
}

function sigmoid(x: number) {
  return 1 / (1 + Math.exp(-5 * (x - 0.5)));
}

function createContract(): SimulationContract<CO2O2Init, CO2O2Result> {
  return {
    initialize() {
      // Pure function; nothing to prepare.
    },
    run(input?: CO2O2Init): CO2O2Result {
      const sunlight = clamp(input?.sunlight ?? 0.8, metadata.validInputRanges!.sunlight);
      const co2 = clamp(input?.co2 ?? 0.6, metadata.validInputRanges!.co2);
      const water = clamp(input?.water ?? 0.7, metadata.validInputRanges!.water);
      const leafArea = clamp(input?.leafArea ?? 100, metadata.validInputRanges!.leafArea);

      const lightFactor = sigmoid(sunlight * 1.2);
      const co2Factor = sigmoid(co2 * 1.0);
      const waterFactor = Math.min(1, water * 1.2);
      const areaFactor = Math.sqrt(leafArea) / Math.sqrt(200); // gentle scaling

      const photosynthesisRate = lightFactor * co2Factor * waterFactor * areaFactor * 50;
      const respirationRate = 5 + 2 * (1 - lightFactor); // higher when dark
      const netRate = photosynthesisRate - respirationRate;
      const oxygenReleased = photosynthesisRate * 0.45;
      const co2Consumed = photosynthesisRate * 0.55;

      const notes = [];
      if (sunlight < 0.2) notes.push('Low light: respiration dominates (net rate negative).');
      if (netRate > 0) notes.push('Plant is net producer of O₂ in these conditions.');
      else notes.push('Plant is net consumer of O₂ in these conditions.');
      if (water < 0.3) notes.push('Water-limited: photosynthesis is strongly reduced.');
      if (co2 < 0.2) notes.push('CO₂-limited: photosynthesis is strongly reduced.');

      return {
        photosynthesisRate,
        respirationRate,
        netRate,
        oxygenReleased,
        co2Consumed,
        notes,
      };
    },
  };
}

export const co2o2Simulation: Simulation<CO2O2Init, CO2O2Result> = {
  id: metadata.id,
  metadata,
  create: createContract,
};

export default co2o2Simulation;
