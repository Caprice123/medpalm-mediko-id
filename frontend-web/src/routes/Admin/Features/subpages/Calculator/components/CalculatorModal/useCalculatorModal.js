import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createCalculatorTopic, updateCalculatorTopic } from '@store/calculator/action'
import { fetchTags } from '@store/tags/action'
import { upload } from '@store/common/action'

export const useCalculatorModal = ({ isOpen, calculator, onSuccess, onClose }) => {
  const dispatch = useDispatch()
  const { loading } = useSelector(state => state.calculator)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    clinical_references: [],
    tags: [],
    formula: '',
    result_label: '',
    result_unit: '',
    fields: [],
    classifications: [],
    status: 'draft'
  })

  const [newReference, setNewReference] = useState('')

  const [initialFormData, setInitialFormData] = useState(null)
  const [errors, setErrors] = useState({})
  const [showConfirmClose, setShowConfirmClose] = useState(false)

  // Fetch tags filtered by "kategori" tag group on mount
  useEffect(() => {
    if (isOpen) {
      dispatch(fetchTags(['kategori']))
    }
  }, [dispatch, isOpen])

  // Get category tags from tags
  const { tags } = useSelector(state => state.tags)
  const categoryTags = useMemo(() =>
    tags.find(tag => tag.name === 'kategori')?.tags ?? []
  , [tags])
  const selectedTags = useMemo(() => formData.tags || [], [formData.tags])

  useEffect(() => {
    if (calculator) {
      const data = {
        title: calculator.title,
        description: calculator.description || '',
        clinical_references: calculator.clinical_references || [],
        tags: calculator.tags || [],
        formula: calculator.formula,
        result_label: calculator.result_label,
        result_unit: calculator.result_unit || '',
        fields: (calculator.fields || []).map(field => ({
          ...field,
          _id: field._id || `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        })),
        classifications: calculator.classifications || [],
        status: calculator.status || 'draft'
      }
      setFormData(data)
      setInitialFormData(JSON.stringify(data))
    } else {
      const data = {
        title: '',
        description: '',
        clinical_references: [],
        tags: [],
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
    setShowConfirmClose(false)
    setNewReference('')
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

  const handleFieldChange = useCallback((e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }, [])

  // Field management
  const handleFieldItemChange = useCallback((index, fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map((f, i) =>
        i === index ? { ...f, [fieldName]: value } : f
      )
    }))
  }, [])

  const addField = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      fields: [
        ...prev.fields,
        {
          _id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          key: '',
          type: 'number',
          label: '',
          placeholder: '',
          description: '',
          unit: '',
          display_conditions: [],
          is_required: true,
          options: []
        }
      ]
    }))
  }, [])

  const removeField = useCallback((index) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index)
    }))
  }, [])

  // Drag and drop for fields using @dnd-kit
  const handleDragEnd = useCallback((event) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setFormData(prev => {
        const oldIndex = prev.fields.findIndex(f => f._id === active.id)
        const newIndex = prev.fields.findIndex(f => f._id === over.id)
        const newFields = [...prev.fields]
        const [removed] = newFields.splice(oldIndex, 1)
        newFields.splice(newIndex, 0, removed)
        return { ...prev, fields: newFields }
      })
    }
  }, [])

  // Field options management (for dropdown/radio)
  const addFieldOption = useCallback((fieldIndex) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map((f, i) =>
        i === fieldIndex
          ? {
              ...f,
              options: [
                ...(f.options || []),
                { value: '', label: '', image: null }
              ]
            }
          : f
      )
    }))
  }, [])

  const removeFieldOption = useCallback((fieldIndex, optionIndex) => {
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
  }, [])

  const handleFieldOptionChange = useCallback((fieldIndex, optionIndex, fieldName, value) => {
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
  }, [])

  const handleOptionImageUpload = useCallback(async (fieldIndex, optionIndex, file) => {
    try {
      // Upload image to centralized endpoint
      const result = await dispatch(upload(file, 'calculator'))
      setFormData(prev => ({
        ...prev,
        fields: prev.fields.map((f, i) =>
          i === fieldIndex
            ? {
                ...f,
                options: f.options.map((opt, j) =>
                  j === optionIndex
                    ? {
                        ...opt,
                        image: {
                          id: result.blobId, // Blob ID for backend
                          url: result.url, // Temporary presigned URL for preview
                          key: result.key,
                          filename: result.filename,
                          contentType: result.contentType,
                          byteSize: result.byteSize,
                        }
                      }
                    : opt
                )
              }
            : f
        )
      }))
    } catch (error) {
      console.error('Failed to upload option image:', error)
      alert('Failed to upload image. Please try again.')
    }
  }, [dispatch])

  const handleOptionImageRemove = useCallback((fieldIndex, optionIndex) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map((f, i) =>
        i === fieldIndex
          ? {
              ...f,
              options: f.options.map((opt, j) =>
                j === optionIndex ? { ...opt, image: null } : opt
              )
            }
          : f
      )
    }))
  }, [])

  // Display conditions management
  const addDisplayCondition = useCallback((fieldIndex) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map((f, i) =>
        i === fieldIndex
          ? {
              ...f,
              display_conditions: [
                ...(f.display_conditions || []),
                { field_key: '', operator: '==', value: '', logical_operator: 'AND' }
              ]
            }
          : f
      )
    }))
  }, [])

  const removeDisplayCondition = useCallback((fieldIndex, conditionIndex) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map((f, i) =>
        i === fieldIndex
          ? {
              ...f,
              display_conditions: (f.display_conditions || []).filter((_, j) => j !== conditionIndex)
            }
          : f
      )
    }))
  }, [])

  const handleDisplayConditionChange = useCallback((fieldIndex, conditionIndex, fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map((f, i) =>
        i === fieldIndex
          ? {
              ...f,
              display_conditions: (f.display_conditions || []).map((cond, j) =>
                j === conditionIndex ? { ...cond, [fieldName]: value } : cond
              )
            }
          : f
      )
    }))
  }, [])

  // Classification management
  const addClassification = useCallback(() => {
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
  }, [])

  const removeClassification = useCallback((index) => {
    setFormData(prev => ({
      ...prev,
      classifications: prev.classifications.filter((_, i) => i !== index)
    }))
  }, [])

  const handleClassificationChange = useCallback((index, fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      classifications: prev.classifications.map((c, i) =>
        i === index ? { ...c, [fieldName]: value } : c
      )
    }))
  }, [])

  // Classification option management
  const addClassificationOption = useCallback((classIndex) => {
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
  }, [])

  const removeClassificationOption = useCallback((classIndex, optIndex) => {
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
  }, [])

  const handleClassificationOptionChange = useCallback((classIndex, optIndex, fieldName, value) => {
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
  }, [])

  // Condition management (for classification options)
  const addCondition = useCallback((classIndex, optIndex) => {
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
  }, [])

  const removeCondition = useCallback((classIndex, optIndex, condIndex) => {
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
  }, [])

  const handleConditionChange = useCallback((classIndex, optIndex, condIndex, fieldName, value) => {
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
  }, [])

  // Clinical References handlers
  const addClinicalReference = useCallback(() => {
    const trimmedRef = newReference.trim()
    if (!trimmedRef) {
      return
    }
    setFormData(prev => ({
      ...prev,
      clinical_references: [...prev.clinical_references, trimmedRef]
    }))
    setNewReference('') // Clear input and hide it
  }, [newReference])

  const removeClinicalReference = useCallback((index) => {
    setFormData(prev => ({
      ...prev,
      clinical_references: prev.clinical_references.filter((_, i) => i !== index)
    }))
  }, [])

  // Tag handlers
  const handleTagsChange = useCallback((newTags) => {
    setFormData(prev => ({
      ...prev,
      tags: newTags
    }))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // Transform formData to send only blobIds for option images
    const submitData = {
      ...formData,
      fields: formData.fields.map(field => {
        const { _id, ...fieldWithoutId } = field
        return {
          ...fieldWithoutId,
          options: field.options?.map(option => ({
            value: option.value,
            label: option.label,
            blobId: option.image?.id || null
          })) || []
        }
      })
    }

    if (calculator) {
        await dispatch(updateCalculatorTopic(calculator.uniqueId, submitData))
    } else {
        await dispatch(createCalculatorTopic(submitData))
    }
    onSuccess()
  }

  return {
    formData,
    setFormData,
    errors,
    showConfirmClose,
    loading: loading.isCreateCalculatorLoading || loading.isUpdateCalculatorLoading,
    // Clinical References
    newReference,
    setNewReference,
    addClinicalReference,
    removeClinicalReference,
    // Tags
    selectedTags,
    categoryTags,
    handleTagsChange,
    // Fields
    handleFieldChange,
    handleFieldItemChange,
    addField,
    removeField,
    handleDragEnd,
    addFieldOption,
    removeFieldOption,
    handleFieldOptionChange,
    handleOptionImageUpload,
    handleOptionImageRemove,
    addDisplayCondition,
    removeDisplayCondition,
    handleDisplayConditionChange,
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
