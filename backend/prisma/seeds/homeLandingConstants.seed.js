import prisma from '#prisma/client'

// Copy for the landing page sections that are editable under Pengaturan
// Global (Figma frame 1:2).
//
// Events and challenges are deliberately absent: the landing page reads
// those live from the webinar and challenge listings, so there is nothing
// to seed and nothing for an admin to retype.
//
// Kept separate from globalConstants.seed.js on purpose: that seed overwrites
// `value` on every run, which would wipe admin edits. Here the upsert leaves an
// existing row untouched, so re-running only fills in keys that are missing.
export async function seedHomeLandingConstants() {
  console.log('Seeding landing page constants...')

  const constants = [
    // "Kenapa MedPal.id?" section. The 01/02/… markers are derived from
    // position, so reordering or shortening this list cannot skip a number.
    { key: 'home_why_heading', value: 'Kenapa MedPal.id?' },
    {
      key: 'home_why_subtitle',
      value: 'Satu platform untuk mendukung perjalanan belajarmu di kedokteran.',
    },
    {
      key: 'home_why_cards',
      value: JSON.stringify([
        { title: 'Materi yang Terarah', description: 'Materi tersusun sistematis sesuai kurikulum' },
        { title: 'Anatomi 3D Interaktif', description: 'Pelajari struktur tubuh dari berbagai sudut' },
        { title: 'Latihan Terukur', description: 'Quiz dan flashcard dengan pembahasan lengkap' },
        { title: 'Progres Terpantau', description: 'Lacak perkembangan belajarmu setiap hari' },
      ]),
    },

    // Feature section.
    //
    // The tab row itself is NOT configured here: it is built from the feature
    // constants that "Kelola Fitur" already owns, so each tab's label, panel
    // title, panel description and demo video follow whatever an admin sets
    // there, and switching a feature off drops its tab. Only the two things no
    // feature constant carries live in this seed — the section heading and the
    // bullet points under each panel.
    { key: 'home_feature_heading', value: 'Semua yang kamu butuhkan' },
    { key: 'home_feature_heading_accent', value: 'untuk belajar kedokteran.' },
    {
      key: 'home_feature_subtitle',
      value:
        'Mulai dari memahami materi hingga menguji pemahaman, MedPal menyediakan ' +
        'berbagai fitur yang bisa digunakan sesuai kebutuhan belajarmu.',
    },

    // Keyed by the feature's `sessionType`, which is what the features endpoint
    // returns for every tab. A feature with no entry here still renders — its
    // panel just shows the title, description and video with no bullet list.
    {
      key: 'home_feature_points',
      value: JSON.stringify([
        {
          sessionType: 'summary_notes',
          points: [
            'Tersusun per sistem dan blok perkuliahan.',
            'Ringkas, terstruktur, dan mudah diikuti.',
            'Dilengkapi rangkuman high-yield.',
            'Terhubung ke flashcard dan kuis terkait.',
          ],
        },
        {
          sessionType: 'anatomy',
          points: [
            'Soal anatomi berbasis gambar.',
            'Tandai struktur langsung pada gambarnya.',
            'Melatih hafalan struktur tubuh manusia.',
            'Pembahasan tersedia untuk tiap struktur.',
          ],
        },
        {
          sessionType: 'atlas',
          points: [
            'Putar dan amati model dari berbagai sudut.',
            'Pelajari struktur anatomi secara lebih visual.',
            'Gunakan sebagai pendamping materi dan latihan.',
            'Akses pembelajaran anatomi dalam satu platform.',
          ],
        },
        {
          sessionType: 'chatbot',
          points: [
            'Jawaban mengacu pada sumber terkurasi.',
            'Bisa menindaklanjuti dengan pertanyaan susulan.',
            'Membantu memahami konsep yang sulit.',
            'Tersedia kapan pun dibutuhkan.',
          ],
        },
        {
          sessionType: 'osce_practice',
          points: [
            'Skenario klinis yang beragam.',
            'Latih anamnesis dan pemeriksaan fisik.',
            'Umpan balik berdasarkan rubrik penilaian.',
            'Bisa diulang sampai terbiasa.',
          ],
        },
        {
          sessionType: 'skripsi_builder',
          points: [
            'Susun laporan BBDM, SGD, dan SOOCA.',
            'Penulisan dipandu tahap demi tahap.',
            'Referensi medis ikut disarankan.',
            'Hasilnya bisa diekspor untuk dikumpulkan.',
          ],
        },
        {
          sessionType: 'mcq',
          points: [
            'Koleksi soal lintas sistem dan topik.',
            'Tersedia mode belajar dan simulasi ujian.',
            'Dilengkapi pembahasan tiap soal.',
            'Statistik pengerjaan ikut terpantau.',
          ],
        },
        {
          sessionType: 'diagnostic',
          points: [
            'Latihan interpretasi EKG, radiologi, dan laboratorium.',
            'Mencakup gambaran normal maupun patologis.',
            'Pembahasan tersedia untuk setiap soal.',
            'Bisa difilter sesuai kebutuhan belajar.',
          ],
        },
        {
          sessionType: 'flashcard',
          points: [
            'Pengulangan dijadwalkan otomatis.',
            'Tersedia tipe basic, cloze, dan occlusion.',
            'Fokus pada kartu yang belum dikuasai.',
            'Bisa dipelajari dalam sesi singkat.',
          ],
        },
        {
          sessionType: 'exercise',
          points: [
            'Soal berformat fill-in-the-blank.',
            'Melatih ingatan tanpa pilihan jawaban.',
            'Dikelompokkan per topik.',
            'Cocok untuk mengulang materi hafalan.',
          ],
        },
        {
          sessionType: 'calculator',
          points: [
            'Kumpulan kalkulator klinis siap pakai.',
            'Rumus dan satuan sudah disiapkan.',
            'Hasil hitung muncul seketika.',
            'Bisa dipakai saat belajar maupun praktik.',
          ],
        },
      ]),
    },

    // Testimonial section.
    {
      key: 'home_testimonial_items',
      value: JSON.stringify([
        {
          quote: 'Testimoni pengguna akan ditempatkan di sini oleh tim MedPal.',
          name: 'Nama Pengguna',
          detail: 'Mahasiswa Kedokteran',
          rating: 5,
        },
        {
          quote: 'Testimoni pengguna akan ditempatkan di sini oleh tim MedPal.',
          name: 'Nama Pengguna',
          detail: 'Mahasiswa Kedokteran',
          rating: 5,
        },
        {
          quote: 'Testimoni pengguna akan ditempatkan di sini oleh tim MedPal.',
          name: 'Nama Pengguna',
          detail: 'Mahasiswa Kedokteran',
          rating: 5,
        },
      ]),
    },
  ]

  for (const constant of constants) {
    await prisma.constants.upsert({
      where: { key: constant.key },
      // Intentionally empty: never clobber a value an admin has already set.
      update: {},
      create: constant,
    })
    console.log(`✓ Seeded constant: ${constant.key}`)
  }

  console.log('Landing page constants seeding completed!')
}

// Run if called directly
seedHomeLandingConstants()
  .then(async () => {
    console.log('Done!')
    await prisma.$disconnect()
    process.exit(0)
  })
  .catch(async (error) => {
    console.error('Error seeding landing page constants:', error)
    await prisma.$disconnect()
    process.exit(1)
  })
