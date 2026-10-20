export type ElementType = 'acid' | 'base' | 'food' | 'chemical';

export interface Element {
  id: string;
  name: string;
  /** Lucide icon key (e.g. 'flask', 'test-tube'); legacy emoji values still accepted. */
  icon: string;
  description: string;
  type: ElementType;
  /** Approximate pH when applicable (0-14). */
  ph?: number;
  /** Safety level for handling in real life (1 = safest, 5 = hazardous). */
  safetyLevel?: 1 | 2 | 3 | 4 | 5;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type EffectType = 'informational' | 'toxic';

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
  /** Safety guidance for this reaction */
  safetyGuidance: string;
  /** Review status of the reaction */
  reviewStatus: string;
  /** Assumptions made in modeling this reaction */
  assumptions: string[];
  /** Scientific references for this reaction */
  references: ScientificReference[];
  createdAt?: string;
  updatedAt?: string;
}

const ELEMENT_TYPES: ElementType[] = ['acid', 'base', 'food', 'chemical'];
const EFFECT_TYPES: EffectType[] = ['informational', 'toxic'];

export function isElementType(value: unknown): value is ElementType {
  return typeof value === 'string' && (ELEMENT_TYPES as string[]).includes(value);
}

export function isEffectType(value: unknown): value is EffectType {
  return typeof value === 'string' && (EFFECT_TYPES as string[]).includes(value);
}

export function validateElement(input: unknown): { ok: true; value: Element } | { ok: false; error: string } {
  if (typeof input !== 'object' || input === null) return { ok: false, error: 'Element must be an object' };
  const v = input as Record<string, unknown>;
  if (typeof v.id !== 'string' || v.id.trim() === '') return { ok: false, error: 'Element.id is required' };
  if (typeof v.name !== 'string' || v.name.trim() === '') return { ok: false, error: 'Element.name is required' };
  if (typeof v.description !== 'string' || v.description.trim() === '') return { ok: false, error: 'Element.description is required' };
  if (!isElementType(v.type)) return { ok: false, error: 'Element.type must be acid|base|food|chemical' };
  if (v.icon !== undefined && typeof v.icon !== 'string') return { ok: false, error: 'Element.icon must be a string' };
  if (v.ph !== undefined && (typeof v.ph !== 'number' || v.ph < 0 || v.ph > 14)) return { ok: false, error: 'Element.ph must be 0-14' };
  return {
    ok: true,
    value: {
      id: v.id.trim(),
      name: (v.name as string).trim(),
      icon: typeof v.icon === 'string' ? v.icon : 'flask',
      description: (v.description as string).trim(),
      type: v.type,
      ...(typeof v.ph === 'number' ? { ph: v.ph } : {}),
    },
  };
}

export function validateReaction(input: unknown): { ok: true; value: Reaction } | { ok: false; error: string } {
  if (typeof input !== 'object' || input === null) return { ok: false, error: 'Reaction must be an object' };
  const v = input as Record<string, unknown>;
  
  // Validate required string fields
  for (const key of ['element1Id', 'element2Id', 'resultTitle', 'observation', 'explanation', 'safetyGuidance'] as const) {
    if (typeof v[key] !== 'string' || (v[key] as string).trim() === '') return { ok: false, error: `Reaction.${key} is required` };
  }
  
  // Validate reviewStatus is one of the allowed values
  if (typeof v.reviewStatus !== 'string' || 
      !['reviewed', 'hazard-reviewed'].includes(v.reviewStatus)) {
    return { ok: false, error: 'Reaction.reviewStatus must be "reviewed" or "hazard-reviewed"' };
  }
  
  // Validate assumptions is a non-empty array of non-empty strings
  if (!Array.isArray(v.assumptions) || v.assumptions.length === 0) {
    return { ok: false, error: 'Reaction.assumptions must be a non-empty array' };
  }
  for (const assumption of v.assumptions) {
    if (typeof assumption !== 'string' || assumption.trim() === '') {
      return { ok: false, error: 'Each assumption must be a non-empty string' };
    }
  }
  
  // Validate references is a non-empty array of valid ScientificReference objects
  if (!Array.isArray(v.references) || v.references.length === 0) {
    return { ok: false, error: 'Reaction.references must be a non-empty array' };
  }
  for (const reference of v.references) {
    if (typeof reference !== 'object' || reference === null ||
        typeof reference.title !== 'string' || reference.title.trim() === '' ||
        typeof reference.publisher !== 'string' || reference.publisher.trim() === '' ||
        typeof reference.url !== 'string' || !reference.url.startsWith('https://')) {
      return { ok: false, error: 'Each reference must be a valid ScientificReference with title, publisher, and https URL' };
    }
  }
  
  if (!isEffectType(v.effectType)) return { ok: false, error: 'Reaction.effectType must be informational|toxic' };
  
  return {
    ok: true,
    value: {
      element1Id: (v.element1Id as string).trim(),
      element2Id: (v.element2Id as string).trim(),
      resultTitle: (v.resultTitle as string).trim(),
      observation: (v.observation as string).trim(),
      explanation: (v.explanation as string).trim(),
      effectType: v.effectType,
      safetyGuidance: (v.safetyGuidance as string).trim(),
      reviewStatus: (v.reviewStatus as string).trim(),
      assumptions: (v.assumptions as string[]).map(s => s.trim()),
      references: (v.references as ScientificReference[]).map(r => ({
        title: r.title.trim(),
        publisher: r.publisher.trim(),
        url: r.url.trim()
      })),
    },
  };
}
