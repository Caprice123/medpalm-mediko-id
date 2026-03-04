import prisma from '#client'

export async function seedOscePracticeConstants() {
  console.log('Seeding OSCE Practice constants...')

  const constants = [
    {
      key: 'osce_practice_feature_title',
      value: 'OSCE Practice'
    },
    {
      key: 'osce_practice_feature_description',
      value: 'Practice clinical scenarios with AI assessment'
    },
    {
      key: 'osce_practice_is_active',
      value: 'true'
    },
    {
      key: 'osce_practice_access_type',
      value: 'credits'
    },
    {
      key: 'osce_practice_credit_cost',
      value: '5'
    },
    {
      key: 'osce_practice_default_model',
      value: 'gemini-1.5-pro'
    },
    {
      key: 'osce_practice_context_message_count',
      value: '50'
    },
    {
      key: 'osce_practice_chat_completion_prompt',
      value: `Anda adalah pasien dalam skenario OSCE (Objective Structured Clinical Examination).

Konteks: {{context}}
Skenario: {{scenario}}
{{knowledgeBase}}

Instruksi:
1. Berperan sebagai pasien sesuai dengan konteks dan skenario yang diberikan
2. Respons Anda harus konsisten dengan informasi di knowledge base (jika ada)
3. Berikan jawaban yang natural dan realistis seperti pasien sungguhan
4. Jika ditanya hal yang tidak ada di knowledge base, jawab sesuai dengan karakter pasien yang wajar
5. Jangan memberikan diagnosa atau saran medis - Anda adalah pasien, bukan dokter`
    },
    {
      key: 'osce_practice_chunk_analysis_prompt',
      value: `Analisis chunk percakapan OSCE berikut berdasarkan rubrik penilaian yang diberikan.

Rubrik Penilaian:
{{rubric}}

Percakapan:
{{conversationChunk}}

Berikan penilaian dalam format JSON berikut:
{
  "observations": [
    {
      "observationId": "id dari rubrik",
      "achieved": true/false,
      "notes": "catatan spesifik dari percakapan"
    }
  ]
}`
    },
    {
      key: 'osce_practice_evaluation_prompt',
      value: `Berdasarkan analisis semua chunk percakapan, berikan evaluasi final untuk sesi OSCE ini.

Rubrik Penilaian:
{{rubric}}

Hasil Analisis per Chunk:
{{chunkAnalyses}}

Percakapan Lengkap:
{{fullConversation}}

Berikan evaluasi final dalam format JSON:
{
  "finalObservations": [
    {
      "observationId": "id",
      "achieved": true/false,
      "evidence": "bukti dari percakapan",
      "notes": "catatan evaluasi"
    }
  ],
  "overallFeedback": "feedback keseluruhan performa",
  "strengths": ["kekuatan 1", "kekuatan 2"],
  "improvements": ["area perbaikan 1", "area perbaikan 2"]
}`
    },
    {
      key: 'osce_practice_physical_exam_guideline',
      value: `🩺 **Pemeriksaan Fisik**

Di tab ini, Anda dapat melakukan pemeriksaan fisik pada pasien simulasi. Sistem akan memberikan temuan objektif berdasarkan kondisi pasien.

**Contoh pemeriksaan yang dapat dilakukan:**

- 💓 **Tanda Vital:** "periksa tanda vital" atau "ukur tekanan darah"
- 👂 **Kepala & Leher:** "inspeksi kepala dan leher" atau "palpasi kelenjar limfe"
- 🫁 **Thorax:** "auskultasi paru" atau "perkusi thorax"
- 🫃 **Abdomen:** "palpasi abdomen" atau "auskultasi bising usus"
- 🦵 **Ekstremitas:** "inspeksi ekstremitas" atau "tes kekuatan otot"
- 🧠 **Neurologis:** "tes refleks patella" atau "pemeriksaan nervus kranialis"

💡 **Tip:** Sistem hanya memberikan temuan objektif. Untuk bertanya atau diskusi diagnosis, gunakan tab "Percakapan".`
    }
  ]

  for (const constant of constants) {
    await prisma.constants.upsert({
      where: { key: constant.key },
      update: { value: constant.value },
      create: constant
    })
  }

  console.log('OSCE Practice constants seeded successfully')
}

seedOscePracticeConstants()
