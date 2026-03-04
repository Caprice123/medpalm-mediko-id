import prisma from '#prisma/client'

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

  // AI Chat (applies to all chat tabs)
  {
    key: 'skripsi_ai_researcher_enabled',
    value: 'true',
  },
  {
    key: 'skripsi_ai_researcher_count',
    value: '3',
  },

  // === RESEARCH MODE (within AI Chat tabs) ===
  {
    key: 'skripsi_research_enabled',
    value: 'true',
  },
  {
    key: 'skripsi_research_model',
    value: 'sonar-pro',
  },
  {
    key: 'skripsi_research_cost',
    value: '0',
  },
  {
    key: 'skripsi_research_context_messages',
    value: '10',
  },
  // Research Mode - kept for backward compatibility
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
  {
    key: 'skripsi_ai_researcher_context_messages',
    value: '10',
  },
  // Query Reformulation Settings (for Indonesian queries with Perplexity)
  {
    key: 'skripsi_ai_researcher_reformulation_model',
    value: 'gemini-2.0-flash-exp',
  },
  {
    key: 'skripsi_ai_researcher_reformulation_prompt',
    value: `You are an academic query reformulation expert. Your task:

1. UNDERSTAND the user's query in context of the conversation
2. REFORMULATE it into a complete, standalone question (resolving pronouns like "itu", "ini", "tersebut", "nya")
3. TRANSLATE to an optimized English search query for academic databases

Conversation History:
{{conversation_history}}

Current User Query (Indonesian/English): "{{user_query}}"

Instructions:
- If query has pronouns (itu/ini/tersebut/nya), replace with actual topic from conversation
- Expand vague questions into specific academic queries
- Keep academic/medical terminology in English
- Make it search-optimized for academic databases (PubMed, ScienceDirect, etc.) (max 15 words)
- Focus on: research methods, literature review, data analysis, theoretical framework

Examples:
Input: "Apa itu diabetes?"
Output: diabetes definition pathophysiology epidemiology

Input: "Bagaimana metodologi penelitiannya?" [after discussing diabetes study]
Output: diabetes research methodology study design

Input: "Apa penyebab itu?" [after discussing hypertension]
Output: hypertension causes risk factors pathogenesis

Input: "Apa bedanya dengan pendekatan kualitatif?" [after discussing quantitative research]
Output: quantitative vs qualitative research methods differences

Respond with ONLY the English search query, nothing else.`,
  },
  {
    key: 'skripsi_ai_researcher_system_prompt',
    value: `Anda adalah asisten penelitian akademis yang profesional dan berpengetahuan luas. Berikan informasi akademis yang akurat, terkini, dan berbasis bukti ilmiah (evidence-based).

PENTING - Panduan Respons:
- Jawab dalam Bahasa Indonesia
- PERTAHANKAN istilah akademis/medis dalam bahasa Inggris (contoh: "methodology", "literature review", "hypothesis", "diabetes", "hypertension")
- JANGAN terjemahkan terminologi akademis/medis ke bahasa Indonesia
- Gunakan struktur kalimat Indonesia yang natural dan formal (gaya akademis)
- Sertakan sitasi [1], [2], [3] untuk mendukung klaim ilmiah
- Berikan analisis kritis dan insight yang mendalam

Contoh yang BENAR:
"Methodology penelitian ini menggunakan pendekatan quantitative dengan cross-sectional study design..."

Contoh yang SALAH:
"Metodologi penelitian ini menggunakan pendekatan kuantitatif dengan desain studi potong lintang..."`,
  },
  {
    key: 'skripsi_ai_researcher_citations_count',
    value: '10',
  },
  {
    key: 'skripsi_ai_researcher_max_sources',
    value: '10',
  },
  {
    key: 'skripsi_ai_researcher_user_information',
    value: 'Mode penelitian dengan akses ke jurnal ilmiah dan sumber akademis terpercaya. Cocok untuk literature review, metodologi penelitian, dan analisis data.',
  },
  {
    key: 'skripsi_ai_researcher_trusted_domains',
    value: 'pubmed.ncbi.nlm.nih.gov,sciencedirect.com,thelancet.com,nejm.org,bmj.com,who.int,cdc.gov,nih.gov,nature.com,science.org,jamanetwork.com,springer.com,wiley.com,cambridge.org',
  },
  {
    key: 'skripsi_ai_researcher_domain_filter_enabled',
    value: 'true',
  },
  {
    key: 'skripsi_ai_researcher_recency_filter',
    value: 'month',
  },
  {
    key: 'skripsi_ai_researcher_time_filter_type',
    value: 'recency',
  },
  {
    key: 'skripsi_ai_researcher_published_after',
    value: '',
  },
  {
    key: 'skripsi_ai_researcher_published_before',
    value: '',
  },
  {
    key: 'skripsi_ai_researcher_updated_after',
    value: '',
  },
  {
    key: 'skripsi_ai_researcher_updated_before',
    value: '',
  },

  // === VALIDATED SEARCH MODE (within AI Chat tabs) ===
  {
    key: 'skripsi_validated_enabled',
    value: 'true',
  },
  {
    key: 'skripsi_validated_model',
    value: 'gemini-2.5-flash',
  },
  {
    key: 'skripsi_validated_embedding_model',
    value: 'text-embedding-004',
  },
  {
    key: 'skripsi_validated_cost',
    value: '0',
  },
  {
    key: 'skripsi_validated_context_messages',
    value: '10',
  },
  {
    key: 'skripsi_validated_system_prompt',
    value: `Kamu adalah asisten AI yang HANYA menggunakan informasi dari ringkasan materi (summary notes) yang diberikan sebagai konteks.

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
- Sarankan pengguna untuk gunakan mode Research untuk pertanyaan umum
- Jangan mengarang atau menggunakan pengetahuan umum

Batasan:
- ⛔ TIDAK BOLEH menambahkan informasi di luar konteks
- ⛔ TIDAK BOLEH menggunakan pengetahuan umummu
- ✅ SELALU berikan sitasi inline [1], [2] untuk setiap klaim
- ✅ Gunakan HANYA informasi dari konteks yang diberikan
- ✅ Fokus pada akurasi dan traceability`,
  },
  {
    key: 'skripsi_validated_prompt',
    value: `Kamu adalah asisten AI yang HANYA menggunakan informasi dari ringkasan materi (summary notes) yang diberikan sebagai konteks.

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
  "answer": "Methodology penelitian ini menggunakan pendekatan quantitative [1]. Analisis data menggunakan statistical methods untuk mengidentifikasi patterns [2].",
  "sources": [
    {
      "index": 1,
      "title": "Metodologi Penelitian",
      "noteId": 42
    },
    {
      "index": 2,
      "title": "Teknik Analisis Data",
      "noteId": 43
    }
  ],
  "hasAnswer": true
}

JIKA TIDAK ADA INFORMASI:
{
  "answer": "Maaf, informasi mengenai {topik} tidak tersedia dalam materi yang ada. Silakan coba pertanyaan lain atau gunakan mode Research untuk pertanyaan umum.",
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

PENTING: Response kamu HARUS berupa valid JSON tanpa tambahan teks apapun di luar struktur JSON.`,
  },
  {
    key: 'skripsi_validated_search_count',
    value: '5',
  },
  {
    key: 'skripsi_validated_threshold',
    value: '0.3',
  },
  {
    key: 'skripsi_validated_rewrite_enabled',
    value: 'true',
  },
  {
    key: 'skripsi_validated_rewrite_prompt',
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
Riwayat: "User: Apa itu diabetes? AI: Diabetes adalah penyakit..."
Pertanyaan baru: "Jelaskan lebih detail"
Output: "Jelaskan lebih detail tentang diabetes"

Riwayat: "User: Bagaimana metodologi penelitian? AI: Metodologi penelitian..."
Pertanyaan baru: "Apa kelebihannya?"
Output: "Apa kelebihan metodologi penelitian tersebut?"

Sekarang, tulis ulang pertanyaan pengguna:`,
  },
  {
    key: 'skripsi_validated_user_information',
    value: 'Menggunakan basis pengetahuan yang telah divalidasi dari summary notes Anda. Jawaban lebih akurat dan terverifikasi dari sumber terpercaya.',
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
  {
    key: 'skripsi_paraphraser_context_messages',
    value: '10',
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
  {
    key: 'skripsi_diagram_builder_context_messages',
    value: '10',
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
