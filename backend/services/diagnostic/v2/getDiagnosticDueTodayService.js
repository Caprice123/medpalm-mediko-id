import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

const RECORD_TYPE = 'diagnostic_question'

export class GetDiagnosticDueTodayService extends BaseService {
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
      JOIN diagnostic_questions dq  ON dq.id           = urs.record_id
      JOIN feature_node_records fnr ON fnr.record_type  = ${RECORD_TYPE} AND fnr.record_id = dq.id
      JOIN feature_nodes fn         ON fn.id            = fnr.node_id
      JOIN feature_nodes parent     ON parent.id        = fn.parent_id
      WHERE urs.user_id     = ${userId}
        AND urs.record_type = ${RECORD_TYPE}
        AND urs.due_date   <= ${now}
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
