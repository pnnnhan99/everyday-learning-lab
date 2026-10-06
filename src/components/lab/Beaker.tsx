'use client';

import { useDroppable } from '@dnd-kit/core';
import { AnimatePresence, motion } from 'framer-motion';
import { FlaskConical } from 'lucide-react';
import type { Element } from '@/types/game';

export default function Beaker({ elements }: { elements: Element[] }) {
  const { setNodeRef, isOver } = useDroppable({ id: 'beaker' });

  return (
    <div
      ref={setNodeRef}
      className={`flex min-h-40 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-4 text-center transition-colors ${
        isOver ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' : 'border-zinc-300 dark:border-zinc-700'
      }`}
    >
      <FlaskConical size={28} className="text-zinc-400" />
      <p className="text-sm font-medium">Drop elements here (or use “Add to beaker”)</p>
      <div className="flex min-h-8 flex-wrap items-center justify-center gap-2">
        <AnimatePresence>
          {elements.length === 0 && (
            <motion.span key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-zinc-400">
              Beaker is empty — pick up to 2 elements
            </motion.span>
          )}
          {elements.map((el) => (
            <motion.span
              key={el.id}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              className="rounded-full bg-zinc-900 px-3 py-1 text-xs font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
            >
              {el.name}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
