/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Clock, HelpCircle, Grid, Code, PlayCircle, BookOpen, AlertCircle } from 'lucide-react';
import { formatSecondsToTimer } from '../utils/cbtLogic';
import { ExamSettings } from '../types/cbt';
import { PusmendikLogo } from './PusmendikLogo';

interface HeaderPusmendikProps {
  settings: ExamSettings;
  timeRemaining: number;
  activeTab: 'simulasi' | 'generator' | 'bank_soal';
  setActiveTab: (tab: 'simulasi' | 'generator' | 'bank_soal') => void;
  currentFontSize: 'sm' | 'md' | 'lg';
  setFontSize: (size: 'sm' | 'md' | 'lg') => void;
  onOpenDaftarSoal: () => void;
  answeredCount: number;
  totalQuestions: number;
  isExamRunning: boolean;
  onFinishExamClick: () => void;
}

export const HeaderPusmendik: React.FC<HeaderPusmendikProps> = ({
  settings,
  timeRemaining,
  activeTab,
  setActiveTab,
  currentFontSize,
  setFontSize,
  onOpenDaftarSoal,
  answeredCount,
  totalQuestions,
  isExamRunning,
  onFinishExamClick,
}) => {
  const isTimeCritical = timeRemaining < 300 && timeRemaining > 0; // Less than 5 minutes

  return (
    <header className="bg-[#1b365d] text-white shadow-lg sticky top-0 z-40 border-b-4 border-amber-400">
      {/* Top Bar Navigation Tabs */}
      <div className="bg-slate-900/50 px-4 py-1.5 border-b border-blue-400/20 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-x-auto py-0.5">
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('simulasi')}
              className={`px-2.5 sm:px-3 py-1 rounded-md font-semibold text-xs flex items-center gap-1.5 transition shrink-0 ${
                activeTab === 'simulasi'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-blue-100 hover:bg-blue-900/60'
              }`}
            >
              <PlayCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Simulasi CBT</span>
            </button>
            <button
              onClick={() => setActiveTab('generator')}
              className={`px-2.5 sm:px-3 py-1 rounded-md font-semibold text-xs flex items-center gap-1.5 transition shrink-0 ${
                activeTab === 'generator'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-blue-100 hover:bg-blue-900/60'
              }`}
            >
              <Code className="w-3.5 h-3.5 shrink-0" />
              <span>Generator Apps Script</span>
            </button>
            <button
              onClick={() => setActiveTab('bank_soal')}
              className={`px-2.5 sm:px-3 py-1 rounded-md font-semibold text-xs flex items-center gap-1.5 transition shrink-0 ${
                activeTab === 'bank_soal'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-blue-100 hover:bg-blue-900/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 shrink-0" />
              <span>Bank Soal</span>
            </button>
          </div>
          <div className="hidden lg:flex items-center gap-2 text-[11px] text-blue-200 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Pusmendik TKA Engine v2.5</span>
          </div>
        </div>
      </div>

      {/* Main Pusmendik CBT Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Branding & Logo */}
        <div className="flex items-center gap-3">
          <PusmendikLogo size="md" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded">
                {settings.jenjang}
              </span>
              <h1 className="text-sm sm:text-base font-extrabold tracking-wide uppercase text-amber-300 leading-tight">
                {settings.title}
              </h1>
            </div>
            <p className="text-[11px] text-blue-100 font-medium hidden sm:block">
              {settings.subTitle} • Mata Uji: <strong className="text-white">{settings.subject}</strong>
            </p>
          </div>
        </div>

        {/* Right Section: Font Size Controls, Timer & Daftar Soal */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Font Sizer: A- / A / A+ (Classic Pusmendik Feature) */}
          <div className="hidden md:flex items-center bg-blue-950/70 rounded-lg p-1 border border-blue-400/30 text-xs">
            <span className="px-2 text-[10px] text-blue-200 uppercase font-bold">Ukuran Font:</span>
            <button
              onClick={() => setFontSize('sm')}
              title="Font Lebih Kecil"
              className={`px-2 py-1 rounded font-bold transition ${
                currentFontSize === 'sm' ? 'bg-amber-400 text-slate-900 shadow' : 'text-blue-200 hover:bg-blue-800'
              }`}
            >
              A-
            </button>
            <button
              onClick={() => setFontSize('md')}
              title="Font Standar"
              className={`px-2.5 py-1 rounded font-bold transition ${
                currentFontSize === 'md' ? 'bg-amber-400 text-slate-900 shadow' : 'text-blue-200 hover:bg-blue-800'
              }`}
            >
              A
            </button>
            <button
              onClick={() => setFontSize('lg')}
              title="Font Lebih Besar"
              className={`px-2 py-1 rounded font-bold transition ${
                currentFontSize === 'lg' ? 'bg-amber-400 text-slate-900 shadow' : 'text-blue-200 hover:bg-blue-800'
              }`}
            >
              A+
            </button>
          </div>

          {/* Sisa Waktu Countdown Timer */}
          {isExamRunning && (
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition ${
                isTimeCritical
                  ? 'bg-rose-700 border-rose-300 animate-pulse text-white'
                  : 'bg-blue-900/80 border-blue-400/30 text-white'
              }`}
            >
              <Clock className={`w-4 h-4 ${isTimeCritical ? 'text-amber-200' : 'text-amber-400'}`} />
              <div className="text-right">
                <div className="text-[9px] uppercase tracking-wider text-blue-200 leading-none">Sisa Waktu</div>
                <div className="font-mono font-bold text-sm sm:text-base tracking-widest leading-tight">
                  {formatSecondsToTimer(timeRemaining)}
                </div>
              </div>
            </div>
          )}

          {/* Daftar Soal Button */}
          {isExamRunning && (
            <button
              onClick={onOpenDaftarSoal}
              className="bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm flex items-center gap-1.5 shadow-md transition"
            >
              <Grid className="w-4 h-4" />
              <span className="hidden sm:inline">Daftar Soal</span>
              <span className="bg-slate-900 text-white text-[11px] px-1.5 py-0.5 rounded-full font-mono">
                {answeredCount}/{totalQuestions}
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
