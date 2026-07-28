import prisma from '#prisma/client'

const anatomyAtlasConstants = [
  { key: 'anatomy_atlas_is_active', value: 'true' },
  { key: 'anatomy_atlas_feature_title', value: 'Anatomi & Atlas 3D' },
  { key: 'anatomy_atlas_feature_description', value: 'Pelajari anatomi tubuh manusia dengan model 3D interaktif dan kuis anatomi' },
  { key: 'anatomy_atlas_access_type', value: 'subscription' },
  { key: 'anatomy_atlas_credit_cost', value: '0' },
  { key: 'anatomy_atlas_youtube_url', value: '' },
]

async function main() {
  console.log('Seeding anatomy atlas constants...')

  for (const constant of anatomyAtlasConstants) {
    await prisma.constants.upsert({
      where: { key: constant.key },
      update: { value: constant.value },
      create: constant,
    })
    console.log(`  ✓ ${constant.key} = ${constant.value}`)
  }

  console.log('Anatomy atlas constants seeded successfully!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
