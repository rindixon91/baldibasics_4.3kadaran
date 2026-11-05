export enum DifficultyLevel {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}

export function getDifficultyLabel(difficulty: DifficultyLevel): string {
  switch (difficulty) {
    case DifficultyLevel.EASY:
      return 'MUDAH';
    case DifficultyLevel.MEDIUM:
      return 'SEDERHANA';
    case DifficultyLevel.HARD:
      return 'SUKAR';
  }
}

export type AnswerChoiceKey = 'A' | 'B' | 'C' | 'D';

export interface AnswerOption {
  key: AnswerChoiceKey;
  label: string;
}

export interface NotebookQuestion {
  notebookId: number;
  variationId: string;
  variationIndex: number; // 0..4 within the notebook's dedicated 5-question bank
  roomName: string;
  difficulty: DifficultyLevel;
  topic: string;
  question: string;
  options: readonly AnswerOption[];
  correctKey: AnswerChoiceKey;
  correctLabel: string;
  hintFormula: string;
}

export interface NotebookQuestionBank {
  notebookId: number;
  roomName: string;
  difficulty: DifficultyLevel;
  variations: readonly NotebookQuestion[];
}

export const VARIATIONS_PER_NOTEBOOK = 5;
export const KSSM_KADARAN_TOPIC = 'Matematik Tingkatan 1 KSSM · Bab 4.3: Kadaran';

function freezeConst<const T>(value: T): Readonly<T> {
  return Object.freeze(value);
}

/**
 * Matematik Tingkatan 1 KSSM — Bab 4.3: Kadaran
 * 7 buah buku nota × 5 variasi soalan khusus setiap buku nota = 35 soalan unik.
 * Tahap kesukaran setiap buku nota dikekalkan sepenuhnya (semua 5 variasi dalam buku nota
 * yang sama berkongsi tahap kesukaran yang sama tanpa mencampurkan soalan antara buku nota).
 */
export const NOTEBOOK_QUESTION_BANKS: readonly NotebookQuestionBank[] = freezeConst([
  // =========================================================================
  // BUKU NOTA 1 — Bilik Darjah A (MUDAH / EASY — semua 5 variasi MUDAH)
  // =========================================================================
  freezeConst({
    notebookId: 1,
    roomName: 'Bilik Darjah A',
    difficulty: DifficultyLevel.EASY,
    variations: freezeConst([
      freezeConst({
        notebookId: 1,
        variationId: 'N1_V1',
        variationIndex: 0,
        roomName: 'Bilik Darjah A',
        difficulty: DifficultyLevel.EASY,
        topic: KSSM_KADARAN_TOPIC,
        question:
          'Harga bagi dua buah buku nota ialah RM6. Berapakah harga bagi lima buah buku nota?',
        options: freezeConst([
          { key: 'A', label: 'RM12' },
          { key: 'B', label: 'RM15' },
          { key: 'C', label: 'RM18' },
          { key: 'D', label: 'RM20' },
        ]),
        correctKey: 'B',
        correctLabel: 'RM15',
        hintFormula: 'RM6 ÷ 2 = RM3 sebuah buku nota · 5 × RM3 = RM15',
      }),
      freezeConst({
        notebookId: 1,
        variationId: 'N1_V2',
        variationIndex: 1,
        roomName: 'Bilik Darjah A',
        difficulty: DifficultyLevel.EASY,
        topic: KSSM_KADARAN_TOPIC,
        question:
          'Sebanyak 3 kotak alat tulis mengandungi 24 batang pensil warna yang sama banyak. Berapa batang pensil warna yang terdapat di dalam 7 kotak alat tulis itu?',
        options: freezeConst([
          { key: 'A', label: '48' },
          { key: 'B', label: '54' },
          { key: 'C', label: '56' },
          { key: 'D', label: '64' },
        ]),
        correctKey: 'C',
        correctLabel: '56',
        hintFormula: '24 ÷ 3 = 8 batang sekotak · 7 × 8 = 56',
      }),
      freezeConst({
        notebookId: 1,
        variationId: 'N1_V3',
        variationIndex: 2,
        roomName: 'Bilik Darjah A',
        difficulty: DifficultyLevel.EASY,
        topic: KSSM_KADARAN_TOPIC,
        question:
          'Aina dapat membaca 15 muka surat buku cerita dalam masa 5 minit pada kadar yang tetap. Berapa muka surat yang dapat dibacanya dalam masa 9 minit?',
        options: freezeConst([
          { key: 'A', label: '27' },
          { key: 'B', label: '24' },
          { key: 'C', label: '30' },
          { key: 'D', label: '35' },
        ]),
        correctKey: 'A',
        correctLabel: '27',
        hintFormula: '15 ÷ 5 = 3 muka surat/minit · 9 × 3 = 27',
      }),
      freezeConst({
        notebookId: 1,
        variationId: 'N1_V4',
        variationIndex: 3,
        roomName: 'Bilik Darjah A',
        difficulty: DifficultyLevel.EASY,
        topic: KSSM_KADARAN_TOPIC,
        question:
          'Empat barisan batas taman sekolah dapat memuatkan 20 anak pokok bunga raya secara sama rata. Berapa barisan batas diperlukan untuk menanam 45 anak pokok bunga raya?',
        options: freezeConst([
          { key: 'A', label: '7' },
          { key: 'B', label: '8' },
          { key: 'C', label: '10' },
          { key: 'D', label: '9' },
        ]),
        correctKey: 'D',
        correctLabel: '9',
        hintFormula: '20 ÷ 4 = 5 anak pokok sebaris · 45 ÷ 5 = 9 barisan',
      }),
      freezeConst({
        notebookId: 1,
        variationId: 'N1_V5',
        variationIndex: 4,
        roomName: 'Bilik Darjah A',
        difficulty: DifficultyLevel.EASY,
        topic: KSSM_KADARAN_TOPIC,
        question:
          'Nisbah bilangan guli merah kepada guli biru di dalam sebuah balang ialah 2 : 5. Jika terdapat 8 biji guli merah, berapakah bilangan guli biru?',
        options: freezeConst([
          { key: 'A', label: '15' },
          { key: 'B', label: '20' },
          { key: 'C', label: '25' },
          { key: 'D', label: '16' },
        ]),
        correctKey: 'B',
        correctLabel: '20',
        hintFormula: '8 ÷ 2 = 4 sebutir satu bahagian · 5 × 4 = 20',
      }),
    ]),
  }),

  // =========================================================================
  // BUKU NOTA 2 — Bilik Darjah B (MUDAH / EASY — semua 5 variasi MUDAH)
  // =========================================================================
  freezeConst({
    notebookId: 2,
    roomName: 'Bilik Darjah B',
    difficulty: DifficultyLevel.EASY,
    variations: freezeConst([
      freezeConst({
        notebookId: 2,
        variationId: 'N2_V1',
        variationIndex: 0,
        roomName: 'Bilik Darjah B',
        difficulty: DifficultyLevel.EASY,
        topic: KSSM_KADARAN_TOPIC,
        question:
          'Tiga cawan jus memerlukan enam biji oren. Berapa biji oren yang diperlukan untuk menyediakan lima cawan jus?',
        options: freezeConst([
          { key: 'A', label: '8' },
          { key: 'B', label: '9' },
          { key: 'C', label: '10' },
          { key: 'D', label: '12' },
        ]),
        correctKey: 'C',
        correctLabel: '10',
        hintFormula: '6 biji oren ÷ 3 cawan = 2 biji oren/cawan · 5 × 2 = 10',
      }),
      freezeConst({
        notebookId: 2,
        variationId: 'N2_V2',
        variationIndex: 1,
        roomName: 'Bilik Darjah B',
        difficulty: DifficultyLevel.EASY,
        topic: KSSM_KADARAN_TOPIC,
        question:
          'Bayaran tambang bas bagi 4 orang murid ialah RM16. Berapakah jumlah tambang bas bagi 9 orang murid pada kadar yang sama?',
        options: freezeConst([
          { key: 'A', label: 'RM36' },
          { key: 'B', label: 'RM32' },
          { key: 'C', label: 'RM40' },
          { key: 'D', label: 'RM44' },
        ]),
        correctKey: 'A',
        correctLabel: 'RM36',
        hintFormula: 'RM16 ÷ 4 = RM4 seorang · 9 × RM4 = RM36',
      }),
      freezeConst({
        notebookId: 2,
        variationId: 'N2_V3',
        variationIndex: 2,
        roomName: 'Bilik Darjah B',
        difficulty: DifficultyLevel.EASY,
        topic: KSSM_KADARAN_TOPIC,
        question:
          'Sebanyak 30 buah kerusi disusun sama banyak dalam 5 baris di dewan sekolah. Berapa baris yang diperlukan untuk menyusun 48 buah kerusi?',
        options: freezeConst([
          { key: 'A', label: '6' },
          { key: 'B', label: '7' },
          { key: 'C', label: '9' },
          { key: 'D', label: '8' },
        ]),
        correctKey: 'D',
        correctLabel: '8',
        hintFormula: '30 ÷ 5 = 6 kerusi sebaris · 48 ÷ 6 = 8 baris',
      }),
      freezeConst({
        notebookId: 2,
        variationId: 'N2_V4',
        variationIndex: 3,
        roomName: 'Bilik Darjah B',
        difficulty: DifficultyLevel.EASY,
        topic: KSSM_KADARAN_TOPIC,
        question:
          'Satu resipi kuih menggunakan 3 sudu gula bagi setiap 6 cawan tepung. Jika ibu menggunakan 18 cawan tepung, berapa sudu gula yang diperlukan?',
        options: freezeConst([
          { key: 'A', label: '6' },
          { key: 'B', label: '9' },
          { key: 'C', label: '12' },
          { key: 'D', label: '15' },
        ]),
        correctKey: 'B',
        correctLabel: '9',
        hintFormula: '18 ÷ 6 = 3 gandaan adunan · 3 × 3 = 9 sudu gula',
      }),
      freezeConst({
        notebookId: 2,
        variationId: 'N2_V5',
        variationIndex: 4,
        roomName: 'Bilik Darjah B',
        difficulty: DifficultyLevel.EASY,
        topic: KSSM_KADARAN_TOPIC,
        question:
          'Farid mengayuh basikal sejauh 12 km dalam masa 30 minit pada kelajuan tetap. Berapakah jarak yang dilaluinya dalam masa 60 minit?',
        options: freezeConst([
          { key: 'A', label: '18 km' },
          { key: 'B', label: '20 km' },
          { key: 'C', label: '24 km' },
          { key: 'D', label: '36 km' },
        ]),
        correctKey: 'C',
        correctLabel: '24 km',
        hintFormula: '60 minit ÷ 30 minit = 2 · 12 km × 2 = 24 km',
      }),
    ]),
  }),

  // =========================================================================
  // BUKU NOTA 3 — Bilik Darjah C (SEDERHANA / MEDIUM — semua 5 variasi SEDERHANA)
  // =========================================================================
  freezeConst({
    notebookId: 3,
    roomName: 'Bilik Darjah C',
    difficulty: DifficultyLevel.MEDIUM,
    variations: freezeConst([
      freezeConst({
        notebookId: 3,
        variationId: 'N3_V1',
        variationIndex: 0,
        roomName: 'Bilik Darjah C',
        difficulty: DifficultyLevel.MEDIUM,
        topic: KSSM_KADARAN_TOPIC,
        question:
          'Empat meter kain berharga RM28. Berapakah harga bagi tujuh meter kain yang sama?',
        options: freezeConst([
          { key: 'A', label: 'RM42' },
          { key: 'B', label: 'RM45' },
          { key: 'C', label: 'RM49' },
          { key: 'D', label: 'RM56' },
        ]),
        correctKey: 'C',
        correctLabel: 'RM49',
        hintFormula: 'RM28 ÷ 4 m = RM7/m · 7 × RM7 = RM49',
      }),
      freezeConst({
        notebookId: 3,
        variationId: 'N3_V2',
        variationIndex: 1,
        roomName: 'Bilik Darjah C',
        difficulty: DifficultyLevel.MEDIUM,
        topic: KSSM_KADARAN_TOPIC,
        question:
          'Enam buah buku latihan berharga RM15. Menggunakan kaedah kadaran, berapakah harga bagi 10 buah buku latihan yang sama?',
        options: freezeConst([
          { key: 'A', label: 'RM22' },
          { key: 'B', label: 'RM25' },
          { key: 'C', label: 'RM28' },
          { key: 'D', label: 'RM30' },
        ]),
        correctKey: 'B',
        correctLabel: 'RM25',
        hintFormula: '(RM15 × 10) ÷ 6 = RM150 ÷ 6 = RM25',
      }),
      freezeConst({
        notebookId: 3,
        variationId: 'N3_V3',
        variationIndex: 2,
        roomName: 'Bilik Darjah C',
        difficulty: DifficultyLevel.MEDIUM,
        topic: KSSM_KADARAN_TOPIC,
        question:
          'Nisbah jisim tepung kepada jisim mentega dalam satu adunan biskut ialah 5 : 3. Jika jisim tepung ialah 350 g, berapakah jisim mentega yang diperlukan?',
        options: freezeConst([
          { key: 'A', label: '210 g' },
          { key: 'B', label: '180 g' },
          { key: 'C', label: '240 g' },
          { key: 'D', label: '250 g' },
        ]),
        correctKey: 'A',
        correctLabel: '210 g',
        hintFormula: '350 g ÷ 5 = 70 g satu bahagian · 3 × 70 g = 210 g',
      }),
      freezeConst({
        notebookId: 3,
        variationId: 'N3_V4',
        variationIndex: 3,
        roomName: 'Bilik Darjah C',
        difficulty: DifficultyLevel.MEDIUM,
        topic: KSSM_KADARAN_TOPIC,
        question:
          'Pada sekeping peta, panjang 3 cm mewakili jarak sebenar sejauh 24 km. Berapakah jarak sebenar yang diwakili oleh garis sepanjang 11 cm pada peta itu?',
        options: freezeConst([
          { key: 'A', label: '72 km' },
          { key: 'B', label: '80 km' },
          { key: 'C', label: '96 km' },
          { key: 'D', label: '88 km' },
        ]),
        correctKey: 'D',
        correctLabel: '88 km',
        hintFormula: '24 km ÷ 3 cm = 8 km/cm · 11 × 8 km = 88 km',
      }),
      freezeConst({
        notebookId: 3,
        variationId: 'N3_V5',
        variationIndex: 4,
        roomName: 'Bilik Darjah C',
        difficulty: DifficultyLevel.MEDIUM,
        topic: KSSM_KADARAN_TOPIC,
        question:
          'Seorang pekerja sambilan menerima upah sebanyak RM54 bagi 6 jam bekerja pada kadar tetap. Berapa jam dia perlu bekerja untuk memperoleh RM99?',
        options: freezeConst([
          { key: 'A', label: '9 jam' },
          { key: 'B', label: '11 jam' },
          { key: 'C', label: '12 jam' },
          { key: 'D', label: '13 jam' },
        ]),
        correctKey: 'B',
        correctLabel: '11 jam',
        hintFormula: 'RM54 ÷ 6 jam = RM9/jam · RM99 ÷ RM9 = 11 jam',
      }),
    ]),
  }),

  // =========================================================================
  // BUKU NOTA 4 — Bilik Darjah D (SEDERHANA / MEDIUM — semua 5 variasi SEDERHANA)
  // =========================================================================
  freezeConst({
    notebookId: 4,
    roomName: 'Bilik Darjah D',
    difficulty: DifficultyLevel.MEDIUM,
    variations: freezeConst([
      freezeConst({
        notebookId: 4,
        variationId: 'N4_V1',
        variationIndex: 0,
        roomName: 'Bilik Darjah D',
        difficulty: DifficultyLevel.MEDIUM,
        topic: KSSM_KADARAN_TOPIC,
        question:
          'Sebuah kereta bergerak sejauh 90 km dalam masa dua jam pada kelajuan malar. Berapakah jarak yang dilalui oleh kereta itu dalam masa lima jam?',
        options: freezeConst([
          { key: 'A', label: '180 km' },
          { key: 'B', label: '200 km' },
          { key: 'C', label: '225 km' },
          { key: 'D', label: '250 km' },
        ]),
        correctKey: 'C',
        correctLabel: '225 km',
        hintFormula: '90 km ÷ 2 jam = 45 km/j · 5 × 45 km = 225 km',
      }),
      freezeConst({
        notebookId: 4,
        variationId: 'N4_V2',
        variationIndex: 1,
        roomName: 'Bilik Darjah D',
        difficulty: DifficultyLevel.MEDIUM,
        topic: KSSM_KADARAN_TOPIC,
        question:
          'Sebanyak 4 liter cat dapat mengecat seluas 36 meter persegi dinding bilik darjah. Berapakah keluasan dinding yang dapat dicat dengan menggunakan 9 liter cat?',
        options: freezeConst([
          { key: 'A', label: '81 m²' },
          { key: 'B', label: '72 m²' },
          { key: 'C', label: '84 m²' },
          { key: 'D', label: '90 m²' },
        ]),
        correctKey: 'A',
        correctLabel: '81 m²',
        hintFormula: '36 m² ÷ 4 liter = 9 m²/liter · 9 × 9 m² = 81 m²',
      }),
      freezeConst({
        notebookId: 4,
        variationId: 'N4_V3',
        variationIndex: 2,
        roomName: 'Bilik Darjah D',
        difficulty: DifficultyLevel.MEDIUM,
        topic: KSSM_KADARAN_TOPIC,
        question:
          'Sebuah pam air mengisi 120 liter air ke dalam tangki dalam masa 8 minit. Pada kadar yang sama, berapa minit diperlukan untuk mengisi 195 liter air?',
        options: freezeConst([
          { key: 'A', label: '11 minit' },
          { key: 'B', label: '12 minit' },
          { key: 'C', label: '15 minit' },
          { key: 'D', label: '13 minit' },
        ]),
        correctKey: 'D',
        correctLabel: '13 minit',
        hintFormula: '120 liter ÷ 8 minit = 15 liter/minit · 195 ÷ 15 = 13 minit',
      }),
      freezeConst({
        notebookId: 4,
        variationId: 'N4_V4',
        variationIndex: 3,
        roomName: 'Bilik Darjah D',
        difficulty: DifficultyLevel.MEDIUM,
        topic: KSSM_KADARAN_TOPIC,
        question:
          'Seorang pekebun menggunakan 6 kg baja organik untuk 15 batas sayur secara sama rata. Berapa kilogram baja diperlukan untuk 25 batas sayur?',
        options: freezeConst([
          { key: 'A', label: '8 kg' },
          { key: 'B', label: '10 kg' },
          { key: 'C', label: '12 kg' },
          { key: 'D', label: '15 kg' },
        ]),
        correctKey: 'B',
        correctLabel: '10 kg',
        hintFormula: '(6 kg × 25) ÷ 15 = 150 ÷ 15 = 10 kg',
      }),
      freezeConst({
        notebookId: 4,
        variationId: 'N4_V5',
        variationIndex: 4,
        roomName: 'Bilik Darjah D',
        difficulty: DifficultyLevel.MEDIUM,
        topic: KSSM_KADARAN_TOPIC,
        question:
          'Nisbah murid lelaki kepada murid perempuan dalam Kelab Matematik ialah 3 : 4. Jika terdapat 24 orang murid perempuan, berapakah jumlah keseluruhan murid dalam kelab itu?',
        options: freezeConst([
          { key: 'A', label: '18 orang' },
          { key: 'B', label: '36 orang' },
          { key: 'C', label: '42 orang' },
          { key: 'D', label: '48 orang' },
        ]),
        correctKey: 'C',
        correctLabel: '42 orang',
        hintFormula: '24 ÷ 4 = 6 orang satu bahagian · (3 + 4) × 6 = 42 orang',
      }),
    ]),
  }),

  // =========================================================================
  // BUKU NOTA 5 — Perpustakaan (SUKAR / HARD — semua 5 variasi SUKAR)
  // =========================================================================
  freezeConst({
    notebookId: 5,
    roomName: 'Perpustakaan',
    difficulty: DifficultyLevel.HARD,
    variations: freezeConst([
      freezeConst({
        notebookId: 5,
        variationId: 'N5_V1',
        variationIndex: 0,
        roomName: 'Perpustakaan',
        difficulty: DifficultyLevel.HARD,
        topic: KSSM_KADARAN_TOPIC,
        question:
          'Sebuah pencetak mencetak 180 helai halaman dalam masa enam minit. Berapa helai halaman yang dapat dicetak dalam masa 14 minit pada kadar yang sama?',
        options: freezeConst([
          { key: 'A', label: '360' },
          { key: 'B', label: '400' },
          { key: 'C', label: '420' },
          { key: 'D', label: '480' },
        ]),
        correctKey: 'C',
        correctLabel: '420',
        hintFormula: '180 ÷ 6 = 30 halaman/minit · 14 × 30 = 420',
      }),
      freezeConst({
        notebookId: 5,
        variationId: 'N5_V2',
        variationIndex: 1,
        roomName: 'Perpustakaan',
        difficulty: DifficultyLevel.HARD,
        topic: KSSM_KADARAN_TOPIC,
        question:
          'Sebuah mesin membalut 135 buah buku rujukan dalam masa 15 minit pada kadar seragam. Berapa buah buku rujukan dapat dibalut dalam masa 1 jam 20 minit?',
        options: freezeConst([
          { key: 'A', label: '630' },
          { key: 'B', label: '720' },
          { key: 'C', label: '675' },
          { key: 'D', label: '810' },
        ]),
        correctKey: 'B',
        correctLabel: '720',
        hintFormula: '1 jam 20 minit = 80 minit · (135 ÷ 15) × 80 = 9 × 80 = 720',
      }),
      freezeConst({
        notebookId: 5,
        variationId: 'N5_V3',
        variationIndex: 2,
        roomName: 'Perpustakaan',
        difficulty: DifficultyLevel.HARD,
        topic: KSSM_KADARAN_TOPIC,
        question:
          'Nisbah buku fiksyen kepada buku ilmiah di sebuah sudut bacaan ialah 7 : 4. Jika bilangan buku fiksyen adalah 84 buah lebih banyak daripada buku ilmiah, berapakah jumlah keseluruhan buku di sudut itu?',
        options: freezeConst([
          { key: 'A', label: '308' },
          { key: 'B', label: '280' },
          { key: 'C', label: '336' },
          { key: 'D', label: '196' },
        ]),
        correctKey: 'A',
        correctLabel: '308',
        hintFormula: '84 ÷ (7 − 4) = 28 satu bahagian · (7 + 4) × 28 = 308',
      }),
      freezeConst({
        notebookId: 5,
        variationId: 'N5_V4',
        variationIndex: 3,
        roomName: 'Perpustakaan',
        difficulty: DifficultyLevel.HARD,
        topic: KSSM_KADARAN_TOPIC,
        question:
          'Harga bagi 250 g kacang badam ialah RM13.50. Berapakah harga yang perlu dibayar untuk membeli 1.5 kg kacang badam pada kadar harga yang sama?',
        options: freezeConst([
          { key: 'A', label: 'RM67.50' },
          { key: 'B', label: 'RM75.00' },
          { key: 'C', label: 'RM94.50' },
          { key: 'D', label: 'RM81.00' },
        ]),
        correctKey: 'D',
        correctLabel: 'RM81.00',
        hintFormula: '1.5 kg = 1500 g · (1500 ÷ 250) × RM13.50 = 6 × RM13.50 = RM81.00',
      }),
      freezeConst({
        notebookId: 5,
        variationId: 'N5_V5',
        variationIndex: 4,
        roomName: 'Perpustakaan',
        difficulty: DifficultyLevel.HARD,
        topic: KSSM_KADARAN_TOPIC,
        question:
          'Syafiq menaip 315 patah perkataan dalam masa 7 minit pada kelajuan tetap. Jika sebuah karangan mempunyai 765 patah perkataan keseluruhannya, berapa minit diperlukan untuk menyiapkan karangan itu?',
        options: freezeConst([
          { key: 'A', label: '15 minit' },
          { key: 'B', label: '16 minit' },
          { key: 'C', label: '17 minit' },
          { key: 'D', label: '19 minit' },
        ]),
        correctKey: 'C',
        correctLabel: '17 minit',
        hintFormula: '315 ÷ 7 = 45 perkataan/minit · 765 ÷ 45 = 17 minit',
      }),
    ]),
  }),

  // =========================================================================
  // BUKU NOTA 6 — Makmal Sains (SUKAR / HARD — semua 5 variasi SUKAR)
  // =========================================================================
  freezeConst({
    notebookId: 6,
    roomName: 'Makmal Sains',
    difficulty: DifficultyLevel.HARD,
    variations: freezeConst([
      freezeConst({
        notebookId: 6,
        variationId: 'N6_V1',
        variationIndex: 0,
        roomName: 'Makmal Sains',
        difficulty: DifficultyLevel.HARD,
        topic: KSSM_KADARAN_TOPIC,
        question:
          'Sebuah kedai roti menggunakan 3.5 kg tepung untuk membuat 50 biji ban. Berapakah jisim tepung yang diperlukan untuk membuat 120 biji ban pada kadar yang sama?',
        options: freezeConst([
          { key: 'A', label: '7.2 kg' },
          { key: 'B', label: '8.0 kg' },
          { key: 'C', label: '8.4 kg' },
          { key: 'D', label: '9.2 kg' },
        ]),
        correctKey: 'C',
        correctLabel: '8.4 kg',
        hintFormula: '(3.5 ÷ 50) × 120 = 0.07 × 120 = 8.4 kg',
      }),
      freezeConst({
        notebookId: 6,
        variationId: 'N6_V2',
        variationIndex: 1,
        roomName: 'Makmal Sains',
        difficulty: DifficultyLevel.HARD,
        topic: KSSM_KADARAN_TOPIC,
        question:
          'Di dalam makmal sains, 4.5 g hablur garam dilarutkan sepenuhnya di dalam 150 ml air suling untuk membentuk larutan piawai. Berapakah jisim hablur garam yang diperlukan bagi 650 ml air suling pada kepekatan yang sama?',
        options: freezeConst([
          { key: 'A', label: '19.5 g' },
          { key: 'B', label: '18.0 g' },
          { key: 'C', label: '21.5 g' },
          { key: 'D', label: '22.5 g' },
        ]),
        correctKey: 'A',
        correctLabel: '19.5 g',
        hintFormula: '(4.5 ÷ 150) × 650 = 0.03 × 650 = 19.5 g',
      }),
      freezeConst({
        notebookId: 6,
        variationId: 'N6_V3',
        variationIndex: 2,
        roomName: 'Makmal Sains',
        difficulty: DifficultyLevel.HARD,
        topic: KSSM_KADARAN_TOPIC,
        question:
          'Sebatang dawai kuprum seragam sepanjang 2.4 meter mempunyai jisim 156 g. Berapakah panjang dawai kuprum yang sama jenis jika jisimnya ialah 455 g?',
        options: freezeConst([
          { key: 'A', label: '6.2 meter' },
          { key: 'B', label: '6.5 meter' },
          { key: 'C', label: '7.5 meter' },
          { key: 'D', label: '7.0 meter' },
        ]),
        correctKey: 'D',
        correctLabel: '7.0 meter',
        hintFormula: '156 g ÷ 2.4 m = 65 g/m · 455 g ÷ 65 g/m = 7.0 meter',
      }),
      freezeConst({
        notebookId: 6,
        variationId: 'N6_V4',
        variationIndex: 3,
        roomName: 'Makmal Sains',
        difficulty: DifficultyLevel.HARD,
        topic: KSSM_KADARAN_TOPIC,
        question:
          'Suatu sampel aloi loyang dihasilkan dengan mencampurkan kuprum dan zink mengikut nisbah jisim 7 : 3. Jika jumlah jisim aloi loyang itu ialah 4.6 kg, berapakah jisim kuprum di dalamnya?',
        options: freezeConst([
          { key: 'A', label: '1.38 kg' },
          { key: 'B', label: '3.22 kg' },
          { key: 'C', label: '3.15 kg' },
          { key: 'D', label: '3.45 kg' },
        ]),
        correctKey: 'B',
        correctLabel: '3.22 kg',
        hintFormula: '4.6 kg ÷ (7 + 3) = 0.46 kg satu bahagian · 7 × 0.46 kg = 3.22 kg',
      }),
      freezeConst({
        notebookId: 6,
        variationId: 'N6_V5',
        variationIndex: 4,
        roomName: 'Makmal Sains',
        difficulty: DifficultyLevel.HARD,
        topic: KSSM_KADARAN_TOPIC,
        question:
          'Sebuah panel suria ujian menjana 2.7 kWj tenaga elektrik dalam masa 1.5 jam di bawah cahaya matahari malar. Berapakah tenaga elektrik yang dijana dalam masa 4.5 jam?',
        options: freezeConst([
          { key: 'A', label: '7.2 kWj' },
          { key: 'B', label: '8.1 kWj' },
          { key: 'C', label: '8.4 kWj' },
          { key: 'D', label: '9.0 kWj' },
        ]),
        correctKey: 'B',
        correctLabel: '8.1 kWj',
        hintFormula: '(2.7 ÷ 1.5) × 4.5 = 1.8 × 4.5 = 8.1 kWj',
      }),
    ]),
  }),

  // =========================================================================
  // BUKU NOTA 7 — Makmal Komputer (SUKAR / HARD — semua 5 variasi SUKAR)
  // =========================================================================
  freezeConst({
    notebookId: 7,
    roomName: 'Makmal Komputer',
    difficulty: DifficultyLevel.HARD,
    variations: freezeConst([
      freezeConst({
        notebookId: 7,
        variationId: 'N7_V1',
        variationIndex: 0,
        roomName: 'Makmal Komputer',
        difficulty: DifficultyLevel.HARD,
        topic: KSSM_KADARAN_TOPIC,
        question:
          'Sebuah kereta menggunakan 12 liter petrol untuk bergerak sejauh 150 km. Berapa liter petrol yang diperlukan untuk bergerak sejauh 275 km pada kadar yang sama?',
        options: freezeConst([
          { key: 'A', label: '18 liter' },
          { key: 'B', label: '20 liter' },
          { key: 'C', label: '22 liter' },
          { key: 'D', label: '24 liter' },
        ]),
        correctKey: 'C',
        correctLabel: '22 liter',
        hintFormula: '(12 ÷ 150) × 275 = 0.08 × 275 = 22 liter',
      }),
      freezeConst({
        notebookId: 7,
        variationId: 'N7_V2',
        variationIndex: 1,
        roomName: 'Makmal Komputer',
        difficulty: DifficultyLevel.HARD,
        topic: KSSM_KADARAN_TOPIC,
        question:
          'Sebuah komputer di makmal memuat turun fail bersaiz 540 MB dalam masa 45 saat pada kelajuan rangkaian tetap. Berapakah saiz fail yang dapat dimuat turun dalam masa 2 minit 15 saat?',
        options: freezeConst([
          { key: 'A', label: '1440 MB' },
          { key: 'B', label: '1620 MB' },
          { key: 'C', label: '1560 MB' },
          { key: 'D', label: '1800 MB' },
        ]),
        correctKey: 'B',
        correctLabel: '1620 MB',
        hintFormula: '2 minit 15 saat = 135 saat · (540 ÷ 45) × 135 = 12 × 135 = 1620 MB',
      }),
      freezeConst({
        notebookId: 7,
        variationId: 'N7_V3',
        variationIndex: 2,
        roomName: 'Makmal Komputer',
        difficulty: DifficultyLevel.HARD,
        topic: KSSM_KADARAN_TOPIC,
        question:
          'Dalam suatu pertukaran mata wang, RM68 dapat ditukar kepada 20 Dolar Singapura pada kadar tetap. Berapakah nilai dalam Ringgit Malaysia yang diperlukan untuk menukar 85 Dolar Singapura?',
        options: freezeConst([
          { key: 'A', label: 'RM289' },
          { key: 'B', label: 'RM272' },
          { key: 'C', label: 'RM295' },
          { key: 'D', label: 'RM306' },
        ]),
        correctKey: 'A',
        correctLabel: 'RM289',
        hintFormula: '(RM68 ÷ 20) × 85 = RM3.40 × 85 = RM289',
      }),
      freezeConst({
        notebookId: 7,
        variationId: 'N7_V4',
        variationIndex: 3,
        roomName: 'Makmal Komputer',
        difficulty: DifficultyLevel.HARD,
        topic: KSSM_KADARAN_TOPIC,
        question:
          'Sebuah pelayan komputer memproses 168 imej grafik dalam masa 2.8 minit pada kadar seragam. Berapa minit diperlukan oleh pelayan itu untuk memproses 450 imej grafik?',
        options: freezeConst([
          { key: 'A', label: '6.5 minit' },
          { key: 'B', label: '7.0 minit' },
          { key: 'C', label: '8.2 minit' },
          { key: 'D', label: '7.5 minit' },
        ]),
        correctKey: 'D',
        correctLabel: '7.5 minit',
        hintFormula: '168 ÷ 2.8 = 60 imej/minit · 450 ÷ 60 = 7.5 minit',
      }),
      freezeConst({
        notebookId: 7,
        variationId: 'N7_V5',
        variationIndex: 4,
        roomName: 'Makmal Komputer',
        difficulty: DifficultyLevel.HARD,
        topic: KSSM_KADARAN_TOPIC,
        question:
          'Sebuah komputer riba menggunakan 18% kuasa baterinya selepas beroperasi selama 45 minit pada penggunaan seragam. Berapa peratus kuasa bateri yang digunakan jika ia beroperasi selama 2 jam 5 minit?',
        options: freezeConst([
          { key: 'A', label: '45%' },
          { key: 'B', label: '48%' },
          { key: 'C', label: '50%' },
          { key: 'D', label: '54%' },
        ]),
        correctKey: 'C',
        correctLabel: '50%',
        hintFormula: '2 jam 5 minit = 125 minit · (18% ÷ 45) × 125 = 0.4% × 125 = 50%',
      }),
    ]),
  }),
]);

/**
 * Kesemua 35 soalan unik (7 buku nota × 5 variasi).
 */
export const ALL_NOTEBOOK_QUESTIONS: readonly NotebookQuestion[] = Object.freeze(
  NOTEBOOK_QUESTION_BANKS.flatMap((bank) => bank.variations)
);

/**
 * Senarai 7 entri rujukan lalai (Variasi 1 bagi setiap buku nota 1..7).
 */
export const QUESTION_DATABASE: readonly NotebookQuestion[] = Object.freeze(
  NOTEBOOK_QUESTION_BANKS.map((bank) => bank.variations[0])
);

export function getQuestionBankForNotebook(notebookId: number): NotebookQuestionBank {
  const bank = NOTEBOOK_QUESTION_BANKS.find((b) => b.notebookId === notebookId);
  if (!bank) {
    throw new Error(`ID buku nota tidak sah: ${notebookId}`);
  }
  return bank;
}

export function getQuestionVariationsForNotebook(notebookId: number): readonly NotebookQuestion[] {
  return getQuestionBankForNotebook(notebookId).variations;
}

export function getQuestionVariationById(
  notebookId: number,
  variationId: string
): NotebookQuestion {
  const bank = getQuestionBankForNotebook(notebookId);
  const found = bank.variations.find((v) => v.variationId === variationId);
  if (!found) {
    throw new Error(`Variasi soalan tidak sah (${variationId}) bagi buku nota ${notebookId}`);
  }
  return found;
}

export function getQuestionByNotebookId(notebookId: number): NotebookQuestion {
  return getQuestionBankForNotebook(notebookId).variations[0];
}

export function validateQuestionAnswer(
  question: NotebookQuestion,
  selectedKey: AnswerChoiceKey
): boolean {
  return question.correctKey === selectedKey;
}

export function validateNotebookAnswer(
  notebookId: number,
  selectedKey: AnswerChoiceKey,
  variationId?: string
): boolean {
  const question = variationId
    ? getQuestionVariationById(notebookId, variationId)
    : getQuestionByNotebookId(notebookId);
  return validateQuestionAnswer(question, selectedKey);
}

/**
 * Memilih SATU soalan secara rawak daripada 5 variasi khusus bagi setiap buku nota (1..7)
 * apabila sesi permainan baharu bermula, sambil mengelakkan pengulangan variasi yang sama
 * daripada sesi permainan sebelumnya.
 */
export function selectSessionQuestionsForAllNotebooks(
  previousVariationIds?: Readonly<Record<number, string>>,
  rng: () => number = Math.random
): Record<number, NotebookQuestion> {
  const selected: Record<number, NotebookQuestion> = {};
  for (const bank of NOTEBOOK_QUESTION_BANKS) {
    const prevId = previousVariationIds?.[bank.notebookId];
    const nonRepeatingPool = prevId
      ? bank.variations.filter((v) => v.variationId !== prevId)
      : bank.variations;
    const pool = nonRepeatingPool.length > 0 ? nonRepeatingPool : bank.variations;
    const raw = rng();
    const clamped = Number.isFinite(raw) ? Math.max(0, Math.min(0.999999999, raw)) : 0;
    const pickedIndex = Math.floor(clamped * pool.length);
    selected[bank.notebookId] = pool[pickedIndex];
  }
  return selected;
}
