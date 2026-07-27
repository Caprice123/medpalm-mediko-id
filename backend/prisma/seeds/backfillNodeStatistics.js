import prisma from '#prisma/client'

const RECORD_TYPES = ['flashcard_card', 'summary_note', 'mcq_question']

async function backfill() {
  console.log('Backfilling node_statistics...')

  for (const recordType of RECORD_TYPES) {
    const records = await prisma.feature_node_records.groupBy({
      by: ['node_id'],
      where: { record_type: recordType },
      _count: { id: true },
    })

    console.log(`  ${recordType}: ${records.length} nodes to update`)

    for (const row of records) {
      await prisma.node_statistics.upsert({
        where: { node_id_record_type: { node_id: row.node_id, record_type: recordType } },
        create: { node_id: row.node_id, record_type: recordType, total_count: row._count.id },
        update: { total_count: row._count.id },
      })
    }
  }

  console.log('Done.')
}

backfill().catch(console.error).finally(() => prisma.$disconnect())
