import { Lesson } from '../types';

export const mathematicsFractionsLesson: Lesson = {
  id: 'math-fractions-101',
  title: 'Introduction to Fractions',
  description: 'Learn what fractions are, how to represent them, and basic operations.',
  domain: 'mathematics',
  difficulty: 'beginner',
  language: 'en',
  prerequisites: ['basic-arithmetic'],
  references: [
    'ref-math-1',
    'ref-math-2'
  ],
  sections: [
    {
      id: 'sec-what-is-fraction',
      title: 'What is a Fraction?',
      content: 'A fraction represents a part of a whole or a division of quantities.',
      objectives: [
        'Identify the numerator and denominator in a fraction',
        'Represent fractions using diagrams and number lines'
      ],
      applications: [
        {
          id: 'app-fraction-strips',
          title: 'Using Fraction Strips',
          description: 'Use physical or virtual fraction strips to visualize fractions.',
          type: 'interactive',
          resourceId: 'activity-fraction-strips'
        },
        {
          id: 'app-simulation-fraction-pizza',
          title: 'Fraction Pizza Simulation',
          description: 'Build pizzas with different toppings to learn about fractions.',
          type: 'simulation',
          resourceId: 'sim-fraction-pizza'
        }
      ],
      assessments: [
        {
          id: 'ass-fraction-identify',
          title: 'Fraction Identification Quiz',
          description: 'Identify fractions from diagrams and numerical representations.',
          type: 'quiz',
          itemIds: ['quiz-frac-id-1', 'quiz-frac-id-2']
        }
      ]
    },
    {
      id: 'sec-equivalent-fractions',
      title: 'Equivalent Fractions',
      content: 'Equivalent fractions represent the same value even though they may look different.',
      objectives: [
        'Find equivalent fractions by multiplying or dividing numerator and denominator',
        'Simplify fractions to their lowest terms'
      ],
      applications: [
        {
          id: 'app-equivalent-fractions-interactive',
          title: 'Matching Equivalent Fractions',
          description: 'Match pairs of equivalent fractions in this interactive activity.',
          type: 'interactive',
          resourceId: 'activity-eq-fractions'
        }
      ],
      assessments: [
        {
          id: 'ass-equivalent-exercise',
          title: 'Equivalent Fractions Exercise',
          description: 'Generate equivalent fractions and simplify given fractions.',
          type: 'exercise',
          itemIds: ['exercise-eq-frac-1', 'exercise-eq-frac-2']
        }
      ]
    }
  ]
};
