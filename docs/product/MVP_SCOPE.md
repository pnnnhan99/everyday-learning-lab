# Everyday Learning Lab — MVP Scope

> A release-oriented scope definition. The repository may already implement parts of this scope; audit before creating new work.

## 1. MVP outcome

A learner can complete at least one coherent learning journey in each initial domain:

**Discover → Learn → Experiment → Apply → Reflect**

The MVP is successful when the journey is understandable, usable, scientifically responsible, and reliable—not when the application contains the largest possible number of lessons or simulations.

## 2. In-scope capabilities

### 2.1 Discovery and navigation
- Home page communicates the product promise and provides clear entry points.
- Explore supports browsing by domain/topic and discovering available learning journeys.
- Lesson and simulation links are valid and navigable.
- Empty and unavailable states explain what the learner can do next.

### 2.2 Learning content
- A lesson has a clear objective, explanation, key concepts, and practical context.
- Lesson content links to the relevant simulation where one exists.
- Content has a defined intended learner level.
- Content integrity validation prevents broken references and invalid structures.

### 2.3 Interactive experiments
- Existing simulation registry and shared contracts are the canonical integration path.
- Each MVP journey exposes meaningful inputs, outputs, and explanations.
- Input validation prevents invalid or unsafe parameter combinations.
- Simulation calculations are testable independently of UI components.
- A 3D view is used only when it improves understanding; a 2D or textual fallback is provided where feasible.

### 2.4 Application and reflection
- Each complete journey includes a practical question, scenario, or challenge.
- Self-check/quiz feedback explains why an answer is correct or incorrect.
- Learners can retry without losing the learning context.
- Results do not imply persistent learner history unless persistence is actually implemented and verified.

### 2.5 Platform readiness
- Vietnamese and English UI coverage for the MVP's primary learner paths.
- Responsive behavior for common desktop, tablet, and mobile layouts.
- Keyboard operation and accessible labels for essential controls.
- Loading, empty, error, and unsupported-browser/WebGL states.
- Protected admin or mutation operations; no privileged token exposed to the client.
- Database initialization/migrations and backup/restore guidance appropriate to the deployment target.
- CI runs the project's relevant lint, typecheck, test, and build checks.

## 3. Recommended first-party learning journeys

Use existing content and simulations as the starting point; do not create duplicate examples without an audit.

| Domain | Existing starting point | Journey completion focus |
|---|---|---|
| Mathematics | Fractions comparison | Explain → compare/change values → interpret result → solve a practical question → self-check |
| Chemistry | Acid/base and CO2 example | Understand the model → manipulate permitted inputs → inspect result → explain limits and safety → self-check |
| Physics | Projectile motion | Identify variables → change parameters → observe trajectory → connect to a real situation → self-check |
| Biology | CO2/O2 model | Understand the simplified system → explore changes → interpret relationships → discuss assumptions → self-check |

The table identifies candidates, not verified release-ready journeys. Confirm content accuracy, UX, accessibility, and tests before marking each journey accepted.

## 4. MVP non-goals

Do not make these prerequisites for the first release:
- full learner account and multi-device identity system,
- adaptive/personalized learning engine,
- AI tutor or AI-generated curriculum,
- teacher/classroom and school administration,
- public content marketplace or community submissions,
- leaderboard, social feed, or complex gamification,
- paid subscriptions or billing,
- microservices or distributed event infrastructure,
- advanced physics engine unless a specific MVP learning outcome requires it.

Existing partial implementations may remain, but they should not expand MVP scope without a clear release need.

## 5. Release gates

### Product gates
- At least one accepted end-to-end journey per initial domain.
- The core loop is discoverable without developer guidance.
- Lesson-to-simulation-to-application navigation is coherent.
- Learner-facing wording is understandable and localized for supported languages.

### Engineering gates
- Unit tests cover domain calculations and validation.
- Integration tests cover important API/persistence behavior.
- Critical learner flows have component or end-to-end coverage where the current test stack supports it.
- CI passes; known failures are documented and explicitly accepted.
- No known critical security issue or exposed secret.
- Error and fallback states are usable.

### Learning quality gates
- Objectives and intended learner level are explicit.
- Scientific sources, assumptions, and limitations are recorded.
- Safety guidance exists for experiments that could be misunderstood or replicated physically.
- Educational content and model behavior have an identified review status.

### Operational gates
- Deployment target and persistent-storage behavior are documented.
- Database migration and recovery procedures are tested or clearly marked as outstanding.
- Basic monitoring/error visibility and a rollback approach are defined.

## 6. MVP work sequence

1. **MVP-0 — Audit and baseline:** inspect current source, tests, docs, issues, deployment assumptions, and known gaps. Produce a verified status matrix.
2. **MVP-1 — Discovery and learning:** close gaps in Home, Explore, lesson detail, content integrity, and navigation.
3. **MVP-2 — Experiment and simulation:** complete the four domain journeys using shared contracts and robust fallbacks.
4. **MVP-3 — Application and reflection:** ensure each journey has practical application and self-check feedback.
5. **MVP-4 — Release readiness:** localization, accessibility, security, persistence, tests, CI, deployment and documentation.

This sequence is a planning guide, not an instruction to rebuild existing work. Reorder based on audit evidence and dependencies.

## 7. MVP acceptance checklist

- [ ] Source audit completed and linked to existing GitHub Issues.
- [ ] Existing functionality reused; duplicate implementations avoided.
- [ ] One end-to-end journey accepted in Mathematics.
- [ ] One end-to-end journey accepted in Chemistry.
- [ ] One end-to-end journey accepted in Physics.
- [ ] One end-to-end journey accepted in Biology.
- [ ] Every journey has an application activity and self-check.
- [ ] Sources, assumptions, limitations, and safety notes reviewed.
- [ ] Essential paths work in Vietnamese and English.
- [ ] Responsive, keyboard, and fallback states verified.
- [ ] Security and persistence release checks completed.
- [ ] CI and release documentation are current.

## 8. Scope change rule

A proposed feature belongs in MVP only when it is required to complete the core learning loop, address a release blocker, meet a safety/accessibility/security requirement, or validate a critical product assumption. Otherwise, record it for the Feature Roadmap.
