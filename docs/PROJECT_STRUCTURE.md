# Project Structure

This document distinguishes the current implementation from the intended product architecture. Add boundaries incrementally; do not create empty directories just to match a diagram.

## Current repository map

```text
app/
  api/                  Element and reaction read/mutation endpoints
  admin/                Content-management page
  elements/             Element catalog
  reactions/            Reaction catalog
  profile/              Profile/preferences page
  layout.tsx             Root layout and metadata
  page.tsx               Current chemistry laboratory entry point
src/
  components/
    admin/               Admin UI
    lab/                 Chemistry lab components
    laboratory/          Drag-and-drop chemistry workspace
    layout/              App shell and navigation
  data/                  Seed/example chemistry data
  i18n/                  Vietnamese/English UI dictionaries
  lib/                   Repository, SQLite, API and domain utilities
  services/              Element and reaction application services
  store/                 Zustand state stores
  types/                 Domain types and runtime validation
docs/                     Product, architecture, persistence, science notes
scripts/                  Data and persistence validation
```

## Confirmed implementation notes

- The chemistry laboratory uses drag-and-drop interactions and Zustand state.
- Element and reaction routes use server-side validation; mutation routes use a maintainer-token guard.
- Element and reaction persistence is abstracted behind repository interfaces and currently uses SQLite via `better-sqlite3`. See [persistence.md](persistence.md).
- `three`, `@react-three/fiber`, and `@react-three/drei` are declared dependencies. Audit actual usage before introducing new 3D infrastructure.

These notes describe source observed during a documentation audit. They do not guarantee the project currently passes lint, tests, validation, or production build.

## Responsibility boundaries

### `app/` — routing and HTTP boundary

- Keep route files focused on rendering pages and translating HTTP requests/responses.
- Validate request payloads at API boundaries.
- Apply authorization to every content mutation endpoint; hiding an admin page alone is not authorization.
- Delegate business rules to services/domain modules rather than duplicating them in route handlers.

### `src/components/` — presentation and interaction

- Display information and collect user interaction.
- Avoid embedding scientific rules or calculations in React components.
- Keep shared layout components independent of subject-specific data models.

### `src/services/` and `src/lib/` — application and infrastructure logic

- Services coordinate use cases.
- Data access owns persistence details.
- Keep scientific logic testable without rendering React or starting Next.js.

### `src/types/` — explicit contracts

- Keep domain types and runtime validation aligned.
- TypeScript interfaces alone do not validate external or persisted data.
- Simulation contracts should include input/output, units, valid ranges, assumptions, limitations, references, review status, and safety metadata where applicable.

### `src/data/` — seed and authored content

- Treat chemistry rules as authored educational rules, not a general-purpose reaction solver.
- Keep references, assumptions, and review status with scientific claims.
- Do not present unreviewed content as authoritative.

## Intended learning architecture

Start with a modular monolith:

```text
Experience routes
  -> shared learning core (lessons, activities, assessments, registry)
  -> domain models (Chemistry, Physics, Biology & Biochemistry)
  -> typed simulation contract
  -> repository/data-access interfaces
```

A shared lesson should connect objectives and explanation to one or more simulations, a real-world application, and a short reflection. A simulation must be testable independently of its renderer. A 3D scene is a visualization, not evidence that its underlying science is correct.

## Validation expectations

For meaningful changes, run:

- `npm run lint`
- `npx tsc --noEmit`
- `npm run test:run`
- `npm run validate`
- `npm run build`

Add automated tests for scientific calculations, input validation, authorization, service behavior, and key learner journeys. Record commands and outcomes rather than assuming they passed.

## Non-goals for the current phase

- Do not introduce microservices.
- Do not create a separate repository or package for shared code without demonstrated reuse.
- Do not implement accounts, LMS features, or complex infrastructure before requirements justify them.
- Do not present a prototype model as experimentally validated science.
