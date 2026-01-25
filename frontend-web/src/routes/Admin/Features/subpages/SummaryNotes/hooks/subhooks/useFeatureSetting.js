import { useFormik } from "formik"
import { useDispatch } from "react-redux"
import { useEffect } from "react"
import { fetchConstants, updateConstants } from "@store/constant/action"
import { actions } from "@store/constant/reducer"

export const useFeatureSetting = (onClose) => {
  const dispatch = useDispatch()

  const form = useFormik({
    initialValues: {
      summary_notes_feature_title: '',
      summary_notes_feature_description: '',
      summary_notes_access_type: 'subscription',
      summary_notes_credit_cost: '0',
      summary_notes_is_active: true,
      summary_notes_generation_model: 'gemini-1.5-pro',
      summary_notes_generation_prompt: ''
    },
    onSubmit: async (values) => {
      try {
        // Convert boolean to string for backend
        const constantsToSave = {
          ...values,
          summary_notes_is_active: String(values.summary_notes_is_active)
        }
        await dispatch(updateConstants(constantsToSave))
        onClose()
      } catch (error) {
        console.error('Failed to save settings:', error)
      }
    }
  })

  useEffect(() => {
    const onLoad = async () => {
      const keys = [
        'summary_notes_feature_title',
        'summary_notes_feature_description',
        'summary_notes_access_type',
        'summary_notes_credit_cost',
        'summary_notes_is_active',
        'summary_notes_generation_model',
        'summary_notes_generation_prompt'
      ]
      dispatch(actions.updateFilter({ key: "keys", value: keys }))
      const constants = await dispatch(fetchConstants(keys))

      // Convert string boolean to actual boolean for toggle switch
      const formattedConstants = {
        ...constants,
        summary_notes_is_active: constants.summary_notes_is_active === 'true'
      }

      form.setValues(formattedConstants)
    }
    onLoad()
  }, [])

  return {
    form,
  }
}
