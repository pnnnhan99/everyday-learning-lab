import { listElements } from '@/lib/db';

import ProfileView from '@/components/profile/ProfileView';

export default async function ProfilePage() {
  const elements = await listElements();
  return <ProfileView elements={elements} />;
}
