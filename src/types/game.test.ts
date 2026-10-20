import { describe, it, expect } from 'vitest'
import {
  validateElement,
  validateReaction,
  isElementType,
  isEffectType,
  isReactionReviewStatus,
  isValidReference,
} from '@/types/game'
import type { Element, Reaction, EffectType, ReactionReviewStatus, ElementType } from '@/types/game'

describe('isElementType', () => {
  it('returns true for valid element types', () => {
    for (const t of ['acid', 'base', 'food', 'chemical'] as ElementType[]) {
      expect(isElementType(t)).toBe(true)
    }
  })

  it('returns false for invalid values', () => {
    expect(isElementType('unknown')).toBe(false)
    expect(isElementType(null)).toBe(false)
    expect(isElementType(undefined)).toBe(false)
    expect(isElementType(123)).toBe(false)
  })
})

describe('isEffectType', () => {
  it('returns true for valid effect types', () => {
    for (const t of ['toxic', 'informational'] as EffectType[]) {
      expect(isEffectType(t)).toBe(true)
    }
  })

  it('returns false for invalid values', () => {
    expect(isEffectType('dangerous')).toBe(false)
    expect(isEffectType(null)).toBe(false)
    expect(isEffectType(undefined)).toBe(false)
    expect(isEffectType(42)).toBe(false)
  })
})

describe('isReactionReviewStatus', () => {
  it('returns true for valid review statuses', () => {
    for (const s of ['reviewed', 'hazard-reviewed', 'unreviewed'] as ReactionReviewStatus[]) {
      expect(isReactionReviewStatus(s)).toBe(true)
    }
  })

  it('returns false for invalid values', () => {
    expect(isReactionReviewStatus('pending')).toBe(false)
    expect(isReactionReviewStatus(null)).toBe(false)
    expect(isReactionReviewStatus(undefined)).toBe(false)
  })
})

describe('isValidReference', () => {
  it('returns true for valid HTTPS references', () => {
    expect(isValidReference({ title: 'Test', publisher: 'Pub', url: 'https://example.com' })).toBe(true)
  })

  it('returns false when title is missing or empty', () => {
    expect(isValidReference({ title: '', publisher: 'Pub', url: 'https://example.com' })).toBe(false)
    expect(isValidReference({ title: 'Test', publisher: 'Pub', url: 'https://example.com' })).toBe(true)
  })

  it('returns false when publisher is missing or empty', () => {
    expect(isValidReference({ title: 'Test', publisher: '', url: 'https://example.com' })).toBe(false)
  })

  it('returns false when url does not start with https://', () => {
    expect(isValidReference({ title: 'Test', publisher: 'Pub', url: 'http://example.com' })).toBe(false)
    expect(isValidReference({ title: 'Test', publisher: 'Pub', url: 'ftp://example.com' })).toBe(false)
  })

  it('returns false for non-objects', () => {
    expect(isValidReference(null)).toBe(false)
    expect(isValidReference('string')).toBe(false)
    expect(isValidReference(123)).toBe(false)
  })
})

describe('validateElement', () => {
  const validElement: Element = {
    id: 'test-element',
    name: 'Test Element',
    icon: 'flask',
    description: 'A test element',
    type: 'chemical',
    ph: 7,
    safetyLevel: 3,
  }

  it('succeeds with a valid element', () => {
    const result = validateElement(validElement)
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value.id).toBe('test-element')
      expect(result.value.name).toBe('Test Element')
      expect(result.value.type).toBe('chemical')
    }
  })

  it('trims id, name, and description', () => {
    const result = validateElement({ ...validElement, id: '  spaced  ', name: '  Spaced  ', description: '  Desc  ' })
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value.id).toBe('spaced')
      expect(result.value.name).toBe('Spaced')
      expect(result.value.description).toBe('Desc')
    }
  })

  it('defaults icon to flask when not provided', () => {
    const { icon: _omit, ...noIcon } = validElement
    void _omit
    const result = validateElement(noIcon)
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.value.icon).toBe('flask')
  })

  it('fails when input is not an object', () => {
    expect(validateElement(null).ok).toBe(false)
    expect(validateElement('string').ok).toBe(false)
    expect(validateElement(123).ok).toBe(false)
  })

  it('fails when id is missing or empty', () => {
    expect(validateElement({ ...validElement, id: '' }).ok).toBe(false)
    expect(validateElement({ ...validElement, id: '   ' }).ok).toBe(false)
    expect(validateElement({ ...validElement, id: undefined }).ok).toBe(false)
  })

  it('fails when name is missing or empty', () => {
    expect(validateElement({ ...validElement, name: '' }).ok).toBe(false)
    expect(validateElement({ ...validElement, name: undefined }).ok).toBe(false)
  })

  it('fails when description is missing or empty', () => {
    expect(validateElement({ ...validElement, description: '' }).ok).toBe(false)
    expect(validateElement({ ...validElement, description: undefined }).ok).toBe(false)
  })

  it('fails when type is invalid', () => {
    expect(validateElement({ ...validElement, type: 'radioactive' }).ok).toBe(false)
    expect(validateElement({ ...validElement, type: undefined }).ok).toBe(false)
  })

  it('fails when ph is out of range (0-14)', () => {
    expect(validateElement({ ...validElement, ph: -1 }).ok).toBe(false)
    expect(validateElement({ ...validElement, ph: 15 }).ok).toBe(false)
    expect(validateElement({ ...validElement, ph: 0 }).ok).toBe(true)
    expect(validateElement({ ...validElement, ph: 14 }).ok).toBe(true)
  })

  it('fails when icon is not a string', () => {
    expect(validateElement({ ...validElement, icon: 123 }).ok).toBe(false)
  })
})

describe('validateReaction', () => {
  const validReaction: Reaction = {
    element1Id: 'lemon',
    element2Id: 'baking-soda',
    resultTitle: 'Carbon dioxide bubbles',
    observation: 'Bubbles form',
    explanation: 'Acid reacts with bicarbonate',
    effectType: 'informational',
    reviewStatus: 'reviewed',
    assumptions: ['Assumption 1', 'Assumption 2'],
    safetyGuidance: 'Do not try at home',
    references: [
      { title: 'Ref 1', publisher: 'Pub', url: 'https://example.com/ref1' },
    ],
  }

  it('succeeds with a valid reaction', () => {
    const result = validateReaction(validReaction)
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value.element1Id).toBe('lemon')
      expect(result.value.resultTitle).toBe('Carbon dioxide bubbles')
    }
  })

  it('trims text fields', () => {
    const result = validateReaction({
      ...validReaction,
      element1Id: '  lemon  ',
      element2Id: '  baking-soda  ',
      resultTitle: '  Carbon dioxide  ',
      observation: '  Bubbles  ',
      explanation: '  Reaction  ',
      safetyGuidance: '  Do not try  ',
      assumptions: ['  Assumption 1  '],
    })
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value.element1Id).toBe('lemon')
      expect(result.value.element2Id).toBe('baking-soda')
      expect(result.value.assumptions[0]).toBe('Assumption 1')
    }
  })

  it('fails when input is not an object', () => {
    expect(validateReaction(null).ok).toBe(false)
    expect(validateReaction(undefined).ok).toBe(false)
  })

  it('fails when required string fields are missing', () => {
    for (const key of ['element1Id', 'element2Id', 'resultTitle', 'observation', 'explanation'] as const) {
      const result = validateReaction({ ...validReaction, [key]: '' })
      expect(result.ok).toBe(false)
      expect(result.ok === false ? result.error : '').toContain(key)
    }
  })

  it('fails when effectType is invalid', () => {
    expect(validateReaction({ ...validReaction, effectType: 'dangerous' }).ok).toBe(false)
  })

  it('fails when reviewStatus is invalid', () => {
    expect(validateReaction({ ...validReaction, reviewStatus: 'pending' }).ok).toBe(false)
  })

  it('fails when assumptions is empty or contains empty strings', () => {
    expect(validateReaction({ ...validReaction, assumptions: [] }).ok).toBe(false)
    expect(validateReaction({ ...validReaction, assumptions: [''] }).ok).toBe(false)
    expect(validateReaction({ ...validReaction, assumptions: ['valid', ''] }).ok).toBe(false)
  })

  it('fails when safetyGuidance is missing', () => {
    expect(validateReaction({ ...validReaction, safetyGuidance: '' }).ok).toBe(false)
  })

  it('fails when references is empty or invalid', () => {
    expect(validateReaction({ ...validReaction, references: [] }).ok).toBe(false)
    expect(validateReaction({
      ...validReaction,
      references: [{ title: 'T', publisher: 'P', url: 'http://no-https.com' }],
    }).ok).toBe(false)
  })
})
