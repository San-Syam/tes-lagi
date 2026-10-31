/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type QuestionType = 'single_choice' | 'multiple_choice' | 'matching' | 'short_answer';

export interface SingleChoiceOption {
  key: string; // 'A', 'B', 'C', 'D', 'E'
  text: string;
}

export interface StatementItem {
  id: string;
  statement: string;
  correctAnswer: 'BENAR' | 'SALAH' | 'SESUAI' | 'TIDAK_SESUAI';
}

export interface Question {
  id: string;
  number: number;
  type: QuestionType;
  category: 'Literasi Membaca' | 'Numerasi' | 'TKA Matematika' | 'TKA Bahasa Indonesia' | 'Skala Karakter';
  jenjang: 'SD/MI' | 'SMP/MTs' | 'SMA/MA/SMK';
  stimulusTitle?: string;
  stimulusContent?: string;
  stimulusBadge?: string;
  stimulusImageUrl?: string;
  questionText: string;
  options?: SingleChoiceOption[];
  statements?: StatementItem[];
  correctAnswer: string | string[] | Record<string, string>; // single choice: 'B', multi choice: ['A', 'C'], matching: {s1: 'BENAR'}, short_answer: 'jawaban'
  explanation?: string;
  points: number;
}

export interface StudentInfo {
  nama: string;
  nisn: string;
  jenjang: 'SD/MI' | 'SMP/MTs' | 'SMA/MA/SMK';
  paketSoal: string;
  gender: 'L' | 'P';
  tanggalLahir: string;
  tokenInput: string;
}

export interface ExamSettings {
  title: string;
  subTitle: string;
  jenjang: 'SD/MI' | 'SMP/MTs' | 'SMA/MA/SMK';
  subject: string;
  durationMinutes: number;
  token: string;
  totalSoal: number;
  kkm: number;
  sheetNamePrefix: string;
}

export interface ExamResult {
  student: StudentInfo;
  totalQuestions: number;
  answeredCount: number;
  correctCount: number;
  wrongCount: number;
  score: number;
  maxScore: number;
  percentage: number;
  grade: 'Sangat Memuaskan' | 'Memuaskan' | 'Cukup' | 'Perlu Bimbingan';
  submittedAt: string;
  timeSpentSeconds: number;
  details: {
    questionId: string;
    number: number;
    type: QuestionType;
    userAnswer: any;
    isCorrect: boolean;
    pointsEarned: number;
    maxPoints: number;
    explanation?: string;
  }[];
}
