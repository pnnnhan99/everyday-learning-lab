import { describe, expect, it } from 'vitest';

import { registerAllSimulations, globalRegistry } from '@/simulations';
import { chemistryAcidsBasesLesson } from '@/learning/examples/chemistry-acids-bases';
import { mathematicsFractionsLesson } from '@/learning/examples/mathematics-fractions';
import { physicsProjectileLesson } from '@/learning/examples/physics-projectile';
import { biologyCO2O2Lesson } from '@/learning/examples/biology-co2-o2';
import { greenhouseCarbonChallenge } from '@/learning/examples/challenge-greenhouse-carbon';
import {
  biologyCO2O2LessonVi,
  chemistryAcidsBasesLessonVi,
  greenhouseCarbonChallengeVi,
  mathematicsFractionsLessonVi,
  physicsProjectileLessonVi,
} from '@/learning/examples/vi';
import {
  challenges,
  learningDomains,
  lessons as catalogLessons,
  lab3dShowcase,
} from '@/learning/catalog';
import { LAB3D_MODEL_IDS, isLab3DModel } from '@/learning/lab3d';
import { validateLesson, validateChallenge, type Lesson } from '@/learning/types';

registerAllSimulations();

const lessons: Lesson[] = [
  chemistryAcidsBasesLesson,
  mathematicsFractionsLesson,
  physicsProjectileLesson,
  biologyCO2O2Lesson,
];

const localizedLessons: Lesson[] = [
  mathematicsFractionsLessonVi,
  chemistryAcidsBasesLessonVi,
  physicsProjectileLessonVi,
  biologyCO2O2LessonVi,
];

describe('lesson content integrity', () => {
  it('every lesson passes the runtime validator', () => {
    for (const lesson of lessons) {
      const result = validateLesson(lesson);
      expect(result.ok, `${lesson.id}: ${result.ok ? '' : result.error}`).toBe(true);
    }
  });

  it('every localized lesson passes the runtime validator', () => {
    for (const lesson of localizedLessons) {
      const result = validateLesson(lesson);
      expect(result.ok, `${lesson.id} (vi): ${result.ok ? '' : result.error}`).toBe(true);
    }
  });

  it('lesson ids are unique across the catalog', () => {
    const ids = lessons.map((lesson) => lesson.id);
    expect(new Set(ids).size).toBe(ids.length);
    const viIds = localizedLessons.map((lesson) => lesson.id);
    expect([...viIds].sort()).toEqual([...ids].sort());
  });

  it('every simulation-typed application points at a registered simulation', () => {
    for (const lesson of [...lessons, ...localizedLessons]) {
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
});

describe('challenge content integrity', () => {
  it('challenge ids are unique across the catalog', () => {
    const ids = challenges.map((challenge) => challenge.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every challenge validates and links to registered simulations', () => {
    for (const challenge of challenges) {
      const result = validateChallenge(challenge);
      expect(result.ok, `${challenge.id}: ${result.ok ? '' : result.error}`).toBe(true);
      for (const id of challenge.linkedSimulationIds) {
        expect(globalRegistry.has(id), `${challenge.id} links unknown simulation "${id}"`).toBe(true);
      }
    }
  });

  it('every related lesson id resolves to a catalog lesson', () => {
    const lessonIds = new Set(catalogLessons.map((lesson) => lesson.id));
    for (const challenge of [...challenges, greenhouseCarbonChallengeVi]) {
      for (const id of challenge.relatedLessonIds) {
        expect(lessonIds.has(id), `${challenge.id} links unknown lesson "${id}"`).toBe(true);
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

describe('learning domain integrity', () => {
  it('every domain points at an existing lesson or challenge', () => {
    const lessonIds = new Set(catalogLessons.map((lesson) => lesson.id));
    const challengeIds = new Set(challenges.map((challenge) => challenge.id));

    for (const domain of learningDomains) {
      if ('lessonId' in domain) {
        expect(lessonIds.has(domain.lessonId), `${domain.key} links unknown lesson "${domain.lessonId}"`).toBe(true);
      } else {
        expect(
          challengeIds.has(domain.challengeId),
          `${domain.key} links unknown challenge "${domain.challengeId}"`,
        ).toBe(true);
      }
    }
  });

  it('every lab3d link uses a supported model id', () => {
    for (const domain of learningDomains) {
      if ('lab3dModel' in domain && domain.lab3dModel !== undefined) {
        expect(isLab3DModel(domain.lab3dModel), `${domain.key} uses unknown model "${domain.lab3dModel}"`).toBe(true);
      }
    }
    for (const showcase of lab3dShowcase) {
      expect((LAB3D_MODEL_IDS as readonly string[]).includes(showcase.model)).toBe(true);
    }
  });
});

