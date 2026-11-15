'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, RotateCcw } from 'lucide-react';

import { registerAllSimulations, globalRegistry } from '@/simulations';
import { validateSimulationInput } from '@/core/simulation/validation';
import type { SimulationContract } from '@/core/simulation/types';
import { useDictionary } from '@/i18n/useDictionary';
import { type SavedValue } from '@/lib/simRuns';
import { describeResult } from '@/lib/simulationView';
import RunComparison from '@/components/lab/RunComparison';
import { SimulationInputs } from '@/components/simulation/SimulationInputs';
import { SimulationResult } from '@/components/simulation/SimulationResult';

registerAllSimulations();

export default function LabSimulationPage({ params }: { params: Promise<{ simulationId: string }> }) {
  const { simulationId } = use(params);
  const dictionary = useDictionary();
  const sim = globalRegistry.get(simulationId);

  const [result, setResult] = useState<unknown>(undefined);
  const [error, setError] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const [inputs, setInputs] = useState<Record<string, number>>(() => sim?.metadata.defaults ?? {});
  const [lastRunInputs, setLastRunInputs] = useState<SavedValue[] | null>(null);


  if (!sim) {
    return (
      <div className="flex-1 p-6">
        <div className="mx-auto max-w-4xl space-y-3">
          <h1 className="text-2xl font-semibold">{dictionary.lab.simulationNotFound}</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            {dictionary.lab.noSimulation} <code className="font-mono">{simulationId}</code>.
          </p>
          <Link href="/lab" className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400">
            <ArrowLeft size={14} /> {dictionary.lab.backToAll}
          </Link>
        </div>
      </div>
    );
  }

  const metadata = sim.metadata;

  async function run() {
    if (!sim) return;
    const validation = validateSimulationInput(inputs, metadata);
    if (!validation.ok) {
      setValidationErrors(validation.errors);
      setResult(undefined);
      setError('');
      return;
    }
    setValidationErrors([]);
    setRunning(true);
    try {
      const contract: SimulationContract<unknown, unknown> = sim.create();
      await contract.initialize();
      const value = await contract.run(validation.values);
      setResult(value);
      setLastRunInputs(
        Object.entries(validation.values).map(([key, inputValue]) => ({
          key,
          value: inputValue,
          ...(metadata.units?.[key] ? { unit: metadata.units[key] } : {}),
        })),
      );
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : dictionary.lab.simulationFailed);
    } finally {
      setRunning(false);
    }
  }

  function reset() {
    setInputs(metadata.defaults ?? {});
    setResult(undefined);
    setLastRunInputs(null);
    setError('');
    setValidationErrors([]);
  }

  return (
    <div className="flex-1 p-6">
      <div className="mx-auto max-w-4xl space-y-5">
        <header className="space-y-2">
          <Link
            href="/lab"
            className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
          >
            <ArrowLeft size={13} /> {dictionary.lab.allSimulations}
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold">{metadata.name}</h1>
            <span className="rounded-full border border-zinc-200 px-2 py-0.5 text-[11px] font-medium tracking-wide text-zinc-500 uppercase dark:border-zinc-700">
              {metadata.domain}
            </span>
          </div>
          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">{metadata.description}</p>
        </header>

        <section className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
          <h2 className="text-[11px] font-medium tracking-widest text-zinc-500 uppercase">{dictionary.lab.inputsHeading}</h2>
          <div className="mt-3">
            <SimulationInputs
              metadata={metadata}
              values={inputs}
              onChange={(key, value) => setInputs((prev) => ({ ...prev, [key]: value }))}
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={run}
              disabled={running}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-blue-500 disabled:opacity-60"
            >
              <Play size={14} /> {running ? dictionary.lab.running : dictionary.lab.runSimulation}
            </button>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
            >
              <RotateCcw size={14} /> {dictionary.lab.resetInputs}
            </button>
            {error && (
              <span role="alert" className="text-sm text-red-600 dark:text-red-400">
                {error}
              </span>
            )}
          </div>

          {validationErrors.length > 0 && (
            <div
              role="alert"
              className="mt-3 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/50 dark:text-red-200"
            >
              <p className="font-medium">{dictionary.lab.fixInputs}</p>
              <ul className="mt-1 list-disc pl-5">
                {validationErrors.map((message) => (
                  <li key={message}>{message}</li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {result !== undefined ? (
          <SimulationResult result={result} metadata={metadata} testId="sim-result" />
        ) : null}

        <RunComparison
          simulationId={simulationId}
          inputs={lastRunInputs}
          scalars={result !== undefined ? describeResult(result, metadata).scalars : null}
        />

        {metadata.safetyNotes && metadata.safetyNotes.length > 0 && (
          <aside className="rounded-lg border border-amber-300/50 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
            <strong>{dictionary.lab.safetyNote}</strong> {metadata.safetyNotes.join(' ')}
          </aside>
        )}

        <details className="rounded-xl border border-zinc-200 bg-white p-3 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-300">
          <summary className="cursor-pointer font-medium text-zinc-800 dark:text-zinc-100">{dictionary.lab.modelMetadata}</summary>
          <div className="mt-3 space-y-3">
            <div>
              <strong className="text-zinc-900 dark:text-zinc-100">{dictionary.lab.assumptions}</strong>
              <ul className="mt-1 list-disc pl-5">
                {metadata.assumptions.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </div>
            <div>
              <strong className="text-zinc-900 dark:text-zinc-100">{dictionary.lab.limitations}</strong>
              <ul className="mt-1 list-disc pl-5">
                {metadata.limitations.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </div>
            <div>
              <strong className="text-zinc-900 dark:text-zinc-100">{dictionary.lab.references}</strong>
              <ul className="mt-1 list-disc pl-5">
                {metadata.references.map((r) => (
                  <li key={r.url}>
                    <a
                      className="text-blue-600 hover:text-blue-500 dark:text-blue-400"
                      href={r.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {r.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </details>
      </div>
    </div>
  );
}
