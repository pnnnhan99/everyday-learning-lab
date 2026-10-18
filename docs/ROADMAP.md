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

## Phase 1 — Shared learning experience (in progress)

- Define validated lesson and learning-activity schemas.
- Build subject/topic discovery and a lesson detail page.
- Connect lesson objectives to a simulation.
- Provide instructions, interactive controls, explanations, and a practical application.
- Add a short reflection question or assessment.

**Exit criteria:** a user can complete one coherent learning journey without needing a separate app.

## Phase 2 — Mathematics & Geometry

Start with one small, testable learning experience, such as interactive geometry, coordinate graphs, or practical measurement. Prioritize clarity, correctness, and connection to everyday use over quantity.

**Exit criteria:** lesson -> simulation -> practical task -> reflection works through the shared platform core.

## Phase 3 — Physics and Biology & Earth

Add one verified simulation or visualization at a time. Every model must state its assumptions, valid ranges, units, limitations, and references where applicable.

**Exit criteria:** both domains use the shared lesson and simulation contracts without forking the overall app architecture.

## Phase 4 — Real-world Challenges

Create interdisciplinary activities only after the underlying subject experiences exist. Each challenge should state the real-world question, required concepts, steps, evidence/observations, constraints, and a way to explain or evaluate the solution.

**Exit criteria:** at least one challenge meaningfully uses concepts from two or more domains and links back to its learning resources.

## Defer until evidence supports it

- Full LMS, grades, classes, teacher dashboards, or social features.
- Complex user accounts and personalized learning paths.
- Microservices or separate shared-code repositories.
- Large content catalogs without review capacity.
