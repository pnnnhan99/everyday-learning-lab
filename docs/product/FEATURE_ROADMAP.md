# Everyday Learning Lab — Feature Roadmap

> Directional roadmap for capabilities after the MVP. Sequence by validated learner needs, not by novelty.

## 1. Prioritization principles

Prioritize work that:
1. improves learning outcomes or completion of the core learning loop,
2. is supported by evidence from learner/teacher feedback,
3. reuses the current architecture,
4. has a clear owner, acceptance criteria, and measurable outcome,
5. does not weaken safety, privacy, accessibility, or scientific quality.

Do not commit to dates until dependencies, capacity, and MVP results are understood.

## 2. Feature tracks

### F1 — Learner identity and progress

**Goal:** let learners continue learning across sessions and understand their progress.

Candidate capabilities:
- learner accounts and secure sessions,
- learner profile and age/level preferences with data minimization,
- lesson completion and quiz history,
- bookmarks and recently viewed content,
- progress dashboard and suggested next lesson,
- achievements only when they reinforce learning rather than distract from it.

Acceptance direction:
- progress is tied to an authenticated learner and protected from cross-user access,
- learners can inspect, export, and delete applicable personal data,
- progress events are reliable and do not double-count,
- guest use remains possible if it is valuable to the product.

### F2 — Content authoring and quality workflow

**Goal:** scale learning content without weakening review quality.

Candidate capabilities:
- lesson/topic authoring and editing,
- quiz and challenge builder,
- media/reference management,
- draft, review, approved, published, and archived states,
- content version history and change audit,
- import/export and content integrity reports,
- content analytics.

Acceptance direction:
- content schemas are versioned and validated,
- published content has an identifiable review status,
- edits do not silently break existing lesson/simulation references,
- authoring permissions are role-based and server-enforced.

### F3 — Advanced simulations and 3D lab

**Goal:** enable deeper experimentation when it adds measurable learning value.

Candidate capabilities:
- compare multiple experiment runs,
- save/share experiment configurations,
- richer parameter controls and guided experiments,
- additional domain simulations and 3D visualizations,
- physics engine integration such as Rapier only for scenarios that need collision/rigid-body behavior,
- reusable simulation authoring tools.

Acceptance direction:
- calculations remain separated from rendering and are deterministic where applicable,
- simulation versions and parameter schemas are explicit,
- performance and accessibility fallbacks are tested,
- model assumptions and limitations are visible,
- new engine dependencies are justified by a concrete use case.

### F4 — AI learning assistant

**Goal:** provide contextual explanations and guidance without replacing learning or scientific computation.

Candidate capabilities:
- ask questions about the current lesson,
- explain a simulation result using supplied model outputs,
- provide hints before revealing an answer,
- recommend a next learning activity,
- assist authors with draft explanations and quiz ideas.

Guardrails:
- AI must not be the source of truth for numerical/domain calculations.
- Ground responses in approved lesson content and structured simulation outputs.
- Clearly indicate uncertainty and unsupported questions.
- Do not expose private learner data to model providers without an explicit, reviewed data policy.
- Add age-appropriate safety and moderation controls before enabling learner-facing AI.
- Provide a non-AI path for all essential learning tasks.

### F5 — Teacher and classroom

**Goal:** support structured learning with educators.

Candidate capabilities:
- teacher accounts and classroom groups,
- learner enrollment and invitations,
- assignments built from lessons/challenges,
- class progress and aggregate reports,
- teacher-curated learning paths,
- privacy-aware learner feedback.

Acceptance direction:
- role and classroom boundaries are enforced server-side,
- reports expose only data the teacher is authorized to see,
- retention and deletion policies are documented,
- learner safety and consent requirements are reviewed before launch.

### F6 — Platform and ecosystem

**Goal:** improve reach, resilience, and contribution quality.

Candidate capabilities:
- PWA installation and selected offline learning,
- improved accessibility and localization,
- public simulation gallery,
- reviewed community content contributions,
- documented public API only when stable use cases emerge,
- integrations with trusted educational/scientific references.

Acceptance direction:
- offline content has clear freshness and synchronization behavior,
- community contributions pass moderation and educational review,
- API contracts are versioned and secured,
- ecosystem work does not create unnecessary operational complexity.

## 3. Suggested sequencing

| Sequence | Track | Why it follows |
|---|---|---|
| Feature 1 | Learner identity and progress | Adds continuity and evidence about learning behavior after the core journey works |
| Feature 2 | Content authoring and review | Enables content growth with controlled quality |
| Feature 3 | Advanced simulation and 3D | Deepens experimentation based on validated learning needs |
| Feature 4 | AI learning assistant | Builds on trusted content, stable simulation outputs, and privacy foundations |
| Feature 5 | Teacher and classroom | Introduces multi-user roles and educational workflows |
| Feature 6 | Platform and ecosystem | Expands distribution and contribution after governance is mature |

This order is provisional. For example, a small content-authoring workflow may be needed earlier if content maintenance becomes the MVP bottleneck.

## 4. Feature proposal template

Every new feature proposal should include:
- learner/teacher problem,
- expected learning or product outcome,
- user journey and affected domain,
- existing code/contracts to reuse,
- dependencies and data implications,
- privacy, safety, and accessibility considerations,
- measurable success criteria,
- scope exclusions,
- acceptance criteria and test strategy,
- rollout and rollback plan.

## 5. Metrics to establish

Establish baseline measurements before setting numeric targets:
- discovery-to-lesson-start rate,
- lesson completion rate,
- simulation interaction rate,
- application/self-check completion rate,
- retry and question-correction patterns,
- time to complete a learning journey,
- learner-reported clarity and usefulness,
- content review defects,
- simulation errors and performance,
- accessibility issues and localization coverage.

Avoid optimizing time-on-site as a primary success metric. Prefer evidence that learners understand and can apply concepts.
