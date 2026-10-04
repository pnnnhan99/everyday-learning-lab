export type ElementType = 'acid' | 'base' | 'food' | 'chemical';

export interface Element {
  id: string;
  name: string;
  icon: string;
  description: string;
  type: ElementType;
}

export type EffectType = 'explosion' | 'clean' | 'toxic';

export interface Reaction {
  element1Id: string;
  element2Id: string;
  resultTitle: string;
  resultDescription: string;
  effectType: EffectType;
}