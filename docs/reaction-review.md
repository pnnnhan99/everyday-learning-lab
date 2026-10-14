# Reaction review record

This record covers the reaction rules currently published in `src/data/mockReactions.ts`.
The lab is a simplified educational model, not a complete reaction predictor or a real-world
procedure. Conditions, concentrations, quantities, and side products are not calculated.

| Pair | Review status | Decision and limits | Source |
| --- | --- | --- | --- |
| Lemon juice + baking soda | Reviewed | The model represents aqueous acid reacting with sodium bicarbonate to release carbon dioxide. Lemon juice composition and reactant quantities are not modeled; no cleaning effect is claimed. | [OpenStax, Occurrence, Preparation, and Properties of Carbonates](https://openstax.org/books/chemistry-atoms-first-2e/pages/18-6-occurrence-preparation-and-properties-of-carbonates) |
| Bleach + vinegar | Reviewed for hazard communication | Acidifying a sodium hypochlorite bleach product can release irritating chlorine gas. Product formulations and exposure outcomes vary; the app does not predict gas quantity or dose. This is a warning, not an experiment to perform. | [Poison Control, No, vinegar is not always safe](https://www.poison.org/articles/vinegar-164) |

## Removed claims

- Removed the claim that bleach and baking soda vigorously react in a sealed container and burst it.
  No credible source was established for that specific claim, so the simulation no longer presents it.
- Removed the claim that combining lemon juice and vinegar produces an "extra sour" sensory effect.
  It was unsupported and could encourage tasting chemicals.

## Safety and scope

All simulated outcomes are authored rules. An unmodeled pair is not thereby safe or compatible.
Never mix household chemicals based on this simulation. In particular, never mix bleach with
vinegar, acids, ammonia, or other cleaners. Refer to product labels and qualified safety guidance.

The data loader rejects published entries unless they are marked reviewed and include assumptions,
safety guidance, and HTTPS references. New rules must be source-reviewed before being added to the
published `reactions` collection.
