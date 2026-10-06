import type { ElementType } from '@/types/game';
import { FlaskConical, TestTube, Apple, Biohazard } from 'lucide-react';

export const elementTypeIcon: Record<ElementType, typeof FlaskConical> = {
  acid: TestTube,
  base: FlaskConical,
  food: Apple,
  chemical: Biohazard,
};

export const elementTypeLabel: Record<ElementType, string> = {
  acid: 'Acid',
  base: 'Base',
  food: 'Food',
  chemical: 'Chemical',
};
