import prisma from '#client'

async function migrate() {
  console.log('Migrating flashcard_cards.node_id → feature_node_records...')

  const cards = await prisma.flashcard_cards.findMany({
    where: { node_id: { not: null } },
    select: { id: true, node_id: true },
  })

  console.log(`Found ${cards.length} cards with node_id set`)

  let created = 0
  let skipped = 0

  for (const card of cards) {
    const exists = await prisma.feature_node_records.findFirst({
      where: { record_type: 'flashcard_card', record_id: card.id },
    })
    if (exists) { skipped++; continue }

    await prisma.feature_node_records.create({
      data: { node_id: card.node_id, record_type: 'flashcard_card', record_id: card.id },
    })
    created++
  }

  console.log(`Migration complete: ${created} created, ${skipped} skipped`)
}

migrate()
  .then(async () => { await prisma.$disconnect(); process.exit(0) })
  .catch(async (err) => { console.error(err); await prisma.$disconnect(); process.exit(1) })
