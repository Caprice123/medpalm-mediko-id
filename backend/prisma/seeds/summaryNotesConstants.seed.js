import prisma from '../client.js'

export async function seedSummaryNotesConstants() {
  console.log('Seeding summary notes constants...')

  const constants = [
    {
      key: 'summary_notes_feature_title',
      value: 'Ringkasan Materi'
    },
    {
      key: 'summary_notes_feature_description',
      value: 'Akses ringkasan materi kedokteran yang disusun dengan format yang mudah dipahami untuk membantu belajar lebih efektif'
    },
    {
      key: 'summary_notes_credit_cost',
      value: '5'
    },
    {
      key: 'summary_notes_session_type',
      value: 'summary_notes'
    },
    {
      key: 'summary_notes_generation_model',
      value: 'gemini-2.5-flash'
    },
    {
      key: 'summary_notes_generation_prompt',
      value: `Kamu adalah seorang dosen medis ahli yang bertugas membuat ringkasan materi untuk mahasiswa kedokteran.

Tugas: Buatlah ringkasan materi yang komprehensif dan mudah dipahami dari dokumen berikut.

Format Output (Markdown):
- Gunakan heading (##, ###) untuk struktur yang jelas
- Gunakan bullet points untuk poin-poin penting
- Gunakan **bold** untuk istilah medis penting
- Gunakan tabel jika ada perbandingan atau klasifikasi
- Tambahkan catatan klinis yang relevan

Aturan:
1. Ringkas informasi penting tanpa menghilangkan detail esensial
2. Gunakan bahasa Indonesia yang formal dan medis
3. Strukturkan dengan hierarki yang logis
4. Fokus pada konsep yang akan diujikan
5. Sertakan definisi untuk istilah-istilah kunci
6. Buat ringkasan yang mudah untuk di-review sebelum ujian

Hasilkan ringkasan dalam format Markdown yang siap ditampilkan.`
    }
  ]

  for (const constant of constants) {
    await prisma.constants.upsert({
      where: { key: constant.key },
      update: { value: constant.value },
      create: constant
    })
    console.log(`✓ Seeded constant: ${constant.key}`)
  }

  console.log('Summary notes constants seeding completed!')
}

// Run if called directly
seedSummaryNotesConstants()
  .then(async () => {
    console.log('Done!')
    await prisma.$disconnect()
    process.exit(0)
  })
  .catch(async (error) => {
    console.error('Error seeding summary notes constants:', error)
    await prisma.$disconnect()
    process.exit(1)
  })
