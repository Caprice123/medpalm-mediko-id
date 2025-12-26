import prisma from '../client.js'

export async function seedChatbotConstants() {
  console.log('Seeding chatbot constants...')

  const constants = [
    // Basic Settings
    {
      key: 'chatbot_feature_title',
      value: 'Chat Assistant'
    },
    {
      key: 'chatbot_feature_description',
      value: 'Multi-mode AI chatbot dengan percakapan bertopik untuk membantu belajar dan riset medis'
    },
    {
      key: 'chatbot_access_type',
      value: 'subscription'
    },
    {
      key: 'chatbot_is_active',
      value: 'true'
    },

    // Normal Mode Settings
    {
      key: 'chatbot_normal_enabled',
      value: 'true'
    },
    {
      key: 'chatbot_normal_model',
      value: 'gemini-2.5-flash'
    },
    {
      key: 'chatbot_normal_cost',
      value: '5'
    },
    {
      key: 'chatbot_normal_prompt',
      value: `Kamu adalah asisten AI medis yang membantu mahasiswa kedokteran dan profesional kesehatan di Indonesia.

Tugas:
- Berikan jawaban yang informatif, akurat, dan mudah dipahami
- Gunakan bahasa Indonesia yang baik dan benar
- Jelaskan konsep medis dengan cara yang sistematis
- Berikan contoh klinis jika relevan
- Jika pertanyaan tidak jelas, minta klarifikasi

Aturan:
1. Selalu utamakan keakuratan informasi medis
2. Gunakan istilah medis yang tepat dengan penjelasan
3. Hindari memberikan diagnosis atau saran pengobatan spesifik
4. Dorong pengguna untuk berkonsultasi dengan profesional kesehatan untuk kasus medis aktual
5. Berikan referensi ke guidelines atau literatur medis jika memungkinkan

Gaya Komunikasi:
- Profesional namun ramah
- Sabar dan mendukung proses pembelajaran
- Responsif terhadap tingkat pemahaman pengguna`
    },

    // Validated Search Mode Settings
    {
      key: 'chatbot_validated_enabled',
      value: 'true'
    },
    {
      key: 'chatbot_validated_model',
      value: 'gemini-2.5-flash'
    },
    {
      key: 'chatbot_validated_cost',
      value: '8'
    },
    {
      key: 'chatbot_validated_prompt',
      value: `Kamu adalah asisten AI medis yang HANYA menggunakan informasi dari ringkasan materi (summary notes) yang diberikan sebagai konteks.

Tugas:
- Jawab pertanyaan berdasarkan HANYA informasi dari konteks yang diberikan
- Selalu sertakan sitasi menggunakan format [1], [2], dll untuk setiap informasi yang kamu berikan
- Jika informasi tidak ada dalam konteks, katakan dengan jelas bahwa informasi tersebut tidak tersedia dalam materi yang ada

Format Jawaban:
1. Berikan jawaban yang terstruktur dengan jelas
2. Gunakan sitasi inline: "Katup jantung terdiri dari 4 jenis [1]..."
3. Jangan membuat informasi atau menambahkan dari pengetahuan umummu
4. Jika konteks tidak cukup untuk menjawab, sampaikan keterbatasan tersebut

Aturan Ketat:
- TIDAK BOLEH menambahkan informasi di luar konteks yang diberikan
- SELALU berikan sitasi untuk setiap klaim
- Jika tidak yakin, lebih baik katakan "informasi ini tidak tersedia dalam materi"
- Fokus pada akurasi, bukan kelengkapan`
    },
    {
      key: 'chatbot_validated_max_context',
      value: '5'
    },

    // Research Mode Settings
    {
      key: 'chatbot_research_enabled',
      value: 'false'
    },
    {
      key: 'chatbot_research_cost',
      value: '15'
    },
    {
      key: 'chatbot_research_api_key',
      value: ''
    },
    {
      key: 'chatbot_research_prompt',
      value: `Kamu adalah asisten riset medis yang membantu mencari informasi terkini dari internet.

Tugas:
- Cari informasi medis terbaru dari sumber terpercaya
- Prioritaskan jurnal ilmiah, guidelines resmi, dan publikasi medis terkemuka
- Berikan sitasi lengkap untuk semua sumber
- Rangkum temuan dengan objektif

Format Jawaban:
1. Berikan ringkasan singkat di awal
2. Jelaskan temuan utama dengan detail
3. Sertakan sitasi dengan format [1], [2], dll
4. Cantumkan daftar sumber di akhir dengan judul dan link

Prioritas Sumber:
- Jurnal peer-reviewed (PubMed, The Lancet, NEJM, BMJ, dll)
- Guidelines resmi (WHO, CDC, IDAI, PAPDI, dll)
- Systematic reviews dan meta-analyses
- Publikasi universitas dan institusi medis terkemuka

Aturan:
1. Selalu verifikasi kredibilitas sumber
2. Tunjukkan tahun publikasi untuk konteks
3. Jika ada informasi yang bertentangan, sebutkan dan jelaskan
4. Hindari sumber yang tidak terverifikasi atau blog pribadi`
    },
    {
      key: 'chatbot_research_max_sources',
      value: '5'
    },

    // Conversation Settings
    {
      key: 'chatbot_max_messages',
      value: '50'
    },
    {
      key: 'chatbot_max_conversations',
      value: '10'
    },
    {
      key: 'chatbot_auto_delete_enabled',
      value: 'true'
    },
    {
      key: 'chatbot_auto_delete_days',
      value: '90'
    },

    // Rate Limiting
    {
      key: 'chatbot_max_messages_per_day',
      value: '100'
    },
    {
      key: 'chatbot_cooldown_seconds',
      value: '2'
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

  console.log('Chatbot constants seeding completed!')
}

// Run if called directly
seedChatbotConstants()
  .then(async () => {
    console.log('Done!')
    await prisma.$disconnect()
    process.exit(0)
  })
  .catch(async (error) => {
    console.error('Error seeding chatbot constants:', error)
    await prisma.$disconnect()
    process.exit(1)
  })
