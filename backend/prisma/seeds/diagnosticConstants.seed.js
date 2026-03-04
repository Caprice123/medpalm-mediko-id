import prisma from '#prisma/client'

export async function seedDiagnosticConstants() {
  console.log('Seeding diagnostic constants...')

  const constants = [
    {
      key: 'diagnostic_feature_title',
      value: 'Quiz Diagnostik Interaktif'
    },
    {
      key: 'diagnostic_feature_description',
      value: 'Quiz diagnostik berbasis gambar untuk membantu mahasiswa kedokteran memahami dan menghafal struktur anatomi tubuh manusia'
    },
    {
      key: 'diagnostic_access_type',
      value: 'subscription'
    },
    {
      key: 'diagnostic_credit_cost',
      value: '0'
    },
    {
      key: 'diagnostic_is_active',
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

  console.log('Diagnostic constants seeding completed!')
}

// Run if called directly
seedDiagnosticConstants()
  .then(async () => {
    console.log('Done!')
    await prisma.$disconnect()
    process.exit(0)
  })
  .catch(async (error) => {
    console.error('Error seeding diagnostic constants:', error)
    await prisma.$disconnect()
    process.exit(1)
  })
