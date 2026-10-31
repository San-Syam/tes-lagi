/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Question } from '../types/cbt';

export const DEFAULT_QUESTIONS: Question[] = [
  {
    id: 'q-1',
    number: 1,
    type: 'single_choice',
    category: 'Literasi Membaca',
    jenjang: 'SMP/MTs',
    stimulusBadge: 'Teks Informasi & Konservasi Alam',
    stimulusTitle: 'Hutan Mangrove: Benteng Alami Pesisir Nusantara',
    stimulusContent: `Indonesia memiliki kawasan mangrove terluas di dunia, mencakup hampir 20% dari total ekosistem bakau global. Hutan bakau tidak hanya berfungsi mencegah abrasi ombak laut dan meredam terpaan badai tropis, tetapi juga menyimpan karbon biru (blue carbon) hingga 4 sampai 5 kali lebih tinggi dibandingkan hutan hujan tropis di daratan per hektar.

Akar tunjang pohon bakau jenis Rhizophora sp. bertindak sebagai penyaring sedimen alami dan tempat bertelur serta pembesaran (nursery ground) bagi ribuan spesies kepiting, udang windu, dan ikan karang muda sebelum mereka berenang menuju laut bebas. Namun, konversi lahan pesisir menjadi tambak udang intensif tak terkendali dan permukiman telah mengurangi luasan mangrove hingga 30% dalam tiga dekade terakhir. Berbagai komunitas generasi muda kini aktif menggalakkan rehabilitasi bibit bakau melalui metode gulma pelindung bambu ramah lingkungan.`,
    questionText: 'Berdasarkan teks bacaan, mengapa hutan mangrove memiliki peran yang sangat krusial dalam mitigasi perubahan iklim global?',
    options: [
      { key: 'A', text: 'Menghasilkan kayu keras berkualitas tinggi untuk bahan bakar industri lokal.' },
      { key: 'B', text: 'Mampu menyerap dan menyimpan cadangan karbon biru hingga 4-5 kali lebih besar per hektar dibanding hutan daratan.' },
      { key: 'C', text: 'Menghilangkan semua kandungan garam di air laut menjadi air tawar murni untuk permukiman warga.' },
      { key: 'D', text: 'Menyediakan lahan datar terbuka luas yang siap dijadikan sentra tambak udang intensif.' },
    ],
    correctAnswer: 'B',
    explanation: 'Pada paragraf pertama dinyatakan secara eksplisit bahwa hutan bakau menyimpan karbon biru (blue carbon) hingga 4 sampai 5 kali lebih tinggi dibandingkan hutan hujan tropis di daratan per hektar.',
    points: 10,
  },
  {
    id: 'q-2',
    number: 2,
    type: 'multiple_choice',
    category: 'Literasi Membaca',
    jenjang: 'SMP/MTs',
    stimulusBadge: 'Teks Informasi & Ekologi Pesisir',
    stimulusTitle: 'Hutan Mangrove: Benteng Alami Pesisir Nusantara',
    stimulusContent: `(Merujuk pada teks sebelumnya mengenai ekosistem dan konservasi mangrove di pesisir Indonesia).

Hutan bakau tidak hanya berfungsi mencegah abrasi ombak laut dan meredam terpaan badai tropis, tetapi juga menyaring sedimen dan menjadi tempat bertelur serta pembesaran (nursery ground) bagi ribuan fauna laut.`,
    questionText: 'Manakah dari pernyataan-pernyataan berikut yang merupakan manfaat ekologis langsung dari keberadaan akar pohon bakau? (Pilihlah lebih dari satu jawaban yang benar!)',
    options: [
      { key: 'A', text: 'Mencegah abrasi daratan pantai akibat hempasan gelombang laut dan badai.' },
      { key: 'B', text: 'Menjadi tempat pembesaran (nursery ground) bagi anak ikan karang, udang, dan kepiting.' },
      { key: 'C', text: 'Menyaring endapan sedimen lumpur agar tidak langsung menutupi terumbu karang di laut lepas.' },
      { key: 'D', text: 'Menyebabkan peningkatan keasaman air laut di sekitar muara sungai.' },
    ],
    correctAnswer: ['A', 'B', 'C'],
    explanation: 'Manfaat ekologis akar bakau meliputi penahan abrasi ombak, penyaring sedimen alami, serta nursery ground untuk larva dan anak biota laut. Opsi D keliru karena bakau tidak meningkatkan keasaman laut.',
    points: 15,
  },
  {
    id: 'q-3',
    number: 3,
    type: 'matching',
    category: 'Literasi Membaca',
    jenjang: 'SMP/MTs',
    stimulusBadge: 'Pernyataan Sesuai / Tidak Sesuai',
    stimulusTitle: 'Analisis Fakta dan Opini Konservasi Pesisir',
    stimulusContent: `Perhatikan kembali data mengenai kerusakan ekosistem pesisir:
1. Luasan mangrove berkurang hingga 30% dalam tiga dasawarsa terakhir terutama akibat alih fungsi tambak dan permukiman.
2. Rehabilitasi dilakukan oleh kelompok anak muda menggunakan inovasi bronjong/bambu penahan ombak.`,
    questionText: 'Tentukan apakah setiap pernyataan di bawah ini BENAR atau SALAH berdasarkan fakta isi teks bacaan:',
    statements: [
      {
        id: 's1',
        statement: 'Kawasan mangrove Indonesia mencakup hampir 20% dari keseluruhan ekosistem bakau dunia.',
        correctAnswer: 'BENAR',
      },
      {
        id: 's2',
        statement: 'Hutan mangrove di daratan menyerap karbon lebih sedikit dibandingkan taman rumput perkotaan biasa.',
        correctAnswer: 'SALAH',
      },
      {
        id: 's3',
        statement: 'Alih fungsi lahan menjadi tambak udang intensif dan permukiman merupakan salah satu pemicu utama susutnya luasan mangrove.',
        correctAnswer: 'BENAR',
      },
    ],
    correctAnswer: {
      s1: 'BENAR',
      s2: 'SALAH',
      s3: 'BENAR',
    },
    explanation: 'Pernyataan 1 sesuai paragraf pertama (20% total dunia). Pernyataan 2 salah karena mangrove menyimpan karbon 4-5 kali hutan hujan. Pernyataan 3 sesuai fakta alih fungsi lahan.',
    points: 15,
  },
  {
    id: 'q-4',
    number: 4,
    type: 'single_choice',
    category: 'Numerasi',
    jenjang: 'SMP/MTs',
    stimulusBadge: 'Numerasi & Pola Konsumsi Energi Rumah Tangga',
    stimulusTitle: 'Efisiensi Daya Listrik Lampu LED vs Pijar',
    stimulusContent: `Pak Rahmat ingin mengganti 8 titik lampu pijar konvensional di rumahnya dengan lampu LED hemat energi demi menekan tagihan listrik bulanan.
Data spesifikasi lampu:
- Lampu Pijar: Daya 60 Watt per buah, menyala rata-rata 10 jam per hari.
- Lampu LED: Daya 9 Watt per buah (menghasilkan intensitas cahaya setara), menyala rata-rata 10 jam per hari.
Tarif listrik PLN saat ini diasumsikan Rp1.500 per kiloWatt-hour (kWh). Rumus konsumsi energi (kWh) = (Total Watt × Total Jam Penggunaan) ÷ 1.000.
(Diasumsikan 1 bulan = 30 hari).`,
    questionText: 'Berapakah estimasi total penghematan biaya listrik keluarga Pak Rahmat dalam satu bulan (30 hari) setelah mengganti seluruh 8 lampu tersebut ke LED?',
    options: [
      { key: 'A', text: 'Rp91.800' },
      { key: 'B', text: 'Rp183.600' },
      { key: 'C', text: 'Rp216.000' },
      { key: 'D', text: 'Rp275.400' },
    ],
    correctAnswer: 'B',
    explanation: 'Penghematan daya per lampu = 60W - 9W = 51 Watt. Untuk 8 lampu = 8 × 51W = 408 Watt. Pemakaian per hari = 408 W × 10 jam = 4.080 Wh = 4,08 kWh/hari. Dalam 30 hari = 4,08 × 30 = 122,4 kWh. Penghematan biaya = 122,4 kWh × Rp1.500 = Rp183.600.',
    points: 15,
  },
  {
    id: 'q-5',
    number: 5,
    type: 'multiple_choice',
    category: 'Numerasi',
    jenjang: 'SMP/MTs',
    stimulusBadge: 'Numerasi Terapan & Perencanaan Anggaran',
    stimulusTitle: 'Peluang dan Skema Diskon Toko Alat Tulis Sekolah',
    stimulusContent: `Koperasi Sekolah "Cerdas Mandiri" memberikan promo paket persiapan Ujian Tryout Akhir:
- Paket A (3 Buku Latihan Soal + 2 Pulpen Gel): Harga Normal Rp120.000, Diskon 25%.
- Paket B (5 Buku Latihan Soal + 4 Pulpen Gel): Harga Normal Rp180.000, Diskon bertingkat 20% + tambahan voucher Rp10.000 untuk pembelian di atas Rp100.000.
- Promo Hari Jumat: Tambahan cashback tunai 5% dari harga akhir setelah diskon untuk semua paket.`,
    questionText: 'Andi membeli 1 Paket A pada hari Jumat, sedangkan Budi membeli 1 Paket B pada hari Jumat. Manakah kesimpulan perhitungan yang BENAR berikut ini? (Pilih semua yang benar)',
    options: [
      { key: 'A', text: 'Harga Paket A setelah diskon 25% (sebelum cashback Jumat) adalah tepat Rp90.000.' },
      { key: 'B', text: 'Total uang yang harus dibayarkan Andi setelah dipotong cashback Jumat adalah Rp85.500.' },
      { key: 'C', text: 'Harga Paket B setelah diskon 20% dan voucher Rp10.000 (sebelum cashback Jumat) adalah Rp134.000.' },
      { key: 'D', text: 'Budi membayar lebih murah daripada Andi karena persentase diskon Paket B lebih besar.' },
    ],
    correctAnswer: ['A', 'B', 'C'],
    explanation: 'Paket A: Rp120.000 - 25% = Rp90.000 (Opsi A benar). Cashback Jumat 5% dari Rp90.000 = Rp4.500, bayar Rp85.500 (Opsi B benar). Paket B: Rp180.000 - 20% = Rp144.000, potong voucher Rp10.000 = Rp134.000 (Opsi C benar). Opsi D keliru karena Budi membayar lebih banyak.',
    points: 20,
  },
  {
    id: 'q-6',
    number: 6,
    type: 'short_answer',
    category: 'TKA Matematika',
    jenjang: 'SMP/MTs',
    stimulusBadge: 'Penalaran Aljabar & Perbandingan',
    stimulusTitle: 'Rasio dan Kecepatan Kerja Mesin Percetakan',
    stimulusContent: `Sebuah percetakan memiliki 3 mesin cetak otomatis (Mesin X, Y, dan Z) dengan spesifikasi kapasitas produksi yang identik. Jika ketiga mesin tersebut bekerja bersama-sama secara serentak tanpa henti, mereka dapat mencetak tumpukan 1.800 eksemplar naskah soal tryout dalam durasi 40 menit.
Suatu pagi, salah satu mesin (Mesin Z) mengalami perawatan mendadak sehingga hanya 2 mesin (Mesin X dan Y) yang dapat beroperasi dengan kecepatan normal yang sama.`,
    questionText: 'Berapakah waktu (dalam satuan menit) yang dibutuhkan oleh 2 mesin tersebut untuk menyelesaikan pencetakan 1.800 eksemplar naskah soal tryout yang sama? (Tuliskan hanya angka saja)',
    correctAnswer: '60',
    explanation: 'Kapasitas 3 mesin = 1.800 eksemplar dalam 40 menit -> Kecepatan total 3 mesin = 1.800 / 40 = 45 eksemplar/menit. Kecepatan 1 mesin = 45 / 3 = 15 eksemplar/menit. Jika hanya 2 mesin bekerja, kecepatan = 2 × 15 = 30 eksemplar/menit. Waktu untuk mencetak 1.800 eksemplar = 1.800 ÷ 30 = 60 menit.',
    points: 25,
  },
];
