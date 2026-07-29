import prisma from '#prisma/client'

export async function incrementNodeStat(nodeId, recordType) {
  await prisma.node_statistics.upsert({
    where: { node_id_record_type: { node_id: nodeId, record_type: recordType } },
    create: { node_id: nodeId, record_type: recordType, total_count: 1 },
    update: { total_count: { increment: 1 } },
  })
}

export async function decrementNodeStat(nodeId, recordType) {
  await prisma.node_statistics.upsert({
    where: { node_id_record_type: { node_id: nodeId, record_type: recordType } },
    create: { node_id: nodeId, record_type: recordType, total_count: 0 },
    update: { total_count: { decrement: 1 } },
  })
}
