# Product and Technical Architecture

## Product promise

Everyday Learning Lab helps curious people understand the world by combining lessons, interactive simulations, and practical applications.

**Core loop:** Discover -> Learn -> Experiment -> Apply -> Reflect.

## Learning areas

1. **Mathematics & Geometry** — algebra, geometry, graphs, measurement, practical calculations.
2. **Chemistry** — elements, molecules, reactions, chemical phenomena.
3. **Physics** — forces, motion, electricity, light, energy.
4. **Biology & Earth** — living systems, ecology, climate, Earth science, geography.
5. **Real-world Challenges** — interdisciplinary activities grounded in everyday problems.

The list describes the intended product scope. It must not be interpreted as a statement that all modules already exist.

## Architecture approach

Start with a **modular monolith**: one Next.js application, clear internal boundaries, shared lesson/simulation contracts, and no microservices until operational needs justify them.

### Layers

1. **Experience layer:** explore, lesson, simulation, and challenge pages.
2. **Learning core:** lesson metadata, content discovery, simulation registry, activity flow, and assessment.
3. **Domain modules:** subject-specific content and scientific/math rules.
4. **Application services:** coordinate use cases and validation.
5. **Data access:** isolate persistence and storage implementation.

### Simulation definition

A simulation should be independently testable and describe:

- Stable ID, title, subject, summary, and learning objectives.
- Input parameters, defaults, units, and valid ranges.
- Typed result/output and a clear execution boundary.
- Assumptions, limitations, and expected model behavior.
- References and review status.
- Safety notes where the topic could affect real-world behavior.

A simulation is an educational model, not necessarily a complete scientific solver. UI animation must never be treated as evidence of scientific correctness.

### Content model

A lesson should have a stable ID, title, summary, subject, learning objectives, sections, prerequisites, linked simulation IDs, real-world applications, optional assessment, and references.

Use runtime schema validation at content/API boundaries. TypeScript interfaces alone do not validate external or persisted data.

### Data and deployment

The current JSON file plus in-memory fallback is prototype persistence. Before production deployment, define requirements for durability, concurrency, backups, access control, and hosting; then choose a database/provider that satisfies them. Avoid selecting infrastructure without those requirements.

### Quality gates

- Unit tests for math/scientific rules and validation.
- Integration tests for services and API routes, including denied unauthorized mutations.
- End-to-end coverage for the core learner journey.
- Lint, typecheck (if configured), tests, content validation, and production build in CI.
- Scientific references and explicit review status for factual claims.

## Implementation order

1. Review and secure existing chemistry behavior and content.
2. Add test coverage and a typed simulation contract.
3. Build a reusable lesson-to-simulation experience.
4. Add Mathematics & Geometry as the next domain.
5. Add Physics and Biology & Earth.
6. Build Real-world Challenges after the relevant domain experiences can be reused.


## Motion and 3D adoption

See [Motion and 3D learning architecture](motion-3d-architecture.md) for tool selection, scientific-model/rendering boundaries, mobile accessibility, and the phased plan supporting issues #48 and #49. The plan adds no runtime functionality and does not mark those issues complete.
