# Everyday Learning Lab

**Learn the concept. Explore the simulation. Apply it to real life.**

Everyday Learning Lab is an interactive science-learning platform for curious learners, from children to adults. The long-term goal is to connect clear lessons, interactive 3D models, practical challenges, and short reflections so learners can explore ideas and test variables safely.

> **Status: early development.** The current application is a rule-based chemistry learning prototype. It is not a validated chemistry simulator, and its scientific content must be reviewed before being treated as authoritative. The broader learning domains are product goals, not claims that all experiences are already implemented.

## Learning areas

- **Chemistry** — elements, atoms, molecules, reactions, and chemical phenomena.
- **Physics** — forces, motion, electricity, light, and energy.
- **Biology & Biochemistry** — cells, biomolecules, living systems, and interactions.
- **Mathematics & Geometry** — measurement, graphs, geometry, and practical calculations that support scientific learning.
- **Real-world Challenges** — interdisciplinary activities grounded in everyday questions.

## Core learning loop

1. **Discover** a question or real-world phenomenon.
2. **Learn** the relevant concept with a focused explanation.
3. **Experiment** with a simulation and change its inputs.
4. **Apply** the concept to a practical situation.
5. **Reflect** with a question, prediction, or short assessment.

## Current implementation

The repository currently uses:

- Next.js App Router, React, and TypeScript.
- Tailwind CSS for styling.
- Zustand for client-side state.
- dnd-kit for drag-and-drop interactions.
- Framer Motion for interface animation.
- Three.js, React Three Fiber, and Drei dependencies for future/current 3D experiences; the presence of dependencies alone does not mean a complete 3D learning journey exists.
- A repository abstraction with SQLite persistence via `better-sqlite3` for element and reaction data.

SQLite is suitable for traditional self-hosted/VPS deployments where the database file is persistent and writable. It is not automatically suitable for serverless or multi-instance deployments without a shared persistent storage strategy. See [docs/persistence.md](docs/persistence.md).

## Getting started

### Requirements

- A Node.js version supported by the installed Next.js version.
- npm.

### Install and run

```bash
git clone https://github.com/pnnnhan99/everyday-learning-lab.git
cd everyday-learning-lab
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Useful scripts

```bash
npm run dev                 # Start the development server
npm run lint                # Run ESLint
npx tsc --noEmit            # Type-check TypeScript
npm run test:run            # Run automated tests once
npm run build               # Build the production application
npm run validate:reactions  # Validate authored reaction data
npm run validate:mutations  # Validate mutation API safeguards
npm run validate:persistence # Validate persistence behavior
npm run validate            # Run the project's validation scripts
```

## Project structure

```text
app/                  Next.js routes, layouts, and API handlers
src/components/       UI, chemistry laboratory, and shared layout
src/data/             Seed and authored example chemistry content
src/i18n/             Vietnamese/English UI dictionaries
src/lib/              Persistence, repositories, API helpers, and domain utilities
src/services/         Application services
src/store/            Zustand state stores
src/types/            Domain types and runtime validation
docs/                 Product, architecture, persistence, and science notes
scripts/              Data and persistence validation scripts
```

See [docs/PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md) for current boundaries and the intended direction, and [docs/PRODUCT_ARCHITECTURE.md](docs/PRODUCT_ARCHITECTURE.md) for the shared learning-platform architecture.

## Science, accuracy, and safety

This project is for education and software experimentation only.

- Do not use it as a substitute for a teacher, laboratory protocol, Safety Data Sheet (SDS), or professional guidance.
- Never mix household chemicals based on a simulation result. In particular, never mix bleach with vinegar, acids, ammonia, or other cleaners.
- Current reaction outcomes are authored rules, not a general-purpose chemical equation solver.
- Clearly distinguish illustrative 3D models from quantitative simulations.
- Scientific content should cite reputable sources, state assumptions and limitations, and be reviewed before it is presented as authoritative.
- If you find an inaccurate explanation or unsafe claim, open an issue with the relevant content and supporting references.

## Roadmap

1. Keep the existing chemistry prototype secure, accurate within its stated limits, and tested.
2. Establish a reusable, typed simulation contract and a client-only 3D scene foundation.
3. Build a shared lesson → simulation → application → reflection experience.
4. Deliver a first 3D learning journey in Chemistry, Physics, and Biology & Biochemistry.
5. Improve accessibility, performance, content review, and deployment readiness.
6. Expand to Mathematics & Geometry and interdisciplinary challenges through the same learning core.

Track active work in [GitHub Issues](https://github.com/pnnnhan99/everyday-learning-lab/issues). Closed issues may describe work that was planned or marked done historically; verify the current source and CI results before treating every acceptance criterion as satisfied.

## Contributing

Bug reports, scientific corrections, accessibility feedback, learning-content ideas, and code contributions are welcome.

1. Search existing issues before opening a new one.
2. Keep pull requests focused on one issue or a small, coherent change.
3. For science-related changes, include reputable references and explain assumptions.
4. Do not present unverified behavior as scientific fact.
5. Run lint, type-check, tests, relevant validation scripts, and the production build when possible.
6. Explain what changed and how it was validated in the pull request.

See [AGENTS.md](AGENTS.md) for repository-specific coding guidance.

## License

No license has been confirmed yet. Until a license is added, normal copyright restrictions apply; do not assume this code is open for reuse merely because the repository is visible.
