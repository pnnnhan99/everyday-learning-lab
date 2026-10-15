import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { createSchema, seedDatabase, countElements } from '@/lib/migrate';

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), '.data');
const DB_PATH = process.env.DATABASE_PATH || path.join(DATA_DIR, 'app.db');

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    mkdirSync(DATA_DIR, { recursive: true });
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    createSchema(db);
    if (countElements(db) === 0) {
      seedDatabase(db);
    }
  }
  return db;
}

export function dbPath(): string {
  return DB_PATH;
}

export function resetDb(): void {
  if (db) {
    db.close();
    db = null;
  }
}
