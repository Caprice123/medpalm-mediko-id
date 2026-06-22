import prisma from '#prisma/client'

function buildAdditionQuestions(count, startA = 1, startB = 1, orderOffset = 0) {
  const questions = []
  let a = startA
  let b = startB

  for (let i = 0; i < count; i++) {
    const correct = a + b
    const correctPos = i % 4

    const wrongs = []
    const candidates = [correct + 1, correct - 1, correct + 2, correct - 2, correct + 3]
    for (const c of candidates) {
      if (c > 0 && c !== correct) wrongs.push(String(c))
      if (wrongs.length === 3) break
    }

    const opts = [...wrongs]
    opts.splice(correctPos, 0, String(correct))

    questions.push({
      question: `Berapa hasil dari ${a} + ${b}?`,
      options: opts,
      correct_option_index: correctPos,
      explanation: `${a} + ${b} = ${correct}`,
      order: orderOffset + i,
      is_special: false,
    })

    b += 2
    if (b > 20) { a++; b = a + 1 }
    if (a > 30) { a = 1; b = 2 }
  }

  return questions
}

function buildSpecialQuestions(count, orderOffset = 0) {
  const questions = []
  const pairs = [
    [12, 13], [14, 15], [16, 17], [18, 19], [21, 22],
    [23, 24], [25, 26], [27, 28], [31, 32], [33, 34],
  ]

  for (let i = 0; i < count; i++) {
    const [a, b] = pairs[i % pairs.length]
    const correct = a * b
    const correctPos = i % 4

    const wrongs = []
    const candidates = [correct + a, correct - a, correct + b, correct - b, correct + 1]
    for (const c of candidates) {
      if (c > 0 && c !== correct) wrongs.push(String(c))
      if (wrongs.length === 3) break
    }

    const opts = [...wrongs]
    opts.splice(correctPos, 0, String(correct))

    questions.push({
      question: `⭐ [SOAL SPESIAL] Berapa hasil dari ${a} × ${b}?`,
      options: opts,
      correct_option_index: correctPos,
      explanation: `${a} × ${b} = ${correct}`,
      order: orderOffset + i,
      is_special: true,
    })
  }

  return questions
}

const startAt = new Date()
const endAt = new Date(startAt)
endAt.setFullYear(endAt.getFullYear() + 1)

const CHALLENGES = [
  {
    unique_id: 'seed-challenge-classic-001',
    title: 'Classic Math Challenge',
    description: 'Uji kemampuan matematika dasarmu! Jawab 10 soal penjumlahan dalam waktu 1 menit.',
    scoring_type: 'classic',
    duration_minutes: 1,
    total_questions: 10,
    base_points_per_correct: 100,
    seconds_per_question: 30,
    max_special_per_session: 3,
    status: 'active',
    start_at: startAt,
    end_at: endAt,
    questions: [
      ...buildAdditionQuestions(10, 1, 2, 0),
      ...buildSpecialQuestions(5, 10),  // pool of 5, up to 3 drawn per session
    ],
    badges: [
      { unique_id: 'seed-badge-classic-gold-001',   name: 'Gold Classic',   description: 'Top 10% pemain Classic',  min_rank: 1,  max_rank: 10 },
      { unique_id: 'seed-badge-classic-silver-001', name: 'Silver Classic', description: 'Top 25% pemain Classic',  min_rank: 11, max_rank: 25 },
      { unique_id: 'seed-badge-classic-bronze-001', name: 'Bronze Classic', description: 'Top 50% pemain Classic',  min_rank: 26, max_rank: 50 },
    ],
  },
  {
    unique_id: 'seed-challenge-blitz-001',
    title: 'Blitz Math Challenge',
    description: 'Tantangan cepat! Jawab 50 soal penjumlahan dalam waktu 1 menit. Kecepatan dan akurasi adalah kunci!',
    scoring_type: 'blitz',
    duration_minutes: 1,
    total_questions: 50,
    base_points_per_correct: 100,
    seconds_per_question: 30,
    max_special_per_session: 5,
    status: 'active',
    start_at: startAt,
    end_at: endAt,
    questions: [
      ...buildAdditionQuestions(50, 1, 2, 0),
      ...buildSpecialQuestions(10, 50),  // pool of 10, up to 5 drawn per session
    ],
    badges: [
      { unique_id: 'seed-badge-blitz-gold-001',   name: 'Gold Blitz',   description: 'Top 10% pemain Blitz',  min_rank: 1,  max_rank: 10 },
      { unique_id: 'seed-badge-blitz-silver-001', name: 'Silver Blitz', description: 'Top 25% pemain Blitz',  min_rank: 11, max_rank: 25 },
      { unique_id: 'seed-badge-blitz-bronze-001', name: 'Bronze Blitz', description: 'Top 50% pemain Blitz',  min_rank: 26, max_rank: 50 },
    ],
  },
]

export async function seedChallengeData() {
  console.log('🌱 Seeding challenge data...')

  const adminUser = await prisma.users.findFirst({ where: { role: 'superadmin' }, select: { id: true } })
  if (!adminUser) throw new Error('No admin user found. Please seed an admin user first.')
  const createdBy = adminUser.id

  for (const challengeData of CHALLENGES) {
    const { questions, badges, ...challengeFields } = challengeData

    const challenge = await prisma.challenges.upsert({
      where: { unique_id: challengeFields.unique_id },
      update: {
        title: challengeFields.title,
        description: challengeFields.description,
        scoring_type: challengeFields.scoring_type,
        duration_minutes: challengeFields.duration_minutes,
        total_questions: challengeFields.total_questions,
        base_points_per_correct: challengeFields.base_points_per_correct,
        seconds_per_question: challengeFields.seconds_per_question,
        max_special_per_session: challengeFields.max_special_per_session,
        status: challengeFields.status,
        start_at: challengeFields.start_at,
        end_at: challengeFields.end_at,
        updated_at: new Date(),
      },
      create: {
        ...challengeFields,
        created_by: createdBy,
      },
    })

    console.log(`  ✓ ${challenge.title} (${challenge.scoring_type})`)

    // Upsert questions by order within this challenge
    for (const q of questions) {
      const existing = await prisma.challenge_questions.findFirst({
        where: { challenge_id: challenge.id, order: q.order },
      })

      if (existing) {
        await prisma.challenge_questions.update({
          where: { id: existing.id },
          data: {
            question: q.question,
            options: q.options,
            correct_option_index: q.correct_option_index,
            explanation: q.explanation,
            is_special: q.is_special,
            updated_at: new Date(),
          },
        })
      } else {
        await prisma.challenge_questions.create({
          data: {
            challenge_id: challenge.id,
            question: q.question,
            options: q.options,
            correct_option_index: q.correct_option_index,
            explanation: q.explanation,
            order: q.order,
            is_special: q.is_special,
          },
        })
      }
    }

    console.log(`    → ${questions.length} questions seeded`)

    // Upsert badges
    for (const badge of badges) {
      await prisma.challenge_badges.upsert({
        where: { unique_id: badge.unique_id },
        update: {
          name: badge.name,
          description: badge.description,
          min_rank: badge.min_rank,
          max_rank: badge.max_rank,
        },
        create: {
          unique_id: badge.unique_id,
          challenge_id: challenge.id,
          name: badge.name,
          description: badge.description,
          min_rank: badge.min_rank,
          max_rank: badge.max_rank,
        },
      })
    }

    console.log(`    → ${badges.length} badges seeded`)
  }

  console.log('✅ Challenge data seeded successfully')
}

// Allow running directly: node prisma/seeds/challengeData.seed.js
const isMain = process.argv[1]?.endsWith('challengeData.seed.js')
if (isMain) {
  seedChallengeData()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
}
