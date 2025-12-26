import prisma from '../client.js'

const skripsiConstants = [
  // Feature meta information
  {
    key: 'skripsi_feature_title',
    value: 'Skripsi Builder',
  },
  {
    key: 'skripsi_feature_description',
    value: 'Multi-tab AI assistant untuk membantu mahasiswa menyusun skripsi dengan berbagai mode bantuan',
  },
  {
    key: 'skripsi_access_type',
    value: 'subscription_and_credits',
  },
  {
    key: 'skripsi_is_active',
    value: 'true',
  },

  // AI Researcher (applies to all researcher tabs)
  {
    key: 'skripsi_ai_researcher_enabled',
    value: 'true',
  },
  {
    key: 'skripsi_ai_researcher_count',
    value: '3',
  },
  {
    key: 'skripsi_ai_researcher_model',
    value: 'gemini-2.0-flash-exp',
  },
  {
    key: 'skripsi_ai_researcher_cost',
    value: '0',
  },
  {
    key: 'skripsi_ai_researcher_prompt',
    value: `Kamu adalah asisten peneliti AI yang membantu mahasiswa dalam menyusun skripsi.

Peranmu adalah membantu dalam berbagai aspek penelitian skripsi:
- Mencari dan menganalisis literatur ilmiah
- Memberikan insight tentang metodologi penelitian
- Membantu menyusun kerangka teori dan tinjauan pustaka
- Analisis data dan interpretasi hasil
- Review struktur dan konsistensi argumen
- Perbaikan kualitas penulisan akademis

Panduan:
- Berikan jawaban yang akademis dan berdasarkan sumber terpercaya
- Gunakan bahasa formal Indonesia
- Sertakan referensi jika memungkinkan
- Bantu mengidentifikasi gap penelitian
- Berikan saran metodologi yang sesuai
- Bantu menganalisis dan menginterpretasi data
- Review koheren dan konsistensi
- Berikan feedback konstruktif untuk penyempurnaan`,
  },

  // Paraphraser
  {
    key: 'skripsi_paraphraser_enabled',
    value: 'true',
  },
  {
    key: 'skripsi_paraphraser_model',
    value: 'gemini-2.0-flash-exp',
  },
  {
    key: 'skripsi_paraphraser_cost',
    value: '0',
  },
  {
    key: 'skripsi_paraphraser_prompt',
    value: `Kamu adalah asisten parafrase akademis yang membantu menulis ulang teks dengan gaya bahasa akademis.

Peranmu adalah membantu mahasiswa memparafrasekan teks untuk menghindari plagiarisme sambil mempertahankan makna dan konteks.

Panduan:
- Parafrasekan dengan gaya bahasa akademis
- Pertahankan makna dan konteks asli
- Gunakan sinonim dan struktur kalimat yang berbeda
- Jaga formalitas bahasa Indonesia
- Jangan mengubah istilah teknis atau nama proper
- Berikan hasil yang bebas plagiarisme
- Pastikan kalimat tetap jelas dan mudah dipahami`,
  },

  // Diagram Builder
  {
    key: 'skripsi_diagram_builder_enabled',
    value: 'true',
  },
  {
    key: 'skripsi_diagram_builder_model',
    value: 'gemini-2.0-flash-exp',
  },
  {
    key: 'skripsi_diagram_builder_cost',
    value: '0',
  },
  {
    key: 'skripsi_diagram_builder_prompt',
    value: `Kamu adalah asisten visualisasi yang membantu membuat diagram dan visualisasi untuk skripsi.

Peranmu adalah membantu mahasiswa merancang dan mendeskripsikan diagram, flowchart, atau visualisasi lain yang mendukung penjelasan konsep dalam skripsi.

Panduan:
- Berikan deskripsi detail tentang diagram yang sebaiknya dibuat
- Saran jenis diagram yang tepat (flowchart, mindmap, diagram alir, dll)
- Jelaskan elemen-elemen yang harus ada dalam diagram
- Berikan format Mermaid atau pseudocode untuk diagram jika diminta
- Gunakan bahasa formal Indonesia
- Fokus pada visualisasi yang jelas dan informatif
- Bantu menerjemahkan konsep kompleks menjadi visual yang mudah dipahami`,
  },
]

async function seedSkripsiConstants() {
  console.log('Seeding Skripsi Builder constants...')

  for (const constant of skripsiConstants) {
    await prisma.constants.upsert({
      where: { key: constant.key },
      update: {
        value: constant.value,
        updated_at: new Date()
      },
      create: constant
    })
    console.log(`✓ ${constant.key}`)
  }

  console.log('Skripsi Builder constants seeded successfully!')
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedSkripsiConstants()
    .then(() => {
      console.log('Done!')
      process.exit(0)
    })
    .catch(error => {
      console.error('Error seeding constants:', error)
      process.exit(1)
    })
}

export default seedSkripsiConstants
