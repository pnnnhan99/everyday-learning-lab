'use client';

import { useCallback, useState, useSyncExternalStore } from 'react';
import { Save, Trash2 } from 'lucide-react';

import { useDictionary } from '@/i18n/useDictionary';
import {
  addSavedRun,
  createSavedRun,
  formatNumber,
  getSavedRunsServerSnapshot,
  getSavedRunsSnapshot,
  humanizeKey,
  notifySavedRunsChanged,
  subscribeSavedRuns,
  writeSavedRuns,
  type SavedRun,
  type SavedValue,
} from '@/lib/simRuns';

interface RunComparisonTableProps {
  runs: SavedRun[];
  onRemove?: (id: string) => void;
}

function uniqueKeys(runs: SavedRun[], pick: (run: SavedRun) => SavedValue[]): string[] {
  const keys: string[] = [];
  for (const run of runs) {
    for (const value of pick(run)) {
      if (!keys.includes(value.key)) keys.push(value.key);
    }
  }
  return keys;
}

function unitFor(runs: SavedRun[], pick: (run: SavedRun) => SavedValue[], key: string): string | undefined {
  for (const run of runs) {
    const match = pick(run).find((value) => value.key === key);
    if (match?.unit) return match.unit;
  }
  return undefined;
}

/**
 * Presentational comparison grid. Kept free of storage so it can be rendered
 * on the server (and in tests) with plain data.
 */
export function RunComparisonTable({ runs, onRemove }: RunComparisonTableProps) {
  const dictionary = useDictionary();

  if (runs.length === 0) return null;

  const inputKeys = uniqueKeys(runs, (run) => run.inputs);
  const outputKeys = uniqueKeys(runs, (run) => run.scalars);

  function renderRows(kind: 'inputs' | 'scalars', keys: string[]) {
    const pick = (run: SavedRun) => (kind === 'inputs' ? run.inputs : run.scalars);
    return keys.map((key) => {
      const unit = unitFor(runs, pick, key);
      return (
        <tr key={`${kind}-${key}`} className="border-t border-zinc-200 dark:border-zinc-800">
          <th scope="row" className="py-2 pr-3 text-left font-normal text-zinc-600 dark:text-zinc-300">
            {humanizeKey(key)}
            {unit ? <span className="ml-1 text-[11px] text-zinc-400">({unit})</span> : null}
          </th>
          {runs.map((run) => {
            const value = pick(run).find((entry) => entry.key === key);
            return (
              <td key={run.id} className="px-3 py-2 text-right font-mono text-sm">
                {value ? formatNumber(value.value) : dictionary.lab.missingValue}
              </td>
            );
          })}
        </tr>
      );
    });
  }

  return (
    <div className="mt-3 overflow-x-auto">
      <table className="w-full min-w-[32rem] border-collapse text-sm">
        <caption className="sr-only">{dictionary.lab.savedRuns}</caption>
        <thead>
          <tr>
            <th scope="col" className="pb-2 pr-3 text-left text-[11px] font-medium tracking-widest text-zinc-500 uppercase">
              {dictionary.lab.comparison}
            </th>
            {runs.map((run, index) => (
              <th key={run.id} scope="col" className="px-3 pb-2 text-right align-bottom">
                <span className="block text-xs font-semibold text-zinc-700 dark:text-zinc-200">
                  {dictionary.lab.runLabel} {runs.length - index}
                </span>
                <span className="block text-[10px] font-normal text-zinc-400">
                  {new Date(run.at).toLocaleTimeString()}
                </span>
                {onRemove ? (
                  <button
                    type="button"
                    onClick={() => onRemove(run.id)}
                    className="mt-1 inline-flex items-center gap-1 text-[11px] font-normal text-zinc-500 hover:text-red-600 dark:hover:text-red-400"
                    aria-label={`${dictionary.lab.removeRun} ${dictionary.lab.runLabel} ${runs.length - index}`}
                  >
                    <Trash2 size={11} aria-hidden /> {dictionary.lab.removeRun}
                  </button>
                ) : null}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {inputKeys.length > 0 ? (
            <tr>
              <th
                colSpan={runs.length + 1}
                scope="rowgroup"
                className="pt-3 pb-1 text-left text-[11px] font-medium tracking-widest text-zinc-500 uppercase"
              >
                {dictionary.lab.inputsHeadingComparison}
              </th>
            </tr>
          ) : null}
          {renderRows('inputs', inputKeys)}
          {outputKeys.length > 0 ? (
            <tr>
              <th
                colSpan={runs.length + 1}
                scope="rowgroup"
                className="pt-3 pb-1 text-left text-[11px] font-medium tracking-widest text-zinc-500 uppercase"
              >
                {dictionary.lab.outputsHeadingComparison}
              </th>
            </tr>
          ) : null}
          {renderRows('scalars', outputKeys)}
        </tbody>
      </table>
    </div>
  );
}

interface RunComparisonProps {
  simulationId: string;
  /** Inputs of the latest successful run, or null before the first run. */
  inputs: SavedValue[] | null;
  /** Scalar outputs of the latest successful run, or null before the first run. */
  scalars: SavedValue[] | null;
}

export default function RunComparison({ simulationId, inputs, scalars }: RunComparisonProps) {
  const dictionary = useDictionary();
  const subscribe = useCallback((listener: () => void) => subscribeSavedRuns(listener), []);
  const getSnapshot = useCallback(() => getSavedRunsSnapshot(simulationId), [simulationId]);
  const runs = useSyncExternalStore(subscribe, getSnapshot, getSavedRunsServerSnapshot);
  const [announcement, setAnnouncement] = useState('');

  function persist(next: SavedRun[]) {
    writeSavedRuns(simulationId, next);
    notifySavedRunsChanged();
  }

  function save() {
    if (!inputs || !scalars) return;
    persist(addSavedRun(runs, createSavedRun(inputs, scalars)));
    setAnnouncement(dictionary.lab.runSaved);
  }

  function remove(id: string) {
    persist(runs.filter((run) => run.id !== id));
    setAnnouncement('');
  }

  function clear() {
    persist([]);
    setAnnouncement('');
  }

  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
      <h2 className="text-[11px] font-medium tracking-widest text-zinc-500 uppercase">
        {dictionary.lab.comparison}
      </h2>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{dictionary.lab.comparisonIntro}</p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={save}
          disabled={!inputs || !scalars}
          className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-700 transition enabled:hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-200 dark:enabled:hover:bg-zinc-900"
        >
          <Save size={14} /> {dictionary.lab.saveRun}
        </button>
        {runs.length > 0 ? (
          <button
            type="button"
            onClick={clear}
            className="text-sm text-zinc-500 underline-offset-2 hover:text-red-600 hover:underline dark:hover:text-red-400"
          >
            {dictionary.lab.clearSavedRuns}
          </button>
        ) : null}
        <span role="status" className="text-xs text-green-700 dark:text-green-400">
          {announcement}
        </span>
      </div>

      <p className="mt-2 text-xs text-zinc-500">
        {dictionary.lab.savedLocally} {dictionary.lab.maxRunsNote}
      </p>

      {runs.length === 0 ? (
        <p className="mt-3 text-sm text-zinc-500">{dictionary.lab.noSavedRuns}</p>
      ) : (
        <RunComparisonTable runs={runs} onRemove={remove} />
      )}
    </section>
  );
}
