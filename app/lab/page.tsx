'use client';

import Link from 'next/link';
import { Boxes, FlaskConical } from 'lucide-react';

import { globalRegistry, registerAllSimulations } from '@/simulations';

registerAllSimulations();

export default function LabIndexPage() {
  const meta = globalRegistry.list().map((s) => s.metadata);

  return (
    <div className="flex-1 p-6">
      <div className="mx-auto max-w-5xl space-y-4">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold">Simulations</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            Every runner shows its assumptions, valid ranges, units, limitations and references before you use it.
          </p>
        </header>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {meta.map((m) => (
            <li key={m.id} className="flex flex-col rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-base font-medium">{m.name}</h2>
                <span className="shrink-0 rounded-full border border-zinc-200 px-2 py-0.5 text-[10px] font-semibold text-zinc-500 uppercase dark:border-zinc-700">
                  {m.domain}
                </span>
              </div>
              <p className="mt-1 font-mono text-[11px] text-zinc-400">{m.id}</p>
              <p className="mt-2 flex-1 text-sm text-zinc-600 line-clamp-3 dark:text-zinc-300">{m.description}</p>
              <div className="mt-3 flex items-center justify-between border-t border-zinc-100 pt-3 dark:border-zinc-800">
                <Link
                  href={`/lab/${m.id}`}
                  className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
                >
                  <FlaskConical size={14} aria-hidden /> Run →
                </Link>
                <span className="text-xs text-zinc-400">
                  {Object.keys(m.validInputRanges ?? {}).length} inputs
                </span>
              </div>
            </li>
          ))}
        </ul>
        <p className="text-sm text-zinc-500">
          Also available:{' '}
          <Link
            href="/lab/3d"
            className="inline-flex items-center gap-1 font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            <Boxes size={14} aria-hidden /> 3D playground
          </Link>
        </p>
      </div>
    </div>
  );
}
