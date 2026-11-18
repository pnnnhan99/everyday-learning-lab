# Periodic Table — Product Documentation

This folder defines product direction, reference research, MVP acceptance criteria, and the future roadmap for the Chemistry Periodic Table.

**Current route:** /chemistry/periodic-table  
**Current implementation and data maintenance:** [../periodic-table.md](../periodic-table.md)

## Documents

| Document | Purpose |
| --- | --- |
| [Reference website analysis](reference-analysis.md) | Learn from established periodic-table and chemistry-learning websites without copying their content or design. |
| [Product specification](product-specification.md) | Define users, learning outcomes, page experience, and functional requirements. |
| [MVP acceptance](mvp-acceptance.md) | Define a complete, reliable, accessible, bilingual MVP and how to verify it. |
| [Future roadmap](future-roadmap.md) | Prioritize post-MVP capabilities by learning value, dependencies, and complexity. |

## How to use these documents

- Product/design: read reference analysis and product specification before changing page scope or interaction patterns.
- AI agents/developers: read this index, MVP acceptance, the existing implementation note, and repository AGENTS.md before making changes.
- Reviewers: verify each acceptance item against source, tests, and running behavior. A feature described here is not proof that it is implemented.
- Content maintainers: follow source and data-quality rules in the existing implementation note.

## Product boundary

The periodic table is a dedicated educational reference and learning module. It is not the same domain as the existing /elements catalogue, which stores lab substances such as vinegar and bleach. Keep their data models, routes, and responsibilities separate.

## Status language

- **Implemented:** verified in current source and tests.
- **Needs verification:** exists or is documented, but current behavior or quality has not been confirmed.
- **Planned:** future work, not part of the current release.
- **Blocked:** requires a dependency, scientific review, content, or product decision.

Do not mark a capability complete merely because a route, component, dependency, mockup, or issue exists.
