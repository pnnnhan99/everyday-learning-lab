import Link from 'next/link';

import { greenhouseCarbonChallenge } from '@/learning/examples/challenge-greenhouse-carbon';

const challenges = [greenhouseCarbonChallenge];

export default function ChallengesPage() {
  return (
    <div className="flex-1 p-6 text-white">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Real-world Challenges</h1>
          <p className="text-white/70">Interdisciplinary tasks that combine concepts from more than one domain.</p>
        </header>
        <section className="grid gap-4 sm:grid-cols-2">
          {challenges.map((challenge) => (
            <div key={challenge.id} className="rounded-xl border border-white/10 bg-white/5 p-5">
              <h2 className="text-lg font-semibold">{challenge.title}</h2>
              <p className="mt-2 text-sm text-white/60">{challenge.description}</p>
              <Link href={`/challenges/${challenge.id}`} className="mt-4 inline-block text-sm text-blue-400 hover:text-blue-300">
                Open challenge →
              </Link>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
