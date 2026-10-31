/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ExamResult, Question } from '../types/cbt';
import { CheckCircle2, XCircle, Award, RotateCcw, Code, ChevronDown, ChevronUp, FileSpreadsheet } from 'lucide-react';
import { formatSecondsToTimer } from '../utils/cbtLogic';

interface ResultModalProps {
  result: ExamResult;
  questions: Question[];
  onRestart: () => void;
  onOpenGenerator: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({
  result,
  questions,
  onRestart,
  onOpenGenerator,
}) => {
  const [showReview, setShowReview] = useState(false);
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const isLulus = result.percentage >= 70;

  return (
    <div className="max-w-3xl w-full mx-auto p-4 sm:p-6 my-auto">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1b365d] via-blue-900 to-[#1b365d] text-white p-6 sm:p-8 text-center border-b-4 border-amber-400">
          <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-3 border border-white/20">
            <Award className="w-10 h-10 text-amber-300" />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-wide text-amber-300">
            Ujian Telah Selesai
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 mt-1">
            Terima kasih, <strong>{result.student.nama}</strong> ({result.student.nisn}). Seluruh lembar jawaban Anda telah berhasil direkapitulasi.
          </p>
        </div>

        {/* Score Summary Metrics */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Nilai Akhir (0-100)</span>
              <span className="text-3xl sm:text-4xl font-black text-[#1b365d] block mt-1">
                {result.percentage}
              </span>
              <span className="text-[11px] font-semibold text-slate-500">Skor: {result.score}/{result.maxScore}</span>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
              <span className="text-[10px] uppercase font-bold text-emerald-600 block">Jawaban Benar</span>
              <span className="text-3xl sm:text-4xl font-black text-emerald-700 block mt-1">
                {result.correctCount}
              </span>
              <span className="text-[11px] font-semibold text-emerald-600">dari {result.totalQuestions} Soal</span>
            </div>

            <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 text-center">
              <span className="text-[10px] uppercase font-bold text-rose-600 block">Jawaban Salah</span>
              <span className="text-3xl sm:text-4xl font-black text-rose-700 block mt-1">
                {result.wrongCount}
              </span>
              <span className="text-[11px] font-semibold text-rose-600">Soal</span>
            </div>

            <div
              className={`p-4 rounded-2xl border text-center ${
                isLulus ? 'bg-amber-50 border-amber-200' : 'bg-slate-100 border-slate-300'
              }`}
            >
              <span className="text-[10px] uppercase font-bold text-amber-900 block">Status Kelulusan</span>
              <span
                className={`text-lg sm:text-xl font-black block mt-2 ${
                  isLulus ? 'text-amber-800' : 'text-slate-600'
                }`}
              >
                {isLulus ? 'TUNTAS' : 'BELUM TUNTAS'}
              </span>
              <span className="text-[10px] font-medium text-slate-500">
                Waktu: {formatSecondsToTimer(result.timeSpentSeconds)}
              </span>
            </div>
          </div>

          {/* Database Notice */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-start gap-3">
            <FileSpreadsheet className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
            <div className="text-xs text-blue-900 leading-relaxed">
              <strong>Koneksi Database Spreadsheet Otomatis:</strong> Dalam versi Google Apps Script, baris ini otomatis terkirim dan tercatat ke sheet <code>HASIL_UJIAN</code> dengan kolom waktu submit, NISN, nama, jumlah benar/salah, nilai akhir, serta JSON jawaban lengkap.
            </div>
          </div>

          {/* Toggle Answer Review */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowReview(!showReview)}
              className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition"
            >
              <span>{showReview ? 'Sembunyikan Pembahasan & Kunci' : 'Tampilkan Pembahasan Soal & Kunci Jawaban'}</span>
              {showReview ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showReview && (
              <div className="mt-4 space-y-3 max-h-96 overflow-y-auto pr-1">
                {result.details.map((detail, idx) => {
                  const q = questions.find((item) => item.id === detail.questionId);
                  if (!q) return null;
                  const isExpanded = !!expandedQuestions[q.id];

                  let userAnswerDisplay = '-';
                  if (detail.userAnswer) {
                    if (typeof detail.userAnswer === 'string') userAnswerDisplay = detail.userAnswer;
                    else if (Array.isArray(detail.userAnswer)) userAnswerDisplay = detail.userAnswer.join(', ');
                    else if (typeof detail.userAnswer === 'object') userAnswerDisplay = JSON.stringify(detail.userAnswer);
                  }

                  let correctAnswerDisplay = '-';
                  if (typeof q.correctAnswer === 'string') correctAnswerDisplay = q.correctAnswer;
                  else if (Array.isArray(q.correctAnswer)) correctAnswerDisplay = q.correctAnswer.join(', ');
                  else if (typeof q.correctAnswer === 'object') correctAnswerDisplay = JSON.stringify(q.correctAnswer);

                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-xl border text-xs transition ${
                        detail.isCorrect ? 'bg-emerald-50/50 border-emerald-200' : 'bg-rose-50/50 border-rose-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {detail.isCorrect ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                          )}
                          <span className="font-bold text-slate-900">
                            Soal No. {q.number || idx + 1}: {q.category}
                          </span>
                        </div>
                        <span className="font-bold text-slate-700">
                          {detail.pointsEarned} / {detail.maxPoints} Poin
                        </span>
                      </div>

                      <p className="text-slate-700 mt-2 font-medium line-clamp-2">{q.questionText}</p>

                      <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                        <div className="p-2 bg-white rounded-lg border border-slate-200">
                          <span className="text-slate-400 block">Jawaban Anda:</span>
                          <span className="font-bold text-slate-800">{userAnswerDisplay}</span>
                        </div>
                        <div className="p-2 bg-white rounded-lg border border-slate-200">
                          <span className="text-emerald-600 block">Kunci Jawaban Benar:</span>
                          <span className="font-bold text-emerald-700">{correctAnswerDisplay}</span>
                        </div>
                      </div>

                      {q.explanation && (
                        <div className="mt-2 p-2.5 bg-blue-50/60 rounded-lg text-blue-900 text-[11px] leading-relaxed border border-blue-100">
                          <strong>Pembahasan:</strong> {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={onRestart}
              className="w-full py-3 bg-slate-200 hover:bg-slate-300 active:scale-98 text-slate-800 font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Ulangi Simulasi Ujian</span>
            </button>

            <button
              type="button"
              onClick={onOpenGenerator}
              className="w-full py-3 bg-[#1b365d] hover:bg-blue-900 active:scale-98 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-md shadow-blue-900/20"
            >
              <Code className="w-4 h-4 text-amber-300" />
              <span>Buka Kode Apps Script & Spreadsheet</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
