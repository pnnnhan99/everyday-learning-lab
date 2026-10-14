import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://everyday-science-sim.local';
  return ['/', '/elements', '/reactions', '/admin', '/profile'].map((path) => ({ url: `${base}${path}`, lastModified: new Date() }));
}
