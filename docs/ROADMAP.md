# Product Roadmap

This roadmap is ordered by dependency, not by a promise of calendar dates. Existing open issues take precedence where they already cover the work.

## Phase 0 — Trust and foundations

- [x] Review chemistry claims and safety notes against reputable sources.
- [x] Protect element/reaction mutation endpoints (POST/PUT/DELETE, with server-side auth tests).
- [x] Decide persistence requirements and replace prototype storage when justified.
- [x] Add automated tests and CI (lint, typecheck, test, build in `.github/workflows/ci.yml`).
- [x] Define a typed simulation contract independent of React components (`src/core/simulation/`).
- [x] Keep the repository documentation and issue backlog consistent with the actual code.

**Exit criteria:** the existing chemistry prototype has clear limitations, reviewed safety messaging, protected mutations, and a testable foundation. ✅ Achieved.

## Phase 1 — Shared learning experience (done)

- [x] Define validated lesson and learning-activity schemas (`src/learning/types.ts`).
- [x] Build subject/topic discovery (`app/explore`) and a lesson detail page (`app/learn/[slug]`).
- [x] Connect lesson objectives to a simulation (registry + `LessonDetail`).
- [x] Provide instructions, interactive controls, explanations, and a practical application.
- [x] Add a short reflection question or assessment (Apply & Reflect section).

**Exit criteria:** a user can complete one coherent learning journey without needing a separate app. Achieved.

## Phase 2 — Mathematics & Geometry

Start with one small, testable learning experience, such as interactive geometry, coordinate graphs, or practical measurement. Prioritize clarity, correctness, and connection to everyday use over quantity.

- [x] Fractions comparison simulation (`mathematics.fractions-compare`) with cross-multiplication and common denominators.

**Exit criteria:** lesson -> simulation -> practical task -> reflection works through the shared platform core. Achieved.

## Phase 3 — Physics and Biology & Earth

Add one verified simulation or visualization at a time. Every model must state its assumptions, valid ranges, units, limitations, and references where applicable.

- [x] Physics: projectile motion (`physics.projectile`) with parameters, units, assumptions, limitations, references.
- [x] Biology: CO2-O2 balance (`biology.co2-o2`).
- [x] 3D foundation: Three.js + @react-three/fiber + @react-three/drei verified with a smoke-test page at `/lab/3d`.

**Exit criteria:** both domains use the shared lesson and simulation contracts without forking the overall app architecture. Achieved.

## Phase 4 — Real-world Challenges

Create interdisciplinary activities only after the underlying subject experiences exist. Each challenge should state the real-world question, required concepts, steps, evidence/observations, constraints, and a way to explain or evaluate the solution.

**Exit criteria:** at least one challenge meaningfully uses concepts from two or more domains and links back to its learning resources.

## Defer until evidence supports it

- Full LMS, grades, classes, teacher dashboards, or social features.
- Complex user accounts and personalized learning paths.
- Microservices or separate shared-code repositories.
- Large content catalogs without review capacity.
