'use client';

import { useState } from 'react';
import { registerAllSimulations, globalRegistry } from '@/simulations';
import type { SimulationContract } from '@/core/simulation/types';
import { validateSimulationInput } from '@/core/simulation/validation';

registerAllSimulations();

export default function LabSimulationPage({ params }: { params: { simulationId: string } }) {
  const { simulationId } = params;
  const sim = globalRegistry.get(simulationId);
  const [result, setResult] = useState<unknown>(undefined);
  const [error, setError] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [inputs, setInputs] = useState<Record<string, number>>(() => sim?.metadata.defaults ?? {});

  async function run() {
    if (!sim) { setError('Simulation not found'); return; }
    const validation = validateSimulationInput(inputs, sim.metadata);
    if (!validation.ok) {
      setValidationErrors(validation.errors);
      setResult(undefined);
      setError('');
      return;
    }
    setValidationErrors([]);
    const c: SimulationContract<unknown, unknown> = sim.create();
    await c.initialize();
    try {
      const r = c.run(validation.values);
      setResult(r);
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error');
    }
  }

  if (!sim) {
    return (
      <div className="flex-1 p-6 text-white">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-2xl font-semibold">Simulation not found</h1>
          <p className="mt-2 text-white/70">{simulationId}</p>
        </div>
      </div>
    );
  }

  const ranges = sim.metadata.validInputRanges ?? {};
  return (
    <div className="flex-1 p-6 text-white">
      <div className="mx-auto max-w-4xl space-y-4">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold">{sim.metadata.name}</h1>
          <p className="text-sm text-white/60">{sim.metadata.description}</p>
        </header>

        <div className="grid gap-3 sm:grid-cols-3">
          {Object.keys(ranges).map((key) => (
            <label key={key} className="flex flex-col text-xs text-white/60">
              <span>{key} ({sim.metadata.units?.[key] ?? '—'})</span>
              <input
                type="number"
                className="mt-1 rounded border border-white/15 bg-black/30 px-2 py-1 text-sm text-white"
                min={ranges[key].min}
                max={ranges[key].max}
                step="any"
                value={inputs[key] ?? ''}
                onChange={(e) => setInputs((p) => ({ ...p, [key]: Number(e.target.value) }))}
              />
            </label>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button onClick={run} className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-500">Run</button>
          {error && <span role="alert" className="text-sm text-red-400">{error}</span>}
        </div>

        {validationErrors.length > 0 && (
          <div role="alert" className="rounded-lg border border-red-400/40 bg-red-400/10 p-3 text-sm text-red-200">
            <p className="font-medium">Fix the inputs before running:</p>
            <ul className="mt-1 list-disc pl-5">
              {validationErrors.map((message) => (
                <li key={message}>{message}</li>
              ))}
            </ul>
          </div>
        )}

        {result !== undefined && (
          <div className="rounded-lg bg-white/5 p-3">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-white/50">Result</h2>
            <pre className="mt-1 overflow-auto text-xs text-white/80">{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}

        <details className="rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-white/70">
          <summary className="cursor-pointer text-white/80">Metadata</summary>
          <div className="mt-2 space-y-2">
            <div><strong>Assumptions:</strong> <ul className="list-disc pl-5">{sim.metadata.assumptions.map((a)=> <li key={a}>{a}</li>)}</ul></div>
            <div><strong>Limitations:</strong> <ul className="list-disc pl-5">{sim.metadata.limitations.map((a)=> <li key={a}>{a}</li>)}</ul></div>
            <div><strong>References:</strong> <ul className="list-disc pl-5">{sim.metadata.references.map((r)=> <li key={r.url}><a className="text-blue-400" href={r.url}>{r.title}</a></li>)}</ul></div>
          </div>
        </details>
      </div>
    </div>
  );
}
