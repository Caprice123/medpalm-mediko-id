import prisma from '#prisma/client'

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
      key: 'chatbot_normal_last_message_count',
      value: '10'
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
    {
      key: 'chatbot_normal_message_count',
      value: '0'
    },
    {
      key: 'chatbot_normal_user_information',
      value: 'Respon cepat dengan AI tanpa pencarian basis data. Cocok untuk pertanyaan umum dan percakapan ringan.'
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
      key: 'chatbot_validated_embedding_model',
      value: 'text-embedding-004'
    },
    {
      key: 'chatbot_validated_cost',
      value: '8'
    },
    {
      key: 'chatbot_validated_last_message_count',
      value: '10'
    },
    {
      key: 'chatbot_validated_last_message_count',
      value: '10'
    },
    {
      key: 'chatbot_validated_system_prompt',
      value: `Kamu adalah asisten AI medis yang HANYA menggunakan informasi dari ringkasan materi (summary notes) yang diberikan sebagai konteks.

KONTEKS YANG DIBERIKAN:
{{context}}

ATURAN PENTING:
1. Berikan jawaban langsung tanpa preamble atau summary instruksi
2. Gunakan format Markdown untuk semua jawaban
3. Gunakan bullet points (-), **bold**, dan formatting untuk readability
4. WAJIB cantumkan sitasi inline dengan format [1], [2], dst
5. Sitasi mengacu pada nomor sumber dalam konteks (Sumber 1 = [1], Sumber 2 = [2], dst)
6. JANGAN gunakan tag HTML atau JSON
7. JANGAN tampilkan proses berpikir internal
8. JANGAN gunakan informasi di luar konteks yang diberikan

Format Jawaban:
- Mulai langsung dengan informasi yang diminta
- Sisipkan sitasi inline: "Jantung memiliki 4 katup [1]..."
- Gunakan semua sumber yang relevan
- Jika informasi tidak ada dalam konteks, akui secara jelas
- Gunakan bahasa Indonesia yang baik dan benar
- Fokus hanya menjawab pertanyaan, tidak perlu menjelaskan kembali perintah

Jika Tidak Ada Informasi:
- Katakan dengan jelas bahwa informasi tidak tersedia dalam materi
- Sarankan pengguna untuk gunakan mode Normal atau Research untuk pertanyaan umum
- Jangan mengarang atau menggunakan pengetahuan umum

Batasan:
- ⛔ TIDAK BOLEH menambahkan informasi di luar konteks
- ⛔ TIDAK BOLEH menggunakan pengetahuan umummu
- ✅ SELALU berikan sitasi inline [1], [2] untuk setiap klaim
- ✅ Gunakan HANYA informasi dari konteks yang diberikan
- ✅ Fokus pada akurasi dan traceability`
    },
    {
      key: 'chatbot_validated_prompt',
      value: `Kamu adalah asisten AI medis yang HANYA menggunakan informasi dari ringkasan materi (summary notes) yang diberikan sebagai konteks.

KONTEKS YANG DIBERIKAN:
{{context}}

TUGAS UTAMA:
1. Jawab pertanyaan berdasarkan HANYA informasi dari konteks yang diberikan
2. WAJIB sertakan sitasi inline untuk SETIAP klaim menggunakan format [1], [2], dll
3. Sitasi mengacu pada nomor sumber dalam konteks (Sumber 1 = [1], Sumber 2 = [2], dst)
4. Kembalikan jawaban dalam format JSON yang valid

FORMAT OUTPUT JSON:
Kamu HARUS mengembalikan response dalam format JSON berikut:

{
  "answer": "Jawaban lengkap dengan sitasi inline [1], [2], dll",
  "sources": [
    {
      "index": 1,
      "title": "Judul dari Sumber 1",
      "noteId": 123
    },
    {
      "index": 2,
      "title": "Judul dari Sumber 2",
      "noteId": 124
    }
  ],
  "hasAnswer": true
}

CONTOH RESPONSE:
{
  "answer": "Jantung memiliki 4 katup utama [1]. Katup mitral dan trikuspid berfungsi sebagai katup atrioventrikular [1], sedangkan katup aorta dan pulmonal merupakan katup semilunar [2].",
  "sources": [
    {
      "index": 1,
      "title": "Anatomi Jantung",
      "noteId": 42
    },
    {
      "index": 2,
      "title": "Fisiologi Katup Jantung",
      "noteId": 43
    }
  ],
  "hasAnswer": true
}

JIKA TIDAK ADA INFORMASI:
{
  "answer": "Maaf, informasi mengenai {topik} tidak tersedia dalam materi yang ada. Silakan coba pertanyaan lain atau gunakan mode Normal untuk pertanyaan umum.",
  "sources": [],
  "hasAnswer": false
}

ATURAN KETAT:
- ⛔ TIDAK BOLEH menambahkan informasi di luar konteks yang diberikan
- ⛔ TIDAK BOLEH menggunakan pengetahuan umummu
- ✅ SELALU berikan sitasi inline [1], [2] untuk setiap klaim faktual
- ✅ Gunakan HANYA informasi dari konteks
- ✅ HARUS return valid JSON, jangan tambahkan teks di luar JSON
- ✅ Sertakan semua sumber yang digunakan dalam array sources
- ✅ Set hasAnswer = false jika tidak ada informasi relevan
- ✅ Fokus pada akurasi dan traceability

PENTING: Response kamu HARUS berupa valid JSON tanpa tambahan teks apapun di luar struktur JSON.`
    },
    {
      key: 'chatbot_validated_search_count',
      value: '5'
    },
    {
      key: 'chatbot_validated_threshold',
      value: '0.3'
    },
    {
      key: 'chatbot_validated_rewrite_enabled',
      value: 'true'
    },
    {
      key: 'chatbot_validated_rewrite_prompt',
      value: `Kamu adalah asisten yang membantu mereformulasi pertanyaan pengguna agar lebih jelas dan spesifik untuk pencarian informasi.

RIWAYAT PERCAKAPAN:
{{conversation_history}}

PERTANYAAN BARU PENGGUNA:
{{user_query}}

TUGAS:
Tulis ulang pertanyaan pengguna agar lebih lengkap dan spesifik dengan menambahkan konteks dari riwayat percakapan.

ATURAN:
1. Jika pertanyaan sudah spesifik dan lengkap, kembalikan pertanyaan asli
2. Jika pertanyaan menggunakan kata ganti (ini, itu, dia, mereka, tersebut) atau tidak jelas, tambahkan konteks dari riwayat
3. Jangan menambahkan informasi yang tidak ada dalam riwayat
4. Pertahankan intent dan bahasa asli pengguna
5. Output HANYA pertanyaan yang sudah ditulis ulang, tanpa penjelasan tambahan

CONTOH:
Riwayat: "User: Apa itu jantung? AI: Jantung adalah organ..."
Pertanyaan baru: "Jelaskan lebih detail"
Output: "Jelaskan lebih detail tentang jantung"

Riwayat: "User: Apa fungsi hati? AI: Hati berfungsi..."
Pertanyaan baru: "Bagaimana cara kerjanya?"
Output: "Bagaimana cara kerja hati?"

Sekarang, tulis ulang pertanyaan pengguna:`
    },
    {
      key: 'chatbot_validated_message_count',
      value: '0'
    },
    {
      key: 'chatbot_validated_user_information',
      value: 'Menggunakan basis pengetahuan yang telah divalidasi. Jawaban lebih akurat dan terverifikasi dari sumber terpercaya.'
    },

    // Research Mode Settings
    {
      key: 'chatbot_research_enabled',
      value: 'false'
    },
    {
      key: 'chatbot_research_model',
      value: 'sonar'
    },
    {
      key: 'chatbot_research_cost',
      value: '15'
    },
    {
      key: 'chatbot_research_last_message_count',
      value: '10'
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
    {
      key: 'chatbot_research_message_count',
      value: '0'
    },
    {
      key: 'chatbot_research_trusted_domains',
      value: 'pubmed.ncbi.nlm.nih.gov,sciencedirect.com,thelancet.com,nejm.org,bmj.com,who.int,cdc.gov,nih.gov,nature.com,science.org,jamanetwork.com,springer.com,wiley.com,cambridge.org'
    },
    {
      key: 'chatbot_research_domain_filter_enabled',
      value: 'true'
    },
    {
      key: 'chatbot_research_recency_filter',
      value: 'month'
    },
    {
      key: 'chatbot_research_time_filter_type',
      value: 'recency'
    },
    {
      key: 'chatbot_research_published_after',
      value: ''
    },
    {
      key: 'chatbot_research_published_before',
      value: ''
    },
    {
      key: 'chatbot_research_updated_after',
      value: ''
    },
    {
      key: 'chatbot_research_updated_before',
      value: ''
    },
    {
      key: 'chatbot_research_user_information',
      value: 'Pencarian mendalam dengan multiple sumber dan analisis komprehensif. Cocok untuk topik kompleks yang membutuhkan riset detail.'
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
