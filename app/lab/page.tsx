'use client';

import Link from 'next/link';
import { Boxes, FlaskConical } from 'lucide-react';

import { globalRegistry, registerAllSimulations } from '@/simulations';
import { useDictionary } from '@/i18n/useDictionary';

registerAllSimulations();

export default function LabIndexPage() {
  const dictionary = useDictionary();
  const meta = globalRegistry.list().map((simulation) => simulation.metadata);

  return (
    <div className="flex-1 p-6">
      <div className="mx-auto max-w-5xl space-y-4">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold">{dictionary.lab.title}</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">{dictionary.lab.intro}</p>
        </header>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {meta.map((metadata) => (
            <li key={metadata.id} className="flex flex-col rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-base font-medium">{metadata.name}</h2>
                <span className="shrink-0 rounded-full border border-zinc-200 px-2 py-0.5 text-[10px] font-semibold text-zinc-500 uppercase dark:border-zinc-700">
                  {metadata.domain}
                </span>
              </div>
              <p className="mt-1 font-mono text-[11px] text-zinc-400">{metadata.id}</p>
              <p className="mt-2 flex-1 text-sm text-zinc-600 line-clamp-3 dark:text-zinc-300">{metadata.description}</p>
              <div className="mt-3 flex items-center justify-between border-t border-zinc-100 pt-3 dark:border-zinc-800">
                <Link
                  href={`/lab/${metadata.id}`}
                  className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
                >
                  <FlaskConical size={14} aria-hidden /> {dictionary.lab.run} →
                </Link>
                <span className="text-xs text-zinc-400">
                  {Object.keys(metadata.validInputRanges ?? {}).length} {dictionary.lab.inputs}
                </span>
              </div>
            </li>
          ))}
        </ul>
        <p className="text-sm text-zinc-500">
          {dictionary.lab.alsoAvailable}{' '}
          <Link
            href="/lab/3d"
            className="inline-flex items-center gap-1 font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            <Boxes size={14} aria-hidden /> {dictionary.lab.threeDPlayground}
          </Link>
        </p>
      </div>
    </div>
  );
}
