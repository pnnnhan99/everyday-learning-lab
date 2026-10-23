# Registered Simulations

All simulations are registered with the shared contract in `src/core/simulation/` and exposed via `src/simulations/index.ts` (`registerAllSimulations()`). Each exposes typed metadata: `id`, `name`, `domain`, `description`, `assumptions`, `limitations`, `references`, optional `units`, `validInputRanges`, `defaults`, and `safetyNotes`.

| ID | Domain | Inputs | Outputs | Notes |
|---|---|---|---|---|
| `chemistry.acid-base.co2` | chemistry | `baseAmount`, `acidAmount` | reaction results | Acid-base CO₂ model |
| `physics.projectile` | physics | `speed`, `angle`, `gravity` | `range`, `maxHeight`, `flightTime`, `trajectory` | Ideal projectile, no air resistance |
| `biology.co2-o2` | biology | `sunlight`, `co2`, `water`, `leafArea` | `photosynthesisRate`, `respirationRate`, `netRate`, `oxygenReleased`, `co2Consumed`, `notes` | Heuristic photosynthesis vs respiration |
| `mathematics.fractions-compare` | mathematics | `numeratorA`, `denominatorA`, `numeratorB`, `denominatorB` | `comparison`, `crossProduct*`, `equivalent*` | Cross-multiplication + common denominators |

## Usage

```ts
import { registerAllSimulations, globalRegistry } from '@/simulations';

registerAllSimulations();
const sim = globalRegistry.get('physics.projectile')!;
const contract = sim.create();
await contract.initialize();
const result = contract.run({ speed: 20, angle: 45, gravity: 9.81 });
```

## Where it renders

- Lesson detail (`app/learn/[slug]`) — parameters generated from `validInputRanges`/`defaults`, validated with the shared validator, and awaited for both synchronous and asynchronous contracts.
- Lab runner (`app/lab/[simulationId]`) — generic controls + metadata viewer.
- Challenge detail (`app/challenges/[id]`) — runs linked simulations with defaults to collect evidence.
- 3D lab (`app/lab/3d`) — client-only illustrative water/plant-cell scenes and a quantitative projectile visualization. The page labels the model type and retains text, controls, and model notes when WebGL is unavailable.

## Adding a simulation

1. Create `src/domains/<domain>/simulations/<name>.ts` exporting a `Simulation` object with complete metadata.
2. Register it in `src/simulations/index.ts`.
3. Add tests under `__tests__/domains/<domain>/`.
4. (Optional) reference it from a lesson `Application` with `type: 'simulation'`.
