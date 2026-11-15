import type { Metadata } from 'next';

import ExploreView from '@/components/explore/ExploreView';

export const metadata: Metadata = {
  title: 'Explore learning journeys',
  description: 'Browse lessons, simulations, and interdisciplinary challenges across five learning domains.',
};

export default function ExplorePage() {
  return <ExploreView />;
}
