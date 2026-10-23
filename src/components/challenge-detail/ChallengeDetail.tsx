'use client';

import React, { useState } from 'react';
import Link from 'next/link';

import type { Challenge } from '../../learning/types';
import { registerAllSimulations } from '../../simulations';
import { globalRegistry } from '../../core/simulation/registry';
import { validateSimulationInput } from '../../core/simulation/validation';

registerAllSimulations();

export const ChallengeDetail: React.FC<{ challenge: Challenge }> = ({ challenge }) => {
  const [results, setResults] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [running, setRunning] = useState<Record<string, boolean>>({});

  const runSimulation = async (id: string) => {
    const simulation = globalRegistry.get(id);
    if (!simulation) {
      setErrors((prev) => ({ ...prev, [id]: 'Simulation not found' }));
      return;
    }
    const validation = validateSimulationInput(simulation.metadata.defaults ?? {}, simulation.metadata);
    if (!validation.ok) {
      setErrors((prev) => ({ ...prev, [id]: validation.errors.join(' ') }));
      return;
    }
    setRunning((prev) => ({ ...prev, [id]: true }));
    try {
      const contract = simulation.create();
      await contract.initialize();
      const result = await contract.run(validation.values);
      setResults((prev) => ({ ...prev, [id]: result }));
      setErrors((prev) => ({ ...prev, [id]: '' }));
    } catch (err) {
      setErrors((prev) => ({ ...prev, [id]: err instanceof Error ? err.message : 'Unknown error' }));
    } finally {
      setRunning((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div className="space-y-10 text-white">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-wide text-white/40">{challenge.domain} · {challenge.difficulty}</p>
        <h1 className="text-3xl font-bold tracking-tight">{challenge.title}</h1>
        <p className="text-sm text-white/60">{challenge.description}</p>
      </header>

      <section className="rounded-xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-lg font-semibold text-white/90">Real-world question</h2>
        <p className="mt-2 text-sm text-white/70">{challenge.realWorldQuestion}</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-base font-semibold text-white/90">Required concepts</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-white/70">
            {challenge.requiredConcepts.map((c) => <li key={c}>{c}</li>)}
          </ul>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-base font-semibold text-white/90">Steps</h2>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-white/70">
            {challenge.steps.map((s) => <li key={s}>{s}</li>)}
          </ol>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-base font-semibold text-white/90">Evidence to collect</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-white/70">
            {challenge.evidence.map((e) => <li key={e}>{e}</li>)}
          </ul>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-base font-semibold text-white/90">Constraints</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-white/70">
            {challenge.constraints.map((c) => <li key={c}>{c}</li>)}
          </ul>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white/90">Try the models</h2>
        <p className="text-sm text-white/50">Run each linked simulation with its defaults to gather evidence.</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {challenge.linkedSimulationIds.map((id) => {
            const metadata = globalRegistry.get(id)?.metadata;
            return (
              <div key={id} className="rounded-lg border border-white/10 bg-black/20 p-4">
                <h3 className="text-base font-medium text-white">{metadata?.name ?? id}</h3>
                <p className="mt-1 text-xs text-white/50">{metadata?.description ?? 'Unknown simulation'}</p>
                <button
                  type="button"
                  onClick={() => runSimulation(id)}
                  disabled={running[id]}
                  className="mt-3 rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-500 disabled:cursor-wait disabled:opacity-60"
                >
                  {running[id] ? 'Running…' : 'Run'}
                </button>
                {errors[id] && <p role="alert" className="mt-2 text-sm text-red-400">{errors[id]}</p>}
                {results[id] !== undefined && (
                  <pre aria-live="polite" className="mt-2 max-h-48 overflow-auto rounded bg-white/5 p-2 text-xs text-white/80">
                    {JSON.stringify(results[id], null, 2)}
                  </pre>
                )}
                {metadata && (
                  <details className="mt-3 text-xs text-white/50">
                    <summary className="cursor-pointer">Assumptions &amp; limitations</summary>
                    <ul className="mt-1 list-disc pl-4">
                      {metadata.assumptions.map((a) => <li key={a}>{a}</li>)}
                    </ul>
                    <ul className="mt-1 list-disc pl-4">
                      {metadata.limitations.map((l) => <li key={l}>{l}</li>)}
                    </ul>
                  </details>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-lg font-semibold text-white/90">How it is evaluated</h2>
        <p className="mt-2 text-sm text-white/70">{challenge.evaluation}</p>
      </section>

      {challenge.relatedLessonIds.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-base font-semibold text-white/80">Related lessons</h2>
          <ul className="flex flex-wrap gap-2">
            {challenge.relatedLessonIds.map((slug) => (
              <li key={slug}>
                <Link href={`/learn/${slug}`} className="rounded-full border border-white/15 px-3 py-1 text-sm text-blue-400 hover:border-white/30">
                  {slug}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};
