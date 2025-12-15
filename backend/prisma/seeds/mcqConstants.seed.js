import prisma from '../client.js'

export async function seedMcqConstants() {
  console.log('Seeding MCQ constants...')

  const constants = [
    {
      key: 'mcq_feature_title',
      value: 'Latihan Soal Pilihan Ganda'
    },
    {
      key: 'mcq_feature_description',
      value: 'Latihan soal pilihan ganda untuk menguji pemahaman mahasiswa kedokteran dengan mode pembelajaran dan kuis'
    },
    {
      key: 'mcq_generation_model',
      value: 'gemini-2.5-flash'
    },
    {
      key: 'mcq_generation_prompt',
      value: `Kamu adalah seorang dosen medis yang ahli dalam membuat soal pilihan ganda untuk mahasiswa kedokteran.

Tugas: Buatlah {{questionCount}} soal pilihan ganda berkualitas tinggi berdasarkan materi berikut.

Materi:
{{context}}

Format Output (JSON):
[
  {
    "question": "Pertanyaan yang jelas dan spesifik",
    "options": ["Pilihan 1", "Pilihan 2", "Pilihan 3", "Pilihan 4"],
    "correct_answer": 0,
    "explanation": "Penjelasan lengkap mengapa ini jawaban yang benar"
  }
]

Aturan:
1. Setiap pertanyaan harus memiliki minimal 4 pilihan jawaban dalam array "options"
2. HANYA SATU jawaban yang benar
3. Pilihan jawaban yang salah harus masuk akal (plausible distractors)
4. Fokus pada konsep medis penting dari materi
5. Penjelasan harus jelas dan edukatif (2-4 kalimat)
6. Gunakan bahasa Indonesia yang formal dan medis
7. Pastikan pertanyaan bervariasi dan mencakup berbagai aspek materi
8. correct_answer harus berisi index (0-based) dari jawaban yang benar dalam array options
9. Output harus berupa valid JSON array

Hasilkan HANYA JSON array tanpa teks tambahan apapun.`
    },
    {
      key: 'mcq_credit_cost',
      value: '15'
    },
    {
      key: 'mcq_session_type',
      value: 'mcq'
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

  console.log('MCQ constants seeding completed!')
}
