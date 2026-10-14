export type ElementType = 'acid' | 'base' | 'food' | 'chemical';

export interface Element {
  id: string;
  name: string;
  icon: string;
  description: string;
  type: ElementType;
}

export type EffectType = 'toxic' | 'informational';

export interface ScientificReference {
  title: string;
  publisher: string;
  url: string;
}

export interface Reaction {
  element1Id: string;
  element2Id: string;
  resultTitle: string;
  observation: string;
  explanation: string;
  effectType: EffectType;
  reviewStatus: 'reviewed' | 'hazard-reviewed' | 'unreviewed';
  assumptions: string[];
  safetyGuidance: string;
  references: ScientificReference[];
}
