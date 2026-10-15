<img width="512" height="512" alt="everyday-science-sim" src="https://github.com/user-attachments/assets/2cff2a1b-35d2-46a9-99f7-66f0412aa292" />

# Everyday Science Sim

An interactive, browser-based science learning project that starts with a virtual chemistry lab. Explore how everyday substances are represented, combine selected elements, and learn from reaction outcomes and safety notes.

> **Status: early development.** The current app is a rule-based learning prototype, not a validated chemistry simulator. Reaction content and safety claims need scientific review before being treated as authoritative.

## Why this project?

Everyday Science Sim aims to make science easier to explore through small, understandable experiments. The long-term direction is to build an extensible collection of interactive science simulations, starting with chemistry and potentially expanding into physics and biology.

The guiding principles are:

- **Science before spectacle:** explanations should be evidence-based, sourced, and clear about uncertainty.
- **Safety by design:** hazardous combinations should be clearly marked; the app must never encourage real-world experimentation with dangerous substances.
- **Learn by interacting:** make it easy to explore inputs, outcomes, and explanations.
- **Small, reusable foundations:** keep simulation rules independent from UI code so new experiments can be added and tested.
- **Open development:** document limitations, track work in GitHub Issues, and welcome constructive feedback.

## Current features

The current codebase includes:

- An interactive chemistry-lab interface for selecting and combining elements.
- Rule-based reaction lookup and result presentation.
- Safety-oriented reaction warnings and reaction history/undo flows.
- Element and reaction data APIs, plus element/reaction management UI.
- Search, filtering, pagination, favorites, and interface preferences.
- A Next.js App Router application built with TypeScript, React, Tailwind CSS, Zustand, dnd-kit, and Framer Motion.

These features describe the current implementation, not a claim that every reaction is chemically complete or scientifically verified. See [open issues](https://github.com/pnnnhan99/everyday-science-sim/issues) for known quality, security, testing, and architecture work.
## API Security

The project implements server-side authorization for all mutation endpoints (POST, PUT, DELETE) to protect scientific content from unauthorized modification.

### Local Development
In development mode (`NODE_ENV !== 'production'`), authorization is bypassed for convenience. This allows unrestricted access to the API for testing and development purposes.

**Warning:** This bypass is **not secure** and should never be used in production.

### Production Deployment
In production (`NODE_ENV === 'production'`), the following environment variable must be set:

- `API_ADMIN_KEY`: A secret key used for authorization

Clients must include this key in the `X-Admin-Key` header for all mutation requests:
```
X-Admin-Key: your-secret-key-here
```

### Endpoint Security
- **GET endpoints** (reading elements/reactions): Publicly accessible, no authorization required
- **POST/PUT/DELETE endpoints** (creating/updating/deleting elements/reactions): Requires valid admin authorization

### Validation
All mutation endpoints validate:
- Input data structure and types
- Referential integrity (elements must exist for reactions)
- No duplicate reactions (normalized pair uniqueness)
- Proper enum values and constraints
## Getting started

### Requirements

- Node.js compatible with the installed Next.js version.
- npm (the repository includes package-lock.json).

### Install and run

~~~bash
git clone https://github.com/pnnnhan99/everyday-science-sim.git
cd everyday-science-sim
npm install
npm run dev
~~~

Open [http://localhost:3000](http://localhost:3000).

### Available scripts

~~~bash
npm run dev    # Start the local development server
npm run lint   # Run ESLint
npm run build  # Build the production application
npm run start  # Start the built application
~~~

Automated test coverage and continuous integration are planned work; check the GitHub Issues before relying on the project in production.

## How the project is organized

- app/ — Next.js routes, layouts, and API route handlers.
- src/components/ — lab, layout, and admin UI.
- src/data/ — initial/example reaction data.
- src/lib/ and src/services/ — data access and application helpers.
- src/store/ — client-side lab state.
- src/types/ — shared TypeScript domain types.
- scripts/ — project maintenance and seed scripts.

The intended direction is to separate simulation definitions and scientific rules from the React interface. Shared utilities should only move into a package when there is a real reuse case; the project should not become tightly coupled to another app or a monorepo's internal source paths.

## Scientific accuracy and safety

This project is for education and software experimentation only.

- Do not use it as a substitute for a teacher, lab protocol, Safety Data Sheet (SDS), or professional guidance.
- Never mix household chemicals based on a simulation result. In particular, **never mix bleach with vinegar, acids, ammonia, or other cleaners**; dangerous gases or reactions may result.
- Reaction outcomes in the prototype are authored rules, not a general-purpose chemical equation solver.
- Scientific claims should be reviewed against reputable sources and include references, assumptions, and appropriate safety notes.
- If you spot an inaccurate explanation or unsafe claim, please open an issue with the relevant reaction and supporting sources.

## Roadmap

The near-term priorities are:

1. Review reaction rules and safety language against reliable scientific sources.
2. Secure all mutation endpoints and clarify the trust boundary around administration.
3. Make persistence reliable for the intended deployment environment.
4. Add automated tests and CI checks.
5. Define a typed simulation contract that allows new experiments without coupling scientific logic to UI components.
6. Improve contribution documentation and prepare a stable public demo.

GitHub Issues are the source of truth for actionable tasks: [browse issues](https://github.com/pnnnhan99/everyday-science-sim/issues).

## Contributing

Ideas, bug reports, scientific corrections, accessibility feedback, and code contributions are welcome.

Before opening a pull request:

1. Search existing issues to avoid duplicates.
2. For science-related changes, include reputable references and explain the assumptions.
3. Keep changes focused and avoid presenting unverified behavior as scientific fact.
4. Run npm run lint and npm run build.
5. Describe what changed and how it was validated.

Please open an issue first for large changes or architectural proposals.

## License

No license has been confirmed in this repository yet. Until a license is added, assume that normal copyright restrictions apply; do not assume the code is open for reuse merely because the repository is public.
