import type { MetadataRoute } from 'next';

import { challenges, lessons, getChallengeHref, getLessonHref } from '@/learning/catalog';

const staticPaths = [
  '/',
  '/explore',
  '/elements',
  '/reactions',
  '/challenges',
  '/lab',
  '/lab/chemistry',
  '/lab/3d',
  '/chemistry/periodic-table',
  '/profile',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://everyday-science-sim.local';
  const lastModified = new Date();

  const dynamicPaths = [
    ...lessons.map((lesson) => getLessonHref(lesson.id)),
    ...challenges.map((challenge) => getChallengeHref(challenge.id)),
  ];

  return [...staticPaths, ...dynamicPaths].map((path) => ({
    url: `${base}${path}`,
    lastModified,
  }));
}
