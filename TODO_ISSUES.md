# TODO_ISSUES — Everyday Learning Lab

Status: **Reconciled** — audited against the source tree on `main` (commit `85de903`).

The canonical backlog lives on GitHub: <https://github.com/pnnnhan99/everyday-learning-lab/issues>

## What is implemented (verified)

### Routes (from `npm run build` output)

| Route        | Type     | Notes                                           |
|--------------|----------|-------------------------------------------------|
| `/`          | static   | Chemistry lab (`Laboratory` component)          |
| `/elements`  | static   | Element catalog backed by `GET /api/elements` |
| `/reactions` | static   | Reaction catalog backed by `GET /api/reactions` |
| `/admin`     | client   | Maintainer auth + CRUD forms                    |
| `/profile`   | client   | Local favorites & history (browser only)       |
| `/api/elements`        | dynamic | `GET` (public), `POST` (auth)             |
| `/api/elements/[id]`   | dynamic | `GET` (public), `PUT`/`DELETE` (auth)     |
| `/api/reactions`       | dynamic | `GET` (public), `POST`/`DELETE` (auth)    |
| `/manifest.webmanifest`| static  | App metadata                                    |
| `/sitemap.xml`         | static  | Sitemap                                         |
| `/_not-found`          | static  | 404 page                                        |

### Data & API layer

- `src/data/mockReactions.ts` — 4 elements and 2 reviewed reactions with safety metadata
- `src/lib/db.ts` — JSON-file persistence with in-memory fallback, element/reaction CRUD
- `src/lib/fetcher.ts` — typed fetcher with auth header support
- `src/lib/reactionLookup.ts` — async lookup (cache → API → local fallback)
- `src/services/elements.ts`, `src/services/reactions.ts` — data service layer
- `app/api/**` — REST endpoints for elements and reactions
- `scripts/seed.ts` — deterministic seed script
- `scripts/validate-reactions.mjs` — validates published reaction safety metadata
- `scripts/validate-mutations.mjs` — validates auth guard and input rejection

### Types & validation

- `src/types/game.ts` — `Element`, `Reaction`, `EffectType`, `ReactionReviewStatus`, `ScientificReference` types
- `validateElement` / `validateReaction` — runtime input validation with safety metadata enforcement
- `validatePublishedReactions` — rejects published reactions missing review/safety metadata

### Interactive state & UI

- `src/store/labStore.ts` — Zustand store for lab state (elements, reactions, selected, history, favorites, query, pagination)
- `src/store/useGameStore.ts` — Zustand store for DnD laboratory workspace
- `src/store/uiStore.ts` — Zustand store for UI state (theme, sidebar, language)
- `src/components/laboratory/WorkspaceDropzone.tsx` — drag-and-drop lab with simulated safety warnings
- `src/components/lab/*` — Beaker, ElementCard, ReactionEffect, DataTools, HistoryPanel, LabBoard
- `src/components/admin/AdminForms.tsx` — CRUD forms for elements and reactions

### Layout & navigation

- `src/components/layout/AppShell.tsx`, `Header.tsx`, `Sidebar.tsx` — responsive app shell
- `app/layout.tsx` — root layout with metadata and theme support
- `app/loading.tsx`, `app/error.tsx`, `app/not-found.tsx` — loading, error, and 404 states
- `src/components/layout/LanguageToggle.tsx` — Vietnamese / English toggle (`src/i18n/dict.ts`)
- `src/components/layout/ThemeToggle.tsx` — light / dark theme toggle (persisted)

### Security & safety

- All `POST`/`PUT`/`DELETE` endpoints require `Authorization: Bearer <MAINTAINER_TOKEN>`
- `MAINTAINER_TOKEN` verified with timing-safe comparison; fail-safe deny when unset
- Duplicate normalized element pairs rejected; referenced element IDs validated on creation
- Reaction safety metadata (review status, assumptions, safety guidance, references) enforced
- `docs/reaction-review.md` documents chemistry claim reviews and sources
- `docs/auth.md` documents the authorization model

## Outstanding work (tracked in GitHub Issues)

| Item | Issue |
|------|-------|
| Reconcile `app/layout.tsx` title metadata ("Everyday Science Sim" → "Everyday Learning Lab") | #31 |
| Replace legacy emoji element icons with Lucide icon keys in seed data | #33 / #34 / #35 / #36 |
| Replace JSON-file persistence with deployment-safe data layer | #28 |
| Add automated test framework, unit tests, and CI | #29 |
| Define typed simulation contract independent of React | #30 |
| Define shared learning-content model and domain taxonomy | #32 |
| Build Learn → Simulate → Apply → Reflect experience | #33 |
| Add Mathematics & Geometry domain | #34 |
| Add Physics domain | #35 |
| Add Biology & Earth domain | #36 |
| Build Real-world Challenges | #37 |
| Create unified Explore experience for all five domains | #38 |
