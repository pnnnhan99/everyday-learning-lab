import type { Element, Reaction } from '../types/game';

export const elements: Element[] = [
  {
    id: 'lemon',
    name: 'Lemon Juice',
    icon: '🍋',
    description: 'Citric acid from a squeezed lemon. pH around 2.',
    type: 'acid',
  },
  {
    id: 'baking-soda',
    name: 'Baking Soda',
    icon: '🧂',
    description: 'Sodium bicarbonate, a mild base used in kitchens.',
    type: 'base',
  },
  {
    id: 'bleach',
    name: 'Bleach',
    icon: '🧴',
    description: 'Sodium hypochlorite solution. Powerful oxidiser.',
    type: 'chemical',
  },
  {
    id: 'vinegar',
    name: 'Vinegar',
    icon: '🍶',
    description: 'Dilute acetic acid, roughly pH 3.',
    type: 'acid',
  },
];

export const reactions: Reaction[] = [
  {
    element1Id: 'lemon',
    element2Id: 'baking-soda',
    resultTitle: 'Carbon dioxide bubbles',
    observation: 'The model predicts bubbles as carbon dioxide enters the gas phase.',
    explanation:
      'In an aqueous acid-base model, acid reacts with bicarbonate to produce carbon dioxide. This does not establish a cleaning effect.',
    effectType: 'informational',
    reviewStatus: 'reviewed',
    assumptions: [
      'Treats lemon juice as an aqueous acid and baking soda as sodium bicarbonate.',
      'Does not model concentrations, quantities, side products, or the rate of gas release.',
    ],
    safetyGuidance: 'Educational model only. Do not use it as instructions for mixing substances in real life.',
    references: [
      {
        title: 'Occurrence, Preparation, and Properties of Carbonates',
        publisher: 'OpenStax Chemistry: Atoms First 2e',
        url: 'https://openstax.org/books/chemistry-atoms-first-2e/pages/18-6-occurrence-preparation-and-properties-of-carbonates',
      },
    ],
  },
  {
    element1Id: 'bleach',
    element2Id: 'vinegar',
    resultTitle: 'Chlorine Gas',
    observation: 'Potential release of highly irritating chlorine gas.',
    explanation:
      'Acidifying sodium hypochlorite bleach can release chlorine gas. The exact outcome depends on the product and conditions.',
    effectType: 'toxic',
    reviewStatus: 'hazard-reviewed',
    assumptions: [
      'Represents acidification of a sodium hypochlorite bleach product; formulations and conditions vary.',
      'Does not predict gas quantity, exposure, or individual health effects.',
    ],
    safetyGuidance:
      'Serious hazard: never mix bleach with vinegar, acids, ammonia, or other cleaners. Do not attempt this outside the simulation.',
    references: [
      {
        title: 'No, vinegar is not always safe',
        publisher: 'Poison Control',
        url: 'https://www.poison.org/articles/vinegar-164',
      },
    ],
  },
];

export function validatePublishedReactions(entries: Reaction[]): void {
  for (const reaction of entries) {
    if (
      !['reviewed', 'hazard-reviewed'].includes(reaction.reviewStatus) ||
      reaction.observation.trim() === '' ||
      reaction.explanation.trim() === '' ||
      reaction.assumptions.length === 0 ||
      reaction.assumptions.some((assumption) => assumption.trim() === '') ||
      reaction.safetyGuidance.trim() === '' ||
      reaction.references.length === 0 ||
      reaction.references.some(
        (reference) =>
          reference.title.trim() === '' ||
          reference.publisher.trim() === '' ||
          !reference.url.startsWith('https://'),
      )
    ) {
      throw new Error(`Published reaction ${reaction.element1Id}/${reaction.element2Id} is missing review metadata.`);
    }
  }
}

validatePublishedReactions(reactions);

export function findReaction(firstId: string, secondId: string): Reaction | undefined {
  return reactions.find(
    (reaction) =>
      (reaction.element1Id === firstId && reaction.element2Id === secondId) ||
      (reaction.element1Id === secondId && reaction.element2Id === firstId),
  );
}
