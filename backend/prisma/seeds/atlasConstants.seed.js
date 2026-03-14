import prisma from '#prisma/client'

const atlasConstants = [
  {
    key: 'atlas_is_active',
    value: 'true',
  },
  {
    key: 'atlas_feature_title',
    value: 'Atlas 3D',
  },
  {
    key: 'atlas_feature_description',
    value: 'Pelajari anatomi tubuh manusia secara interaktif dengan model 3D',
  },
  {
    key: 'atlas_access_type',
    value: 'subscription',
  },
  {
    key: 'atlas_credit_cost',
    value: '0',
  },
  {
    key: 'atlas_youtube_url',
    value: '',
  },
]

async function main() {
  console.log('Seeding atlas constants...')

  for (const constant of atlasConstants) {
    await prisma.constants.upsert({
      where: { key: constant.key },
      update: { value: constant.value },
      create: constant,
    })
    console.log(`  ✓ ${constant.key} = ${constant.value}`)
  }

  console.log('Atlas constants seeded successfully!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
