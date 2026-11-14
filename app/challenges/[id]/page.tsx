import { notFound } from 'next/navigation';

import { ChallengeDetail } from '@/components/challenge-detail/ChallengeDetail';
import { getChallengeById } from '@/learning/catalog';

export default async function ChallengePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const challenge = getChallengeById(id);

  if (!challenge) {
    notFound();
  }

  return (
    <div className="flex-1 p-6">
      <div className="mx-auto max-w-6xl">
        <ChallengeDetail challenge={challenge} />
      </div>
    </div>
  );
}
