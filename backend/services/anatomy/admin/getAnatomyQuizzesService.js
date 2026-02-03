import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import idriveService from '#services/idrive.service'
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

    const where = {}

    // Build filter conditions for tags
    const tagFilters = []

    // Multiple university filter: ?university=1,2,3
    if (filters.university) {
      const universityIds = Array.isArray(filters.university)
        ? filters.university.map(id => parseInt(id))
        : filters.university.split(',').map(id => parseInt(id))

      tagFilters.push({
        anatomy_quiz_tags: {
          some: {
            tag_id: { in: universityIds }
          }
        }
      })
    }

    // Multiple semester filter: ?semester=1,2
    if (filters.semester) {
      const semesterIds = Array.isArray(filters.semester)
        ? filters.semester.map(id => parseInt(id))
        : filters.semester.split(',').map(id => parseInt(id))

      tagFilters.push({
        anatomy_quiz_tags: {
          some: {
            tag_id: { in: semesterIds }
          }
        }
      })
    }

    // Apply tag filters with AND logic
    if (tagFilters.length > 0) {
      where.AND = tagFilters
    }

    // Filter by status if provided
    if (filters.status) {
      where.status = filters.status
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

    // Get attachments for all quizzes (MAJOR PERFORMANCE BOOST)
    const attachmentMap = await attachmentService.getBulkAttachmentsWithUrls(
      paginatedQuizzes.map(quiz => ({
        recordType: 'anatomy_quiz',
        recordId: quiz.id,
        name: 'image'
      }))
    )

    return {
      data: paginatedQuizzes,
      attachmentMap,
      pagination: {
        page,
        perPage,
        isLastPage
      }
    }
  }

  static validate(filters) {
    // Validate university filter if provided
    if (filters.university) {
      const universityIds = Array.isArray(filters.university)
        ? filters.university
        : filters.university.split(',')

      for (const id of universityIds) {
        const universityId = parseInt(id)
        if (isNaN(universityId) || universityId <= 0) {
          throw new ValidationError('Invalid university filter')
        }
      }
    }

    // Validate semester filter if provided
    if (filters.semester) {
      const semesterIds = Array.isArray(filters.semester)
        ? filters.semester
        : filters.semester.split(',')

      for (const id of semesterIds) {
        const semesterId = parseInt(id)
        if (isNaN(semesterId) || semesterId <= 0) {
          throw new ValidationError('Invalid semester filter')
        }
      }
    }

    // Validate status filter if provided
    if (filters.status && !['draft', 'published'].includes(filters.status)) {
      throw new ValidationError('Invalid status filter. Must be "draft" or "published"')
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
