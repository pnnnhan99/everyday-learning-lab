import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const elements = sqliteTable('elements', {
  id: text('id').primaryKey().notNull(),
  name: text('name').notNull(),
  icon: text('icon').notNull(),
  description: text('description').notNull(),
  type: text('type').notNull(),
  ph: integer('ph'),
  safetyLevel: integer('safetyLevel'),
  imageUrl: text('imageUrl'),
  createdAt: text('createdAt'),
  updatedAt: text('updatedAt'),
});

export const scientificReferences = sqliteTable('scientificReferences', {
  id: text('id').primaryKey().notNull(),
  title: text('title').notNull(),
  publisher: text('publisher').notNull(),
  url: text('url').notNull(),
});

export const reactions = sqliteTable('reactions', {
  id: text('id').primaryKey().notNull(),
  element1Id: text('element1Id').notNull(),
  element2Id: text('element2Id').notNull(),
  resultTitle: text('resultTitle').notNull(),
  observation: text('observation').notNull(),
  explanation: text('explanation').notNull(),
  effectType: text('effectType').notNull(),
  safetyGuidance: text('safetyGuidance').notNull(),
  reviewStatus: text('reviewStatus').notNull(),
  createdAt: text('createdAt'),
  updatedAt: text('updatedAt'),
});