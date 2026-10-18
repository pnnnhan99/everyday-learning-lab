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
  // To be extended by specific content types
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

type UnknownRecord = Record<string, unknown>;

function asRecord(input: unknown): UnknownRecord | null {
  return input !== null && typeof input === 'object' && !Array.isArray(input)
    ? (input as UnknownRecord)
    : null;
}

export function validateLearningContent(input: unknown): ValidationResult<LearningContent> {
  const record = asRecord(input);
  if (!record) {
    return { ok: false, error: 'Input must be an object' };
  }
  if (typeof record.id !== 'string' || record.id.length === 0) {
    return { ok: false, error: 'LearningContent.id is required and must be a string' };
  }
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
  return { ok: true, value: input as LearningContent };
}

export function validateApplication(input: unknown): ValidationResult<Application> {
  const record = asRecord(input);
  if (!record) {
    return { ok: false, error: 'Input must be an object' };
  }
  if (typeof record.id !== 'string' || record.id.length === 0) {
    return { ok: false, error: 'Application.id is required and must be a string' };
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
  if (typeof record.id !== 'string' || record.id.length === 0) {
    return { ok: false, error: 'Assessment.id is required and must be a string' };
  }
  if (!VALID_ASSESSMENT_TYPES.includes(record.type as (typeof VALID_ASSESSMENT_TYPES)[number])) {
    return {
      ok: false,
      error: `Assessment.type must be one of: ${VALID_ASSESSMENT_TYPES.join(', ')}`
    };
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
  if (typeof record.id !== 'string' || record.id.length === 0) {
    return { ok: false, error: 'Section.id is required and must be a string' };
  }
  return { ok: true, value: input as Section };
}

export function validateLesson(input: unknown): ValidationResult<Lesson> {
  const contentResult = validateLearningContent(input);
  if (!contentResult.ok) {
    return { ok: false, error: contentResult.error };
  }
  const record = asRecord(input) as UnknownRecord;
  if (!Array.isArray(record.sections)) {
    return { ok: false, error: 'Lesson.sections must be an array' };
  }
  return { ok: true, value: input as Lesson };
}

export function validateChallenge(input: unknown): ValidationResult<Challenge> {
  const contentResult = validateLearningContent(input);
  if (!contentResult.ok) {
    return { ok: false, error: contentResult.error };
  }
  const record = asRecord(input) as UnknownRecord;
  if (typeof record.realWorldQuestion !== 'string' || record.realWorldQuestion.length === 0) {
    return { ok: false, error: 'Challenge.realWorldQuestion is required and must be a string' };
  }
  if (!Array.isArray(record.requiredConcepts) || record.requiredConcepts.length === 0) {
    return { ok: false, error: 'Challenge.requiredConcepts must be a non-empty array' };
  }
  if (!Array.isArray(record.steps) || record.steps.length === 0) {
    return { ok: false, error: 'Challenge.steps must be a non-empty array' };
  }
  if (!Array.isArray(record.evidence)) {
    return { ok: false, error: 'Challenge.evidence must be an array' };
  }
  if (!Array.isArray(record.constraints)) {
    return { ok: false, error: 'Challenge.constraints must be an array' };
  }
  if (typeof record.evaluation !== 'string' || record.evaluation.length === 0) {
    return { ok: false, error: 'Challenge.evaluation is required and must be a string' };
  }
  if (!Array.isArray(record.linkedSimulationIds) || record.linkedSimulationIds.length === 0) {
    return { ok: false, error: 'Challenge.linkedSimulationIds must be a non-empty array' };
  }
  if (!Array.isArray(record.relatedLessonIds)) {
    return { ok: false, error: 'Challenge.relatedLessonIds must be an array' };
  }
  return { ok: true, value: input as Challenge };
}
