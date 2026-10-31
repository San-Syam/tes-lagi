/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { HeaderPusmendik } from './components/HeaderPusmendik';
import { QuestionPanel } from './components/QuestionPanel';
import { NavigationFooter } from './components/NavigationFooter';
import { QuestionGridModal } from './components/QuestionGridModal';
import { LoginModal } from './components/LoginModal';
import { ResultModal } from './components/ResultModal';
import { AppsScriptExporter } from './components/AppsScriptExporter';
import { QuestionManager } from './components/QuestionManager';
import { DEFAULT_QUESTIONS } from './data/defaultQuestions';
import { Question, StudentInfo, ExamSettings, ExamResult } from './types/cbt';
import { computeExamResult, isAnswerEmpty } from './utils/cbtLogic';

export default function App() {
  const [activeTab, setActiveTab] = useState<'simulasi' | 'generator' | 'bank_soal'>('simulasi');
  const [questions, setQuestions] = useState<Question[]>(DEFAULT_QUESTIONS);
  const [settings, setSettings] = useState<ExamSettings>({
    title: 'SIMULASI TES KEMAMPUAN AKADEMIK (TKA)',
    subTitle: 'Pusat Asesmen Pendidikan - Kemendikdasmen RI',
    jenjang: 'SMP/MTs',
    subject: 'Literasi & Numerasi',
    durationMinutes: 45,
    token: 'PUSMENDIK26',
    totalSoal: DEFAULT_QUESTIONS.length,
    kkm: 70,
    sheetNamePrefix: 'DB_CBT',
  });

  // Exam Running State
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [isExamFinished, setIsExamFinished] = useState(false);
  const [student, setStudent] = useState<StudentInfo | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [timeRemaining, setTimeRemaining] = useState(45 * 60);
  const [startTime, setStartTime] = useState<number>(0);
  const [examResult, setExamResult] = useState<ExamResult | null>(null);

  // UI State
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [isGridModalOpen, setIsGridModalOpen] = useState(false);

  // Check URL query parameter ?autostart=1 (Ultra Mode requirement)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') {
      const demoStudent: StudentInfo = {
        nama: 'Budi Santoso',
        nisn: '1234567890',
        jenjang: 'SMP/MTs',
        paketSoal: 'Literasi & Numerasi',
        gender: 'L',
        tanggalLahir: '2010-05-15',
        tokenInput: 'PUSMENDIK26',
      };
      setStudent(demoStudent);
      setIsExamStarted(true);
      setStartTime(Date.now());
      setTimeRemaining(settings.durationMinutes * 60);
    }
  }, []);

  // Timer interval
  useEffect(() => {
    if (!isExamStarted || isExamFinished) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinishExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isExamStarted, isExamFinished]);

  // Count answered questions
  const answeredCount = questions.reduce((acc, q) => {
    return acc + (!isAnswerEmpty(answers[q.id]) ? 1 : 0);
  }, 0);

  const handleStartExam = (info: StudentInfo) => {
    setStudent(info);
    setIsExamStarted(true);
    setIsExamFinished(false);
    setCurrentIndex(0);
    setAnswers({});
    setFlagged({});
    setTimeRemaining(settings.durationMinutes * 60);
    setStartTime(Date.now());
  };

  const handleAnswerChange = (val: any) => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: val,
    }));
  };

  const handleToggleFlag = (val: boolean) => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;
    setFlagged((prev) => ({
      ...prev,
      [currentQ.id]: val,
    }));
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      handleFinishExam();
    }
  };

  const handleFinishExam = () => {
    if (!student) return;
    const timeSpent = Math.max(1, Math.round((Date.now() - startTime) / 1000));
    const result = computeExamResult(student, questions, answers, timeSpent);
    setExamResult(result);
    setIsExamFinished(true);
  };

  const handleRestart = () => {
    setIsExamStarted(false);
    setIsExamFinished(false);
    setStudent(null);
    setAnswers({});
    setFlagged({});
    setExamResult(null);
    setCurrentIndex(0);
    setTimeRemaining(settings.durationMinutes * 60);
  };

  const currentQ = questions[currentIndex] || questions[0];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col antialiased text-slate-800">
      {/* Header Pusmendik with branding, timer, and tabs */}
      <HeaderPusmendik
        settings={settings}
        timeRemaining={timeRemaining}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentFontSize={fontSize}
        setFontSize={setFontSize}
        onOpenDaftarSoal={() => setIsGridModalOpen(true)}
        answeredCount={answeredCount}
        totalQuestions={questions.length}
        isExamRunning={activeTab === 'simulasi' && isExamStarted && !isExamFinished}
        onFinishExamClick={handleFinishExam}
      />

      {/* Main View Area */}
      <main className="flex-1 flex flex-col max-w-7xl w-full mx-auto p-3 sm:p-5">
        {/* TAB 1: SIMULASI UJIAN CBT */}
        {activeTab === 'simulasi' && (
          <>
            {!isExamStarted && (
              <LoginModal
                settings={settings}
                onStartExam={handleStartExam}
                onOpenGenerator={() => setActiveTab('generator')}
              />
            )}

            {isExamStarted && !isExamFinished && currentQ && (
              <>
                <QuestionPanel
                  question={currentQ}
                  currentIndex={currentIndex}
                  totalQuestions={questions.length}
                  currentAnswer={answers[currentQ.id]}
                  onAnswerChange={handleAnswerChange}
                  fontSize={fontSize}
                />

                <NavigationFooter
                  currentIndex={currentIndex}
                  totalQuestions={questions.length}
                  isFlagged={!!flagged[currentQ.id]}
                  onToggleFlag={handleToggleFlag}
                  onPrev={handlePrev}
                  onNext={handleNext}
                  onFinish={() => {
                    const unanswered = questions.length - answeredCount;
                    let msg = 'Apakah Anda yakin ingin menyelesaikan ujian ini?';
                    if (unanswered > 0) {
                      msg += ` Terdapat ${unanswered} soal yang belum dijawab.`;
                    }
                    if (confirm(msg)) {
                      handleFinishExam();
                    }
                  }}
                />
              </>
            )}

            {isExamFinished && examResult && (
              <ResultModal
                result={examResult}
                questions={questions}
                onRestart={handleRestart}
                onOpenGenerator={() => setActiveTab('generator')}
              />
            )}
          </>
        )}

        {/* TAB 2: GENERATOR GOOGLE APPS SCRIPT & DATABASE SPREADSHEET */}
        {activeTab === 'generator' && (
          <AppsScriptExporter
            settings={settings}
            questions={questions}
            onOpenSimulator={() => setActiveTab('simulasi')}
          />
        )}

        {/* TAB 3: PENGATURAN & BANK SOAL */}
        {activeTab === 'bank_soal' && (
          <QuestionManager
            settings={settings}
            setSettings={setSettings}
            questions={questions}
            setQuestions={setQuestions}
            onSaveToSimulator={() => setActiveTab('simulasi')}
          />
        )}
      </main>

      {/* Modal Daftar Soal (Drawer) */}
      <QuestionGridModal
        isOpen={isGridModalOpen}
        onClose={() => setIsGridModalOpen(false)}
        questions={questions}
        currentIndex={currentIndex}
        answers={answers}
        flagged={flagged}
        onSelectQuestion={(idx) => setCurrentIndex(idx)}
      />
    </div>
  );
}
