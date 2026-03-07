import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from "../baseService.js"
import AttachmentService from '#services/attachment/attachmentService'

export class CreateCalculatorTopicService extends BaseService {
    static async call(data) {
        this.validate(data)

        const { title, description, clinical_references, results, classifications, fields, tags, status, created_by } = data

        const topic = await prisma.calculator_topics.create({
            data: {
                title,
                description,
                clinical_references: clinical_references || [],
                status,
                created_by: parseInt(created_by),
                calculator_fields: {
                    createMany: {
                        data: fields.map((field, index) => ({
                            key: field.key,
                            type: field.type,
                            label: field.label,
                            placeholder: field.placeholder,
                            description: field.description || null,
                            unit: field.unit || null,
                            display_conditions: field.display_conditions || null,
                            order: index,
                            is_required: field.is_required !== undefined ? field.is_required : true
                        }))
                    }
                }
            },
            include: {
                calculator_fields: { orderBy: { order: 'asc' }, include: { field_options: { orderBy: { order: 'asc' } } } }
            }
        })

        // Create field options and field images
        for (const field of fields) {
            const dbField = await prisma.calculator_fields.findUnique({
                where: { calculator_topic_id_key: { calculator_topic_id: topic.id, key: field.key } }
            })

            if (dbField) {
                if (field.blobId) {
                    const blobExists = await prisma.blobs.findUnique({ where: { id: parseInt(field.blobId) } })
                    if (blobExists) {
                        await AttachmentService.attach({ blobId: parseInt(field.blobId), recordType: 'calculator_field', recordId: dbField.id, name: 'image' })
                    }
                }

                if ((field.type === 'dropdown' || field.type === 'radio') && field.options?.length) {
                    for (const [optIndex, option] of field.options.entries()) {
                        const createdOption = await prisma.calculator_field_options.create({
                            data: { calculator_field_id: dbField.id, value: option.value, label: option.label, order: optIndex }
                        })
                        if (option.blobId) {
                            const blobExists = await prisma.blobs.findUnique({ where: { id: parseInt(option.blobId) } })
                            if (blobExists) {
                                await AttachmentService.attach({ blobId: parseInt(option.blobId), recordType: 'calculator_field_option', recordId: createdOption.id, name: 'image' })
                            }
                        }
                    }
                }
            }
        }

        // Create results
        if (results && Array.isArray(results)) {
            for (const [resultIndex, result] of results.entries()) {
                await prisma.calculator_results.create({
                    data: {
                        calculator_topic_id: topic.id,
                        key: result.key || `result_${resultIndex}`,
                        formula: result.formula,
                        result_label: result.result_label,
                        result_unit: result.result_unit || null
                    }
                })
            }
        }

        // Create topic-level classifications
        if (classifications && Array.isArray(classifications)) {
            for (const [classIndex, classification] of classifications.entries()) {
                const classifRecord = await prisma.calculator_classifications.create({
                    data: {
                        calculator_topic_id: topic.id,
                        name: classification.name || 'Classification Group',
                        order: classIndex
                    }
                })

                if (classification.options && Array.isArray(classification.options)) {
                    for (const [optIndex, option] of classification.options.entries()) {
                        const optionRecord = await prisma.calculator_classification_options.create({
                            data: {
                                calculator_classification_id: classifRecord.id,
                                value: option.value || 'classification',
                                label: option.label || 'Classification',
                                order: optIndex
                            }
                        })

                        if (option.conditions && Array.isArray(option.conditions)) {
                            await prisma.calculator_classification_option_conditions.createMany({
                                data: option.conditions.map((condition, condIndex) => ({
                                    calculator_classification_option_id: optionRecord.id,
                                    result_key: condition.result_key || 'result',
                                    operator: condition.operator,
                                    value: String(condition.value),
                                    logical_operator: condIndex === option.conditions.length - 1 ? null : (condition.logical_operator || 'AND'),
                                    order: condIndex
                                }))
                            })
                        }
                    }
                }
            }
        }

        // Create tags
        if (tags && Array.isArray(tags) && tags.length > 0) {
            await prisma.calculator_topic_tags.createMany({
                data: tags.map(tag => ({
                    calculator_topic_id: topic.id,
                    tag_id: typeof tag === 'object' ? tag.id : tag
                }))
            })
        }

        return this.refetch(topic.id)
    }

    static async refetch(topicId) {
        const topic = await prisma.calculator_topics.findUnique({
            where: { id: topicId },
            include: {
                calculator_fields: {
                    orderBy: { order: 'asc' },
                    include: { field_options: { orderBy: { order: 'asc' } } }
                },
                calculator_results: {
                    orderBy: { id: 'asc' }
                },
                calculator_classifications: {
                    orderBy: { order: 'asc' },
                    include: {
                        options: {
                            orderBy: { order: 'asc' },
                            include: { conditions: { orderBy: { order: 'asc' } } }
                        }
                    }
                },
                calculator_topic_tags: { include: { tags: true } }
            }
        })

        return {
            id: topic.id,
            title: topic.title,
            description: topic.description,
            clinical_references: topic.clinical_references,
            status: topic.status,
            fields: topic.calculator_fields,
            results: topic.calculator_results,
            classifications: topic.calculator_classifications,
            tags: topic.calculator_topic_tags.map(tt => tt.tags),
            created_by: topic.created_by,
            created_at: topic.created_at,
            updated_at: topic.updated_at
        }
    }

    static validate(data) {
        if (!data.title?.trim()) throw new ValidationError('Title is required')
        if (!Array.isArray(data.fields) || data.fields.length === 0) throw new ValidationError('At least one field is required')
        if (!Array.isArray(data.results) || data.results.length === 0) throw new ValidationError('At least one result is required')

        data.fields.forEach((field, index) => {
            if (!field.key?.trim()) throw new ValidationError(`Field ${index + 1}: key is required`)
            if (!['number', 'text', 'dropdown', 'radio'].includes(field.type)) throw new ValidationError(`Field ${index + 1}: invalid type`)
            if (!field.label?.trim()) throw new ValidationError(`Field ${index + 1}: label is required`)
            if (!field.placeholder?.trim()) throw new ValidationError(`Field ${index + 1}: placeholder is required`)
        })

        data.results.forEach((result, index) => {
            if (!result.formula?.trim()) throw new ValidationError(`Result ${index + 1}: formula is required`)
            if (!result.result_label?.trim()) throw new ValidationError(`Result ${index + 1}: label is required`)
        })
    }
}
