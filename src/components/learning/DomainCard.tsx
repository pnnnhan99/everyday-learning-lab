'use client';

import Link from 'next/link';
import { ArrowRight, Atom, Boxes, FlaskConical, Leaf, Puzzle, Ruler, type LucideIcon } from 'lucide-react';

import type { ReviewStatus } from '@/learning/types';
import {
  getDomainChallenge,
  getDomainHref,
  getDomainLesson,
  getLocalizedChallenge,
  getLocalizedLesson,
  type LearningDomain,
} from '@/learning/catalog';
import { lab3dHref } from '@/learning/lab3d';
import { useDictionary, useLocale } from '@/i18n/useDictionary';

const DOMAIN_ICONS: Record<LearningDomain['key'], LucideIcon> = {
  mathematics: Ruler,
  chemistry: FlaskConical,
  physics: Atom,
  biology: Leaf,
  realworld: Puzzle,
};

function reviewBadgeClasses(status: ReviewStatus): string {
  return status === 'expert-reviewed'
    ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300'
    : 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300';
}

export default function DomainCard({ domain }: { domain: LearningDomain }) {
  const dictionary = useDictionary();
  const locale = useLocale();
  const Icon = DOMAIN_ICONS[domain.key];
  const lesson = getDomainLesson(domain);
  const challenge = getDomainChallenge(domain);
  const localizedLesson = getLocalizedLesson(lesson?.id, locale);
  const localizedChallenge = getLocalizedChallenge(challenge?.id, locale);
  const href = getDomainHref(domain);
  const isChallenge = Boolean(challenge);
  const reviewStatus: ReviewStatus | undefined = lesson?.reviewStatus ?? challenge?.reviewStatus;

  return (
    <article className="flex flex-col rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:border-zinc-700">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300">
          <Icon size={17} aria-hidden />
        </span>
        <h2 className="text-lg font-semibold">{dictionary.domains[domain.key]}</h2>
      </div>

      <p className="mt-2 flex-1 text-sm text-zinc-600 dark:text-zinc-300">{dictionary.domainSummaries[domain.key]}</p>

      <div className="mt-4 space-y-1 border-t border-zinc-100 pt-3 dark:border-zinc-800">
        <p className="text-xs font-medium text-zinc-500">
          {isChallenge ? dictionary.common.challenge : dictionary.common.lesson}:{' '}
          {localizedLesson?.title ?? localizedChallenge?.title}
        </p>
        {reviewStatus && (
          <p
            className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold ${reviewBadgeClasses(reviewStatus)}`}
          >
            {dictionary.review[reviewStatus]}
          </p>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <Link
          href={href}
          className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:text-blue-400"
        >
          {isChallenge ? dictionary.common.openChallenge : dictionary.common.startLesson}{' '}
          <ArrowRight size={14} aria-hidden />
        </Link>
        {'lab3dModel' in domain && domain.lab3dModel && (
          <Link
            href={lab3dHref(domain.lab3dModel)}
            className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:hover:text-zinc-200"
          >
            <Boxes size={13} aria-hidden /> {dictionary.common.open3d}
          </Link>
        )}
      </div>
    </article>
  );
}
