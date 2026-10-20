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
  createdAt?: string;
  updatedAt?: string;
}

const ELEMENT_TYPES: ElementType[] = ['acid', 'base', 'food', 'chemical'];
const EFFECT_TYPES: EffectType[] = ['explosion', 'clean', 'toxic'];

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
  for (const key of ['element1Id', 'element2Id', 'resultTitle', 'resultDescription'] as const) {
    if (typeof v[key] !== 'string' || (v[key] as string).trim() === '') return { ok: false, error: `Reaction.${key} is required` };
  }
  if (!isEffectType(v.effectType)) return { ok: false, error: 'Reaction.effectType must be explosion|clean|toxic' };
  return {
    ok: true,
    value: {
      element1Id: (v.element1Id as string).trim(),
      element2Id: (v.element2Id as string).trim(),
      resultTitle: (v.resultTitle as string).trim(),
      resultDescription: (v.resultDescription as string).trim(),
      effectType: v.effectType,
    },
  };
}
