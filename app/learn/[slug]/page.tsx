import { notFound } from 'next/navigation';

import { LessonDetail } from '@/components/lesson-detail/LessonDetail';
import { chemistryAcidsBasesLesson } from '@/learning/examples/chemistry-acids-bases';
import { mathematicsFractionsLesson } from '@/learning/examples/mathematics-fractions';
import { physicsProjectileLesson } from '@/learning/examples/physics-projectile';
import { biologyCO2O2Lesson } from '@/learning/examples/biology-co2-o2';
import type { Lesson } from '@/learning/types';

const lessonsBySlug: Record<string, Lesson> = {
  'chem-acids-bases-101': chemistryAcidsBasesLesson,
  'math-fractions-101': mathematicsFractionsLesson,
  'phys-projectile-101': physicsProjectileLesson,
  'bio-co2-o2-101': biologyCO2O2Lesson,
};

export default async function LearnLessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = lessonsBySlug[slug];

  if (!lesson) {
    notFound();
  }

  return (
    <div className="flex-1 p-6">
      <div className="mx-auto max-w-6xl">
        <LessonDetail lesson={lesson} />
      </div>
    </div>
  );
}
