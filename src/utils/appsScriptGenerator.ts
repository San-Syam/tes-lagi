/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Question, ExamSettings } from '../types/cbt';

export function generateCodeGs(settings: ExamSettings, questions: Question[]): string {
  const safeQuestionsJson = JSON.stringify(questions, null, 2);

  return `/**
 * ============================================================================
 * GOOGLE APPS SCRIPT - CBT PUSMENDIK / ANBK & DATABASE SPREADSHEET OTOMATIS
 * Versi: 2.5 (Kemendikdasmen TKA Edition)
 * ============================================================================
 * PETUNJUK PENERAPAN (DEPLOYMENT):
 * 1. Buka https://script.google.com -> Buat Proyek Baru ("CBT Pusmendik Tryout").
 * 2. Hapus isi Code.gs dan tempelkan (paste) seluruh kode di bawah ini.
 * 3. Buat file HTML baru dengan nama "Index" (tanpa .html) lalu tempelkan isi Index.html.
 * 4. Jalankan fungsi "setupDatabase()" sekali dari menu Run di Apps Script.
 *    -> Ini akan OTOMATIS MEMBUAT Spreadsheet Database lengkap dengan 4 sheet!
 * 5. Klik "Deploy" -> "New deployment" -> Pilih tipe "Web app":
 *    - Execute as: "Me" (email Anda)
 *    - Who has access: "Anyone" (Siapa saja)
 * 6. Bagikan URL Web App ke peserta ujian!
 */

// Konfigurasi Standar Aplikasi
const CONFIG = {
  APP_TITLE: "${settings.title || 'Simulasi CBT Pusmendik TKA'}",
  SUB_TITLE: "${settings.subTitle || 'Kementerian Pendidikan Dasar dan Menengah'}",
  JENJANG: "${settings.jenjang || 'SMP/MTs'}",
  SUBJECT: "${settings.subject || 'Literasi & Numerasi'}",
  DURATION_MINUTES: ${settings.durationMinutes || 45},
  DEFAULT_TOKEN: "${settings.token || 'PUSMENDIK26'}",
  KKM: ${settings.kkm || 70},
  SPREADSHEET_NAME: "Database CBT Pusmendik - ${settings.subject || 'Tryout'}"
};

/**
 * 1. FUNGSI SETUP DATABASE OTOMATIS DI GOOGLE SPREADSHEET
 * Jalankan fungsi ini satu kali (Run -> setupDatabase) untuk otomatis membuat
 * Spreadsheet baru lengkap dengan sheet PENGATURAN, BANK_SOAL, DATA_PESERTA, dan HASIL_UJIAN!
 */
function setupDatabase() {
  const userProps = PropertiesService.getUserProperties();
  let ssId = userProps.getProperty('CBT_SPREADSHEET_ID');
  let ss;

  if (ssId) {
    try {
      ss = SpreadsheetApp.openById(ssId);
    } catch (e) {
      ss = null;
    }
  }

  // Jika belum ada, buat Spreadsheet baru otomatis di Google Drive Anda
  if (!ss) {
    ss = SpreadsheetApp.create(CONFIG.SPREADSHEET_NAME);
    ssId = ss.getId();
    userProps.setProperty('CBT_SPREADSHEET_ID', ssId);
    Logger.log("✅ Berhasil membuat Spreadsheet baru: " + ss.getUrl());
  }

  // Header Style Palette (Pusmendik Navy Blue)
  const headerBg = '#1e3a8a';
  const headerFontColor = '#ffffff';

  // --- SHEET 1: PENGATURAN ---
  let sheetSetting = ss.getSheetByName('PENGATURAN');
  if (!sheetSetting) {
    sheetSetting = ss.insertSheet('PENGATURAN');
  }
  sheetSetting.clear();
  const settingData = [
    ['PARAMETER', 'NILAI', 'KETERANGAN'],
    ['JUDUL_UJIAN', CONFIG.APP_TITLE, 'Judul utama di header ujian'],
    ['SUB_JUDUL', CONFIG.SUB_TITLE, 'Instansi / Keterangan sub-judul'],
    ['JENJANG', CONFIG.JENJANG, 'SD/MI, SMP/MTs, SMA/MA/SMK'],
    ['MATA_PELAJARAN', CONFIG.SUBJECT, 'Mata uji tes'],
    ['DURASI_MENIT', CONFIG.DURATION_MINUTES, 'Lama pengerjaan (menit)'],
    ['TOKEN_UJIAN', CONFIG.DEFAULT_TOKEN, 'Token aktif untuk login peserta'],
    ['KKM', CONFIG.KKM, 'Kriteria Ketuntasan Minimal (0-100)'],
    ['STATUS_UJIAN', 'AKTIF', 'AKTIF atau NONAKTIF']
  ];
  sheetSetting.getRange(1, 1, settingData.length, 3).setValues(settingData);
  formatHeaderRow(sheetSetting, 1, 3, headerBg, headerFontColor);
  sheetSetting.autoResizeColumns(1, 3);

  // --- SHEET 2: BANK_SOAL ---
  let sheetSoal = ss.getSheetByName('BANK_SOAL');
  if (!sheetSoal) {
    sheetSoal = ss.insertSheet('BANK_SOAL');
  }
  sheetSoal.clear();
  const soalHeaders = [
    'ID_SOAL', 'NO', 'TIPE', 'KATEGORI', 'STIMULUS_JUDUL', 'STIMULUS_TEKS',
    'PERTANYAAN', 'OPSI_A', 'OPSI_B', 'OPSI_C', 'OPSI_D', 'KUNCI_JAWABAN', 'BOBOT_POIN', 'PEMBAHASAN'
  ];
  sheetSoal.getRange(1, 1, 1, soalHeaders.length).setValues([soalHeaders]);
  formatHeaderRow(sheetSoal, 1, soalHeaders.length, '#1b365d', headerFontColor);

  // Masukkan soal awal bawaan
  const seedQuestions = ${safeQuestionsJson};
  const soalRows = seedQuestions.map(function(q, i) {
    const optA = q.options && q.options[0] ? q.options[0].text : '';
    const optB = q.options && q.options[1] ? q.options[1].text : '';
    const optC = q.options && q.options[2] ? q.options[2].text : '';
    const optD = q.options && q.options[3] ? q.options[3].text : '';
    let kunciStr = '';
    if (typeof q.correctAnswer === 'string') kunciStr = q.correctAnswer;
    else kunciStr = JSON.stringify(q.correctAnswer);

    return [
      q.id || ('Q' + (i + 1)),
      q.number || (i + 1),
      q.type,
      q.category,
      q.stimulusTitle || '',
      q.stimulusContent || '',
      q.questionText,
      optA, optB, optC, optD,
      kunciStr,
      q.points || 10,
      q.explanation || ''
    ];
  });
  if (soalRows.length > 0) {
    sheetSoal.getRange(2, 1, soalRows.length, soalHeaders.length).setValues(soalRows);
  }
  sheetSoal.autoResizeColumns(1, soalHeaders.length);

  // --- SHEET 3: DATA_PESERTA ---
  let sheetPeserta = ss.getSheetByName('DATA_PESERTA');
  if (!sheetPeserta) {
    sheetPeserta = ss.insertSheet('DATA_PESERTA');
  }
  sheetPeserta.clear();
  const pesertaHeaders = ['NISN_NO_PESERTA', 'NAMA_SISWA', 'KELAS', 'JENIS_KELAMIN', 'TANGGAL_LAHIR', 'STATUS'];
  sheetPeserta.getRange(1, 1, 1, pesertaHeaders.length).setValues([pesertaHeaders]);
  formatHeaderRow(sheetPeserta, 1, pesertaHeaders.length, '#0f766e', headerFontColor);

  const samplePeserta = [
    ['1234567890', 'Budi Santoso', 'IX-A', 'L', '2010-05-15', 'TERDAFTAR'],
    ['1234567891', 'Siti Rahmawati', 'IX-A', 'P', '2010-08-20', 'TERDAFTAR'],
    ['1234567892', 'Ahmad Dani', 'IX-B', 'L', '2010-01-10', 'TERDAFTAR'],
    ['1234567893', 'Dewi Lestari', 'IX-B', 'P', '2010-11-28', 'TERDAFTAR']
  ];
  sheetPeserta.getRange(2, 1, samplePeserta.length, pesertaHeaders.length).setValues(samplePeserta);
  sheetPeserta.autoResizeColumns(1, pesertaHeaders.length);

  // --- SHEET 4: HASIL_UJIAN ---
  let sheetHasil = ss.getSheetByName('HASIL_UJIAN');
  if (!sheetHasil) {
    sheetHasil = ss.insertSheet('HASIL_UJIAN');
  }
  if (sheetHasil.getLastRow() === 0) {
    const hasilHeaders = [
      'WAKTU_SELESAI', 'NISN', 'NAMA_SISWA', 'JENJANG', 'JML_SOAL', 'TERJAWAB',
      'BENAR', 'SALAH', 'TOTAL_SKOR', 'NILAI_AKHIR (0-100)', 'STATUS', 'RINCIAN_JAWABAN'
    ];
    sheetHasil.getRange(1, 1, 1, hasilHeaders.length).setValues([hasilHeaders]);
    formatHeaderRow(sheetHasil, 1, hasilHeaders.length, '#b45309', headerFontColor);
    sheetHasil.autoResizeColumns(1, hasilHeaders.length);
  }

  // Hapus Sheet1 default jika ada
  const defaultSheet = ss.getSheetByName('Sheet1');
  if (defaultSheet && ss.getSheets().length > 1) {
    try { ss.deleteSheet(defaultSheet); } catch (e) {}
  }

  const resultMsg = "✅ DATABASE BERHASIL DIKONFIGURASI!\\n\\nURL Spreadsheet:\\n" + ss.getUrl() + "\\n\\nID Spreadsheet: " + ssId;
  Logger.log(resultMsg);
  return { success: true, url: ss.getUrl(), id: ssId };
}

// Helper mempercantik tampilan Sheet Header
function formatHeaderRow(sheet, row, numCols, bgColor, fontColor) {
  const range = sheet.getRange(row, 1, 1, numCols);
  range.setBackground(bgColor);
  range.setFontColor(fontColor);
  range.setFontWeight('bold');
  range.setHorizontalAlignment('center');
  range.setVerticalAlignment('middle');
  sheet.setFrozenRows(1);
}

/**
 * 2. WEB APP HANDLER (doGet)
 * Menyajikan tampilan web Pusmendik CBT yang responsif
 */
function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle(CONFIG.APP_TITLE)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
}

/**
 * 3. GET DATA UJIAN (Dipanggil dari Client Index.html)
 * Mengambil bank soal dan pengaturan dari Spreadsheet secara real-time
 */
function getExamPayload(tokenInput) {
  try {
    const userProps = PropertiesService.getUserProperties();
    const ssId = userProps.getProperty('CBT_SPREADSHEET_ID');
    
    // Fallback jika belum run setupDatabase, buat otomatis sekarang!
    let ss;
    if (!ssId) {
      const setup = setupDatabase();
      ss = SpreadsheetApp.openById(setup.id);
    } else {
      ss = SpreadsheetApp.openById(ssId);
    }

    // Baca pengaturan
    const sheetSetting = ss.getSheetByName('PENGATURAN');
    const settingsVals = sheetSetting.getDataRange().getValues();
    const currentSettings = {};
    for (let i = 1; i < settingsVals.length; i++) {
      currentSettings[settingsVals[i][0]] = settingsVals[i][1];
    }

    const activeToken = currentSettings['TOKEN_UJIAN'] || CONFIG.DEFAULT_TOKEN;
    if (tokenInput && tokenInput.trim().toUpperCase() !== activeToken.trim().toUpperCase()) {
      return { success: false, error: 'Token Ujian salah atau kedaluwarsa. Silakan periksa kembali token aktif.' };
    }

    // Ambil bank soal
    const sheetSoal = ss.getSheetByName('BANK_SOAL');
    const soalVals = sheetSoal.getDataRange().getValues();
    const clientQuestions = [];

    for (let r = 1; r < soalVals.length; r++) {
      const row = soalVals[r];
      if (!row[0]) continue;

      const type = row[2];
      const options = [];
      if (row[7]) options.push({ key: 'A', text: String(row[7]) });
      if (row[8]) options.push({ key: 'B', text: String(row[8]) });
      if (row[9]) options.push({ key: 'C', text: String(row[9]) });
      if (row[10]) options.push({ key: 'D', text: String(row[10]) });

      // Note: Kunci jawaban sengaja TIDAK dikirim ke client agar tidak bisa dibobol lewat Inspect Element!
      clientQuestions.push({
        id: String(row[0]),
        number: Number(row[1]) || r,
        type: type,
        category: String(row[3]),
        stimulusTitle: String(row[4] || ''),
        stimulusContent: String(row[5] || ''),
        questionText: String(row[6]),
        options: options,
        points: Number(row[12]) || 10
      });
    }

    return {
      success: true,
      settings: {
        title: currentSettings['JUDUL_UJIAN'] || CONFIG.APP_TITLE,
        subTitle: currentSettings['SUB_JUDUL'] || CONFIG.SUB_TITLE,
        jenjang: currentSettings['JENJANG'] || CONFIG.JENJANG,
        subject: currentSettings['MATA_PELAJARAN'] || CONFIG.SUBJECT,
        durationMinutes: Number(currentSettings['DURASI_MENIT']) || CONFIG.DURATION_MINUTES,
        activeToken: activeToken,
        kkm: Number(currentSettings['KKM']) || CONFIG.KKM
      },
      questions: clientQuestions,
      spreadsheetUrl: ss.getUrl()
    };
  } catch (err) {
    return { success: false, error: err.toString() };
  }
}

/**
 * 4. SUBMIT JAWABAN PESERTA & PENILAIAN OTOMATIS
 * Menghitung skor server-side & mencatat nilai langsung ke Sheet HASIL_UJIAN
 */
function submitExam(payload) {
  try {
    const userProps = PropertiesService.getUserProperties();
    const ssId = userProps.getProperty('CBT_SPREADSHEET_ID');
    const ss = SpreadsheetApp.openById(ssId);
    const sheetSoal = ss.getSheetByName('BANK_SOAL');
    const sheetHasil = ss.getSheetByName('HASIL_UJIAN');

    const soalVals = sheetSoal.getDataRange().getValues();
    const answerKeyMap = {};
    let maxPossibleScore = 0;

    for (let r = 1; r < soalVals.length; r++) {
      const qId = String(soalVals[r][0]);
      const kunci = String(soalVals[r][11]);
      const bobot = Number(soalVals[r][12]) || 10;
      const tipe = String(soalVals[r][2]);
      const pembahasan = String(soalVals[r][13] || '');
      answerKeyMap[qId] = { kunci, bobot, tipe, pembahasan };
      maxPossibleScore += bobot;
    }

    const studentAnswers = payload.answers || {};
    let correctCount = 0;
    let earnedScore = 0;
    let answeredCount = 0;
    const reviewDetails = [];

    for (const qId in answerKeyMap) {
      const item = answerKeyMap[qId];
      const userAns = studentAnswers[qId];
      let isCorrect = false;
      let points = 0;

      if (userAns !== undefined && userAns !== null && userAns !== '') {
        answeredCount++;
        if (item.tipe === 'single_choice' || item.tipe === 'short_answer') {
          if (String(userAns).trim().toUpperCase() === String(item.kunci).trim().toUpperCase()) {
            isCorrect = true;
            points = item.bobot;
          }
        } else {
          // Kompleks / JSON comparison
          try {
            const expArr = JSON.parse(item.kunci);
            if (Array.isArray(userAns) && Array.isArray(expArr)) {
              if (userAns.sort().join(',') === expArr.sort().join(',')) {
                isCorrect = true;
                points = item.bobot;
              }
            }
          } catch (e) {
            if (String(userAns) === String(item.kunci)) {
              isCorrect = true;
              points = item.bobot;
            }
          }
        }
      }

      if (isCorrect) correctCount++;
      earnedScore += points;

      reviewDetails.push({
        qId: qId,
        userAnswer: userAns,
        correctAnswer: item.kunci,
        isCorrect: isCorrect,
        pointsEarned: points,
        maxPoints: item.bobot,
        explanation: item.pembahasan
      });
    }

    const totalQuestions = Object.keys(answerKeyMap).length;
    const finalScore100 = maxPossibleScore > 0 ? Math.round((earnedScore / maxPossibleScore) * 100) : 0;
    const student = payload.student || {};
    const statusLulus = finalScore100 >= CONFIG.KKM ? 'TUNTAS' : 'BELUM TUNTAS';

    // Catat baris ke spreadsheet HASIL_UJIAN
    const timeNow = Utilities.formatDate(new Date(), "Asia/Jakarta", "dd/MM/yyyy HH:mm:ss");
    sheetHasil.appendRow([
      timeNow,
      student.nisn || '-',
      student.nama || 'Peserta Anonim',
      student.jenjang || CONFIG.JENJANG,
      totalQuestions,
      answeredCount,
      correctCount,
      totalQuestions - correctCount,
      earnedScore,
      finalScore100,
      statusLulus,
      JSON.stringify(studentAnswers)
    ]);

    return {
      success: true,
      result: {
        nama: student.nama,
        nisn: student.nisn,
        totalQuestions: totalQuestions,
        answeredCount: answeredCount,
        correctCount: correctCount,
        score: earnedScore,
        finalScore100: finalScore100,
        statusLulus: statusLulus,
        review: reviewDetails
      }
    };
  } catch (err) {
    return { success: false, error: err.toString() };
  }
}
`;
}

export function generateIndexHtml(settings: ExamSettings, questions: Question[]): string {
  const safeQuestionsJson = JSON.stringify(questions);
  const safeSettingsJson = JSON.stringify(settings);

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>${settings.title || 'Simulasi Ujian Pusmendik TKA / ANBK'}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Public Sans', sans-serif; }
    .font-mono-num { font-family: 'JetBrains Mono', monospace; }
    /* Ukuran font dinamis Pusmendik */
    .font-scale-sm { font-size: 0.9rem; line-height: 1.45; }
    .font-scale-md { font-size: 1.05rem; line-height: 1.6; }
    .font-scale-lg { font-size: 1.25rem; line-height: 1.7; }
  </style>
</head>
<body class="bg-slate-100 text-slate-800 antialiased min-h-screen flex flex-col">

  <!-- HEADER PUSMENDIK KEMENDIKDASMEN -->
  <header class="bg-[#1b365d] text-white shadow-md sticky top-0 z-30 border-b-4 border-amber-400">
    <div class="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
      <!-- Logo & Title -->
      <div class="flex items-center gap-3">
        <div class="w-11 h-11 rounded-full bg-gradient-to-br from-[#1b365d] via-blue-900 to-[#0f172a] flex items-center justify-center p-1.5 shadow-md shrink-0 border-2 border-amber-300 ring-2 ring-amber-400/30">
          <svg class="w-full h-full text-amber-300" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="21" stroke="#f59e0b" stroke-width="1.8" stroke-dasharray="2 2" />
            <circle cx="24" cy="24" r="18" stroke="#38bdf8" stroke-width="0.8" opacity="0.7" />
            <path d="M12 34C16 32 20 33 24 35C28 33 32 32 36 34V18C32 16 28 17 24 19C20 17 16 16 12 18V34Z" fill="#1e3a8a" stroke="#f59e0b" stroke-width="1.2" />
            <path d="M22 23L21 33H27L26 23H22Z" fill="#f59e0b" />
            <rect x="20.5" y="21" width="7" height="2.5" rx="1" fill="#fbbf24" />
            <path d="M24 7C26.5 11.5 28.5 14 27.5 18C25.8 17 24 16 23 18C21.8 15 22 11.5 24 7Z" fill="#38bdf8" />
            <path d="M24 11C25 13.5 25.5 15.5 25 17.5C24.2 17 23.5 16.5 23 17.5C22.8 16 23 14 24 11Z" fill="#ffffff" />
          </svg>
        </div>
        <div>
          <h1 class="text-xs md:text-sm font-bold tracking-wide uppercase leading-tight text-amber-300">
            ${settings.title || 'SIMULASI TES KEMAMPUAN AKADEMIK (TKA)'}
          </h1>
          <p class="text-[11px] text-blue-100 font-medium hidden sm:block">
            Pusat Asesmen Pendidikan - Kemendikdasmen RI
          </p>
        </div>
      </div>

      <!-- Center / Controls: Font Sizer & Timer -->
      <div class="flex items-center gap-3 sm:gap-6">
        <!-- Font Sizing Buttons (A- / A / A+) -->
        <div class="hidden md:flex items-center bg-blue-950/60 rounded-lg p-0.5 border border-blue-400/30 text-xs">
          <span class="px-2 text-[10px] text-blue-200 uppercase font-semibold">Ukuran:</span>
          <button onclick="setFontSize('sm')" id="btn-font-sm" class="px-2 py-1 rounded font-bold hover:bg-blue-800 transition">A-</button>
          <button onclick="setFontSize('md')" id="btn-font-md" class="px-2.5 py-1 rounded font-bold bg-amber-400 text-slate-900 transition">A</button>
          <button onclick="setFontSize('lg')" id="btn-font-lg" class="px-2 py-1 rounded font-bold hover:bg-blue-800 transition">A+</button>
        </div>

        <!-- Sisa Waktu Countdown -->
        <div id="timer-box" class="flex items-center gap-2 bg-blue-900/80 px-3 py-1.5 rounded-lg border border-blue-400/30">
          <svg class="w-4 h-4 text-amber-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <div class="text-right">
            <div class="text-[9px] uppercase tracking-wider text-blue-200 leading-none">Sisa Waktu</div>
            <div id="timer-display" class="font-mono-num font-bold text-sm sm:text-base text-white tracking-widest leading-tight">
              ${settings.durationMinutes || 45}:00
            </div>
          </div>
        </div>

        <!-- Tombol Daftar Soal (Drawer) -->
        <button onclick="toggleDaftarSoal()" class="bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs md:text-sm flex items-center gap-1.5 shadow transition">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
          </svg>
          <span class="hidden sm:inline">Daftar Soal</span>
          <span id="badge-terjawab" class="bg-slate-900 text-white text-[10px] px-1.5 py-0.5 rounded-full font-mono">0/${questions.length}</span>
        </button>
      </div>
    </div>
  </header>

  <!-- SCREEN 1: LOGIN & KONFIRMASI DATA PESERTA -->
  <div id="screen-login" class="flex-1 max-w-xl w-full mx-auto p-4 sm:p-6 my-auto">
    <div class="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      <div class="bg-gradient-to-r from-[#1b365d] to-blue-800 text-white p-5 text-center">
        <h2 class="text-lg font-bold">Konfirmasi Data Peserta Ujian</h2>
        <p class="text-xs text-blue-200 mt-1">Silakan verifikasi identitas dan masukkan token untuk memulai sesi ujian.</p>
      </div>
      
      <form onsubmit="handleStartExam(event)" class="p-6 space-y-4 text-sm">
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Nama Lengkap Peserta</label>
          <input type="text" id="input-nama" required value="Budi Santoso" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">NISN / No. Ujian</label>
            <input type="text" id="input-nisn" required value="1234567890" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Jenis Kelamin</label>
            <select id="input-gender" class="w-full px-3 py-2 border rounded-lg bg-white">
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </select>
          </div>
        </div>
        <div class="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between text-xs">
          <div>
            <span class="text-slate-500">Token Rilis Ujian:</span>
            <span id="label-active-token" class="font-mono-num font-bold text-amber-900 ml-1.5 tracking-wider">${settings.token || 'PUSMENDIK26'}</span>
          </div>
          <button type="button" onclick="autoFillToken()" class="text-blue-700 hover:underline font-semibold">Salin Token</button>
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Ketikkan Token Ujian</label>
          <input type="text" id="input-token" required placeholder="Masukkan token di atas" class="w-full px-3 py-2 uppercase font-mono tracking-widest border border-amber-400 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none">
        </div>
        <button type="submit" class="w-full py-3 bg-[#1b365d] hover:bg-blue-900 text-white font-bold rounded-lg shadow-lg active:scale-98 transition flex items-center justify-center gap-2">
          <span>Mulai Kerjakan Ujian</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
        </button>
      </form>
    </div>
  </div>

  <!-- SCREEN 2: LEMBAR UJIAN CBT PUSMENDIK -->
  <main id="screen-exam" class="hidden flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 flex flex-col">
    <!-- Sub-header Soal -->
    <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-3 mb-3 flex items-center justify-between text-xs">
      <div class="flex items-center gap-2">
        <span class="px-2 py-1 bg-blue-100 text-blue-900 font-bold rounded">SOAL NO. <span id="display-no">1</span></span>
        <span id="display-category" class="text-slate-500 font-medium hidden sm:inline">Literasi Membaca</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-slate-400">Poin: <strong id="display-poin" class="text-slate-700">10</strong></span>
        <span id="display-tipe-badge" class="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">Pilihan Ganda</span>
      </div>
    </div>

    <!-- Konten Soal: Grid Dua Kolom (Kiri: Stimulus, Kanan: Opsi Jawaban) -->
    <div class="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 items-start mb-4">
      <!-- Kolom Stimulus Bacaan / Teks -->
      <div class="lg:col-span-6 bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-5 max-h-[60vh] overflow-y-auto">
        <div id="stimulus-badge" class="inline-block text-[11px] font-bold text-blue-800 bg-blue-50 px-2.5 py-1 rounded mb-2">Informasi</div>
        <h3 id="stimulus-title" class="font-bold text-base text-slate-900 mb-3">Judul Stimulus</h3>
        <div id="stimulus-body" class="text-slate-700 leading-relaxed font-scale-md whitespace-pre-line space-y-3">
          Teks stimulus pengerjaan soal...
        </div>
      </div>

      <!-- Kolom Pertanyaan & Input Jawaban -->
      <div class="lg:col-span-6 bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-5 max-h-[60vh] overflow-y-auto">
        <p id="question-text" class="font-bold text-slate-900 mb-4 font-scale-md">Pertanyaan Soal</p>
        <div id="answers-container" class="space-y-3">
          <!-- Dynamic Answer Options inserted here -->
        </div>
      </div>
    </div>

    <!-- NAVIGATION FOOTER PUSMENDIK (Sticky Bottom) -->
    <footer class="mt-auto bg-white rounded-xl shadow-md border border-slate-200 p-3 sm:p-4 flex items-center justify-between gap-2">
      <!-- Tombol Sebelumnya -->
      <button id="btn-prev" onclick="goToPrevQuestion()" class="px-4 py-2 bg-slate-200 hover:bg-slate-300 active:scale-95 text-slate-800 font-semibold rounded-lg text-xs sm:text-sm flex items-center gap-1.5 transition">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        <span>Soal Sebelumnya</span>
      </button>

      <!-- Checkbox Ragu-ragu (Warna Kuning Khas Pusmendik) -->
      <label class="flex items-center gap-2 bg-amber-100 hover:bg-amber-200 px-3 sm:px-5 py-2 rounded-lg cursor-pointer border border-amber-300 transition">
        <input type="checkbox" id="check-ragu" onchange="toggleRaguRagu(this.checked)" class="w-4 h-4 text-amber-600 rounded focus:ring-amber-500">
        <span class="font-bold text-xs sm:text-sm text-amber-900">Ragu-Ragu</span>
      </label>

      <!-- Tombol Berikutnya / Selesai -->
      <button id="btn-next" onclick="goToNextQuestion()" class="px-5 py-2 bg-[#1b365d] hover:bg-blue-900 active:scale-95 text-white font-bold rounded-lg text-xs sm:text-sm flex items-center gap-1.5 transition shadow">
        <span id="btn-next-text">Soal Berikutnya</span>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </button>
    </footer>
  </main>

  <!-- SCREEN 3: HASIL & REKAP NILAI -->
  <div id="screen-result" class="hidden flex-1 max-w-2xl w-full mx-auto p-4 sm:p-6 my-auto">
    <div class="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8 text-center">
      <div class="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
      </div>
      <h2 class="text-2xl font-black text-slate-900 mb-1">Ujian Telah Selesai!</h2>
      <p class="text-xs text-slate-500 mb-6">Jawaban Anda telah otomatis tersimpan ke Database Google Spreadsheet.</p>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left mb-6">
        <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
          <div class="text-[10px] text-slate-400 uppercase font-bold">Nilai Akhir</div>
          <div id="result-score" class="text-2xl font-black text-blue-900">0</div>
        </div>
        <div class="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
          <div class="text-[10px] text-emerald-600 uppercase font-bold">Benar</div>
          <div id="result-benar" class="text-2xl font-black text-emerald-700">0</div>
        </div>
        <div class="p-3 bg-rose-50 rounded-xl border border-rose-200">
          <div class="text-[10px] text-rose-600 uppercase font-bold">Salah</div>
          <div id="result-salah" class="text-2xl font-black text-rose-700">0</div>
        </div>
        <div class="p-3 bg-amber-50 rounded-xl border border-amber-200">
          <div class="text-[10px] text-amber-700 uppercase font-bold">Status</div>
          <div id="result-status" class="text-sm font-bold text-amber-900 mt-1">TUNTAS</div>
        </div>
      </div>

      <button onclick="restartDemo()" class="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg text-sm transition">
        Ulangi Simulasi Ujian
      </button>
    </div>
  </div>

  <!-- MODAL / DRAWER DAFTAR SOAL -->
  <div id="modal-daftar-soal" class="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs hidden flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-5 border border-slate-200">
      <div class="flex items-center justify-between pb-3 border-b mb-4">
        <div>
          <h3 class="font-bold text-base text-slate-900">Navigasi Daftar Soal</h3>
          <p class="text-xs text-slate-500">Klik nomor untuk langsung berpindah soal.</p>
        </div>
        <button onclick="toggleDaftarSoal()" class="text-slate-400 hover:text-slate-700 p-1">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <!-- Keterangan Warna Status -->
      <div class="flex items-center gap-4 text-[11px] mb-4 pb-3 border-b text-slate-600">
        <div class="flex items-center gap-1.5"><span class="w-3.5 h-3.5 rounded bg-blue-700"></span> Sudah dijawab</div>
        <div class="flex items-center gap-1.5"><span class="w-3.5 h-3.5 rounded bg-amber-400"></span> Ragu-ragu</div>
        <div class="flex items-center gap-1.5"><span class="w-3.5 h-3.5 rounded bg-white border border-slate-300"></span> Belum</div>
      </div>

      <!-- Grid Tombol Nomor Soal -->
      <div id="grid-nomor-soal" class="grid grid-cols-5 gap-2.5 max-h-64 overflow-y-auto p-1">
        <!-- Rendered dynamically -->
      </div>
    </div>
  </div>

  <!-- DATA & JAVASCRIPT ENGINE -->
  <script>
    const INITIAL_QUESTIONS = ${safeQuestionsJson};
    const INITIAL_SETTINGS = ${safeSettingsJson};

    let questions = INITIAL_QUESTIONS;
    let settings = INITIAL_SETTINGS;
    let currentIndex = 0;
    let studentAnswers = {};
    let raguMap = {};
    let studentData = {};
    let timerSeconds = (settings.durationMinutes || 45) * 60;
    let timerInterval = null;
    let currentFontSize = 'md';

    function autoFillToken() {
      document.getElementById('input-token').value = settings.token || 'PUSMENDIK26';
    }

    function setFontSize(size) {
      currentFontSize = size;
      ['sm', 'md', 'lg'].forEach(s => {
        const btn = document.getElementById('btn-font-' + s);
        if (s === size) {
          btn.className = 'px-2.5 py-1 rounded font-bold bg-amber-400 text-slate-900 transition';
        } else {
          btn.className = 'px-2 py-1 rounded font-bold hover:bg-blue-800 transition text-white';
        }
      });
      renderQuestion();
    }

    function handleStartExam(e) {
      e.preventDefault();
      const token = document.getElementById('input-token').value.trim().toUpperCase();
      const expectedToken = (settings.token || 'PUSMENDIK26').toUpperCase();

      if (token !== expectedToken) {
        alert('Token ujian salah! Silakan gunakan: ' + expectedToken);
        return;
      }

      studentData = {
        nama: document.getElementById('input-nama').value,
        nisn: document.getElementById('input-nisn').value,
        gender: document.getElementById('input-gender').value,
        jenjang: settings.jenjang
      };

      document.getElementById('screen-login').classList.add('hidden');
      document.getElementById('screen-exam').classList.remove('hidden');

      startTimer();
      renderQuestion();
      updateBadge();
    }

    function startTimer() {
      if (timerInterval) clearInterval(timerInterval);
      timerInterval = setInterval(() => {
        timerSeconds--;
        if (timerSeconds <= 0) {
          clearInterval(timerInterval);
          finishExam();
          return;
        }
        const m = Math.floor(timerSeconds / 60);
        const s = timerSeconds % 60;
        document.getElementById('timer-display').innerText = 
          String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
      }, 1000);
    }

    function renderQuestion() {
      const q = questions[currentIndex];
      if (!q) return;

      document.getElementById('display-no').innerText = q.number || (currentIndex + 1);
      document.getElementById('display-category').innerText = q.category || '';
      document.getElementById('display-poin').innerText = q.points || 10;
      
      const badgeTipe = document.getElementById('display-tipe-badge');
      if (q.type === 'single_choice') badgeTipe.innerText = 'Pilihan Ganda';
      else if (q.type === 'multiple_choice') badgeTipe.innerText = 'Pilihan Ganda Kompleks';
      else if (q.type === 'matching') badgeTipe.innerText = 'Pernyataan Benar/Salah';
      else badgeTipe.innerText = 'Isian Singkat';

      document.getElementById('stimulus-title').innerText = q.stimulusTitle || 'Stimulus Soal';
      document.getElementById('stimulus-body').innerText = q.stimulusContent || '';
      document.getElementById('question-text').innerText = q.questionText;

      const container = document.getElementById('answers-container');
      container.innerHTML = '';

      const userAns = studentAnswers[q.id];

      if (q.type === 'single_choice' && q.options) {
        q.options.forEach(opt => {
          const isSelected = userAns === opt.key;
          const div = document.createElement('label');
          div.className = 'flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ' +
            (isSelected ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-400/30' : 'bg-slate-50 border-slate-200 hover:bg-slate-100');
          div.innerHTML = \`
            <input type="radio" name="pg_\${q.id}" value="\${opt.key}" \${isSelected ? 'checked' : ''} onchange="setAnswer('\${q.id}', '\${opt.key}')" class="mt-1 w-4 h-4 text-blue-600">
            <div class="flex-1 font-scale-\${currentFontSize}">
              <strong class="text-blue-900 mr-1.5">\${opt.key}.</strong> \${opt.text}
            </div>
          \`;
          container.appendChild(div);
        });
      } else if (q.type === 'multiple_choice' && q.options) {
        const curArr = Array.isArray(userAns) ? userAns : [];
        q.options.forEach(opt => {
          const isChecked = curArr.includes(opt.key);
          const div = document.createElement('label');
          div.className = 'flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ' +
            (isChecked ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-400/30' : 'bg-slate-50 border-slate-200 hover:bg-slate-100');
          div.innerHTML = \`
            <input type="checkbox" value="\${opt.key}" \${isChecked ? 'checked' : ''} onchange="toggleMultiAnswer('\${q.id}', '\${opt.key}')" class="mt-1 w-4 h-4 text-blue-600 rounded">
            <div class="flex-1 font-scale-\${currentFontSize}">
              <strong class="text-blue-900 mr-1.5">\${opt.key}.</strong> \${opt.text}
            </div>
          \`;
          container.appendChild(div);
        });
      } else if (q.type === 'short_answer') {
        const div = document.createElement('div');
        div.className = 'space-y-2';
        div.innerHTML = \`
          <input type="text" value="\${userAns || ''}" oninput="setAnswer('\${q.id}', this.value)" placeholder="Ketikkan jawaban Anda di sini..." class="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-blue-600 outline-none text-base font-medium">
        \`;
        container.appendChild(div);
      }

      // Check ragu-ragu
      document.getElementById('check-ragu').checked = !!raguMap[q.id];

      // Next / Selesai button
      const isLast = currentIndex === questions.length - 1;
      const btnNext = document.getElementById('btn-next');
      const btnText = document.getElementById('btn-next-text');
      if (isLast) {
        btnNext.className = 'px-5 py-2 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold rounded-lg text-xs sm:text-sm flex items-center gap-1.5 transition shadow';
        btnText.innerText = 'Selesai Tes';
      } else {
        btnNext.className = 'px-5 py-2 bg-[#1b365d] hover:bg-blue-900 active:scale-95 text-white font-bold rounded-lg text-xs sm:text-sm flex items-center gap-1.5 transition shadow';
        btnText.innerText = 'Soal Berikutnya';
      }

      document.getElementById('btn-prev').disabled = currentIndex === 0;
      document.getElementById('btn-prev').style.opacity = currentIndex === 0 ? '0.4' : '1';
    }

    function setAnswer(qId, val) {
      studentAnswers[qId] = val;
      updateBadge();
    }

    function toggleMultiAnswer(qId, key) {
      let cur = studentAnswers[qId] || [];
      if (!Array.isArray(cur)) cur = [];
      if (cur.includes(key)) {
        cur = cur.filter(k => k !== key);
      } else {
        cur.push(key);
      }
      studentAnswers[qId] = cur;
      updateBadge();
      renderQuestion();
    }

    function toggleRaguRagu(isChecked) {
      const q = questions[currentIndex];
      if (!q) return;
      raguMap[q.id] = isChecked;
    }

    function goToPrevQuestion() {
      if (currentIndex > 0) {
        currentIndex--;
        renderQuestion();
      }
    }

    function goToNextQuestion() {
      if (currentIndex < questions.length - 1) {
        currentIndex++;
        renderQuestion();
      } else {
        if (confirm('Apakah Anda yakin ingin menyelesaikan ujian ini?')) {
          finishExam();
        }
      }
    }

    function toggleDaftarSoal() {
      const modal = document.getElementById('modal-daftar-soal');
      if (modal.classList.contains('hidden')) {
        renderGridSoal();
        modal.classList.remove('hidden');
      } else {
        modal.classList.add('hidden');
      }
    }

    function renderGridSoal() {
      const grid = document.getElementById('grid-nomor-soal');
      grid.innerHTML = '';
      questions.forEach((q, idx) => {
        const btn = document.createElement('button');
        const ans = studentAnswers[q.id];
        const hasAns = ans !== undefined && ans !== null && ans !== '' && (!Array.isArray(ans) || ans.length > 0);
        const isRagu = !!raguMap[q.id];
        const isCurrent = idx === currentIndex;

        let bgClass = 'bg-white text-slate-800 border-slate-300';
        if (isRagu) {
          bgClass = 'bg-amber-400 text-slate-950 font-bold border-amber-500';
        } else if (hasAns) {
          bgClass = 'bg-[#1b365d] text-white font-bold border-blue-900';
        }

        btn.className = \`h-12 rounded-xl flex flex-col items-center justify-center border text-xs relative transition active:scale-95 \${bgClass} \${isCurrent ? 'ring-2 ring-amber-400' : ''}\`;
        btn.onclick = () => {
          currentIndex = idx;
          toggleDaftarSoal();
          renderQuestion();
        };

        let labelAns = '';
        if (hasAns && typeof ans === 'string') labelAns = ans;
        else if (Array.isArray(ans)) labelAns = ans.join(',');

        btn.innerHTML = \`
          <span class="font-bold">\${q.number || (idx + 1)}</span>
          <span class="text-[9px] opacity-80">\${labelAns || '-'}</span>
        \`;
        grid.appendChild(btn);
      });
    }

    function updateBadge() {
      let count = 0;
      questions.forEach(q => {
        const ans = studentAnswers[q.id];
        if (ans !== undefined && ans !== null && ans !== '' && (!Array.isArray(ans) || ans.length > 0)) {
          count++;
        }
      });
      document.getElementById('badge-terjawab').innerText = count + '/' + questions.length;
    }

    function finishExam() {
      if (timerInterval) clearInterval(timerInterval);

      // Jika dijalankan di Google Apps Script environment, panggil google.script.run
      if (typeof google !== 'undefined' && google.script && google.script.run) {
        google.script.run
          .withSuccessHandler(onExamSubmittedSuccess)
          .withFailureHandler(onExamSubmittedError)
          .submitExam({
            student: studentData,
            answers: studentAnswers
          });
      } else {
        // Fallback pengerjaan offline/preview
        calculateLocalScore();
      }
    }

    function onExamSubmittedSuccess(resp) {
      if (!resp.success) {
        alert('Gagal mengirim jawaban: ' + resp.error);
        return;
      }
      showResultUI(resp.result.finalScore100, resp.result.correctCount, resp.result.totalQuestions - resp.result.correctCount, resp.result.statusLulus);
    }

    function onExamSubmittedError(err) {
      alert('Koneksi bermasalah: ' + err.toString());
      calculateLocalScore();
    }

    function calculateLocalScore() {
      let correct = 0;
      questions.forEach(q => {
        const ans = studentAnswers[q.id];
        if (q.type === 'single_choice' && ans === q.correctAnswer) correct++;
      });
      const score = Math.round((correct / questions.length) * 100);
      showResultUI(score, correct, questions.length - correct, score >= (settings.kkm || 70) ? 'TUNTAS' : 'BELUM TUNTAS');
    }

    function showResultUI(score, benar, salah, status) {
      document.getElementById('screen-exam').classList.add('hidden');
      document.getElementById('screen-result').classList.remove('hidden');

      document.getElementById('result-score').innerText = score;
      document.getElementById('result-benar').innerText = benar;
      document.getElementById('result-salah').innerText = salah;
      document.getElementById('result-status').innerText = status;
    }

    function restartDemo() {
      studentAnswers = {};
      raguMap = {};
      currentIndex = 0;
      timerSeconds = (settings.durationMinutes || 45) * 60;
      document.getElementById('screen-result').classList.add('hidden');
      document.getElementById('screen-login').classList.remove('hidden');
    }
  </script>
</body>
</html>
`;
}
