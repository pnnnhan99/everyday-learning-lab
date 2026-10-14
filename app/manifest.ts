import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Everyday Science Sim',
    short_name: 'ScienceSim',
    description: 'Virtual chemistry lab with safe simulated reactions.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2563eb',
    icons: [{ src: '/next.svg', sizes: 'any', type: 'image/svg+xml' }],
  };
}
