import type { Element, Reaction } from '@/types/game';

export interface ElementRepository {
  getAll(): Promise<Element[]>;
  getById(id: string): Promise<Element | null>;
  create(el: Element): Promise<Element>;
  update(id: string, patch: Partial<Element>): Promise<Element | null>;
  delete(id: string): Promise<boolean>;
}

export interface ReactionRepository {
  getAll(): Promise<Reaction[]>;
  findByPair(e1: string, e2: string): Promise<Reaction | null>;
  create(r: Reaction): Promise<Reaction>;
  delete(e1: string, e2: string): Promise<boolean>;
}

export interface Repositories {
  elements: ElementRepository;
  reactions: ReactionRepository;
}

export function isDuplicatePair(
  a: { element1Id: string; element2Id: string },
  b: { element1Id: string; element2Id: string },
): boolean {
  return (
    (a.element1Id === b.element1Id && a.element2Id === b.element2Id) ||
    (a.element1Id === b.element2Id && a.element2Id === b.element1Id)
  );
}

export function normalizePair(e1: string, e2: string): string {
  return e1 < e2 ? `${e1}|${e2}` : `${e2}|${e1}`;
}
