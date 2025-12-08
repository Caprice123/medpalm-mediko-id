import prisma from '../client.js'

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
