import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

const BATCH_SIZE = 100

export class GetFlashcardDueTodayService extends BaseService {
  static async call({ userId }) {
    const now = new Date()
    const counts = {}
    let cursor = 0

    while (true) {
      const rows = await prisma.$queryRaw`
        SELECT
          urs.id        AS state_id,
          fn.id         AS subtopic_id,
          fn.name       AS subtopic_name,
          parent.id     AS topic_id,
          parent.name   AS topic_name
        FROM user_review_states urs
        JOIN flashcard_cards fc   ON fc.id     = urs.record_id
        JOIN feature_nodes fn     ON fn.id     = fc.node_id
        JOIN feature_nodes parent ON parent.id = fn.parent_id
        WHERE urs.user_id     = ${userId}
          AND urs.record_type = 'flashcard_card'
          AND urs.due_date   <= ${now}
          AND fc.is_deleted   = false
          AND urs.id          > ${cursor}
        ORDER BY urs.id ASC
        LIMIT ${BATCH_SIZE}
      `

      if (rows.length === 0) break

      for (const row of rows) {
        const nodeId = Number(row.subtopic_id)
        if (!counts[nodeId]) {
          counts[nodeId] = {
            nodeId,
            nodeName: row.subtopic_name,
            topicId: Number(row.topic_id),
            topicName: row.topic_name,
            dueCount: 0,
          }
        }
        counts[nodeId].dueCount++
      }

      cursor = Number(rows[rows.length - 1].state_id)
      if (rows.length < BATCH_SIZE) break
    }

    const subtopics = Object.values(counts).sort((a, b) => b.dueCount - a.dueCount)
    const total = subtopics.reduce((sum, s) => sum + s.dueCount, 0)
    return { total, subtopics }
  }
}
