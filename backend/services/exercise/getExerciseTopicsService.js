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

        if (filters.topic) {
            tagFilters.push({
                exercise_topic_tags: {
                    some: {
                        tag_id: parseInt(filters.topic)
                    }
                }
            })
        }

        if (filters.department) {
            tagFilters.push({
                exercise_topic_tags: {
                    some: {
                        tag_id: parseInt(filters.department)
                    }
                }
            })
        }

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

        // Search filter (title and description, using ILIKE with GIN trigram index)
        if (filters.search) {
            const searchTerm = filters.search.trim()
            where.OR = [
                { title: { contains: searchTerm, mode: 'insensitive' } },
                { description: { contains: searchTerm, mode: 'insensitive' } }
            ]
        }

        // Calculate pagination
        const skip = (page - 1) * perPage
        // Fetch perPage + 1 to determine if there's a next page
        const take = perPage + 1

        const topics = await prisma.exercise_topics.findMany({
            where,
            include: {
                exercise_topic_tags: {
                    include: {
                        tags: true
                    }
                }
            },
            orderBy: {
                id: 'desc'
            },
            skip,
            take
        })

        const exerciseConstant = await GetConstantsService.call([
            "exercise_credit_cost",
        ])
        const cost = exerciseConstant.exercise_credit_cost

        // Determine if this is the last page
        const isLastPage = topics.length <= perPage

        // Only return perPage items (exclude the +1 check item)
        const paginatedTopics = topics.slice(0, perPage)

        return {
            topics: paginatedTopics,
            cost,
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
            const topicId = parseInt(filters.topic)
            if (isNaN(topicId) || topicId <= 0) {
                throw new ValidationError('Invalid topic filter')
            }
        }

        // Validate department filter if provided
        if (filters.department) {
            const departmentId = parseInt(filters.department)
            if (isNaN(departmentId) || departmentId <= 0) {
                throw new ValidationError('Invalid department filter')
            }
        }

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
