import { describe, expect, it } from 'vitest';

import { registerAllSimulations, globalRegistry } from '@/simulations';
import { chemistryAcidsBasesLesson } from '@/learning/examples/chemistry-acids-bases';
import { mathematicsFractionsLesson } from '@/learning/examples/mathematics-fractions';
import { physicsProjectileLesson } from '@/learning/examples/physics-projectile';
import { biologyCO2O2Lesson } from '@/learning/examples/biology-co2-o2';
import { greenhouseCarbonChallenge } from '@/learning/examples/challenge-greenhouse-carbon';
import { validateLesson, validateChallenge, type Lesson } from '@/learning/types';

registerAllSimulations();

const lessons: Lesson[] = [
  chemistryAcidsBasesLesson,
  mathematicsFractionsLesson,
  physicsProjectileLesson,
  biologyCO2O2Lesson,
];

describe('lesson content integrity', () => {
  it('every lesson passes the runtime validator', () => {
    for (const lesson of lessons) {
      const result = validateLesson(lesson);
      expect(result.ok, `${lesson.id}: ${result.ok ? '' : result.error}`).toBe(true);
    }
  });

  it('every simulation-typed application points at a registered simulation', () => {
    for (const lesson of lessons) {
      for (const section of lesson.sections) {
        for (const app of section.applications) {
          if (app.type !== 'simulation') continue;
          expect(
            globalRegistry.has(app.resourceId),
            `${lesson.id}/${app.id}: simulation "${app.resourceId}" is not registered`,
          ).toBe(true);
        }
      }
    }
  });

  it('no lesson references a placeholder reference id', () => {
    for (const lesson of lessons) {
      for (const reference of lesson.references) {
        expect(reference, `${lesson.id} has a placeholder reference`).not.toMatch(/^ref-[a-z]+-\d+$/);
      }
    }
  });

  it('every quiz assessment carries inline items matching its itemIds', () => {
    for (const lesson of lessons) {
      for (const section of lesson.sections) {
        for (const assessment of section.assessments) {
          if (assessment.type !== 'quiz') continue;
          expect(assessment.items, `${lesson.id}/${assessment.id} has no items`).toBeDefined();
          const itemIds = (assessment.items ?? []).map((item) => item.id).sort();
          expect(itemIds).toEqual([...assessment.itemIds].sort());
        }
      }
    }
  });

  it('the greenhouse challenge links to registered simulations and validates', () => {
    for (const id of greenhouseCarbonChallenge.linkedSimulationIds) {
      expect(globalRegistry.has(id), `challenge links unknown simulation "${id}"`).toBe(true);
    }
    expect(validateChallenge(greenhouseCarbonChallenge).ok).toBe(true);
  });
});
