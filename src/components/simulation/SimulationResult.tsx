'use client';

import { useDictionary } from '@/i18n/useDictionary';
import { formatNumber, humanizeKey } from '@/lib/simRuns';
import type { SimulationMetadata } from '@/core/simulation/types';
import { describeResult } from '@/lib/simulationView';

type Tone = 'light' | 'dark';

const styles: Record<
  Tone,
  {
    card: string;
    nested: string;
    label: string;
    value: string;
    muted: string;
    summary: string;
    pre: string;
  }
> = {
  light: {
    card: 'rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900/40',
    nested: 'rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-950/60',
    label: 'text-[11px] text-zinc-500',
    value: 'mt-1 text-lg font-semibold',
    muted: 'text-zinc-600 dark:text-zinc-300',
    summary: 'cursor-pointer text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300',
    pre: 'mt-1 overflow-auto text-xs text-zinc-600 dark:text-zinc-300',
  },
  dark: {
    card: 'rounded-lg border border-white/10 bg-white/5 p-3',
    nested: 'rounded-lg border border-white/10 bg-black/20 p-3',
    label: 'text-[11px] text-white/50',
    value: 'mt-1 text-lg font-semibold text-white',
    muted: 'text-white/70',
    summary: 'cursor-pointer text-xs text-white/50 hover:text-white/80',
    pre: 'mt-1 overflow-auto text-xs text-white/80',
  },
};

export function SimulationResult({
  result,
  metadata,
  tone = 'light',
  testId,
}: {
  result: unknown;
  metadata: SimulationMetadata;
  tone?: Tone;
  testId?: string;
}) {
  const dictionary = useDictionary();
  const view = describeResult(result, metadata);
  const style = styles[tone];

  return (
    <div className={style.card} data-testid={testId} aria-live="polite">
      <h4 className="text-[11px] font-medium tracking-widest uppercase text-inherit opacity-60">
        {dictionary.lab.result}
      </h4>

      {view.scalars.length > 0 && (
        <dl className="mt-3 grid gap-3 sm:grid-cols-3">
          {view.scalars.map((item) => (
            <div key={item.key} className={style.nested}>
              <dt className={style.label}>{humanizeKey(item.key)}</dt>
              <dd className={style.value}>
                {formatNumber(item.value)}
                {item.unit ? <span className="ml-1 text-xs font-normal opacity-60">{item.unit}</span> : null}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {view.lists.length > 0 && (
        <ul className="mt-3 space-y-2">
          {view.lists.map((item) => (
            <li key={item.key} className={`${style.nested} text-sm`}>
              <p className={style.muted}>
                {humanizeKey(item.key)} · <span className="font-medium">{item.length} {dictionary.lab.values}</span>
              </p>
              <details className="mt-1">
                <summary className={style.summary}>{dictionary.lab.preview}</summary>
                <pre className={style.pre}>{item.preview} …</pre>
              </details>
            </li>
          ))}
        </ul>
      )}

      {view.others.length > 0 && (
        <div className="mt-3 space-y-2">
          {view.others.map((item) => (
            <div key={item.key} className={`${style.nested} text-sm`}>
              <p className={style.muted}>{humanizeKey(item.key)}</p>
              <pre className={style.pre}>{item.value}</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
