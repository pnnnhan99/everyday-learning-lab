'use client';

import { use, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, RotateCcw } from 'lucide-react';

import { registerAllSimulations, globalRegistry } from '@/simulations';
import type { SimulationContract, SimulationMetadata } from '@/core/simulation/types';

registerAllSimulations();

interface ResultView {
  scalars: Array<{ key: string; value: number; unit?: string }>;
  lists: Array<{ key: string; length: number; preview: string }>;
  others: Array<{ key: string; value: string }>;
}

function humanize(key: string): string {
  return key
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]/g, ' ')
    .replace(/^\w/, (c) => c.toUpperCase());
}

function formatNumber(value: number): string {
  if (Number.isInteger(value)) return String(value);
  return Math.abs(value) >= 100 ? value.toFixed(1) : value.toPrecision(4).replace(/\.?0+$/, '');
}

function describeResult(result: unknown, metadata: SimulationMetadata): ResultView {
  const view: ResultView = { scalars: [], lists: [], others: [] };
  if (result === null || typeof result !== 'object') {
    return { scalars: [], lists: [], others: [{ key: 'Result', value: String(result) }] };
  }

  for (const [key, value] of Object.entries(result as Record<string, unknown>)) {
    const unit = metadata.units?.[key];
    if (typeof value === 'number' && Number.isFinite(value)) {
      view.scalars.push({ key, value, unit });
    } else if (Array.isArray(value)) {
      view.lists.push({
        key,
        length: value.length,
        preview: JSON.stringify(value.slice(0, 3)).slice(0, 160),
      });
    } else if (typeof value === 'object' && value !== null) {
      view.others.push({ key, value: JSON.stringify(value, null, 2) });
    } else {
      view.others.push({ key, value: String(value) });
    }
  }
  return view;
}

function inputKeys(metadata: SimulationMetadata): string[] {
  const keys = new Set<string>(Object.keys(metadata.validInputRanges ?? {}));
  for (const key of Object.keys(metadata.defaults ?? {})) keys.add(key);
  return Array.from(keys);
}

export default function LabSimulationPage({ params }: { params: Promise<{ simulationId: string }> }) {
  const { simulationId } = use(params);
  const sim = globalRegistry.get(simulationId);

  const [result, setResult] = useState<unknown>(undefined);
  const [error, setError] = useState<string>('');
  const [running, setRunning] = useState(false);
  const [inputs, setInputs] = useState<Record<string, number>>(() => sim?.metadata.defaults ?? {});

  const ranges = useMemo(() => sim?.metadata.validInputRanges ?? {}, [sim]);
  const keys = useMemo(() => (sim ? inputKeys(sim.metadata) : []), [sim]);

  if (!sim) {
    return (
      <div className="flex-1 p-6">
        <div className="mx-auto max-w-4xl space-y-3">
          <h1 className="text-2xl font-semibold">Simulation not found</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            No simulation is registered with id <code className="font-mono">{simulationId}</code>.
          </p>
          <Link href="/lab" className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400">
            <ArrowLeft size={14} /> Back to all simulations
          </Link>
        </div>
      </div>
    );
  }

  const metadata = sim.metadata;

  function validate(): string | null {
    for (const key of keys) {
      const range = ranges[key];
      if (!range) continue;
      const value = inputs[key];
      if (typeof value !== 'number' || Number.isNaN(value)) {
        return `${humanize(key)} must be a number.`;
      }
      if (value < range.min || value > range.max) {
        const unit = metadata.units?.[key] ?? '';
        return `${humanize(key)} must be between ${range.min} and ${range.max} ${unit}`.trim();
      }
    }
    return null;
  }

  async function run() {
    if (!sim) return;
    const problem = validate();
    if (problem) {
      setError(problem);
      return;
    }
    setRunning(true);
    try {
      const contract: SimulationContract<unknown, unknown> = sim.create();
      await contract.initialize();
      const value = await contract.run(inputs);
      setResult(value);
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Simulation failed to run.');
    } finally {
      setRunning(false);
    }
  }

  function reset() {
    setInputs(metadata.defaults ?? {});
    setResult(undefined);
    setError('');
  }

  const view = result !== undefined ? describeResult(result, metadata) : null;

  return (
    <div className="flex-1 p-6">
      <div className="mx-auto max-w-4xl space-y-5">
        <header className="space-y-2">
          <Link
            href="/lab"
            className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
          >
            <ArrowLeft size={13} /> All simulations
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
          <h2 className="text-[11px] font-medium tracking-widest text-zinc-500 uppercase">Inputs</h2>
          {keys.length === 0 ? (
            <p className="mt-2 text-sm text-zinc-500">This simulation takes no inputs.</p>
          ) : (
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {keys.map((key) => {
                const range = ranges[key];
                return (
                  <label key={key} className="flex flex-col text-xs text-zinc-600 dark:text-zinc-300">
                    <span>
                      {humanize(key)} {metadata.units?.[key] ? `(${metadata.units[key]})` : ''}
                    </span>
                    <input
                      type="number"
                      className="mt-1 rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
                      min={range?.min}
                      max={range?.max}
                      step="any"
                      value={inputs[key] ?? ''}
                      onChange={(e) => setInputs((prev) => ({ ...prev, [key]: Number(e.target.value) }))}
                    />
                    {range ? <span className="mt-1 text-[10px] text-zinc-400">{range.min} – {range.max}</span> : null}
                  </label>
                );
              })}
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={run}
              disabled={running}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-blue-500 disabled:opacity-60"
            >
              <Play size={14} /> {running ? 'Running…' : 'Run simulation'}
            </button>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
            >
              <RotateCcw size={14} /> Reset inputs
            </button>
            {error && <span className="text-sm text-red-600 dark:text-red-400">{error}</span>}
          </div>
        </section>

        {view ? (
          <section className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900/40" data-testid="sim-result">
            <h2 className="text-[11px] font-medium tracking-widest text-zinc-500 uppercase">Result</h2>
            {view.scalars.length > 0 && (
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {view.scalars.map((item) => (
                  <div key={item.key} className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-950/60">
                    <p className="text-[11px] text-zinc-500">{humanize(item.key)}</p>
                    <p className="mt-1 text-lg font-semibold">
                      {formatNumber(item.value)}
                      {item.unit ? <span className="ml-1 text-xs font-normal text-zinc-500">{item.unit}</span> : null}
                    </p>
                  </div>
                ))}
              </div>
            )}
            {view.lists.length > 0 && (
              <ul className="mt-3 space-y-2">
                {view.lists.map((item) => (
                  <li key={item.key} className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-sm dark:border-zinc-800 dark:bg-zinc-950/60">
                    <p className="text-zinc-600 dark:text-zinc-300">
                      {humanize(item.key)} · <span className="font-medium">{item.length} values</span>
                    </p>
                    <details className="mt-1">
                      <summary className="cursor-pointer text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300">
                        Preview
                      </summary>
                      <pre className="mt-1 overflow-auto text-[11px] text-zinc-500">{item.preview} …</pre>
                    </details>
                  </li>
                ))}
              </ul>
            )}
            {view.others.length > 0 && (
              <div className="mt-3 space-y-2">
                {view.others.map((item) => (
                  <div key={item.key} className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-sm dark:border-zinc-800 dark:bg-zinc-950/60">
                    <p className="text-zinc-600 dark:text-zinc-300">{humanize(item.key)}</p>
                    <pre className="mt-1 overflow-auto text-xs">{item.value}</pre>
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : null}

        {metadata.safetyNotes && metadata.safetyNotes.length > 0 && (
          <aside className="rounded-lg border border-amber-300/50 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
            <strong>Safety note:</strong> {metadata.safetyNotes.join(' ')}
          </aside>
        )}

        <details className="rounded-xl border border-zinc-200 bg-white p-3 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-300">
          <summary className="cursor-pointer font-medium text-zinc-800 dark:text-zinc-100">Model metadata</summary>
          <div className="mt-3 space-y-3">
            <div>
              <strong className="text-zinc-900 dark:text-zinc-100">Assumptions</strong>
              <ul className="mt-1 list-disc pl-5">
                {metadata.assumptions.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </div>
            <div>
              <strong className="text-zinc-900 dark:text-zinc-100">Limitations</strong>
              <ul className="mt-1 list-disc pl-5">
                {metadata.limitations.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </div>
            <div>
              <strong className="text-zinc-900 dark:text-zinc-100">References</strong>
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
