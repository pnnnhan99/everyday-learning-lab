import { describe, expect, it } from 'vitest';

import { gradeQuiz, isQuizItem, validateQuizItem, type QuizItem } from '@/learning/quiz';
import { validateAssessment, validateLearningContent, validateLesson } from '@/learning/types';

const sampleItems: QuizItem[] = [
  {
    id: 'q1',
    prompt: 'What is 2 + 2?',
    options: [
      { id: 'a', text: '3' },
      { id: 'b', text: '4' },
    ],
    correctOptionId: 'b',
    explanation: 'Basic addition.',
  },
  {
    id: 'q2',
    prompt: 'What is 5 - 1?',
    options: [
      { id: 'a', text: '4' },
      { id: 'b', text: '6' },
    ],
    correctOptionId: 'a',
    explanation: 'Basic subtraction.',
  },
];

describe('validateQuizItem', () => {
  it('accepts a valid item', () => {
    expect(validateQuizItem(sampleItems[0])).toBeNull();
  });

  it('rejects an item whose correctOptionId is not an option', () => {
    const bad = { ...sampleItems[0], correctOptionId: 'zzz' };
    expect(validateQuizItem(bad)).toMatch(/correctOptionId/);
  });

  it('rejects an item with fewer than two options', () => {
    const bad = { ...sampleItems[0], options: [{ id: 'a', text: 'only' }] };
    expect(validateQuizItem(bad)).toMatch(/at least two options/);
  });

  it('rejects an item with duplicate option ids', () => {
    const bad = {
      ...sampleItems[0],
      options: [
        { id: 'a', text: 'one' },
        { id: 'a', text: 'two' },
      ],
    };
    expect(validateQuizItem(bad)).toMatch(/duplicate option id/);
  });

  it('isQuizItem reflects validity', () => {
    expect(isQuizItem(sampleItems[0])).toBe(true);
    expect(isQuizItem({ id: 'x' })).toBe(false);
  });
});

describe('gradeQuiz', () => {
  it('scores all-correct answers', () => {
    const result = gradeQuiz(sampleItems, { q1: 'b', q2: 'a' });
    expect(result.correctCount).toBe(2);
    expect(result.answeredCount).toBe(2);
    expect(result.total).toBe(2);
    expect(result.results.every((r) => r.isCorrect)).toBe(true);
  });

  it('scores partial answers and leaves unanswered items incorrect', () => {
    const result = gradeQuiz(sampleItems, { q1: 'b' });
    expect(result.correctCount).toBe(1);
    expect(result.answeredCount).toBe(1);
    const q2 = result.results.find((r) => r.id === 'q2');
    expect(q2?.isCorrect).toBe(false);
    expect(q2?.answeredOptionId).toBeNull();
  });

  it('treats a wrong answer as incorrect', () => {
    const result = gradeQuiz(sampleItems, { q1: 'a', q2: 'a' });
    expect(result.correctCount).toBe(1);
    expect(result.results.find((r) => r.id === 'q1')?.isCorrect).toBe(false);
  });

  it('treats an answer pointing at a non-existent option as invalid and incorrect', () => {
    const result = gradeQuiz(sampleItems, { q1: 'nope' });
    const q1 = result.results.find((r) => r.id === 'q1');
    expect(q1?.isInvalidAnswer).toBe(true);
    expect(q1?.isCorrect).toBe(false);
  });

  it('ignores answers for unknown item ids', () => {
    const result = gradeQuiz(sampleItems, { q1: 'b', q2: 'a', ghost: 'a' });
    expect(result.correctCount).toBe(2);
    expect(result.total).toBe(2);
  });

  it('handles an empty quiz', () => {
    const result = gradeQuiz([], {});
    expect(result.total).toBe(0);
    expect(result.correctCount).toBe(0);
  });
});

describe('learning validators with quiz items and review status', () => {
  const baseContent = {
    id: 'lesson-1',
    title: 'T',
    description: 'D',
    domain: 'physics',
    difficulty: 'beginner',
    language: 'en',
    prerequisites: [],
    references: [],
  };

  it('rejects an unknown reviewStatus', () => {
    const result = validateLearningContent({ ...baseContent, reviewStatus: 'peer-approved' });
    expect(result.ok).toBe(false);
  });

  it('accepts a valid reviewStatus', () => {
    const result = validateLearningContent({ ...baseContent, reviewStatus: 'draft' });
    expect(result.ok).toBe(true);
  });

  it('rejects a quiz assessment with malformed inline items', () => {
    const result = validateAssessment({
      id: 'a1',
      title: 'Quiz',
      description: 'd',
      type: 'quiz',
      itemIds: ['q1'],
      items: [{ id: 'q1', prompt: 'p', options: [{ id: 'a', text: 'x' }], correctOptionId: 'a', explanation: 'e' }],
    });
    expect(result.ok).toBe(false);
  });

  it('accepts a quiz assessment with valid inline items', () => {
    const result = validateAssessment({
      id: 'a1',
      title: 'Quiz',
      description: 'd',
      type: 'quiz',
      itemIds: ['q1', 'q2'],
      items: sampleItems,
    });
    expect(result.ok).toBe(true);
  });

  it('validates a full lesson containing inline quiz items', () => {
    const lesson = {
      ...baseContent,
      reviewStatus: 'draft',
      sections: [
        {
          id: 's1',
          title: 'S',
          content: 'c',
          objectives: [],
          applications: [],
          assessments: [
            {
              id: 'a1',
              title: 'Quiz',
              description: 'd',
              type: 'quiz',
              itemIds: ['q1', 'q2'],
              items: sampleItems,
            },
          ],
        },
      ],
    };
    expect(validateLesson(lesson).ok).toBe(true);
  });
});
