# Periodic Table — Product Specification

## 1. Product overview

The Periodic Table is a bilingual Chemistry learning/reference module in Everyday Learning Lab.

- Route: /chemistry/periodic-table
- Primary purpose: help learners locate elements, understand their classification and properties, and gradually discover periodic patterns.
- Languages: Vietnamese (vi) and English (en).
- Core promise: make the periodic table approachable without sacrificing scientific accuracy.

This module is not a chemical substance inventory, a reaction predictor, or a laboratory safety reference.

## 2. Product context and boundaries

The repository already contains an interactive periodic table for all 118 officially recognised elements, a dedicated periodic-element domain model and static validated dataset, bilingual search, category/group/period filters, keyboard navigation and element details. It also contains an existing /elements catalogue for lab substances such as vinegar and bleach, a Chemistry Lab, and a shared learning catalog.

Keep these boundaries:
- /chemistry/periodic-table: chemical elements and atomic/periodic properties.
- /elements: substances/materials used by existing chemistry activities.
- Chemistry lessons/simulations: explain concepts and model selected phenomena; do not duplicate the periodic-element dataset as a second source of truth.

Current implementation note: [../periodic-table.md](../periodic-table.md). Verify source and tests before claiming any feature is complete.

## 3. Target users

1. Beginner learners: need simple definitions, familiar examples, and a low cognitive load.
2. School students: need accurate names, symbols, atomic numbers, groups, periods, electron configurations, and property comparisons.
3. Self-directed learners: want to explore element stories, applications, and periodic trends.
4. Teachers/parents: need trustworthy references, clear limitations, and accessible learning prompts.

Do not assume all users have the same chemistry level. Use progressive disclosure rather than separate duplicated products.

## 4. Learning outcomes

After using the module, a learner should be able to:
- identify an element by name, symbol, or atomic number;
- explain what atomic number represents;
- locate an element's group, period, and block;
- recognize broad element families and common characteristics;
- read an electron configuration at an age-appropriate level;
- distinguish an element's standard atomic weight from the mass number of a particular isotope;
- compare selected properties and describe a simple periodic trend;
- connect selected elements to everyday materials and uses without confusing an element with a compound or product.

## 5. Experience principles

- Reference first: the table must be quick to search and scan.
- Progressive disclosure: show only essential facts until a learner opens details.
- Explain, don't just list: define scientific terms and units in accessible language.
- Bilingual parity: every learner-facing control, status, note, and authored explanation has Vietnamese and English copy.
- Evidence visible: show source links, qualifiers, and review status near scientific claims.
- Accessible by default: keyboard navigation, semantic controls, contrast, screen-reader labels, reduced motion.
- Mobile honest: preserve the 18-column structure with intentional horizontal scrolling and clear affordances.
- No false precision: unknown, estimated, predicted, disputed, isotope-dependent, and not-applicable values remain distinguishable.

## 6. Information architecture

### Main page

1. Page title and concise explanation.
2. Search field.
3. Optional filter controls: category, group, period.
4. Category legend.
5. Periodic grid in the conventional 18-column long form.
6. Lanthanide and actinide rows.
7. Result count and clear-filters action.
8. Selected-element details dialog/panel.

### Element cell

Minimum visible content:
- atomic number;
- chemical symbol;
- localized element name;
- category marker or short category code;
- atomic mass only where layout allows and with correct isotope/atomic-weight notation.

Do not rely on category color alone.

### Element details

Organize content into clear sections:
- Identity and classification: name, symbol, atomic number, group, period, block, category.
- Atomic structure: protons, electron configuration, and isotope-aware neutron explanation.
- Physical properties: standard state, melting/boiling point, density with units and conditions.
- Chemical properties: oxidation states and electronegativity where supported.
- Context: natural occurrence, common uses, discovery.
- Data quality: source references, quantity qualifiers, review status, caveats.

A field should be omitted or explicitly marked unavailable when evidence is insufficient. Do not invent values to make cards look complete.

## 7. Functional requirements

### Current MVP baseline

- Display all 118 recognised elements in the standard long-form layout.
- Search by English/Vietnamese name, symbol, and atomic number.
- Combine search with category, group, and period filters.
- Select an element and inspect its sourced details.
- Switch the full interface between Vietnamese and English.
- Support keyboard interaction and mobile scrolling.
- Validate the dataset and core interactions with automated tests.

### Product enhancements

- Property overlays and trend explanations.
- Side-by-side element comparison.
- Quiz, flashcards, and spaced recall.
- Guided lessons and contextual links to Chemistry Lab.
- Isotope explorer and temperature/state explorer.
- Carefully scoped atom/orbital visualizations.
- Optional progress tracking, saved elements, and teacher-curated activities.

These enhancements are not required for the current MVP. See [future-roadmap.md](future-roadmap.md).

## 8. Content and data requirements

The periodic element model must remain separate from the lab substance model.

For each property:
- retain numeric value at source precision where available;
- store/display the unit explicitly;
- preserve a qualifier such as measured, estimated, predicted, isotope-dependent, unknown, disputed, or not applicable;
- capture relevant pressure, temperature, phase, isotope, or other conditions;
- cite a source that supports the specific field;
- localize explanatory notes without translating chemical symbols or formulas.

Atomic weight rules:
- Use standard atomic weight only when the source supports it.
- For elements without a characteristic natural isotopic composition, show the appropriate bracketed mass number and label it as an isotope mass number, not a standard atomic weight.
- Preserve intervals/uncertainty where the data model supports them; do not silently collapse a meaningful interval into a false exact value.

Classification rules:
- Use the conventional 18-column table.
- State the adopted category definitions.
- Explain disputed boundaries and the group-3 convention in relevant element notes.
- Do not imply every authority uses identical metalloid/f-block/group-3 classifications.

## 9. Non-functional requirements

- Fast initial render; avoid loading 3D or heavy media on the base reference page.
- Responsive layout with no inaccessible hidden controls.
- Full keyboard support and visible focus.
- Screen-reader labels for element cells and selected state.
- Reduced-motion support.
- No reliance on color, hover, or drag-only interactions.
- Tests for data integrity, search/filter logic, keyboard navigation, localization parity, and rendering.
- No third-party API dependency for the basic table to render.
- No learner account required for core lookup.

## 10. Success measures

Track only metrics the current architecture can collect responsibly:
- learners can locate an element by name/symbol/atomic number;
- successful completion of the main lookup flow on desktop and mobile;
- low error rate for data rendering, search, and filters;
- completion of a short learning check when introduced;
- content correction reports and time-to-review;
- Vietnamese/English content parity.

Do not add invasive analytics or account requirements solely to measure a reference page.

## 11. Out of scope

- General-purpose chemical equation/reaction prediction.
- Chemical handling instructions or unsupervised home experiments.
- A full molecular editor or computational chemistry suite.
- A full 3D orbital/quantum-mechanics simulator.
- User-generated scientific data without moderation and review.
- Copying third-party proprietary content or visual assets.

## 12. Release definition

The module is ready for MVP release when the acceptance criteria in [mvp-acceptance.md](mvp-acceptance.md) are verified against the current implementation, all blocking scientific/data issues are resolved or clearly disclosed, and repository quality gates pass.
