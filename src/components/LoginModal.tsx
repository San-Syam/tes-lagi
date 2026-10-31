/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { StudentInfo, ExamSettings } from '../types/cbt';
import { ShieldCheck, UserCheck, Key, Sparkles, BookOpen, GraduationCap } from 'lucide-react';
import { PusmendikLogo } from './PusmendikLogo';

interface LoginModalProps {
  settings: ExamSettings;
  onStartExam: (student: StudentInfo) => void;
  onOpenGenerator: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ settings, onStartExam, onOpenGenerator }) => {
  const [nama, setNama] = useState('Budi Santoso');
  const [nisn, setNisn] = useState('1234567890');
  const [gender, setGender] = useState<'L' | 'P'>('L');
  const [jenjang, setJenjang] = useState<'SD/MI' | 'SMP/MTs' | 'SMA/MA/SMK'>(settings.jenjang || 'SMP/MTs');
  const [tokenInput, setTokenInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const activeToken = settings.token || 'PUSMENDIK26';

  const handleFillDemo = () => {
    setNama('Budi Santoso');
    setNisn('1234567890');
    setTokenInput(activeToken);
    setErrorMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) {
      setErrorMsg('Token ujian wajib diisi!');
      return;
    }

    if (tokenInput.trim().toUpperCase() !== activeToken.trim().toUpperCase()) {
      setErrorMsg(`Token tidak valid! Gunakan token rilis: ${activeToken}`);
      return;
    }

    onStartExam({
      nama,
      nisn,
      gender,
      jenjang,
      paketSoal: settings.subject,
      tanggalLahir: '2010-05-15',
      tokenInput: tokenInput.trim().toUpperCase(),
    });
  };

  return (
    <div className="max-w-xl w-full mx-auto p-4 sm:p-6 my-auto">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Card Header with Pusmendik Theme */}
        <div className="bg-gradient-to-r from-[#1b365d] via-blue-900 to-[#1b365d] text-white p-6 sm:p-7 text-center relative border-b-4 border-amber-400">
          <PusmendikLogo size="lg" className="mx-auto mb-3" />
          <h2 className="text-xl sm:text-2xl font-black tracking-wide uppercase text-amber-300">
            Konfirmasi Data Peserta
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-md mx-auto">
            Selamat datang di Sistem CBT Pusmendik Kemendikdasmen. Silakan lengkapi identitas peserta dan masukkan token ujian aktif.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4 text-sm">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-rose-700 text-xs font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Nama Lengkap Peserta
            </label>
            <input
              type="text"
              required
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Contoh: Budi Santoso"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none text-slate-800 font-medium transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                NISN / No. Ujian
              </label>
              <input
                type="text"
                required
                value={nisn}
                onChange={(e) => setNisn(e.target.value)}
                placeholder="10 digit nomor NISN"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none text-slate-800 font-medium transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Jenis Kelamin
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'L' | 'P')}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-blue-600 outline-none text-slate-800 font-medium transition"
              >
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Jenjang Pendidikan
              </label>
              <select
                value={jenjang}
                onChange={(e) => setJenjang(e.target.value as any)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-blue-600 outline-none text-slate-800 font-medium transition"
              >
                <option value="SD/MI">SD / MI</option>
                <option value="SMP/MTs">SMP / MTs</option>
                <option value="SMA/MA/SMK">SMA / MA / SMK</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Mata Uji Ujian
              </label>
              <div className="px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-700 font-semibold text-xs flex items-center justify-between">
                <span>{settings.subject}</span>
                <span className="text-[10px] text-blue-800 bg-blue-100 px-1.5 py-0.5 rounded font-mono">
                  {settings.durationMinutes} Menit
                </span>
              </div>
            </div>
          </div>

          {/* Token Box (Official Pusmendik Release Token Info) */}
          <div className="p-4 bg-gradient-to-r from-amber-50 to-amber-100/60 border-2 border-amber-300 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-xs text-amber-950">
              <Key className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <span className="text-amber-800 block text-[11px] font-semibold">Token Rilis Ujian Saat Ini:</span>
                <strong className="font-mono text-base font-black tracking-widest text-amber-950">
                  {activeToken}
                </strong>
              </div>
            </div>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg shadow-xs transition active:scale-95 flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Isi Otomatis</span>
            </button>
          </div>

          {/* Token Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Ketikkan Token Ujian
            </label>
            <input
              type="text"
              required
              value={tokenInput}
              onChange={(e) => {
                setTokenInput(e.target.value);
                setErrorMsg('');
              }}
              placeholder="Ketikkan token di atas (contoh: PUSMENDIK26)"
              className="w-full px-4 py-3 bg-white uppercase font-mono tracking-widest border-2 border-slate-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 rounded-xl outline-none text-center text-base font-black transition"
            />
          </div>

          {/* Submit CTA */}
          <div className="pt-2 space-y-3">
            <button
              type="submit"
              className="w-full py-3.5 bg-[#1b365d] hover:bg-blue-900 active:scale-98 text-white font-extrabold rounded-xl shadow-lg shadow-blue-950/20 text-sm transition flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-5 h-5 text-amber-300" />
              <span>Mulai Kerjakan Ujian Sekarang</span>
            </button>

            <button
              type="button"
              onClick={onOpenGenerator}
              className="w-full py-2.5 text-xs font-bold text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <span>Ingin membuat sistem ini di Google Sheets & Apps Script Anda? Buka Generator</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
