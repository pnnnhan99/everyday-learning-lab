# Project Structure

This document distinguishes the **current implementation** from the **intended product architecture**. Do not create every proposed directory before a real feature needs it.

## Current repository map

```text
app/
  api/
    elements/           Element read/mutation endpoints
    reactions/         Reaction read/mutation endpoints
  admin/                Current content-management page
  elements/             Element catalog route
  reactions/            Reaction catalog route
  profile/              Current profile/preferences route
  layout.tsx             Root layout and metadata
  page.tsx               Current home route
  loading.tsx            Route loading UI
  error.tsx              Error boundary
  not-found.tsx          Not-found UI
src/
  components/
    admin/               Admin forms and controls
    lab/                 Chemistry lab cards, beaker, history, effects, data tools
    laboratory/          Drag-and-drop laboratory workspace
    layout/              App shell, header, sidebar, profile and preference controls
  data/                  Seed/example chemistry data
  i18n/                  Current Vietnamese/English dictionaries
  lib/                   Data access, fetcher, reaction lookup
  services/              Element and reaction application services
  store/                 Zustand stores for lab and UI state
  types/                 Domain types and input validation
docs/
  reaction-review.md     Chemistry reaction review notes
scripts/
  seed.ts                Seed script
  validate-reactions.mjs Reaction data validation
public/                   Static assets
```

## Intended responsibility boundaries

### `app/` — routing and HTTP boundary

- Keep route files focused on rendering pages and translating HTTP requests/responses.
- Validate request payloads at API boundaries.
- Apply authorization to every content mutation endpoint; hiding an admin page is not authorization.
- Delegate business rules to services/domain modules rather than duplicating them in route handlers.

### `src/components/` — presentation and interaction

- Keep components responsible for displaying information and collecting user interaction.
- Avoid embedding scientific truth tables or domain calculations in React components.
- Shared layout components should not depend on a particular subject's data model.

### `src/services/` and `src/lib/` — application and infrastructure logic

- Services coordinate use cases for content and simulations.
- Data access owns persistence details.
- Do not let pages/components directly depend on JSON file layout or database implementation.
- Replace the current JSON/in-memory persistence when the target hosting and durability requirements are known.

### `src/types/` — explicit contracts

- Keep domain types and runtime validation aligned.
- Avoid claiming a payload is valid based on TypeScript types alone; runtime input must be validated.
- Simulation contracts should include input/output, units, valid ranges, assumptions, limitations, references, and safety metadata where applicable.

### `src/data/` — seed and authored content

- Treat current chemistry records as prototype content until reviewed.
- Prefer content data separate from presentation code.
- Keep references and review status with scientific claims.

## Target domain modules

Add these boundaries incrementally as features are implemented; do not scaffold empty folders just to match the diagram.

- `mathematics/`: algebra, geometry, graphs, measurement, practical calculations.
- `chemistry/`: elements, reactions, chemical concepts, and the existing lab.
- `physics/`: force, motion, electricity, light, and energy.
- `biology-earth/`: living systems, ecology, climate, Earth science, and geography.
- `real-world-challenges/`: interdisciplinary scenarios that connect concepts from multiple subjects.

Each domain should provide content and simulation definitions through shared contracts. The shared learning experience should not need subject-specific branching for every new lesson.

## Target shared learning core

The platform may grow toward the following logical components:

- **Lesson model:** title, summary, objectives, sections, prerequisites, and references.
- **Simulation contract:** metadata, input schema, output schema, execution function, assumptions, limits, and safety/review status.
- **Learning activity:** links a lesson to one or more simulations and a real-world application.
- **Assessment:** questions, expected answers or rubrics, and explanations.
- **Content registry:** discoverable lessons and simulations with stable IDs and subject tags.

Keep the implementation small. Introduce abstractions only when at least one concrete feature uses them and tests demonstrate their value.

## Dependency direction

Prefer this direction:

```text
app routes -> application services -> domain contracts/rules -> data-access interface
React components -> application services/contracts (through focused hooks or props)
data adapters -> persistence provider
```

Scientific rules should be testable without rendering React or starting a browser. Domain modules must not import from route files or presentation components.

## Validation expectations

For meaningful changes, run:

- `npm run lint`
- `npm run build`
- `npm run validate:reactions` for chemistry content/rule changes

Add automated tests for scientific calculations, input validation, safety metadata, service behavior, and key user journeys as the test infrastructure is introduced.

## Non-goals for the current phase

- Do not introduce microservices.
- Do not create a separate repository or package for shared code without demonstrated reuse.
- Do not implement accounts, LMS features, or a complex database before product requirements justify them.
- Do not present a prototype reaction rule as experimentally validated chemistry.
