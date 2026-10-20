export const chemistryAcidsBasesLesson: Lesson = {
  id: 'chem-acids-bases-101',
  title: 'Understanding Acids and Bases',
  description: 'Learn about the properties of acids and bases, the pH scale, and common examples.',
  domain: 'chemistry',
  difficulty: 'beginner',
  language: 'en',
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
          itemIds: ['quiz-props-1', 'quiz-props-2']
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
