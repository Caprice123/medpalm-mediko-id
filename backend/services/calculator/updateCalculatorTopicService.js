import { NotFoundError } from "../../errors/notFoundError.js"
import { ValidationError } from "../../errors/validationError.js"
import prisma from "../../prisma/client.js"
import { BaseService } from "../baseService.js"

export class UpdateCalculatorTopicService extends BaseService {
    static async call(topicId, data) {
        this.validate(data)

        const { title, description, formula, result_label, result_unit, fields, classifications, status, is_active } = data

        // Check if topic exists
        const existingTopic = await prisma.calculator_topics.findUnique({
            where: { id: parseInt(topicId) }
        })

        if (!existingTopic) {
            throw new NotFoundError('Calculator topic not found')
        }

        // Update topic and fields in a transaction
        const topic = await prisma.$transaction(async (tx) => {
            // Update the topic
            const updated = await tx.calculator_topics.update({
                where: { id: parseInt(topicId) },
                data: {
                    title,
                    description,
                    formula,
                    result_label,
                    result_unit,
                    status,
                    is_active
                }
            })

            // Delete existing fields
            await tx.calculator_fields.deleteMany({
                where: { calculator_topic_id: parseInt(topicId) }
            })

            // Delete existing classifications (cascade will delete conditions and options)
            await tx.calculator_classifications.deleteMany({
                where: { calculator_topic_id: parseInt(topicId) }
            })

            // Create new fields
            if (fields && Array.isArray(fields)) {
                await tx.calculator_fields.createMany({
                    data: fields.map((field, index) => ({
                        calculator_topic_id: parseInt(topicId),
                        key: field.key,
                        type: field.type,
                        label: field.label,
                        placeholder: field.placeholder,
                        description: field.description || null,
                        unit: field.unit || null,
                        order: index,
                        is_required: field.is_required !== undefined ? field.is_required : true
                    }))
                })
            }

            // Return updated topic with fields
            return await tx.calculator_topics.findUnique({
                where: { id: parseInt(topicId) },
                include: {
                    calculator_fields: {
                        orderBy: {
                            order: 'asc'
                        }
                    }
                }
            })
        })

        // Create field options for dropdown and radio types
        if (fields && Array.isArray(fields)) {
            for (const field of fields) {
                if ((field.type === 'dropdown' || field.type === 'radio') && field.options && Array.isArray(field.options)) {
                    const dbField = await prisma.calculator_fields.findUnique({
                        where: {
                            calculator_topic_id_key: {
                                calculator_topic_id: parseInt(topicId),
                                key: field.key
                            }
                        }
                    })

                    if (dbField) {
                        await prisma.calculator_field_options.createMany({
                            data: field.options.map((option, optIndex) => ({
                                calculator_field_id: dbField.id,
                                value: option.value,
                                label: option.label,
                                order: optIndex
                            }))
                        })
                    }
                }
            }
        }

        // Create classifications with options and conditions
        if (classifications && Array.isArray(classifications)) {
            for (const [classIndex, classification] of classifications.entries()) {
                // Create classification
                const classifRecord = await prisma.calculator_classifications.create({
                    data: {
                        calculator_topic_id: parseInt(topicId),
                        name: classification.name || classification.label || 'Classification Group',
                        order: classIndex
                    }
                })

                // Create options for this classification
                if (classification.options && Array.isArray(classification.options)) {
                    for (const [optIndex, option] of classification.options.entries()) {
                        // Create the option
                        const optionRecord = await prisma.calculator_classification_options.create({
                            data: {
                                calculator_classification_id: classifRecord.id,
                                value: option.value || 'classification',
                                label: option.label || 'Classification',
                                order: optIndex
                            }
                        })

                        // Create conditions for this option
                        if (option.conditions && Array.isArray(option.conditions)) {
                            // Auto-set last condition's logical_operator to null
                            const conditionsData = option.conditions.map((condition, condIndex) => {
                                const isLastCondition = condIndex === option.conditions.length - 1
                                return {
                                    calculator_classification_option_id: optionRecord.id,
                                    result_key: condition.result_key || 'result',
                                    operator: condition.operator,
                                    value: String(condition.value),
                                    logical_operator: isLastCondition ? null : (condition.logical_operator || 'AND'),
                                    order: condIndex
                                }
                            })

                            await prisma.calculator_classification_option_conditions.createMany({
                                data: conditionsData
                            })
                        }
                    }
                }
            }
        }

        // Refetch with all relations
        const finalTopic = await prisma.calculator_topics.findUnique({
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
                }
            }
        })

        return {
            id: finalTopic.id,
            title: finalTopic.title,
            description: finalTopic.description,
            formula: finalTopic.formula,
            result_label: finalTopic.result_label,
            result_unit: finalTopic.result_unit,
            status: finalTopic.status,
            is_active: finalTopic.is_active,
            fields: finalTopic.calculator_fields,
            classifications: finalTopic.calculator_classifications,
            created_by: finalTopic.created_by,
            created_at: finalTopic.created_at,
            updated_at: finalTopic.updated_at
        }
    }

    static validate(data) {
        if (data.title !== undefined) {
            if (typeof data.title !== 'string' || data.title.trim() === '') {
                throw new ValidationError('Title must be a non-empty string')
            }
        }

        if (data.formula !== undefined) {
            if (typeof data.formula !== 'string' || data.formula.trim() === '') {
                throw new ValidationError('Formula must be a non-empty string')
            }
        }

        if (data.result_label !== undefined) {
            if (typeof data.result_label !== 'string' || data.result_label.trim() === '') {
                throw new ValidationError('Result label must be a non-empty string')
            }
        }

        if (data.status !== undefined) {
            if (!['draft', 'published'].includes(data.status)) {
                throw new ValidationError('Status must be either "draft" or "published"')
            }
        }

        if (data.is_active !== undefined) {
            if (typeof data.is_active !== 'boolean') {
                throw new ValidationError('is_active must be a boolean')
            }
        }

        if (data.fields !== undefined) {
            if (!Array.isArray(data.fields) || data.fields.length === 0) {
                throw new ValidationError('At least one field is required')
            }

            // Validate each field
            data.fields.forEach((field, index) => {
                if (!field.key || typeof field.key !== 'string' || field.key.trim() === '') {
                    throw new ValidationError(`Field ${index + 1}: key is required and must be a non-empty string`)
                }

                if (!field.type || !['number', 'text', 'dropdown', 'radio'].includes(field.type)) {
                    throw new ValidationError(`Field ${index + 1}: type must be 'number', 'text', 'dropdown', or 'radio'`)
                }

                if (!field.label || typeof field.label !== 'string' || field.label.trim() === '') {
                    throw new ValidationError(`Field ${index + 1}: label is required and must be a non-empty string`)
                }

                if (!field.placeholder || typeof field.placeholder !== 'string' || field.placeholder.trim() === '') {
                    throw new ValidationError(`Field ${index + 1}: placeholder is required and must be a non-empty string`)
                }
            })

            // Validate that formula contains all field keys if both formula and fields are provided
            if (data.formula) {
                const formulaStr = data.formula
                data.fields.forEach(field => {
                    const fieldRegex = new RegExp(`\\b${field.key}\\b`)
                    if (!fieldRegex.test(formulaStr)) {
                        throw new ValidationError(`Formula must reference field key '${field.key}'`)
                    }
                })
            }
        }
    }
}
