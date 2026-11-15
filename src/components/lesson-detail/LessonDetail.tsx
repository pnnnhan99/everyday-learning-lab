'use client';

import Link from 'next/link';
import React, { useMemo, useState } from 'react';

import type { Lesson, ReviewStatus } from '@/learning/types';
import { getLab3dModelForLesson, getLocalizedLesson } from '@/learning/catalog';
import { lab3dHref } from '@/learning/lab3d';
import { useDictionary, useLocale } from '@/i18n/useDictionary';
import { registerAllSimulations } from '@/simulations';
import { globalRegistry } from '@/core/simulation/registry';
import { validateSimulationInput } from '@/core/simulation/validation';
import { SimulationInputs } from '@/components/simulation/SimulationInputs';
import { SimulationResult } from '@/components/simulation/SimulationResult';
import { SelfCheck } from './SelfCheck';

registerAllSimulations();

function reviewBadgeStyle(status: ReviewStatus): string {
  return status === 'expert-reviewed'
    ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-200'
    : 'border-amber-400/40 bg-amber-400/10 text-amber-200';
}

export const LessonDetail: React.FC<{ lesson: Lesson }> = ({ lesson: canonicalLesson }) => {
  const dictionary = useDictionary();
  const locale = useLocale();
  const lesson = getLocalizedLesson(canonicalLesson.id, locale) ?? canonicalLesson;
  const [results, setResults] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [inputs, setInputs] = useState<Record<string, Record<string, number>>>({});
  const [running, setRunning] = useState<Record<string, boolean>>({});

  const handleRunSimulation = async (simulationId: string) => {
    const simulation = globalRegistry.get(simulationId);
    if (!simulation) {
      setErrors((prev) => ({ ...prev, [simulationId]: dictionary.lesson.simulationNotFound }));
      return;
    }
    const contract = simulation.create();
    const input = inputs[simulationId] ?? simulation.metadata.defaults ?? {};
    const validation = validateSimulationInput(input, simulation.metadata);
    if (!validation.ok) {
      setErrors((prev) => ({ ...prev, [simulationId]: validation.errors.join(' ') }));
      setResults((prev) => {
        const next = { ...prev };
        delete next[simulationId];
        return next;
      });
      return;
    }
    setRunning((prev) => ({ ...prev, [simulationId]: true }));
    try {
      await contract.initialize();
      const result = await contract.run(validation.values);
      setResults((prev) => ({ ...prev, [simulationId]: result }));
      setErrors((prev) => ({ ...prev, [simulationId]: '' }));
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        [simulationId]: err instanceof Error ? err.message : dictionary.lab.simulationFailed,
      }));
    } finally {
      setRunning((prev) => ({ ...prev, [simulationId]: false }));
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

  const reviewStatus: ReviewStatus = lesson.reviewStatus ?? 'draft';
  const lab3dModel = getLab3dModelForLesson(lesson.id);

  return (
    <div className="space-y-10 text-white">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-wide text-white/40">
          {dictionary.domains[lesson.domain]} · {dictionary.difficulty[lesson.difficulty]}
        </p>
        <h1 className="text-3xl font-bold tracking-tight">{lesson.title}</h1>
        <p className="text-sm text-white/60">{lesson.description}</p>
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <span className={`rounded-full border px-2 py-0.5 text-xs ${reviewBadgeStyle(reviewStatus)}`}>
            {dictionary.review[reviewStatus]}
          </span>
          {lab3dModel && (
            <Link
              href={lab3dHref(lab3dModel)}
              className="text-sm text-sky-300 hover:text-sky-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
            >
              {dictionary.lesson.chooseDomain} →
            </Link>
          )}
        </div>
        {lesson.prerequisites.length > 0 && (
          <p className="text-xs text-white/40">
            {dictionary.lesson.prerequisites}: {lesson.prerequisites.join(', ')}
          </p>
        )}
      </header>

      {lesson.sections.map((section) => (
        <section key={section.id} className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-xl font-semibold text-white/90">{section.title}</h2>
          <p className="text-sm leading-relaxed text-white/70">{section.content}</p>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white/50">{dictionary.lesson.objectives}</h3>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-white/70">
              {section.objectives.map((objective) => (
                <li key={objective}>{objective}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white/50">{dictionary.lesson.applications}</h3>
            {section.applications.map((app) => {
              const simulation = app.type === 'simulation' ? globalRegistry.get(app.resourceId) : undefined;
              const metadata = simulation?.metadata;
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
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/50">
                      {app.type === 'simulation' ? dictionary.lesson.simulationLabel : app.type}
                    </span>
                  </div>

                  {app.type === 'simulation' && metadata && (
                    <div className="mt-4 space-y-3">
                      <SimulationInputs
                        metadata={metadata}
                        values={current}
                        tone="dark"
                        onChange={(key, value) => updateInput(app.resourceId, key, value)}
                      />

                      <button
                        type="button"
                        onClick={() => handleRunSimulation(app.resourceId)}
                        disabled={running[app.resourceId]}
                        className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-500 disabled:cursor-wait disabled:opacity-60"
                      >
                        {running[app.resourceId] ? dictionary.lesson.running : dictionary.lesson.runSimulation}
                      </button>

                      {error && <p role="alert" className="text-sm text-red-400">{error}</p>}

                      {result !== undefined && (
                        <SimulationResult result={result} metadata={metadata} tone="dark" />
                      )}

                      <button
                        type="button"
                        className="text-xs text-white/40 underline"
                        onClick={() => handleRunSimulation(app.resourceId)}
                        disabled={running[app.resourceId]}
                      >
                        {dictionary.lesson.rerun}
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
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white/50">{dictionary.lesson.selfCheck}</h3>
              {section.assessments.map((assessment) => (
                <SelfCheck key={assessment.id} assessment={assessment} />
              ))}
            </div>
          )}
        </section>
      ))}

      {lessonSimulations.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-white/90">{dictionary.lesson.assumptionsHeading}</h2>
          {Array.from(new Set(lessonSimulations.map((s) => s.resourceId))).map((id) => {
            const metadata = globalRegistry.get(id)?.metadata;
            if (!metadata) return null;
            return (
              <details key={id} className="rounded-lg border border-white/10 bg-white/5 p-4">
                <summary className="cursor-pointer text-sm font-medium text-white">{metadata.name}</summary>
                <div className="mt-3 space-y-2 text-sm text-white/70">
                  <div>
                    <h3 className="font-semibold text-white/80">{dictionary.lesson.assumptions}</h3>
                    <ul className="list-disc pl-5">
                      {metadata.assumptions.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white/80">{dictionary.lesson.limitations}</h3>
                    <ul className="list-disc pl-5">
                      {metadata.limitations.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  {metadata.safetyNotes && metadata.safetyNotes.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-amber-300">{dictionary.lesson.safety}</h3>
                      <ul className="list-disc pl-5 text-amber-200/80">
                        {metadata.safetyNotes.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-white/80">{dictionary.lesson.references}</h3>
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
        <h2 className="text-xl font-semibold text-white/90">{dictionary.lesson.applyReflect}</h2>
        <p className="text-sm text-white/70">{dictionary.lesson.applyReflectBody}</p>
        <p className="text-sm text-white/70">{dictionary.lesson.reflectionPrompt}</p>
      </section>

      {lesson.references.length > 0 && (
        <section className="space-y-2 text-sm text-white/50">
          <h2 className="text-base font-semibold text-white/80">{dictionary.lesson.lessonReferences}</h2>
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
