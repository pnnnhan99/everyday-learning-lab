'use client';

import React, { useState } from 'react';

import type { Assessment } from '@/learning/types';
import { gradeQuiz } from '@/learning/quiz';

// Renders an inline quiz self-check: one radio group per item, immediate
// feedback per answer, and a running score. All state is local; nothing is
// persisted, so no progress is claimed to be saved.
export const SelfCheck: React.FC<{ assessment: Assessment }> = ({ assessment }) => {
  const items = assessment.items ?? [];
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const graded = submitted ? gradeQuiz(items, answers) : null;

  const handleSelect = (itemId: string, optionId: string) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [itemId]: optionId }));
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
  };

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-white/10 p-3">
        <h4 className="text-sm font-medium text-white">{assessment.title}</h4>
        <p className="text-sm text-white/60">{assessment.description}</p>
        <p className="mt-1 text-xs italic text-white/40">
          {assessment.itemIds.length} item(s) in this {assessment.type}.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-lg border border-white/10 bg-black/20 p-4">
      <div>
        <h4 className="text-sm font-medium text-white">{assessment.title}</h4>
        <p className="text-sm text-white/60">{assessment.description}</p>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(true);
        }}
        className="space-y-5"
      >
        {items.map((item, index) => {
          const result = graded?.results.find((entry) => entry.id === item.id);
          return (
            <fieldset key={item.id} className="space-y-2">
              <legend className="text-sm font-medium text-white/90">
                {index + 1}. {item.prompt}
              </legend>
              <div className="space-y-1">
                {item.options.map((option) => {
                  const isSelected = answers[item.id] === option.id;
                  const isCorrectOption = option.id === item.correctOptionId;
                  // Only reveal correctness after submit.
                  const showAsCorrect = Boolean(result?.isCorrect && isSelected);
                  const showAsIncorrect = Boolean(result && isSelected && !result.isCorrect);

                  return (
                    <label
                      key={option.id}
                      className={`flex items-start gap-2 rounded border px-3 py-2 text-sm transition ${
                        showAsCorrect
                          ? 'border-emerald-400/60 bg-emerald-400/10 text-emerald-100'
                          : showAsIncorrect
                            ? 'border-red-400/60 bg-red-400/10 text-red-100'
                            : result && isCorrectOption
                              ? 'border-emerald-400/40 bg-emerald-400/5 text-white/80'
                              : 'border-white/10 bg-white/5 text-white/80 hover:bg-white/10'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`${assessment.id}:${item.id}`}
                        value={option.id}
                        checked={isSelected}
                        disabled={submitted}
                        onChange={() => handleSelect(item.id, option.id)}
                        className="mt-0.5 accent-sky-400"
                      />
                      <span>{option.text}</span>
                    </label>
                  );
                })}
              </div>

              {result && (
                <p
                  className={`text-xs leading-5 ${
                    result.isCorrect ? 'text-emerald-200' : 'text-amber-200'
                  }`}
                >
                  <strong className="font-semibold">
                    {result.isCorrect ? 'Correct. ' : 'Not quite. '}
                  </strong>
                  {item.explanation}
                </p>
              )}
            </fieldset>
          );
        })}

        <div className="flex flex-wrap items-center gap-3">
          {!submitted ? (
            <button
              type="submit"
              className="rounded bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
            >
              Check answers
            </button>
          ) : (
            <>
              <p className="text-sm text-white/70">
                Score: <strong className="text-white">{graded?.correctCount}</strong> / {graded?.total}
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="rounded border border-white/15 px-3 py-1.5 text-sm text-white/80 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
              >
                Try again
              </button>
            </>
          )}
          <p className="text-xs text-white/40">Answers are checked in your browser only.</p>
        </div>
      </form>
    </div>
  );
};

export default SelfCheck;
