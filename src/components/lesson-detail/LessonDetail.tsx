'use client';

import React, { useMemo, useState } from 'react';

import type { Lesson } from '@/learning/types';
import { registerAllSimulations } from '@/simulations';
import { globalRegistry } from '@/core/simulation/registry';

registerAllSimulations();

export const LessonDetail: React.FC<{ lesson: Lesson }> = ({ lesson }) => {
  const [results, setResults] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [inputs, setInputs] = useState<Record<string, Record<string, number>>>({});

  const handleRunSimulation = async (simulationId: string) => {
    const simulation = globalRegistry.get(simulationId);
    if (!simulation) {
      setErrors((prev) => ({ ...prev, [simulationId]: 'Simulation not found' }));
      return;
    }
    const contract = simulation.create();
    const input = inputs[simulationId] ?? simulation.metadata.defaults ?? {};
    try {
      await contract.initialize();
      const result = contract.run(input);
      setResults((prev) => ({ ...prev, [simulationId]: result }));
      setErrors((prev) => ({ ...prev, [simulationId]: '' }));
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        [simulationId]: err instanceof Error ? err.message : 'Unknown error',
      }));
    } finally {
      setInputs((prev) => ({
        ...prev,
        [simulationId]: prev[simulationId] ?? input,
      }));
    }
  };

  const updateInput = (simulationId: string, key: string, value: number) => {
    setInputs((prev) => ({
      ...prev,
      [simulationId]: { ...(prev[simulationId] ?? {}), [key]: value },
    }));
  };

  const lessonSimulations = useMemo(
    () =>
      lesson.sections
        .flatMap((section) => section.applications)
        .filter((app) => app.type === 'simulation'),
    [lesson],
  );

  return (
    <div className="space-y-10 text-white">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-wide text-white/40">{lesson.domain} · {lesson.difficulty}</p>
        <h1 className="text-3xl font-bold tracking-tight">{lesson.title}</h1>
        <p className="text-sm text-white/60">{lesson.description}</p>
        {lesson.prerequisites.length > 0 && (
          <p className="text-xs text-white/40">Prerequisites: {lesson.prerequisites.join(', ')}</p>
        )}
      </header>

      {lesson.sections.map((section) => (
        <section key={section.id} className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-xl font-semibold text-white/90">{section.title}</h2>
          <p className="text-sm leading-relaxed text-white/70">{section.content}</p>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white/50">Objectives</h3>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-white/70">
              {section.objectives.map((objective) => (
                <li key={objective}>{objective}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white/50">Applications</h3>
            {section.applications.map((app) => {
              const simulation = app.type === 'simulation' ? globalRegistry.get(app.resourceId) : undefined;
              const metadata = simulation?.metadata;
              const ranges = metadata?.validInputRanges ?? {};
              const current = inputs[app.resourceId] ?? metadata?.defaults ?? {};
              const result = results[app.resourceId];
              const error = errors[app.resourceId];

              return (
                <div key={app.id} className="rounded-lg border border-white/10 bg-black/20 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-base font-medium text-white">{app.title}</h4>
                      <p className="text-sm text-white/60">{app.description}</p>
                    </div>
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/50">{app.type}</span>
                  </div>

                  {app.type === 'simulation' && metadata && (
                    <div className="mt-4 space-y-3">
                      <div className="grid gap-3 sm:grid-cols-3">
                        {Object.keys(ranges).map((key) => (
                          <label key={key} className="flex flex-col text-xs text-white/60">
                            <span>
                              {key} ({metadata.units?.[key] ?? '—'})
                            </span>
                            <input
                              type="number"
                              className="mt-1 rounded border border-white/15 bg-black/30 px-2 py-1 text-sm text-white"
                              min={ranges[key].min}
                              max={ranges[key].max}
                              step="any"
                              value={current[key] ?? ranges[key].min}
                              onChange={(e) => updateInput(app.resourceId, key, Number(e.target.value))}
                            />
                            <span className="mt-0.5 text-[10px] text-white/30">
                              {ranges[key].min}–{ranges[key].max}
                            </span>
                          </label>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRunSimulation(app.resourceId)}
                        className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-500"
                      >
                        Run simulation
                      </button>

                      {error && <p className="text-sm text-red-400">{error}</p>}

                      {result !== undefined && (
                        <div className="rounded-lg bg-white/5 p-3">
                          <h5 className="text-xs font-semibold uppercase tracking-wide text-white/50">Result</h5>
                          <pre className="mt-1 overflow-auto text-xs text-white/80">
                            {JSON.stringify(result, null, 2)}
                          </pre>
                        </div>
                      )}

                      <button
                        type="button"
                        className="text-xs text-white/40 underline"
                        onClick={() => handleRunSimulation(app.resourceId)}
                      >
                        Re-run
                      </button>
                    </div>
                  )}

                  {app.type !== 'simulation' && (
                    <p className="mt-3 text-xs text-white/40">
                      {app.type} resource: {app.resourceId}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {section.assessments.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white/50">Self-check</h3>
              {section.assessments.map((assessment) => (
                <div key={assessment.id} className="rounded-lg border border-white/10 p-3">
                  <h4 className="text-sm font-medium text-white">{assessment.title}</h4>
                  <p className="text-sm text-white/60">{assessment.description}</p>
                  <p className="mt-1 text-xs italic text-white/40">
                    {assessment.itemIds.length} item(s) in this {assessment.type}.
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      ))}

      {lessonSimulations.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-white/90">Model assumptions &amp; references</h2>
          {Array.from(new Set(lessonSimulations.map((s) => s.resourceId))).map((id) => {
            const metadata = globalRegistry.get(id)?.metadata;
            if (!metadata) return null;
            return (
              <details key={id} className="rounded-lg border border-white/10 bg-white/5 p-4">
                <summary className="cursor-pointer text-sm font-medium text-white">{metadata.name}</summary>
                <div className="mt-3 space-y-2 text-sm text-white/70">
                  <div>
                    <h3 className="font-semibold text-white/80">Assumptions</h3>
                    <ul className="list-disc pl-5">
                      {metadata.assumptions.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white/80">Limitations</h3>
                    <ul className="list-disc pl-5">
                      {metadata.limitations.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  {metadata.safetyNotes && metadata.safetyNotes.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-amber-300">Safety notes</h3>
                      <ul className="list-disc pl-5 text-amber-200/80">
                        {metadata.safetyNotes.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-white/80">References</h3>
                    <ul className="list-disc pl-5">
                      {metadata.references.map((ref) => (
                        <li key={ref.url}>
                          <a className="text-blue-400 hover:text-blue-300" href={ref.url} target="_blank" rel="noreferrer">
                            {ref.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </details>
            );
          })}
        </section>
      )}

      <section className="space-y-3 rounded-xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-xl font-semibold text-white/90">Apply &amp; Reflect</h2>
        <p className="text-sm text-white/70">
          Try changing one input at a time and predict the result before running the model. Notice how the outcome
          relates to the lesson objectives above.
        </p>
        <p className="text-sm text-white/70">
          Reflection: which assumption in the model do you think matters most in a real-world situation, and why?
        </p>
      </section>

      {lesson.references.length > 0 && (
        <section className="space-y-2 text-sm text-white/50">
          <h2 className="text-base font-semibold text-white/80">Lesson references</h2>
          <ul className="list-disc pl-5">
            {lesson.references.map((ref) => (
              <li key={ref}>{ref}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
