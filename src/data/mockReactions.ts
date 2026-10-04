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
    resultTitle: 'Fizzing Foam',
    resultDescription:
      'The acid reacts with bicarbonate and releases carbon dioxide, producing a froth that lifts grime off surfaces.',
    effectType: 'clean',
  },
  {
    element1Id: 'bleach',
    element2Id: 'vinegar',
    resultTitle: 'Chlorine Gas',
    resultDescription:
      'Never mix these. Acidifying bleach releases chlorine gas, which damages the lungs at very low concentrations.',
    effectType: 'toxic',
  },
  {
    element1Id: 'bleach',
    element2Id: 'baking-soda',
    resultTitle: 'Pressure Burst',
    resultDescription:
      'Bleach reacts vigorously with soda in a sealed container, building heat and pressure until the vessel bursts.',
    effectType: 'explosion',
  },
  {
    element1Id: 'lemon',
    element2Id: 'vinegar',
    resultTitle: 'Extra Sour Punch',
    resultDescription:
      'Two mild acids make no new substance, but the combined sharpness hits your taste buds harder than either alone.',
    effectType: 'clean',
  },
];

export function findReaction(firstId: string, secondId: string): Reaction | undefined {
  return reactions.find(
    (reaction) =>
      (reaction.element1Id === firstId && reaction.element2Id === secondId) ||
      (reaction.element1Id === secondId && reaction.element2Id === firstId),
  );
}