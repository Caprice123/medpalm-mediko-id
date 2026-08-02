import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class GetFlashcardDueTodayService extends BaseService {
  static async call({ userId }) {
    const now = new Date()

    const rows = await prisma.$queryRaw`
      SELECT
        fn.id         AS subtopic_id,
        fn.name       AS subtopic_name,
        parent.id     AS topic_id,
        parent.name   AS topic_name,
        COUNT(*)      AS due_count
      FROM user_review_states urs
      JOIN flashcard_cards fc      ON fc.id          = urs.record_id
      JOIN feature_node_records fnr ON fnr.record_type = 'flashcard_card' AND fnr.record_id = fc.id
      JOIN feature_nodes fn         ON fn.id           = fnr.node_id
      JOIN feature_nodes parent     ON parent.id       = fn.parent_id
      WHERE urs.user_id     = ${userId}
        AND urs.record_type = 'flashcard_card'
        AND urs.due_date   <= ${now}
        AND fc.is_deleted   = false
      GROUP BY fn.id, fn.name, parent.id, parent.name
    `

    const subtopics = rows
      .map(row => ({
        nodeId: Number(row.subtopic_id),
        nodeName: row.subtopic_name,
        topicId: Number(row.topic_id),
        topicName: row.topic_name,
        dueCount: Number(row.due_count),
      }))
      .sort((a, b) => b.dueCount - a.dueCount)

    const total = subtopics.reduce((sum, s) => sum + s.dueCount, 0)
    return { total, subtopics }
  }
}
