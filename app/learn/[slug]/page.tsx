import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { LessonDetail } from '@/components/lesson-detail/LessonDetail';
import { getLessonById, getLocalizedLesson } from '@/learning/catalog';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const lesson = getLocalizedLesson(slug, 'vi');
  if (!lesson) return { title: 'Lesson not found' };
  return {
    title: lesson.title,
    description: lesson.description,
    alternates: { canonical: `/learn/${slug}` },
  };
}

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
