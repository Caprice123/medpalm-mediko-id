import prisma from '#prisma/client'
import { BaseService } from "../baseService.js"

export class GetCalculatorTopicsService extends BaseService {
    static async call(filters = {}) {
        const { search, tagName, page, perPage } = filters

        // Pagination
        const currentPage = parseInt(page) || 1
        const itemsPerPage = parseInt(perPage) || 20
        const skip = (currentPage - 1) * itemsPerPage
        // Fetch perPage + 1 to determine if there's a next page
        const take = itemsPerPage + 1

        const where = {}

        // Search filter (title and description, using ILIKE with GIN trigram index)
        if (search) {
            const searchTerm = search.trim()
            where.OR = [
                { title: { contains: searchTerm, mode: 'insensitive' } },
                { description: { contains: searchTerm, mode: 'insensitive' } }
            ]
        }

        // Filter by tag name
        if (tagName) {
            where.calculator_topic_tags = {
                some: {
                    tags: {
                        name: {
                            contains: tagName,
                            mode: 'insensitive'
                        }
                    }
                }
            }
        }

        const topics = await prisma.calculator_topics.findMany({
            skip,
            take,
            where,
            include: {
                calculator_fields: {
                    orderBy: {
                        order: 'asc'
                    },
                    include: {
                        field_options: {
                            orderBy: {
                                order: 'asc'
                            }
                        }
                    }
                },
                calculator_topic_tags: {
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
                created_at: 'desc'
            }
        })

        // Determine if this is the last page
        const isLastPage = topics.length <= itemsPerPage

        // Only return perPage items (exclude the +1 check item)
        const paginatedTopics = topics.slice(0, itemsPerPage)

        return {
            topics: paginatedTopics,
            pagination: {
                page: currentPage,
                perPage: itemsPerPage,
                isLastPage
            }
        }
    }
}
