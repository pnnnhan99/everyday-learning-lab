import type { MetadataRoute } from 'next';

import { challenges, lessons, getChallengeHref, getLessonHref } from '@/learning/catalog';
import { getSiteUrl } from '@/lib/site';
import { globalRegistry, registerAllSimulations } from '@/simulations';

const staticPaths = [
  '/',
  '/explore',
  '/elements',
  '/reactions',
  '/challenges',
  '/lab',
  '/lab/chemistry',
  '/lab/3d',
  '/profile',
];

export default function sitemap(): MetadataRoute.Sitemap {
  registerAllSimulations();
  const base = getSiteUrl();
  const lastModified = new Date();

  const dynamicPaths = [
    ...lessons.map((lesson) => getLessonHref(lesson.id)),
    ...challenges.map((challenge) => getChallengeHref(challenge.id)),
    ...globalRegistry.list().map((simulation) => `/lab/${simulation.id}`),
  ];

  return [...staticPaths, ...dynamicPaths].map((path) => ({
    url: `${base}${path}`,
    lastModified,
  }));
}
