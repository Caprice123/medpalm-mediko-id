import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { GetConstantsService } from '#services/constant/getConstantsService'
import attachmentService from '#services/attachment/attachmentService'

export class GetAnatomyQuizzesService extends BaseService {
  static async call(filters = {}) {
    this.validate(filters)

    // Pagination parameters
    const page = Math.max(1, parseInt(filters.page) || 1)
    const perPage = Math.min(100, Math.max(1, parseInt(filters.perPage) || 20))
    const skip = (page - 1) * perPage

    // Fetch perPage + 1 to determine if there's a next page
    const take = perPage + 1

    const where = { is_deleted: false }

    if (filters.userRole === 'user') {
      where.status = 'published'
    }

    // Build filter conditions for tags
    const tagFilters = []

    // Anatomy topic filter: ?university=1,2,3
    if (filters.topic) {
      const topicIds = Array.isArray(filters.topic)
        ? filters.topic.map(id => parseInt(id))
        : filters.topic.split(',').map(id => parseInt(id))

      tagFilters.push({
        anatomy_quiz_tags: {
          some: {
            tag_id: { in: topicIds }
          }
        }
      })
    }

    // Apply tag filters with AND logic
    if (tagFilters.length > 0) {
      where.AND = tagFilters
    }

    // Search filter (title or description)
    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } }
      ]
    }

    const quizzes = await prisma.anatomy_quizzes.findMany({
      where,
      take,
      skip,
      include: {
        anatomy_quiz_tags: {
          include: {
            tags: {
              include: {
                tag_group: true
              }
            }
          }
        },
      },
      orderBy: {
        created_at: 'desc'
      }
    })

    // Determine if this is the last page
    const isLastPage = quizzes.length <= perPage

    // Only return perPage items (exclude the +1 check item)
    const paginatedQuizzes = quizzes.slice(0, perPage)

    // Get cost from constants
    const anatomyConstant = await GetConstantsService.call(['anatomy_quiz_cost'])
    const cost = anatomyConstant.anatomy_quiz_cost

    // Get attachments for all quizzes (MAJOR PERFORMANCE BOOST)
    const attachmentMap = await attachmentService.getBulkAttachmentsWithUrls(
      paginatedQuizzes.map(quiz => ({
        record_type: 'anatomy_quiz',
        record_id: quiz.id,
        name: 'image'
      }))
    )

    // Attach data needed for serialization
    const enrichedQuizzes = paginatedQuizzes.map((quiz) => {
      const attachment = attachmentMap.get(quiz.id)

      return {
        ...quiz,
        image_url: attachment?.url || null,
        questionCount: quiz.question_count
      }
    })

    return {
      quizzes: enrichedQuizzes,
      pagination: {
        page,
        perPage,
        isLastPage
      }
    }
  }

  static validate(filters) {
    // Validate topic filter if provided
    if (filters.topic) {
      const topicIds = Array.isArray(filters.topic)
        ? filters.topic
        : filters.topic.split(',')

      for (const id of topicIds) {
        const universityId = parseInt(id)
        if (isNaN(universityId) || universityId <= 0) {
          throw new ValidationError('Invalid topic filter')
        }
      }
    }


    // Validate pagination
    if (filters.page && (isNaN(parseInt(filters.page)) || parseInt(filters.page) < 1)) {
      throw new ValidationError('Invalid page number')
    }

    if (filters.perPage) {
      const perPage = parseInt(filters.perPage)
      if (isNaN(perPage) || perPage < 1 || perPage > 100) {
        throw new ValidationError('Invalid perPage. Must be between 1 and 100')
      }
    }
  }
}
