'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { TriangleAlert, Sparkles } from 'lucide-react';
import type { Reaction } from '@/types/game';

const styleByEffect: Record<Reaction['effectType'], { ring: string; icon: typeof Sparkles; label: string }> = {
  informational: { ring: 'border-sky-300 bg-sky-50 dark:border-sky-800 dark:bg-sky-950', icon: Sparkles, label: 'Educational model' },
  toxic: { ring: 'border-red-400 bg-red-50 dark:border-red-800 dark:bg-red-950', icon: TriangleAlert, label: 'Toxic — do not try' },
};

export default function ReactionEffect({ reaction, resultKey }: { reaction: Reaction; resultKey: number }) {
  const style = styleByEffect[reaction.effectType];
  const Icon = style.icon;
  const shake = reaction.effectType === 'toxic' ? { x: [0, -10, 10, -6, 6, 0] } : { scale: [0.96, 1.02, 1] };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${reaction.resultTitle}-${resultKey}`}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.25 } }}
        exit={{ opacity: 0, y: -8 }}
        className={`rounded-2xl border p-4 ${style.ring}`}
      >
        <motion.div animate={shake} transition={{ duration: reaction.effectType === 'toxic' ? 0.5 : 0.35 }}>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Icon size={16} /> {style.label}
          </div>
          <h3 className="mt-1 text-lg font-bold">{reaction.resultTitle}</h3>
          <p className="mt-1 text-sm leading-6 text-zinc-700 dark:text-zinc-300">{reaction.observation}</p>
          {reaction.effectType === 'toxic' && (
            <p className="mt-2 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white">
              Safety guard: sealed demo only. Never mix bleach with acids in real life.
            </p>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
