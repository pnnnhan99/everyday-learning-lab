import type { Element, Reaction } from '@/types/game';
import type { ElementRepository, ReactionRepository } from '@/lib/repository';
import { getElementRepository, getReactionRepository } from '@/lib/sqliteRepository';
import { isDuplicatePair, normalizePair } from '@/lib/repository';

export { isDuplicatePair, normalizePair };

const elements: ElementRepository = getElementRepository();
const reactions: ReactionRepository = getReactionRepository();

export async function listElements(): Promise<Element[]> { return elements.getAll(); }
export async function listReactions(): Promise<Reaction[]> { return reactions.getAll(); }
export async function findReactionPair(firstId: string, secondId: string): Promise<Reaction | null> { return reactions.findByPair(firstId, secondId); }
export async function createElement(el: Element): Promise<Element> { return elements.create(el); }
export async function updateElement(id: string, patch: Partial<Element>): Promise<Element | null> { return elements.update(id, patch); }
export async function deleteElement(id: string): Promise<boolean> { return elements.delete(id); }
export async function createReaction(r: Reaction): Promise<Reaction> { return reactions.create(r); }
export async function deleteReaction(e1: string, e2: string): Promise<boolean> { return reactions.delete(e1, e2); }
