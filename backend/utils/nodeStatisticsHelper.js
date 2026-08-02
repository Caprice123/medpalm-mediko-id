import prisma from '#prisma/client'

export async function bumpNodeStat(client, nodeId, recordType, delta) {
  await client.node_statistics.upsert({
    where: { node_id_record_type: { node_id: nodeId, record_type: recordType } },
    create: { node_id: nodeId, record_type: recordType, total_count: Math.max(delta, 0) },
    update: { total_count: { increment: delta } },
  })
}

export async function incrementNodeStat(nodeId, recordType) {
  await bumpNodeStat(prisma, nodeId, recordType, 1)
}

export async function decrementNodeStat(nodeId, recordType) {
  await bumpNodeStat(prisma, nodeId, recordType, -1)
}
