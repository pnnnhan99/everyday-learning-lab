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

export function validateLearningContent(input: any): ValidationResult<LearningContent> {
  if (!input || typeof input !== 'object') {
    return { ok: false, error: 'Input must be an object' };
  }
  if (!input.id || typeof input.id !== 'string') {
    return { ok: false, error: 'LearningContent.id is required and must be a string' };
  }
  if (!VALID_DOMAINS.includes(input.domain)) {
    return {
      ok: false,
      error: `LearningContent.domain must be one of: ${VALID_DOMAINS.join(', ')}`
    };
  }
  if (!VALID_DIFFICULTIES.includes(input.difficulty)) {
    return {
      ok: false,
      error: `LearningContent.difficulty must be one of: ${VALID_DIFFICULTIES.join(', ')}`
    };
  }
  return { ok: true, value: input as LearningContent };
}

export function validateApplication(input: any): ValidationResult<Application> {
  if (!input || typeof input !== 'object') {
    return { ok: false, error: 'Input must be an object' };
  }
  if (!input.id || typeof input.id !== 'string') {
    return { ok: false, error: 'Application.id is required and must be a string' };
  }
  if (!VALID_APP_TYPES.includes(input.type)) {
    return {
      ok: false,
      error: `Application.type must be one of: ${VALID_APP_TYPES.join(', ')}`
    };
  }
  return { ok: true, value: input as Application };
}

export function validateAssessment(input: any): ValidationResult<Assessment> {
  if (!input || typeof input !== 'object') {
    return { ok: false, error: 'Input must be an object' };
  }
  if (!input.id || typeof input.id !== 'string') {
    return { ok: false, error: 'Assessment.id is required and must be a string' };
  }
  if (!VALID_ASSESSMENT_TYPES.includes(input.type)) {
    return {
      ok: false,
      error: `Assessment.type must be one of: ${VALID_ASSESSMENT_TYPES.join(', ')}`
    };
  }
  return { ok: true, value: input as Assessment };
}

export function validateReference(input: any): ValidationResult<Reference> {
  if (!input || typeof input !== 'object') {
    return { ok: false, error: 'Input must be an object' };
  }
  if (!input.id || typeof input.id !== 'string') {
    return { ok: false, error: 'Reference.id is required and must be a string' };
  }
  if (
    typeof input.url !== 'string' ||
    (!input.url.startsWith('http://') && !input.url.startsWith('https://'))
  ) {
    return {
      ok: false,
      error: 'Reference.url must be a valid URL starting with http:// or https://'
    };
  }
  return { ok: true, value: input as Reference };
}

export function validateSection(input: any): ValidationResult<Section> {
  if (!input || typeof input !== 'object') {
    return { ok: false, error: 'Input must be an object' };
  }
  if (!input.id || typeof input.id !== 'string') {
    return { ok: false, error: 'Section.id is required and must be a string' };
  }
  return { ok: true, value: input as Section };
}

export function validateLesson(input: any): ValidationResult<Lesson> {
  const contentResult = validateLearningContent(input);
  if (!contentResult.ok) {
    return { ok: false, error: contentResult.error };
  }
  if (!Array.isArray(input.sections)) {
    return { ok: false, error: 'Lesson.sections must be an array' };
  }
  return { ok: true, value: input as Lesson };
}
