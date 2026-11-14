# AI Coding Guidelines — Everyday Learning Lab

These guidelines apply to Codex and other AI coding agents working in this repository.

## 1. Mission

Implement the approved MVP and Feature roadmap by extending the existing application. Do not assume that a requested feature is absent until the source, tests, documentation, and GitHub Issues have been inspected.

The goal is a reliable learning product—not a large volume of generated code.

## 2. Required context before coding

Before changing files:
1. Read the root `AGENTS.md` and relevant package/project instructions.
2. Read the relevant product and technical documents, including:
   - `docs/PRODUCT_ARCHITECTURE.md`
   - `docs/PROJECT_STRUCTURE.md`
   - `docs/ROADMAP.md`
   - `docs/SIMULATIONS.md`
   - the applicable content-model, simulation-contract, persistence, authentication, and review documents.
3. Inspect the target route, components, domain logic, data model, tests, and current dependencies.
4. Inspect related open and closed GitHub Issues and PRs.
5. Identify what exists, what works, what is incomplete, and what is genuinely missing.

If documentation conflicts with code or issue state, report the discrepancy and verify it. Do not silently mark work complete.

## 3. Plan before implementation

For each issue:
- restate the user problem and expected behavior,
- identify existing code to reuse,
- define the smallest complete scope,
- list dependencies and affected contracts/data,
- define acceptance criteria and tests,
- identify security, privacy, scientific, safety, accessibility, and localization implications,
- state explicit non-goals.

Ask for clarification only when a material product or technical decision cannot be resolved from repository context.

## 4. Implementation principles

### Architecture
- Preserve the modular-monolith architecture unless a documented constraint requires change.
- Follow existing folder boundaries and naming conventions.
- Reuse shared UI, content models, simulation contracts, registries, validation, repositories, and services.
- Avoid duplicate registries, parallel data models, unnecessary wrappers, and premature abstractions.
- Keep domain calculations independent from React components.
- Keep database access and secrets server-side.

### Learning experience
- Implement the full learner journey, not just a visually complete screen.
- Every interactive control must have meaningful behavior and feedback.
- Include loading, empty, error, and unsupported-feature states.
- Make essential interactions keyboard accessible and responsive.
- Respect reduced-motion preferences and provide fallbacks for WebGL/3D where practical.

### Scientific and educational integrity
- Do not invent scientific facts, formulas, or sources.
- Keep model assumptions and limitations explicit.
- Keep domain calculations deterministic and covered by tests where possible.
- Treat simulations as educational approximations unless independently validated for a stronger claim.
- Include safety notes for experiments that could be replicated physically.
- AI-generated explanations must not replace trusted model outputs.

### Security and data
- Never expose secrets, maintainer tokens, or privileged credentials to client code.
- Enforce authorization on the server, not only in UI.
- Validate untrusted inputs at boundaries.
- Consider data minimization, retention, deletion, and access control for learner data.
- Respect SQLite deployment constraints and existing migration conventions.

## 5. Git workflow

- Work on one focused issue or a tightly related issue group at a time.
- Create a dedicated branch from the current target branch.
- Do not commit directly to `main`.
- Keep changes scoped and reviewable.
- Open a pull request with issue references, summary, implementation notes, tests, risks, and known limitations.
- Do not merge unless explicitly instructed.
- The repository owner is the final reviewer.

## 6. Verification

Run the relevant checks available in the repository, such as:
- lint,
- TypeScript/typecheck,
- unit tests,
- integration/component tests,
- build,
- content-integrity validation.

Inspect the package scripts before choosing commands. Do not invent script names.

For simulation or learning logic, test:
- valid inputs,
- invalid and boundary inputs,
- deterministic outputs where expected,
- important model assumptions,
- regression cases.

For UI/API work, test:
- success behavior,
- validation failures,
- unauthorized access,
- empty and error states,
- localization and accessibility of essential paths.

If a check cannot be run, state exactly why. Never claim it passed without evidence.

## 7. Documentation and issue hygiene

- Update the relevant documentation in the same PR when behavior or architecture changes.
- Keep `docs/ROADMAP.md`, this product roadmap, TODO files, and GitHub Issues consistent.
- Search for an existing issue before creating a new one.
- Do not create duplicate issues or close issues merely because code appears to exist.
- Record acceptance evidence and remaining gaps in the PR description.
- Distinguish implemented, tested, reviewed, and released states.

## 8. Completion report

Every implementation PR should report:
1. Issue(s) addressed.
2. User-visible behavior delivered.
3. Files/modules changed.
4. Existing code reused.
5. Tests and commands run, with results.
6. Security/scientific/accessibility/localization considerations.
7. Known limitations and follow-up work.
8. Documentation and issue status changes.

A PR is ready for human review only when its scope is clear, checks are reported truthfully, and remaining risks are visible.
