import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'

export class SubmitMcqSessionService extends BaseService {
  static async call({ userId, nodeResults }) {
    if (!nodeResults || nodeResults.length === 0) {
      throw new ValidationError('Hasil sesi tidak boleh kosong')
    }

    // Upsert subtopic (layer 2) progress with raw question counts
    await Promise.all(nodeResults.map(({ nodeId, correct, total }) =>
      prisma.user_node_progress.upsert({
        where: {
          user_id_node_id_feature_type: {
            user_id: userId,
            node_id: parseInt(nodeId),
            feature_type: 'mcq',
          },
        },
        create: {
          user_id: userId,
          node_id: parseInt(nodeId),
          feature_type: 'mcq',
          total_sessions: 1,
          total_questions: parseInt(total),
          total_correct: parseInt(correct),
        },
        update: {
          total_sessions: { increment: 1 },
          total_questions: { increment: parseInt(total) },
          total_correct: { increment: parseInt(correct) },
        },
      })
    ))

    // Look up parent topic IDs for the submitted subtopic nodes
    const nodeIds = nodeResults.map(r => parseInt(r.nodeId))
    const nodes = await prisma.feature_nodes.findMany({
      where: { id: { in: nodeIds } },
      select: { id: true, parent_id: true },
    })

    // Group question counts by parent topic
    const topicCounts = new Map()
    for (const node of nodes) {
      if (!node.parent_id) continue
      const result = nodeResults.find(r => parseInt(r.nodeId) === node.id)
      if (!result) continue
      if (!topicCounts.has(node.parent_id)) topicCounts.set(node.parent_id, { correct: 0, total: 0 })
      const entry = topicCounts.get(node.parent_id)
      entry.correct += parseInt(result.correct)
      entry.total += parseInt(result.total)
    }

    // Upsert topic (layer 1) progress — accumulate raw question counts across subtopics
    if (topicCounts.size > 0) {
      await Promise.all([...topicCounts.entries()].map(([topicId, { correct, total }]) =>
        prisma.user_node_progress.upsert({
          where: {
            user_id_node_id_feature_type: {
              user_id: userId,
              node_id: topicId,
              feature_type: 'mcq',
            },
          },
          create: {
            user_id: userId,
            node_id: topicId,
            feature_type: 'mcq',
            total_sessions: 1,
            total_questions: total,
            total_correct: correct,
          },
          update: {
            total_sessions: { increment: 1 },
            total_questions: { increment: total },
            total_correct: { increment: correct },
          },
        })
      ))
    }

    return { success: true }
  }
}
