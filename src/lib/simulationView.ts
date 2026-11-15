import type { SimulationMetadata } from '@/core/simulation/types';

// Presentation helpers shared by every simulation surface (lab runner,
// lesson applications, and real-world challenges) so results are described the
// same way and no learner has to read raw JSON to interpret a model.

export interface ResultView {
  scalars: Array<{ key: string; value: number; unit?: string }>;
  lists: Array<{ key: string; length: number; preview: string }>;
  others: Array<{ key: string; value: string }>;
}

export function describeResult(result: unknown, metadata: SimulationMetadata): ResultView {
  const view: ResultView = { scalars: [], lists: [], others: [] };
  if (result === null || typeof result !== 'object') {
    return { scalars: [], lists: [], others: [{ key: 'Result', value: String(result) }] };
  }

  for (const [key, value] of Object.entries(result as Record<string, unknown>)) {
    const unit = metadata.units?.[key];
    if (typeof value === 'number' && Number.isFinite(value)) {
      view.scalars.push({ key, value, unit });
    } else if (Array.isArray(value)) {
      view.lists.push({
        key,
        length: value.length,
        preview: JSON.stringify(value.slice(0, 3)).slice(0, 160),
      });
    } else if (typeof value === 'object' && value !== null) {
      view.others.push({ key, value: JSON.stringify(value, null, 2) });
    } else {
      view.others.push({ key, value: String(value) });
    }
  }
  return view;
}

/** Every numeric input a runner should expose, including defaults without a declared range. */
export function simulationInputKeys(metadata: SimulationMetadata): string[] {
  const keys = new Set<string>(Object.keys(metadata.validInputRanges ?? {}));
  for (const key of Object.keys(metadata.defaults ?? {})) keys.add(key);
  return Array.from(keys);
}

/** Start from declared defaults, then keep any values the learner already set. */
export function initialSimulationInputs(
  metadata: SimulationMetadata,
  existing?: Record<string, number>,
): Record<string, number> {
  return { ...(metadata.defaults ?? {}), ...(existing ?? {}) };
}
