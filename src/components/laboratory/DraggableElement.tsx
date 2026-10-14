'use client';

import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';

import type { Element, ElementType } from '../../types/game';

const TYPE_STYLES: Record<ElementType, { ring: string; badge: string; glow: string }> = {
  acid: {
    ring: 'from-amber-300/70 to-lime-200/40',
    badge: 'bg-amber-300/20 text-amber-100 ring-amber-200/40',
    glow: 'shadow-amber-400/30',
  },
  base: {
    ring: 'from-sky-300/70 to-indigo-300/40',
    badge: 'bg-sky-300/20 text-sky-100 ring-sky-200/40',
    glow: 'shadow-sky-400/30',
  },
  food: {
    ring: 'from-emerald-300/70 to-teal-200/40',
    badge: 'bg-emerald-300/20 text-emerald-100 ring-emerald-200/40',
    glow: 'shadow-emerald-400/30',
  },
  chemical: {
    ring: 'from-fuchsia-400/70 to-purple-300/40',
    badge: 'bg-fuchsia-400/20 text-fuchsia-100 ring-fuchsia-300/40',
    glow: 'shadow-fuchsia-400/30',
  },
};

interface ElementCardProps {
  element: Element;
  onRemove?: (elementId: string) => void;
}

export function ElementCard({ element, onRemove }: ElementCardProps) {
  const styles = TYPE_STYLES[element.type];

  return (
    <motion.div
      layout
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 420, damping: 28 }}
      className={`relative flex w-40 flex-col gap-1 rounded-2xl border border-white/10 bg-linear-to-br ${styles.ring} p-4 text-left shadow-xl ${styles.glow} backdrop-blur-md`}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl bg-linear-to-t from-black/30 to-transparent opacity-70"
      />

      <span className="relative text-3xl">{element.icon}</span>
      <span className="relative text-sm font-semibold text-white">{element.name}</span>
      <span
        className={`relative w-fit rounded-full px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase ring-1 ${styles.badge}`}
      >
        {element.type}
      </span>
      <span className="relative text-[11px] leading-snug text-white/70">{element.description}</span>

      {onRemove ? (
        <button
          type="button"
          onClick={() => onRemove(element.id)}
          onPointerDown={(event) => event.stopPropagation()}
          className="relative mt-1 w-full rounded-lg border border-white/15 bg-white/5 py-1 text-[11px] font-medium text-white/80 transition hover:border-white/30 hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none"
        >
          Remove
        </button>
      ) : null}
    </motion.div>
  );
}

export default function DraggableElement({ element, onRemove }: ElementCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: element.id,
    data: { element },
  });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform) }}
      className={isDragging ? 'relative z-20 opacity-30' : 'relative'}
      {...listeners}
      {...attributes}
    >
      <ElementCard element={element} onRemove={onRemove} />
    </div>
  );
}