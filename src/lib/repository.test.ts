import { describe, it, expect } from 'vitest'
import { normalizePair, isDuplicatePair } from '@/lib/repository'

describe('normalizePair', () => {
  it('returns pairs in sorted order', () => {
    expect(normalizePair('a', 'b')).toBe('a|b')
    expect(normalizePair('b', 'a')).toBe('a|b')
  })

  it('returns the element id twice when both are the same', () => {
    expect(normalizePair('x', 'x')).toBe('x|x')
  })

  it('is consistent for reversed inputs', () => {
    expect(normalizePair('lemon', 'baking-soda')).toBe(normalizePair('baking-soda', 'lemon'))
  })
})

describe('isDuplicatePair', () => {
  const base = { element1Id: 'a', element2Id: 'b' }

  it('returns true for same-order pairs', () => {
    expect(isDuplicatePair(base, { element1Id: 'a', element2Id: 'b' })).toBe(true)
  })

  it('returns true for reversed pairs', () => {
    expect(isDuplicatePair(base, { element1Id: 'b', element2Id: 'a' })).toBe(true)
  })

  it('returns false for different pairs', () => {
    expect(isDuplicatePair(base, { element1Id: 'a', element2Id: 'c' })).toBe(false)
    expect(isDuplicatePair(base, { element1Id: 'c', element2Id: 'b' })).toBe(false)
  })

  it('returns true when both pairs are the same element', () => {
    expect(isDuplicatePair({ element1Id: 'x', element2Id: 'x' }, { element1Id: 'x', element2Id: 'x' })).toBe(true)
  })

  it('returns false when only one id matches', () => {
    expect(isDuplicatePair({ element1Id: 'a', element2Id: 'b' }, { element1Id: 'a', element2Id: 'x' })).toBe(false)
  })
})
