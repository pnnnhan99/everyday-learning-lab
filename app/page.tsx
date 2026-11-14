import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Boxes, Compass, FlaskConical, ShieldCheck } from 'lucide-react';

import DomainCard from '@/components/learning/DomainCard';
import {
  getDomainChallenge,
  learningDomains,
  learningLoop,
  lab3dShowcase,
  type ChallengeDomain,
} from '@/learning/catalog';
import { lab3dHref } from '@/learning/lab3d';

export const metadata: Metadata = {
  title: 'Everyday Learning Lab — Interactive Science Lessons & Simulations',
  description:
    'Discover a question, learn the concept, experiment with a model, apply it to everyday life, and reflect on what you found.',
};

export default function Home() {
  const challengeDomain = learningDomains.find((domain): domain is ChallengeDomain => domain.key === 'realworld');
  const featuredChallenge = getDomainChallenge(challengeDomain ?? learningDomains[0]);

  return (
    <div className="flex-1 p-6">
      <div className="mx-auto max-w-6xl space-y-10">
        <section className="grid gap-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8 lg:grid-cols-[1.4fr_1fr] dark:border-zinc-800 dark:bg-zinc-900/40">
          <div className="space-y-4">
            <p className="text-xs font-semibold tracking-[0.24em] text-blue-600 uppercase dark:text-blue-400">
              Everyday Learning Lab
            </p>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Understand the science behind everyday life
            </h1>
            <p className="max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-300">
              Work through short lessons, change the variables in a model, and connect each idea to a real
              situation. Every journey follows the same loop, and every model states its assumptions and limits.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href="/explore"
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                <Compass size={16} aria-hidden /> Explore learning journeys
              </Link>
              <Link
                href="/lab/chemistry"
                className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-blue-400 hover:text-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-zinc-700 dark:text-zinc-300 dark:hover:text-blue-400"
              >
                <FlaskConical size={16} aria-hidden /> Open chemistry lab
              </Link>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-950/50">
            <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">The learning loop</h2>
            <ol className="mt-3 space-y-2.5">
              {learningLoop.map((step, index) => (
                <li key={step.key} className="flex gap-3">
                  <span
                    aria-hidden
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white"
                  >
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{step.label}</p>
                    <p className="text-xs leading-5 text-zinc-500 dark:text-zinc-400">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section aria-labelledby="domains-heading" className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 id="domains-heading" className="text-2xl font-semibold tracking-tight">
                Five places to start
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-300">
                One complete lesson-to-reflection journey in each core domain, plus an interdisciplinary challenge.
              </p>
            </div>
            <Link
              href="/explore"
              className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              Browse all content
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {learningDomains.map((domain) => (
              <DomainCard key={domain.key} domain={domain} />
            ))}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/40">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <Boxes size={18} aria-hidden /> See it in three dimensions
            </h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
              Rotate and zoom illustrative or quantitative models. Each scene labels what is drawn and what is
              simplified.
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {lab3dShowcase.map((item) => (
                <li key={item.model}>
                  <Link
                    href={lab3dHref(item.model)}
                    className="inline-flex rounded-lg border border-zinc-200 px-3 py-1.5 text-sm text-zinc-700 transition hover:border-blue-400 hover:text-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-zinc-700 dark:text-zinc-300 dark:hover:text-blue-400"
                  >
                    <span className="mr-1.5 text-xs text-zinc-400">{item.domain}</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/lab/3d"
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              Open the 3D lab <ArrowRight size={14} aria-hidden />
            </Link>
          </div>

          <div className="flex flex-col rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/40">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <ShieldCheck size={18} aria-hidden /> Checked, not just animated
            </h2>
            <p className="mt-1 flex-1 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
              Lessons and models disclose their review status, assumptions, units, valid ranges, and references.
              Content marked as draft is still being reviewed and is not presented as authoritative.
            </p>
            {featuredChallenge && (
              <div className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-950/50">
                <p className="text-xs font-semibold tracking-wide text-zinc-500 uppercase">Featured challenge</p>
                <p className="mt-1 text-sm font-medium">{featuredChallenge.title}</p>
                <Link
                  href={`/challenges/${featuredChallenge.id}`}
                  className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
                >
                  Try it <ArrowRight size={14} aria-hidden />
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
