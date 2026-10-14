# Everyday Learning Lab

**Learn the concept. Explore the simulation. Apply it to real life.**

Everyday Learning Lab is an interactive learning platform for people who want to understand how the world works. It combines clear lessons, browser-based simulations, and practical challenges so learners can explore ideas, test variables, and connect scientific concepts to everyday situations.

> **Status: early development.** The current application is a rule-based chemistry learning prototype. It is not a validated chemistry simulator, and its scientific content must be reviewed before being treated as authoritative.

## Learning areas

- **Mathematics & Geometry** — algebra, geometry, graphs, measurement, and practical calculations.
- **Chemistry** — elements, molecules, reactions, and chemical phenomena.
- **Physics** — forces, motion, electricity, light, and energy.
- **Biology & Earth** — living systems, ecology, climate, Earth science, and geography.
- **Real-world Challenges** — interdisciplinary activities that use knowledge from multiple subjects to explain or solve practical problems.

These are the product's target areas, not a claim that every area is already implemented. Development should expand from the existing chemistry prototype through small, tested learning experiences.

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
- Local JSON-file persistence with in-memory fallback for current element/reaction data.

The current persistence approach is suitable only as a prototype. Local file writes and process memory are not reliable shared storage for serverless or multi-instance production deployments. See the open GitHub Issues for security, persistence, testing, scientific review, and simulation architecture work.

## Getting started

### Requirements

- A Node.js version supported by the installed Next.js version.
- npm.

### Install and run

```bash
git clone https://github.com/pnnnhan99/everyday-learning-lab.git
cd everyday-learning-lab
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

```bash
npm run dev                 # Start the local development server
npm run lint                # Run ESLint
npm run build               # Build the production application
npm run start               # Start the built application
npm run validate:reactions  # Validate reaction data
```

## Project structure

The following describes the current repository at a high level. Some folders contain prototype code and may evolve as the learning platform grows.

```text
app/                  Next.js routes, layouts, and API route handlers
  api/                Element and reaction API endpoints
  admin/              Current content-management interface
  elements/           Element catalog page
  reactions/          Reaction catalog page
  profile/            Current profile/preferences page
src/
  components/
    admin/            Admin UI components
    lab/              Chemistry lab UI and interactions
    laboratory/       Laboratory workspace components
    layout/           App shell, navigation, and global controls
  data/               Seed/example chemistry data
  i18n/               Current Vietnamese/English UI dictionaries
  lib/                Data access, fetching, and reaction lookup helpers
  services/           Element and reaction service layer
  store/              Zustand stores for lab and UI state
  types/              Shared TypeScript domain types
docs/                 Product and science documentation
scripts/              Validation and seed scripts
public/               Static assets
```

See [docs/PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md) for current boundaries and the intended direction, and [docs/PRODUCT_ARCHITECTURE.md](docs/PRODUCT_ARCHITECTURE.md) for the shared learning-platform architecture.

## Science, accuracy, and safety

This project is for education and software experimentation only.

- Do not use it as a substitute for a teacher, laboratory protocol, Safety Data Sheet (SDS), or professional guidance.
- Never mix household chemicals based on a simulation result. In particular, never mix bleach with vinegar, acids, ammonia, or other cleaners.
- Current reaction outcomes are authored rules, not a general-purpose chemical equation solver.
- Scientific content should cite reputable sources, state assumptions and limitations, and be reviewed before it is presented as authoritative.
- If you find an inaccurate explanation or unsafe claim, open an issue with the relevant content and supporting references.

## Roadmap

1. Review chemistry rules and safety claims against reliable sources.
2. Protect content mutation endpoints and define authorization boundaries.
3. Replace prototype persistence with a deployment-safe data layer when the deployment requirements are known.
4. Add automated tests and continuous integration.
5. Define a typed simulation contract independent of React components.
6. Build a reusable lesson-to-simulation learning flow.
7. Add Mathematics & Geometry, Physics, Biology & Earth, and Real-world Challenges incrementally.

Track actionable work in [GitHub Issues](https://github.com/pnnnhan99/everyday-learning-lab/issues).

## Contributing

Bug reports, scientific corrections, accessibility feedback, learning-content ideas, and code contributions are welcome.

1. Search existing issues before opening a new one.
2. Keep pull requests focused on one issue or a small, coherent change.
3. For science-related changes, include reputable references and explain assumptions.
4. Do not present unverified behavior as scientific fact.
5. Run `npm run lint`, `npm run build`, and `npm run validate:reactions` when relevant.
6. Explain what changed and how it was validated in the pull request.

See [AGENTS.md](AGENTS.md) for repository-specific coding guidance.

## License

No license has been confirmed yet. Until a license is added, normal copyright restrictions apply; do not assume this code is open for reuse merely because the repository is visible.
