import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

const DEFAULT_LIMIT = 50

export class GetMcqSubtopicsService extends BaseService {
  static async call({ userId, topicId, cursor = null, limit = DEFAULT_LIMIT, sortBy = 'name' }) {
    return sortBy === 'avgScore'
      ? this.callSortedByAvgScore({ userId, topicId, cursor, limit })
      : this.callSortedByName({ topicId, cursor, limit })
  }

  // Used by the Quick Start subtopic picker — a plain, cheap query. No join needed since
  // the picker doesn't display avgScore, just name/questionCount.
  static async callSortedByName({ topicId, cursor = null, limit = DEFAULT_LIMIT }) {
    const skip = cursor ?? 0

    const rows = await prisma.feature_nodes.findMany({
      where: {
        parent_id: parseInt(topicId),
        layer: 2,
        visibility: 'general',
        node_type: 'subtopic',
        node_statistics: { some: { record_type: 'mcq_question', total_count: { gt: 0 } } },
      },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        node_statistics: { where: { record_type: 'mcq_question' }, select: { total_count: true } },
      },
      skip,
      take: limit + 1,
    })

    const isLastPage = rows.length <= limit
    const page = isLastPage ? rows : rows.slice(0, limit)
    const nextCursor = isLastPage ? null : skip + limit

    const subtopics = page.map(s => ({
      id: s.id,
      name: s.name,
      questionCount: s.node_statistics[0]?.total_count ?? 0,
      totalSessions: 0,
      avgScore: null,
    }))

    return { subtopics, nextCursor }
  }

  // Used by the performance chart drill-down — sorted by the user's avgScore (nulls last),
  // a value only known after joining user_node_progress, so pagination has to happen in the
  // same raw query as the join rather than in Prisma's findMany, to keep the sort correct
  // across pages.
  static async callSortedByAvgScore({ userId, topicId, cursor = null, limit = DEFAULT_LIMIT }) {
    const skip = cursor ?? 0

    const rows = await prisma.$queryRaw`
      SELECT
        fn.id                     AS id,
        fn.name                   AS name,
        ns.total_count             AS question_count,
        COALESCE(unp.total_sessions, 0) AS total_sessions,
        CASE WHEN unp.total_questions > 0
          THEN ROUND((unp.total_correct::numeric / unp.total_questions) * 100)
          ELSE NULL
        END AS avg_score
      FROM feature_nodes fn
      JOIN node_statistics ns ON ns.node_id = fn.id AND ns.record_type = 'mcq_question'
      LEFT JOIN user_node_progress unp
        ON unp.node_id = fn.id AND unp.user_id = ${userId} AND unp.feature_type = 'mcq'
      WHERE fn.parent_id   = ${topicId}
        AND fn.layer       = 2
        AND fn.visibility  = 'general'
        AND fn.node_type   = 'subtopic'
        AND ns.total_count > 0
      ORDER BY avg_score DESC NULLS LAST, fn.name ASC
      LIMIT ${limit + 1} OFFSET ${skip}
    `

    const isLastPage = rows.length <= limit
    const page = isLastPage ? rows : rows.slice(0, limit)
    const nextCursor = isLastPage ? null : skip + limit

    const subtopics = page.map(row => ({
      id: Number(row.id),
      name: row.name,
      questionCount: Number(row.question_count),
      totalSessions: Number(row.total_sessions),
      avgScore: row.avg_score == null ? null : Number(row.avg_score),
    }))

    return { subtopics, nextCursor }
  }
}
