import React, { useEffect, useState, useMemo } from 'react'
import {
  Container,
  Content,
  CalculatorForm,
  FormHeader,
  HeaderTop,
  TopicInfo,
  TagList,
  Tag,
  InputsSection,
  FormGroup,
  ResultSection,
  ResultHeader,
  ResultLabel,
  ResultValue,
  ResultUnit,
  ErrorMessage,
  ClassificationsSection,
  ClassificationTitle,
  ClassificationItem,
  ClassificationName,
  ClassificationValue,
  ClassificationEmpty,
  ClinicalReferencesSection,
  ClinicalReferenceBox,
  FormLabel,
  LabelWithDescription,
  ClinicalReferenceItem,
  OptionCard,
  OptionLabel,
  OptionContent,
  OptionImageContainer,
  OptionImage,
  OptionTextContent
} from './Detail.styles'
import Button from '@components/common/Button'
import Dropdown from '@components/common/Dropdown'
import TextInput from '@components/common/TextInput'
import { useDispatch, useSelector } from 'react-redux'
import { calculateResult, getCalculatorTopicDetail } from '../../../../store/calculator/action'
import { useNavigate, useParams } from 'react-router-dom'
import { Col, Row } from '../../../../components/common/Grid/Grid.styles'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'

const CalculatorDetail = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

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

        const response = await dispatch(calculateResult(id, calculationInputs))
        setResult(response)
      }
      if (!detail) {
        return 
      }

    return (
        <Container>
            <Content>
                <FormHeader>
                    <HeaderTop>
                        <Button variant="secondary" onClick={() => navigate(-1)}>
                            ← Kembali
                        </Button>
                    </HeaderTop>

                    <TopicInfo>
                        <h2>🧮 {detail.title}</h2>
                        {detail.description && <p>{detail.description}</p>}

                        {/* Category Tags */}
                        {categoryTags.length > 0 && (
                            <TagList>
                                {categoryTags.map((tag) => (
                                    <Tag key={tag.id} kategori>
                                        {tag.name}
                                    </Tag>
                                ))}
                            </TagList>
                        )}
                    </TopicInfo>
                </FormHeader>

                <CalculatorForm>
                <form onSubmit={handleCalculate}>
                <InputsSection>
                    <Row>
                    {detail.calculator_fields?.filter(shouldDisplayField).map(field => (
                        <Col xs={12} md={6} key={field.key}>
                        <FormGroup>
                            <LabelWithDescription>
                            <FormLabel>
                                {field.label}
                                {field.unit && <span style={{ color: '#999', fontWeight: '400' }}> ({field.unit})</span>}
                                {field.is_required && <span style={{ color: '#ff6b6b' }}> *</span>}
                            </FormLabel>
                            {field.description && (
                                <FieldDescription>{field.description}</FieldDescription>
                            )}
                            </LabelWithDescription>
    
                            {field.type === 'dropdown' ? (
                            <Dropdown
                                options={field.field_options?.map((opt, idx) => ({
                                value: `${opt.id || idx}_${opt.value}`, // Use id or index + value as unique key
                                label: opt.label,
                                originalValue: opt.value,
                                originalOption: opt
                                })) || []}
                                value={inputs[field.key] ? {
                                value: `${inputs[field.key].id || ''}_${inputs[field.key].value}`,
                                label: inputs[field.key].label
                                } : null}
                                onChange={(option) => {
                                    if (option) {
                                        handleInputChange(field.key, option.originalOption)
                                    } else {
                                        handleInputChange(field.key, '')
                                    }
                                }}
                                placeholder={field.placeholder || `Select ${field.label}`}
                            //   usePortal={true}
                            />
                            ) : field.type === 'radio' ? (
                            <PhotoProvider>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
                                    {field.field_options && field.field_options.map((option, idx) => {
                                        // Use unique identifier: id if available, otherwise index + value
                                        const optionKey = option.id || `${idx}_${option.value}`
                                        const selectedKey = inputs[field.key]?.id || (typeof inputs[field.key] === 'object' ? `${inputs[field.key]?.value}` : inputs[field.key])
                                        const isSelected = inputs[field.key] && (
                                            (option.id && inputs[field.key].id === option.id) ||
                                            (inputs[field.key].value === option.value && inputs[field.key].label === option.label)
                                        )
                                        return (
                                        <OptionCard
                                            key={optionKey}
                                            selected={isSelected}
                                            onClick={() => handleInputChange(field.key, option)}
                                        >
                                            <OptionLabel>
                                                <input
                                                    type="radio"
                                                    name={field.key}
                                                    value={optionKey}
                                                    checked={isSelected}
                                                    onChange={() => handleInputChange(field.key, option)}
                                                    style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                                                />
                                            </OptionLabel>
                                            <OptionContent>
                                                {option.label && <OptionTextContent>{option.label}</OptionTextContent>}
                                                {option.image && (
                                                    <PhotoView src={option.image.url}>
                                                        <OptionImageContainer>
                                                            <OptionImage src={option.image.url} alt={option.label || 'Option image'} />
                                                        </OptionImageContainer>
                                                    </PhotoView>
                                                )}
                                            </OptionContent>
                                        </OptionCard>
                                        )
                                    })}
                                </div>
                            </PhotoProvider>
                            ) : field.type === 'number' ? (
                            <TextInput
                                type="number"
                                name={field.key}
                                value={inputs[field.key] || ''}
                                onChange={(e) => handleInputChange(field.key, e.target.value)}
                                placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                                step="any"
                            />
                            ) : (
                            <TextInput
                                type="text"
                                name={field.key}
                                value={inputs[field.key] || ''}
                                onChange={(e) => handleInputChange(field.key, e.target.value)}
                                placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                            />
                            )}
    
                            {formErrors[field.key] && (
                            <ErrorMessage>
                                {formErrors[field.key]}
                            </ErrorMessage>
                            )}
                        </FormGroup>
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
                <ResultSection>
                    <ResultHeader>
                        <ResultLabel>{result.result_label}</ResultLabel>
                        <ResultValue>
                            {typeof result.result === 'number'
                                ? result.result.toFixed(2)
                                : result.result}
                            {result.result_unit && (
                                <ResultUnit>{result.result_unit}</ResultUnit>
                            )}
                        </ResultValue>
                    </ResultHeader>

                    {/* Classifications */}
                    {result.classifications && result.classifications.length > 0 && (
                    <ClassificationsSection>
                        <ClassificationTitle>Interpretasi Hasil</ClassificationTitle>
                        {result.classifications.map((classification, index) => (
                        <ClassificationItem key={index}>
                            <ClassificationName>{classification.name}</ClassificationName>
                            {classification.matched_options && classification.matched_options.length > 0 ? (
                            <ClassificationValue>
                                {classification.matched_options.join(' • ')}
                            </ClassificationValue>
                            ) : (
                            <ClassificationEmpty>
                                Tidak ada klasifikasi
                            </ClassificationEmpty>
                            )}
                        </ClassificationItem>
                        ))}
                    </ClassificationsSection>
                    )}

                    {/* Clinical References */}
                    {detail.clinical_references && detail.clinical_references.length > 0 && (
                    <ClinicalReferencesSection>
                        <ClassificationTitle>Referensi Klinis</ClassificationTitle>
                        <ClinicalReferenceBox>
                            {detail.clinical_references.map((reference, index) => (
                            <ClinicalReferenceItem
                                key={index}
                                isLast={index === detail.clinical_references.length - 1}
                            >
                                <strong>{index + 1}.</strong> {reference}
                            </ClinicalReferenceItem>
                            ))}
                        </ClinicalReferenceBox>
                    </ClinicalReferencesSection>
                    )}
                </ResultSection>
                )}
            </CalculatorForm>
            </Content>
        </Container>
    )
}

export default CalculatorDetail