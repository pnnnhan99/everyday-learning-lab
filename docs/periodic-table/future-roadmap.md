# Periodic Table — Future Feature Roadmap

This roadmap starts after the current reference-table MVP is verified. It is a product direction, not a promise that every feature will be delivered. Reprioritize using learner feedback, scientific review capacity, and the shared learning architecture.

## Prioritization principles

1. Improve understanding before adding visual complexity.
2. Reuse the current periodic-element dataset as the source of truth.
3. Reuse shared learning-content and simulation contracts where appropriate; do not create a competing framework.
4. Keep scientific calculations testable outside React components.
5. Every scientific visualization must state its model assumptions and limitations.
6. Keep basic lookup fast and usable without accounts, 3D, or external APIs.
7. Deliver one coherent vertical slice at a time.

## Phase 0 — MVP verification and stabilization

**Goal:** make the existing periodic table trustworthy and release-ready.

- Complete [mvp-acceptance.md](mvp-acceptance.md).
- Resolve critical data, localization, accessibility, responsive, and test gaps.
- Confirm navigation/discovery integration.
- Keep sources, review statuses, and dataset maintenance documentation current.
- Capture representative desktop/mobile screenshots for regression review.

**Exit:** MVP checklist has evidence for all critical items; known limitations are visible; repository quality gates pass.

## Phase 1 — Property trends and explanations

**Goal:** help learners see recurring patterns across periods and groups.

Candidate features:
- Switch table display to selected properties: atomic radius, electronegativity, first ionization energy, density, melting point, and boiling point where data is meaningful.
- Use a consistent legend and unit-aware scale.
- Mark unavailable/predicted/disputed values distinctly; do not map missing values to zero.
- Add a short explanation of what the selected property means.
- Explain broad trends across a period and down a group, including exceptions.
- Add guided prompts such as “What changes as you move from left to right?”

Requirements:
- Property metadata includes unit, source, conditions, qualifier, and display transform.
- Comparisons use compatible units and conditions.
- Avoid implying a smooth trend where data is missing or scientifically irregular.
- Add tests for scale boundaries, missing values, and trend explanation claims.

**Exit:** a learner can choose a property, interpret the legend, identify a pattern, and explain one trend with evidence.

## Phase 2 — Element comparison and contextual learning

**Goal:** turn lookup into reasoning.

Candidate features:
- Compare two to four elements side by side.
- Highlight similarities/differences for selected properties.
- Explain group/period relationships.
- Add “Where might I encounter this?” context and reviewed everyday examples.
- Link elements to existing Chemistry lessons, reactions, and lab-substance records where a real relationship exists.
- Add curated learning paths such as “Meet the alkali metals” or “Elements in the human body.”

Requirements:
- No automatic relationship based solely on matching words.
- Distinguish pure elements from compounds, alloys, and materials containing an element.
- All contextual claims need sources and age-appropriate language.
- Do not imply a dangerous pure element is safe because it occurs in a familiar compound.

**Exit:** learners can compare selected elements and follow a meaningful path into a related Chemistry concept.

## Phase 3 — Quiz, flashcards, and retrieval practice

**Goal:** help learners remember names, symbols, positions, and families.

Candidate features:
- Symbol-to-name and name-to-symbol quizzes.
- Find an element by atomic number or position.
- Identify group/family from a clue.
- Timed mode as optional, never the only mode.
- Flashcards with answer reveal and self-rating.
- Spaced-repetition scheduling after basic quiz quality is proven.
- Local progress first; account synchronization only when platform requirements justify it.

Requirements:
- Questions come from validated data and reviewed authored prompts.
- Wrong answers explain the correction.
- Provide non-timed and accessible modes.
- Avoid scoring that penalizes assistive technology or slower learners.
- Do not expose answer state before submission.

**Exit:** quiz content is accurate, localized, accessible, and has tests for question generation and scoring.

## Phase 4 — Isotopes and atomic structure

**Goal:** explain that elements can have multiple isotopes and atomic structure is more than a static symbol.

Candidate features:
- Isotope list with mass number, abundance where known, and stability/half-life context where appropriate.
- Explain protons, neutrons, and electrons.
- Show how isotope identity changes neutron count while atomic number remains constant.
- A simplified shell diagram for selected elements.
- Optional orbital/electron-configuration exploration for advanced learners.

Requirements:
- Isotope values require isotope-specific authoritative sources.
- Do not infer a single neutron count from standard atomic weight.
- Distinguish Bohr-style shells from quantum-mechanical orbitals.
- Do not present shell diagrams as literal electron paths.
- Radioactivity content needs careful safety and health-context review.

**Exit:** learners can explain isotope identity correctly and understand the limits of the chosen atom model.

## Phase 5 — Temperature and state exploration

**Goal:** explore how physical state varies with temperature and pressure.

Candidate features:
- Temperature slider for elements with meaningful phase data.
- Show solid/liquid/gas state at selected temperature and stated pressure.
- Explain melting and boiling points.
- Show missing, predicted, or pressure-dependent data honestly.

Requirements:
- Include pressure and phase assumptions.
- Do not imply all substances behave as simple pure elements.
- Handle sublimation and exceptional cases correctly.
- Use data with clear provenance and tests around boundary temperatures.

**Exit:** learners can explain state changes for selected elements under stated conditions.

## Phase 6 — 2D/3D visual learning

**Goal:** add visualization only where it improves understanding.

Candidate features:
- Lightweight 2D atom diagrams.
- Selectable electron shells/configuration views.
- 3D atom/element visualizations for a small curated set.
- Links from an element to a related molecule or compound visualization when the relationship is reviewed.

Requirements:
- Follow the repository's shared 3D foundation and simulation contract (see issues #48 and #49); do not add a parallel renderer architecture.
- Lazy-load client-only 3D.
- Provide static/2D fallback, keyboard/touch alternatives, reduced motion, and WebGL-unavailable states.
- Keep model calculations and data separate from rendering.
- State that orbital and atom graphics are simplified representations; no unsupported claim of predictive accuracy.
- Do not build a 3D model for all 118 elements as the first step.

**Exit:** one learning objective is demonstrably better served by visualization, with model logic and limitations reviewed.

## Phase 7 — Teacher and classroom features

**Goal:** support structured learning after individual learner value is established.

Candidate features:
- Teacher-curated element sets and learning paths.
- Printable reference sheets and classroom activity cards.
- Assignable quizzes and group challenges.
- Progress summaries, only with privacy-conscious account design.
- Content review and correction workflow.

Requirements:
- Define roles, privacy, retention, and consent before collecting learner data.
- Do not expose student progress publicly by default.
- Provide export/accessibility alternatives.

**Exit:** a teacher can create or assign a focused activity without admin-level access to scientific source data.

## Backlog prioritization

| Feature | Learning value | Complexity | Suggested phase |
| --- | --- | --- | --- |
| Property trend overlays | High | Medium | 1 |
| Two-to-four element comparison | High | Medium | 2 |
| Everyday-use context and lesson links | High | Low–medium | 2 |
| Symbol/name/position quiz | High | Low–medium | 3 |
| Flashcards and spaced repetition | High | Medium | 3 |
| Isotope explorer | Medium–high | High | 4 |
| Temperature/state explorer | Medium | Medium–high | 5 |
| 2D/3D atom explorer | Medium–high | High | 6 |
| Teacher-curated activities | Medium | High | 7 |

## Explicit non-goals until justified

- A full quantum chemistry or orbital solver.
- A general chemical reaction predictor.
- A chemical database that duplicates PubChem.
- Mandatory login to use the periodic table.
- User-submitted edits to scientific facts without review.
- A full 3D model of all elements before a small learning-focused prototype is validated.
- Copying third-party proprietary artwork, photos, videos, or editorial content.
