import { useDispatch } from 'react-redux'
import { updateCalculatorTopic, fetchAdminCalculatorTopic } from '@store/calculator/action'
import { fetchTagGroups } from '@store/tagGroups/action'
import { useFormik } from 'formik'
import * as Yup from 'yup'

export const useUpdateCalculator = (setUiState) => {
  const dispatch = useDispatch()

  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    formula: Yup.string().required('Formula is required'),
    result_label: Yup.string().required('Result label is required'),
    fields: Yup.array().min(1, 'At least one field is required')
  })

  const formik = useFormik({
    initialValues: {
      id: null,
      uniqueId: null,
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
    validationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      try {
        console.log(values)
        await dispatch(updateCalculatorTopic(values.uniqueId, values))
        setUiState(prev => ({ ...prev, isCalculatorModalOpen: false, mode: null }))
      } catch (error) {
        console.error('Error updating calculator:', error)
        alert('Error updating calculator. Please try again.')
      }
    }
  })

  const onOpen = async (calculator) => {
    try {
      // Fetch tags filtered by "kategori" tag group
      await dispatch(fetchTagGroups(['kategori']))

      // Fetch full calculator details
      const fullCalculator = await dispatch(fetchAdminCalculatorTopic(calculator.id))

      setUiState(prev => ({ ...prev, isCalculatorModalOpen: true, mode: "update" }))

      formik.setValues({
        id: fullCalculator.id,
        uniqueId: fullCalculator.uniqueId,
        title: fullCalculator.title,
        description: fullCalculator.description || '',
        clinical_references: fullCalculator.clinical_references || [],
        tags: fullCalculator.tags || [],
        formula: fullCalculator.formula,
        result_label: fullCalculator.result_label,
        result_unit: fullCalculator.result_unit || '',
        fields: fullCalculator.fields || [],
        classifications: fullCalculator.classifications || [],
        status: fullCalculator.status || 'draft'
      })
    } catch (error) {
      console.error('Failed to fetch calculator details:', error)
      alert('Failed to load calculator details')
    }
  }

  const onClose = () => {
    setUiState(prev => ({ ...prev, isCalculatorModalOpen: false, mode: null }))
    formik.resetForm()
  }

  return {
    formik,
    onOpen,
    onClose
  }
}
