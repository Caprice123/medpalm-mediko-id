import { useFormik } from "formik"
import { useDispatch } from "react-redux"
import { useEffect } from "react"
import { featureSettingSchema } from "../../validationSchema/featureSettingSchema"
import { fetchConstants, updateConstants } from "@/store/constant/action"
import { actions } from "@/store/constant/reducer"

export const useFeatureSetting = (onClose) => {
  const dispatch = useDispatch()

  const form = useFormik({
    initialValues: {
      flashcard_feature_title: '',
      flashcard_feature_description: '',
      flashcard_access_type: 'subscription',
      flashcard_credit_cost: '0',
      flashcard_is_active: true,
      flashcard_generation_model: 'gemini-1.5-pro',
      flashcard_generation_prompt_text_based: '',
      flashcard_generation_prompt_document_based: ''
    },
    validationSchema: featureSettingSchema,
    onSubmit: async (values) => {
      try {
        // Convert boolean to string for backend
        const constantsToSave = {
          ...values,
          flashcard_is_active: String(values.flashcard_is_active)
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
        "flashcard_feature_title",
        "flashcard_feature_description",
        "flashcard_access_type",
        "flashcard_credit_cost",
        "flashcard_is_active",
        "flashcard_generation_model",
        "flashcard_generation_prompt_text_based",
        "flashcard_generation_prompt_document_based",
      ]
      dispatch(actions.updateFilter({ key: "keys", value: keys}))
      const constants = await dispatch(fetchConstants())

      // Convert string boolean to actual boolean for toggle switch
      const formattedConstants = {
        ...constants,
        flashcard_is_active: constants.flashcard_is_active === 'true'
      }

      form.setValues(formattedConstants)
    }
    onLoad()
  }, [dispatch])

  return {
    form,
  }
}
