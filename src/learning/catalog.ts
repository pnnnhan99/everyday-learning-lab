import type { Challenge, Lesson, ReviewStatus } from './types';
import type { Lab3DModel } from './lab3d';

import { biologyCO2O2Lesson } from './examples/biology-co2-o2';
import { chemistryAcidsBasesLesson } from './examples/chemistry-acids-bases';
import { mathematicsFractionsLesson } from './examples/mathematics-fractions';
import { physicsProjectileLesson } from './examples/physics-projectile';
import { greenhouseCarbonChallenge } from './examples/challenge-greenhouse-carbon';

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

export function getLessonById(id: string | undefined): Lesson | undefined {
  return id ? lessonsById.get(id) : undefined;
}

export function getChallengeById(id: string | undefined): Challenge | undefined {
  return id ? challengesById.get(id) : undefined;
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
  summary: string;
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
    summary: 'Build number sense with visual fraction models, comparison tools, and everyday measurement.',
    lessonId: mathematicsFractionsLesson.id,
  },
  {
    key: 'chemistry',
    label: 'Chemistry',
    summary: 'Meet acids, bases, and the gases they release, then inspect a water molecule in three dimensions.',
    lessonId: chemistryAcidsBasesLesson.id,
    lab3dModel: 'water',
  },
  {
    key: 'physics',
    label: 'Physics',
    summary: 'Change launch speed and angle to predict range, peak height, and flight time.',
    lessonId: physicsProjectileLesson.id,
    lab3dModel: 'projectile',
  },
  {
    key: 'biology',
    label: 'Biology & Earth',
    summary: 'Follow the balance between photosynthesis and respiration, with a labelled plant-cell model.',
    lessonId: biologyCO2O2Lesson.id,
    lab3dModel: 'plant-cell',
  },
  {
    key: 'realworld',
    label: 'Real-world Challenges',
    summary: 'Combine concepts from more than one domain to explain a question grounded in everyday life.',
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

export const learningLoop = [
  {
    key: 'discover',
    label: 'Discover',
    description: 'Start from a real-world question or puzzling phenomenon.',
  },
  {
    key: 'learn',
    label: 'Learn',
    description: 'Read a focused explanation with objectives, examples, and sources.',
  },
  {
    key: 'experiment',
    label: 'Experiment',
    description: 'Change one input at a time and compare the model with your prediction.',
  },
  {
    key: 'apply',
    label: 'Apply',
    description: 'Connect the idea to a practical situation you recognise.',
  },
  {
    key: 'reflect',
    label: 'Reflect',
    description: 'Check your understanding and note which assumptions matter most.',
  },
] as const;

export const lab3dShowcase: readonly {
  model: Lab3DModel;
  label: string;
  domain: string;
}[] = [
  { model: 'water', label: 'Water molecule', domain: 'Chemistry' },
  { model: 'projectile', label: 'Projectile motion', domain: 'Physics' },
  { model: 'plant-cell', label: 'Plant cell', domain: 'Biology' },
];

export const REVIEW_STATUS_LABELS: Record<ReviewStatus, string> = {
  draft: 'Not yet scientifically reviewed',
  'in-review': 'Scientific review in progress',
  'expert-reviewed': 'Expert reviewed',
};
