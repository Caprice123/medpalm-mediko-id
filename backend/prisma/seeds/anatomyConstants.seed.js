import prisma from '#prisma/client'

export async function seedAnatomyConstants() {
  console.log('Seeding anatomy constants...')

  const constants = [
    {
      key: 'anatomy_feature_title',
      value: 'Quiz Anatomi Interaktif'
    },
    {
      key: 'anatomy_feature_description',
      value: 'Quiz anatomi berbasis gambar untuk membantu mahasiswa kedokteran memahami dan menghafal struktur anatomi tubuh manusia'
    },
    {
      key: 'anatomy_generation_model',
      value: 'gemini-2.0-flash'
    },
    {
      key: 'anatomy_generation_prompt',
      value: `Kamu adalah seorang dosen anatomi medis yang ahli dalam membuat soal berdasarkan gambar anatomi.

Tugas: Analisis gambar anatomi yang diberikan, lalu buatlah {{questionCount}} soal berkualitas tinggi berdasarkan struktur yang terlihat dalam gambar.

Format Output (JSON):
[
  {
    "question": "Pertanyaan yang mengarah pada struktur spesifik dalam gambar",
    "answer": "Nama struktur/organ yang benar",
    "explanation": "Penjelasan lengkap tentang struktur tersebut, fungsinya, dan mengapa ini jawaban yang benar"
  }
]

Aturan:
1. Identifikasi semua struktur anatomi yang jelas terlihat dalam gambar
2. Buat pertanyaan yang SPESIFIK dan mengacu pada lokasi/posisi dalam gambar
3. Contoh pertanyaan bagus: "Struktur berbentuk kerucut di bagian tengah gambar adalah?", "Organ yang ditunjukkan oleh panah di sebelah kiri adalah?"
4. Jawaban harus NAMA STRUKTUR yang SPESIFIK dan BENAR secara medis
5. Jawaban maksimal 3-4 kata (nama struktur/organ)
6. Penjelasan harus mencakup:
   - Identifikasi struktur
   - Lokasi anatomis
   - Fungsi utama
   - Ciri khas yang terlihat dalam gambar
7. Gunakan bahasa Indonesia yang formal dan medis
8. Pastikan pertanyaan bervariasi (jangan hanya menanyakan nama, tapi juga fungsi, lokasi relatif, dll)
9. Output harus berupa valid JSON array
10. Fokus pada struktur yang JELAS TERLIHAT dan dapat DIIDENTIFIKASI dari gambar

Hasilkan HANYA JSON array tanpa teks tambahan apapun.`
    },
    {
      key: 'anatomy_access_type',
      value: 'subscription'
    },
    {
      key: 'anatomy_credit_cost',
      value: '0'
    },
    {
      key: 'anatomy_is_active',
      value: 'true'
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

  console.log('Anatomy constants seeding completed!')
}

// Run if called directly
seedAnatomyConstants()
  .then(async () => {
    console.log('Done!')
    await prisma.$disconnect()
    process.exit(0)
  })
  .catch(async (error) => {
    console.error('Error seeding anatomy constants:', error)
    await prisma.$disconnect()
    process.exit(1)
  })
