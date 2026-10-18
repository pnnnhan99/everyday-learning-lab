import type { Simulation, SimulationContract } from '@/core/simulation/types';

export interface AcidBaseReactionInit {
  baseAmount: number;
  acidAmount: number;
}

export interface AcidBaseReactionResult {
  co2Produced: number;
  observation: string;
  neutralized: boolean;
  excess: 'acid' | 'base' | 'none';
}

const metadata: Simulation['metadata'] = {
  id: 'chemistry.acid-base.co2',
  name: 'Acid-Base CO2 Production',
  domain: 'chemistry',
  description:
    'Simple educational model of carbon dioxide production when an acid reacts with a carbonate/base (e.g. lemon juice + baking soda).',
  assumptions: [
    'This is an educational geometric/stoichiometric approximation, not a quantum-chemical simulation.',
    'Temperature and pressure are assumed constant.',
    'Reaction goes to completion under these conditions.',
  ],
  limitations: [
    'Does not account for solubility, rate, or side reactions.',
    'Values are approximate for illustrative purposes only.',
  ],
  references: [
    { title: 'Baking soda and acids (educational model)', url: 'https://en.wikipedia.org/wiki/Sodium_bicarbonate' },
  ],
  units: {
    baseAmount: 'g',
    acidAmount: 'mL',
    co2Produced: 'mL (approx)',
  },
  validInputRanges: {
    baseAmount: { min: 0.1, max: 20 },
    acidAmount: { min: 0.5, max: 50 },
  },
};

function clamp(value: number, range: { min: number; max: number }): number {
  if (Number.isNaN(value)) return range.min;
  if (value < range.min) return range.min;
  if (value > range.max) return range.max;
  return value;
}

function createContract(): SimulationContract<AcidBaseReactionInit, AcidBaseReactionResult> {
  let initialized = false;

  return {
    initialize() {
      initialized = true;
    },
    run(init?: AcidBaseReactionInit): AcidBaseReactionResult {
      if (!initialized) {
        // Auto-initialize for testability (lazy)
        initialized = true;
      }
      const base = init ? clamp(init.baseAmount, metadata.validInputRanges!.baseAmount) : 1;
      const acid = init ? clamp(init.acidAmount, metadata.validInputRanges!.acidAmount) : 1;

      // Simple approximation: CO2 produced proportional to limiting reagent
      const baseCO2 = base * 200; // approximate mL/g
      const acidCO2 = acid * 20; // approximate mL/mL
      const co2Produced = Math.min(baseCO2, acidCO2);
      const neutralized = co2Produced > 0;
      const excess: AcidBaseReactionResult['excess'] = baseCO2 > acidCO2 + 1e-9 ? 'base' : acidCO2 > baseCO2 + 1e-9 ? 'acid' : 'none';

      return {
        co2Produced: Math.round(co2Produced * 10) / 10,
        observation: neutralized
          ? 'Model predicts carbon dioxide bubbles forming as the reaction proceeds.'
          : 'No significant gas predicted under these input ranges.',
        neutralized,
        excess,
      };
    },
  };
}

export const acidBaseCO2Simulation: Simulation<AcidBaseReactionInit, AcidBaseReactionResult> = {
  id: metadata.id,
  metadata,
  create: createContract,
};

export default acidBaseCO2Simulation;
