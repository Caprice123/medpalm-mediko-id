import React, { useEffect, useState } from 'react'
import {
  Container,
  Content,
  Header,
  Title,
  Subtitle,
  CalculatorsList,
  CalculatorCard,
  CalculatorTitle,
  CalculatorDescription,
  FieldCount,
  CalculatorForm,
  FormHeader,
  BackButton,
  FormTitle,
  FormDescription,
  InputsSection,
  SectionTitle,
  InputsGrid,
  FormGroup,
  FormLabel,
  LabelWithDescription,
  FieldDescription,
  FormInput,
  CalculateButton,
  ResultSection,
  ResultLabel,
  ResultValue,
  ResultUnit,
  ResultDetails,
  ResultDetailItem,
  DetailLabel,
  DetailValue,
  ErrorMessage,
  LoadingSpinner,
  EmptyState,
  EmptyIcon,
  EmptyText,
  ClassificationsSection,
  ClassificationTitle,
  ClassificationItem,
  ClassificationName,
  ClassificationValue,
  ClassificationEmpty,
  ClinicalReferencesSection,
  ClinicalReferenceBox,
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
    const [inputs, setInputs] = useState({})
    const [formErrors, setFormErrors] = useState({})

    // Calculation state
    const [result, setResult] = useState(null)

    useEffect(() => {
        dispatch(getCalculatorTopicDetail(id))
    }, [dispatch, id])

    
    const handleInputChange = (e) => {
        const { name, value } = e.target
        setInputs(prev => ({
          ...prev,
          [name]: value
        }))
    
        // Clear error for this field when user starts typing
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
          const value = inputs[field.key]
    
          if (field.is_required && (!value || value.trim() === '')) {
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

        const response = await dispatch(calculateResult(id, inputs))
        setResult(response)
      }
      if (!detail) {
        return 
      }

    return (
        <Container>
            <Content>
            <CalculatorForm>
                <FormHeader>
                <Button
                    variant="outline"
                    onClick={() => navigate(-1)}
                    style={{ minWidth: '44px', padding: '0.5rem 1rem' }}
                >
                    ← Back
                </Button>
                <div style={{ flex: 1, marginLeft: '1rem' }}>
                    <FormTitle>{detail.title}</FormTitle>
                    {detail.description && (
                    <FormDescription>{detail.description}</FormDescription>
                    )}
                </div>
                </FormHeader>
    
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
                                value: inputs[field.key],
                                label: field.field_options?.find(opt => opt.value === inputs[field.key])?.label || inputs[field.key]
                                } : null}
                                onChange={(option) => handleInputChange({
                                target: { name: field.key, value: option?.value || '' }
                                })}
                                placeholder={field.placeholder || `Select ${field.label}`}
                            //   usePortal={true}
                            />
                            ) : field.type === 'radio' ? (
                            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '8px' }}>
                                {field.field_options && field.field_options.map(option => (
                                <label key={option.value} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                    <input
                                    type="radio"
                                    name={field.key}
                                    value={option.value}
                                    checked={inputs[field.key] === option.value}
                                    onChange={handleInputChange}
                                    style={{ cursor: 'pointer' }}
                                    />
                                    <span>{option.label}</span>
                                </label>
                                ))}
                            </div>
                            ) : field.type === 'number' ? (
                            <TextInput
                                type="number"
                                name={field.key}
                                value={inputs[field.key] || ''}
                                onChange={handleInputChange}
                                placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                                step="any"
                            />
                            ) : (
                            <TextInput
                                type="text"
                                name={field.key}
                                value={inputs[field.key] || ''}
                                onChange={handleInputChange}
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
                    <ResultLabel>{result.result_label}</ResultLabel>
                    <ResultValue>
                        {typeof result.result === 'number'
                            ? result.result.toFixed(2)
                            : result.result}
                        {result.result_unit && (
                            <ResultUnit>{result.result_unit}</ResultUnit>
                        )}
                    </ResultValue>

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