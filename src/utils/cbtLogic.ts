/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Question, ExamResult, StudentInfo } from '../types/cbt';

export function formatSecondsToTimer(totalSeconds: number): string {
  const safeSec = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safeSec / 3600);
  const minutes = Math.floor((safeSec % 3600) / 60);
  const seconds = safeSec % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }
  return `${pad(minutes)}:${pad(seconds)}`;
}

export function isAnswerEmpty(val: any): boolean {
  if (val === undefined || val === null || val === '') return true;
  if (Array.isArray(val)) return val.length === 0;
  if (typeof val === 'object') {
    const keys = Object.keys(val);
    return keys.length === 0 || keys.every((k) => !val[k]);
  }
  return false;
}

export function checkAnswerCorrectness(question: Question, userAnswer: any): { isCorrect: boolean; pointsEarned: number } {
  if (isAnswerEmpty(userAnswer)) {
    return { isCorrect: false, pointsEarned: 0 };
  }

  const maxPoints = question.points || 10;

  switch (question.type) {
    case 'single_choice': {
      const isCorrect = String(userAnswer).trim().toUpperCase() === String(question.correctAnswer).trim().toUpperCase();
      return { isCorrect, pointsEarned: isCorrect ? maxPoints : 0 };
    }

    case 'multiple_choice': {
      if (!Array.isArray(userAnswer)) return { isCorrect: false, pointsEarned: 0 };
      const expected = (question.correctAnswer as string[]).map((s) => s.trim().toUpperCase()).sort();
      const actual = (userAnswer as string[]).map((s) => s.trim().toUpperCase()).sort();

      const isExactMatch = expected.length === actual.length && expected.every((val, idx) => val === actual[idx]);

      if (isExactMatch) {
        return { isCorrect: true, pointsEarned: maxPoints };
      }

      // Partial credit for complex answers without guessing penalty
      const correctSelected = actual.filter((a) => expected.includes(a)).length;
      const incorrectSelected = actual.filter((a) => !expected.includes(a)).length;
      const net = Math.max(0, correctSelected - incorrectSelected);
      const points = Math.round((net / expected.length) * maxPoints);
      return { isCorrect: points === maxPoints, pointsEarned: points };
    }

    case 'matching': {
      if (typeof userAnswer !== 'object' || !question.statements) return { isCorrect: false, pointsEarned: 0 };
      const statements = question.statements;
      let matchedCount = 0;

      statements.forEach((stmt) => {
        const userChoice = userAnswer[stmt.id];
        if (userChoice && String(userChoice).toUpperCase() === String(stmt.correctAnswer).toUpperCase()) {
          matchedCount++;
        }
      });

      const isAllCorrect = matchedCount === statements.length;
      const points = Math.round((matchedCount / statements.length) * maxPoints);
      return { isCorrect: isAllCorrect, pointsEarned: points };
    }

    case 'short_answer': {
      const cleanUser = String(userAnswer).trim().toLowerCase().replace(/,/g, '.');
      const cleanExpected = String(question.correctAnswer).trim().toLowerCase().replace(/,/g, '.');

      const isCorrect = cleanUser === cleanExpected || (!isNaN(Number(cleanUser)) && Number(cleanUser) === Number(cleanExpected));
      return { isCorrect, pointsEarned: isCorrect ? maxPoints : 0 };
    }

    default:
      return { isCorrect: false, pointsEarned: 0 };
  }
}

export function computeExamResult(
  student: StudentInfo,
  questions: Question[],
  answers: Record<string, any>,
  timeSpentSeconds: number
): ExamResult {
  let totalScore = 0;
  let maxScore = 0;
  let correctCount = 0;
  let answeredCount = 0;

  const details = questions.map((q) => {
    const userAns = answers[q.id];
    const isAnswered = !isAnswerEmpty(userAns);
    if (isAnswered) answeredCount++;

    const { isCorrect, pointsEarned } = checkAnswerCorrectness(q, userAns);
    if (isCorrect) correctCount++;

    totalScore += pointsEarned;
    maxScore += q.points || 10;

    return {
      questionId: q.id,
      number: q.number,
      type: q.type,
      userAnswer: userAns ?? null,
      isCorrect,
      pointsEarned,
      maxPoints: q.points || 10,
      explanation: q.explanation,
    };
  });

  const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
  const wrongCount = questions.length - correctCount;

  let grade: ExamResult['grade'] = 'Perlu Bimbingan';
  if (percentage >= 85) grade = 'Sangat Memuaskan';
  else if (percentage >= 70) grade = 'Memuaskan';
  else if (percentage >= 50) grade = 'Cukup';

  return {
    student,
    totalQuestions: questions.length,
    answeredCount,
    correctCount,
    wrongCount,
    score: totalScore,
    maxScore,
    percentage,
    grade,
    submittedAt: new Date().toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' }),
    timeSpentSeconds,
    details,
  };
}
