import type { Lesson } from '@/learning/types';

export const mathematicsFractionsLessonEnhanced: Lesson = {
  id: 'math-fractions-101',
  title: 'Comparing Fractions: Cross Multiplication & Common Denominators',
  description: 'Learn to compare fractions using different strategies and verify with the model.',
  domain: 'mathematics',
  difficulty: 'beginner',
  language: 'en',
  prerequisites: ['Understand numerator/denominator'],
  references: [
    'Khan Academy: Fraction arithmetic',
    'Cross-multiplication',
  ],
  sections: [
    {
      id: 'strategies',
      title: 'Strategies for comparison',
      content: 'Use cross multiplication (a*d vs b*c) or convert to common denominators. Both are valid; choose based on what makes sense.',
      objectives: [
        'Compare fractions by cross multiplication',
        'Convert to equivalent fractions with common denominator',
      ],
      applications: [
        {
          id: 'app-compare',
          type: 'simulation',
          title: 'Fractions Comparator',
          description: 'Compare two fractions and see equivalents + decimals.',
          resourceId: 'mathematics.fractions-compare',
        },
      ],
      assessments: [],
    },
  ],
};
