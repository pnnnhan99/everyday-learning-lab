import { Lesson } from '../types';

export const mathematicsFractionsLesson: Lesson = {
  id: 'math-fractions-101',
  title: 'Introduction to Fractions',
  description: 'Learn what fractions are, how to represent them, and basic operations.',
  domain: 'mathematics',
  difficulty: 'beginner',
  language: 'en',
  reviewStatus: 'draft',
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
          itemIds: ['quiz-frac-id-1', 'quiz-frac-id-2'],
          items: [
            {
              id: 'quiz-frac-id-1',
              prompt: 'In the fraction 3/5, what does the 5 represent?',
              options: [
                { id: 'a', text: 'The number of parts being counted (numerator).' },
                { id: 'b', text: 'The total number of equal parts the whole is divided into (denominator).' },
                { id: 'c', text: 'The result of dividing 5 by 3.' },
              ],
              correctOptionId: 'b',
              explanation:
                'The denominator (bottom number) tells how many equal parts make up the whole. The numerator (top number, here 3) counts how many of those parts we have.',
            },
            {
              id: 'quiz-frac-id-2',
              prompt: 'Which fraction is equivalent to 1/2?',
              options: [
                { id: 'a', text: '2/3' },
                { id: 'b', text: '3/4' },
                { id: 'c', text: '4/8' },
              ],
              correctOptionId: 'c',
              explanation:
                '4/8 simplifies to 1/2 because dividing the numerator and denominator by 4 gives 1/2. 2/3 and 3/4 simplify only to themselves, so they differ from 1/2.',
            },
          ],
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
