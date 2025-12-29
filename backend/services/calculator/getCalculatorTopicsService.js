import prisma from '#prisma/client'
import { BaseService } from "../baseService.js"

export class GetCalculatorTopicsService extends BaseService {
    static async call(filters = {}) {
        const { name, tagName, page, perPage } = filters

        // Pagination
        const currentPage = parseInt(page) || 1
        const itemsPerPage = parseInt(perPage) || 20
        const skip = (currentPage - 1) * itemsPerPage

        const where = {}

        // Filter by calculator name (title)
        if (name) {
            where.title = {
                contains: name,
                mode: 'insensitive'
            }
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
            take: itemsPerPage,
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

        return {
            topics,
            pagination: {
                page: currentPage,
                perPage: itemsPerPage,
                isLastPage: topics.length < itemsPerPage
            }
        }
    }
}
