import { describe, it, expect, beforeEach } from 'vitest'
import { getDb, resetDb } from '@/lib/sqlite'
import { SqliteElementRepository, SqliteReactionRepository, resetRepositories } from '@/lib/sqliteRepository'
import { countElements } from '@/lib/migrate'
import type { Element, Reaction } from '@/types/game'

describe('SqliteElementRepository', () => {
  let elementRepo: SqliteElementRepository

  beforeEach(() => {
    resetRepositories()
    resetDb()
    elementRepo = new SqliteElementRepository()
  })

  const sampleElement: Element = {
    id: 'water',
    name: 'Water',
    icon: '💧',
    description: 'H2O',
    type: 'chemical',
    ph: 7,
    safetyLevel: 1,
  }

  describe('getAll', () => {
    it('returns seeded elements initially', async () => {
      const db = getDb()
      expect(countElements(db)).toBe(4)
      const result = await elementRepo.getAll()
      expect(result).toHaveLength(4)
      expect(result.map((e) => e.id).sort()).toEqual(['baking-soda', 'bleach', 'lemon', 'vinegar'])
    })
  })

  describe('getById', () => {
    it('returns an element by id', async () => {
      const result = await elementRepo.getById('lemon')
      expect(result).not.toBeNull()
      expect(result?.name).toBe('Lemon Juice')
      expect(result?.type).toBe('acid')
    })

    it('returns null for a non-existent id', async () => {
      const result = await elementRepo.getById('nonexistent')
      expect(result).toBeNull()
    })
  })

  describe('create', () => {
    it('creates a new element', async () => {
      const result = await elementRepo.create(sampleElement)
      expect(result.id).toBe('water')
      expect(result.createdAt).toBeDefined()
      expect(result.updatedAt).toBeDefined()
    })

    it('throws when the id already exists', async () => {
      await expect(elementRepo.create(sampleElement)).resolves.toBeDefined()
      await expect(elementRepo.create(sampleElement)).rejects.toThrow('Element id already exists')
    })

    it('sets createdAt and updatedAt when not provided', async () => {
      const result = await elementRepo.create(sampleElement)
      expect(result.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T/)
      expect(result.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/)
    })
  })

  describe('update', () => {
    it('updates an existing element', async () => {
      const result = await elementRepo.update('lemon', { name: 'Updated Lemon' })
      expect(result).not.toBeNull()
      expect(result?.name).toBe('Updated Lemon')
      expect(result?.id).toBe('lemon')
    })

    it('returns null when the element does not exist', async () => {
      const result = await elementRepo.update('nonexistent', { name: 'Test' })
      expect(result).toBeNull()
    })

    it('updates the updatedAt timestamp', async () => {
      const result = await elementRepo.update('lemon', { ph: 3 })
      expect(result?.ph).toBe(3)
      expect(result?.updatedAt).toBeDefined()
    })
  })

  describe('delete', () => {
    it('deletes an existing element and returns true', async () => {
      await elementRepo.create(sampleElement)
      const result = await elementRepo.delete('water')
      expect(result).toBe(true)
      const found = await elementRepo.getById('water')
      expect(found).toBeNull()
    })

    it('returns false for a non-existent element', async () => {
      const result = await elementRepo.delete('nonexistent')
      expect(result).toBe(false)
    })
  })
})

describe('SqliteReactionRepository', () => {
  let reactionRepo: SqliteReactionRepository

  beforeEach(() => {
    resetRepositories()
    resetDb()
    reactionRepo = new SqliteReactionRepository()
  })

  const sampleReaction: Reaction = {
    element1Id: 'bleach',
    element2Id: 'vinegar',
    resultTitle: 'Chlorine Gas',
    observation: 'Potential release of chlorine gas',
    explanation: 'Acidifying bleach can release chlorine gas',
    effectType: 'toxic',
    reviewStatus: 'hazard-reviewed',
    assumptions: ['Formulation varies', 'Conditions vary'],
    safetyGuidance: 'Never mix bleach with vinegar',
    references: [
      { title: 'Ref', publisher: 'Pub', url: 'https://example.com/ref' },
    ],
  }

  describe('getAll', () => {
    it('returns seeded reactions initially', async () => {
      const result = await reactionRepo.getAll()
      expect(result).toHaveLength(2)
      expect(result.some((r) => r.resultTitle === 'Chlorine Gas')).toBe(true)
    })
  })

  describe('findByPair', () => {
    it('finds a reaction by element pair (normal order)', async () => {
      const result = await reactionRepo.findByPair('lemon', 'baking-soda')
      expect(result).not.toBeNull()
      expect(result?.resultTitle).toBe('Carbon dioxide bubbles')
    })

    it('finds a reaction by element pair (reversed order)', async () => {
      const result = await reactionRepo.findByPair('baking-soda', 'lemon')
      expect(result).not.toBeNull()
      expect(result?.resultTitle).toBe('Carbon dioxide bubbles')
    })

    it('returns null for a non-existent pair', async () => {
      const result = await reactionRepo.findByPair('nonexistent', 'also-nonexistent')
      expect(result).toBeNull()
    })

    it('parses JSON arrays for assumptions and references', async () => {
      const result = await reactionRepo.findByPair('bleach', 'vinegar')
      expect(result).not.toBeNull()
      expect(result?.assumptions).toEqual([
        'Represents acidification of a sodium hypochlorite bleach product; formulations and conditions vary.',
        'Does not predict gas quantity, exposure, or individual health effects.',
      ])
      expect(result?.references).toHaveLength(1)
      expect(result?.references[0].title).toBe('No, vinegar is not always safe')
    })
  })

  describe('create', () => {
    it('creates a new reaction', async () => {
      const reaction: Reaction = {
        ...sampleReaction,
        element1Id: 'lemon',
        element2Id: 'bleach',
        resultTitle: 'New Reaction',
      }
      const result = await reactionRepo.create(reaction)
      expect(result.resultTitle).toBe('New Reaction')
      expect(result.createdAt).toBeDefined()
      expect(result.updatedAt).toBeDefined()
    })

    it('throws when a reaction pair already exists (same order)', async () => {
      const reaction: Reaction = { ...sampleReaction, element1Id: 'lemon', element2Id: 'vinegar' }
      await reactionRepo.create(reaction)
      await expect(reactionRepo.create(reaction)).rejects.toThrow('Reaction pair already exists')
    })

    it('throws when a reaction pair already exists (reversed order)', async () => {
      const reaction: Reaction = { ...sampleReaction, element1Id: 'lemon', element2Id: 'vinegar' }
      await reactionRepo.create(reaction)
      const reversed: Reaction = {
        ...sampleReaction,
        element1Id: 'vinegar',
        element2Id: 'lemon',
      }
      await expect(reactionRepo.create(reversed)).rejects.toThrow('Reaction pair already exists')
    })
  })

  describe('delete', () => {
    it('deletes an existing reaction (normal order)', async () => {
      const result = await reactionRepo.delete('lemon', 'baking-soda')
      expect(result).toBe(true)
      const found = await reactionRepo.findByPair('lemon', 'baking-soda')
      expect(found).toBeNull()
    })

    it('deletes an existing reaction (reversed order)', async () => {
      const result = await reactionRepo.delete('baking-soda', 'lemon')
      expect(result).toBe(true)
      const found = await reactionRepo.findByPair('lemon', 'baking-soda')
      expect(found).toBeNull()
    })

    it('returns false for a non-existent reaction', async () => {
      const result = await reactionRepo.delete('nonexistent', 'also-nonexistent')
      expect(result).toBe(false)
    })
  })
})
