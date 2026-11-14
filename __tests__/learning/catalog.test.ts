import { describe, expect, it } from 'vitest';

import {
  challenges,
  getChallengeById,
  getDomainChallenge,
  getDomainHref,
  getDomainLesson,
  getLab3dModelForLesson,
  getLessonById,
  learningDomains,
  learningLoop,
  lessons,
} from '@/learning/catalog';
import { isLab3DModel } from '@/learning/lab3d';
import { globalRegistry, registerAllSimulations } from '@/simulations';

registerAllSimulations();

describe('learning catalog', () => {
  it('exposes exactly five domains with unique keys', () => {
    const keys = learningDomains.map((domain) => domain.key);

    expect(keys).toEqual(['mathematics', 'chemistry', 'physics', 'biology', 'realworld']);
    expect(new Set(keys).size).toBe(5);
  });

  it('links every domain to content that can be resolved', () => {
    for (const domain of learningDomains) {
      const lesson = getDomainLesson(domain);
      const challenge = getDomainChallenge(domain);

      expect(Boolean(lesson) || Boolean(challenge)).toBe(true);
      expect(getDomainHref(domain)).toMatch(/^\/(learn|challenges)\/.+/);
    }
  });

  it('keeps the domain card aligned with the lesson domain', () => {
    for (const domain of learningDomains) {
      const lesson = getDomainLesson(domain);
      if (lesson) {
        expect(lesson.domain).toBe(domain.key);
      }
    }
  });

  it('resolves lessons and challenges by id', () => {
    for (const lesson of lessons) {
      expect(getLessonById(lesson.id)).toBe(lesson);
    }
    for (const challenge of challenges) {
      expect(getChallengeById(challenge.id)).toBe(challenge);
    }

    expect(getLessonById('missing-lesson')).toBeUndefined();
    expect(getLessonById(undefined)).toBeUndefined();
    expect(getChallengeById('missing-challenge')).toBeUndefined();
  });

  it('only references simulations that are registered', () => {
    const simulationIds = lessons.flatMap((lesson) =>
      lesson.sections
        .flatMap((section) => section.applications)
        .filter((application) => application.type === 'simulation')
        .map((application) => application.resourceId),
    );

    expect(simulationIds.length).toBeGreaterThan(0);
    for (const id of simulationIds) {
      expect(globalRegistry.has(id), `missing simulation ${id}`).toBe(true);
    }
  });

  it('describes the five-step learning loop in order', () => {
    expect(learningLoop.map((step) => step.key)).toEqual([
      'discover',
      'learn',
      'experiment',
      'apply',
      'reflect',
    ]);
  });

  it('maps lessons only to supported 3D model ids', () => {
    for (const lesson of lessons) {
      const model = getLab3dModelForLesson(lesson.id);
      if (model) {
        expect(isLab3DModel(model)).toBe(true);
      }
    }
    expect(getLab3dModelForLesson('math-fractions-101')).toBeUndefined();
  });
});
