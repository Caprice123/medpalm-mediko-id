import prisma from "../../prisma/client.js"
import { BaseService } from "../baseService.js"

export class GetCalculatorTopicsService extends BaseService {
    static async call() {
        const topics = await prisma.calculator_topics.findMany({
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
            created_by: topic.created_by,
            created_at: topic.created_at,
            updated_at: topic.updated_at
        }))

        return transformedTopics
    }
}
