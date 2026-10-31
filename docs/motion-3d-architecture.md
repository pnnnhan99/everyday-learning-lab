# Motion and 3D learning architecture

Status: proposed adoption plan. Documentation only; no new simulation or dependency is delivered.
Decision date: 2026-10-31.

Read alongside [product architecture](PRODUCT_ARCHITECTURE.md), [simulation contract](simulation-contract.md), and [simulation registry reference](SIMULATIONS.md).

## Context and adoption decision

The current [package manifest](../package.json) declares Three.js, React Three Fiber, Drei and Framer Motion. Their presence does not prove complete 3D journeys. Build on these first. Rapier is a conditional addition for rigid-body lessons; postprocessing and extra animation engines follow measured needs.

This plan supports [issue #48: client-only 3D foundation](https://github.com/pnnnhan99/everyday-learning-lab/issues/48) and [issue #49: first 3D learning journeys](https://github.com/pnnnhan99/everyday-learning-lab/issues/49). It does not mark their acceptance criteria complete or change backlog priority.

## Preserve the scientific model boundary

Keep the existing framework-independent initialize/run simulation contract. Domain calculations, input validation, units, assumptions and references remain outside React and graphics components. Do not replace the contract with a rendering-engine API.

| Component | Owns | Must not own |
| --- | --- | --- |
| Domain model | Equations, authored rules, validated inputs and typed outputs | React, browser state or decorative effects |
| Scene adapter | Mapping model state to geometry, labels and visual cues | Hidden scientific rules or reaction predictions |
| Experience UI | Lesson flow, accessible controls, explanation and reflection | A second conflicting simulation state |
| Playback controller | Pause/reset, time and presentation state | Unreviewed physical assumptions |

If continuous stepping is needed later, specify an optional adapter/controller alongside the existing contract in a separate implementation proposal. Define timestep, reset, seed, events and state snapshots; do not silently add methods to every simulation.

Rapier supplies rigid-body behavior, not a chemical reaction solver or biological model. Document gravity, units, collision approximations, integration timestep and numerical tolerance. Decorative bubbles, particles and glow must reflect authored/model state; they are not evidence that a reaction is scientifically valid.

## Rendering and accessibility

Load 3D scenes lazily on the client, behind loading, error and WebGL-unavailable states. Preserve useful lesson text and a 2D/static alternative without the canvas.

Use R3F as the React renderer and Drei for justified scene helpers. Avoid adding separate render loops that fight the scene clock. Keep UI animation on the existing Motion/Framer Motion stack. GSAP is optional for a demonstrated multi-step presentation need; Anime.js is an alternative for a specific SVG feature, not another default engine.

Provide touch-sized controls, reset camera and keyboard/non-drag alternatives. Expose values, results and units as accessible HTML, not only as canvas text or color changes. Respect reduced motion, offer explicit playback controls, and pause animation when the scene is hidden.

Use quality presets with capped device pixel ratio, bounded particle counts and optional shadows/postprocessing. Dispose geometries, materials, audio resources and subscriptions on teardown. Measure frame time, startup payload and memory on a representative mobile device; record the device and budget before approving heavy effects. Visual quality must degrade without changing the scientific result.

Sound is optional and starts through user interaction with mute/volume controls. Howler may help interactive feedback; educational content must remain understandable without audio.

## Delivery order and evidence

1. Finish the reusable scene foundation from issue #48 using existing dependencies. Verify client-only loading, fallback states, keyboard/touch controls and cleanup.
2. Deliver the three small journeys from issue #49 through Discover → Learn → Experiment → Apply → Reflect: an illustrative atom/molecule, a motion/force model and a cell/biomolecule. Preserve scientific review labels and references.
3. Consider a bounded two-body collision experiment as a later Rapier spike. Compare against an analytical case where applicable, test reset/replay and boundary inputs, and explain numerical limits.
4. Add optional outline/bloom, designed Lottie feedback or guided timelines only after mobile measurement and learning-purpose review.

For runtime implementations, run repository lint, TypeScript checks, automated tests, content validation scripts and production build. Test model equations independently, including valid ranges and boundary cases. Manually verify mobile layout, keyboard operation, reduced motion, no-WebGL fallback and pause/reset behavior. Do not claim scientific review based on passing software tests.

## Future connection to Studio

A future lesson-video workflow may share versioned content, validated parameters, model outputs, narration text and asset references with Studio. Keep interactive web rendering and frame-based video rendering behind separate adapters.

Do not import source directly from the monorepo or require either app to deploy with the other. Start with an explicit versioned export format; consider a published framework-independent package only when both repositories demonstrably need it. Export replayable state/snapshots if live simulation cannot reproduce an arbitrary video frame deterministically.

This integration is deferred. Authentication, asset authorization, ownership, licensing and rendering costs must be designed before transferring real user content.

## Scope and open decisions

No runtime, dependency, public contract, persistence or deployment changes are made by this document. Exact Rapier adapter design, performance budgets, optional effects and cross-repository sharing remain future decisions. Existing simulation content still requires its own scientific validation.

## Tool selection matrix

These are architectural recommendations, not an installation list. Package declarations do not prove production readiness. Names from the supplied screenshot are interpreted below; the video URL was not supplied, so exact skill repositories and the aliases "m-canvas" and "postfx" remain unverified.

| Screenshot entry | Role | Studio decision | Learning Lab decision |
| --- | --- | --- | --- |
| rem-skills | Likely Remotion agent instructions | Evaluate official Remotion skills for development | Optional for a future video export workflow |
| gsap-skills | Likely GSAP agent instructions | Defer until a concrete GSAP use case | Evaluate only if GSAP is selected |
| svgo | SVG optimization | Optional asset build step | Optional diagram/model asset build step |
| satori | Supported HTML/CSS to SVG | Optional title/share cards | Optional lesson/share cards |
| gsap | Complex animation timelines | Optional, frame-controlled integration only | Optional guided multi-step demonstrations |
| anime.js | JavaScript/SVG animation | Defer; avoid overlapping engines | Alternative for a specific SVG need, not a default addition |
| motion | React UI animation | Reuse existing Framer Motion and motion package | Reuse existing Framer Motion |
| dotlottie | Playback of authored animation assets | Optional onboarding/status assets | Optional mascot/lesson feedback |
| remotion | React video composition/rendering | Primary proposed video composition engine | Future narrated lesson-video adapter |
| m-canvas | Assumed Motion Canvas | Defer a second video engine | Separate experiment for explanatory videos |
| three.js | 3D graphics engine | Add only for a justified 3D template | Existing declared 3D foundation |
| r3f | React Three Fiber renderer | Only with a justified 3D template | Existing declared React integration |
| drei | R3F helpers | Only with R3F scenes | Existing declared scene helpers |
| rapier | Rigid-body physics | Defer unless a template needs physics | Candidate for collision/rigid-body lessons |
| postfx | Assumed postprocessing effects | Optional per-template enhancement | Optional, disabled on low-quality mode |
| howler | Browser audio playback | Optional audition/UI sounds | Optional interactive feedback/spatial sound |
| mediabunny | Audio/video reading, writing, conversion | Browser metadata/thumbnail feasibility spike | Defer until media export is required |
| ffmpeg | Audio/video processing | Worker-side media normalization and final inspection | Future server video export only |

Agent skills are development instructions, not application runtime dependencies. Review their source and installation scope before adopting them. No dependency, skill, or service is installed by this document.

## Official references

- [Remotion](https://www.remotion.dev/docs/) and [agent skills](https://www.remotion.dev/docs/ai/skills)
- [Motion for React](https://motion.dev/docs/react), [GSAP](https://gsap.com/docs/v3/), [Anime.js](https://animejs.com/documentation/)
- [Three.js](https://threejs.org/docs/), [React Three Fiber](https://r3f.docs.pmnd.rs/getting-started/introduction), [Drei](https://github.com/pmndrs/drei)
- [React Three Rapier](https://pmndrs.github.io/react-three-rapier/), [React Postprocessing](https://react-postprocessing.docs.pmnd.rs/introduction)
- [SVGO](https://svgo.dev/), [Satori](https://github.com/vercel/satori), [dotLottie](https://docs.lottiefiles.com/en)
- [Motion Canvas](https://motioncanvas.io/), [Howler](https://howlerjs.com/), [Mediabunny](https://mediabunny.dev/guide/introduction), [FFmpeg](https://ffmpeg.org/documentation.html)

Check current APIs, browser support, dependency compatibility, and license terms when implementing each phase.
