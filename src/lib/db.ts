import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { Element, Reaction } from '@/types/game';
import { elements as seedElements, reactions as seedReactions } from '@/data/mockReactions';

const DATA_DIR = path.join(process.cwd(), '.data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

interface DbShape { elements: Element[]; reactions: Reaction[]; }

let memory: DbShape | null = null;

async function load(): Promise<DbShape> {
  if (memory) return memory;
  try {
    const raw = await fs.readFile(DB_FILE, 'utf-8');
    memory = JSON.parse(raw) as DbShape;
    return memory;
  } catch {
    memory = { elements: seedElements, reactions: seedReactions };
    return memory;
  }
}

async function save(): Promise<void> {
  if (!memory) return;
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DB_FILE, JSON.stringify(memory, null, 2), 'utf-8');
  } catch { /* ephemeral FS (serverless): keep memory only */ }
}

export async function listElements(): Promise<Element[]> { return (await load()).elements; }
export async function listReactions(): Promise<Reaction[]> { return (await load()).reactions; }

export function isDuplicatePair(a: { element1Id: string; element2Id: string }, b: { element1Id: string; element2Id: string }): boolean {
  return (a.element1Id === b.element1Id && a.element2Id === b.element2Id) ||
    (a.element1Id === b.element2Id && a.element2Id === b.element1Id);
}

export async function findReactionPair(firstId: string, secondId: string): Promise<Reaction | null> {
  const { reactions } = await load();
  return reactions.find((r) =>
    (r.element1Id === firstId && r.element2Id === secondId) ||
    (r.element1Id === secondId && r.element2Id === firstId),
  ) ?? null;
}

export async function createElement(el: Element): Promise<Element> {
  const db = await load();
  if (db.elements.some((e) => e.id === el.id)) throw new Error('Element id already exists');
  db.elements.push(el);
  await save();
  return el;
}

export async function updateElement(id: string, patch: Partial<Element>): Promise<Element | null> {
  const db = await load();
  const idx = db.elements.findIndex((e) => e.id === id);
  if (idx === -1) return null;
  db.elements[idx] = { ...db.elements[idx], ...patch, id };
  await save();
  return db.elements[idx];
}

export async function deleteElement(id: string): Promise<boolean> {
  const db = await load();
  const before = db.elements.length;
  db.elements = db.elements.filter((e) => e.id !== id);
  await save();
  return db.elements.length < before;
}

export async function createReaction(r: Reaction): Promise<Reaction> {
  const db = await load();
  if (db.reactions.some((existing) => isDuplicatePair(existing, r))) throw new Error('Reaction pair already exists');
  db.reactions.push(r);
  await save();
  return r;
}

export async function deleteReaction(e1: string, e2: string): Promise<boolean> {
  const db = await load();
  const before = db.reactions.length;
  db.reactions = db.reactions.filter((r) =>
    !((r.element1Id === e1 && r.element2Id === e2) || (r.element1Id === e2 && r.element2Id === e1)),
  );
  await save();
  return db.reactions.length < before;
}
