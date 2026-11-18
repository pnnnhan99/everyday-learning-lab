'use client';

import { ArrowUpRight, X } from 'lucide-react';

import { periodicTableReferences } from '@/data/periodic-table/references';
import type { Dictionary, Locale } from '@/i18n/dict';
import type { DataQualifier, PeriodicElement, Quantity } from '@/types/periodic';

interface PeriodicElementDetailsProps {
  element: PeriodicElement | null;
  locale: Locale;
  dictionary: Dictionary;
  onClose: () => void;
}

const numberFormat = (locale: Locale) =>
  new Intl.NumberFormat(locale === 'vi' ? 'vi-VN' : 'en-US', {
    maximumFractionDigits: 4,
  });

function formatValue(quantity: Quantity, locale: Locale): string {
  if (quantity.value === null) return '—';
  const formatter = numberFormat(locale);
  if (quantity.unit === 'K') {
    const celsius = quantity.value - 273.15;
    return `${formatter.format(quantity.value)} K (${formatter.format(celsius)} °C)`;
  }
  return `${formatter.format(quantity.value)} ${quantity.unit}`;
}

function DataQualityBadge({
  qualifier,
  dictionary,
}: {
  qualifier: DataQualifier;
  dictionary: Dictionary;
}) {
  const t = dictionary.periodicTable;
  if (qualifier === 'measured') return null;
  const tone =
    qualifier === 'predicted' || qualifier === 'estimated'
      ? 'border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-200'
      : qualifier === 'disputed'
        ? 'border-rose-300 bg-rose-50 text-rose-800 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-200'
        : 'border-zinc-300 bg-zinc-50 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300';
  return (
    <span className={`inline-flex rounded-full border px-1.5 py-0.5 text-[10px] font-medium ${tone}`}>
      {t.qualifiers[qualifier]}
    </span>
  );
}

function PropertyRow({
  label,
  quantity,
  dictionary,
  locale,
}: {
  label: string;
  quantity: Quantity;
  dictionary: Dictionary;
  locale: Locale;
}) {
  const t = dictionary.periodicTable;
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-zinc-100 py-1.5 last:border-0 dark:border-zinc-800">
      <dt className="text-xs text-zinc-500 dark:text-zinc-400">{label}</dt>
      <dd className="flex items-center gap-1.5 text-right text-sm font-medium">
        <span>{quantity.value === null ? t.noValue : formatValue(quantity, locale)}</span>
        <DataQualityBadge qualifier={quantity.qualifier} dictionary={dictionary} />
      </dd>
    </div>
  );
}

export default function PeriodicElementDetails({
  element,
  locale,
  dictionary,
  onClose,
}: PeriodicElementDetailsProps) {
  const t = dictionary.periodicTable;

  if (!element) {
    return (
      <aside
        aria-labelledby="periodic-details-placeholder"
        className="rounded-2xl border border-dashed border-zinc-300 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900/40"
      >
        <h2 id="periodic-details-placeholder" className="text-base font-semibold">
          {t.details}
        </h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{t.selectPrompt}</p>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{t.selectPromptHint}</p>
      </aside>
    );
  }

  const name = element.name[locale];
  const alternateName = element.name[locale === 'vi' ? 'en' : 'vi'];
  const neutrons =
    element.atomicMass.value === null
      ? null
      : Math.round(element.atomicMass.value) - element.atomicNumber;
  const references = element.referenceIds
    .map((id) => periodicTableReferences.find((reference) => reference.id === id))
    .filter((reference): reference is (typeof periodicTableReferences)[number] => Boolean(reference));

  return (
    <aside
      id="periodic-element-details"
      aria-labelledby="periodic-details-heading"
      className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40"
    >
      <p aria-live="polite" className="sr-only">
        {t.showingDetails} {name}
      </p>

      <div className="flex items-start justify-between gap-3 border-b border-zinc-200 p-4 dark:border-zinc-800">
        <div className="flex items-start gap-3">
          <span
            aria-hidden
            className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          >
            <span className="font-mono text-[10px] opacity-70">{element.atomicNumber}</span>
            <span className="text-2xl font-bold leading-none">{element.symbol}</span>
          </span>
          <div>
            <h2 id="periodic-details-heading" className="text-xl font-bold tracking-tight">
              {name}
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {alternateName} · {t.categories[element.category]}
            </p>
            <p className="mt-1 font-mono text-xs text-zinc-500 dark:text-zinc-400">
              {t.atomicMass}: {formatValue(element.atomicMass, locale)}{' '}
              <DataQualityBadge qualifier={element.atomicMass.qualifier} dictionary={dictionary} />
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={t.close}
          className="rounded-lg border border-zinc-200 p-1.5 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
        >
          <X size={16} aria-hidden />
        </button>
      </div>

      <div className="space-y-5 p-4">
        <section aria-labelledby="periodic-identity">
          <h3 id="periodic-identity" className="text-sm font-semibold">
            {t.identity}
          </h3>
          <dl className="mt-2 grid grid-cols-2 gap-x-4">
            <div className="border-b border-zinc-100 py-1.5 dark:border-zinc-800">
              <dt className="text-xs text-zinc-500 dark:text-zinc-400">{t.atomicNumber}</dt>
              <dd className="text-sm font-medium">{element.atomicNumber}</dd>
            </div>
            <div className="border-b border-zinc-100 py-1.5 dark:border-zinc-800">
              <dt className="text-xs text-zinc-500 dark:text-zinc-400">{t.symbol}</dt>
              <dd className="text-sm font-medium">{element.symbol}</dd>
            </div>
            <div className="border-b border-zinc-100 py-1.5 dark:border-zinc-800">
              <dt className="text-xs text-zinc-500 dark:text-zinc-400">{t.category}</dt>
              <dd className="text-sm font-medium">{t.categories[element.category]}</dd>
            </div>
            <div className="border-b border-zinc-100 py-1.5 dark:border-zinc-800">
              <dt className="text-xs text-zinc-500 dark:text-zinc-400">{t.group}</dt>
              <dd className="text-sm font-medium">
                {element.group === null ? t.noValue : element.group}
              </dd>
            </div>
            <div className="border-b border-zinc-100 py-1.5 dark:border-zinc-800">
              <dt className="text-xs text-zinc-500 dark:text-zinc-400">{t.period}</dt>
              <dd className="text-sm font-medium">{element.period}</dd>
            </div>
            <div className="border-b border-zinc-100 py-1.5 dark:border-zinc-800">
              <dt className="text-xs text-zinc-500 dark:text-zinc-400">{t.block}</dt>
              <dd className="text-sm font-medium">{t.blocks[element.block]}</dd>
            </div>
            <div className="border-b border-zinc-100 py-1.5 dark:border-zinc-800">
              <dt className="text-xs text-zinc-500 dark:text-zinc-400">{t.standardState}</dt>
              <dd className="flex items-center gap-1.5 text-sm font-medium">
                {t.states[element.standardState]}
                <DataQualityBadge qualifier={element.standardStateQualifier} dictionary={dictionary} />
              </dd>
            </div>
            <div className="border-b border-zinc-100 py-1.5 dark:border-zinc-800">
              <dt className="text-xs text-zinc-500 dark:text-zinc-400">{t.reviewStatus}</dt>
              <dd className="text-sm font-medium">{dictionary.review[element.reviewStatus]}</dd>
            </div>
          </dl>
          <p className="mt-1 text-[10px] text-zinc-500 dark:text-zinc-400">{t.conditions}</p>
        </section>

        <section aria-labelledby="periodic-structure">
          <h3 id="periodic-structure" className="text-sm font-semibold">
            {t.structure}
          </h3>
          <dl className="mt-2 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg bg-zinc-50 p-2 dark:bg-zinc-950/60">
              <dt className="text-[10px] text-zinc-500 dark:text-zinc-400">{t.protons}</dt>
              <dd className="font-semibold">{element.atomicNumber}</dd>
            </div>
            <div className="rounded-lg bg-zinc-50 p-2 dark:bg-zinc-950/60">
              <dt className="text-[10px] text-zinc-500 dark:text-zinc-400">{t.electrons}</dt>
              <dd className="font-semibold">{element.atomicNumber}</dd>
            </div>
            <div className="rounded-lg bg-zinc-50 p-2 dark:bg-zinc-950/60">
              <dt className="text-[10px] text-zinc-500 dark:text-zinc-400">{t.neutrons}</dt>
              <dd className="font-semibold">{neutrons ?? '—'}</dd>
            </div>
          </dl>
          <p className="mt-1 text-[10px] text-zinc-500 dark:text-zinc-400">{t.neutronsNote}</p>
          <div className="mt-3 rounded-lg border border-zinc-200 bg-zinc-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950/60">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{t.configuration}</p>
            <p className="mt-0.5 font-mono text-sm font-medium break-words">
              {element.electronConfiguration}
            </p>
            {element.electronConfigurationNote && (
              <p className="mt-1 text-[10px] text-zinc-500 dark:text-zinc-400">
                {element.electronConfigurationNote[locale]}
              </p>
            )}
          </div>
        </section>

        <section aria-labelledby="periodic-physical">
          <h3 id="periodic-physical" className="text-sm font-semibold">
            {t.physical}
          </h3>
          <dl className="mt-2">
            <PropertyRow
              label={t.meltingPoint}
              quantity={element.physical.meltingPointK}
              dictionary={dictionary}
              locale={locale}
            />
            <PropertyRow
              label={t.boilingPoint}
              quantity={element.physical.boilingPointK}
              dictionary={dictionary}
              locale={locale}
            />
            <PropertyRow
              label={t.density}
              quantity={element.physical.densityGcm3}
              dictionary={dictionary}
              locale={locale}
            />
          </dl>
        </section>

        <section aria-labelledby="periodic-chemical">
          <h3 id="periodic-chemical" className="text-sm font-semibold">
            {t.chemical}
          </h3>
          <dl className="mt-2">
            <div className="flex items-baseline justify-between gap-3 border-b border-zinc-100 py-1.5 dark:border-zinc-800">
              <dt className="text-xs text-zinc-500 dark:text-zinc-400">{t.oxidationStates}</dt>
              <dd className="text-right text-sm font-medium">
                {element.chemical.oxidationStates.join(', ')}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-3 border-b border-zinc-100 py-1.5 dark:border-zinc-800">
              <dt className="text-xs text-zinc-500 dark:text-zinc-400">{t.commonOxidationStates}</dt>
              <dd className="text-right text-sm font-medium">
                {element.chemical.commonOxidationStates.join(', ')}
              </dd>
            </div>
            <PropertyRow
              label={t.electronegativity}
              quantity={element.chemical.electronegativity}
              dictionary={dictionary}
              locale={locale}
            />
          </dl>
        </section>

        <section aria-labelledby="periodic-occurrence">
          <h3 id="periodic-occurrence" className="text-sm font-semibold">
            {t.occurrence}
          </h3>
          <p className="mt-1.5 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
            {element.occurrence[locale]}
          </p>
        </section>

        <section aria-labelledby="periodic-applications">
          <h3 id="periodic-applications" className="text-sm font-semibold">
            {t.applications}
          </h3>
          <ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
            {element.applications.map((application) => (
              <li key={application.en}>{application[locale]}</li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="periodic-discovery">
          <h3 id="periodic-discovery" className="text-sm font-semibold">
            {t.discovery}
          </h3>
          <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
            <dt className="text-xs text-zinc-500 dark:text-zinc-400">{t.discoveryYear}</dt>
            <dd>{element.discovery.year ?? t.notRecorded}</dd>
            <dt className="text-xs text-zinc-500 dark:text-zinc-400">{t.discoveredBy}</dt>
            <dd>{element.discovery.discoveredBy ?? t.notRecorded}</dd>
            <dt className="text-xs text-zinc-500 dark:text-zinc-400">{t.discoveryPlace}</dt>
            <dd>{element.discovery.place?.[locale] ?? t.notRecorded}</dd>
          </dl>
          {element.discovery.year === null && element.discovery.discoveredBy === null && (
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{t.unknownDiscovery}</p>
          )}
        </section>

        {element.dataNotes.length > 0 && (
          <section aria-labelledby="periodic-notes">
            <h3 id="periodic-notes" className="text-sm font-semibold">
              {t.dataNotes}
            </h3>
            <ul className="mt-1.5 list-disc space-y-1 pl-5 text-xs leading-5 text-zinc-600 dark:text-zinc-300">
              {element.dataNotes.map((note) => (
                <li key={note.en}>{note[locale]}</li>
              ))}
            </ul>
          </section>
        )}

        <section aria-labelledby="periodic-review">
          <h3 id="periodic-review" className="text-sm font-semibold">
            {t.reviewStatus}
          </h3>
          <p className="mt-1 text-sm font-medium">{dictionary.review[element.reviewStatus]}</p>
          <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">{t.reviewNote}</p>
        </section>

        <section aria-labelledby="periodic-references">
          <h3 id="periodic-references" className="text-sm font-semibold">
            {t.references}
          </h3>
          <ul className="mt-1.5 space-y-1.5 text-xs">
            {references.map((reference) => (
              <li key={reference.id}>
                <a
                  href={reference.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-start gap-1 font-medium text-blue-700 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:text-blue-300"
                >
                  <span>
                    {reference.title} — {reference.publisher}
                  </span>
                  <ArrowUpRight size={12} aria-hidden className="mt-0.5 shrink-0" />
                </a>
              </li>
            ))}
          </ul>
        </section>

        <p className="rounded-lg border border-amber-300/60 bg-amber-50 p-2.5 text-[11px] leading-5 text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
          {t.educationalNotice}
        </p>
      </div>
    </aside>
  );
}
