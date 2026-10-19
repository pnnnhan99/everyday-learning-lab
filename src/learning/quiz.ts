// React-free quiz model: pure data + pure grading logic so self-checks are
// unit-testable and reusable across any lesson.

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizItem {
  id: string;
  prompt: string;
  options: QuizOption[];
  correctOptionId: string;
  // Shown after the learner answers; explains *why* the answer is right/wrong.
  explanation: string;
}

export interface QuizItemResult {
  id: string;
  answeredOptionId: string | null;
  correctOptionId: string;
  isCorrect: boolean;
  // True when the learner picked an option that does not exist on the item.
  isInvalidAnswer: boolean;
}

export interface QuizResult {
  results: QuizItemResult[];
  answeredCount: number;
  correctCount: number;
  total: number;
}

type UnknownRecord = Record<string, unknown>;

function asRecord(input: unknown): UnknownRecord | null {
  return input !== null && typeof input === 'object' && !Array.isArray(input)
    ? (input as UnknownRecord)
    : null;
}

function nonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

// Returns null when valid, otherwise a human-readable error message.
export function validateQuizItem(input: unknown): string | null {
  const record = asRecord(input);
  if (!record) return 'QuizItem must be an object';
  if (!nonEmptyString(record.id)) return 'QuizItem.id is required';
  if (!nonEmptyString(record.prompt)) return `QuizItem "${String(record.id)}" needs a prompt`;
  if (!Array.isArray(record.options) || record.options.length < 2) {
    return `QuizItem "${String(record.id)}" needs at least two options`;
  }
  const optionIds = new Set<string>();
  for (const option of record.options) {
    const optionRecord = asRecord(option);
    if (!optionRecord || !nonEmptyString(optionRecord.id) || !nonEmptyString(optionRecord.text)) {
      return `QuizItem "${String(record.id)}" has an option without id/text`;
    }
    if (optionIds.has(optionRecord.id)) {
      return `QuizItem "${String(record.id)}" has a duplicate option id "${optionRecord.id}"`;
    }
    optionIds.add(optionRecord.id);
  }
  if (!nonEmptyString(record.correctOptionId) || !optionIds.has(record.correctOptionId)) {
    return `QuizItem "${String(record.id)}" has a correctOptionId that is not one of its options`;
  }
  if (!nonEmptyString(record.explanation)) {
    return `QuizItem "${String(record.id)}" needs an explanation`;
  }
  return null;
}

export function isQuizItem(input: unknown): input is QuizItem {
  return validateQuizItem(input) === null;
}

// Grades a quiz. Answers come from the UI as { [itemId]: optionId }.
// - A missing answer is unanswered (not counted as correct).
// - An answer pointing at a non-existent option is treated as invalid/incorrect.
// - Answers for unknown item ids are ignored.
export function gradeQuiz(items: QuizItem[], answers: Record<string, string>): QuizResult {
  const results: QuizItemResult[] = items.map((item) => {
    const answeredOptionId = answers[item.id] ?? null;
    const isInvalidAnswer =
      answeredOptionId !== null && !item.options.some((option) => option.id === answeredOptionId);
    const isCorrect = answeredOptionId === item.correctOptionId && !isInvalidAnswer;
    return {
      id: item.id,
      answeredOptionId,
      correctOptionId: item.correctOptionId,
      isCorrect,
      isInvalidAnswer,
    };
  });

  return {
    results,
    answeredCount: results.filter((result) => result.answeredOptionId !== null).length,
    correctCount: results.filter((result) => result.isCorrect).length,
    total: items.length,
  };
}
