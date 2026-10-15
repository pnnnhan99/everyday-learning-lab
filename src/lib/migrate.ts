import type { Element, Reaction } from '@/types/game';
import { elements as seedElements, reactions as seedReactions } from '@/data/mockReactions';
import { normalizePair } from '@/lib/repository';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';

export const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS elements (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT,
  description TEXT NOT NULL,
  type TEXT NOT NULL,
  ph REAL,
  safety_level INTEGER,
  image_url TEXT,
  created_at TEXT,
  updated_at TEXT
);

CREATE TABLE IF NOT EXISTS reactions (
  element1_id TEXT NOT NULL,
  element2_id TEXT NOT NULL,
  result_title TEXT NOT NULL,
  observation TEXT NOT NULL,
  explanation TEXT NOT NULL,
  effect_type TEXT NOT NULL,
  review_status TEXT NOT NULL,
  safety_guidance TEXT NOT NULL,
  assumptions TEXT NOT NULL DEFAULT '[]',
  "references" TEXT NOT NULL DEFAULT '[]',
  created_at TEXT,
  updated_at TEXT,
  normalized_pair TEXT NOT NULL,
  PRIMARY KEY (normalized_pair),
  FOREIGN KEY (element1_id) REFERENCES elements(id),
  FOREIGN KEY (element2_id) REFERENCES elements(id)
);

CREATE INDEX IF NOT EXISTS idx_reactions_e1 ON reactions(element1_id);
CREATE INDEX IF NOT EXISTS idx_reactions_e2 ON reactions(element2_id);
`;

const INSERT_ELEMENT_SQL = `
  INSERT OR IGNORE INTO elements
    (id, name, icon, description, type, ph, safety_level, image_url, created_at, updated_at)
  VALUES
    (@id, @name, @icon, @description, @type, @ph, @safety_level, @image_url, @created_at, @updated_at)
`;

const INSERT_REACTION_SQL = `
    INSERT OR IGNORE INTO reactions
      (element1_id, element2_id, result_title, observation, explanation,
       effect_type, review_status, safety_guidance, assumptions, "references", created_at, updated_at, normalized_pair)
    VALUES
      (@element1_id, @element2_id, @result_title, @observation, @explanation,
       @effect_type, @review_status, @safety_guidance, @assumptions, @references, @created_at, @updated_at, @normalized_pair)
`;

function elementToRow(el: Element): Record<string, unknown> {
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

function reactionToRow(r: Reaction): Record<string, unknown> {
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

export function createSchema(db: Database.Database): void {
  db.exec(SCHEMA_SQL);
}

export function seedDatabase(db: Database.Database): void {
  const insertElement = db.prepare(INSERT_ELEMENT_SQL);
  const insertReaction = db.prepare(INSERT_REACTION_SQL);
  const seed = db.transaction((els: Element[], rxs: Reaction[]) => {
    for (const el of els) insertElement.run(elementToRow(el));
    for (const r of rxs) insertReaction.run(reactionToRow(r));
  });
  seed(seedElements, seedReactions);
}

export function countElements(db: Database.Database): number {
  const row = db.prepare('SELECT COUNT(*) AS count FROM elements').get() as { count: number };
  return row.count;
}

export function runMigration(dbPathArg?: string): Database.Database {
  const dbPath = dbPathArg ?? process.env.DATABASE_PATH ?? `${process.cwd()}/.data/app.db`;
  mkdirSync(path.dirname(dbPath), { recursive: true });
  const db = new Database(dbPath);
  try {
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    createSchema(db);
    if (countElements(db) === 0) {
      seedDatabase(db);
    }
    return db;
  } catch {
    db.close();
    throw new Error('Migration failed');
  }
}
