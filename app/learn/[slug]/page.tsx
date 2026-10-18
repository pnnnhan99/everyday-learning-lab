import { chemistryAcidsBasesLesson } from '@/learning/examples/chemistry-acids-bases';
import { mathematicsFractionsLesson } from '@/learning/examples/mathematics-fractions';
import { registerAllSimulations } from '@/simulations';
import { LessonDetail } from '@/components/lesson-detail/LessonDetail';
import { notFound } from 'next/navigation';
import { globalRegistry } from '@/core/simulation/registry';

registerAllSimulations();

const lessonsBySlug: Record<string, typeof chemistryAcidsBasesLesson> = {
  'chem-acids-bases-101': chemistryAcidsBasesLesson,
  'math-fractions-101': mathematicsFractionsLesson,
};

export default async function LearnLessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = lessonsBySlug[slug];

  if (!lesson) {
    notFound();
  }

  const registry = new Map<string, import('@/core/simulation/types').SimulationContract<unknown, unknown>>();
  for (const sim of globalRegistry.list()) {
    registry.set(sim.id, {
      initialize: async () => undefined,
      run: (input?: unknown) => globalRegistry.create(sim.id)?.run(input),
    });
  }

  return (
    <div className="flex-1 p-6">
      <div className="mx-auto max-w-6xl">
        <LessonDetail lesson={lesson} simulationRegistry={registry} />
      </div>
    </div>
  );
}
