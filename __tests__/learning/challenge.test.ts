import { describe, it, expect } from 'vitest';
import { validateChallenge } from '../../src/learning/types';
import { greenhouseCarbonChallenge } from '../../src/learning/examples/challenge-greenhouse-carbon';

const base = {
  id: 'chal-1',
  title: 'Test Challenge',
  description: 'desc',
  domain: 'realworld',
  difficulty: 'intermediate',
  language: 'en',
  prerequisites: [],
  references: [],
};

describe('validateChallenge', () => {
  it('accepts a well-formed challenge', () => {
    const result = validateChallenge(greenhouseCarbonChallenge);
    expect(result.ok).toBe(true);
  });

  it('rejects missing realWorldQuestion', () => {
    const result = validateChallenge({ ...base });
    expect(result.ok).toBe(false);
  });

  it('rejects empty steps', () => {
    const result = validateChallenge({
      ...base,
      realWorldQuestion: 'q',
      requiredConcepts: ['a'],
      steps: [],
      evidence: [],
      constraints: [],
      evaluation: 'e',
      linkedSimulationIds: ['x'],
      relatedLessonIds: [],
    });
    expect(result.ok).toBe(false);
  });

  it('rejects empty linkedSimulationIds', () => {
    const result = validateChallenge({
      ...base,
      realWorldQuestion: 'q',
      requiredConcepts: ['a'],
      steps: ['s'],
      evidence: [],
      constraints: [],
      evaluation: 'e',
      linkedSimulationIds: [],
      relatedLessonIds: [],
    });
    expect(result.ok).toBe(false);
  });

  it('sample challenge links real simulations and lessons', () => {
    expect(greenhouseCarbonChallenge.linkedSimulationIds.length).toBeGreaterThan(0);
    expect(greenhouseCarbonChallenge.domain).toBe('realworld');
  });
});
