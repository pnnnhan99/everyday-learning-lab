import { notFound } from 'next/navigation';

import { LessonDetail } from '@/components/lesson-detail/LessonDetail';
import { getLessonById } from '@/learning/catalog';

export default async function LearnLessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = getLessonById(slug);

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
