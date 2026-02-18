import React, { useEffect, useState, useMemo } from 'react'
import {
  Container,
  Content,
  CalculatorForm,
  InputsSection,
} from './Detail.styles'
import Button from '@components/common/Button'
import { useDispatch, useSelector } from 'react-redux'
import { calculateResult, getCalculatorTopicDetail } from '../../../../store/calculator/userAction'
import { useParams } from 'react-router-dom'
import { Col, Row } from '../../../../components/common/Grid/Grid.styles'
import CalculatorHeader from './CalculatorHeader'
import CalculatorField from './CalculatorField'
import CalculatorResult from './CalculatorResult'


const CalculatorDetail = () => {
    const dispatch = useDispatch()

    const { id } = useParams()
    const { detail, loading } = useSelector(state => state.calculator)
    const [inputs, setInputs] = useState({}) // Stores full option objects for dropdown/radio, raw values for text/number
    const [formErrors, setFormErrors] = useState({})

    // Calculation state
    const [result, setResult] = useState(null)

    // Filter tags by tag group
    const categoryTags = useMemo(() => {
        return (detail?.tags || []).filter(tag => tag.tagGroupId === 3)
    }, [detail?.tags])

    useEffect(() => {
        dispatch(getCalculatorTopicDetail(id))
    }, [dispatch, id])

    // Clear hidden field values when inputs change
    useEffect(() => {
        if (!detail?.calculator_fields) return

        const visibleFieldKeys = detail.calculator_fields
            .filter(shouldDisplayField)
            .map(field => field.key)

        // Remove inputs for hidden fields
        setInputs(prev => {
            const newInputs = { ...prev }
            Object.keys(newInputs).forEach(key => {
                if (!visibleFieldKeys.includes(key)) {
                    delete newInputs[key]
                }
            })
            return newInputs
        })
    }, [detail?.calculator_fields, inputs])

    // Evaluate display conditions for a field
    const shouldDisplayField = (field) => {
        if (!field.display_conditions || field.display_conditions.length === 0) {
            return true // No conditions means always show
        }

        let result = true
        for (let i = 0; i < field.display_conditions.length; i++) {
            const condition = field.display_conditions[i]
            const input = inputs[condition.field_key]
            const value = typeof input === 'object' && input !== null ? input.value : input

            let conditionMet = false
            const condValue = condition.value

            switch (condition.operator) {
                case '==':
                    conditionMet = String(value) === String(condValue)
                    break
                case '!=':
                    conditionMet = String(value) !== String(condValue)
                    break
                case '>':
                    conditionMet = parseFloat(value) > parseFloat(condValue)
                    break
                case '<':
                    conditionMet = parseFloat(value) < parseFloat(condValue)
                    break
                case '>=':
                    conditionMet = parseFloat(value) >= parseFloat(condValue)
                    break
                case '<=':
                    conditionMet = parseFloat(value) <= parseFloat(condValue)
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


    const handleInputChange = (name, value) => {
        setInputs(prev => ({
          ...prev,
          [name]: value
        }))

        // Clear error for this field when user changes value
        if (formErrors[name]) {
          setFormErrors(prev => ({
            ...prev,
            [name]: ''
          }))
        }
    }

    const validateInputs = () => {
        const errors = {}

        if (!detail) return false

        // Only validate visible fields
        detail.calculator_fields.filter(shouldDisplayField).forEach(field => {
          const input = inputs[field.key]
          // Extract value from object or use raw value
          const value = typeof input === 'object' && input !== null ? input.value : input

          if (field.is_required && (!value || (typeof value === 'string' && value.trim() === ''))) {
            errors[field.key] = `${field.label} is required`
          } else if (value && field.type === 'number') {
            const numValue = parseFloat(value)
            if (isNaN(numValue)) {
              errors[field.key] = `${field.label} must be a valid number`
            }
          }
        })

        setFormErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleCalculate = async (e) => {
        e.preventDefault()

        if (!validateInputs()) {
          return
        }

        // Extract values from inputs - only include visible fields
        const calculationInputs = {}
        const visibleFields = detail.calculator_fields.filter(shouldDisplayField)

        visibleFields.forEach(field => {
          const input = inputs[field.key]
          if (input !== undefined && input !== null && input !== '') {
            calculationInputs[field.key] = typeof input === 'object' && input !== null ? input.value : input
          }
        })

        await dispatch(calculateResult(id, calculationInputs, (res) => setResult(res)))
    }

    if (!detail) {
        return
    }

    return (
        <Container>
            <Content>
                <CalculatorHeader detail={detail} categoryTags={categoryTags} />

                <CalculatorForm>
                    <form onSubmit={handleCalculate}>
                    <InputsSection>
                        <Row>
                        {detail.calculator_fields?.filter(shouldDisplayField).map(field => (
                            <Col xs={12} md={6} key={field.key}>
                                <CalculatorField
                                    field={field}
                                    value={inputs[field.key]}
                                    onChange={handleInputChange}
                                    error={formErrors[field.key]}
                                />
                            </Col>
                        ))}
                        </Row>
                    </InputsSection>

                    <Button
                        variant="primary"
                        type="submit"
                        disabled={loading.isCalculateLoading}
                        style={{
                        width: '100%',
                        marginTop: '2rem',
                        padding: '1rem',
                        fontSize: '1rem',
                        fontWeight: 600
                        }}
                    >
                        {loading.isCalculateLoading ? 'Calculating...' : 'Calculate Result'}
                    </Button>
                    </form>

                    {result && (
                        <CalculatorResult
                            result={result}
                            clinicalReferences={detail.clinical_references}
                        />
                    )}
                </CalculatorForm>
            </Content>
        </Container>
    )
}

export default CalculatorDetail
