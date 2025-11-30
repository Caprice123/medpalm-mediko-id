import { useState, useEffect } from 'react'
import styled from 'styled-components'

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 30px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
`

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`

const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0;
`

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  transition: color 0.2s;

  &:hover {
    color: #333;
  }
`

const FormGroup = styled.div`
  margin-bottom: 20px;
`

const FormLabel = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
`

const FormInput = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #6bb9e8;
  }
`

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  min-height: 60px;
  font-family: inherit;
  transition: border-color 0.2s;
  resize: vertical;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #6bb9e8;
  }
`

const FieldsSection = styled.div`
  margin: 30px 0;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
`

const FieldsSectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
`

const FieldsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const FieldItem = styled.div`
  background: white;
  padding: 16px;
  border: 2px solid ${props => props.isDragging ? '#6bb9e8' : '#e0e0e0'};
  border-radius: 6px;
  display: flex;
  gap: 12px;
  align-items: flex-start;
  cursor: ${props => props.isDragging ? 'grabbing' : 'grab'};
  opacity: ${props => props.isDragging ? 0.7 : 1};
  transition: all 0.2s;

  &:hover {
    border-color: #6bb9e8;
    box-shadow: 0 2px 8px rgba(107, 185, 232, 0.1);
  }
`

const DragHandle = styled.div`
  padding: 8px;
  color: #999;
  cursor: grab;
  font-size: 18px;
  user-select: none;

  &:active {
    cursor: grabbing;
  }
`

const FieldItemContent = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`

const FieldInputWrapper = styled.div`
  display: flex;
  flex-direction: column;

  ${props => props.fullWidth && `
    grid-column: 1 / -1;
  `}
`

const RemoveFieldButton = styled.button`
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  transition: background 0.2s;
  align-self: flex-start;
  margin-top: 22px;

  &:hover {
    background: #ff5252;
  }
`

const AddFieldButton = styled.button`
  background: #8dc63f;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  margin-top: 12px;
  transition: background 0.2s;

  &:hover {
    background: #7fb536;
  }
`

const ClassificationsSection = styled.div`
  margin: 30px 0;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
`

const ClassificationsSectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
`

const ClassificationsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const ClassificationItem = styled.div`
  background: white;
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  transition: all 0.2s;

  &:hover {
    border-color: #6bb9e8;
    box-shadow: 0 2px 8px rgba(107, 185, 232, 0.1);
  }
`

const ClassificationHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 12px;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
`

const ConditionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 12px 0;
  padding: 12px;
  background: #fafafa;
  border-radius: 4px;
`

const ConditionItem = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 0.5fr auto;
  gap: 8px;
  align-items: center;
`

const OptionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 12px 0;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 4px;
`

const OptionItem = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 8px;
  align-items: center;
`

const SmallButton = styled.button`
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  white-space: nowrap;
  transition: background 0.2s;

  &:hover {
    background: #ff5252;
  }
`

const AddButton = styled.button`
  background: #6bb9e8;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  transition: background 0.2s;

  &:hover {
    background: #5aade4;
  }
`

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`

const ModalFooter = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
`

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-1px);
  }
`

const PrimaryButton = styled(Button)`
  background: linear-gradient(135deg, #6bb9e8 0%, #8dc63f 100%);
  color: white;
`

const SecondaryButton = styled(Button)`
  background: #f0f0f0;
  color: #333;
  border: 1px solid #e0e0e0;
`

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #6bb9e8;
  }
`

const HelpText = styled.p`
  font-size: 12px;
  color: #999;
  margin: 4px 0 0 0;
`

const ErrorMessage = styled.div`
  color: #ff6b6b;
  font-size: 12px;
  margin-top: 4px;
`

function CalculatorModal({ isOpen, onClose, calculator, onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    formula: '',
    result_label: '',
    result_unit: '',
    fields: [],
    classifications: [],
    status: 'draft'
  })

  const [errors, setErrors] = useState({})
  const [draggedIndex, setDraggedIndex] = useState(null)

  useEffect(() => {
    if (calculator) {
      setFormData({
        title: calculator.title,
        description: calculator.description || '',
        formula: calculator.formula,
        result_label: calculator.result_label,
        result_unit: calculator.result_unit || '',
        fields: calculator.fields || [],
        classifications: calculator.classifications || [],
        status: calculator.status || 'draft'
      })
    } else {
      setFormData({
        title: '',
        description: '',
        formula: '',
        result_label: '',
        result_unit: '',
        fields: [],
        classifications: [],
        status: 'draft'
      })
    }
    setErrors({})
    setDraggedIndex(null)
  }, [calculator, isOpen])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (!formData.formula.trim()) {
      newErrors.formula = 'Formula is required'
    } else {
      // Check if formula references all field keys
      formData.fields.forEach(field => {
        if (!new RegExp(`\\b${field.key}\\b`).test(formData.formula)) {
          newErrors.formula = `Formula must reference field key '${field.key}'`
        }
      })
    }

    if (!formData.result_label.trim()) {
      newErrors.result_label = 'Result label is required'
    }

    if (formData.fields.length === 0) {
      newErrors.fields = 'At least one field is required'
    }

    formData.fields.forEach((field, index) => {
      if (!field.key?.trim()) {
        newErrors[`field_${index}_key`] = 'Key is required'
      }
      if (!field.label?.trim()) {
        newErrors[`field_${index}_label`] = 'Label is required'
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleFieldChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleFieldItemChange = (index, fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map((f, i) =>
        i === index ? { ...f, [fieldName]: value } : f
      )
    }))
  }

  const addField = () => {
    setFormData(prev => ({
      ...prev,
      fields: [
        ...prev.fields,
        {
          key: '',
          type: 'number',
          label: '',
          description: '',
          unit: '',
          is_required: true
        }
      ]
    }))
  }

  const removeField = (index) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index)
    }))
  }

  // Drag and drop handlers
  const handleDragStart = (e, index) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e, targetIndex) => {
    e.preventDefault()
    if (draggedIndex === null) return

    const newFields = [...formData.fields]
    const draggedField = newFields[draggedIndex]

    // Remove from old position
    newFields.splice(draggedIndex, 1)
    // Insert at new position
    newFields.splice(targetIndex, 0, draggedField)

    setFormData(prev => ({
      ...prev,
      fields: newFields
    }))
    setDraggedIndex(null)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  // Classification handlers
  const addClassification = () => {
    setFormData(prev => ({
      ...prev,
      classifications: [
        ...prev.classifications,
        {
          key: '',
          label: '',
          type: 'dropdown',
          conditions: [],
          options: []
        }
      ]
    }))
  }

  const removeClassification = (index) => {
    setFormData(prev => ({
      ...prev,
      classifications: prev.classifications.filter((_, i) => i !== index)
    }))
  }

  const handleClassificationChange = (index, fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      classifications: prev.classifications.map((c, i) =>
        i === index ? { ...c, [fieldName]: value } : c
      )
    }))
  }

  const addCondition = (classificationIndex) => {
    setFormData(prev => ({
      ...prev,
      classifications: prev.classifications.map((c, i) =>
        i === classificationIndex
          ? {
              ...c,
              conditions: [
                ...(c.conditions || []),
                {
                  result_key: 'result',
                  operator: '>',
                  value: '',
                  logical_operator: null
                }
              ]
            }
          : c
      )
    }))
  }

  const removeCondition = (classificationIndex, conditionIndex) => {
    setFormData(prev => ({
      ...prev,
      classifications: prev.classifications.map((c, i) =>
        i === classificationIndex
          ? {
              ...c,
              conditions: c.conditions.filter((_, j) => j !== conditionIndex).length === 1 ? [] : c.conditions.filter((_, j) => j !== conditionIndex)
            }
          : c
      )
    }))
  }

  const handleConditionChange = (classificationIndex, conditionIndex, fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      classifications: prev.classifications.map((c, i) =>
        i === classificationIndex
          ? {
              ...c,
              conditions: c.conditions.map((cond, j) =>
                j === conditionIndex ? { ...cond, [fieldName]: value } : cond
              )
            }
          : c
      )
    }))
  }

  const addFieldOption = (fieldIndex) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map((f, i) =>
        i === fieldIndex
          ? {
              ...f,
              options: [
                ...(f.options || []),
                { value: '', label: '' }
              ]
            }
          : f
      )
    }))
  }

  const removeFieldOption = (fieldIndex, optionIndex) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map((f, i) =>
        i === fieldIndex
          ? {
              ...f,
              options: f.options.filter((_, j) => j !== optionIndex)
            }
          : f
      )
    }))
  }

  const handleFieldOptionChange = (fieldIndex, optionIndex, fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map((f, i) =>
        i === fieldIndex
          ? {
              ...f,
              options: f.options.map((opt, j) =>
                j === optionIndex ? { ...opt, [fieldName]: value } : opt
              )
            }
          : f
      )
    }))
  }

    const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  if (!isOpen) return null

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            {calculator ? 'Edit Calculator' : 'Create Calculator'}
          </ModalTitle>
          <CloseButton onClick={onClose}>✕</CloseButton>
        </ModalHeader>

        <form onSubmit={handleSubmit}>
          <FormGroup>
            <FormLabel>Title *</FormLabel>
            <FormInput
              type="text"
              name="title"
              value={formData.title}
              onChange={handleFieldChange}
              placeholder="e.g., BMI Calculator"
            />
            {errors.title && <ErrorMessage>{errors.title}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <FormLabel>Description</FormLabel>
            <FormTextarea
              name="description"
              value={formData.description}
              onChange={handleFieldChange}
              placeholder="Description of what this calculator does..."
            />
          </FormGroup>

          <FormRow>
            <FormGroup>
              <FormLabel>Result Label *</FormLabel>
              <FormInput
                type="text"
                name="result_label"
                value={formData.result_label}
                onChange={handleFieldChange}
                placeholder="e.g., Body Mass Index"
              />
              {errors.result_label && <ErrorMessage>{errors.result_label}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <FormLabel>Result Unit</FormLabel>
              <FormInput
                type="text"
                name="result_unit"
                value={formData.result_unit}
                onChange={handleFieldChange}
                placeholder="e.g., kg/m²"
              />
            </FormGroup>
          </FormRow>

          <FormGroup>
            <FormLabel>Formula *</FormLabel>
            <FormTextarea
              name="formula"
              value={formData.formula}
              onChange={handleFieldChange}
              placeholder="e.g., (weight / (height * height)) * 10000"
              style={{ fontFamily: 'monospace', fontSize: '12px' }}
            />
            <HelpText>
              Use field keys in formula. Supports: +, -, *, /, (), Math functions
            </HelpText>
            {errors.formula && <ErrorMessage>{errors.formula}</ErrorMessage>}
          </FormGroup>

          <FieldsSection>
            <FieldsSectionTitle>Input Fields *</FieldsSectionTitle>
            {errors.fields && <ErrorMessage>{errors.fields}</ErrorMessage>}

            <FieldsList>
              {formData.fields.map((field, index) => (
                <FieldItem
                  key={index}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  isDragging={draggedIndex === index}
                >
                  <DragHandle>⋮⋮</DragHandle>

                  <FieldItemContent>
                    <FieldInputWrapper>
                      <FormLabel>Key</FormLabel>
                      <FormInput
                        type="text"
                        value={field.key}
                        onChange={(e) => handleFieldItemChange(index, 'key', e.target.value)}
                        placeholder="e.g., weight"
                      />
                      {errors[`field_${index}_key`] && (
                        <ErrorMessage>{errors[`field_${index}_key`]}</ErrorMessage>
                      )}
                    </FieldInputWrapper>

                    <FieldInputWrapper>
                      <FormLabel>Type</FormLabel>
                      <Select
                        value={field.type}
                        onChange={(e) => handleFieldItemChange(index, 'type', e.target.value)}
                      >
                        <option value="number">Number</option>
                        <option value="text">Text</option>
                        <option value="dropdown">Dropdown</option>
                        <option value="radio">Radio Button</option>
                      </Select>
                    </FieldInputWrapper>

                    <FieldInputWrapper fullWidth>
                      <FormLabel>Label</FormLabel>
                      <FormInput
                        type="text"
                        value={field.label}
                        onChange={(e) => handleFieldItemChange(index, 'label', e.target.value)}
                        placeholder="e.g., Weight (kg)"
                      />
                      {errors[`field_${index}_label`] && (
                        <ErrorMessage>{errors[`field_${index}_label`]}</ErrorMessage>
                      )}
                    </FieldInputWrapper>

                    <FieldInputWrapper fullWidth>
                      <FormLabel>Description</FormLabel>
                      <FormInput
                        type="text"
                        value={field.description || ''}
                        onChange={(e) => handleFieldItemChange(index, 'description', e.target.value)}
                        placeholder="Optional description"
                      />
                    </FieldInputWrapper>

                    <FieldInputWrapper fullWidth>
                      <FormLabel>Unit</FormLabel>
                      <FormInput
                        type="text"
                        value={field.unit || ''}
                        onChange={(e) => handleFieldItemChange(index, 'unit', e.target.value)}
                        placeholder="Optional unit, e.g., kg, cm, mg"
                      />
                    </FieldInputWrapper>

                    {(field.type === 'dropdown' || field.type === 'radio') && (
                      <FieldInputWrapper fullWidth>
                        <FormLabel style={{ fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>
                          Options
                        </FormLabel>
                        <OptionsList>
                          {field.options && field.options.map((option, optIndex) => (
                            <OptionItem key={optIndex}>
                              <FormInput
                                type="text"
                                value={option.value}
                                onChange={(e) => handleFieldOptionChange(index, optIndex, 'value', e.target.value)}
                                placeholder="Option value"
                                style={{ fontSize: '12px' }}
                              />
                              <FormInput
                                type="text"
                                value={option.label}
                                onChange={(e) => handleFieldOptionChange(index, optIndex, 'label', e.target.value)}
                                placeholder="Display label"
                                style={{ fontSize: '12px' }}
                              />
                              <SmallButton
                                type="button"
                                onClick={() => removeFieldOption(index, optIndex)}
                              >
                                ✕
                              </SmallButton>
                            </OptionItem>
                          ))}
                        </OptionsList>
                        <AddButton type="button" onClick={() => addFieldOption(index)} style={{ marginTop: '4px' }}>
                          + Add Option
                        </AddButton>
                      </FieldInputWrapper>
                    )}
                  </FieldItemContent>

                  <RemoveFieldButton
                    type="button"
                    onClick={() => removeField(index)}
                  >
                    Remove
                  </RemoveFieldButton>
                </FieldItem>
              ))}
            </FieldsList>

            <AddFieldButton type="button" onClick={addField}>
              + Add Field
            </AddFieldButton>
          </FieldsSection>

          {/* Classifications Section */}
          <ClassificationsSection>
            <ClassificationsSectionTitle>Classifications (Optional)</ClassificationsSectionTitle>
            <p style={{ fontSize: '12px', color: '#666', margin: '0 0 16px 0' }}>
              Add optional classifications to categorize results based on value ranges or conditions
            </p>

            {formData.classifications && formData.classifications.length > 0 && (
              <ClassificationsList>
                {formData.classifications.map((classification, classIndex) => (
                  <ClassificationItem key={classIndex}>
                    <ClassificationHeader>
                      <div>
                        <FormLabel>Classification Key</FormLabel>
                        <FormInput
                          type="text"
                          value={classification.key}
                          onChange={(e) => handleClassificationChange(classIndex, 'key', e.target.value)}
                          placeholder="e.g., bmi_category"
                          style={{ marginBottom: '4px' }}
                        />
                      </div>
                      <div>
                        <FormLabel>Label</FormLabel>
                        <FormInput
                          type="text"
                          value={classification.label}
                          onChange={(e) => handleClassificationChange(classIndex, 'label', e.target.value)}
                          placeholder="e.g., BMI Category"
                          style={{ marginBottom: '4px' }}
                        />
                      </div>
                      <SmallButton
                        type="button"
                        onClick={() => removeClassification(classIndex)}
                        style={{ marginTop: '22px' }}
                      >
                        Remove
                      </SmallButton>
                    </ClassificationHeader>

                    {/* Conditions */}
                    <div>
                      <FormLabel style={{ fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>
                        Conditions (if result matches these conditions)
                      </FormLabel>
                      <ConditionsList>
                        {classification.conditions && classification.conditions.map((condition, condIndex) => (
                          <ConditionItem key={condIndex}>
                            <FormInput
                              type="text"
                              value={condition.result_key}
                              onChange={(e) => handleConditionChange(classIndex, condIndex, 'result_key', e.target.value)}
                              placeholder="Key (e.g., result)"
                              style={{ fontSize: '12px' }}
                            />
                            <Select
                              value={condition.operator}
                              onChange={(e) => handleConditionChange(classIndex, condIndex, 'operator', e.target.value)}
                              style={{ fontSize: '12px' }}
                            >
                              <option value=">">{'Greater than (>)'}</option>
                              <option value="<">{'Less than (<)'}</option>
                              <option value=">=">{'>= (>=)'}</option>
                              <option value="<=">{`<= (<= )`}</option>
                              <option value="==">Equals (==)</option>
                              <option value="!=">Not equals (!=)</option>
                            </Select>
                            <FormInput
                              type="number"
                              value={condition.value}
                              onChange={(e) => handleConditionChange(classIndex, condIndex, 'value', e.target.value)}
                              placeholder="Value"
                              step="0.01"
                              style={{ fontSize: '12px' }}
                            />
                            {classification.conditions.length > 1 && (
                              <Select
                              value={condition.logical_operator || 'AND'}
                              onChange={(e) => handleConditionChange(classIndex, condIndex, 'logical_operator', e.target.value)}
                              style={{ fontSize: '12px' }}
                            >
                              <option value="AND">AND</option>
                              <option value="OR">OR</option>
                            </Select>
                            )}
                            <SmallButton
                              type="button"
                              onClick={() => removeCondition(classIndex, condIndex)}
                            >
                              ✕
                            </SmallButton>
                          </ConditionItem>
                        ))}
                      </ConditionsList>
                      <AddButton type="button" onClick={() => addCondition(classIndex)}>
                        + Add Condition
                      </AddButton>
                    </div>
                  </ClassificationItem>
                ))}
              </ClassificationsList>
            )}

            <AddFieldButton type="button" onClick={addClassification}>
              + Add Classification
            </AddFieldButton>
          </ClassificationsSection>

          <FormRow>
            <FormGroup>
              <FormLabel>Status</FormLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleFieldChange}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </Select>
            </FormGroup>
          </FormRow>

          <ModalFooter>
            <SecondaryButton type="button" onClick={onClose}>
              Cancel
            </SecondaryButton>
            <PrimaryButton type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Calculator'}
            </PrimaryButton>
          </ModalFooter>
        </form>
      </ModalContent>
    </ModalOverlay>
  )
}

export default CalculatorModal
