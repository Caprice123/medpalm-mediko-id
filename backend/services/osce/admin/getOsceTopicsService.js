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

        const where = {}

        if (filters.status) {
            where.status = filters.status
        }

        if (filters.search) {
            where.title = {
                contains: filters.search,
                mode: 'insensitive'
            }
        }

        // Build filter conditions for tags
        const tagFilters = []

        if (filters.topic) {
            tagFilters.push({
                osce_topic_tags: {
                    some: {
                        tag_id: parseInt(filters.topic)
                    }
                }
            })
        }

        if (filters.batch) {
            tagFilters.push({
                osce_topic_tags: {
                    some: {
                        tag_id: parseInt(filters.batch)
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
        if (filters.topic) {
            const topicId = parseInt(filters.topic)
            if (isNaN(topicId) || topicId <= 0) {
                throw new ValidationError('Invalid topic filter')
            }
        }

        if (filters.batch) {
            const batchId = parseInt(filters.batch)
            if (isNaN(batchId) || batchId <= 0) {
                throw new ValidationError('Invalid batch filter')
            }
        }

        if (filters.status && !['draft', 'published'].includes(filters.status)) {
            throw new ValidationError('Status must be either "draft" or "published"')
        }
    }
}
