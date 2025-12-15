import { useFormik } from 'formik'
import { useDispatch } from 'react-redux'
import { updateMcqConstants, fetchMcqConstants } from '@store/mcq/action'
import { useEffect } from 'react'

export const useFeatureSetting = (onClose) => {
  const dispatch = useDispatch()

  const form = useFormik({
    initialValues: {
      mcq_feature_title: 'Multiple Choice Quiz',
      mcq_feature_description: 'Quiz pilihan ganda dengan mode pembelajaran dan ujian',
      mcq_access_type: 'subscription',
      mcq_credit_cost: '0',
      mcq_is_active: true,
      mcq_generation_model: 'gemini-1.5-flash',
      mcq_generation_prompt: ''
    },
    onSubmit: (values) => {
      dispatch(updateMcqConstants(values, onClose))
    }
  })

  useEffect(() => {
    const onLoad = async () => {
      const constants = await dispatch(fetchMcqConstants())
      if (constants) {
        form.setValues(constants)
      }
    }
    onLoad()
  }, [])

  return {
    form
  }
}
