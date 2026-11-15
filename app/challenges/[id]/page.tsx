import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ChallengeDetail } from '@/components/challenge-detail/ChallengeDetail';
import { getChallengeById, getLocalizedChallenge } from '@/learning/catalog';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const challenge = getLocalizedChallenge(id, 'vi');
  if (!challenge) return { title: 'Challenge not found' };
  return {
    title: challenge.title,
    description: challenge.description,
    alternates: { canonical: `/challenges/${id}` },
  };
}

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
