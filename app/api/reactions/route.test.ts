import { describe, it, expect, beforeEach } from 'vitest'
import { GET, POST, DELETE } from './route'
import { resetDb } from '@/lib/sqlite'
import type { Reaction } from '@/types/game'

const AUTH_HEADER = { authorization: 'Bearer test-token' }

function makeRequest(url: string, method: string, body?: unknown, headers?: Record<string, string>): Request {
  const init: RequestInit = { method, headers: { 'Content-Type': 'application/json', ...headers } }
  if (body !== undefined) init.body = JSON.stringify(body)
  return new Request(url, init)
}

describe('GET /api/reactions', () => {
  beforeEach(() => resetDb())

  it('returns all reactions when no query params', async () => {
    const response = await GET(makeRequest('http://localhost/api/reactions', 'GET'))
    const json = await response.json()
    expect(response.status).toBe(200)
    expect(json.data).toHaveLength(2)
  })

  it('returns a reaction by pair (normal order)', async () => {
    const response = await GET(makeRequest('http://localhost/api/reactions?e1=lemon&e2=baking-soda', 'GET'))
    const json = await response.json()
    expect(response.status).toBe(200)
    expect(json.data.resultTitle).toBe('Carbon dioxide bubbles')
  })

  it('returns a reaction by pair (reversed order)', async () => {
    const response = await GET(makeRequest('http://localhost/api/reactions?e1=baking-soda&e2=lemon', 'GET'))
    const json = await response.json()
    expect(response.status).toBe(200)
    expect(json.data.resultTitle).toBe('Carbon dioxide bubbles')
  })

  it('returns 404 for a non-existent pair', async () => {
    const response = await GET(makeRequest('http://localhost/api/reactions?e1=nonexistent&e2=also-nonexistent', 'GET'))
    expect(response.status).toBe(404)
    const json = await response.json()
    expect(json.data).toBeNull()
  })
})

describe('POST /api/reactions', () => {
  beforeEach(() => resetDb())

  const validReaction: Reaction = {
    element1Id: 'bleach',
    element2Id: 'vinegar',
    resultTitle: 'Chlorine Gas',
    observation: 'Release of chlorine gas',
    explanation: 'Acidifying bleach releases chlorine gas',
    effectType: 'toxic',
    reviewStatus: 'hazard-reviewed',
    assumptions: ['Formulation varies'],
    safetyGuidance: 'Never mix bleach with vinegar',
    references: [{ title: 'Ref', publisher: 'Pub', url: 'https://example.com/ref' }],
  }

  it('returns 401 without authorization', async () => {
    const response = await POST(makeRequest('http://localhost/api/reactions', 'POST', validReaction))
    expect(response.status).toBe(401)
    const list = await GET(makeRequest('http://localhost/api/reactions', 'GET'))
    const listJson = await list.json()
    expect(listJson.data).toHaveLength(2)
    expect(listJson.data.some((r: Reaction) => r.element1Id === 'bleach' && r.element2Id === 'vinegar')).toBe(true)
  })

  it('returns 400 for invalid reaction data', async () => {
    const response = await POST(makeRequest('http://localhost/api/reactions', 'POST', { element1Id: '' }, AUTH_HEADER))
    expect(response.status).toBe(400)
  })

  it('returns 404 when referenced element does not exist', async () => {
    const reactionWithMissingElements = { ...validReaction, element1Id: 'nonexistent', element2Id: 'also-nonexistent' }
    const response = await POST(makeRequest('http://localhost/api/reactions', 'POST', reactionWithMissingElements, AUTH_HEADER))
    expect(response.status).toBe(404)
    const json = await response.json()
    expect(json.error).toContain('not found')
  })

  it('creates a reaction with 201 when authenticated and valid', async () => {
    const reactionWithSeededElements = { ...validReaction, element1Id: 'lemon', element2Id: 'vinegar' }
    const response = await POST(makeRequest('http://localhost/api/reactions', 'POST', reactionWithSeededElements, AUTH_HEADER))
    const json = await response.json()
    expect(response.status).toBe(201)
    expect(json.data.resultTitle).toBe('Chlorine Gas')
  })

  it('returns 409 when the reaction pair already exists', async () => {
    const reactionWithSeededElements = { ...validReaction, element1Id: 'lemon', element2Id: 'baking-soda' }
    const response = await POST(makeRequest('http://localhost/api/reactions', 'POST', reactionWithSeededElements, AUTH_HEADER))
    expect(response.status).toBe(409)
    const json = await response.json()
    expect(json.error).toContain('already exists')
  })
})

describe('DELETE /api/reactions', () => {
  beforeEach(() => resetDb())

  it('returns 401 without authorization', async () => {
    const response = await DELETE(makeRequest('http://localhost/api/reactions?e1=lemon&e2=baking-soda', 'DELETE'))
    expect(response.status).toBe(401)
    const list = await GET(makeRequest('http://localhost/api/reactions', 'GET'))
    const listJson = await list.json()
    expect(listJson.data).toHaveLength(2)
  })

  it('returns 400 when e1 or e2 is missing', async () => {
    const response = await DELETE(makeRequest('http://localhost/api/reactions?e1=lemon', 'DELETE', undefined, AUTH_HEADER))
    expect(response.status).toBe(400)
    const json = await response.json()
    expect(json.error).toContain('required')
  })

  it('deletes an existing reaction and returns 200', async () => {
    const response = await DELETE(makeRequest('http://localhost/api/reactions?e1=lemon&e2=baking-soda', 'DELETE', undefined, AUTH_HEADER))
    expect(response.status).toBe(200)
    const json = await response.json()
    expect(json.data.e1).toBe('lemon')
  })

  it('returns 404 when the reaction pair does not exist', async () => {
    const response = await DELETE(makeRequest('http://localhost/api/reactions?e1=nonexistent&e2=also-nonexistent', 'DELETE', undefined, AUTH_HEADER))
    expect(response.status).toBe(404)
    const json = await response.json()
    expect(json.error).toContain('not found')
  })
})
