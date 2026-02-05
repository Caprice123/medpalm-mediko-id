import { NotFoundError } from '#errors/notFoundError'
import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from "../baseService.js"

export class CalculateResultService extends BaseService {
    static async call(topicId, inputs) {
        // Fetch the calculator topic with fields and classifications
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
                }
            }
        })

        if (!topic) {
            throw new NotFoundError('Calculator topic not found')
        }

        // Validate all required fields are provided
        this.validateInputs(inputs, topic.calculator_fields)

        // Build the calculation context
        const context = {}
        topic.calculator_fields.forEach(field => {
            const isVisible = this.shouldDisplayField(field, inputs)
            const inputValue = inputs[field.key]

            // For hidden fields or fields without values, use default value of 0
            if (!isVisible || inputValue === undefined || inputValue === null || inputValue === '') {
                context[field.key] = 0
                return
            }

            if (field.type === 'number') {
                context[field.key] = parseFloat(inputValue)
            } else {
                // For dropdown/radio fields, try to parse as number if value is numeric
                const numValue = parseFloat(inputValue)
                if (!isNaN(numValue) && String(inputValue).trim() !== '') {
                    context[field.key] = numValue
                } else {
                    context[field.key] = String(inputValue)
                }
            }
        })

        // Evaluate the formula safely
        let result
        try {
            // Create a safe function that only has access to the context variables
            const formula = topic.formula

            // Use Function constructor with only the context variables as parameters
            const keys = Object.keys(context)
            const values = Object.values(context)

            // Add Math object for mathematical operations
            const mathFunc = new Function(...keys, 'Math', `return ${formula}`)
            result = mathFunc(...values, Math)

            // Validate result is a number
            if (typeof result !== 'number' || isNaN(result)) {
                console.error('Formula evaluation error:', {
                    formula,
                    context,
                    result,
                    resultType: typeof result
                })
                throw new ValidationError(`Formula calculation resulted in an invalid number. Result: ${result}, Type: ${typeof result}`)
            }
        } catch (error) {
            if (error instanceof ValidationError) {
                throw error
            }
            console.error('Formula calculation error:', {
                formula: topic.formula,
                context,
                error: error.message
            })
            throw new ValidationError(`Formula calculation error: ${error.message}`)
        }

        // Evaluate classifications - return ALL matching options
        const evaluatedClassifications = []
        if (topic.calculator_classifications && topic.calculator_classifications.length > 0) {
            for (const classification of topic.calculator_classifications) {
                const matchedOptions = []

                // Evaluate each option in this classification
                if (classification.options && classification.options.length > 0) {
                    for (const option of classification.options) {
                        if (this.evaluateOption(option, result)) {
                            matchedOptions.push(option.value)
                        }
                    }
                }

                // Only include classification if at least one option matched
                if (matchedOptions.length > 0) {
                    evaluatedClassifications.push({
                        name: classification.name,
                        matched_options: matchedOptions
                    })
                }
            }
        }

        return {
            calculator_topic_id: topic.id,
            topic_title: topic.title,
            formula: topic.formula,
            inputs: context,
            result: result,
            result_label: topic.result_label,
            result_unit: topic.result_unit,
            classifications: evaluatedClassifications,
            calculated_at: new Date()
        }
    }

    static evaluateOption(option, resultValue) {
        if (!option.conditions || option.conditions.length === 0) {
            return false
        }

        // Evaluate all conditions for this option
        let conditionsMet = true
        let logicalOp = 'AND'

        for (const condition of option.conditions) {
            const met = this.evaluateCondition(resultValue, condition.operator, condition.value)

            if (logicalOp === 'OR') {
                conditionsMet = conditionsMet || met
            } else {
                conditionsMet = conditionsMet && met
            }

            // Store the next logical operator
            if (condition.logical_operator) {
                logicalOp = condition.logical_operator.toUpperCase()
            }
        }

        return conditionsMet
    }

    static evaluateCondition(resultValue, operator, conditionValue) {
        const value = parseFloat(conditionValue)
        const result = parseFloat(resultValue)

        switch (operator) {
            case '>':
                return result > value
            case '<':
                return result < value
            case '>=':
                return result >= value
            case '<=':
                return result <= value
            case '==':
                return result === value
            case '!=':
                return result !== value
            default:
                return false
        }
    }

    static shouldDisplayField(field, inputs) {
        // If no display conditions, always show
        if (!field.display_conditions || field.display_conditions.length === 0) {
            return true
        }

        let result = true
        for (let i = 0; i < field.display_conditions.length; i++) {
            const condition = field.display_conditions[i]
            const inputValue = inputs[condition.field_key]

            let conditionMet = false
            const condValue = condition.value

            switch (condition.operator) {
                case '==':
                    conditionMet = String(inputValue) === String(condValue)
                    break
                case '!=':
                    conditionMet = String(inputValue) !== String(condValue)
                    break
                case '>':
                    conditionMet = parseFloat(inputValue) > parseFloat(condValue)
                    break
                case '<':
                    conditionMet = parseFloat(inputValue) < parseFloat(condValue)
                    break
                case '>=':
                    conditionMet = parseFloat(inputValue) >= parseFloat(condValue)
                    break
                case '<=':
                    conditionMet = parseFloat(inputValue) <= parseFloat(condValue)
                    break
                default:
                    conditionMet = false
            }

            if (i === 0) {
                result = conditionMet
            } else {
                const prevLogicalOperator = field.display_conditions[i - 1].logical_operator
                if (prevLogicalOperator === 'AND') {
                    result = result && conditionMet
                } else if (prevLogicalOperator === 'OR') {
                    result = result || conditionMet
                }
            }
        }

        return result
    }

    static validateInputs(inputs, fields) {
        if (!inputs || typeof inputs !== 'object') {
            throw new ValidationError('Inputs must be provided as an object')
        }

        // Check all required fields are provided - but only for visible fields
        fields.forEach(field => {
            // Only validate if field should be displayed
            if (!this.shouldDisplayField(field, inputs)) {
                return
            }

            if (field.is_required) {
                if (!(field.key in inputs) || inputs[field.key] === null || inputs[field.key] === '') {
                    throw new ValidationError(`Field '${field.label}' is required`)
                }
            }

            if (field.key in inputs && inputs[field.key] !== '' && inputs[field.key] !== null) {
                if (field.type === 'number') {
                    const numValue = parseFloat(inputs[field.key])
                    if (isNaN(numValue)) {
                        throw new ValidationError(`Field '${field.label}' must be a valid number`)
                    }
                }
            }
        })
    }
}
