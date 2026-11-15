import type { Metadata } from 'next';

import HomeView from '@/components/home/HomeView';
import { SITE_DESCRIPTION, SITE_NAME } from '@/lib/site';

export const metadata: Metadata = {
  title: { absolute: `${SITE_NAME} — Interactive Science Lessons & Simulations` },
  description: SITE_DESCRIPTION,
};

export default function Home() {
  return <HomeView />;
}
