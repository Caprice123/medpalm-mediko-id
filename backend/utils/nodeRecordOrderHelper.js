import prisma from '#prisma/client'

// Position a freshly-linked feature_node_records row at the end of its (node_id, record_type)
// group — call before creating the row, then set `order` to the returned value.
export async function nextAppendOrder({ nodeId, recordType }) {
  const { _max } = await prisma.feature_node_records.aggregate({
    where: { node_id: nodeId, record_type: recordType },
    _max: { order: true },
  })
  return (_max.order ?? -1) + 1
}

// After a row leaves a (node_id, record_type) group (unlinked, moved away, or deleted),
// shift the remaining rows' order down to close the gap it left behind.
export async function closeOrderGap({ nodeId, recordType, removedOrder }) {
  if (removedOrder === null || removedOrder === undefined) return
  await prisma.feature_node_records.updateMany({
    where: { node_id: nodeId, record_type: recordType, order: { gt: removedOrder } },
    data: { order: { decrement: 1 } },
  })
}
