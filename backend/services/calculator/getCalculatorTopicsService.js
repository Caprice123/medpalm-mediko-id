import prisma from "../../prisma/client.js"
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
        
        // Transform the response
        const transformedTopics = topics.map(topic => ({
            id: topic.id,
            title: topic.title,
            description: topic.description,
            formula: topic.formula,
            result_label: topic.result_label,
            result_unit: topic.result_unit,
            status: topic.status,
            is_active: topic.is_active,
            fields_count: topic.calculator_fields.length,
            fields: topic.calculator_fields,
            tags: topic.calculator_topic_tags.map(tt => ({
                id: tt.tags.id,
                name: tt.tags.name,
                tag_group_id: tt.tags.tag_group_id,
                tag_group: {
                    id: tt.tags.tag_group?.id,
                    name: tt.tags.tag_group?.name
                }
            })),
            created_by: topic.created_by,
            created_at: topic.created_at,
            updated_at: topic.updated_at
        }))

        return {
            topics: transformedTopics,
            pagination: {
                page: currentPage,
                perPage: itemsPerPage,
                isLastPage: topics.length < itemsPerPage
            }
        }
    }
}
