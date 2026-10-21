import { SimulationContract } from '../types';
import { findReactionPair } from '../../lib/db';

export interface ReactionSimulationInput {
  element1Id: string;
  element2Id: string;
}

export interface ReactionSimulationOutput {
  reaction: {
    element1Id: string;
    element2Id: string;
    resultTitle: string;
    observation: string;
    explanation: string;
    effectType: string;
    safetyGuidance: string;
    reviewStatus: string;
  } | null;
}

export const reactionSimulationMetadata = {
  id: 'reaction-simulation',
  name: 'Reaction Simulation',
  description: 'Simulates a reaction between two elements.',
  references: [
    'https://example.com/reaction-reference'
  ],
  assumptions: [
    'The reaction is based on the predefined mock data.',
    'The order of elements does not matter.'
  ],
  safetyNotes: 'No safety notes for this simulation.',
  inputRanges: {
    element1Id: { min: 0, max: 0, unit: 'string' },
    element2Id: { min: 0, max: 0, unit: 'string' }
  },
  outputUnits: {}
};

export const reactionSimulation: SimulationContract<ReactionSimulationInput, ReactionSimulationOutput> = {
  id: 'reaction-simulation',
  metadata: reactionSimulationMetadata,
  validateInput: (input: unknown): input is ReactionSimulationInput => {
    if (typeof input !== 'object' || input === null) return false;
    const { element1Id, element2Id } = input as ReactionSimulationInput;
    return typeof element1Id === 'string' && element1Id.length > 0 &&
           typeof element2Id === 'string' && element2Id.length > 0;
  },
  simulate: async (input: ReactionSimulationInput): Promise<ReactionSimulationOutput> => {
    const { element1Id, element2Id } = input;
    const reaction = await findReactionPair(element1Id, element2Id);
    return {
      reaction: reaction ? {
        element1Id: reaction.element1Id,
        element2Id: reaction.element2Id,
        resultTitle: reaction.resultTitle,
        observation: reaction.observation,
        explanation: reaction.explanation,
        effectType: reaction.effectType,
        safetyGuidance: reaction.safetyGuidance,
        reviewStatus: reaction.reviewStatus
      } : null
    };
  }
};

// Register the simulation
import { registerSimulation } from '../simulationRegistry';
registerSimulation(reactionSimulation);