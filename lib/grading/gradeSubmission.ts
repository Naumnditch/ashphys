/**
 * Grades one practice submission. Pure — the submit route does the database
 * reads and writes around it — so the whole path from "what the answer box
 * sent" to "right or wrong" is unit tested in one place.
 *
 * Numeric answers arrive either as plain text ("3.0e8", "3.0 x 10^8") or as
 * the LaTeX the maths keyboard produces ("3.0\times10^{8}"); the numeric
 * grader reads both. Text answers are compared on a normalized key
 * (lib/math/latexToGradable.ts → normalizeForComparison).
 */

import { gradeNumeric, specFromProblem, type GradeReason, type ProblemAnswerColumns } from './numericAnswer';
import { normalizeForComparison } from '../math/latexToGradable';

export interface SubmissionProblem extends ProblemAnswerColumns {
  answer_type: 'multiple_choice' | 'numeric' | 'free_text' | string;
}

export interface SubmissionGrade {
  isCorrect: boolean;
  correctAnswerLabel: string;
  gradingMethod: 'mcq' | 'numeric' | 'text';
  gradeReason: GradeReason | null;
  toleranceUsed: number | null;
  normalizedAnswer: string | null;
  feedback: string | null;
}

/** Text answers match if they are identical once case, spacing and notation are folded. */
export function textAnswersMatch(submitted: string, expected: string | null | undefined): boolean {
  const a = String(submitted).trim().toLowerCase();
  const b = String(expected ?? '').trim().toLowerCase();
  if (a === b) return true;
  const na = normalizeForComparison(submitted);
  return na !== '' && na === normalizeForComparison(String(expected ?? ''));
}

export function gradeSubmission(
  problem: SubmissionProblem,
  submittedAnswer: string,
  correctOption: { id: string; option_text: string } | null = null,
): SubmissionGrade {
  const out: SubmissionGrade = {
    isCorrect: false,
    correctAnswerLabel: problem.answer_correct ?? '',
    gradingMethod: 'text',
    gradeReason: null,
    toleranceUsed: null,
    normalizedAnswer: null,
    feedback: null,
  };

  if (problem.answer_type === 'multiple_choice') {
    out.gradingMethod = 'mcq';
    if (correctOption) {
      out.isCorrect = String(submittedAnswer) === String(correctOption.id);
      out.correctAnswerLabel = correctOption.option_text;
      out.gradeReason = out.isCorrect ? 'match' : 'wrong-value';
      out.normalizedAnswer = correctOption.option_text;
    }
    return out;
  }

  if (problem.answer_type === 'numeric') {
    const spec = specFromProblem(problem);
    if (spec) {
      out.gradingMethod = 'numeric';
      out.toleranceUsed = spec.tolerance ?? 0.02;
      const result = gradeNumeric(String(submittedAnswer), spec);
      out.isCorrect = result.correct;
      out.gradeReason = result.reason;
      out.feedback = result.feedback;
      out.normalizedAnswer = result.parsedValue === null ? null : String(result.parsedValue);
      if (problem.answer_unit) out.correctAnswerLabel = `${problem.answer_correct} ${problem.answer_unit}`;
    } else {
      // The stored answer isn't a number — fall back to text comparison
      // rather than marking every submission wrong.
      out.isCorrect = textAnswersMatch(submittedAnswer, problem.answer_correct);
      out.gradeReason = out.isCorrect ? 'match' : 'wrong-value';
    }
    return out;
  }

  out.isCorrect = textAnswersMatch(submittedAnswer, problem.answer_correct);
  out.gradeReason = out.isCorrect ? 'match' : 'wrong-value';
  out.normalizedAnswer = normalizeForComparison(submittedAnswer);
  return out;
}
