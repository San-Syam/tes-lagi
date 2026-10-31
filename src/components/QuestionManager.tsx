/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Question, ExamSettings, QuestionType } from '../types/cbt';
import { Plus, Trash2, Edit2, RotateCcw, Settings, BookOpen, Save, Check } from 'lucide-react';
import { DEFAULT_QUESTIONS } from '../data/defaultQuestions';

interface QuestionManagerProps {
  settings: ExamSettings;
  setSettings: React.Dispatch<React.SetStateAction<ExamSettings>>;
  questions: Question[];
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
  onSaveToSimulator: () => void;
}

export const QuestionManager: React.FC<QuestionManagerProps> = ({
  settings,
  setSettings,
  questions,
  setQuestions,
  onSaveToSimulator,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'pengaturan' | 'soal'>('pengaturan');
  const [isNewQuestionOpen, setIsNewQuestionOpen] = useState(false);
  const [newQuestionType, setNewQuestionType] = useState<QuestionType>('single_choice');
  const [newCategory, setNewCategory] = useState<Question['category']>('Literasi Membaca');
  const [newStimulusTitle, setNewStimulusTitle] = useState('');
  const [newStimulusContent, setNewStimulusContent] = useState('');
  const [newQuestionText, setNewQuestionText] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [newCorrectAnswer, setNewCorrectAnswer] = useState('A');
  const [newExplanation, setNewExplanation] = useState('');
  const [newPoints, setNewPoints] = useState(10);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    const newQ: Question = {
      id: `q-${Date.now()}`,
      number: questions.length + 1,
      type: newQuestionType,
      category: newCategory,
      jenjang: settings.jenjang,
      stimulusTitle: newStimulusTitle || undefined,
      stimulusContent: newStimulusContent || undefined,
      questionText: newQuestionText,
      options: [
        { key: 'A', text: optA || 'Opsi A' },
        { key: 'B', text: optB || 'Opsi B' },
        { key: 'C', text: optC || 'Opsi C' },
        { key: 'D', text: optD || 'Opsi D' },
      ],
      correctAnswer: newCorrectAnswer,
      explanation: newExplanation || undefined,
      points: Number(newPoints) || 10,
    };

    setQuestions([...questions, newQ]);
    setIsNewQuestionOpen(false);
    // Reset form
    setNewStimulusTitle('');
    setNewStimulusContent('');
    setNewQuestionText('');
    setOptA('');
    setOptB('');
    setOptC('');
    setOptD('');
    triggerSaved();
  };

  const handleDeleteQuestion = (id: string) => {
    if (confirm('Hapus butir soal ini dari bank soal?')) {
      const filtered = questions.filter((q) => q.id !== id);
      const renumbered = filtered.map((q, idx) => ({ ...q, number: idx + 1 }));
      setQuestions(renumbered);
      triggerSaved();
    }
  };

  const handleResetDefault = () => {
    if (confirm('Kembalikan bank soal ke soal standar Pusmendik TKA?')) {
      setQuestions(DEFAULT_QUESTIONS);
      triggerSaved();
    }
  };

  const triggerSaved = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="max-w-5xl w-full mx-auto p-4 sm:p-6 space-y-6">
      {/* Title & Actions */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <Settings className="w-6 h-6 text-[#1b365d]" />
            <span>Pengaturan Ujian & Bank Soal</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Kustomisasi parameter ujian, token login, durasi, dan butir soal yang otomatis disinkronkan ke generator Apps Script.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {savedNotice && (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-lg flex items-center gap-1 animate-in fade-in">
              <Check className="w-3.5 h-3.5" />
              <span>Tersimpan!</span>
            </span>
          )}
          <button
            onClick={onSaveToSimulator}
            className="px-4 py-2 bg-[#1b365d] hover:bg-blue-900 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition"
          >
            Uji di Simulasi
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSubTab('pengaturan')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
            activeSubTab === 'pengaturan'
              ? 'bg-[#1b365d] text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-200/60'
          }`}
        >
          Konfigurasi Ujian & Token
        </button>
        <button
          onClick={() => setActiveSubTab('soal')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
            activeSubTab === 'soal' ? 'bg-[#1b365d] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200/60'
          }`}
        >
          Daftar Bank Soal ({questions.length})
        </button>
      </div>

      {/* SUBTAB 1: Pengaturan */}
      {activeSubTab === 'pengaturan' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Judul Simulasi Ujian
              </label>
              <input
                type="text"
                value={settings.title}
                onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:border-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Sub-Judul Instansi
              </label>
              <input
                type="text"
                value={settings.subTitle}
                onChange={(e) => setSettings({ ...settings, subTitle: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:border-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Jenjang Pendidikan
              </label>
              <select
                value={settings.jenjang}
                onChange={(e) => setSettings({ ...settings, jenjang: e.target.value as any })}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl bg-white"
              >
                <option value="SD/MI">SD / MI</option>
                <option value="SMP/MTs">SMP / MTs</option>
                <option value="SMA/MA/SMK">SMA / MA / SMK</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Mata Uji / Paket Soal
              </label>
              <input
                type="text"
                value={settings.subject}
                onChange={(e) => setSettings({ ...settings, subject: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:border-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Durasi Ujian (Menit)
              </label>
              <input
                type="number"
                min="5"
                max="180"
                value={settings.durationMinutes}
                onChange={(e) => setSettings({ ...settings, durationMinutes: Number(e.target.value) || 45 })}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:border-blue-600 outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Token Rilis Ujian
              </label>
              <input
                type="text"
                value={settings.token}
                onChange={(e) => setSettings({ ...settings, token: e.target.value.toUpperCase() })}
                className="w-full px-3.5 py-2.5 border border-amber-400 bg-amber-50/50 rounded-xl focus:border-amber-600 outline-none font-mono uppercase font-black tracking-widest text-amber-950"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                KKM / Standar Kelulusan (0-100)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={settings.kkm}
                onChange={(e) => setSettings({ ...settings, kkm: Number(e.target.value) || 70 })}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:border-blue-600 outline-none font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: Daftar Soal */}
      {activeSubTab === 'soal' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsNewQuestionOpen(!isNewQuestionOpen)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-1.5 shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Butir Soal Baru</span>
            </button>

            <button
              onClick={handleResetDefault}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs flex items-center gap-1.5 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Soal Bawaan Pusmendik</span>
            </button>
          </div>

          {/* Form Tambah Soal Baru */}
          {isNewQuestionOpen && (
            <form onSubmit={handleAddQuestion} className="bg-white rounded-3xl p-6 shadow-md border border-slate-200 space-y-4 text-xs animate-in fade-in">
              <h3 className="text-sm font-bold text-slate-900 pb-2 border-b">Buat Butir Soal Baru</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700">Tipe Soal</label>
                  <select
                    value={newQuestionType}
                    onChange={(e) => setNewQuestionType(e.target.value as any)}
                    className="w-full p-2 border rounded-lg bg-white"
                  >
                    <option value="single_choice">Pilihan Ganda (Single Choice)</option>
                    <option value="short_answer">Isian Singkat</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-700">Kategori</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full p-2 border rounded-lg bg-white"
                  >
                    <option value="Literasi Membaca">Literasi Membaca</option>
                    <option value="Numerasi">Numerasi</option>
                    <option value="TKA Matematika">TKA Matematika</option>
                    <option value="TKA Bahasa Indonesia">TKA Bahasa Indonesia</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-700">Bobot Poin</label>
                  <input
                    type="number"
                    value={newPoints}
                    onChange={(e) => setNewPoints(Number(e.target.value) || 10)}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700">Judul Stimulus / Bacaan (Opsional)</label>
                <input
                  type="text"
                  value={newStimulusTitle}
                  onChange={(e) => setNewStimulusTitle(e.target.value)}
                  placeholder="Contoh: Analisis Ekosistem Terumbu Karang"
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700">Teks Stimulus (Opsional)</label>
                <textarea
                  rows={3}
                  value={newStimulusContent}
                  onChange={(e) => setNewStimulusContent(e.target.value)}
                  placeholder="Isi teks paragraf atau narasi pendukung..."
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700">Teks Pertanyaan *</label>
                <textarea
                  required
                  rows={2}
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  placeholder="Ketikkan rumusan pertanyaan..."
                  className="w-full p-2 border rounded-lg font-medium"
                />
              </div>

              {newQuestionType === 'single_choice' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input type="text" required value={optA} onChange={(e) => setOptA(e.target.value)} placeholder="Teks Opsi A" className="p-2 border rounded-lg" />
                  <input type="text" required value={optB} onChange={(e) => setOptB(e.target.value)} placeholder="Teks Opsi B" className="p-2 border rounded-lg" />
                  <input type="text" required value={optC} onChange={(e) => setOptC(e.target.value)} placeholder="Teks Opsi C" className="p-2 border rounded-lg" />
                  <input type="text" required value={optD} onChange={(e) => setOptD(e.target.value)} placeholder="Teks Opsi D" className="p-2 border rounded-lg" />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700">Kunci Jawaban Benar</label>
                  {newQuestionType === 'single_choice' ? (
                    <select
                      value={newCorrectAnswer}
                      onChange={(e) => setNewCorrectAnswer(e.target.value)}
                      className="w-full p-2 border rounded-lg bg-white"
                    >
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      required
                      value={newCorrectAnswer}
                      onChange={(e) => setNewCorrectAnswer(e.target.value)}
                      placeholder="Jawaban benar..."
                      className="w-full p-2 border rounded-lg"
                    />
                  )}
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700">Pembahasan (Opsional)</label>
                  <input
                    type="text"
                    value={newExplanation}
                    onChange={(e) => setNewExplanation(e.target.value)}
                    placeholder="Alasan mengapa jawaban tersebut benar..."
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewQuestionOpen(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg"
                >
                  Simpan Soal ke Bank
                </button>
              </div>
            </form>
          )}

          {/* List Soal Terdaftar */}
          <div className="space-y-3">
            {questions.map((q, idx) => (
              <div
                key={q.id}
                className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 flex items-start justify-between gap-4 text-xs"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-[#1b365d] text-white font-bold rounded text-[11px]">
                      No. {q.number || idx + 1}
                    </span>
                    <span className="text-slate-500 font-semibold">{q.category}</span>
                    <span className="text-slate-400">• {q.points || 10} Poin</span>
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-800 rounded font-medium text-[10px]">
                      {q.type}
                    </span>
                  </div>
                  {q.stimulusTitle && (
                    <div className="font-bold text-slate-800 text-xs">Stimulus: {q.stimulusTitle}</div>
                  )}
                  <p className="text-slate-700 font-medium text-sm">{q.questionText}</p>
                </div>

                <button
                  onClick={() => handleDeleteQuestion(q.id)}
                  title="Hapus Soal"
                  className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
