import type { SimulationMetadata } from './types';

export type ValidationResult =
  | { ok: true; values: Record<string, number> }
  | { ok: false; errors: string[] };

type Ranges = NonNullable<SimulationMetadata['validInputRanges']>;
type Defaults = NonNullable<SimulationMetadata['defaults']>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Validates and normalizes inputs against a simulation's declared
 * `validInputRanges` and `defaults`.
 *
 * Rules:
 * - `undefined`/`null` input falls back to `defaults`.
 * - Every provided key must be declared in `validInputRanges`.
 * - Provided values must be finite numbers inside their declared range.
 * - Keys that appear in `validInputRanges` but not in `defaults` are
 *   optional (the simulation computes or infers them), so they are skipped
 *   when absent — but if supplied they are still fully validated.
 * - Keys in `defaults` are always present in the result and validated.
 *
 * The returned `values` is a complete, in-range input object safe to pass to
 * `SimulationContract.run()`. Contracts additionally clamp defensively, so
 * this validator is the *explicit*, user-facing check while clamping is a
 * last-resort safety net.
 */
export function validateSimulationInput(
  input: unknown,
  metadata: Pick<SimulationMetadata, 'validInputRanges' | 'defaults'>,
): ValidationResult {
  const ranges: Ranges = metadata.validInputRanges ?? {};
  const defaults: Defaults = metadata.defaults ?? {};
  const declaredKeys = Object.keys(ranges);

  let provided: Record<string, unknown> = {};
  if (input !== undefined && input !== null) {
    if (!isRecord(input)) {
      return { ok: false, errors: ['Input must be an object'] };
    }
    provided = input;
  }

  const errors: string[] = [];

  for (const key of Object.keys(provided)) {
    if (!declaredKeys.includes(key)) {
      errors.push(`"${key}" is not a valid input for this simulation`);
    }
  }

  const values: Record<string, number> = {};
  const keysToValidate = new Set([...Object.keys(defaults), ...Object.keys(provided)]);

  for (const key of keysToValidate) {
    const range = ranges[key];
    if (!range) continue; // unknown keys already reported above

    const raw = provided[key] !== undefined ? provided[key] : defaults[key];
    if (raw === undefined) continue; // optional key without default: skip

    if (typeof raw !== 'number' || !Number.isFinite(raw)) {
      errors.push(`"${key}" must be a finite number`);
      continue;
    }
    if (raw < range.min || raw > range.max) {
      errors.push(`"${key}" must be between ${range.min} and ${range.max} (got ${raw})`);
      continue;
    }
    values[key] = raw;
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }
  return { ok: true, values };
}
