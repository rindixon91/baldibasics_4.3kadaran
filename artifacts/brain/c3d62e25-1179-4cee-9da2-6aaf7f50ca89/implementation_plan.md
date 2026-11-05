# Kemas Kini Kawalan UI, Mod Skrin Penuh & Sistem Kelajuan Baldi (70–130)

Pelan ini memperincikan penambahbaikan antaramuka pemain untuk mengelakkan tindihan lencana terapung *"Powered by Netlify"*, membaiki fungsi butang **Mod Skrin Penuh** merentas pelayar komputer serta peranti mudah alih, dan menyelaraskan semula sistem kelajuan pergerakan Baldi daripada **70** hingga had maksimum **130**.

## User Review & Critical Decisions

> [!IMPORTANT]
> Pilihan reka bentuk dan peraturan permainan berikut telah disahkan berdasarkan maklum balas anda dan menjadi asas pelaksanaan ini:

- **Kedudukan Kawalan Bawah-Kanan (Elak Lencana Netlify)**: Menaikkan gugusan butang tindakan sentuh di penjuru bawah-kanan (`LARI`, `INTERAKSI`, `LOMPAT`) serta dok inventori bawah-kanan pada paparan komputer supaya berada sepenuhnya di atas kawasan lencana *"Powered by Netlify"*, sambil mengekalkan kayu bedik maya di penjuru bawah-kiri untuk keselesaan ibu jari kiri.
- **Peraturan Kelajuan Baldi pada Buku Nota Ke-7**: Kelajuan Baldi bermula pada **70**, meningkat serta-merta sebanyak **+10** bagi setiap jawapan salah (`70 → 80 → 90 → 100 → 110 → 120 → 130`), kekal tidak berubah bagi jawapan betul pada buku nota ke-1 hingga ke-6, melonjak terus ke **130** apabila kesemua **7/7** buku nota dikumpulkan, dan **tidak sekali-kali melebihi 130**.
- **Sokongan Pelayar Mudah Alih untuk Mod Skrin Penuh**: Pada pelayar yang menyekat API skrin penuh asli (seperti Safari pada iPhone), butang **Mod Skrin Penuh** akan menogol **Mod Ruang Pandang Diperluas (Expanded Viewport Mode)** berserta makluman ringkas dalam Bahasa Melayu.

---

## 1. Overview & Core Concept

- **What It Does**: Menyelesaikan tiga isu utama pengalaman pemain dalam permainan pendidikan matematik KSSM Tingkatan 1 (*Bab 4.3: Kadaran*):
  1. Memastikan semua butang tindakan sentuh dan slot inventori bebas sepenuhnya daripada halangan tindihan lencana pengehosan di penjuru bawah-kanan skrin.
  2. Membolehkan butang **Mod Skrin Penuh** berfungsi secara konsisten pada komputer riba, tablet Android/iPad, dan telefon pintar dengan penyelarasan saiz kanvas permainan secara automatik.
  3. Menetapkan lengkung kesukaran kelajuan Baldi yang lebih adil pada awal permainan (**70**) dan terkawal sehingga had maksimum tetap (**130**).
- **Target Audience / Persona**: Pelajar Tingkatan 1 di Malaysia yang bermain melalui pelayar telefon pintar (termasuk Safari iOS dan Chrome Android dalam orientasi menegak mahupun melintang), iPad/tablet, serta komputer sekolah atau rumah.
- **Key Value**: Kawalan sentuh dan inventori tidak lagi terhalang ketika saat genting dikejar Baldi, paparan skrin penuh bertindak balas dengan jelas pada semua peranti, dan peningkatan kelajuan Baldi dapat dirasai serta dipantau dengan tepat mengikut prestasi jawapan pelajar.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Kawalan Permainan Bebas Halangan (Mudah Alih & Komputer)**:
   - *Skrin Sentuh (Melintang & Menegak)*: Gugusan butang `LARI`, `INTERAKSI`, dan `LOMPAT` di penjuru bawah-kanan dianjakkan ke atas melepasi zon lencana *"Powered by Netlify"* (~68–72px ruang kelegaan bawah ditambah ruang selamat peranti). Dalam mod menegak (*portrait*), bar inventori 4-slot dan gesaan interaksi turut diselaraskan ke atas sedikit supaya tidak bertindih dengan butang `LOMPAT`.
   - *Komputer / Papan Kekunci*: Dok inventori 4-slot di penjuru bawah-kanan dinaikkan di atas zon lencana yang sama, manakala panel Nyawa & Stamina di penjuru bawah-kiri kekal kemas dan seimbang.
2. **Menogol Mod Skrin Penuh (`TETAPAN & KAWALAN PERMAINAN`)**:
   - Apabila pemain menekan **Mod Skrin Penuh**, sistem mencuba API skrin penuh piawai dan WebKit terlebih dahulu.
   - Jika disokong (komputer, Android, iPadOS mod penuh), pelayar terus memasuki skrin penuh, label butang bertukar kepada **Keluar Skrin Penuh**, dan kanvas sekolah berserta HUD melaras semula saiz tanpa herotan. Jika pemain menekan kekunci `Esc` untuk keluar, status butang dikemas kini secara automatik.
   - Jika pelayar menyekat skrin penuh asli (contohnya Safari pada iPhone atau bingkai terhad), sistem mengaktifkan **Mod Ruang Pandang Diperluas** yang mengunci ruang pandang dinamik penuh (`100dvw × 100dvh`), menatal halaman ke `(0, 0)`, menukar status butang secara aktif/mati, serta memaparkan nota panduan ringkas dalam Bahasa Melayu di bawah butang (termasuk petua *"Tambah ke Skrin Utama"* untuk paparan penuh pada iOS).
3. **Maklum Balas Serta-Merta Kelajuan Baldi (`70` hingga `130`)**:
   - Pada permulaan permainan (`0/7` buku nota), papan HUD atas-kiri memaparkan `Kelajuan Baldi 70` (atau `Baldi 70` pada skrin sempit), dan pergerakan Baldi di koridor ketara lebih perlahan untuk memberi ruang kepada pelajar memahami peta.
   - Sebaik sahaja pelajar memilih jawapan yang **salah** pada lembaran buku nota, kelajuan Baldi terus meningkat sebanyak **+10** pada saat pilihan ditekan (tanpa menunggu animasi penutupan tetingkap), bunyi amaran dimainkan, dan nilai baharu (`80`, `90`, ..., sehingga maksimum `130`) dipaparkan serta-merta pada HUD dan sepanduk pemberitahuan.
   - Jika pelajar menjawab **betul** (buku nota 1 hingga 6), kelajuan Baldi kekal pada nilai semasa.
   - Apabila buku nota ke-7 berjaya diselesaikan (Fasa Melarikan Diri Terakhir), kelajuan Baldi melonjak ke **130** dan kekal dihadkan pada **130** walaupun berlaku sebarang percubaan salah sebelum itu.

### Visual Identity & Theme

- **Aesthetic Direction**: Papan tulis bilik darjah retro (*schoolhouse chalkboard & warm wood trim*) yang konsisten dengan tema permainan sedia ada — jelas dibaca dalam pencahayaan luar mahupun dalam kelas.
- **Color Palette & Mood**:
  - Kanvas & Panel Utama (60%): Hijau papan tulis gelap (`#143622` / `#0c2315`) dan plak HUD gelap legap (`rgba(15, 23, 18, 0.90)`).
  - Permukaan Struktur & Bingkai (30%): Kemasan kayu coklat hangat (`#9c6631` / `#b87a3d`) dan teks kapur putih bersih (`#f8fafc`).
  - Aksen Keadaan & Tindakan (10%): Kuning ambar (`#fbbf24`) untuk objektif/fokus, hijau zamrud (`#10b981`) untuk pengesahan aktif/betul, dan merah amaran (`#dc2626`) untuk jawapan salah serta fasa kejaran akhir.
- **Typography & Hierarchy**:
  - Tajuk & Butang Kawalan: `Outfit` tebal satu baris (`whitespace-nowrap`) dengan kontras tinggi.
  - Teks Kandungan & Makluman: `Plus Jakarta Sans` yang mudah dibaca oleh pelajar Tingkatan 1.
  - Angka Kelajuan, Pemasa & Statistik: `JetBrains Mono` dengan angka jadual (`tabular-nums`) supaya bacaan `70` hingga `130` tidak berganjak lebar apabila berubah.
- **Spatial & Ergonomic Math**:
  - Saiz sasaran sentuh minimum dikekalkan $\ge 44 \times 44\text{px}$ (`60px–80px` bagi butang `LARI`, `LOMPAT`, dan `INTERAKSI`).
  - Ruang kelegaan bawah-kanan: `calc(4.5rem + env(safe-area-inset-bottom, 0px))` pada skrin biasa dan `calc(4rem + env(safe-area-inset-bottom, 0px))` pada skrin melintang rendah (`max-height: 500px`), memberikan jurang bersih di atas lencana ~44px *"Powered by Netlify"* sambil mengekalkan sekurang-kurangnya ~110px ruang terbuka di bawah butang Jeda/Audio di penjuru atas-kanan.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Menaikkan Kawalan Bawah-Kanan Sahaja Berbanding Menggerakkan Semua Kawalan Bawah**
  - *Chosen Approach*: Hanya gugusan butang tindakan bawah-kanan (sentuh) dan dok inventori bawah-kanan (komputer) dinaikkan melepasi zon lencana pengehosan, bersama pelarasan kecil pada bar inventori mod menegak. Kayu bedik bawah-kiri kekal di kedudukan asal.
  - *Why*: Lencana *"Powered by Netlify"* hanya berada di penjuru bawah-kanan. Mengekalkan kayu bedik di penjuru bawah-kiri memelihara ergonomi ibu jari kiri dan tidak menyempitkan pandangan peta di sebelah kiri.
  - *Alternatives Considered*: Menaikkan keseluruhan bar bawah secara seragam ditolak kerana ia akan menolak kayu bedik terlalu dekat dengan panel Nyawa/Stamina pada telefon berskrin pendek.

- **Decision 2: Pengawal Skrin Penuh Hibrid (Asli + WebKit + Mod Ruang Pandang Diperluas)**
  - *Chosen Approach*: Mengurus status skrin penuh di peringkat induk aplikasi dengan keutamaan API piawai → API WebKit (`webkitRequestFullscreen`) → Mod Ruang Pandang Diperluas berserta makluman Bahasa Melayu.
  - *Why*: Pelayar iPhone Safari tidak membenarkan elemen halaman web biasa memasuki skrin penuh sistem atas sebab keselamatan pelayar. Pendekatan hibrid memastikan butang tidak pernah gagal secara senyap dan tetap memaksimumkan ruang permainan yang boleh digunakan.
  - *Alternatives Considered*: Menyembunyikan atau melumpuhkan butang pada iOS ditolak kerana pemain menjangkakan butang tersebut boleh ditekan dan memberi maklum balas yang jelas.

- **Decision 3: Pengiraan Kelajuan Terus Berasaskan Nilai `70–130` Tanpa Lonjakan Melebihi Had**
  - *Chosen Approach*: Menetapkan kelajuan asas Baldi dalam julat integer tetap `[70, 130]` (`pengganda = kelajuan / 100`, daripada `0.70×` hingga maksimum `1.30×`) dan menormalkan faktor irama pembaris supaya fasa marah `7/7` meningkatkan ketangkasan laluan serta kesan visual tanpa melanggar had kelajuan **130**.
  - *Why*: Memastikan nilai yang dilihat pelajar pada HUD (`70` hingga `130`) sepadan secara jujur dan berkadar terus dengan halaju sebenar Baldi di atas peta, sambil mengekalkan peluang adil untuk pemain berlari pecut keluar dari sekolah.
  - *Alternatives Considered*: Mengekalkan lonjakan lama (`165+`) semasa buku nota ke-7 ditolak kerana bercanggah dengan syarat had maksimum mutlak **130**.

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

### Architecture & Component Diagram

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│                        Application Root & Viewport Shell                     │
│  ┌────────────────────────────────────┐  ┌────────────────────────────────┐  │
│  │     Fullscreen Controller          │  │    Input Platform Detector     │  │
│  │  • Standard + WebKit Fullscreen    │  │  • Touch vs Desktop Mode       │  │
│  │  • Expanded Viewport Fallback      │  │  • Live Media/Pointer Sync     │  │
│  │  • Phaser Scale.refresh() Trigger  │  └───────────────┬────────────────┘  │
│  └─────────────────┬──────────────────┘                  │                   │
└────────────────────┼─────────────────────────────────────┼───────────────────┘
                     │                                     │
         ┌───────────┴───────────┐             ┌───────────┴───────────┐
         ▼                       ▼             ▼                       ▼
┌─────────────────────┐ ┌─────────────────────────────┐ ┌──────────────────────┐
│    Settings Modal   │ │    HUD & Touch Overlays     │ │  Notebook Question   │
│  • Mod Skrin Penuh  │ │  • Top-Left Speed Readout   │ │       Modal          │
│    Toggle Button    │ │    (70 → 130, no % suffix)  │ │  • Immediate Answer  │
│  • Bahasa Melayu    │ │  • Raised Bottom-Right      │ │    Commit on Click   │
│    Status / Fallback│ │    Touch Cluster & Dock     │ │  • Instant +10 Speed │
│    Notice           │ │    (Netlify Clearance)      │ │    Feedback Banner   │
└─────────────────────┘ └──────────────┬──────────────┘ └──────────┬───────────┘
                                       │                           │
                                       ▼                           ▼
                        ┌──────────────────────────────────────────────────────┐
                        │                 Game State Manager                   │
                        │  • BALDI_START_SPEED = 70                            │
                        │  • BALDI_SPEED_STEP  = 10 (wrong answer only)        │
                        │  • BALDI_MAX_SPEED   = 130 (hard cap + 7/7 escape)   │
                        │  • Immediate wrong-answer penalty + single-commit    │
                        │    guard before modal close transition               │
                        └──────────────────────────┬───────────────────────────┘
                                                   │
                                                   ▼
                        ┌──────────────────────────────────────────────────────┐
                        │          Phaser 3 Top-Down Simulation Engine         │
                        │  • BaldiAI Velocity = BaseSpeed × (baldiSpeed / 100) │
                        │  • Bounded Slap Cadence (preserves 70–130 scaling)   │
                        │  • Scale.RESIZE Canvas synced on Fullscreen Toggle   │
                        └──────────────────────────────────────────────────────┘
```

### Data Model & State

- **Model Kelajuan Baldi**:
  - `BALDI_START_SPEED = 70`
  - `BALDI_WRONG_ANSWER_STEP = 10`
  - `BALDI_MAX_SPEED = 130`
  - Formula kelajuan aktif:
    - Semasa permainan biasa (`0` hingga `6` buku nota selesai): `min(130, 70 + jumlahJawapanSalah × 10)`
    - Semasa Fasa Melarikan Diri Terakhir (`7/7` buku nota selesai): `130`
    - Pengganda halaju fizik: `kelajuanBaldi / 100` (`0.70` hingga `1.30`)
- **Model Status Skrin Penuh**:
  - `mode`: `'off' | 'native' | 'expanded'`
  - `notice`: Mesej maklum balas Bahasa Melayu pilihan apabila mod ruang pandang diperluas diaktifkan pada pelayar yang menyekat skrin penuh asli, atau sekiranya kebenaran skrin penuh ditolak.

### Interactive Component & State Mapping

- **Penyerahan Jawapan Buku Nota Serta-Merta**:
  - Apabila pemain menekan pilihan jawapan `A / B / C / D` (atau kekunci `1–4`), semakan jawapan dan kemas kini kelajuan dalam pengurus keadaan dijalankan **serta-merta pada 0ms** supaya kelajuan Baldi (`+10` jika salah, dihadkan pada `130`), kiraan HUD, dan kesan bunyi berlaku tanpa lengah.
  - Paparan maklum balas ringkas pada kertas buku nota dipaparkan sebentar (~550ms) sebelum menutup tetingkap buku nota kembali ke koridor, dengan pengawal satu-serahan (*single-submission guard*) supaya kelajuan tidak sekali-kali bertambah dua kali.
- **Togol `Mod Skrin Penuh` & Penyelarasan Kanvas**:
  - Menekan butang **Mod Skrin Penuh** memanggil pengawal skrin penuh tak segerak; selepas pertukaran status atau peristiwa `fullscreenchange` / `webkitfullscreenchange` / `resize` ruang pandang visual, kanvas Phaser dipanggil untuk menyegarkan ukuran (`scale.refresh()`) pada bingkai semasa dan selepas susun atur stabil (~120ms) supaya kedudukan kamera dan kawalan sentuh kekal jitu.
- **Susun Atur Kelegaan Bawah-Kanan**:
  - Kelas utiliti ruang selamat bawah-kanan menggerakkan gugusan `LARI` / `INTERAKSI` / `LOMPAT` dan dok inventori komputer ke atas melepasi zon lencana 60px di penjuru bawah-kanan, manakala kedudukan bar inventori dan gesaan interaksi dalam mod menegak dilaraskan secara serentak supaya tiada pertindihan antara elemen HUD.
