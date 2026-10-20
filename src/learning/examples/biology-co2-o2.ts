import type { Lesson } from '@/learning/types';

export const biologyCO2O2Lesson: Lesson = {
  id: 'bio-co2-o2-101',
  title: 'Photosynthesis and Respiration: The CO₂–O₂ Balance',
  description:
    'Explore how light, CO₂, water, and leaf area drive the balance between photosynthesis and respiration. Predict when a plant becomes a net producer or consumer of oxygen.',
  domain: 'biology',
  difficulty: 'beginner',
  language: 'en',
  reviewStatus: 'draft',
  prerequisites: ['Basic cell biology ideas', 'Gas exchange in plants'],
  references: [
    'Photosynthesis — Britannica',
    'Cellular respiration — Khan Academy',
  ],
  sections: [
    {
      id: 'intro',
      title: 'The daily cycle',
      content:
        'Plants photosynthesize in light, producing O₂ and consuming CO₂. They respire continuously, consuming O₂ and releasing CO₂. The net balance depends on environmental conditions.',
      objectives: [
        'Describe the opposing processes of photosynthesis and respiration',
        'Identify which process dominates in light vs. dark',
      ],
      applications: [],
      assessments: [],
    },
    {
      id: 'factors',
      title: 'What limits photosynthesis?',
      content:
        'Key limiting factors include light intensity, CO₂ availability, and water. Leaf area also matters for the total rate. Increasing one factor tends to increase photosynthesis until another becomes limiting.',
      objectives: [
        'List common limiting factors',
        'Explain how they interact to set the overall rate',
      ],
      applications: [],
      assessments: [
        {
          id: 'predict-balance',
          type: 'quiz',
          title: 'Predict the balance',
          description: 'Given the conditions, decide whether the plant is a net O₂ producer or consumer.',
          itemIds: ['q-low-light', 'q-dark'],
          items: [
            {
              id: 'q-low-light',
              prompt: 'A plant sits in dim light with high CO₂. What is the most likely net gas exchange?',
              options: [
                { id: 'a', text: 'Net O₂ production (photosynthesis exceeds respiration).' },
                { id: 'b', text: 'Net O₂ consumption (respiration exceeds photosynthesis).' },
                { id: 'c', text: 'Exactly zero net exchange.' },
              ],
              correctOptionId: 'b',
              explanation:
                'Photosynthesis needs light, so dim light keeps it low while respiration continues. When respiration exceeds photosynthesis, the plant consumes O₂ overall.',
            },
            {
              id: 'q-dark',
              prompt: 'In full darkness, which process still runs?',
              options: [
                { id: 'a', text: 'Photosynthesis only.' },
                { id: 'b', text: 'Both photosynthesis and respiration.' },
                { id: 'c', text: 'Respiration only.' },
              ],
              correctOptionId: 'c',
              explanation:
                'Photosynthesis requires light, so it stops in darkness. Respiration runs continuously to power the cell, so the plant consumes O₂ and releases CO₂ at night.',
            },
          ],
        },
      ],
    },
    {
      id: 'simulation',
      title: 'Explore the balance',
      content:
        'Use the model below to vary conditions and observe net rate and gas exchange. Pay special attention to when net rate crosses zero.',
      objectives: [
        'Interpret photosynthesis, respiration, and net rates',
        'Recognize conditions that favor net O₂ production vs. consumption',
      ],
      applications: [
        {
          id: 'app-co2-o2',
          type: 'simulation',
          title: 'CO₂–O₂ Balance Model',
          description: 'A simplified heuristic model of photosynthesis vs. respiration under different conditions.',
          resourceId: 'biology.co2-o2',
        },
      ],
      assessments: [],
    },
  ],
};
