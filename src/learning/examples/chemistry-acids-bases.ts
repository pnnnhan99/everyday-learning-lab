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
    'Khan Academy — Acids and bases tutorial (khanacademy.org)',
    'USGS — pH and Water (usgs.gov)',
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
          id: 'app-simulation-acid-base',
          title: 'Acid–Base CO₂ Model',
          description:
            'Run the acid–base CO₂ simulation to see how inputs change the resulting state. This is a teaching model, not a reaction predictor.',
          type: 'simulation',
          resourceId: 'chemistry.acid-base.co2'
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
      applications: [],
      assessments: [
        {
          id: 'ass-ph-exercise',
          title: 'pH Classification Exercise',
          description:
            'Classify each substance as acidic, neutral, or basic: lemon juice (pH ≈ 2), pure water (pH = 7), bleach (pH ≈ 12.5). Explain one choice in a sentence.',
          type: 'exercise',
          itemIds: ['exercise-ph-1', 'exercise-ph-2', 'exercise-ph-3']
        }
      ]
    }
  ]
};
