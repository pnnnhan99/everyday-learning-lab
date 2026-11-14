# Everyday Learning Lab — Product Delivery Strategy

> Product direction and delivery guidance for the MVP and subsequent feature expansion.
>
> Status: planning baseline. This document does not certify that any feature is complete; implementation status must be verified against source code, tests, runtime behavior, and GitHub Issues.

## 1. Product direction

Everyday Learning Lab helps learners understand the world by connecting clear explanations with interactive experiments and practical situations.

The product should make learning feel like an active investigation rather than a passive reading experience.

### Core learning loop

**Discover → Learn → Experiment → Apply → Reflect**

1. **Discover:** find a topic, question, or real-world challenge.
2. **Learn:** understand the key concept, vocabulary, and relevant context.
3. **Experiment:** change parameters in a simulation and observe outcomes.
4. **Apply:** use the concept to reason about a practical situation.
5. **Reflect:** answer a short self-check and understand what to explore next.

The loop is the product's organizing principle. New features should strengthen one or more steps instead of adding disconnected functionality.

## 2. Learning domains

The initial product scope covers:
- Mathematics & Geometry
- Chemistry
- Physics
- Biology & Earth Science
- Real-world Challenges that combine concepts across domains

A domain is a content and simulation boundary, not a reason to create a separate application or service.

## 3. Product principles

1. **Concept before spectacle:** visual effects and 3D interactions must help explain a concept.
2. **Experiment, don't just watch:** learners should be able to change meaningful inputs and inspect outcomes.
3. **Explain limitations:** every scientific or mathematical model must disclose assumptions, simplifications, and boundaries.
4. **Age-appropriate clarity:** language, interaction complexity, and safety guidance must fit the intended learner.
5. **Accessible by default:** provide keyboard-accessible controls, readable contrast, reduced-motion support, and non-WebGL alternatives where practical.
6. **Progressive complexity:** ship a coherent small learning journey before expanding the content catalog.
7. **Reuse the existing platform:** extend shared contracts, registries, content models, and components before creating parallel systems.

## 4. Current implementation context

The repository already contains substantial foundations, including:
- Next.js App Router and TypeScript application structure.
- Explore, Learn, Lab/Simulation, Challenges, Profile, and Admin routes.
- Learning content types, lesson examples, quizzes, and self-check UI.
- Simulation contracts, registry, validation, and domain simulation logic.
- Existing examples for fractions, projectile motion, acid/base CO2, and CO2/O2.
- A 3D lab foundation and domain-oriented simulation components.
- SQLite/Drizzle persistence and protected mutation endpoints.
- Vietnamese/English UI dictionary foundations and automated tests/CI.

These are repository observations, not proof that every end-to-end learner journey is production-ready. Confirm behavior and acceptance criteria before changing status.

## 5. Delivery stages

### Stage A — MVP

Deliver a small but complete, reliable learning experience. Prioritize end-to-end journeys over feature count.

The MVP should let a learner discover a topic, learn its core idea, experiment with a model, apply the idea to a situation, and reflect through a self-check.

### Stage B — Feature expansion

After the MVP is validated, deepen the platform in controlled increments:
- learner identity and progress,
- content authoring and review,
- richer simulations and experiment tools,
- AI-assisted learning,
- teacher/classroom workflows,
- offline, accessibility, and community capabilities.

Feature expansion must not compromise scientific integrity, safety, privacy, or the reliability of the core learning loop.

## 6. Architecture direction

Keep the current modular-monolith approach unless measured needs justify a change.

- Keep domain calculations independent from React rendering.
- Keep simulations behind shared typed contracts and a registry.
- Keep lesson content structured and validated.
- Keep persistence behind repository/service boundaries.
- Keep server-only secrets and privileged mutations on the server.
- Avoid microservices, distributed infrastructure, or premature platform abstractions.
- Treat SQLite as a deployment decision: it is appropriate where persistent local storage and single-writer constraints are understood; reassess before serverless or multi-instance deployment.

## 7. Scientific quality and safety

Each learning unit and simulation should identify, where applicable:
- learning objectives,
- intended learner level,
- sources or references,
- model assumptions,
- known limitations,
- safety notes,
- review status and reviewer/date.

A simulation is an educational model, not automatically a scientific instrument or a general-purpose scientific predictor. Domain rules must remain explicit and testable. AI may explain results but must not replace deterministic domain calculations or invent scientific conclusions.

## 8. How to use this document

- Use [MVP Scope](./MVP_SCOPE.md) to decide what belongs in the first release.
- Use [Feature Roadmap](./FEATURE_ROADMAP.md) to sequence post-MVP investments.
- Use [AI Coding Guidelines](../implementation/AI_CODING_GUIDELINES.md) when delegating implementation.
- Keep technical details in the existing architecture, simulation, persistence, authentication, and content-model documents.
- When documents conflict, verify the source of truth and update the relevant document rather than silently duplicating decisions.

## 9. Definition of product progress

A feature is not complete merely because a route, component, schema, or placeholder exists. Completion requires:
- user-visible behavior matching the acceptance criteria,
- correct loading, empty, error, and fallback states,
- validation and security appropriate to the feature,
- automated tests for important logic and flows,
- documentation updated,
- evidence from a local/CI run or a clearly recorded reason why verification was not possible.
