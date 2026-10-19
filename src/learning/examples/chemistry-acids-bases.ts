import { Lesson } from '../types';

export const chemistryAcidsBasesLesson: Lesson = {
  id: 'chem-acids-bases-101',
  title: 'Understanding Acids and Bases',
  description: 'Learn about the properties of acids and bases, the pH scale, and common examples.',
  domain: 'chemistry',
  difficulty: 'beginner',
  language: 'en',
  reviewStatus: 'draft',
  prerequisites: ['basic-matter-concepts'],
  references: [
    'ref-chemistry-1',
    'ref-chemistry-2'
  ],
  sections: [
    {
      id: 'sec-properties',
      title: 'Properties of Acids and Bases',
      content: 'Acids are substances that donate hydrogen ions (H+) when dissolved in water, while bases accept hydrogen ions or donate hydroxide ions (OH-).',
      objectives: [
        'Identify common acids and bases',
        'Describe the general properties of acids and bases',
        'Explain the concept of pH'
      ],
      applications: [
        {
          id: 'app-vinegar-test',
          title: 'Testing Vinegar with pH Strips',
          description: 'Use pH strips to test the acidity of vinegar and other household substances.',
          type: 'interactive',
          resourceId: 'activity-vinegar-ph'
        },
        {
          id: 'app-simulation-ph-scale',
          title: 'Interactive pH Scale Simulation',
          description: 'Explore the pH scale with this interactive simulation.',
          type: 'simulation',
          resourceId: 'sim-ph-scale'
        }
      ],
      assessments: [
        {
          id: 'ass-properties-quiz',
          title: 'Properties Quiz',
          description: 'Test your understanding of acid and base properties.',
          type: 'quiz',
          itemIds: ['quiz-props-1', 'quiz-props-2'],
          items: [
            {
              id: 'quiz-props-1',
              prompt: 'In water, what does a base do?',
              options: [
                { id: 'a', text: 'It donates hydrogen ions (H⁺).' },
                { id: 'b', text: 'It accepts hydrogen ions or donates hydroxide ions (OH⁻).' },
                { id: 'c', text: 'It always has a pH below 7.' },
              ],
              correctOptionId: 'b',
              explanation:
                'Bases accept H⁺ or release OH⁻ in water, which raises the pH. Acids donate H⁺, and a pH below 7 indicates an acidic solution, not a base.',
            },
            {
              id: 'quiz-props-2',
              prompt: 'A solution has a pH of 3. How is it classified?',
              options: [
                { id: 'a', text: 'Acidic.' },
                { id: 'b', text: 'Neutral.' },
                { id: 'c', text: 'Basic.' },
              ],
              correctOptionId: 'a',
              explanation:
                'On the 0–14 pH scale, values below 7 are acidic, 7 is neutral, and above 7 are basic. A pH of 3 is strongly acidic.',
            },
          ],
        }
      ]
    },
    {
      id: 'sec-ph-scale',
      title: 'The pH Scale',
      content: 'The pH scale measures how acidic or basic a substance is, ranging from 0 to 14. A pH of 7 is neutral.',
      objectives: [
        'Read and interpret pH values',
        'Classify substances as acidic, neutral, or basic based on pH'
      ],
      applications: [
        {
          id: 'app-household-ph',
          title: 'Testing Household Substances',
          description: 'Measure the pH of various household liquids using a digital pH meter.',
          type: 'interactive',
          resourceId: 'activity-household-ph'
        }
      ],
      assessments: [
        {
          id: 'ass-ph-exercise',
          title: 'pH Classification Exercise',
          description: 'Classify given substances based on their pH values.',
          type: 'exercise',
          itemIds: ['exercise-ph-1', 'exercise-ph-2']
        }
      ]
    }
  ]
};
