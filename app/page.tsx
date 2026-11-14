import type { Metadata } from 'next';

import HomeView from '@/components/home/HomeView';

export const metadata: Metadata = {
  title: 'Everyday Learning Lab — Interactive Science Lessons & Simulations',
  description:
    'Discover a question, learn the concept, experiment with a model, apply it to everyday life, and reflect on what you found.',
};

export default function Home() {
  return <HomeView />;
}
