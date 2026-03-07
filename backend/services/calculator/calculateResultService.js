import { NotFoundError } from '#errors/notFoundError'
import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from "../baseService.js"

export class CalculateResultService extends BaseService {
    static async call(topicId, inputs) {
        // Fetch the calculator topic with fields, results and their classifications
        const topic = await prisma.calculator_topics.findUnique({
            where: { unique_id: topicId },
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

        // Topologically sort results so dependencies are evaluated first
        const sortedResults = this.sortResultsByDependency(topic.calculator_results || [])

        // Evaluate each result formula and build a resultValues map
        // Each result can reference previously computed results by their key
        const resultValues = {}

        for (const resultDef of sortedResults) {
            try {
                // Merge input fields + already-computed results so each result can depend on prior ones
                const evalContext = { ...context, ...resultValues }
                const evalKeys = Object.keys(evalContext)
                const evalValues = Object.values(evalContext)

                // Pick first matching conditional formula, fallback to default
                let formulaToUse = resultDef.formula
                if (Array.isArray(resultDef.conditional_formulas) && resultDef.conditional_formulas.length > 0) {
                    for (const cf of resultDef.conditional_formulas) {
                        if (this.evaluateFieldConditions(cf.conditions || [], evalContext)) {
                            formulaToUse = cf.formula
                            break
                        }
                    }
                }

                const mathFunc = new Function(...evalKeys, 'Math', `return ${formulaToUse}`)
                const value = mathFunc(...evalValues, Math)
                if (typeof value !== 'number' || isNaN(value)) {
                    throw new Error(`Result '${resultDef.key}' formula produced an invalid number`)
                }
                resultValues[resultDef.key] = value
            } catch (error) {
                if (error instanceof ValidationError) throw error
                throw new Error(`Result '${resultDef.key}' formula error: ${error.message}`)
            }
        }

        // Build results array
        const evaluatedResults = (topic.calculator_results || []).map(resultDef => ({
            key: resultDef.key,
            result: resultValues[resultDef.key],
            result_label: resultDef.result_label,
            result_unit: resultDef.result_unit
        }))

        // Evaluate topic-level classifications against all resultValues
        const evaluatedClassifications = []
        for (const classification of (topic.calculator_classifications || [])) {
            const matchedOptions = []
            for (const option of (classification.options || [])) {
                if (this.evaluateOption(option, resultValues)) {
                    matchedOptions.push(option.value)
                }
            }
            evaluatedClassifications.push({
                name: classification.name,
                matched_options: matchedOptions
            })
        }

        return {
            calculator_topic_id: topic.id,
            topic_title: topic.title,
            inputs: context,
            results: evaluatedResults,
            classifications: evaluatedClassifications,
            calculated_at: new Date()
        }
    }

    static evaluateOption(option, resultValues) {
        if (!option.conditions || option.conditions.length === 0) {
            return false
        }

        // Evaluate all conditions for this option
        let conditionsMet = true
        let logicalOp = 'AND'

        for (const condition of option.conditions) {
            // Look up the specific result value for this condition's result_key
            const resultValue = typeof resultValues === 'object' && !Array.isArray(resultValues)
                ? (resultValues[condition.result_key] ?? resultValues['result'] ?? 0)
                : resultValues
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

    // Topological sort — results that others depend on come first
    static sortResultsByDependency(results) {
        const allKeys = new Set(results.map(r => r.key))
        const resultByKey = Object.fromEntries(results.map(r => [r.key, r]))

        // Find which result keys appear in a formula string (word-boundary match)
        const getDeps = (formula) => {
            const deps = new Set()
            for (const key of allKeys) {
                if (new RegExp(`\\b${key}\\b`).test(formula)) deps.add(key)
            }
            return deps
        }

        // Build full dep set per result (including conditional formulas)
        const deps = {}
        for (const r of results) {
            const d = getDeps(r.formula)
            for (const cf of (r.conditional_formulas || [])) {
                for (const k of getDeps(cf.formula || '')) d.add(k)
            }
            d.delete(r.key) // no self-reference
            deps[r.key] = d
        }

        // DFS topological sort
        const sorted = []
        const visited = new Set()
        const visit = (key) => {
            if (visited.has(key)) return
            visited.add(key)
            for (const dep of (deps[key] || [])) {
                if (resultByKey[dep]) visit(dep)
            }
            sorted.push(resultByKey[key])
        }
        for (const r of results) visit(r.key)

        return sorted
    }

    // Evaluate conditions against input field values (for conditional formula selection)
    static evaluateFieldConditions(conditions, context) {
        if (!conditions || conditions.length === 0) return false

        let result = true
        let logicalOp = 'AND'

        for (const condition of conditions) {
            const fieldValue = context[condition.field_key]
            const met = this.evaluateCondition(
                typeof fieldValue === 'number' ? fieldValue : String(fieldValue ?? ''),
                condition.operator,
                condition.value
            )

            if (logicalOp === 'OR') {
                result = result || met
            } else {
                result = result && met
            }

            if (condition.logical_operator) {
                logicalOp = condition.logical_operator.toUpperCase()
            }
        }

        return result
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
                if (field.type === 'number' || field.type === 'multiselect') {
                    const numValue = parseFloat(inputs[field.key])
                    if (isNaN(numValue)) {
                        throw new ValidationError(`Field '${field.label}' must be a valid number`)
                    }
                }
            }
        })
    }
}
