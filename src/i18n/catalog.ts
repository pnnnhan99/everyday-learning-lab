import type { Locale } from './dict';
import type { Element, Reaction } from '@/types/game';

/**
 * Catalog records keep one reviewed English edition plus an optional Vietnamese
 * edition. Vietnamese is only used when the record actually has a complete
 * translation; otherwise the English text stays visible instead of blank fields.
 */
export function localizeElement(element: Element, locale: Locale): Element {
  if (locale === 'en' || !element.vi) return element;
  return {
    ...element,
    name: element.vi.name,
    description: element.vi.description,
  };
}

export function localizeReaction(reaction: Reaction, locale: Locale): Reaction {
  if (locale === 'en' || !reaction.vi) return reaction;
  return {
    ...reaction,
    resultTitle: reaction.vi.resultTitle,
    observation: reaction.vi.observation,
    explanation: reaction.vi.explanation,
    safetyGuidance: reaction.vi.safetyGuidance,
    assumptions: reaction.vi.assumptions,
  };
}
