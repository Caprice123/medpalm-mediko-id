import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'

export class GetSummaryNotesService extends BaseService {
  static async call(filters = {}) {
    this.validate(filters)

    // Pagination parameters
    const page = Math.max(1, parseInt(filters.page) || 1)
    const perPage = Math.min(100, Math.max(1, parseInt(filters.perPage) || 12))
    const skip = (page - 1) * perPage

    // Fetch perPage + 1 to determine if there's a next page
    const take = perPage + 1

    const where = {
      status: 'published' // Only show published notes to users
    }

    // Build filter conditions for tags
    const tagFilters = []

    // Multiple university filter: ?university=1,2,3
    if (filters.university) {
      const universityIds = Array.isArray(filters.university)
        ? filters.university.map(id => parseInt(id))
        : filters.university.split(',').map(id => parseInt(id))

      tagFilters.push({
        summary_note_tags: {
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
        summary_note_tags: {
          some: {
            tag_id: { in: semesterIds }
          }
        }
      })
    }

    // Multiple topic filter: ?topic=1,2,3
    if (filters.topic) {
      const topicIds = Array.isArray(filters.topic)
        ? filters.topic.map(id => parseInt(id))
        : filters.topic.split(',').map(id => parseInt(id))

      tagFilters.push({
        summary_note_tags: {
          some: {
            tag_id: { in: topicIds }
          }
        }
      })
    }

    // Multiple department filter: ?department=1,2
    if (filters.department) {
      const departmentIds = Array.isArray(filters.department)
        ? filters.department.map(id => parseInt(id))
        : filters.department.split(',').map(id => parseInt(id))

      tagFilters.push({
        summary_note_tags: {
          some: {
            tag_id: { in: departmentIds }
          }
        }
      })
    }

    // Apply tag filters with AND logic
    if (tagFilters.length > 0) {
      where.AND = tagFilters
    }

    // Search filter (title and description, using ILIKE with GIN trigram index)
    if (filters.search) {
      const searchTerm = filters.search.trim()
      // Use contains (case-insensitive) which uses ILIKE under the hood
      // This will leverage the composite gin_trgm_ops index for fast substring search
      where.OR = [
        { title: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } }
      ]
    }

    // Get paginated summary notes
    const summaryNotes = await prisma.summary_notes.findMany({
      where,
      take,
      skip,
      include: {
        summary_note_tags: {
          include: {
            tags: {
              include: {
                tag_group: true
              }
            }
          }
        }
      },
      orderBy: {
        id: 'desc'
      }
    })

    // Determine if this is the last page
    const isLastPage = summaryNotes.length <= perPage

    // Only return perPage items (exclude the +1 check item)
    const paginatedNotes = summaryNotes.slice(0, perPage)

    // Return raw Prisma data - serializers handle transformation
    return {
      data: paginatedNotes,
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

    // Validate topic filter if provided
    if (filters.topic) {
      const topicIds = Array.isArray(filters.topic)
        ? filters.topic
        : filters.topic.split(',')

      for (const id of topicIds) {
        const topicId = parseInt(id)
        if (isNaN(topicId) || topicId <= 0) {
          throw new ValidationError('Invalid topic filter')
        }
      }
    }

    // Validate department filter if provided
    if (filters.department) {
      const departmentIds = Array.isArray(filters.department)
        ? filters.department
        : filters.department.split(',')

      for (const id of departmentIds) {
        const departmentId = parseInt(id)
        if (isNaN(departmentId) || departmentId <= 0) {
          throw new ValidationError('Invalid department filter')
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
