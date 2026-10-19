import type { Lesson } from '@/learning/types';

export const physicsProjectileLesson: Lesson = {
  id: 'phys-projectile-101',
  title: 'Projectile Motion: Range, Height, and Flight Time',
  description:
    'Model how launch speed, angle, and gravity shape a projectile’s trajectory. Predict range and peak height, then check the predictions against the simulation.',
  domain: 'physics',
  difficulty: 'beginner',
  language: 'en',
  reviewStatus: 'draft',
  prerequisites: ['Basic vector decomposition (sine and cosine of an angle)'],
  references: [
    'Halliday, Resnick, Walker — Fundamentals of Physics (projectile motion chapter)',
    'The Physics Classroom: Vectors and Projectiles',
  ],
  sections: [
    {
      id: 'intro',
      title: 'The shape of a throw',
      content:
        'A ball thrown into the air follows a parabola. Its horizontal motion is steady (constant velocity) while its vertical motion is a free fall (constant acceleration). Combining the two gives the familiar arc.',
      objectives: [
        'Separate horizontal and vertical motion',
        'Connect the parabola to constant gravity',
      ],
      applications: [],
      assessments: [],
    },
    {
      id: 'equations',
      title: 'Equations of motion',
      content:
        'Launch with speed v and angle θ. Then vx = v·cos(θ) and vy = v·sin(θ). The flight time is 2·vy/g, the range is vx·flight time, and the peak height is vy²/(2g). These come directly from projectile kinematics.',
      objectives: [
        'Apply the three kinematic equations',
        'Notice the complementary-angle symmetry: 30° and 60° share the same range',
      ],
      applications: [],
      assessments: [
        {
          id: 'predict-check',
          type: 'quiz',
          title: 'Predict then check',
          description: 'Check your understanding of how launch conditions shape the trajectory.',
          itemIds: ['q-angle', 'q-assumption'],
          items: [
            {
              id: 'q-angle',
              prompt:
                'Two projectiles are launched at the same speed: one at 30°, one at 60°. What happens to their range?',
              options: [
                { id: 'a', text: 'The 30° launch travels farther.' },
                { id: 'b', text: 'They land at the same range.' },
                { id: 'c', text: 'The 60° launch travels farther.' },
              ],
              correctOptionId: 'b',
              explanation:
                'Range depends on sin(2θ), and sin(2×30°) = sin(60°) = sin(2×60°) = sin(120°). Complementary angles (adding to 90°) give the same range, so 30° and 60° match.',
            },
            {
              id: 'q-assumption',
              prompt: 'Which assumption does this projectile model make?',
              options: [
                { id: 'a', text: 'Air resistance slows the projectile down.' },
                { id: 'b', text: 'Gravity changes with altitude.' },
                { id: 'c', text: 'There is no air resistance and launch/landing heights are equal.' },
              ],
              correctOptionId: 'c',
              explanation:
                'The model uses constant gravity and ignores air resistance, with equal launch and landing heights. Real throws deviate from this, which is why the model is for learning, not aiming.',
            },
          ],
        },
      ],
    },
    {
      id: 'simulation',
      title: 'Play with the model',
      content:
        'Use the simulation below to vary speed, angle, and gravity. Watch how range and peak height respond. Then compare against your prediction.',
      objectives: [
        'Test predictions against the model',
        'Relate the assumptions (no drag, flat ground) to real-world throws',
      ],
      applications: [
        {
          id: 'app-projectile',
          type: 'simulation',
          title: 'Projectile motion model',
          description: 'Compute range, peak height, and flight time from launch parameters.',
          resourceId: 'physics.projectile',
        },
      ],
      assessments: [],
    },
  ],
};

export default physicsProjectileLesson;
