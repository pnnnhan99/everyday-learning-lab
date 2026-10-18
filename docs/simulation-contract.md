# Simulation Contract

## Purpose

Define a typed, framework-independent contract for simulations so that scientific
logic can be written, tested, and reviewed without depending on React, Next.js,
Three.js, or any UI library.

## Core types (`src/core/simulation/`)

```ts
interface SimulationContract<TInit = unknown, TResult = unknown> {
  initialize(): Promise<void> | void;
  run(input?: TInit): Promise<TResult> | TResult;
}

interface SimulationMetadata {
  id: string;
  name: string;
  domain: 'mathematics' | 'chemistry' | 'physics' | 'biology' | 'realworld';
  description: string;
  assumptions: string[];
  limitations: string[];
  references: Array<{ title: string; url: string }>;
  units?: Record<string, string>;
  validInputRanges?: Record<string, { min: number; max: number }>;
  defaults?: Record<string, number>;
  safetyNotes?: string[];
}

interface Simulation<TInit = unknown, TResult = unknown> {
  id: string;
  metadata: SimulationMetadata;
  create: () => SimulationContract<TInit, TResult>;
}
```

## Registry

`SimulationRegistry` (exported from `src/core/simulation/registry.ts`) stores
registered simulations by ID and can instantiate a fresh `SimulationContract`
via `create(id)`. A `globalRegistry` singleton is exported for app-level use;
tests should create their own isolated `new SimulationRegistry()` instances.

## Adding a new simulation

1. Create a module under `src/domains/<domain>/simulations/`.
2. Export a `Simulation<TInit, TResult>` object with complete `metadata`
   (assumptions, limitations, references, and units where applicable).
3. Implement `create()` returning an object with `initialize` and `run`.
4. Register it in `src/simulations/index.ts` (`registerAllSimulations`).
5. Add unit tests under `__tests__/domains/<domain>/`.

The simulation's `run` method must be testable without importing React, Next.js,
or any browser API.

## Current simulations

| ID | Domain | File |
|----|--------|------|
| `chemistry.acid-base.co2` | chemistry | `src/domains/chemistry/simulations/acidBaseCO2.ts` |
| `physics.projectile` | physics | `src/domains/physics/simulations/projectile.ts` |
| `biology.co2-o2` | biology | `src/domains/biology/simulations/co2-o2.ts` |
| `mathematics.fractions-compare` | mathematics | `src/domains/mathematics/simulations/fractions-compare.ts` |

See `docs/SIMULATIONS.md` for the full registry reference (inputs, outputs, and where each renders).

## Known limitations

- The acid-base CO2 model is a simplified stoichiometric approximation for
  educational illustration only. It does not model kinetics, solubility, or
  side reactions and should not be cited as a quantitative prediction.
- Input values outside the documented `validInputRanges` are clamped, not
  rejected, to keep the UI forgiving for beginners.
