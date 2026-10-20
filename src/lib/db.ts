import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { eq, sql, and } from 'drizzle-orm';
import { elements, reactions, scientificReferences } from '@/lib/db/schema';
import type { Element, Reaction, ScientificReference } from '@/types/game';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(process.cwd(), '.data');
const DB_FILE = path.join(DATA_DIR, 'db.sqlite');

// Ensure the data directory exists using synchronous operations to avoid top-level await
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize the database connection
const sqlite = new Database(DB_FILE);
export const db = drizzle(sqlite);

// Helper function to get an element by ID
export async function getElementById(id: string): Promise<Element | null> {
  const result = await db.select().from(elements).where(eq(elements.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

// Helper function to check if a reaction already exists (normalized pair)
export async function reactionExists(element1Id: string, element2Id: string): Promise<boolean> {
  const [first, second] = element1Id < element2Id ? [element1Id, element2Id] : [element2Id, element1Id];
  const result1 = await db
    .select()
    .from(reactions)
    .where(sql`${elements.element1Id} = ${first} AND ${elements.element2Id} = ${second}`)
    .limit(1)
    .then(res => res.length > 0);

  if (result1) return true;

  const result2 = await db
    .select()
    .from(reactions)
    .where(sql`${elements.element1Id} = ${second} AND ${elements.element2Id} = ${first}`)
    .limit(1)
    .then(res => res.length > 0);

  return result2;
}

export async function listElements(): Promise<Element[]> {
  return await db.select().from(elements);
}

export async function listReactions(): Promise<Reaction[]> {
  return await db.select().from(reactions);
}

export async function findReactionPair(firstId: string, secondId: string): Promise<Reaction | null> {
  // We'll check both orders
  const result = await db
    .select()
    .from(reactions)
    .where(sql`${elements.element1Id} = ${firstId} AND ${elements.element2Id} = ${secondId}`)
    .limit(1);

  if (result.length > 0) {
    return result[0];
  }

  const result2 = await db
    .select()
    .from(reactions)
    .where(sql`${elements.element1Id} = ${secondId} AND ${elements.element2Id} = ${firstId}`)
    .limit(1);

  if (result2.length > 0) {
    return result2[0];
  }

  return null;
}

export async function createElement(el: Element): Promise<Element> {
  // Check if element already exists
  const existing = await getElementById(el.id);
  if (existing) {
    throw new Error('Element id already exists');
  }

  // Insert the new element
  await db.insert(elements).values(el).execute();
  return el;
}

export async function updateElement(id: string, patch: Partial<Element>): Promise<Element | null> {
  // Check if element exists
  const existing = await getElementById(id);
  if (!existing) {
    return null;
  }

  // Update the element
  await db.update(elements).set(patch).where(eq(elements.id, id));
  // Return the updated element
  const updated = await getElementById(id);
  return updated ?? null;
}

export async function deleteElement(id: string): Promise<boolean> {
  // Check if element exists
  const existing = await getElementById(id);
  if (!existing) {
    return false;
  }

  // Delete the element
  await db.delete(elements).where(eq(elements.id, id));
  return true;
}

export async function createReaction(r: Reaction): Promise<Reaction> {
  // Validate that both elements exist
  const [element1, element2] = await Promise.all([
    getElementById(r.element1Id),
    getElementById(r.element2Id),
  ]);

  if (!element1) {
    throw new Error(`Referenced element not found: ${r.element1Id}`);
  }

  if (!element2) {
    throw new Error(`Referenced element not found: ${r.element2Id}`);
  }

  // Check for duplicate normalized pair
  const exists = await reactionExists(r.element1Id, r.element2Id);
  if (exists) {
    throw new Error('Duplicate reaction: this element pair already exists');
  }

  // Insert the reaction
  await db.insert(reactions).values(r).execute();
  return r;
}

export async function deleteReaction(e1: string, e2: string): Promise<boolean> {
  // Check if reaction exists (in either order)
  const exists = await reactionExists(e1, e2);
  if (!exists) {
    return false;
  }

  // We need to delete the reaction. Since we don't know the order it was stored in,
  // we delete both possible orders.
  await db
    .delete(reactions)
    .where(
      // We'll delete where (element1Id = e1 AND element2Id = e2) OR (element1Id = e2 AND element2Id = e1)
      // We'll do two delete statements for simplicity.
    );

  // First delete for (e1, e2)
  await db.delete(reactions).where(and(eq(elements.element1Id, e1), eq(elements.element2Id, e2)));
  // Second delete for (e2, e1)
  await db.delete(reactions).where(and(eq(elements.element1Id, e2), eq(elements.element2Id, e1)));

  // We don't have a way to know how many rows were deleted, but we know it existed.
  return true;
}

// Seed function to initialize the database with mock data if empty
export async function seedDatabase(): Promise<void> {
  // Check if we have any elements
  const elementsCount = (await db.select().from(elements)).length;
  if (elementsCount > 0) {
    // Database already has data, skip seeding
    return;
  }

  // Get the mock data
  import('../data/mockReactions.ts').then(({ elements: seedElements, reactions: seedReactions }) => {
    // Insert elements
    for (const el of seedElements) {
      db.insert(elements).values(el).execute();
    }
    // Insert reactions
    for (const reaction of seedReactions) {
      db.insert(reactions).values(reaction).execute();
    }
    console.log(`Seeded ${seedElements.length} elements and ${seedReactions.length} reactions`);
  });
}

// Call the seed function when the module is loaded (if in development)
// We'll conditionally seed in development only.
// In production, we expect the database to be set up via migrations and manual seeding.
(async () => {
  if (process.env.NODE_ENV !== 'production') {
    await seedDatabase().catch(console.error);
  }
})();
