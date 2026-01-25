import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from "#services/baseService"

export class GetOsceTopicsService extends BaseService {
    static async call(filters = {}) {
        this.validate(filters)

        // Pagination
        const page = parseInt(filters.page) || 1
        const perPage = parseInt(filters.perPage) || 20
        const skip = (page - 1) * perPage

        const where = {
            is_active: true
        }

        if (filters.status) {
            where.status = filters.status
        }

        // Build filter conditions for tags
        const tagFilters = []

        if (filters.university) {
            tagFilters.push({
                osce_topic_tags: {
                    some: {
                        tag_id: parseInt(filters.university)
                    }
                }
            })
        }

        if (filters.semester) {
            tagFilters.push({
                osce_topic_tags: {
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

        const topics = await prisma.osce_topics.findMany({
            skip,
            take: perPage,
            where,
            include: {
                osce_topic_tags: {
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

        return {
            topics: topics,
            pagination: {
                page,
                perPage,
                isLastPage: topics.length < perPage
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

        // Validate status filter if provided
        if (filters.status && !['draft', 'published'].includes(filters.status)) {
            throw new ValidationError('Status must be either "draft" or "published"')
        }
    }
}
