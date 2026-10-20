import type { MetadataRoute } from 'next';

import { greenhouseCarbonChallenge } from '@/learning/examples/challenge-greenhouse-carbon';
import { chemistryAcidsBasesLesson } from '@/learning/examples/chemistry-acids-bases';
import { mathematicsFractionsLesson } from '@/learning/examples/mathematics-fractions';
import { physicsProjectileLesson } from '@/learning/examples/physics-projectile';
import { biologyCO2O2Lesson } from '@/learning/examples/biology-co2-o2';

const lessons = [
  chemistryAcidsBasesLesson,
  mathematicsFractionsLesson,
  physicsProjectileLesson,
  biologyCO2O2Lesson,
];

const staticPaths = ['/', '/explore', '/elements', '/reactions', '/challenges', '/lab', '/lab/3d', '/profile'];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://everyday-science-sim.local';
  const lastModified = new Date();

  const dynamicPaths = [
    ...lessons.map((lesson) => `/learn/${lesson.id}`),
    `/challenges/${greenhouseCarbonChallenge.id}`,
  ];

  return [...staticPaths, ...dynamicPaths].map((path) => ({
    url: `${base}${path}`,
    lastModified,
  }));
}
