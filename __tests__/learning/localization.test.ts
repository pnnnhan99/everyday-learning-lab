import { describe, expect, it } from 'vitest';

import {
  biologyCO2O2LessonVi,
  chemistryAcidsBasesLessonVi,
  greenhouseCarbonChallengeVi,
  mathematicsFractionsLessonVi,
  physicsProjectileLessonVi,
} from '@/learning/examples/vi';
import { challenges, getLessonById, lessons } from '@/learning/catalog';
import { dictionary, getDictionary } from '@/i18n/dict';
import type { Locale } from '@/i18n/dict';
import type { Challenge, Lesson } from '@/learning/types';

const localizedLessons: Record<string, Lesson> = {
  'math-fractions-101': mathematicsFractionsLessonVi,
  'chem-acids-bases-101': chemistryAcidsBasesLessonVi,
  'phys-projectile-101': physicsProjectileLessonVi,
  'bio-co2-o2-101': biologyCO2O2LessonVi,
};

const localizedChallenges: Record<string, Challenge> = {
  'challenge-greenhouse-carbon': greenhouseCarbonChallengeVi,
};

function collectDictionaryStrings(value: unknown, path: string, out: Map<string, string>) {
  if (typeof value === 'string') {
    out.set(path, value);
    return out;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectDictionaryStrings(item, `${path}[${index}]`, out));
    return out;
  }
  if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      collectDictionaryStrings(child, path ? `${path}.${key}` : key, out);
    }
  }
  return out;
}

describe('UI dictionary', () => {
  it('ships a Vietnamese entry for every English key', () => {
    const en = collectDictionaryStrings(dictionary.en, '', new Map());
    const vi = collectDictionaryStrings(dictionary.vi, '', new Map());

    expect([...vi.keys()].sort()).toEqual([...en.keys()].sort());

    for (const [path, text] of vi) {
      expect(text.trim(), `empty Vietnamese string at ${path}`).not.toBe('');
    }
  });

  it('falls back to English for an unknown locale', () => {
    expect(getDictionary('en' as Locale)).toBe(dictionary.en);
  });
});

describe('localized learning content', () => {
  it('translates every authored lesson without changing its identity', () => {
    expect(Object.keys(localizedLessons).sort()).toEqual(lessons.map((lesson) => lesson.id).sort());

    for (const lesson of lessons) {
      const vi = localizedLessons[lesson.id];
      const enSections = getLessonById(lesson.id)?.sections ?? [];

      expect(vi.language).toBe('vi');
      expect(vi.id).toBe(lesson.id);
      expect(vi.domain).toBe(lesson.domain);
      expect(vi.difficulty).toBe(lesson.difficulty);
      expect(vi.reviewStatus).toBe(lesson.reviewStatus);
      expect(vi.sections.map((section) => section.id)).toEqual(enSections.map((section) => section.id));
      expect(vi.title.trim()).not.toBe('');
      expect(vi.description.trim()).not.toBe('');
    }
  });

  it('keeps section objectives, applications and assessments in sync', () => {
    for (const lesson of lessons) {
      const vi = localizedLessons[lesson.id];
      const enSections = getLessonById(lesson.id)?.sections ?? [];

      vi.sections.forEach((section, index) => {
        const en = enSections[index];
        expect(section.id).toBe(en.id);
        expect(section.objectives).toHaveLength(en.objectives.length);
        expect(section.applications.map((app) => [app.id, app.type, app.resourceId])).toEqual(
          en.applications.map((app) => [app.id, app.type, app.resourceId]),
        );
        expect(section.assessments.map((assessment) => [assessment.id, assessment.type, assessment.itemIds])).toEqual(
          en.assessments.map((assessment) => [assessment.id, assessment.type, assessment.itemIds]),
        );
      });
    }
  });

  it('translates quiz copy while preserving option ids and correct answers', () => {
    for (const lesson of lessons) {
      const vi = localizedLessons[lesson.id];
      const enSections = getLessonById(lesson.id)?.sections ?? [];

      vi.sections.forEach((section, sectionIndex) => {
        const enAssessments = enSections[sectionIndex].assessments;

        section.assessments.forEach((assessment, assessmentIndex) => {
          const enItems = enAssessments[assessmentIndex].items ?? [];
          (assessment.items ?? []).forEach((item, itemIndex) => {
            const enItem = enItems[itemIndex];
            expect(item.id).toBe(enItem.id);
            expect(item.correctOptionId).toBe(enItem.correctOptionId);
            expect(item.options.map((option) => option.id)).toEqual(enItem.options.map((option) => option.id));
            expect(item.prompt.trim()).not.toBe('');
          });
        });
      });
    }
  });

  it('translates the challenge and keeps its linked resources', () => {
    const en = challenges.find((challenge) => challenge.id === 'challenge-greenhouse-carbon');
    const vi = localizedChallenges['challenge-greenhouse-carbon'];

    expect(en).toBeDefined();
    expect(vi.language).toBe('vi');
    expect(vi.id).toBe(en!.id);
    expect(vi.domain).toBe(en!.domain);
    expect(vi.difficulty).toBe(en!.difficulty);
    expect(vi.linkedSimulationIds).toEqual(en!.linkedSimulationIds);
    expect(vi.relatedLessonIds).toEqual(en!.relatedLessonIds);
    expect(vi.steps).toHaveLength(en!.steps.length);
    expect(vi.evidence).toHaveLength(en!.evidence.length);
    expect(vi.requiredConcepts).toHaveLength(en!.requiredConcepts.length);
  });
});
