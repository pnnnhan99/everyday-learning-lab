# Everyday Science Sim

An early educational prototype with simplified, authored reaction rules. It is not a validated
chemistry simulator or a general-purpose chemical equation solver.

## Science and safety

- Do not use this simulation as instructions for real-world experiments or chemical handling.
- Never mix household chemicals based on a simulation result. Never mix bleach with vinegar, acids,
  ammonia, or other cleaners.
- A missing reaction result does not mean a combination is safe.
- Published reaction entries include review status, assumptions, safety guidance, and references;
  the app checks these fields when loading its reaction data.
- Review decisions and sources are recorded in [docs/reaction-review.md](docs/reaction-review.md).

## Development

Install dependencies with `npm install`, then run `npm run dev`. Check changes with `npm run lint`,
`npm run validate:reactions`, and `npm run build`.

The app uses Next.js, React, TypeScript, Tailwind CSS, Zustand, dnd-kit, and Framer Motion.
