import Link from 'next/link';
import { FlaskConical } from 'lucide-react';

import DomainCard from '@/components/learning/DomainCard';
import { learningDomains } from '@/learning/catalog';
import { registerAllSimulations, globalRegistry } from '@/simulations';

registerAllSimulations();

export default function ExplorePage() {
  const simulations = globalRegistry.list();

  return (
    <div className="flex-1 p-6">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Explore</h1>
          <p className="max-w-3xl text-zinc-600 dark:text-zinc-300">
            Pick a domain, work through its lesson, then run the linked simulation. Every model states its
            assumptions, valid ranges and references.
          </p>
        </header>

        <section aria-labelledby="all-domains-heading" className="space-y-4">
          <h2 id="all-domains-heading" className="text-xl font-semibold">
            Learning domains
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {learningDomains.map((domain) => (
              <DomainCard key={domain.key} domain={domain} />
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/40">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <FlaskConical size={18} aria-hidden /> Run a simulation directly
          </h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
            Prefer to experiment first? Each runner shows its inputs, units, and limits before you use it.
          </p>
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
