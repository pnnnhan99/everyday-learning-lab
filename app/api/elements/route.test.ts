import { describe, it, expect, beforeEach } from 'vitest'
import { GET, POST } from './route'
import { resetDb } from '@/lib/sqlite'
import type { Element } from '@/types/game'

const AUTH_HEADER = { authorization: 'Bearer test-token' }

function makeRequest(url: string, method: string, body?: unknown, headers?: Record<string, string>): Request {
  const init: RequestInit = { method, headers: { 'Content-Type': 'application/json', ...headers } }
  if (body !== undefined) init.body = JSON.stringify(body)
  return new Request(url, init)
}

describe('GET /api/elements', () => {
  beforeEach(() => resetDb())

  it('returns 200 with all seeded elements', async () => {
    const response = await GET()
    const json = await response.json()
    expect(response.status).toBe(200)
    expect(json.data).toHaveLength(4)
    expect(json.data.map((e: Element) => e.id).sort()).toEqual(['baking-soda', 'bleach', 'lemon', 'vinegar'])
  })
})

describe('POST /api/elements', () => {
  beforeEach(() => resetDb())

  it('returns 401 without authorization', async () => {
    const response = await POST(makeRequest('http://localhost/api/elements', 'POST', { id: 'x', name: 'X', description: 'D', type: 'chemical' }))
    expect(response.status).toBe(401)
    const json = await response.json()
    expect(json.error).toBe('Unauthorized')
    const after = await GET()
    const afterJson = await after.json()
    expect(afterJson.data).toHaveLength(4)
    expect(afterJson.data.map((e: Element) => e.id)).not.toContain('x')
  })

  it('returns 400 for invalid element data', async () => {
    const response = await POST(makeRequest('http://localhost/api/elements', 'POST', { id: '', name: '' }, AUTH_HEADER))
    expect(response.status).toBe(400)
    const json = await response.json()
    expect(json.error).toContain('required')
  })

  it('creates an element with 201 when authenticated', async () => {
    const newElement = { id: 'water', name: 'Water', description: 'H2O', type: 'chemical', icon: '💧' }
    const response = await POST(makeRequest('http://localhost/api/elements', 'POST', newElement, AUTH_HEADER))
    const json = await response.json()
    expect(response.status).toBe(201)
    expect(json.data.id).toBe('water')
    expect(json.data.name).toBe('Water')
  })

  it('returns 409 when element id already exists', async () => {
    const existing = { id: 'lemon', name: 'Duplicate', description: 'D', type: 'chemical' }
    const response = await POST(makeRequest('http://localhost/api/elements', 'POST', existing, AUTH_HEADER))
    expect(response.status).toBe(409)
    const json = await response.json()
    expect(json.error).toContain('already exists')
  })

  it('returns 400 for malformed JSON body', async () => {
    const response = await POST(new Request('http://localhost/api/elements', {
      method: 'POST',
      headers: { ...AUTH_HEADER, 'Content-Type': 'application/json' },
      body: 'not-json',
    }))
    expect(response.status).toBe(400)
  })
})
