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
import { localizeElement, localizeReaction } from '@/i18n/catalog';
import { elements, reactions } from '@/data/mockReactions';
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

describe('localized catalog data', () => {
  it('ships a complete Vietnamese edition for every seeded element', () => {
    expect(elements.length).toBeGreaterThan(0);
    for (const element of elements) {
      expect(element.vi, `${element.id} is missing a Vietnamese edition`).toBeDefined();
      expect(element.vi!.name.trim()).not.toBe('');
      expect(element.vi!.description.trim()).not.toBe('');
    }
  });

  it('ships a complete Vietnamese edition for every seeded reaction', () => {
    expect(reactions.length).toBeGreaterThan(0);
    for (const reaction of reactions) {
      expect(reaction.vi, `${reaction.resultTitle} is missing a Vietnamese edition`).toBeDefined();
      expect(reaction.vi!.resultTitle.trim()).not.toBe('');
      expect(reaction.vi!.observation.trim()).not.toBe('');
      expect(reaction.vi!.explanation.trim()).not.toBe('');
      expect(reaction.vi!.safetyGuidance.trim()).not.toBe('');
      expect(reaction.vi!.assumptions).toHaveLength(reaction.assumptions.length);
      expect(reaction.vi!.assumptions.every((assumption) => assumption.trim() !== '')).toBe(true);
    }
  });

  it('resolves element text for the active locale and falls back to English', () => {
    const [element] = elements;

    expect(localizeElement(element, 'en')).toBe(element);
    expect(localizeElement(element, 'vi').name).toBe(element.vi!.name);
    expect(localizeElement(element, 'vi').description).toBe(element.vi!.description);

    const untranslated = { ...element, vi: undefined };
    expect(localizeElement(untranslated, 'vi').name).toBe(element.name);
  });

  it('resolves reaction text for the active locale and falls back to English', () => {
    const [reaction] = reactions;

    expect(localizeReaction(reaction, 'en')).toBe(reaction);
    const vi = localizeReaction(reaction, 'vi');
    expect(vi.resultTitle).toBe(reaction.vi!.resultTitle);
    expect(vi.observation).toBe(reaction.vi!.observation);
    expect(vi.explanation).toBe(reaction.vi!.explanation);
    expect(vi.safetyGuidance).toBe(reaction.vi!.safetyGuidance);
    expect(vi.assumptions).toEqual(reaction.vi!.assumptions);

    const untranslated = { ...reaction, vi: undefined };
    expect(localizeReaction(untranslated, 'vi').resultTitle).toBe(reaction.resultTitle);
  });
});
