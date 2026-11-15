import type { Metadata } from 'next';

import { listElements } from '@/lib/db';

import ProfileView from '@/components/profile/ProfileView';

export const metadata: Metadata = {
  title: 'Profile',
  description: 'Your local learning progress, favorites, and simulation history — stored only in this browser.',
};

export default async function ProfilePage() {
  const elements = await listElements();
  return <ProfileView elements={elements} />;
}
