import type { Element, Reaction } from '@/types/game';
import type { ElementRepository, ReactionRepository } from '@/lib/repository';
import { getDb, resetDb } from '@/lib/sqlite';
import { normalizePair } from '@/lib/repository';

function now(): string {
  return new Date().toISOString();
}

function toElement(row: Record<string, unknown>): Element {
  return {
    id: row.id as string,
    name: row.name as string,
    icon: (row.icon as string) || 'flask',
    description: row.description as string,
    type: row.type as Element['type'],
    ...(row.ph !== null && row.ph !== undefined ? { ph: row.ph as number } : {}),
    ...(row.safety_level !== null && row.safety_level !== undefined ? { safetyLevel: row.safety_level as number as Element['safetyLevel'] } : {}),
    ...(row.image_url ? { imageUrl: row.image_url as string } : {}),
    ...(row.created_at ? { createdAt: row.created_at as string } : {}),
    ...(row.updated_at ? { updatedAt: row.updated_at as string } : {}),
  };
}

function fromElement(el: Element): Record<string, unknown> {
  return {
    id: el.id,
    name: el.name,
    icon: el.icon,
    description: el.description,
    type: el.type,
    ph: el.ph ?? null,
    safety_level: el.safetyLevel ?? null,
    image_url: el.imageUrl ?? null,
    created_at: el.createdAt ?? null,
    updated_at: el.updatedAt ?? null,
  };
}

function toReaction(row: Record<string, unknown>): Reaction {
  return {
    element1Id: row.element1_id as string,
    element2Id: row.element2_id as string,
    resultTitle: row.result_title as string,
    observation: row.observation as string,
    explanation: row.explanation as string,
    effectType: row.effect_type as Reaction['effectType'],
    reviewStatus: row.review_status as Reaction['reviewStatus'],
    assumptions: JSON.parse(row.assumptions as string) as string[],
    safetyGuidance: row.safety_guidance as string,
    references: JSON.parse(row.references as string) as Reaction['references'],
    ...(row.created_at ? { createdAt: row.created_at as string } : {}),
    ...(row.updated_at ? { updatedAt: row.updated_at as string } : {}),
  };
}

function fromReaction(r: Reaction): Record<string, unknown> {
  return {
    element1_id: r.element1Id,
    element2_id: r.element2Id,
    result_title: r.resultTitle,
    observation: r.observation,
    explanation: r.explanation,
    effect_type: r.effectType,
    review_status: r.reviewStatus,
    safety_guidance: r.safetyGuidance,
    assumptions: JSON.stringify(r.assumptions),
    references: JSON.stringify(r.references),
    created_at: r.createdAt ?? null,
    updated_at: r.updatedAt ?? null,
    normalized_pair: normalizePair(r.element1Id, r.element2Id),
  };
}

export class SqliteElementRepository implements ElementRepository {
  async getAll(): Promise<Element[]> {
    const db = getDb();
    const rows = db.prepare('SELECT * FROM elements ORDER BY id').all() as Record<string, unknown>[];
    return rows.map(toElement);
  }

  async getById(id: string): Promise<Element | null> {
    const db = getDb();
    const row = db.prepare('SELECT * FROM elements WHERE id = ?').get(id) as Record<string, unknown> | undefined;
    return row ? toElement(row) : null;
  }

  async create(el: Element): Promise<Element> {
    const db = getDb();
    const nowStr = now();
    const element: Element = { ...el, createdAt: el.createdAt ?? nowStr, updatedAt: el.updatedAt ?? nowStr };
    try {
      db.prepare(`
        INSERT INTO elements (id, name, icon, description, type, ph, safety_level, image_url, created_at, updated_at)
        VALUES (@id, @name, @icon, @description, @type, @ph, @safety_level, @image_url, @created_at, @updated_at)
      `).run(fromElement(element));
    } catch (err) {
      if ((err as { code?: string }).code === 'SQLITE_CONSTRAINT') {
        throw new Error('Element id already exists');
      }
      throw err;
    }
    return element;
  }

  async update(id: string, patch: Partial<Element>): Promise<Element | null> {
    const db = getDb();
    const existing = db.prepare('SELECT * FROM elements WHERE id = ?').get(id) as Record<string, unknown> | undefined;
    if (!existing) return null;
    const updated = { ...toElement(existing), ...patch, id, updatedAt: now() };
    db.prepare(`
      UPDATE elements
      SET name = @name, icon = @icon, description = @description, type = @type,
          ph = @ph, safety_level = @safety_level, image_url = @image_url,
          created_at = @created_at, updated_at = @updated_at
      WHERE id = @id
    `).run(fromElement(updated));
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const db = getDb();
    const { changes } = db.prepare('DELETE FROM elements WHERE id = ?').run(id);
    return changes > 0;
  }
}

export class SqliteReactionRepository implements ReactionRepository {
  async getAll(): Promise<Reaction[]> {
    const db = getDb();
    const rows = db.prepare('SELECT * FROM reactions').all() as Record<string, unknown>[];
    return rows.map(toReaction);
  }

  async findByPair(e1: string, e2: string): Promise<Reaction | null> {
    const db = getDb();
    const row = db.prepare('SELECT * FROM reactions WHERE normalized_pair = ?').get(normalizePair(e1, e2)) as Record<string, unknown> | undefined;
    return row ? toReaction(row) : null;
  }

  async create(r: Reaction): Promise<Reaction> {
    const db = getDb();
    const nowStr = now();
    const reaction: Reaction = { ...r, createdAt: r.createdAt ?? nowStr, updatedAt: r.updatedAt ?? nowStr };
    try {
      db.prepare(`
        INSERT INTO reactions (element1_id, element2_id, result_title, observation, explanation,
          effect_type, review_status, safety_guidance, assumptions, "references", created_at, updated_at, normalized_pair)
        VALUES (@element1_id, @element2_id, @result_title, @observation, @explanation,
          @effect_type, @review_status, @safety_guidance, @assumptions, @references, @created_at, @updated_at, @normalized_pair)
      `).run(fromReaction(reaction));
    } catch (err) {
      if ((err as { code?: string }).code === 'SQLITE_CONSTRAINT') {
        throw new Error('Reaction pair already exists');
      }
      throw err;
    }
    return reaction;
  }

  async delete(e1: string, e2: string): Promise<boolean> {
    const db = getDb();
    const { changes } = db.prepare('DELETE FROM reactions WHERE normalized_pair = ?').run(normalizePair(e1, e2));
    return changes > 0;
  }
}

let elementRepo: SqliteElementRepository | null = null;
let reactionRepo: SqliteReactionRepository | null = null;

export function getElementRepository(): ElementRepository {
  if (!elementRepo) elementRepo = new SqliteElementRepository();
  return elementRepo;
}

export function getReactionRepository(): ReactionRepository {
  if (!reactionRepo) reactionRepo = new SqliteReactionRepository();
  return reactionRepo;
}

export function resetRepositories(): void {
  elementRepo = null;
  reactionRepo = null;
  resetDb();
}
