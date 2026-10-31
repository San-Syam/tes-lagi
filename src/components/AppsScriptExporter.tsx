/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Question, ExamSettings } from '../types/cbt';
import { generateCodeGs, generateIndexHtml } from '../utils/appsScriptGenerator';
import {
  Copy,
  Check,
  Download,
  FileCode,
  FileSpreadsheet,
  ExternalLink,
  BookOpen,
  Layers,
  Sparkles,
  ArrowRight,
  Database,
  Terminal,
} from 'lucide-react';

interface AppsScriptExporterProps {
  settings: ExamSettings;
  questions: Question[];
  onOpenSimulator: () => void;
}

export const AppsScriptExporter: React.FC<AppsScriptExporterProps> = ({
  settings,
  questions,
  onOpenSimulator,
}) => {
  const [activeCodeTab, setActiveCodeTab] = useState<'codegs' | 'indexhtml' | 'panduan' | 'database'>('codegs');
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  const codeGsContent = generateCodeGs(settings, questions);
  const indexHtmlContent = generateIndexHtml(settings, questions);

  const handleCopy = (fileName: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedFile(fileName);
    setTimeout(() => setCopiedFile(null), 3000);
  };

  const handleDownload = (filename: string, content: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl w-full mx-auto p-4 sm:p-6 space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#1b365d] via-blue-900 to-[#1b365d] text-white rounded-3xl p-6 sm:p-8 shadow-xl border-b-4 border-amber-400">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400 text-slate-950 font-extrabold text-xs rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full Google Apps Script Ready</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-wide uppercase text-amber-300">
              Paket Ekspor Google Apps Script & Database Otomatis
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 max-w-2xl leading-relaxed">
              Dua file siap pakai (<strong>Code.gs</strong> dan <strong>Index.html</strong>). Cukup salin ke Google Apps Script dan jalankan fungsi <code>setupDatabase()</code> untuk membuat Google Spreadsheet otomatis sebagai database ujian!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleDownload('Code.gs', codeGsContent, 'text/plain')}
              className="px-4 py-2.5 bg-white text-slate-900 hover:bg-slate-100 font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-sm transition active:scale-95"
            >
              <Download className="w-4 h-4 text-blue-600" />
              <span>Unduh Code.gs</span>
            </button>
            <button
              onClick={() => handleDownload('Index.html', indexHtmlContent, 'text/html')}
              className="px-4 py-2.5 bg-amber-400 text-slate-950 hover:bg-amber-300 font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-sm transition active:scale-95"
            >
              <Download className="w-4 h-4 text-slate-900" />
              <span>Unduh Index.html</span>
            </button>
          </div>
        </div>
      </div>

      {/* Nav Tabs for the Generator */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveCodeTab('codegs')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
            activeCodeTab === 'codegs'
              ? 'bg-[#1b365d] text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-200/60'
          }`}
        >
          <FileCode className="w-4 h-4 text-amber-400" />
          <span>Code.gs (Backend & Database)</span>
        </button>

        <button
          onClick={() => setActiveCodeTab('indexhtml')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
            activeCodeTab === 'indexhtml'
              ? 'bg-[#1b365d] text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-200/60'
          }`}
        >
          <FileCode className="w-4 h-4 text-cyan-400" />
          <span>Index.html (Frontend Pusmendik CBT)</span>
        </button>

        <button
          onClick={() => setActiveCodeTab('database')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
            activeCodeTab === 'database'
              ? 'bg-[#1b365d] text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-200/60'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          <span>Skema Database Spreadsheet</span>
        </button>

        <button
          onClick={() => setActiveCodeTab('panduan')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
            activeCodeTab === 'panduan'
              ? 'bg-[#1b365d] text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-200/60'
          }`}
        >
          <BookOpen className="w-4 h-4 text-amber-300" />
          <span>Panduan Deploy 5 Menit</span>
        </button>
      </div>

      {/* TAB 1: Code.gs */}
      {activeCodeTab === 'codegs' && (
        <div className="bg-white rounded-3xl shadow-md border border-slate-200 overflow-hidden">
          <div className="bg-slate-900 text-slate-300 px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500" />
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-xs font-mono font-bold text-white ml-2">Code.gs</span>
              <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                ({codeGsContent.split('\n').length} baris kode)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy('Code.gs', codeGsContent)}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 transition active:scale-95"
              >
                {copiedFile === 'Code.gs' ? <Check className="w-4 h-4 text-amber-300" /> : <Copy className="w-4 h-4" />}
                <span>{copiedFile === 'Code.gs' ? 'Tersalin!' : 'Salin Code.gs'}</span>
              </button>
            </div>
          </div>

          <div className="p-4 bg-slate-950 max-h-[600px] overflow-y-auto">
            <pre className="font-mono text-xs text-emerald-400 whitespace-pre leading-relaxed select-all">
              {codeGsContent}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 2: Index.html */}
      {activeCodeTab === 'indexhtml' && (
        <div className="bg-white rounded-3xl shadow-md border border-slate-200 overflow-hidden">
          <div className="bg-slate-900 text-slate-300 px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500" />
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-xs font-mono font-bold text-white ml-2">Index.html</span>
              <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                ({indexHtmlContent.split('\n').length} baris kode)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy('Index.html', indexHtmlContent)}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 transition active:scale-95"
              >
                {copiedFile === 'Index.html' ? <Check className="w-4 h-4 text-amber-300" /> : <Copy className="w-4 h-4" />}
                <span>{copiedFile === 'Index.html' ? 'Tersalin!' : 'Salin Index.html'}</span>
              </button>
            </div>
          </div>

          <div className="p-4 bg-slate-950 max-h-[600px] overflow-y-auto">
            <pre className="font-mono text-xs text-cyan-300 whitespace-pre leading-relaxed select-all">
              {indexHtmlContent}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 3: Visual Database Schema */}
      {activeCodeTab === 'database' && (
        <div className="bg-white rounded-3xl shadow-md border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Database className="w-6 h-6 text-emerald-600" />
              <span>Arsitektur Database Google Spreadsheet Otomatis</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Saat Anda menjalankan fungsi <code>setupDatabase()</code> di Google Apps Script, sistem akan otomatis membuat spreadsheet baru dengan 4 lembar kerja (sheets) terstruktur berikut:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Sheet 1 */}
            <div className="p-5 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-blue-900 px-2 py-0.5 bg-blue-200 rounded font-mono">
                  Sheet 1: PENGATURAN
                </span>
                <span className="text-[11px] text-blue-700 font-semibold">Config Table</span>
              </div>
              <p className="text-xs text-slate-700">
                Menyimpan variabel operasional: Judul Ujian, Jenjang, Mata Pelajaran, Durasi Waktu (menit), Token Aktif, KKM, dan Status Ujian (AKTIF/NONAKTIF).
              </p>
              <div className="bg-white p-2.5 rounded-xl border border-blue-200 text-[11px] font-mono text-slate-800">
                Kolom: [PARAMETER] | [NILAI] | [KETERANGAN]
              </div>
            </div>

            {/* Sheet 2 */}
            <div className="p-5 bg-indigo-50/70 border border-indigo-200 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-indigo-900 px-2 py-0.5 bg-indigo-200 rounded font-mono">
                  Sheet 2: BANK_SOAL
                </span>
                <span className="text-[11px] text-indigo-700 font-semibold">Question Repository</span>
              </div>
              <p className="text-xs text-slate-700">
                Menampung butir-butir soal CBT: ID, Tipe (single_choice, multiple_choice, matching, short_answer), stimulus teks, opsi A-D, kunci jawaban aman, poin, dan pembahasan.
              </p>
              <div className="bg-white p-2.5 rounded-xl border border-indigo-200 text-[11px] font-mono text-slate-800">
                Kolom: ID | NO | TIPE | KATEGORI | STIMULUS | PERTANYAAN | OPSI_A-D | KUNCI | POIN
              </div>
            </div>

            {/* Sheet 3 */}
            <div className="p-5 bg-teal-50/70 border border-teal-200 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-teal-900 px-2 py-0.5 bg-teal-200 rounded font-mono">
                  Sheet 3: DATA_PESERTA
                </span>
                <span className="text-[11px] text-teal-700 font-semibold">Student Roster</span>
              </div>
              <p className="text-xs text-slate-700">
                Daftar siswa yang berhak mengikuti ujian. Dapat diisi nomor NISN, nama lengkap, kelas, jenis kelamin, serta status pengerjaan.
              </p>
              <div className="bg-white p-2.5 rounded-xl border border-teal-200 text-[11px] font-mono text-slate-800">
                Kolom: NISN_NO_PESERTA | NAMA_SISWA | KELAS | GENDER | TGL_LAHIR | STATUS
              </div>
            </div>

            {/* Sheet 4 */}
            <div className="p-5 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-amber-900 px-2 py-0.5 bg-amber-200 rounded font-mono">
                  Sheet 4: HASIL_UJIAN
                </span>
                <span className="text-[11px] text-amber-700 font-semibold">Live Submissions</span>
              </div>
              <p className="text-xs text-slate-700">
                Setiap peserta yang mengklik &apos;Selesai Tes&apos; akan otomatis menambahkan baris baru dengan nilai akhir (skala 0-100), rekap jumlah benar/salah, status kelulusan, dan log timestamp.
              </p>
              <div className="bg-white p-2.5 rounded-xl border border-amber-200 text-[11px] font-mono text-slate-800">
                Kolom: WAKTU_SELESAI | NISN | NAMA | JML_SOAL | BENAR | SALAH | SKOR | NILAI | STATUS
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Panduan Deploy */}
      {activeCodeTab === 'panduan' && (
        <div className="bg-white rounded-3xl shadow-md border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Terminal className="w-6 h-6 text-blue-700" />
              <span>Panduan 5 Langkah Penerapan ke Google Apps Script</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Ikuti panduan berikut untuk meluncurkan website tryout CBT Pusmendik Anda secara gratis menggunakan Google Workspace.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-full bg-[#1b365d] text-white flex items-center justify-center font-black text-sm shrink-0">
                1
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900">Buka Google Apps Script</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Buka peramban dan kunjungi{' '}
                  <a
                    href="https://script.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 font-bold hover:underline inline-flex items-center gap-1"
                  >
                    script.google.com <ExternalLink className="w-3 h-3" />
                  </a>
                  . Klik tombol <strong>&ldquo;Proyek baru&rdquo;</strong> (New project) dan beri nama misalnya &ldquo;CBT Pusmendik Tryout&rdquo;.
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-full bg-[#1b365d] text-white flex items-center justify-center font-black text-sm shrink-0">
                2
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900">Salin dan Tempel Kode Code.gs</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Pilih tab <strong>Code.gs</strong> di atas, klik tombol <strong>&ldquo;Salin Code.gs&rdquo;</strong>, lalu tempelkan (paste) menggantikan seluruh isi file <code>Code.gs</code> di editor Apps Script Anda. Tekan <code>Ctrl + S</code> untuk menyimpan.
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-full bg-[#1b365d] text-white flex items-center justify-center font-black text-sm shrink-0">
                3
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900">Buat File HTML Baru: &ldquo;Index&rdquo;</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Di sebelah kiri menu file Apps Script, klik tombol <strong>+ (Tambah file)</strong> lalu pilih <strong>HTML</strong>. Beri nama file <code>Index</code> (tanpa ekstensi .html). Salin isi tab <strong>Index.html</strong> dari aplikasi ini dan tempelkan ke file tersebut, lalu simpan.
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-sm shrink-0">
                4
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900">
                  Jalankan Fungsi Otomatis: <code>setupDatabase()</code>
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Pada dropdown fungsi di bagian atas editor Apps Script, pilih fungsi <code>setupDatabase</code> lalu klik tombol <strong>Run (Jalankan)</strong>. Berikan izin (Review Permissions) satu kali. Dalam 3 detik, sebuah Google Spreadsheet baru lengkap dengan 4 sheet akan otomatis tercipta di Google Drive Anda! Tautan URL spreadsheet akan tercatat di Execution Log.
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-black text-sm shrink-0">
                5
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900">Terapkan (Deploy) Sebagai Aplikasi Web</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Klik tombol biru <strong>Deploy</strong> di pojok kanan atas &rarr; <strong>New deployment</strong> &rarr; Pilih jenis: <strong>Web app</strong>. Atur:
                  <br />
                  - <em>Execute as:</em> <strong>Me</strong> (Akun Google Anda)
                  <br />
                  - <em>Who has access:</em> <strong>Anyone</strong> (Siapa saja, agar siswa bisa langsung buka tanpa login Google akun)
                  <br />
                  Klik <strong>Deploy</strong>. Salin link Web App yang muncul dan bagikan ke peserta ujian!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
