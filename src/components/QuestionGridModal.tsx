/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Question } from '../types/cbt';
import { isAnswerEmpty } from '../utils/cbtLogic';
import { X, Check, HelpCircle } from 'lucide-react';

interface QuestionGridModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: Question[];
  currentIndex: number;
  answers: Record<string, any>;
  flagged: Record<string, boolean>;
  onSelectQuestion: (index: number) => void;
}

export const QuestionGridModal: React.FC<QuestionGridModalProps> = ({
  isOpen,
  onClose,
  questions,
  currentIndex,
  answers,
  flagged,
  onSelectQuestion,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-5 sm:p-6 border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">Daftar Nomor Soal</h3>
            <p className="text-xs text-slate-500">Klik pada nomor untuk langsung menuju ke soal tersebut.</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-3 gap-2 text-[11px] p-2.5 bg-slate-50 rounded-xl border border-slate-200 mb-4 text-slate-700">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="w-3.5 h-3.5 rounded bg-[#1b365d] shrink-0" />
            <span>Sudah Dijawab</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium">
            <span className="w-3.5 h-3.5 rounded bg-amber-400 shrink-0" />
            <span>Ragu - Ragu</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium">
            <span className="w-3.5 h-3.5 rounded bg-white border border-slate-300 shrink-0" />
            <span>Belum Dijawab</span>
          </div>
        </div>

        {/* Grid Numbers */}
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5 max-h-72 overflow-y-auto p-1">
          {questions.map((q, idx) => {
            const userAns = answers[q.id];
            const hasAnswer = !isAnswerEmpty(userAns);
            const isRagu = !!flagged[q.id];
            const isCurrent = idx === currentIndex;

            let bgClass = 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50';
            if (isRagu) {
              bgClass = 'bg-amber-400 text-slate-950 font-black border-amber-500 shadow-xs';
            } else if (hasAnswer) {
              bgClass = 'bg-[#1b365d] text-white font-bold border-blue-900 shadow-xs';
            }

            let badgeLabel = '-';
            if (hasAnswer) {
              if (typeof userAns === 'string') {
                badgeLabel = userAns.length > 4 ? userAns.slice(0, 3) + '..' : userAns;
              } else if (Array.isArray(userAns)) {
                badgeLabel = userAns.join(',');
              } else if (typeof userAns === 'object') {
                badgeLabel = '✓';
              }
            }

            return (
              <button
                key={q.id}
                type="button"
                onClick={() => {
                  onSelectQuestion(idx);
                  onClose();
                }}
                className={`h-13 rounded-xl flex flex-col items-center justify-center border-2 transition active:scale-95 relative ${bgClass} ${
                  isCurrent ? 'ring-3 ring-amber-400 ring-offset-2' : ''
                }`}
              >
                <span className="text-xs font-extrabold">{q.number || idx + 1}</span>
                <span className="text-[10px] opacity-85 leading-tight font-mono">{badgeLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg text-xs transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
