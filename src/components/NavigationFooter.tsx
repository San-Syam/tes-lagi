/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, Flag } from 'lucide-react';

interface NavigationFooterProps {
  currentIndex: number;
  totalQuestions: number;
  isFlagged: boolean;
  onToggleFlag: (flagged: boolean) => void;
  onPrev: () => void;
  onNext: () => void;
  onFinish: () => void;
}

export const NavigationFooter: React.FC<NavigationFooterProps> = ({
  currentIndex,
  totalQuestions,
  isFlagged,
  onToggleFlag,
  onPrev,
  onNext,
  onFinish,
}) => {
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalQuestions - 1;

  return (
    <footer className="mt-4 bg-white rounded-2xl shadow-md border border-slate-200 p-3 sm:p-4 flex items-center justify-between gap-2 z-20">
      {/* Soal Sebelumnya */}
      <button
        type="button"
        onClick={onPrev}
        disabled={isFirst}
        className={`px-3 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition active:scale-95 ${
          isFirst
            ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
            : 'bg-slate-200 hover:bg-slate-300 text-slate-800 shadow-sm'
        }`}
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Soal Sebelumnya</span>
        <span className="sm:hidden">Kembali</span>
      </button>

      {/* Ragu - Ragu (Yellow Accent characteristic of Pusmendik CBT) */}
      <label
        className={`flex items-center gap-2.5 px-3 sm:px-6 py-2.5 rounded-xl cursor-pointer border-2 select-none transition shadow-sm active:scale-95 ${
          isFlagged
            ? 'bg-amber-400 border-amber-500 text-slate-950 font-black ring-2 ring-amber-300/50'
            : 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-900 font-bold'
        }`}
      >
        <input
          type="checkbox"
          checked={isFlagged}
          onChange={(e) => onToggleFlag(e.target.checked)}
          className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-amber-400"
        />
        <Flag className={`w-4 h-4 ${isFlagged ? 'fill-slate-950' : 'text-amber-800'}`} />
        <span className="text-xs sm:text-sm">Ragu - Ragu</span>
      </label>

      {/* Soal Berikutnya / Selesai Tes */}
      {isLast ? (
        <button
          type="button"
          onClick={onFinish}
          className="px-4 sm:px-6 py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-1.5 transition shadow-md shadow-rose-600/20"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Selesai Tes</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={onNext}
          className="px-4 sm:px-6 py-2.5 bg-[#1b365d] hover:bg-blue-900 active:scale-95 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-1.5 transition shadow-md shadow-blue-900/20"
        >
          <span className="hidden sm:inline">Soal Berikutnya</span>
          <span className="sm:hidden">Lanjut</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </footer>
  );
};
