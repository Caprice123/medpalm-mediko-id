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
  ClinicalReferenceItem
} from './Detail.styles'
import Button from '@components/common/Button'
import Dropdown from '@components/common/Dropdown'
import TextInput from '@components/common/TextInput'
import { useDispatch, useSelector } from 'react-redux'
import { calculateResult, getCalculatorTopicDetail } from '../../../../store/calculator/action'
import { useNavigate, useParams } from 'react-router-dom'
import { Col, Row } from '../../../../components/common/Grid/Grid.styles'

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

        detail.calculator_fields.forEach(field => {
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

        // Extract values from inputs (objects for dropdown/radio, raw values for text/number)
        const calculationInputs = {}
        Object.keys(inputs).forEach(key => {
          const input = inputs[key]
          calculationInputs[key] = typeof input === 'object' && input !== null ? input.value : input
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
                    {detail.calculator_fields?.map(field => (
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
                                options={field.field_options?.map(opt => ({
                                value: opt.value,
                                label: opt.label
                                })) || []}
                                value={inputs[field.key] ? {
                                value: typeof inputs[field.key] === 'object' ? inputs[field.key].value : inputs[field.key],
                                label: typeof inputs[field.key] === 'object' ? inputs[field.key].label : (field.field_options?.find(opt => opt.value === inputs[field.key])?.label || inputs[field.key])
                                } : null}
                                onChange={(option) => {
                                    if (option) {
                                        // Find the full option object from field_options
                                        const fullOption = field.field_options?.find(opt => opt.value === option.value)
                                        handleInputChange(field.key, fullOption || option)
                                    } else {
                                        handleInputChange(field.key, '')
                                    }
                                }}
                                placeholder={field.placeholder || `Select ${field.label}`}
                            //   usePortal={true}
                            />
                            ) : field.type === 'radio' ? (
                            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '8px' }}>
                                {field.field_options && field.field_options.map(option => (
                                <label
                                    key={option.value}
                                    style={{
                                        display: 'flex',
                                        flexDirection: option.image ? 'column' : 'row',
                                        alignItems: option.image ? 'flex-start' : 'center',
                                        gap: '8px',
                                        cursor: 'pointer',
                                        padding: option.image ? '12px' : '0',
                                        border: option.image ? '2px solid #e0e0e0' : 'none',
                                        borderRadius: option.image ? '8px' : '0',
                                        backgroundColor: option.image && inputs[field.key] === option.value ? '#f0f7ff' : 'transparent',
                                        borderColor: option.image && inputs[field.key] === option.value ? '#4A90E2' : '#e0e0e0',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {option.image && (
                                        <img
                                            src={option.image.url}
                                            alt={option.label}
                                            style={{
                                                width: '100%',
                                                maxWidth: '200px',
                                                height: 'auto',
                                                maxHeight: '150px',
                                                objectFit: 'cover',
                                                borderRadius: '6px',
                                                marginBottom: '8px'
                                            }}
                                        />
                                    )}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <input
                                        type="radio"
                                        name={field.key}
                                        value={option.value}
                                        checked={(typeof inputs[field.key] === 'object' ? inputs[field.key]?.value : inputs[field.key]) === option.value}
                                        onChange={() => handleInputChange(field.key, option)}
                                        style={{ cursor: 'pointer' }}
                                        />
                                        <span>{option.label}</span>
                                    </div>
                                </label>
                                ))}
                            </div>
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