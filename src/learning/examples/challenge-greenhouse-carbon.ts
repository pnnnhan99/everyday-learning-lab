import type { Challenge } from '@/learning/types';

export const greenhouseCarbonChallenge: Challenge = {
  id: 'challenge-greenhouse-carbon',
  title: 'Measuring Plant Respiration with Chemistry and Biology',
  description:
    'Combine an acid-base CO₂ model with a photosynthesis/respiration model to reason about how a sealed greenhouse changes over a day, and how you would verify the change.',
  domain: 'realworld',
  difficulty: 'intermediate',
  language: 'en',
  prerequisites: ['Acids and bases basics', 'Photosynthesis vs respiration basics'],
  references: [
    'Britannica: Photosynthesis',
    'Khan Academy: Cellular respiration',
  ],
  realWorldQuestion:
    'In a sealed greenhouse, will CO₂ rise or fall overnight, and how could you detect and quantify the change using simple chemistry?',
  requiredConcepts: [
    'CO₂ is consumed by photosynthesis (in light) and produced by respiration (always).',
    'Water plus CO₂ form carbonic acid, which shifts pH — a detectable signal.',
    'Net gas exchange depends on light, temperature, and plant biomass.',
  ],
  steps: [
    'Run the CO₂–O₂ model at full sunlight (daytime) and record net rate and gas amounts.',
    'Run the same model with sunlight near zero (night) and record the change.',
    'Use the acid–base CO₂ model to relate the CO₂ amount to an observable pH shift.',
    'Predict the direction of CO₂ change over a full day/night cycle and justify it.',
  ],
  evidence: [
    'Net rate value from the CO₂–O₂ model for day and night.',
    'Direction of CO₂ change inferred from the acid–base model.',
    'A written pH prediction before and after the overnight period.',
  ],
  constraints: [
    'Use only the two provided models; do not use real plants or chemicals.',
    'Assume a sealed system with no ventilation and constant temperature.',
  ],
  evaluation:
    'A correct answer states that CO₂ rises overnight (respiration dominates without light), falls during the day when photosynthesis exceeds respiration, and links the CO₂ change to a measurable pH decrease (more acidic) via the acid–base model. Partial credit is given for a correct direction with an incomplete mechanism.',
  linkedSimulationIds: ['biology.co2-o2', 'chemistry.acid-base.co2'],
  relatedLessonIds: ['bio-co2-o2-101', 'chem-acids-bases-101'],
};

export default greenhouseCarbonChallenge;
