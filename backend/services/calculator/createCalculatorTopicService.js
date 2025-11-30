import { ValidationError } from "../../errors/validationError.js"
import prisma from "../../prisma/client.js"
import { BaseService } from "../baseService.js"

export class CreateCalculatorTopicService extends BaseService {
    static async call(data) {
        this.validate(data)

        const { title, description, formula, result_label, result_unit, fields, classifications, created_by } = data

        const topic = await prisma.calculator_topics.create({
            data: {
                title,
                description,
                formula,
                result_label,
                result_unit,
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
                            order: index,
                            is_required: field.is_required !== undefined ? field.is_required : true
                        }))
                    }
                }
            },
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
            }
        })

        // Create field options for dropdown and radio types
        for (const field of fields) {
            if ((field.type === 'dropdown' || field.type === 'radio') && field.options && Array.isArray(field.options)) {
                const dbField = await prisma.calculator_fields.findUnique({
                    where: {
                        calculator_topic_id_key: {
                            calculator_topic_id: topic.id,
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

        // Create classifications with options and conditions
        if (classifications && Array.isArray(classifications)) {
            for (const [classIndex, classification] of classifications.entries()) {
                // Create classification
                const classifRecord = await prisma.calculator_classifications.create({
                    data: {
                        calculator_topic_id: topic.id,
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
            where: { id: topic.id },
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
        if (!data.title || typeof data.title !== 'string' || data.title.trim() === '') {
            throw new ValidationError('Title is required and must be a non-empty string')
        }

        if (!data.formula || typeof data.formula !== 'string' || data.formula.trim() === '') {
            throw new ValidationError('Formula is required and must be a non-empty string')
        }

        if (!data.result_label || typeof data.result_label !== 'string' || data.result_label.trim() === '') {
            throw new ValidationError('Result label is required and must be a non-empty string')
        }

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

        // Validate that formula contains all field keys
        const formulaStr = data.formula
        data.fields.forEach(field => {
            // Check if the field key is referenced in the formula
            const fieldRegex = new RegExp(`\\b${field.key}\\b`)
            if (!fieldRegex.test(formulaStr)) {
                throw new ValidationError(`Formula must reference field key '${field.key}'`)
            }
        })
    }
}
