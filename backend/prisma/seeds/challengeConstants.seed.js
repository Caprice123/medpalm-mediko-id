import prisma from '#client'

export async function seedChallengeConstants() {
  console.log('🌱 Seeding challenge constants...')

  const constants = [
    { key: 'challenge_feature_title', value: 'Challenge' },
    { key: 'challenge_feature_description', value: 'Uji pengetahuanmu dan bersaing dengan pengguna lain dalam challenge eksklusif.' },
    { key: 'challenge_access_type', value: 'free' },
    { key: 'challenge_is_active', value: 'true' },
  ]

  for (const { key, value } of constants) {
    await prisma.constants.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    })
  }

  console.log('✅ Challenge constants seeded successfully')
}

// Allow running directly: node prisma/seeds/challengeConstants.seed.js
const isMain = process.argv[1]?.endsWith('challengeConstants.seed.js')
if (isMain) {
  seedChallengeConstants()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
}
