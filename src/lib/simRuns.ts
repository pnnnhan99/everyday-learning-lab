export interface SavedValue {
  key: string;
  value: number;
  unit?: string;
}

export interface SavedRun {
  id: string;
  at: number;
  inputs: SavedValue[];
  scalars: SavedValue[];
}

/** Keeps the comparison readable; older runs are dropped first. */
export const MAX_SAVED_RUNS = 5;

export function runStorageKey(simulationId: string): string {
  return `ess:sim-runs:${simulationId}`;
}

function isSavedValue(value: unknown): value is SavedValue {
  if (typeof value !== 'object' || value === null) return false;
  const entry = value as Record<string, unknown>;
  return typeof entry.key === 'string' && typeof entry.value === 'number';
}

function isSavedRun(value: unknown): value is SavedRun {
  if (typeof value !== 'object' || value === null) return false;
  const entry = value as Record<string, unknown>;
  return (
    typeof entry.id === 'string' &&
    typeof entry.at === 'number' &&
    Array.isArray(entry.inputs) &&
    entry.inputs.every(isSavedValue) &&
    Array.isArray(entry.scalars) &&
    entry.scalars.every(isSavedValue)
  );
}

export function parseSavedRuns(raw: string | null): SavedRun[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isSavedRun).slice(0, MAX_SAVED_RUNS);
  } catch {
    return [];
  }
}

export function addSavedRun(existing: SavedRun[], run: SavedRun): SavedRun[] {
  return [run, ...existing].slice(0, MAX_SAVED_RUNS);
}

export function createSavedRun(
  inputs: SavedValue[],
  scalars: SavedValue[],
  at: number = Date.now(),
): SavedRun {
  return {
    id: `${at}-${Math.random().toString(36).slice(2, 8)}`,
    at,
    inputs,
    scalars,
  };
}

export function readSavedRuns(simulationId: string): SavedRun[] {
  if (typeof window === 'undefined') return [];
  try {
    return parseSavedRuns(window.localStorage.getItem(runStorageKey(simulationId)));
  } catch {
    return [];
  }
}

export function writeSavedRuns(simulationId: string, runs: SavedRun[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(runStorageKey(simulationId), JSON.stringify(runs));
  } catch {
    /* storage can be unavailable or full; the in-memory list still works */
  }
}

/**
 * Tiny external store so the comparison view can render saved runs with
 * `useSyncExternalStore`. React then uses an empty server snapshot and swaps in
 * the browser data after hydration, which avoids SSR mismatches without an
 * effect that writes state.
 */
const EMPTY_RUNS: SavedRun[] = [];
const listeners = new Set<() => void>();
const snapshots = new Map<string, { raw: string | null; runs: SavedRun[] }>();

export function subscribeSavedRuns(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getSavedRunsSnapshot(simulationId: string): SavedRun[] {
  if (typeof window === 'undefined') return EMPTY_RUNS;
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(runStorageKey(simulationId));
  } catch {
    return EMPTY_RUNS;
  }
  const cached = snapshots.get(simulationId);
  if (cached && cached.raw === raw) return cached.runs;
  const runs = parseSavedRuns(raw);
  snapshots.set(simulationId, { raw, runs });
  return runs;
}

export function getSavedRunsServerSnapshot(): SavedRun[] {
  return EMPTY_RUNS;
}

export function notifySavedRunsChanged(): void {
  for (const listener of listeners) listener();
}

export function humanizeKey(key: string): string {
  return key
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]/g, ' ')
    .replace(/^\w/, (character) => character.toUpperCase());
}

export function formatNumber(value: number): string {
  if (Number.isInteger(value)) return String(value);
  return Math.abs(value) >= 100 ? value.toFixed(1) : value.toPrecision(4).replace(/\.?0+$/, '');
}

