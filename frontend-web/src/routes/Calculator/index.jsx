import { useState, useEffect } from 'react'
import { getWithToken, postWithToken } from '@utils/requestUtils'
import Endpoints from '@config/endpoint'
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
  EmptyText
} from './Calculator.styles'

function CalculatorPage() {
  // Calculator list state
  const [topics, setTopics] = useState([])
  const [isLoadingTopics, setIsLoadingTopics] = useState(true)
  const [topicsError, setTopicsError] = useState(null)

  // Selected calculator state
  const [selectedCalculator, setSelectedCalculator] = useState(null)
  const [inputs, setInputs] = useState({})
  const [formErrors, setFormErrors] = useState({})

  // Calculation state
  const [result, setResult] = useState(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [calculationError, setCalculationError] = useState(null)

  // Fetch calculators on mount
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setIsLoadingTopics(true)
        setTopicsError(null)
        const response = await getWithToken(Endpoints.calculators.topics)
        setTopics(response.data.data || response.data.topics || [])
      } catch (error) {
        console.error('Error fetching calculators:', error)
        setTopicsError('Failed to load calculators')
      } finally {
        setIsLoadingTopics(false)
      }
    }

    fetchTopics()
  }, [])

  const handleSelectCalculator = (calculator) => {
    setSelectedCalculator(calculator)
    setInputs({})
    setFormErrors({})
    setResult(null)
    setCalculationError(null)
  }

  const handleBack = () => {
    setSelectedCalculator(null)
    setInputs({})
    setFormErrors({})
    setResult(null)
    setCalculationError(null)
  }

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

    if (!selectedCalculator) return false

    selectedCalculator.fields.forEach(field => {
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

    try {
      setIsCalculating(true)
      setCalculationError(null)
      const response = await postWithToken(
        Endpoints.calculators.calculate(selectedCalculator.id),
        inputs
      )
      setResult(response.data.data)
    } catch (error) {
      console.error('Calculation error:', error)
      setCalculationError(error.message || 'Calculation failed')
    } finally {
      setIsCalculating(false)
    }
  }

  // Show calculator selection list
  if (!selectedCalculator) {
    return (
      <Container>
        <Content>
          <Header>
            <Title>🧮 Kalkulator</Title>
            <Subtitle>Pilih kalkulator untuk memulai perhitungan</Subtitle>
          </Header>

          {isLoadingTopics ? (
            <EmptyState>
              <LoadingSpinner style={{ margin: '0 auto' }} />
              <p>Loading calculators...</p>
            </EmptyState>
          ) : topicsError ? (
            <EmptyState>
              <EmptyIcon>⚠️</EmptyIcon>
              <EmptyText>{topicsError}</EmptyText>
            </EmptyState>
          ) : topics.length === 0 ? (
            <EmptyState>
              <EmptyIcon>🧮</EmptyIcon>
              <EmptyText>Tidak ada kalkulator yang tersedia saat ini.</EmptyText>
            </EmptyState>
          ) : (
            <CalculatorsList>
              {topics.map(calculator => (
                <CalculatorCard
                  key={calculator.id}
                  onClick={() => handleSelectCalculator(calculator)}
                >
                  <CalculatorTitle>{calculator.title}</CalculatorTitle>
                  <CalculatorDescription>
                    {calculator.description || 'Kalkulator untuk membantu perhitungan Anda'}
                  </CalculatorDescription>
                  <FieldCount>
                    {calculator.fields?.length || 0} input field
                  </FieldCount>
                </CalculatorCard>
              ))}
            </CalculatorsList>
          )}
        </Content>
      </Container>
    )
  }

  // Show calculator form
  return (
    <Container>
      <Content>
        <CalculatorForm>
          <FormHeader>
            <BackButton onClick={handleBack}>←</BackButton>
            <div style={{ flex: 1 }}>
              <FormTitle>{selectedCalculator.title}</FormTitle>
              {selectedCalculator.description && (
                <FormDescription>{selectedCalculator.description}</FormDescription>
              )}
            </div>
          </FormHeader>

          <form onSubmit={handleCalculate}>
            <InputsSection>
              <InputsGrid>
                {selectedCalculator.fields.map(field => (
                  <FormGroup key={field.key}>
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
                      <select
                        name={field.key}
                        value={inputs[field.key] || ''}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: '6px',
                          border: '1px solid #e0e0e0',
                          fontSize: '14px',
                          fontFamily: 'inherit'
                        }}
                      >
                        <option value="">{field.placeholder || `Select ${field.label}`}</option>
                        {field.field_options && field.field_options.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
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
                    ) : (
                      <FormInput
                        type={field.type === 'number' ? 'number' : 'text'}
                        name={field.key}
                        value={inputs[field.key] || ''}
                        onChange={handleInputChange}
                        placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                        step={field.type === 'number' ? 'any' : undefined}
                      />
                    )}
                    {formErrors[field.key] && (
                      <ErrorMessage style={{ margin: '4px 0 0 0' }}>
                        {formErrors[field.key]}
                      </ErrorMessage>
                    )}
                  </FormGroup>
                ))}
              </InputsGrid>
            </InputsSection>

            {calculationError && (
              <ErrorMessage>{calculationError}</ErrorMessage>
            )}

            <CalculateButton
              type="submit"
              disabled={isCalculating}
            >
              {isCalculating ? (
                <>
                  <LoadingSpinner style={{ marginRight: '8px' }} />
                  Calculating...
                </>
              ) : (
                'Calculate Result'
              )}
            </CalculateButton>
          </form>

          {result && (
            <ResultSection>
              <div style={{ fontSize: '4rem', marginBottom: '1rem', position: 'relative', zIndex: 1 }}>✨</div>
              <ResultLabel>{result.result_label}</ResultLabel>
              <ResultValue>
                {typeof result.result === 'number'
                  ? result.result.toFixed(2)
                  : result.result}
                {result.result_unit && (
                  <ResultUnit>{result.result_unit}</ResultUnit>
                )}
              </ResultValue>

              {result.classifications && result.classifications.length > 0 && (
                <ResultDetails>
                  <h4 style={{
                    margin: '0 0 1.5rem 0',
                    fontSize: '1rem',
                    fontWeight: '800',
                    color: '#0f172a',
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span style={{ fontSize: '1.25rem' }}>📊</span> Interpretasi Hasil
                  </h4>
                  {result.classifications.map((classification, index) => (
                    <div key={index} style={{ marginBottom: '1.5rem', animation: `fadeIn 0.5s ease ${index * 0.1}s backwards` }}>
                      <div style={{
                        fontSize: '0.9375rem',
                        color: '#0891b2',
                        fontWeight: '700',
                        marginBottom: '1rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <span style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #06b6d4, #0891b2)'
                        }}></span>
                        {classification.name}
                      </div>
                      {classification.matched_options && classification.matched_options.length > 0 ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                          {classification.matched_options.map((option, optIndex) => (
                            <span
                              key={optIndex}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(8, 145, 178, 0.1))',
                                color: '#0891b2',
                                padding: '0.75rem 1.25rem',
                                borderRadius: '50px',
                                fontSize: '0.9375rem',
                                fontWeight: '700',
                                border: '2px solid rgba(6, 182, 212, 0.3)',
                                boxShadow: '0 4px 12px rgba(6, 182, 212, 0.1)',
                                transition: 'all 0.3s ease',
                                cursor: 'default',
                                animation: `scaleIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) ${optIndex * 0.1}s backwards`
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)'
                                e.currentTarget.style.boxShadow = '0 6px 20px rgba(6, 182, 212, 0.2)'
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0) scale(1)'
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(6, 182, 212, 0.1)'
                              }}
                            >
                              <span style={{ fontSize: '1.125rem' }}>✓</span> {option}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span style={{
                          fontSize: '0.875rem',
                          color: '#94a3b8',
                          fontStyle: 'italic',
                          fontWeight: '500',
                          padding: '0.75rem 1rem',
                          background: 'rgba(148, 163, 184, 0.08)',
                          borderRadius: '12px',
                          display: 'inline-block',
                          border: '1px solid rgba(148, 163, 184, 0.15)'
                        }}>
                          Tidak ada klasifikasi yang cocok
                        </span>
                      )}
                    </div>
                  ))}
                </ResultDetails>
              )}
            </ResultSection>
          )}
          <style>{`
            @keyframes fadeIn {
              from {
                opacity: 0;
                transform: translateY(10px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            @keyframes scaleIn {
              from {
                opacity: 0;
                transform: scale(0.8);
              }
              to {
                opacity: 1;
                transform: scale(1);
              }
            }
          `}</style>
        </CalculatorForm>
      </Content>
    </Container>
  )
}

export default CalculatorPage
