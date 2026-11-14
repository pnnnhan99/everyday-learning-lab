import type { Challenge, Lesson } from './types';
import type { Lab3DModel } from './lab3d';
import type { Locale } from '@/i18n/dict';

import { biologyCO2O2Lesson } from './examples/biology-co2-o2';
import { chemistryAcidsBasesLesson } from './examples/chemistry-acids-bases';
import { mathematicsFractionsLesson } from './examples/mathematics-fractions';
import { physicsProjectileLesson } from './examples/physics-projectile';
import { greenhouseCarbonChallenge } from './examples/challenge-greenhouse-carbon';
import {
  biologyCO2O2LessonVi,
  chemistryAcidsBasesLessonVi,
  greenhouseCarbonChallengeVi,
  mathematicsFractionsLessonVi,
  physicsProjectileLessonVi,
} from './examples/vi';

// Single source of truth for discoverable learning content. Routes, the home
// page, Explore, and the sitemap all read from here instead of keeping their
// own lists of lessons and links.

export const lessons: readonly Lesson[] = [
  mathematicsFractionsLesson,
  chemistryAcidsBasesLesson,
  physicsProjectileLesson,
  biologyCO2O2Lesson,
];

export const challenges: readonly Challenge[] = [greenhouseCarbonChallenge];

const lessonsById = new Map<string, Lesson>(lessons.map((lesson) => [lesson.id, lesson]));
const challengesById = new Map<string, Challenge>(challenges.map((challenge) => [challenge.id, challenge]));

const localizedLessons: Record<Locale, ReadonlyMap<string, Lesson>> = {
  en: lessonsById,
  vi: new Map<string, Lesson>(
    [mathematicsFractionsLessonVi, chemistryAcidsBasesLessonVi, physicsProjectileLessonVi, biologyCO2O2LessonVi].map(
      (lesson) => [lesson.id, lesson],
    ),
  ),
};

const localizedChallenges: Record<Locale, ReadonlyMap<string, Challenge>> = {
  en: challengesById,
  vi: new Map<string, Challenge>([[greenhouseCarbonChallengeVi.id, greenhouseCarbonChallengeVi]]),
};

export function getLessonById(id: string | undefined): Lesson | undefined {
  return id ? lessonsById.get(id) : undefined;
}

export function getChallengeById(id: string | undefined): Challenge | undefined {
  return id ? challengesById.get(id) : undefined;
}

export function getLocalizedLesson(id: string | undefined, locale: Locale): Lesson | undefined {
  if (!id) return undefined;
  return localizedLessons[locale]?.get(id) ?? lessonsById.get(id);
}

export function getLocalizedChallenge(id: string | undefined, locale: Locale): Challenge | undefined {
  if (!id) return undefined;
  return localizedChallenges[locale]?.get(id) ?? challengesById.get(id);
}

export function getLessonHref(id: string): string {
  return `/learn/${id}`;
}

export function getChallengeHref(id: string): string {
  return `/challenges/${id}`;
}

interface LearningDomainBase {
  key: Lesson['domain'];
  label: string;
}

export interface LessonDomain extends LearningDomainBase {
  lessonId: string;
  lab3dModel?: Lab3DModel;
}

export interface ChallengeDomain extends LearningDomainBase {
  key: 'realworld';
  challengeId: string;
}

export type LearningDomain = LessonDomain | ChallengeDomain;

export const learningDomains: readonly LearningDomain[] = [
  {
    key: 'mathematics',
    label: 'Mathematics & Geometry',
    lessonId: mathematicsFractionsLesson.id,
  },
  {
    key: 'chemistry',
    label: 'Chemistry',
    lessonId: chemistryAcidsBasesLesson.id,
    lab3dModel: 'water',
  },
  {
    key: 'physics',
    label: 'Physics',
    lessonId: physicsProjectileLesson.id,
    lab3dModel: 'projectile',
  },
  {
    key: 'biology',
    label: 'Biology & Earth',
    lessonId: biologyCO2O2Lesson.id,
    lab3dModel: 'plant-cell',
  },
  {
    key: 'realworld',
    label: 'Real-world Challenges',
    challengeId: greenhouseCarbonChallenge.id,
  },
];

export function getDomainLesson(domain: LearningDomain): Lesson | undefined {
  return 'lessonId' in domain ? getLessonById(domain.lessonId) : undefined;
}

export function getDomainChallenge(domain: LearningDomain): Challenge | undefined {
  return 'challengeId' in domain ? getChallengeById(domain.challengeId) : undefined;
}

export function getDomainHref(domain: LearningDomain): string {
  return 'challengeId' in domain ? getChallengeHref(domain.challengeId) : getLessonHref(domain.lessonId);
}

export function getLab3dModelForLesson(lessonId: string): Lab3DModel | undefined {
  return learningDomains.find(
    (domain): domain is LessonDomain => 'lessonId' in domain && domain.lessonId === lessonId,
  )?.lab3dModel;
}

export const lab3dShowcase: readonly {
  model: Lab3DModel;
  domain: 'chemistry' | 'physics' | 'biology';
}[] = [
  { model: 'water', domain: 'chemistry' },
  { model: 'projectile', domain: 'physics' },
  { model: 'plant-cell', domain: 'biology' },
];

