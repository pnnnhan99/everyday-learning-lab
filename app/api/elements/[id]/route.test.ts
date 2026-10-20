import { describe, it, expect, beforeEach } from 'vitest'
import { GET, PUT, DELETE } from './route'
import { listElements, createElement } from '@/lib/db'
import { resetDb } from '@/lib/sqlite'
import type { Element } from '@/types/game'

const AUTH_HEADER = { authorization: 'Bearer test-token' }

function makeContext(id: string) {
  return { params: Promise.resolve({ id }) }
}

function makeRequest(url: string, method: string, body?: unknown, headers?: Record<string, string>): Request {
  const init: RequestInit = { method, headers: { 'Content-Type': 'application/json', ...headers } }
  if (body !== undefined) init.body = JSON.stringify(body)
  return new Request(url, init)
}

async function getElementIds(): Promise<string[]> {
  return (await listElements()).map((e) => e.id).sort()
}

describe('GET /api/elements/[id]', () => {
  beforeEach(() => resetDb())

  it('returns a single element by id', async () => {
    const response = await GET(makeRequest('http://localhost/api/elements/lemon', 'GET'), makeContext('lemon'))
    const json = await response.json()
    expect(response.status).toBe(200)
    expect(json.data.id).toBe('lemon')
    expect(json.data.name).toBe('Lemon Juice')
  })

  it('returns 404 for an unknown id', async () => {
    const response = await GET(makeRequest('http://localhost/api/elements/nope', 'GET'), makeContext('nope'))
    expect(response.status).toBe(404)
  })
})

describe('PUT /api/elements/[id]', () => {
  beforeEach(() => resetDb())

  it('returns 401 without authorization and leaves data unchanged', async () => {
    const before = await getElementIds()
    const response = await PUT(
      makeRequest('http://localhost/api/elements/lemon', 'PUT', { id: 'lemon', name: 'Hacked', description: 'x', type: 'chemical' }),
      makeContext('lemon'),
    )
    expect(response.status).toBe(401)
    const lemon = (await listElements()).find((e) => e.id === 'lemon')
    expect(lemon?.name).not.toBe('Hacked')
    expect(await getElementIds()).toEqual(before)
  })

  it('returns 401 for a wrong token and leaves data unchanged', async () => {
    const response = await PUT(
      makeRequest('http://localhost/api/elements/lemon', 'PUT', { id: 'lemon', name: 'Hacked', description: 'x', type: 'chemical' }, { authorization: 'Bearer wrong-token' }),
      makeContext('lemon'),
    )
    expect(response.status).toBe(401)
    const lemon = (await listElements()).find((e) => e.id === 'lemon')
    expect(lemon?.name).not.toBe('Hacked')
  })

  it('updates an element when authenticated', async () => {
    const response = await PUT(
      makeRequest('http://localhost/api/elements/lemon', 'PUT', { id: 'lemon', name: 'Sour Lemon', description: 'Citrus fruit', type: 'food', icon: '🍋' }, AUTH_HEADER),
      makeContext('lemon'),
    )
    const json = await response.json()
    expect(response.status).toBe(200)
    expect(json.data.name).toBe('Sour Lemon')
  })

  it('returns 400 for an invalid payload and leaves data unchanged', async () => {
    const response = await PUT(
      makeRequest('http://localhost/api/elements/lemon', 'PUT', { id: 'lemon', name: '', type: 'chemical' }, AUTH_HEADER),
      makeContext('lemon'),
    )
    expect(response.status).toBe(400)
    const lemon = (await listElements()).find((e) => e.id === 'lemon')
    expect(lemon?.name).toBe('Lemon Juice')
  })

  it('returns 404 when the element does not exist', async () => {
    const response = await PUT(
      makeRequest('http://localhost/api/elements/nope', 'PUT', { id: 'nope', name: 'X', description: 'D', type: 'chemical' }, AUTH_HEADER),
      makeContext('nope'),
    )
    expect(response.status).toBe(404)
  })
})

describe('DELETE /api/elements/[id]', () => {
  beforeEach(() => resetDb())

  it('returns 401 without authorization and leaves data unchanged', async () => {
    const before = await getElementIds()
    const response = await DELETE(makeRequest('http://localhost/api/elements/lemon', 'DELETE'), makeContext('lemon'))
    expect(response.status).toBe(401)
    expect(await getElementIds()).toEqual(before)
  })

  it('returns 409 when the element is referenced by reactions', async () => {
    const before = await getElementIds()
    const response = await DELETE(makeRequest('http://localhost/api/elements/lemon', 'DELETE', undefined, AUTH_HEADER), makeContext('lemon'))
    expect(response.status).toBe(409)
    const json = await response.json()
    expect(json.error).toContain('referenced by reactions')
    expect(await getElementIds()).toEqual(before)
  })

  it('deletes an unreferenced element when authenticated', async () => {
    await createElement({ id: 'water', name: 'Water', description: 'H2O', type: 'chemical', icon: '💧' })
    const response = await DELETE(makeRequest('http://localhost/api/elements/water', 'DELETE', undefined, AUTH_HEADER), makeContext('water'))
    const json = await response.json()
    expect(response.status).toBe(200)
    expect(json.data.id).toBe('water')
    const ids = await getElementIds()
    expect(ids).not.toContain('water')
  })

  it('returns 404 when the element does not exist', async () => {
    const response = await DELETE(makeRequest('http://localhost/api/elements/nope', 'DELETE', undefined, AUTH_HEADER), makeContext('nope'))
    expect(response.status).toBe(404)
  })
})

describe('seeded element shape', () => {
  beforeEach(() => resetDb())

  it('exposes only expected fields on GET', async () => {
    const response = await GET(makeRequest('http://localhost/api/elements/vinegar', 'GET'), makeContext('vinegar'))
    const json = await response.json()
    const element: Element = json.data
    expect(Object.keys(element).sort()).toEqual(['description', 'icon', 'id', 'name', 'type'])
  })
})
