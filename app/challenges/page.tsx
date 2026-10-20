import Link from 'next/link';
import { FlaskConical, GraduationCap, ListChecks, Rocket } from 'lucide-react';

import { greenhouseCarbonChallenge } from '@/learning/examples/challenge-greenhouse-carbon';
import type { Challenge } from '@/learning/types';

const challenges: Challenge[] = [greenhouseCarbonChallenge];

const DIFFICULTY_STYLES: Record<Challenge['difficulty'], string> = {
  beginner:
    'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300',
  intermediate:
    'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300',
  advanced: 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-300',
};

export default function ChallengesPage() {
  return (
    <div className="flex-1 p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Real-world Challenges</h1>
          <p className="text-zinc-600 dark:text-zinc-300">
            Interdisciplinary tasks that combine concepts from more than one domain. Each challenge states the
            question, the steps, the evidence you must collect and how your answer is evaluated.
          </p>
        </header>

        <section className="grid gap-4 sm:grid-cols-2">
          {challenges.map((challenge) => (
            <article
              key={challenge.id}
              className="flex flex-col rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/40"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-zinc-200 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-zinc-500 uppercase dark:border-zinc-700">
                  {challenge.domain}
                </span>
                <span
                  className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${DIFFICULTY_STYLES[challenge.difficulty]}`}
                >
                  {challenge.difficulty}
                </span>
              </div>

              <h2 className="mt-2 text-lg font-semibold">{challenge.title}</h2>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{challenge.description}</p>

              <p className="mt-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-300">
                <strong className="text-zinc-900 dark:text-zinc-100">Question: </strong>
                {challenge.realWorldQuestion}
              </p>

              <dl className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500">
                <span className="flex items-center gap-1">
                  <ListChecks size={13} aria-hidden /> {challenge.steps.length} steps
                </span>
                <span className="flex items-center gap-1">
                  <Rocket size={13} aria-hidden /> {challenge.evidence.length} evidence items
                </span>
                <span className="flex items-center gap-1">
                  <GraduationCap size={13} aria-hidden /> {challenge.prerequisites.length} prerequisites
                </span>
              </dl>

              <div className="mt-3 flex flex-wrap gap-2">
                {challenge.linkedSimulationIds.map((simId) => (
                  <Link
                    key={simId}
                    href={`/lab/${simId}`}
                    className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 px-2 py-1 text-xs text-zinc-600 hover:border-blue-400 hover:text-blue-600 dark:border-zinc-700 dark:text-zinc-300 dark:hover:text-blue-400"
                  >
                    <FlaskConical size={12} aria-hidden /> {simId}
                  </Link>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-zinc-100 pt-3 dark:border-zinc-800">
                <Link
                  href={`/challenges/${challenge.id}`}
                  className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
                >
                  Open challenge →
                </Link>
                {challenge.relatedLessonIds.map((lessonId) => (
                  <Link
                    key={lessonId}
                    href={`/learn/${lessonId}`}
                    className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                  >
                    Lesson: {lessonId}
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
