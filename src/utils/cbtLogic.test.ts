/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { formatSecondsToTimer, isAnswerEmpty, checkAnswerCorrectness, computeExamResult } from './cbtLogic';
import { DEFAULT_QUESTIONS } from '../data/defaultQuestions';
import { StudentInfo } from '../types/cbt';

test('formatSecondsToTimer formats time accurately', () => {
  assert.equal(formatSecondsToTimer(0), '00:00');
  assert.equal(formatSecondsToTimer(65), '01:05');
  assert.equal(formatSecondsToTimer(3600), '01:00:00');
  assert.equal(formatSecondsToTimer(3665), '01:01:05');
});

test('isAnswerEmpty handles primitives and structures', () => {
  assert.equal(isAnswerEmpty(''), true);
  assert.equal(isAnswerEmpty(null), true);
  assert.equal(isAnswerEmpty(undefined), true);
  assert.equal(isAnswerEmpty([]), true);
  assert.equal(isAnswerEmpty({}), true);
  assert.equal(isAnswerEmpty('A'), false);
  assert.equal(isAnswerEmpty(['A']), false);
  assert.equal(isAnswerEmpty({ s1: 'BENAR' }), false);
});

test('checkAnswerCorrectness evaluates single choice accurately', () => {
  const q1 = DEFAULT_QUESTIONS[0]; // Correct is 'B'
  const correctRes = checkAnswerCorrectness(q1, 'B');
  assert.equal(correctRes.isCorrect, true);
  assert.equal(correctRes.pointsEarned, 10);

  const wrongRes = checkAnswerCorrectness(q1, 'A');
  assert.equal(wrongRes.isCorrect, false);
  assert.equal(wrongRes.pointsEarned, 0);
});

test('checkAnswerCorrectness evaluates multiple choice complex', () => {
  const q2 = DEFAULT_QUESTIONS[1]; // Correct is ['A', 'B', 'C'], points: 15
  const fullMatch = checkAnswerCorrectness(q2, ['B', 'A', 'C']);
  assert.equal(fullMatch.isCorrect, true);
  assert.equal(fullMatch.pointsEarned, 15);

  const partialMatch = checkAnswerCorrectness(q2, ['A', 'B']);
  assert.equal(partialMatch.isCorrect, false);
  assert.equal(partialMatch.pointsEarned > 0, true);
});

test('checkAnswerCorrectness evaluates short answer with number normalization', () => {
  const q6 = DEFAULT_QUESTIONS[5]; // Correct is '60'
  const matchNum = checkAnswerCorrectness(q6, ' 60 ');
  assert.equal(matchNum.isCorrect, true);
  assert.equal(matchNum.pointsEarned, 25);

  const wrongNum = checkAnswerCorrectness(q6, '50');
  assert.equal(wrongNum.isCorrect, false);
});

test('computeExamResult generates comprehensive recap', () => {
  const dummyStudent: StudentInfo = {
    nama: 'Budi Santoso',
    nisn: '1234567890',
    jenjang: 'SMP/MTs',
    paketSoal: 'Paket Tryout ANBK 2026',
    gender: 'L',
    tanggalLahir: '2010-05-15',
    tokenInput: 'PUSMENDIK26',
  };

  const answers = {
    'q-1': 'B', // correct 10
    'q-6': '60', // correct 25
  };

  const result = computeExamResult(dummyStudent, DEFAULT_QUESTIONS, answers, 120);
  assert.equal(result.answeredCount, 2);
  assert.equal(result.totalQuestions, 6);
  assert.equal(result.score >= 35, true);
  assert.equal(result.student.nama, 'Budi Santoso');
});
