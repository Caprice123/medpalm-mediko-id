import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createCalculatorTopic, updateCalculatorTopic } from '@store/calculator/adminAction'
import { fetchAdminTags } from '@store/tags/adminAction'
import { upload } from '@store/common/action'

export const useCalculatorModal = ({ isOpen, calculator, onSuccess, onClose }) => {
  const dispatch = useDispatch()
  const { loading } = useSelector(state => state.calculator)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    clinical_references: [],
    tags: [],
    fields: [],
    results: [],
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
      dispatch(fetchAdminTags(['kategori']))
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
        fields: (calculator.fields || []).map(field => ({
          ...field,
          _id: field._id || `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        })),
        results: (calculator.results || []).map(result => ({
          ...result,
          _id: result._id || `result_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
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
        fields: [],
        results: [],
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

    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (formData.fields.length === 0) newErrors.fields = 'At least one field is required'
    if (formData.results.length === 0) newErrors.results = 'At least one result is required'

    formData.fields.forEach((field, index) => {
      if (!field.key?.trim()) newErrors[`field_${index}_key`] = 'Key is required'
      if (!field.label?.trim()) newErrors[`field_${index}_label`] = 'Label is required'
      if (!field.placeholder?.trim()) newErrors[`field_${index}_placeholder`] = 'Placeholder is required'
    })

    formData.results.forEach((result, index) => {
      if (!result.formula?.trim()) newErrors[`result_${index}_formula`] = 'Formula is required'
      if (!result.result_label?.trim()) newErrors[`result_${index}_result_label`] = 'Label is required'
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
          options: [],
          image: null
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

  const handleFieldImageUpload = useCallback(async (fieldIndex, file) => {
    try {
      const result = await dispatch(upload(file, 'calculator'))
      setFormData(prev => ({
        ...prev,
        fields: prev.fields.map((f, i) =>
          i === fieldIndex
            ? {
                ...f,
                image: {
                  id: result.blobId,
                  url: result.url,
                  key: result.key,
                  filename: result.filename,
                  contentType: result.contentType,
                  byteSize: result.byteSize,
                }
              }
            : f
        )
      }))
    } catch (error) {
      console.error('Failed to upload field image:', error)
      alert('Failed to upload image. Please try again.')
    }
  }, [dispatch])

  const handleFieldImageRemove = useCallback((fieldIndex) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map((f, i) =>
        i === fieldIndex ? { ...f, image: null } : f
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

  // Result management
  const addResult = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      results: [
        ...prev.results,
        {
          _id: `result_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          key: '',
          formula: '',
          result_label: '',
          result_unit: '',
          classifications: []
        }
      ]
    }))
  }, [])

  const removeResult = useCallback((resultIndex) => {
    setFormData(prev => ({
      ...prev,
      results: prev.results.filter((_, i) => i !== resultIndex)
    }))
  }, [])

  const handleResultChange = useCallback((resultIndex, fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      results: prev.results.map((r, i) =>
        i === resultIndex ? { ...r, [fieldName]: value } : r
      )
    }))
  }, [])

  // Classification management (topic-level)
  const addClassification = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      classifications: [
        ...(prev.classifications || []),
        { name: '', options: [{ value: '', label: '', conditions: [{ result_key: 'result', operator: '>', value: '', logical_operator: 'AND' }] }] }
      ]
    }))
  }, [])

  const removeClassification = useCallback((classIndex) => {
    setFormData(prev => ({
      ...prev,
      classifications: prev.classifications.filter((_, j) => j !== classIndex)
    }))
  }, [])

  const handleClassificationChange = useCallback((classIndex, fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      classifications: prev.classifications.map((c, j) => j === classIndex ? { ...c, [fieldName]: value } : c)
    }))
  }, [])

  const addClassificationOption = useCallback((classIndex) => {
    setFormData(prev => ({
      ...prev,
      classifications: prev.classifications.map((c, j) =>
        j === classIndex
          ? { ...c, options: [...(c.options || []), { value: '', label: '', conditions: [{ result_key: 'result', operator: '<', value: '', logical_operator: null }] }] }
          : c
      )
    }))
  }, [])

  const removeClassificationOption = useCallback((classIndex, optIndex) => {
    setFormData(prev => ({
      ...prev,
      classifications: prev.classifications.map((c, j) =>
        j === classIndex ? { ...c, options: c.options.filter((_, k) => k !== optIndex) } : c
      )
    }))
  }, [])

  const handleClassificationOptionChange = useCallback((classIndex, optIndex, fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      classifications: prev.classifications.map((c, j) =>
        j === classIndex
          ? { ...c, options: c.options.map((opt, k) => k === optIndex ? { ...opt, [fieldName]: value } : opt) }
          : c
      )
    }))
  }, [])

  const addCondition = useCallback((classIndex, optIndex) => {
    setFormData(prev => ({
      ...prev,
      classifications: prev.classifications.map((c, j) =>
        j === classIndex
          ? {
              ...c,
              options: c.options.map((opt, k) =>
                k === optIndex
                  ? { ...opt, conditions: [...(opt.conditions || []), { result_key: 'result', operator: '>', value: '', logical_operator: 'AND' }] }
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
      classifications: prev.classifications.map((c, j) =>
        j === classIndex
          ? { ...c, options: c.options.map((opt, k) => k === optIndex ? { ...opt, conditions: opt.conditions.filter((_, l) => l !== condIndex) } : opt) }
          : c
      )
    }))
  }, [])

  const handleConditionChange = useCallback((classIndex, optIndex, condIndex, fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      classifications: prev.classifications.map((c, j) =>
        j === classIndex
          ? {
              ...c,
              options: c.options.map((opt, k) =>
                k === optIndex
                  ? { ...opt, conditions: opt.conditions.map((cond, l) => l === condIndex ? { ...cond, [fieldName]: value } : cond) }
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

    const submitData = {
      ...formData,
      fields: formData.fields.map(field => {
        const { _id, ...fieldWithoutId } = field
        return {
          ...fieldWithoutId,
          blobId: field.image?.id || null,
          options: field.options?.map(option => ({
            value: option.value,
            label: option.label,
            blobId: option.image?.id || null
          })) || []
        }
      }),
      results: formData.results.map(result => {
        const { _id, ...resultWithoutId } = result
        return resultWithoutId
      }),
      classifications: formData.classifications
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
    handleFieldImageUpload,
    handleFieldImageRemove,
    addDisplayCondition,
    removeDisplayCondition,
    handleDisplayConditionChange,
    // Results
    addResult,
    removeResult,
    handleResultChange,
    // Classifications (topic-level)
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
