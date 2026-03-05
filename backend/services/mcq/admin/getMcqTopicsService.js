import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class GetMcqTopicsService extends BaseService {
  static async call({ page = 1, limit = 30, status, search, university, semester, topic, department }) {
    const perPage = parseInt(limit)
    const skip = (parseInt(page) - 1) * perPage

    const where = {}

    if (status) {
      where.status = status
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    const tagFilters = []

    if (university) {
      tagFilters.push({ mcq_topic_tags: { some: { tag_id: parseInt(university) } } })
    }
    if (semester) {
      tagFilters.push({ mcq_topic_tags: { some: { tag_id: parseInt(semester) } } })
    }
    if (topic) {
      tagFilters.push({ mcq_topic_tags: { some: { tag_id: parseInt(topic) } } })
    }
    if (department) {
      tagFilters.push({ mcq_topic_tags: { some: { tag_id: parseInt(department) } } })
    }

    if (tagFilters.length > 0) {
      where.AND = tagFilters
    }

    const topics = await prisma.mcq_topics.findMany({
      where,
      skip,
      take: perPage + 1,
      orderBy: { created_at: 'desc' },
      include: {
        mcq_questions: { select: { id: true } },
        mcq_topic_tags: {
          include: {
            tags: { include: { tag_group: true } }
          }
        }
      }
    })

    const hasMore = topics.length > perPage
    const topicsToReturn = hasMore ? topics.slice(0, perPage) : topics

    const data = topicsToReturn.map(topic => {
      const allTags = topic.mcq_topic_tags.filter(tt => tt.tags).map(tt => ({
        id: tt.tags.id,
        name: tt.tags.name,
        tagGroupId: tt.tags.tag_group_id,
        tagGroupName: tt.tags.tag_group?.name
      }))

      return {
        ...topic,
        question_count: topic.question_count || topic.mcq_questions.length,
        tags: allTags,
        universityTags: allTags.filter(t => t.tagGroupName === 'university'),
        semesterTags: allTags.filter(t => t.tagGroupName === 'semester'),
        topicTags: allTags.filter(t => t.tagGroupName === 'topic'),
        departmentTags: allTags.filter(t => t.tagGroupName === 'department')
      }
    })

    return {
      topics: data,
      pagination: {
        page: parseInt(page),
        limit: perPage,
        isLastPage: !hasMore
      }
    }
  }
}
