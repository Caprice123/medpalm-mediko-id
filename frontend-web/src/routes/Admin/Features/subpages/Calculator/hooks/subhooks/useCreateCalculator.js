import { useDispatch } from 'react-redux'
import { createCalculatorTopic } from '@store/calculator/action'
import { fetchTagGroups } from '@store/tagGroups/action'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { fetchAdminCalculatorTopics } from '../../../../../../../store/calculator/action'
import { createCalculatorTopicSchema } from '../../validationSchema/createCalculatorSchema'
import { useState } from 'react'

export const useCreateCalculator = (setUiState) => {
  const dispatch = useDispatch()

  const formik = useFormik({
    initialValues: {
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
    },
    validationSchema: createCalculatorTopicSchema,
    onSubmit: async (values) => {
        const onSuccess = async () => {
            setUiState(prev => ({ ...prev, isCalculatorModalOpen: false, mode: null }))
            dispatch(fetchAdminCalculatorTopics())
        }
        await dispatch(createCalculatorTopic(values, onSuccess))
    }
  })
  const [draggedIndex, setDraggedIndex] = useState(null)


  const onOpen = async () => {
    // Fetch tags filtered by "kategori" tag group
    await dispatch(fetchTagGroups(['kategori']))
    setUiState(prev => ({ ...prev, isCalculatorModalOpen: true, mode: "create" }))
    formik.resetForm()
  }

  const onClose = () => {
    if (JSON.stringify(formik.values) === JSON.stringify(formik.initialValues)) {
      setUiState(prev => ({ ...prev, isCalculatorModalOpen: false, mode: null }))
    } else {
      setUiState(prev => ({ ...prev, isConfirmationCloseOpen: true }))
    }
    formik.resetForm()
  }

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

    const newFields = [...formik.values.fields]
    const draggedField = newFields[draggedIndex]

    newFields.splice(draggedIndex, 1)
    newFields.splice(targetIndex, 0, draggedField)

    formik.setFieldValue("fields", newFields)
    setDraggedIndex(null)
  }
  
  const handleDragEnd = () => {
    setDraggedIndex(null)
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

  return {
    formik,
    onOpen,
    onClose,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd
  }
}
