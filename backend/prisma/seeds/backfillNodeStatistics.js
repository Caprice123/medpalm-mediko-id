import prisma from '#prisma/client'

const RECORD_TYPES = ['flashcard_card', 'summary_note', 'mcq_question', '3d_atlas', 'anatomy_quiz']

// Pass record types as arguments to backfill only those, e.g.
//   node prisma/seeds/backfillNodeStatistics.js 3d_atlas anatomy_quiz
// With no arguments every type above is backfilled.
function selectedRecordTypes() {
  const args = process.argv.slice(2)
  if (args.length === 0) return RECORD_TYPES

  const unknown = args.filter(a => !RECORD_TYPES.includes(a))
  if (unknown.length > 0) {
    // Exit rather than skip: a typo would otherwise look like a successful run
    // that silently backfilled nothing.
    console.error(`Unknown record type(s): ${unknown.join(', ')}`)
    console.error(`Known types: ${RECORD_TYPES.join(', ')}`)
    process.exit(1)
  }

  return RECORD_TYPES.filter(t => args.includes(t))
}

// Record types whose node_statistics rows only ever mirror feature_node_records on that
// same node, so a row with no matching records can safely be reset to 0. `flashcard_card`
// is deliberately absent: its layer-1 rows are parent rollups written by
// backfillFlashcardTopicNodeStatistics.js, not a count of records on the topic node, so
// zeroing orphans would wipe them.
const RECONCILABLE_RECORD_TYPES = ['3d_atlas', 'anatomy_quiz']

async function backfill() {
  const recordTypes = selectedRecordTypes()
  console.log(`Backfilling node_statistics for: ${recordTypes.join(', ')}`)

  for (const recordType of recordTypes) {
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

    if (!RECONCILABLE_RECORD_TYPES.includes(recordType)) continue

    // Rows left behind by nodes that no longer hold any record of this type — including
    // counts that drifted negative while the V2 create path incremented nothing but the
    // delete path still decremented.
    const countedNodeIds = records.map(r => r.node_id)
    const { count } = await prisma.node_statistics.updateMany({
      where: {
        record_type: recordType,
        total_count: { not: 0 },
        ...(countedNodeIds.length > 0 && { node_id: { notIn: countedNodeIds } }),
      },
      data: { total_count: 0 },
    })
    console.log(`  ${recordType}: ${count} stale rows reset to 0`)
  }

  console.log('Done.')
}

backfill().catch(console.error).finally(() => prisma.$disconnect())
