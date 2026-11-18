'use client';

import Link from 'next/link';
import { FlaskConical, Grid3x3 } from 'lucide-react';

import DomainCard from '@/components/learning/DomainCard';
import { learningDomains } from '@/learning/catalog';
import { useDictionary } from '@/i18n/useDictionary';
import { registerAllSimulations, globalRegistry } from '@/simulations';

registerAllSimulations();

export default function ExploreView() {
  const dictionary = useDictionary();
  const simulations = globalRegistry.list();

  return (
    <div className="flex-1 p-6">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">{dictionary.explore.title}</h1>
          <p className="max-w-3xl text-zinc-600 dark:text-zinc-300">{dictionary.explore.intro}</p>
        </header>

        <section aria-labelledby="all-domains-heading" className="space-y-4">
          <h2 id="all-domains-heading" className="text-xl font-semibold">
            {dictionary.explore.domainsHeading}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {learningDomains.map((domain) => (
              <DomainCard key={domain.key} domain={domain} />
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800 dark:bg-zinc-900/40">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
              <Grid3x3 size={20} aria-hidden />
            </span>
            <div>
              <h2 className="text-lg font-semibold">{dictionary.pages.periodicTable.title}</h2>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                {dictionary.pages.periodicTable.subtitle}
              </p>
            </div>
          </div>
          <Link
            href="/chemistry/periodic-table"
            className="shrink-0 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            {dictionary.nav.periodicTable}
          </Link>
        </section>

        <section className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/40">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <FlaskConical size={18} aria-hidden /> {dictionary.explore.simulationsHeading}
          </h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">{dictionary.explore.simulationsIntro}</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {simulations.map((sim) => (
              <li key={sim.id}>
                <Link
                  href={`/lab/${sim.id}`}
                  className="inline-block rounded-lg border border-zinc-200 px-3 py-1.5 text-sm text-zinc-700 transition hover:border-blue-400 hover:text-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-zinc-700 dark:text-zinc-300 dark:hover:text-blue-400"
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
