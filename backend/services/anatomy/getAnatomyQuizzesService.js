import { ValidationError } from '../../errors/validationError.js'
import prisma from '../../prisma/client.js'
import { BaseService } from '../baseService.js'
import { GetConstantsService } from '../constant/getConstantsService.js'
import idriveService from '../idrive.service.js'

export class GetAnatomyQuizzesService extends BaseService {
  static async call(filters = {}) {
    this.validate(filters)

    const where = {
      is_active: true,
      status: 'published' // Only show published quizzes to users
    }

    // Build filter conditions for tags
    const tagFilters = []

    if (filters.university) {
      tagFilters.push({
        anatomy_quiz_tags: {
          some: {
            tag_id: parseInt(filters.university)
          }
        }
      })
    }

    if (filters.semester) {
      tagFilters.push({
        anatomy_quiz_tags: {
          some: {
            tag_id: parseInt(filters.semester)
          }
        }
      })
    }

    // Apply tag filters with AND logic
    if (tagFilters.length > 0) {
      where.AND = tagFilters
    }

    const quizzes = await prisma.anatomy_quizzes.findMany({
      where,
      include: {
        anatomy_quiz_tags: {
          include: {
            tags: true
          }
        },
        anatomy_questions: {
          select: {
            id: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    })

    // Get cost from constants
    const anatomyConstant = await GetConstantsService.call(['anatomy_quiz_cost'])
    const cost = anatomyConstant.anatomy_quiz_cost

    // Transform the response to match frontend expectations
    const transformedQuizzes = await Promise.all(quizzes.map(async (quiz) => ({
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      image_url: await idriveService.getSignedUrl(quiz.image_key),
      cost: parseInt(cost),
      tags: quiz.anatomy_quiz_tags.map(t => ({
        id: t.tags.id,
        name: t.tags.name,
        tagGroupId: t.tags.tag_group_id
      })),
      questionCount: quiz.anatomy_questions.length,
      createdAt: quiz.created_at,
      updatedAt: quiz.updated_at
    })))

    return transformedQuizzes
  }

  static validate(filters) {
    // Validate university filter if provided
    if (filters.university) {
      const universityId = parseInt(filters.university)
      if (isNaN(universityId) || universityId <= 0) {
        throw new ValidationError('Invalid university filter')
      }
    }

    // Validate semester filter if provided
    if (filters.semester) {
      const semesterId = parseInt(filters.semester)
      if (isNaN(semesterId) || semesterId <= 0) {
        throw new ValidationError('Invalid semester filter')
      }
    }
  }
}
