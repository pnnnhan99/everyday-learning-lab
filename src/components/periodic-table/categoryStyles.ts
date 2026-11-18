import type { ElementCategory } from '@/types/periodic';

/**
 * Static Tailwind classes per category. Keep these literal so Tailwind can
 * detect them; never build class names dynamically.
 */
export const categoryStyles: Record<
  ElementCategory,
  { cell: string; swatch: string; text: string }
> = {
  'alkali-metal': {
    cell: 'border-rose-300 bg-rose-50 hover:border-rose-400 dark:border-rose-900 dark:bg-rose-950/40',
    swatch: 'bg-rose-400 dark:bg-rose-500',
    text: 'text-rose-700 dark:text-rose-300',
  },
  'alkaline-earth-metal': {
    cell: 'border-orange-300 bg-orange-50 hover:border-orange-400 dark:border-orange-900 dark:bg-orange-950/40',
    swatch: 'bg-orange-400 dark:bg-orange-500',
    text: 'text-orange-700 dark:text-orange-300',
  },
  'transition-metal': {
    cell: 'border-sky-300 bg-sky-50 hover:border-sky-400 dark:border-sky-900 dark:bg-sky-950/40',
    swatch: 'bg-sky-400 dark:bg-sky-500',
    text: 'text-sky-700 dark:text-sky-300',
  },
  'post-transition-metal': {
    cell: 'border-teal-300 bg-teal-50 hover:border-teal-400 dark:border-teal-900 dark:bg-teal-950/40',
    swatch: 'bg-teal-400 dark:bg-teal-500',
    text: 'text-teal-700 dark:text-teal-300',
  },
  metalloid: {
    cell: 'border-emerald-300 bg-emerald-50 hover:border-emerald-400 dark:border-emerald-900 dark:bg-emerald-950/40',
    swatch: 'bg-emerald-400 dark:bg-emerald-500',
    text: 'text-emerald-700 dark:text-emerald-300',
  },
  nonmetal: {
    cell: 'border-lime-300 bg-lime-50 hover:border-lime-400 dark:border-lime-900 dark:bg-lime-950/40',
    swatch: 'bg-lime-400 dark:bg-lime-500',
    text: 'text-lime-700 dark:text-lime-300',
  },
  halogen: {
    cell: 'border-amber-300 bg-amber-50 hover:border-amber-400 dark:border-amber-900 dark:bg-amber-950/40',
    swatch: 'bg-amber-400 dark:bg-amber-500',
    text: 'text-amber-700 dark:text-amber-300',
  },
  'noble-gas': {
    cell: 'border-violet-300 bg-violet-50 hover:border-violet-400 dark:border-violet-900 dark:bg-violet-950/40',
    swatch: 'bg-violet-400 dark:bg-violet-500',
    text: 'text-violet-700 dark:text-violet-300',
  },
  lanthanide: {
    cell: 'border-fuchsia-300 bg-fuchsia-50 hover:border-fuchsia-400 dark:border-fuchsia-900 dark:bg-fuchsia-950/40',
    swatch: 'bg-fuchsia-400 dark:bg-fuchsia-500',
    text: 'text-fuchsia-700 dark:text-fuchsia-300',
  },
  actinide: {
    cell: 'border-indigo-300 bg-indigo-50 hover:border-indigo-400 dark:border-indigo-900 dark:bg-indigo-950/40',
    swatch: 'bg-indigo-400 dark:bg-indigo-500',
    text: 'text-indigo-700 dark:text-indigo-300',
  },
};
