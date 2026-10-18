'use client';

import Link from 'next/link';
import { globalRegistry, registerAllSimulations } from '@/simulations';

registerAllSimulations();

export default function LabIndexPage() {
  const meta = globalRegistry.list().map((s) => s.metadata);

  return (
    <div className="flex-1 p-6 text-white">
      <div className="mx-auto max-w-5xl space-y-4">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold">Lab</h1>
          <p className="text-sm text-white/70">Pick a simulation to run.</p>
        </header>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {meta.map((m) => (
            <li key={m.id} className="rounded-lg border border-white/10 bg-white/5 p-4">
              <h2 className="text-base font-medium">{m.name}</h2>
              <p className="mt-1 text-xs text-white/50">{m.domain} · {m.id}</p>
              <p className="mt-2 text-sm text-white/60 line-clamp-2">{m.description}</p>
              <div className="mt-3 flex items-center justify-between">
                <Link href={`/lab/${m.id}`} className="text-sm text-blue-400 hover:text-blue-300">Run →</Link>
                <Link href="/lab/3d" className="text-xs text-white/40 hover:text-white/60">3D demo</Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
