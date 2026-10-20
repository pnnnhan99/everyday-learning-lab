import { notFound } from 'next/navigation';

import { ChallengeDetail } from '@/components/challenge-detail/ChallengeDetail';
import { greenhouseCarbonChallenge } from '@/learning/examples/challenge-greenhouse-carbon';
import type { Challenge } from '@/learning/types';

const challengesById: Record<string, Challenge> = {
  [greenhouseCarbonChallenge.id]: greenhouseCarbonChallenge,
};

export default async function ChallengePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const challenge = challengesById[id];

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
