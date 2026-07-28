import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'

export class ReorderNodeService extends BaseService {
  static async call({ nodeId, afterNodeId }) {
    nodeId = parseInt(nodeId)
    afterNodeId = afterNodeId != null ? parseInt(afterNodeId) : null

    if (afterNodeId === nodeId) throw new ValidationError('Node tidak bisa ditempatkan setelah dirinya sendiri')

    const node = await prisma.feature_nodes.findUnique({
      where: { id: nodeId },
      select: { id: true, parent_id: true },
    })
    if (!node) throw new ValidationError('Node tidak ditemukan')

    await prisma.$transaction(async (tx) => {
      const entry = await tx.node_adjacency.findUnique({ where: { node_id: nodeId } })
      const prevId = entry?.prev_node_id ?? null
      const nextId = entry?.next_node_id ?? null

      // Step 1: Detach — heal the gap left by removing nodeId
      if (prevId) {
        await tx.node_adjacency.update({
          where: { node_id: prevId },
          data: { next_node_id: nextId },
        })
      }
      if (nextId) {
        await tx.node_adjacency.update({
          where: { node_id: nextId },
          data: { prev_node_id: prevId },
        })
      }

      // Step 2: Insert after afterNodeId (null = move to head)
      if (afterNodeId === null) {
        // Find current head: sibling with no prev_node_id and parent matches
        const head = await tx.node_adjacency.findFirst({
          where: {
            prev_node_id: null,
            node_id: { not: nodeId },
            node: { parent_id: node.parent_id },
          },
        })

        // nodeId becomes new head
        await tx.node_adjacency.upsert({
          where: { node_id: nodeId },
          update: { prev_node_id: null, next_node_id: head?.node_id ?? null },
          create: { node_id: nodeId, prev_node_id: null, next_node_id: head?.node_id ?? null },
        })
        if (head) {
          await tx.node_adjacency.update({
            where: { node_id: head.node_id },
            data: { prev_node_id: nodeId },
          })
        }
      } else {
        const afterEntry = await tx.node_adjacency.findUnique({ where: { node_id: afterNodeId } })
        const afterNextId = afterEntry?.next_node_id ?? null

        // afterNode → nodeId → afterNode's old next
        await tx.node_adjacency.upsert({
          where: { node_id: afterNodeId },
          update: { next_node_id: nodeId },
          create: { node_id: afterNodeId, prev_node_id: afterEntry?.prev_node_id ?? null, next_node_id: nodeId },
        })
        await tx.node_adjacency.upsert({
          where: { node_id: nodeId },
          update: { prev_node_id: afterNodeId, next_node_id: afterNextId },
          create: { node_id: nodeId, prev_node_id: afterNodeId, next_node_id: afterNextId },
        })
        if (afterNextId) {
          await tx.node_adjacency.update({
            where: { node_id: afterNextId },
            data: { prev_node_id: nodeId },
          })
        }
      }
    })
  }
}
