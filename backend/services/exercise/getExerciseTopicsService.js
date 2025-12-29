import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from "../baseService.js"
import { GetConstantsService } from "../constant/getConstantsService.js"

export class GetExerciseTopicsService extends BaseService {
    static async call(filters = {}, page = 1, perPage = 20) {
        this.validate(filters)

        const where = {}

        // Build filter conditions for tags
        const tagFilters = []

        if (filters.university) {
            tagFilters.push({
                exercise_topic_tags: {
                    some: {
                        tag_id: parseInt(filters.university)
                    }
                }
            })
        }

        if (filters.semester) {
            tagFilters.push({
                exercise_topic_tags: {
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

        // Calculate pagination
        const skip = (page - 1) * perPage
        const take = perPage

        const topics = await prisma.exercise_topics.findMany({
            where,
            include: {
                exercise_topic_tags: {
                    include: {
                        tags: true
                    }
                },
                exercise_questions: {
                    select: {
                        id: true
                    }
                }
            },
            orderBy: {
                created_at: 'desc'
            },
            skip,
            take
        })

        const exerciseConstant = await GetConstantsService.call([
            "exercise_credit_cost",
        ])
        const cost = exerciseConstant.exercise_credit_cost


        return {
            topics,
            cost,
            pagination: {
                page,
                perPage,
                isLastPage: topics.length < perPage || topics.length == 0
            }
        }
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
