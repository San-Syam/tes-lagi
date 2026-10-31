/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Question } from '../types/cbt';
import { FileText, CheckSquare, Layers, Edit3, HelpCircle } from 'lucide-react';

interface QuestionPanelProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  currentAnswer: any;
  onAnswerChange: (val: any) => void;
  fontSize: 'sm' | 'md' | 'lg';
}

export const QuestionPanel: React.FC<QuestionPanelProps> = ({
  question,
  currentIndex,
  totalQuestions,
  currentAnswer,
  onAnswerChange,
  fontSize,
}) => {
  const textSizeClass = {
    sm: 'text-sm leading-relaxed',
    md: 'text-base leading-relaxed',
    lg: 'text-lg leading-relaxed',
  }[fontSize];

  const headingSizeClass = {
    sm: 'text-base font-bold',
    md: 'text-lg font-bold',
    lg: 'text-xl font-bold',
  }[fontSize];

  const renderOptions = () => {
    switch (question.type) {
      case 'single_choice': {
        const selected = typeof currentAnswer === 'string' ? currentAnswer : '';
        return (
          <div className="space-y-3">
            {question.options?.map((opt) => {
              const isChecked = selected === opt.key;
              return (
                <label
                  key={opt.key}
                  className={`flex items-start gap-3.5 p-3.5 sm:p-4 rounded-xl border-2 cursor-pointer transition select-none ${
                    isChecked
                      ? 'bg-blue-50/80 border-blue-600 ring-4 ring-blue-500/10 shadow-sm'
                      : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name={`radio_${question.id}`}
                    value={opt.key}
                    checked={isChecked}
                    onChange={() => onAnswerChange(opt.key)}
                    className="sr-only"
                  />
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm shrink-0 border-2 transition ${
                      isChecked
                        ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                        : 'bg-slate-100 border-slate-300 text-slate-700'
                    }`}
                  >
                    {opt.key}
                  </div>
                  <div className={`flex-1 text-slate-800 ${textSizeClass}`}>
                    {opt.text}
                  </div>
                </label>
              );
            })}
          </div>
        );
      }

      case 'multiple_choice': {
        const curList: string[] = Array.isArray(currentAnswer) ? currentAnswer : [];
        const handleToggle = (key: string) => {
          let updated: string[];
          if (curList.includes(key)) {
            updated = curList.filter((k) => k !== key);
          } else {
            updated = [...curList, key];
          }
          onAnswerChange(updated);
        };

        return (
          <div className="space-y-3">
            <div className="text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 mb-2">
              ℹ️ Pilihan Ganda Kompleks: Anda dapat memilih lebih dari satu jawaban yang benar.
            </div>
            {question.options?.map((opt) => {
              const isChecked = curList.includes(opt.key);
              return (
                <label
                  key={opt.key}
                  className={`flex items-start gap-3.5 p-3.5 sm:p-4 rounded-xl border-2 cursor-pointer transition select-none ${
                    isChecked
                      ? 'bg-blue-50/80 border-blue-600 ring-4 ring-blue-500/10 shadow-sm'
                      : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    value={opt.key}
                    checked={isChecked}
                    onChange={() => handleToggle(opt.key)}
                    className="sr-only"
                  />
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 border-2 transition ${
                      isChecked
                        ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                        : 'bg-slate-100 border-slate-300 text-slate-700'
                    }`}
                  >
                    {opt.key}
                  </div>
                  <div className={`flex-1 text-slate-800 ${textSizeClass}`}>
                    {opt.text}
                  </div>
                </label>
              );
            })}
          </div>
        );
      }

      case 'matching': {
        const userObj: Record<string, string> =
          typeof currentAnswer === 'object' && currentAnswer !== null ? currentAnswer : {};

        const handleSetStatement = (id: string, val: 'BENAR' | 'SALAH') => {
          onAnswerChange({
            ...userObj,
            [id]: val,
          });
        };

        return (
          <div className="space-y-4">
            <div className="text-xs font-semibold text-amber-900 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 mb-2">
              ℹ️ Tentukan nilai kebenaran untuk setiap pernyataan di bawah ini:
            </div>
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 text-xs uppercase font-bold border-b border-slate-200">
                    <th className="p-3 sm:p-4">Pernyataan</th>
                    <th className="p-3 text-center w-24">Benar</th>
                    <th className="p-3 text-center w-24">Salah</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-sm">
                  {question.statements?.map((stmt, idx) => {
                    const chosen = userObj[stmt.id];
                    return (
                      <tr key={stmt.id} className="hover:bg-slate-50/80 transition">
                        <td className={`p-3.5 sm:p-4 text-slate-800 ${textSizeClass}`}>
                          <span className="font-bold text-slate-500 mr-2">{idx + 1}.</span>
                          {stmt.statement}
                        </td>
                        <td className="p-3 text-center align-middle">
                          <button
                            type="button"
                            onClick={() => handleSetStatement(stmt.id, 'BENAR')}
                            className={`w-full py-2 rounded-lg font-bold text-xs transition border ${
                              chosen === 'BENAR'
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                                : 'bg-slate-50 text-slate-600 border-slate-300 hover:bg-slate-100'
                            }`}
                          >
                            Benar
                          </button>
                        </td>
                        <td className="p-3 text-center align-middle">
                          <button
                            type="button"
                            onClick={() => handleSetStatement(stmt.id, 'SALAH')}
                            className={`w-full py-2 rounded-lg font-bold text-xs transition border ${
                              chosen === 'SALAH'
                                ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                                : 'bg-slate-50 text-slate-600 border-slate-300 hover:bg-slate-100'
                            }`}
                          >
                            Salah
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      }

      case 'short_answer': {
        const val = typeof currentAnswer === 'string' ? currentAnswer : '';
        return (
          <div className="space-y-3">
            <div className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              ℹ️ Isian Singkat: Masukkan jawaban angka atau kata kunci singkat tanpa spasi berlebih.
            </div>
            <div className="relative">
              <input
                type="text"
                value={val}
                onChange={(e) => onAnswerChange(e.target.value)}
                placeholder="Ketikkan jawaban Anda di sini..."
                className="w-full px-4 py-3.5 border-2 border-slate-300 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 outline-none text-base font-semibold text-slate-800 placeholder-slate-400 bg-white shadow-sm"
              />
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Question Info Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 px-4 py-3 mb-4 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-[#1b365d] text-white font-extrabold rounded-md shadow-xs">
            SOAL NO. {question.number || currentIndex + 1}
          </span>
          <span className="text-slate-400 font-medium">/ {totalQuestions}</span>
          <span className="text-slate-500 font-semibold px-2 py-0.5 bg-slate-100 rounded ml-1">
            {question.category}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-500">
            Bobot: <strong className="text-slate-800 font-bold">{question.points || 10} Poin</strong>
          </span>
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-900 border border-blue-200">
            {question.type === 'single_choice' && 'Pilihan Ganda'}
            {question.type === 'multiple_choice' && 'Pilihan Ganda Kompleks'}
            {question.type === 'matching' && 'Pernyataan Sesuai'}
            {question.type === 'short_answer' && 'Isian Singkat'}
          </span>
        </div>
      </div>

      {/* Main Content: Split View (Left: Stimulus, Right: Question + Options) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch flex-1">
        {/* Stimulus Reading / Context Box */}
        <div className="lg:col-span-6 bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 flex flex-col lg:max-h-[68vh] overflow-y-auto">
          {question.stimulusBadge && (
            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-800 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-md mb-3 self-start">
              <FileText className="w-3.5 h-3.5" />
              <span>{question.stimulusBadge}</span>
            </div>
          )}

          {question.stimulusTitle && (
            <h3 className={`text-slate-900 font-extrabold mb-3 pb-2 border-b border-slate-100 ${headingSizeClass}`}>
              {question.stimulusTitle}
            </h3>
          )}

          <div className={`text-slate-700 whitespace-pre-line leading-relaxed space-y-4 ${textSizeClass}`}>
            {question.stimulusContent || 'Silakan baca stimulus yang tersedia untuk menjawab soal berikut.'}
          </div>
        </div>

        {/* Question & Choices Box */}
        <div className="lg:col-span-6 bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 flex flex-col lg:max-h-[68vh] overflow-y-auto">
          <div className="mb-4 sm:mb-5 pb-3 border-b border-slate-100">
            <h4 className={`text-slate-900 font-extrabold ${headingSizeClass}`}>
              {question.questionText}
            </h4>
          </div>

          {/* Interactive Answer Input */}
          <div className="flex-1">{renderOptions()}</div>
        </div>
      </div>
    </div>
  );
};
