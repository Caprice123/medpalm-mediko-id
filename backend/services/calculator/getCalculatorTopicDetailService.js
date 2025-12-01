import { NotFoundError } from "../../errors/notFoundError.js"
import prisma from "../../prisma/client.js"
import { BaseService } from "../baseService.js"

export class GetCalculatorTopicDetailService extends BaseService {
    static async call(topicId) {
        const topic = await prisma.calculator_topics.findUnique({
            where: { id: parseInt(topicId) },
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
                calculator_classifications: {
                    orderBy: {
                        order: 'asc'
                    },
                    include: {
                        options: {
                            orderBy: {
                                order: 'asc'
                            },
                            include: {
                                conditions: {
                                    orderBy: {
                                        order: 'asc'
                                    }
                                }
                            }
                        }
                    }
                },
                calculator_topic_tags: {
                    include: {
                        tags: true
                    }
                }
            }
        })

        if (!topic) {
            throw new NotFoundError('Calculator topic not found')
        }

        // Transform fields structure for frontend compatibility
        const fields = topic.calculator_fields.map(field => ({
            key: field.key,
            type: field.type,
            label: field.label,
            placeholder: field.placeholder,
            description: field.description,
            unit: field.unit,
            is_required: field.is_required,
            options: field.field_options.map(opt => ({
                value: opt.value,
                label: opt.label
            }))
        }))

        // Transform classifications structure for frontend compatibility
        const classifications = topic.calculator_classifications.map(classification => ({
            name: classification.name,
            options: classification.options.map(opt => ({
                value: opt.value,
                label: opt.label,
                conditions: opt.conditions.map(cond => ({
                    result_key: cond.result_key,
                    operator: cond.operator,
                    value: cond.value,
                    logical_operator: cond.logical_operator
                }))
            }))
        }))

        // Transform tags
        const tags = topic.calculator_topic_tags.map(tt => tt.tags)

        return {
            id: topic.id,
            title: topic.title,
            description: topic.description,
            clinical_references: topic.clinical_references,
            formula: topic.formula,
            result_label: topic.result_label,
            result_unit: topic.result_unit,
            status: topic.status,
            fields,
            classifications,
            tags,
            created_by: topic.created_by,
            created_at: topic.created_at,
            updated_at: topic.updated_at
        }
    }
}
