import { fetcher } from '@/lib/fetcher';
import type { Element } from '@/types/game';

export function getElements(): Promise<Element[]> {
  return fetcher<Element[]>('/api/elements');
}

export function getElement(id: string): Promise<Element> {
  return fetcher<Element>(`/api/elements/${id}`);
}
