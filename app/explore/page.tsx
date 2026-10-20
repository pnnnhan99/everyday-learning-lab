import Link from 'next/link';
import { FlaskConical, GraduationCap } from 'lucide-react';

import { registerAllSimulations, globalRegistry } from '@/simulations';
import { chemistryAcidsBasesLesson } from '@/learning/examples/chemistry-acids-bases';
import { mathematicsFractionsLesson } from '@/learning/examples/mathematics-fractions';
import { physicsProjectileLesson } from '@/learning/examples/physics-projectile';
import { biologyCO2O2Lesson } from '@/learning/examples/biology-co2-o2';

registerAllSimulations();

interface DomainCard {
  key: string;
  label: string;
  desc: string;
  lessonSlug: string;
  lessonTitle: string;
}

const domains: DomainCard[] = [
  { key: 'chemistry', label: 'Chemistry', desc: 'Acids, bases and the CO₂ released when they meet a carbonate.', lessonSlug: chemistryAcidsBasesLesson.id, lessonTitle: chemistryAcidsBasesLesson.title },
  { key: 'mathematics', label: 'Mathematics', desc: 'Fractions fundamentals with a visual comparison tool.', lessonSlug: mathematicsFractionsLesson.id, lessonTitle: mathematicsFractionsLesson.title },
  { key: 'physics', label: 'Physics', desc: 'Projectile motion: range, height and flight time from live parameters.', lessonSlug: physicsProjectileLesson.id, lessonTitle: physicsProjectileLesson.title },
  { key: 'biology', label: 'Biology & Earth', desc: 'The CO₂–O₂ balance between photosynthesis and respiration.', lessonSlug: biologyCO2O2Lesson.id, lessonTitle: biologyCO2O2Lesson.title },
];

export default function ExplorePage() {
  const simulations = globalRegistry.list();

  return (
    <div className="flex-1 p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Explore</h1>
          <p className="text-zinc-600 dark:text-zinc-300">
            Pick a domain, work through its lesson, then run the linked simulation. Every model states its
            assumptions, valid ranges and references.
          </p>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {domains.map((domain) => (
            <article
              key={domain.key}
              className="flex flex-col rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:border-zinc-700"
            >
              <h2 className="text-lg font-semibold">{domain.label}</h2>
              <p className="mt-2 flex-1 text-sm text-zinc-600 dark:text-zinc-300">{domain.desc}</p>
              <p className="mt-3 text-xs text-zinc-500">Lesson: {domain.lessonTitle}</p>
              <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-zinc-100 pt-3 dark:border-zinc-800">
                <Link
                  href={`/learn/${domain.lessonSlug}`}
                  className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
                >
                  <GraduationCap size={14} aria-hidden /> Start lesson →
                </Link>
                <Link href="/challenges" className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
                  Challenges
                </Link>
              </div>
            </article>
          ))}
        </section>

        <section className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/40">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <FlaskConical size={18} aria-hidden /> Run a simulation directly
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {simulations.map((sim) => (
              <li key={sim.id}>
                <Link
                  href={`/lab/${sim.id}`}
                  className="inline-block rounded-lg border border-zinc-200 px-3 py-1.5 text-sm text-zinc-700 transition hover:border-blue-400 hover:text-blue-600 dark:border-zinc-700 dark:text-zinc-300 dark:hover:text-blue-400"
                >
                  {sim.metadata.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
