import { NotFoundError } from '#errors/notFoundError'
import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from "../baseService.js"
import AttachmentService from '#services/attachment/attachmentService'
import { CreateCalculatorTopicService } from './createCalculatorTopicService.js'

export class UpdateCalculatorTopicService extends BaseService {
    static async call(topicId, data) {
        this.validate(data)

        const { title, description, clinical_references, results, classifications, fields, tags, status } = data

        const existingTopic = await prisma.calculator_topics.findUnique({ where: { unique_id: topicId } })
        if (!existingTopic) throw new NotFoundError('Calculator topic not found')

        await prisma.$transaction(async (tx) => {
            // Update topic
            await tx.calculator_topics.update({
                where: { unique_id: topicId },
                data: { title, description, clinical_references: clinical_references ?? undefined, status, updated_at: new Date() }
            })

            // Detach + delete existing field options and field images
            const existingFields = await tx.calculator_fields.findMany({
                where: { calculator_topic_id: existingTopic.id },
                include: { field_options: true }
            })
            for (const field of existingFields) {
                await AttachmentService.detachAll({ recordType: 'calculator_field', recordId: field.id }, false)
                for (const option of field.field_options) {
                    await AttachmentService.detachAll({ recordType: 'calculator_field_option', recordId: option.id }, false)
                }
            }
            const fieldIds = existingFields.map(f => f.id)
            if (fieldIds.length > 0) {
                await tx.calculator_field_options.deleteMany({ where: { calculator_field_id: { in: fieldIds } } })
            }
            await tx.calculator_fields.deleteMany({ where: { calculator_topic_id: existingTopic.id } })

            // Delete existing results
            await tx.calculator_results.deleteMany({ where: { calculator_topic_id: existingTopic.id } })

            // Delete existing classifications (bottom-up)
            const existingClassifications = await tx.calculator_classifications.findMany({
                where: { calculator_topic_id: existingTopic.id },
                include: { options: { select: { id: true } } }
            })
            for (const classif of existingClassifications) {
                const optIds = classif.options.map(o => o.id)
                if (optIds.length > 0) {
                    await tx.calculator_classification_option_conditions.deleteMany({
                        where: { calculator_classification_option_id: { in: optIds } }
                    })
                    await tx.calculator_classification_options.deleteMany({ where: { id: { in: optIds } } })
                }
            }
            await tx.calculator_classifications.deleteMany({ where: { calculator_topic_id: existingTopic.id } })

            // Delete tags
            await tx.calculator_topic_tags.deleteMany({ where: { calculator_topic_id: existingTopic.id } })

            // Create new fields
            if (fields?.length) {
                await tx.calculator_fields.createMany({
                    data: fields.map((field, index) => ({
                        calculator_topic_id: existingTopic.id,
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
                })
            }
        })

        // Create field options and images (outside transaction for AttachmentService)
        if (fields?.length) {
            for (const field of fields) {
                const dbField = await prisma.calculator_fields.findUnique({
                    where: { calculator_topic_id_key: { calculator_topic_id: existingTopic.id, key: field.key } }
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
        }

        // Create results and their classifications
        if (results?.length) {
            for (const [resultIndex, result] of results.entries()) {
                const dbResult = await prisma.calculator_results.create({
                    data: {
                        calculator_topic_id: existingTopic.id,
                        key: result.key || `result_${resultIndex}`,
                        formula: result.formula,
                        result_label: result.result_label,
                        result_unit: result.result_unit || null,
                        conditional_formulas: result.conditional_formulas?.length ? result.conditional_formulas : undefined
                    }
                })

                if (result.classifications?.length) {
                    for (const [classIndex, classification] of result.classifications.entries()) {
                        const classifRecord = await prisma.calculator_classifications.create({
                            data: {
                                calculator_topic_id: existingTopic.id,
                                result_id: dbResult.id,
                                name: classification.name || 'Classification Group',
                                order: classIndex
                            }
                        })

                        if (classification.options?.length) {
                            for (const [optIndex, option] of classification.options.entries()) {
                                const optionRecord = await prisma.calculator_classification_options.create({
                                    data: {
                                        calculator_classification_id: classifRecord.id,
                                        value: option.value || 'classification',
                                        label: option.label || 'Classification',
                                        order: optIndex
                                    }
                                })

                                if (option.conditions?.length) {
                                    await prisma.calculator_classification_option_conditions.createMany({
                                        data: option.conditions.map((condition, condIndex) => ({
                                            calculator_classification_option_id: optionRecord.id,
                                            result_key: condition.result_key || dbResult.key,
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
            }
        }

        // Create topic-level classifications
        if (classifications?.length) {
            for (const [classIndex, classification] of classifications.entries()) {
                const classifRecord = await prisma.calculator_classifications.create({
                    data: {
                        calculator_topic_id: existingTopic.id,
                        name: classification.name || 'Classification Group',
                        order: classIndex
                    }
                })

                if (classification.options?.length) {
                    for (const [optIndex, option] of classification.options.entries()) {
                        const optionRecord = await prisma.calculator_classification_options.create({
                            data: {
                                calculator_classification_id: classifRecord.id,
                                value: option.value || 'classification',
                                label: option.label || 'Classification',
                                order: optIndex
                            }
                        })

                        if (option.conditions?.length) {
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
        if (tags?.length) {
            await prisma.calculator_topic_tags.createMany({
                data: tags.map(tag => ({
                    calculator_topic_id: existingTopic.id,
                    tag_id: typeof tag === 'object' ? tag.id : tag
                }))
            })
        }

        return CreateCalculatorTopicService.refetch(existingTopic.id)
    }

    static validate(data) {
        if (data.title !== undefined && !data.title?.trim()) throw new ValidationError('Title must be a non-empty string')
        if (data.status !== undefined && !['draft', 'published'].includes(data.status)) throw new ValidationError('Status must be "draft" or "published"')

        if (data.fields !== undefined) {
            if (!Array.isArray(data.fields) || data.fields.length === 0) throw new ValidationError('At least one field is required')
            data.fields.forEach((field, index) => {
                if (!field.key?.trim()) throw new ValidationError(`Field ${index + 1}: key is required`)
                if (!['number', 'text', 'dropdown', 'radio'].includes(field.type)) throw new ValidationError(`Field ${index + 1}: invalid type`)
                if (!field.label?.trim()) throw new ValidationError(`Field ${index + 1}: label is required`)
                if (!field.placeholder?.trim()) throw new ValidationError(`Field ${index + 1}: placeholder is required`)
            })
        }

        if (data.results !== undefined) {
            if (!Array.isArray(data.results) || data.results.length === 0) throw new ValidationError('At least one result is required')
            data.results.forEach((result, index) => {
                if (!result.formula?.trim()) throw new ValidationError(`Result ${index + 1}: formula is required`)
                if (!result.result_label?.trim()) throw new ValidationError(`Result ${index + 1}: label is required`)
            })
        }
    }
}
