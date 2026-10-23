# Development status and next steps

> Repository: `pnnnhan99/everyday-learning-lab`
> Last reviewed: 2026-10-23
> Status: implementation and local verification complete. Remote GitHub Actions and issue state could not be read because the repository URLs returned 404 without authentication.

This file replaces a stale audit that contradicted the current repository. Check source and CI before marking any item complete. GitHub issue state alone is not proof that every acceptance criterion has been implemented.

## Confirmed in the current source review

- [x] Next.js App Router with TypeScript.
- [x] Existing chemistry workspace with drag-and-drop interactions and Zustand state.
- [x] Element and reaction API routes with runtime validation.
- [x] Mutation handlers use a server-side maintainer-token check.
- [x] Repository abstraction and SQLite persistence are documented in `docs/persistence.md`.
- [x] Automated validation scripts and a GitHub Actions workflow are present in the repository.
- [x] `three`, `@react-three/fiber`, and `@react-three/drei` are declared in `package.json`.

These are source-presence checks only. They do not establish that the app builds, that all authorization cases are safe, or that every workflow is covered by tests.

## Active implementation priorities

### P0 — Verify the current baseline

- [x] Run `npm ci`, `npm run lint`, `npx tsc --noEmit`, `npm run test:run`, `npm run validate`, and `npm run build`.
- [x] Review the local CI workflow and fix the concrete dependency-lock regression that prevented `npm ci`. Remote run history was unavailable without repository access.
- [x] Audit every mutation route, including authorization, malformed payloads, referenced IDs, duplicate pairs, and safe error responses.
- [x] Verify tests cover unauthorized mutation attempts and prove that data remains unchanged.
- [x] Review existing 3D-related components and route boundaries before extending the shared implementation.

### P1 — 3D foundation

- [x] Define a typed simulation contract independent of React rendering.
- [x] Lazy-load 3D scenes on the client and provide loading, error, reduced-motion, and unsupported-WebGL fallbacks.
- [x] Provide keyboard-accessible alternatives for essential scene interactions.
- [x] Keep calculations and validation in independently testable domain logic.
- [x] Label models as illustrative or quantitative and document assumptions, units, limitations, sources, and safety notes.

Tracking issue: [#48 — Reusable client-only 3D simulation foundation](https://github.com/pnnnhan99/everyday-learning-lab/issues/48).

### P1 — First cross-domain learning journeys

- [x] Chemistry: a water molecule model connected to a lesson with an explicit draft review label.
- [x] Physics: a projectile-motion model with explicit variables, units, equations, and boundary tests.
- [x] Biology & Biochemistry: a sourced, explicitly illustrative plant-cell model with accurate labels.
- [x] Reuse the flow: discover → learn → simulate → apply → reflect.
- [x] Add a short self-check and make all three journeys discoverable.
- [x] Verify responsive layouts, keyboard operation, empty/loading/error states, and content review status in source and automated checks.

Tracking issue: [#49 — First 3D learning journey across three domains](https://github.com/pnnnhan99/everyday-learning-lab/issues/49).

## Quality gate for each implementation change

- [x] Tests cover deterministic logic and important boundary cases.
- [x] Lint and TypeScript checks pass.
- [x] Relevant data/security validation scripts pass.
- [x] Production build passes.
- [x] Documentation reflects actual behavior.
- [x] The related implementation acceptance criteria are verified locally. Closing remote issues remains a repository-maintainer action because GitHub issue state was inaccessible.

## Verification record — 2026-10-23

- `npm ci` — passed after synchronizing the stale `esbuild` entries in `package-lock.json` with `package.json`.
- `npm run lint` — passed with no errors.
- `npx tsc --noEmit` — passed with no errors.
- `npm run test:run` — 20 test files passed; 174 tests passed.
- `npm run validate` — reaction, mutation-security, and persistence validation passed; persistence reported 21 passed and 0 failed.
- `npm run build` — Next.js 16.4.2 production build passed and generated all application routes.
- `npm audit --omit=dev` — passed with 0 production vulnerabilities after upgrading Next.js from 16.3.8 to 16.4.2. The full audit still reports advisory chains in lint/Drizzle development tooling; npm's suggested fixes downgrade major packages, so they were not applied automatically.

## Important product constraints

- Keep a modular monolith; do not introduce microservices without a demonstrated need.
- Preserve the existing chemistry workflow while expanding the shared learning core.
- Do not claim a general-purpose chemistry solver or validated physical/biological model.
- Never encourage real-world mixing of hazardous household chemicals.
- Do not mark an experience as scientifically reviewed without reputable sources and a review record.
- Do not claim completion based on a source edit alone; record actual commands and outcomes.
