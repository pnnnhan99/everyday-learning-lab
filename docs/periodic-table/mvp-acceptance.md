# Periodic Table — MVP Acceptance Checklist

This checklist is the release gate for the current periodic-table module. It is verification-oriented because the route and core experience already exist in the repository.

**Route:** /chemistry/periodic-table  
**Implementation reference:** [../periodic-table.md](../periodic-table.md)

## 1. Status legend

Use these statuses during an implementation audit:
- PASS: verified in current source, automated tests, and running behavior where applicable.
- PARTIAL: implemented but has a known gap.
- FAIL: missing, incorrect, or broken.
- NOT VERIFIED: documentation or code suggests it exists, but it has not been tested.
- BLOCKED: requires scientific/content review or an external dependency.

Do not pre-check items based only on documentation. Record evidence: source path, test name, screenshot, or reproduction steps.

## 2. Product and navigation

- [ ] Page is reachable from an appropriate Chemistry navigation/discovery entry, not only by manually entering the URL.
- [ ] Page title and description clearly identify the periodic table.
- [ ] The page explains its purpose to a first-time learner.
- [ ] Existing /elements substance catalogue remains unchanged in purpose and behavior.
- [ ] Periodic-table data and lab-substance data remain separate.
- [ ] Back/close behavior returns learners to a sensible context.

## 3. Periodic table and dataset

- [ ] Exactly 118 officially recognised elements are present.
- [ ] Atomic numbers are unique and cover 1–118 with no gaps.
- [ ] Symbols are unique and match the atomic numbers.
- [ ] Every element has required Vietnamese and English names.
- [ ] The 18-column long-form positions match period/group conventions documented by the project.
- [ ] Lanthanides and actinides appear in distinct rows with clear connectors/placeholders.
- [ ] Group 3, f-block, metalloid/category conventions are documented where ambiguous.
- [ ] Missing, estimated, predicted, disputed, isotope-dependent, and not-applicable values are distinguishable.
- [ ] Atomic mass display never labels a longest-lived isotope mass number as standard atomic weight.
- [ ] Physical property values include correct units and relevant conditions.
- [ ] No invented or silently substituted scientific values are present.
- [ ] Every element's references resolve to a maintained source registry entry.

## 4. Search, filters, and details

- [ ] Search matches Vietnamese name, English name, symbol, and atomic number.
- [ ] Search is case-insensitive and handles whitespace consistently.
- [ ] Search results combine correctly with category, group, and period filters.
- [ ] Category legend can be used as a filter and is understandable without color.
- [ ] Clear/reset filters returns the complete table.
- [ ] Selecting an element opens its details without losing table context.
- [ ] Details present identity, classification, atomic structure, supported physical/chemical properties, applications, discovery/context, sources, and data notes.
- [ ] Unsupported fields are omitted or explicitly marked; no placeholder values masquerade as facts.
- [ ] Empty search/filter results have a helpful localized state.

## 5. Localization

- [ ] All page copy is available in Vietnamese and English.
- [ ] Element names and authored explanatory content are localized.
- [ ] Filters, category labels, dialog labels, units/qualifiers, data notes, empty states, and accessibility labels are localized.
- [ ] Language switching updates the whole periodic-table experience without stale mixed-language content.
- [ ] Scientific symbols, formulas, units, and source titles remain technically correct.
- [ ] Tests verify required localization parity and prevent missing keys.

## 6. Accessibility and responsive behavior

- [ ] Every element cell is keyboard reachable using documented roving-tabindex behavior.
- [ ] Arrow keys, Home, End, Enter, and Space work consistently.
- [ ] Dialog has an accessible name, modal semantics, focus management, Escape behavior, and focus restoration.
- [ ] Visible focus indicators and sufficient contrast are present.
- [ ] Screen readers can identify each element and the filtered result count.
- [ ] Category is not communicated by color alone.
- [ ] Reduced-motion preferences are respected.
- [ ] Mobile layout preserves meaningful table positions and communicates horizontal scrolling.
- [ ] At 320/360/390 px widths, search, filters, details, and close controls remain usable.
- [ ] Touch targets and dialog scrolling work on mobile.

## 7. Scientific quality and safety

- [ ] Data source is recorded for each material claim or field group.
- [ ] Data qualifiers and conditions are visible where needed.
- [ ] The project distinguishes source-checked data from independently expert-reviewed content.
- [ ] Unreviewed or predicted data is not presented as authoritative.
- [ ] Explanations distinguish elements from compounds and mixtures.
- [ ] Any everyday application is accurate and does not imply pure elements behave identically to materials/compounds containing them.
- [ ] No instructions encourage learners to handle hazardous substances.
- [ ] Visual atom models, if present, are labeled as simplified representations and state their limits.

## 8. Engineering quality

- [ ] Periodic-element domain types remain independent of the /elements substance type.
- [ ] Runtime validation checks the full dataset.
- [ ] Automated tests cover uniqueness, positions, classifications, qualifiers, and references.
- [ ] Automated tests cover search, combined filters, selection, and keyboard navigation.
- [ ] Localization tests cover all learner-facing content.
- [ ] UI tests cover dialog, empty state, and responsive behavior where practical.
- [ ] No avoidable new dependency is added.
- [ ] No 3D or heavy media is loaded for the basic lookup experience.
- [ ] No console errors, React key warnings, or hydration issues occur.

## 9. Repository quality gates

Run scripts that exist in the current repository; confirm their current definitions before changing them.

- npm run lint
- npx tsc --noEmit
- npm run test:run
- npm run validate
- npm run build

If one command is not configured or cannot run in the environment, record the exact reason. Do not report it as passed.

## 10. MVP release decision

A release can be considered ready when:
- all critical dataset and scientific integrity checks pass;
- core search, filters, selection, and bilingual behavior pass;
- accessibility and mobile blockers are resolved;
- the existing substance catalogue and Chemistry Lab are not regressed;
- required repository checks pass;
- remaining limitations are visible and documented.

## 11. Audit record template

| Area | Status | Evidence (path/test/screenshot) | Gap / follow-up issue |
| --- | --- | --- | --- |
| Navigation and page purpose | NOT VERIFIED | | |
| 118-element dataset | NOT VERIFIED | | |
| Search and filters | NOT VERIFIED | | |
| Element details and sources | NOT VERIFIED | | |
| Vietnamese/English parity | NOT VERIFIED | | |
| Keyboard and screen reader | NOT VERIFIED | | |
| Mobile/responsive | NOT VERIFIED | | |
| Scientific review and caveats | NOT VERIFIED | | |
| Automated tests and build | NOT VERIFIED | | |
