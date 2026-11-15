'use client';

import React, { useState } from 'react';
import Link from 'next/link';

import type { Challenge } from '../../learning/types';
import { getLocalizedChallenge, getLocalizedLesson } from '../../learning/catalog';
import { useDictionary, useLocale } from '@/i18n/useDictionary';
import { registerAllSimulations } from '../../simulations';
import { globalRegistry } from '../../core/simulation/registry';
import { validateSimulationInput } from '../../core/simulation/validation';
import { SimulationInputs } from '../simulation/SimulationInputs';
import { SimulationResult } from '../simulation/SimulationResult';

registerAllSimulations();

export const ChallengeDetail: React.FC<{ challenge: Challenge }> = ({ challenge: canonicalChallenge }) => {
  const dictionary = useDictionary();
  const locale = useLocale();
  const challenge = getLocalizedChallenge(canonicalChallenge.id, locale) ?? canonicalChallenge;
  const [results, setResults] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [inputs, setInputs] = useState<Record<string, Record<string, number>>>({});
  const [running, setRunning] = useState<Record<string, boolean>>({});

  const updateInput = (simulationId: string, key: string, value: number) => {
    setInputs((prev) => ({
      ...prev,
      [simulationId]: { ...(prev[simulationId] ?? {}), [key]: value },
    }));
  };

  const runSimulation = async (id: string) => {
    const simulation = globalRegistry.get(id);
    if (!simulation) {
      setErrors((prev) => ({ ...prev, [id]: dictionary.lesson.simulationNotFound }));
      return;
    }
    const input = inputs[id] ?? simulation.metadata.defaults ?? {};
    const validation = validateSimulationInput(input, simulation.metadata);
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
      setErrors((prev) => ({
        ...prev,
        [id]: err instanceof Error ? err.message : dictionary.lab.simulationFailed,
      }));
    } finally {
      setRunning((prev) => ({ ...prev, [id]: false }));
      setInputs((prev) => ({ ...prev, [id]: prev[id] ?? input }));
    }
  };

  return (
    <div className="space-y-10 text-white">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-wide text-white/40">
          {dictionary.domains[challenge.domain]} · {dictionary.difficulty[challenge.difficulty]}
        </p>
        <h1 className="text-3xl font-bold tracking-tight">{challenge.title}</h1>
        <p className="text-sm text-white/60">{challenge.description}</p>
      </header>

      <section className="rounded-xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-lg font-semibold text-white/90">{dictionary.challenge.realWorldQuestion}</h2>
        <p className="mt-2 text-sm text-white/70">{challenge.realWorldQuestion}</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-base font-semibold text-white/90">{dictionary.challenge.requiredConcepts}</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-white/70">
            {challenge.requiredConcepts.map((concept) => <li key={concept}>{concept}</li>)}
          </ul>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-base font-semibold text-white/90">{dictionary.challenge.stepsHeading}</h2>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-white/70">
            {challenge.steps.map((step) => <li key={step}>{step}</li>)}
          </ol>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-base font-semibold text-white/90">{dictionary.challenge.evidenceHeading}</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-white/70">
            {challenge.evidence.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-base font-semibold text-white/90">{dictionary.challenge.constraints}</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-white/70">
            {challenge.constraints.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white/90">{dictionary.challenge.tryModels}</h2>
        <p className="text-sm text-white/50">{dictionary.challenge.tryModelsIntro}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {challenge.linkedSimulationIds.map((id) => {
            const metadata = globalRegistry.get(id)?.metadata;
            return (
              <div key={id} className="rounded-lg border border-white/10 bg-black/20 p-4">
                <h3 className="text-base font-medium text-white">{metadata?.name ?? id}</h3>
                <p className="mt-1 text-xs text-white/50">{metadata?.description ?? dictionary.lesson.simulationNotFound}</p>
                {metadata && (
                  <div className="mt-3 space-y-3">
                    <SimulationInputs
                      tone="dark"
                      metadata={metadata}
                      values={inputs[id] ?? metadata.defaults ?? {}}
                      onChange={(key, value) => updateInput(id, key, value)}
                    />
                    <button
                      type="button"
                      onClick={() => runSimulation(id)}
                      disabled={running[id]}
                      className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-500 disabled:cursor-wait disabled:opacity-60"
                    >
                      {running[id] ? dictionary.challenge.running : dictionary.challenge.run}
                    </button>
                    {errors[id] && <p role="alert" className="text-sm text-red-400">{errors[id]}</p>}
                    {results[id] !== undefined && (
                      <SimulationResult result={results[id]} metadata={metadata} tone="dark" />
                    )}
                  </div>
                )}
                {metadata && (
                  <details className="mt-3 text-xs text-white/50">
                    <summary className="cursor-pointer">{dictionary.challenge.assumptionsLimitations}</summary>
                    <ul className="mt-1 list-disc pl-4">
                      {metadata.assumptions.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                    <ul className="mt-1 list-disc pl-4">
                      {metadata.limitations.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </details>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-lg font-semibold text-white/90">{dictionary.challenge.evaluationHeading}</h2>
        <p className="mt-2 text-sm text-white/70">{challenge.evaluation}</p>
      </section>

      {challenge.relatedLessonIds.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-base font-semibold text-white/80">{dictionary.challenge.relatedLessons}</h2>
          <ul className="flex flex-wrap gap-2">
            {challenge.relatedLessonIds.map((slug) => {
              const title = getLocalizedLesson(slug, locale)?.title ?? slug;
              return (
                <li key={slug}>
                  <Link href={`/learn/${slug}`} className="rounded-full border border-white/15 px-3 py-1 text-sm text-blue-400 hover:border-white/30">
                    {title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
};
