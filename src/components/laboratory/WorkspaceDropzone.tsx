'use client';

import { useDroppable } from '@dnd-kit/core';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';

import { useGameStore } from '../../store/useGameStore';
import type { EffectType } from '../../types/game';
import DraggableElement from './DraggableElement';

const MERGE_DURATION_MS = 700;
const NO_REACTION_NOTICE_MS = 2400;

const EFFECT_STYLES: Record<EffectType, { label: string; accent: string; halo: string }> = {
  toxic: { label: 'Hazard', accent: 'from-orange-500 to-rose-500', halo: 'shadow-orange-500/40' },
  informational: { label: 'Model', accent: 'from-sky-400 to-cyan-300', halo: 'shadow-sky-500/40' },
};

export default function WorkspaceDropzone() {
  const workspace = useGameStore((state) => state.workspace);
  const activeReaction = useGameStore((state) => state.activeReaction);
  const status = useGameStore((state) => state.status);
  const noReaction = useGameStore((state) => state.noReaction);
  const finishMerge = useGameStore((state) => state.finishMerge);
  const clearWorkspace = useGameStore((state) => state.clearWorkspace);

  const { isOver, setNodeRef } = useDroppable({ id: 'workspace' });

  useEffect(() => {
    if (status !== 'merging') return;

    const timer = setTimeout(finishMerge, MERGE_DURATION_MS);
    return () => clearTimeout(timer);
  }, [status, finishMerge]);

  useEffect(() => {
    if (!noReaction) return;
    const timer = setTimeout(() => clearWorkspace(), NO_REACTION_NOTICE_MS);
    return () => clearTimeout(timer);
  }, [noReaction, clearWorkspace]);

  useEffect(() => {
    if (status !== 'result') return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') clearWorkspace();
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [status, clearWorkspace]);

  const isMerging = status === 'merging';
  const effect = activeReaction ? EFFECT_STYLES[activeReaction.effectType] : null;

  return (
    <section className="flex flex-col items-center gap-4">
      <aside
        role="note"
        className="w-full max-w-2xl rounded-xl border border-amber-300/30 bg-amber-300/10 px-4 py-3 text-sm text-amber-100"
      >
        <strong>Simulation only.</strong> These simplified learning models are not lab protocols. Never
        mix household chemicals based on a result. Never mix bleach with vinegar, acids, ammonia, or
        other cleaners.
      </aside>
      <div
        ref={setNodeRef}
        data-testid="lab-bench"
        className={`relative flex min-h-64 w-full max-w-2xl flex-wrap items-center justify-center gap-6 rounded-3xl border-2 border-dashed p-8 transition-colors ${
          isOver
            ? 'border-sky-300/70 bg-sky-400/10'
            : 'border-white/15 bg-white/5 hover:border-white/25'
        }`}
      >
        <span className="pointer-events-none absolute inset-x-0 top-4 text-center text-[11px] font-medium tracking-widest text-white/40 uppercase">
          Lab Bench
        </span>

        {workspace.length === 0 ? (
          <p className="text-center text-sm text-white/50">
            Drag two substances here to see how they react.
          </p>
        ) : null}

        {workspace.map((element, index) => {
          const pull = index === 0 ? 1 : -1;

          return (
            <motion.div
              key={element.id}
              animate={
                isMerging
                  ? { x: pull * 56, scale: 0.55, rotate: pull * 14, opacity: 0 }
                  : { x: 0, scale: 1, rotate: 0, opacity: 1 }
              }
              transition={{ duration: MERGE_DURATION_MS / 1000, ease: 'easeInOut' }}
            >
              <DraggableElement element={element} onRemove={clearWorkspace} />
            </motion.div>
          );
        })}

        {isMerging ? (
          <motion.span
            initial={{ scale: 0, opacity: 0.9 }}
            animate={{ scale: 14, opacity: 0 }}
            transition={{ duration: MERGE_DURATION_MS / 1000, ease: 'easeOut' }}
            className="pointer-events-none absolute size-16 rounded-full bg-linear-to-br from-white/70 to-sky-300/50 blur-md"
          />
        ) : null}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={clearWorkspace}
          disabled={workspace.length === 0}
          className="rounded-lg border border-white/15 px-3 py-1.5 text-xs font-medium text-white/70 transition enabled:hover:bg-white/10 disabled:opacity-40"
        >
          Clear bench
        </button>
        <AnimatePresence>
          {noReaction ? (
            <motion.span
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="text-xs text-white/60"
            >
              No reviewed outcome is available for this pair. That does not mean they are safe to mix.
            </motion.span>
          ) : null}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {status === 'result' && activeReaction && effect ? (
          <motion.div
            key={activeReaction.resultTitle}
            role="dialog"
            data-testid="reaction-dialog"
            aria-modal="true"
            aria-labelledby="reaction-result-title"
            initial={{ opacity: 0, scale: 0.86, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className={`w-full max-w-lg rounded-3xl border border-white/15 bg-zinc-900/90 p-6 shadow-2xl backdrop-blur-xl ${effect.halo}`}
          >
            <div className={`h-1.5 w-24 rounded-full bg-linear-to-r ${effect.accent}`} />

            <div className="mt-4 flex items-center justify-between gap-3">
              <h2 id="reaction-result-title" className="text-xl font-bold tracking-tight text-white">
                {activeReaction.resultTitle}
              </h2>
              <span
                className={`rounded-full bg-linear-to-r ${effect.accent} px-3 py-1 text-[11px] font-semibold tracking-wide text-zinc-950 uppercase`}
              >
                {effect.label}
              </span>
            </div>

            <div className="mt-3 space-y-3 text-sm leading-relaxed text-white/75">
              <p>
                <strong className="text-white">Modeled outcome: </strong>
                {activeReaction.observation}
              </p>
              <p>
                <strong className="text-white">Explanation: </strong>
                {activeReaction.explanation}
              </p>
            </div>

            <p className="mt-3 rounded-lg border border-rose-300/20 bg-rose-300/10 p-3 text-sm text-rose-100">
              {activeReaction.safetyGuidance}
            </p>

            <div className="mt-4 space-y-2 text-xs text-white/60">
              <p>
                Review status:{' '}
                {activeReaction.reviewStatus === 'hazard-reviewed'
                  ? 'Hazard communication reviewed'
                  : 'Scientific claims reviewed'}
              </p>
              <p>Model assumptions: {activeReaction.assumptions.join(' ')}</p>
              <p className="font-medium text-white/75">References</p>
              <ul className="list-inside list-disc space-y-1">
                {activeReaction.references.map((reference) => (
                  <li key={reference.url}>
                    <a
                      href={reference.url}
                      target="_blank"
                      rel="noreferrer"
                      className="underline decoration-white/40 underline-offset-2 hover:text-white"
                    >
                      {reference.title} — {reference.publisher}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              autoFocus
              onClick={clearWorkspace}
              className="mt-5 w-full rounded-xl bg-white/10 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none"
            >
              Back to the bench
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
