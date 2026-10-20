# Development status and next steps

> Repository: `pnnnhan99/everyday-learning-lab`
> Last reviewed: 2026-10-18
> Status: documentation audit only; no application code or automated checks were run as part of this audit.

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

- [ ] Run `npm ci`, `npm run lint`, `npx tsc --noEmit`, `npm run test:run`, `npm run validate`, and `npm run build`.
- [ ] Review failing CI runs and fix concrete regressions before adding broad new features.
- [ ] Audit every mutation route, including authorization, malformed payloads, referenced IDs, duplicate pairs, and safe error responses.
- [ ] Verify tests actually cover unauthorized mutation attempts and prove that data remains unchanged.
- [ ] Review existing 3D-related components and route boundaries before creating parallel abstractions.

### P1 — 3D foundation

- [ ] Define a typed simulation contract independent of React rendering.
- [ ] Lazy-load 3D scenes on the client and provide loading, error, reduced-motion, and unsupported-WebGL fallbacks.
- [ ] Provide keyboard-accessible alternatives for essential scene interactions.
- [ ] Keep calculations and validation in independently testable domain logic.
- [ ] Label models as illustrative or quantitative and document assumptions, units, limitations, sources, and safety notes.

Tracking issue: [#48 — Reusable client-only 3D simulation foundation](https://github.com/pnnnhan99/everyday-learning-lab/issues/48).

### P1 — First cross-domain learning journeys

- [ ] Chemistry: an atom or molecule model connected to a reviewed lesson.
- [ ] Physics: a motion/force model with explicit variables, units, equations, and boundary tests.
- [ ] Biology & Biochemistry: a sourced cell or biomolecule model with accurate labels.
- [ ] Reuse the flow: discover → learn → simulate → apply → reflect.
- [ ] Add a short self-check and make all three journeys discoverable.
- [ ] Verify responsive layouts, keyboard operation, empty/loading/error states, and content review status.

Tracking issue: [#49 — First 3D learning journey across three domains](https://github.com/pnnnhan99/everyday-learning-lab/issues/49).

## Quality gate for each implementation change

- [ ] Tests cover deterministic logic and important boundary cases.
- [ ] Lint and TypeScript checks pass.
- [ ] Relevant data/security validation scripts pass.
- [ ] Production build passes.
- [ ] Documentation reflects actual behavior.
- [ ] The related issue is closed only after its acceptance criteria are verified.

## Important product constraints

- Keep a modular monolith; do not introduce microservices without a demonstrated need.
- Preserve the existing chemistry workflow while expanding the shared learning core.
- Do not claim a general-purpose chemistry solver or validated physical/biological model.
- Never encourage real-world mixing of hazardous household chemicals.
- Do not mark an experience as scientifically reviewed without reputable sources and a review record.
- Do not claim completion based on a source edit alone; record actual commands and outcomes.
