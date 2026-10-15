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
export type ReactionReviewStatus = 'reviewed' | 'hazard-reviewed' | 'unreviewed';

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
  reviewStatus: ReactionReviewStatus;
  assumptions: string[];
  safetyGuidance: string;
  references: ScientificReference[];
  createdAt?: string;
  updatedAt?: string;
}

const ELEMENT_TYPES: ElementType[] = ['acid', 'base', 'food', 'chemical'];
const EFFECT_TYPES: EffectType[] = ['toxic', 'informational'];
const REVIEW_STATUSES: ReactionReviewStatus[] = ['reviewed', 'hazard-reviewed', 'unreviewed'];

export function isElementType(value: unknown): value is ElementType {
  return typeof value === 'string' && (ELEMENT_TYPES as string[]).includes(value);
}

export function isEffectType(value: unknown): value is EffectType {
  return typeof value === 'string' && (EFFECT_TYPES as string[]).includes(value);
}

export function isReactionReviewStatus(value: unknown): value is ReactionReviewStatus {
  return typeof value === 'string' && (REVIEW_STATUSES as string[]).includes(value);
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

export function isValidReference(r: unknown): r is ScientificReference {
  if (typeof r !== 'object' || r === null) return false;
  const ref = r as Record<string, unknown>;
  return typeof ref.title === 'string' && ref.title.trim() !== ''
    && typeof ref.publisher === 'string' && ref.publisher.trim() !== ''
    && typeof ref.url === 'string' && ref.url.trim().startsWith('https://');
}

export function validateReaction(input: unknown): { ok: true; value: Reaction } | { ok: false; error: string } {
  if (typeof input !== 'object' || input === null) return { ok: false, error: 'Reaction must be an object' };
  const v = input as Record<string, unknown>;
  for (const key of ['element1Id', 'element2Id', 'resultTitle', 'observation', 'explanation'] as const) {
    if (typeof v[key] !== 'string' || (v[key] as string).trim() === '') return { ok: false, error: `Reaction.${key} is required` };
  }
  if (!isEffectType(v.effectType)) return { ok: false, error: 'Reaction.effectType must be toxic|informational' };
  if (!isReactionReviewStatus(v.reviewStatus)) return { ok: false, error: 'Reaction.reviewStatus must be reviewed|hazard-reviewed|unreviewed' };
  if (!Array.isArray(v.assumptions) || v.assumptions.length === 0 || v.assumptions.some((a) => typeof a !== 'string' || a.trim() === '')) return { ok: false, error: 'Reaction.assumptions must be a non-empty array of non-empty strings' };
  if (typeof v.safetyGuidance !== 'string' || v.safetyGuidance.trim() === '') return { ok: false, error: 'Reaction.safetyGuidance is required' };
  if (!Array.isArray(v.references) || v.references.length === 0 || !v.references.every(isValidReference)) return { ok: false, error: 'Reaction.references must be a non-empty array of HTTPS-referenced sources' };
  return {
    ok: true,
    value: {
      element1Id: (v.element1Id as string).trim(),
      element2Id: (v.element2Id as string).trim(),
      resultTitle: (v.resultTitle as string).trim(),
      observation: (v.observation as string).trim(),
      explanation: (v.explanation as string).trim(),
      effectType: v.effectType,
      reviewStatus: v.reviewStatus,
      assumptions: (v.assumptions as string[]).map((a) => a.trim()),
      safetyGuidance: (v.safetyGuidance as string).trim(),
      references: v.references as ScientificReference[],
    },
  };
}
