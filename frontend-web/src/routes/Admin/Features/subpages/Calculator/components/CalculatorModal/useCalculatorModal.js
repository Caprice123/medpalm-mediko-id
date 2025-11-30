import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createCalculatorTopic, updateCalculatorTopic } from '@store/calculator/action'

export const useCalculatorModal = ({ isOpen, calculator, onSuccess, onClose }) => {
  const dispatch = useDispatch()
  const { loading } = useSelector(state => state.calculator)

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

  const [initialFormData, setInitialFormData] = useState(null)
  const [errors, setErrors] = useState({})
  const [draggedIndex, setDraggedIndex] = useState(null)
  const [showConfirmClose, setShowConfirmClose] = useState(false)

  useEffect(() => {
    if (calculator) {
      const data = {
        title: calculator.title,
        description: calculator.description || '',
        formula: calculator.formula,
        result_label: calculator.result_label,
        result_unit: calculator.result_unit || '',
        fields: calculator.fields || [],
        classifications: calculator.classifications || [],
        status: calculator.status || 'draft'
      }
      setFormData(data)
      setInitialFormData(JSON.stringify(data))
    } else {
      const data = {
        title: '',
        description: '',
        formula: '',
        result_label: '',
        result_unit: '',
        fields: [],
        classifications: [],
        status: 'draft'
      }
      setFormData(data)
      setInitialFormData(JSON.stringify(data))
    }
    setErrors({})
    setDraggedIndex(null)
    setShowConfirmClose(false)
  }, [calculator, isOpen])

  const hasUnsavedChanges = () => {
    if (!initialFormData) return false
    return JSON.stringify(formData) !== initialFormData
  }

  const handleClose = () => {
    if (hasUnsavedChanges()) {
      setShowConfirmClose(true)
    } else {
      onClose()
    }
  }

  const handleConfirmClose = () => {
    setShowConfirmClose(false)
    onClose()
  }

  const handleCancelClose = () => {
    setShowConfirmClose(false)
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (!formData.formula.trim()) {
      newErrors.formula = 'Formula is required'
    } else {
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
      if (!field.placeholder?.trim()) {
        newErrors[`field_${index}_placeholder`] = 'Placeholder is required'
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleFieldChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Field management
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
          placeholder: '',
          description: '',
          unit: '',
          is_required: true,
          options: []
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

  // Drag and drop for fields
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

    newFields.splice(draggedIndex, 1)
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

  // Field options management (for dropdown/radio)
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

  // Classification management
  const addClassification = () => {
    setFormData(prev => ({
      ...prev,
      classifications: [
        ...prev.classifications,
        {
          name: '',
          options: [
            {
              value: '',
              label: '',
              conditions: [
                {
                    result_key: 'result',
                    operator: '>',
                    value: '',
                    logical_operator: 'AND'
                }
              ]
            }
          ]
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

  // Classification option management
  const addClassificationOption = (classIndex) => {
    setFormData(prev => ({
      ...prev,
      classifications: prev.classifications.map((c, i) =>
        i === classIndex
          ? {
              ...c,
              options: [
                ...(c.options || []),
                {
                  value: '',
                  label: '',
                  conditions: [
                    {
                      result_key: 'result',
                      operator: '<',
                      value: '',
                      logical_operator: null
                    }
                  ]
                }
              ]
            }
          : c
      )
    }))
  }

  const removeClassificationOption = (classIndex, optIndex) => {
    setFormData(prev => ({
      ...prev,
      classifications: prev.classifications.map((c, i) =>
        i === classIndex
          ? {
              ...c,
              options: c.options.filter((_, j) => j !== optIndex)
            }
          : c
      )
    }))
  }

  const handleClassificationOptionChange = (classIndex, optIndex, fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      classifications: prev.classifications.map((c, i) =>
        i === classIndex
          ? {
              ...c,
              options: c.options.map((opt, j) =>
                j === optIndex ? { ...opt, [fieldName]: value } : opt
              )
            }
          : c
      )
    }))
  }

  // Condition management (for classification options)
  const addCondition = (classIndex, optIndex) => {
    setFormData(prev => ({
      ...prev,
      classifications: prev.classifications.map((c, i) =>
        i === classIndex
          ? {
              ...c,
              options: c.options.map((opt, j) =>
                j === optIndex
                  ? {
                      ...opt,
                      conditions: [
                        ...(opt.conditions || []),
                        {
                          result_key: 'result',
                          operator: '>',
                          value: '',
                          logical_operator: 'AND'
                        }
                      ]
                    }
                  : opt
              )
            }
          : c
      )
    }))
  }

  const removeCondition = (classIndex, optIndex, condIndex) => {
    setFormData(prev => ({
      ...prev,
      classifications: prev.classifications.map((c, i) =>
        i === classIndex
          ? {
              ...c,
              options: c.options.map((opt, j) =>
                j === optIndex
                  ? {
                      ...opt,
                      conditions: opt.conditions.filter((_, k) => k !== condIndex)
                    }
                  : opt
              )
            }
          : c
      )
    }))
  }

  const handleConditionChange = (classIndex, optIndex, condIndex, fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      classifications: prev.classifications.map((c, i) =>
        i === classIndex
          ? {
              ...c,
              options: c.options.map((opt, j) =>
                j === optIndex
                  ? {
                      ...opt,
                      conditions: opt.conditions.map((cond, k) =>
                        k === condIndex ? { ...cond, [fieldName]: value } : cond
                      )
                    }
                  : opt
              )
            }
          : c
      )
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      if (calculator) {
        await dispatch(updateCalculatorTopic(calculator.id, formData))
      } else {
        await dispatch(createCalculatorTopic(formData))
      }
      onSuccess()
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Error saving calculator. Please try again.')
    }
  }

  return {
    formData,
    errors,
    draggedIndex,
    showConfirmClose,
    loading: loading.isCreatingTopic || loading.isUpdatingTopic,
    handleFieldChange,
    handleFieldItemChange,
    addField,
    removeField,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    addFieldOption,
    removeFieldOption,
    handleFieldOptionChange,
    addClassification,
    removeClassification,
    handleClassificationChange,
    addClassificationOption,
    removeClassificationOption,
    handleClassificationOptionChange,
    addCondition,
    removeCondition,
    handleConditionChange,
    handleSubmit,
    handleClose,
    handleConfirmClose,
    handleCancelClose,
    hasUnsavedChanges
  }
}
