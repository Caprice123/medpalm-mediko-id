// Fallback bullet copy for the feature panels, keyed by the `sessionType` the
// features endpoint returns.
//
// The live copy is the `home_feature_points` constant, editable under
// Pengaturan Global. This module is what the section falls back to when that
// constant is missing or unparseable — a database that has not had
// homeLandingConstants.seed.js run against it yet, or a feature an admin has
// not written bullets for. Without it a fresh environment would render every
// panel with no points at all.
export const FALLBACK_FEATURE_POINTS = {
  summary_notes: [
    'Tersusun per sistem dan blok perkuliahan.',
    'Ringkas, terstruktur, dan mudah diikuti.',
    'Dilengkapi rangkuman high-yield.',
    'Terhubung ke flashcard dan kuis terkait.',
  ],
  anatomy: [
    'Soal anatomi berbasis gambar.',
    'Tandai struktur langsung pada gambarnya.',
    'Melatih hafalan struktur tubuh manusia.',
    'Pembahasan tersedia untuk tiap struktur.',
  ],
  atlas: [
    'Putar dan amati model dari berbagai sudut.',
    'Pelajari struktur anatomi secara lebih visual.',
    'Gunakan sebagai pendamping materi dan latihan.',
    'Akses pembelajaran anatomi dalam satu platform.',
  ],
  chatbot: [
    'Jawaban mengacu pada sumber terkurasi.',
    'Bisa menindaklanjuti dengan pertanyaan susulan.',
    'Membantu memahami konsep yang sulit.',
    'Tersedia kapan pun dibutuhkan.',
  ],
  osce_practice: [
    'Skenario klinis yang beragam.',
    'Latih anamnesis dan pemeriksaan fisik.',
    'Umpan balik berdasarkan rubrik penilaian.',
    'Bisa diulang sampai terbiasa.',
  ],
  skripsi_builder: [
    'Susun laporan BBDM, SGD, dan SOOCA.',
    'Penulisan dipandu tahap demi tahap.',
    'Referensi medis ikut disarankan.',
    'Hasilnya bisa diekspor untuk dikumpulkan.',
  ],
  mcq: [
    'Koleksi soal lintas sistem dan topik.',
    'Tersedia mode belajar dan simulasi ujian.',
    'Dilengkapi pembahasan tiap soal.',
    'Statistik pengerjaan ikut terpantau.',
  ],
  diagnostic: [
    'Latihan interpretasi EKG, radiologi, dan laboratorium.',
    'Mencakup gambaran normal maupun patologis.',
    'Pembahasan tersedia untuk setiap soal.',
    'Bisa difilter sesuai kebutuhan belajar.',
  ],
  flashcard: [
    'Pengulangan dijadwalkan otomatis.',
    'Tersedia tipe basic, cloze, dan occlusion.',
    'Fokus pada kartu yang belum dikuasai.',
    'Bisa dipelajari dalam sesi singkat.',
  ],
  exercise: [
    'Soal berformat fill-in-the-blank.',
    'Melatih ingatan tanpa pilihan jawaban.',
    'Dikelompokkan per topik.',
    'Cocok untuk mengulang materi hafalan.',
  ],
  calculator: [
    'Kumpulan kalkulator klinis siap pakai.',
    'Rumus dan satuan sudah disiapkan.',
    'Hasil hitung muncul seketika.',
    'Bisa dipakai saat belajar maupun praktik.',
  ],
}

// `home_feature_points` is stored as [{ sessionType, points: [...] }] — an
// array rather than an object because that is the shape the admin form's
// add/remove item list produces.
//
// An entry an admin has saved wins over the fallback even when its points are
// empty: clearing the textarea is how you deliberately drop the bullet list
// from one panel.
export function resolveFeaturePoints(constantValue) {
  if (!constantValue) return FALLBACK_FEATURE_POINTS

  let parsed
  try {
    parsed = JSON.parse(constantValue)
  } catch {
    return FALLBACK_FEATURE_POINTS
  }
  if (!Array.isArray(parsed)) return FALLBACK_FEATURE_POINTS

  const configured = {}
  parsed.forEach((entry) => {
    if (!entry?.sessionType) return
    configured[entry.sessionType] = Array.isArray(entry.points)
      ? entry.points.filter((point) => typeof point === 'string' && point.trim() !== '')
      : []
  })

  return { ...FALLBACK_FEATURE_POINTS, ...configured }
}
