import type { QuizItem } from './quiz';
import { validateQuizItem } from './quiz';

export type ReviewStatus = 'draft' | 'in-review' | 'expert-reviewed';

export interface LearningContent {
  id: string;
  title: string;
  description: string;
  domain: 'mathematics' | 'chemistry' | 'physics' | 'biology' | 'realworld';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  language: string;
  // Common fields for all content types
  prerequisites: string[];
  references: string[];
  // Scientific review state. Anything below 'expert-reviewed' must not be
  // presented as authoritative. Defaults to 'draft' when omitted.
  reviewStatus?: ReviewStatus;
  // To be extended by specific content typesf
}

export interface Lesson extends LearningContent {
  sections: Section[];
}

export interface Section {
  id: string;
  title: string;
  content: string;
  objectives: string[];
  applications: Application[];
  assessments: Assessment[];
}

export interface Application {
  id: string;
  title: string;
  description: string;
  type: 'simulation' | 'interactive' | 'video' | 'text';
  // Reference to a simulation contract or other resource
  resourceId: string;
}

export interface Assessment {
  id: string;
  title: string;
  description: string;
  type: 'quiz' | 'exercise' | 'project';
  // Reference to assessment items
  itemIds: string[];
  // Inline quiz items. Required for type === 'quiz' so a self-check can render
  // and grade without a separate item bank.
  items?: QuizItem[];
}

export interface Reference {
  id: string;
  title: string;
  author: string;
  year: number;
  publisher: string;
  url: string;
}

export interface Challenge extends LearningContent {
  realWorldQuestion: string;
  requiredConcepts: string[];
  steps: string[];
  evidence: string[];
  constraints: string[];
  evaluation: string;
  linkedSimulationIds: string[];
  relatedLessonIds: string[];
}

// Domain-specific extensions can be added here

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface MathematicsContent extends LearningContent {
  // Mathematics-specific fields
}


// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ChemistryContent extends LearningContent {
  // Chemistry-specific fields
}


// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface PhysicsContent extends LearningContent {
  // Physics-specific fields
}


// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface BiologyContent extends LearningContent {
  // Biology-specific fields
}


// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface RealworldContent extends LearningContent {
  // Real-world challenges-specific fields
}

export type ValidationResult<T> = {
  ok: boolean;
  value?: T;
  error?: string;
} & (
  | { ok: true; value: T }
  | { ok: false; error: string }
);

const VALID_DOMAINS = ['mathematics', 'chemistry', 'physics', 'biology', 'realworld'] as const;
const VALID_DIFFICULTIES = ['beginner', 'intermediate', 'advanced'] as const;
const VALID_APP_TYPES = ['simulation', 'interactive', 'video', 'text'] as const;
const VALID_ASSESSMENT_TYPES = ['quiz', 'exercise', 'project'] as const;
const VALID_REVIEW_STATUSES: ReviewStatus[] = ['draft', 'in-review', 'expert-reviewed'];

type UnknownRecord = Record<string, unknown>;

function asRecord(input: unknown): UnknownRecord | null {
  return input !== null && typeof input === 'object' && !Array.isArray(input)
    ? (input as UnknownRecord)
    : null;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function validateStringArray(value: unknown, label: string, allowEmpty = true): string | null {
  if (!Array.isArray(value)) return `${label} must be an array`;
  if (!allowEmpty && value.length === 0) return `${label} must not be empty`;
  for (const entry of value) {
    if (!isNonEmptyString(entry)) return `${label} must contain only non-empty strings`;
  }
  return null;
}

function findDuplicate(ids: string[]): string | null {
  const seen = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) return id;
    seen.add(id);
  }
  return null;
}

export function validateLearningContent(input: unknown): ValidationResult<LearningContent> {
  const record = asRecord(input);
  if (!record) {
    return { ok: false, error: 'Input must be an object' };
  }
  if (!isNonEmptyString(record.id)) {
    return { ok: false, error: 'LearningContent.id is required and must be a non-empty string' };
  }
  if (!isNonEmptyString(record.title)) {
    return { ok: false, error: 'LearningContent.title is required and must be a non-empty string' };
  }
  if (!isNonEmptyString(record.description)) {
    return { ok: false, error: 'LearningContent.description is required and must be a non-empty string' };
  }
  if (!isNonEmptyString(record.language)) {
    return { ok: false, error: 'LearningContent.language is required and must be a non-empty string' };
  }
  const prerequisitesError = validateStringArray(record.prerequisites, 'LearningContent.prerequisites');
  if (prerequisitesError) return { ok: false, error: prerequisitesError };
  const referencesError = validateStringArray(record.references, 'LearningContent.references');
  if (referencesError) return { ok: false, error: referencesError };
  if (!VALID_DOMAINS.includes(record.domain as (typeof VALID_DOMAINS)[number])) {
    return {
      ok: false,
      error: `LearningContent.domain must be one of: ${VALID_DOMAINS.join(', ')}`
    };
  }
  if (!VALID_DIFFICULTIES.includes(record.difficulty as (typeof VALID_DIFFICULTIES)[number])) {
    return {
      ok: false,
      error: `LearningContent.difficulty must be one of: ${VALID_DIFFICULTIES.join(', ')}`
    };
  }
  if (
    record.reviewStatus !== undefined &&
    !VALID_REVIEW_STATUSES.includes(record.reviewStatus as ReviewStatus)
  ) {
    return {
      ok: false,
      error: `LearningContent.reviewStatus must be one of: ${VALID_REVIEW_STATUSES.join(', ')}`
    };
  }
  return { ok: true, value: input as LearningContent };
}

export function validateApplication(input: unknown): ValidationResult<Application> {
  const record = asRecord(input);
  if (!record) {
    return { ok: false, error: 'Input must be an object' };
  }
  if (!isNonEmptyString(record.id)) {
    return { ok: false, error: 'Application.id is required and must be a non-empty string' };
  }
  if (!isNonEmptyString(record.title)) {
    return { ok: false, error: 'Application.title is required and must be a non-empty string' };
  }
  if (!isNonEmptyString(record.description)) {
    return { ok: false, error: 'Application.description is required and must be a non-empty string' };
  }
  if (!isNonEmptyString(record.resourceId)) {
    return { ok: false, error: 'Application.resourceId is required and must be a non-empty string' };
  }
  if (!VALID_APP_TYPES.includes(record.type as (typeof VALID_APP_TYPES)[number])) {
    return {
      ok: false,
      error: `Application.type must be one of: ${VALID_APP_TYPES.join(', ')}`
    };
  }
  return { ok: true, value: input as Application };
}

export function validateAssessment(input: unknown): ValidationResult<Assessment> {
  const record = asRecord(input);
  if (!record) {
    return { ok: false, error: 'Input must be an object' };
  }
  if (!isNonEmptyString(record.id)) {
    return { ok: false, error: 'Assessment.id is required and must be a non-empty string' };
  }
  if (!isNonEmptyString(record.title)) {
    return { ok: false, error: 'Assessment.title is required and must be a non-empty string' };
  }
  if (!isNonEmptyString(record.description)) {
    return { ok: false, error: 'Assessment.description is required and must be a non-empty string' };
  }
  if (!VALID_ASSESSMENT_TYPES.includes(record.type as (typeof VALID_ASSESSMENT_TYPES)[number])) {
    return {
      ok: false,
      error: `Assessment.type must be one of: ${VALID_ASSESSMENT_TYPES.join(', ')}`
    };
  }
  const itemIdsError = validateStringArray(record.itemIds, 'Assessment.itemIds');
  if (itemIdsError) return { ok: false, error: itemIdsError };
  if (record.items !== undefined) {
    if (!Array.isArray(record.items)) {
      return { ok: false, error: 'Assessment.items must be an array when present' };
    }
    const itemIdSet = new Set<string>();
    for (const item of record.items) {
      const quizError = validateQuizItem(item);
      if (quizError) {
        return { ok: false, error: quizError };
      }
      const itemId = (item as { id: string }).id;
      if (itemIdSet.has(itemId)) {
        return { ok: false, error: `Assessment "${record.id}" has a duplicate item id "${itemId}"` };
      }
      itemIdSet.add(itemId);
    }
  }
  if (record.type === 'quiz') {
    const hasItems = Array.isArray(record.items) && record.items.length > 0;
    const hasItemIds = Array.isArray(record.itemIds) && record.itemIds.length > 0;
    if (!hasItems && !hasItemIds) {
      return {
        ok: false,
        error: 'A quiz Assessment needs either inline items or at least one itemId'
      };
    }
  }
  return { ok: true, value: input as Assessment };
}

export function validateReference(input: unknown): ValidationResult<Reference> {
  const record = asRecord(input);
  if (!record) {
    return { ok: false, error: 'Input must be an object' };
  }
  if (typeof record.id !== 'string' || record.id.length === 0) {
    return { ok: false, error: 'Reference.id is required and must be a string' };
  }
  if (
    typeof record.url !== 'string' ||
    (!record.url.startsWith('http://') && !record.url.startsWith('https://'))
  ) {
    return {
      ok: false,
      error: 'Reference.url must be a valid URL starting with http:// or https://'
    };
  }
  return { ok: true, value: input as Reference };
}

export function validateSection(input: unknown): ValidationResult<Section> {
  const record = asRecord(input);
  if (!record) {
    return { ok: false, error: 'Input must be an object' };
  }
  if (!isNonEmptyString(record.id)) {
    return { ok: false, error: 'Section.id is required and must be a non-empty string' };
  }
  if (!isNonEmptyString(record.title)) {
    return { ok: false, error: `Section "${record.id}" needs a title` };
  }
  if (!isNonEmptyString(record.content)) {
    return { ok: false, error: `Section "${record.id}" needs content` };
  }
  const objectivesError = validateStringArray(record.objectives, `Section "${record.id}" objectives`);
  if (objectivesError) return { ok: false, error: objectivesError };
  if (!Array.isArray(record.applications)) {
    return { ok: false, error: `Section "${record.id}" applications must be an array` };
  }
  const applicationIds: string[] = [];
  for (const application of record.applications) {
    const result = validateApplication(application);
    if (!result.ok) return { ok: false, error: result.error };
    applicationIds.push(result.value.id);
  }
  const duplicateApplicationId = findDuplicate(applicationIds);
  if (duplicateApplicationId) {
    return { ok: false, error: `Section "${record.id}" has a duplicate application id "${duplicateApplicationId}"` };
  }
  if (!Array.isArray(record.assessments)) {
    return { ok: false, error: `Section "${record.id}" assessments must be an array` };
  }
  const assessmentIds: string[] = [];
  for (const assessment of record.assessments) {
    const result = validateAssessment(assessment);
    if (!result.ok) return { ok: false, error: result.error };
    assessmentIds.push(result.value.id);
  }
  const duplicateAssessmentId = findDuplicate(assessmentIds);
  if (duplicateAssessmentId) {
    return { ok: false, error: `Section "${record.id}" has a duplicate assessment id "${duplicateAssessmentId}"` };
  }
  return { ok: true, value: input as Section };
}

export function validateLesson(input: unknown): ValidationResult<Lesson> {
  const contentResult = validateLearningContent(input);
  if (!contentResult.ok) {
    return { ok: false, error: contentResult.error };
  }
  const record = asRecord(input) as UnknownRecord;
  if (!Array.isArray(record.sections) || record.sections.length === 0) {
    return { ok: false, error: 'Lesson.sections must be a non-empty array' };
  }
  const sectionIds: string[] = [];
  for (const section of record.sections) {
    const result = validateSection(section);
    if (!result.ok) return { ok: false, error: result.error };
    sectionIds.push(result.value.id);
  }
  const duplicateSectionId = findDuplicate(sectionIds);
  if (duplicateSectionId) {
    return { ok: false, error: `Lesson "${record.id}" has a duplicate section id "${duplicateSectionId}"` };
  }
  return { ok: true, value: input as Lesson };
}

export function validateChallenge(input: unknown): ValidationResult<Challenge> {
  const contentResult = validateLearningContent(input);
  if (!contentResult.ok) {
    return { ok: false, error: contentResult.error };
  }
  const record = asRecord(input) as UnknownRecord;
  if (!isNonEmptyString(record.realWorldQuestion)) {
    return { ok: false, error: 'Challenge.realWorldQuestion is required and must be a non-empty string' };
  }
  const requiredConceptsError = validateStringArray(record.requiredConcepts, 'Challenge.requiredConcepts', false);
  if (requiredConceptsError) return { ok: false, error: requiredConceptsError };
  const stepsError = validateStringArray(record.steps, 'Challenge.steps', false);
  if (stepsError) return { ok: false, error: stepsError };
  const evidenceError = validateStringArray(record.evidence, 'Challenge.evidence', false);
  if (evidenceError) return { ok: false, error: evidenceError };
  const constraintsError = validateStringArray(record.constraints, 'Challenge.constraints', false);
  if (constraintsError) return { ok: false, error: constraintsError };
  if (!isNonEmptyString(record.evaluation)) {
    return { ok: false, error: 'Challenge.evaluation is required and must be a non-empty string' };
  }
  const simulationsError = validateStringArray(
    record.linkedSimulationIds,
    'Challenge.linkedSimulationIds',
    false,
  );
  if (simulationsError) return { ok: false, error: simulationsError };
  const lessonsError = validateStringArray(record.relatedLessonIds, 'Challenge.relatedLessonIds');
  if (lessonsError) return { ok: false, error: lessonsError };
  return { ok: true, value: input as Challenge };
}
