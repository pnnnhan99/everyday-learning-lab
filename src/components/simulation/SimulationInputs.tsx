'use client';

import { useId } from 'react';

import type { SimulationMetadata } from '@/core/simulation/types';
import { useDictionary } from '@/i18n/useDictionary';
import { humanizeKey } from '@/lib/simRuns';
import { simulationInputKeys } from '@/lib/simulationView';

type Tone = 'light' | 'dark';

const inputClass: Record<Tone, string> = {
  light:
    'mt-1 rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-white',
  dark: 'mt-1 rounded border border-white/15 bg-black/30 px-2 py-1 text-sm text-white focus:border-blue-400 focus:outline-none',
};

const labelClass: Record<Tone, string> = {
  light: 'flex flex-col text-xs text-zinc-600 dark:text-zinc-300',
  dark: 'flex flex-col text-xs text-white/60',
};

const rangeClass: Record<Tone, string> = {
  light: 'mt-1 text-[10px] text-zinc-400',
  dark: 'mt-0.5 text-[10px] text-white/30',
};

/**
 * Numeric input grid for a simulation. Shared so a model behaves the same in
 * the standalone lab, inside a lesson, and inside a real-world challenge.
 */
export function SimulationInputs({
  metadata,
  values,
  onChange,
  tone = 'light',
}: {
  metadata: SimulationMetadata;
  values: Record<string, number>;
  onChange: (key: string, value: number) => void;
  tone?: Tone;
}) {
  const dictionary = useDictionary();
  const groupId = useId();
  const keys = simulationInputKeys(metadata);
  const ranges = metadata.validInputRanges ?? {};

  if (keys.length === 0) {
    return <p className="text-sm text-inherit opacity-60">{dictionary.lab.noInputs}</p>;
  }

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {keys.map((key) => {
        const range = ranges[key];
        const id = `${groupId}-${key}`;
        return (
          <label key={key} htmlFor={id} className={labelClass[tone]}>
            <span>
              {humanizeKey(key)} {metadata.units?.[key] ? `(${metadata.units[key]})` : ''}
            </span>
            <input
              id={id}
              type="number"
              className={inputClass[tone]}
              min={range?.min}
              max={range?.max}
              step="any"
              value={values[key] ?? ''}
              onChange={(event) => onChange(key, Number(event.target.value))}
            />
            {range ? <span className={rangeClass[tone]}>{range.min} – {range.max}</span> : null}
          </label>
        );
      })}
    </div>
  );
}
