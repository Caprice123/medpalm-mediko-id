import { useFormik } from "formik"
import { useDispatch } from "react-redux"
import { useEffect } from "react"
import { exerciseFeatureSettingSchema } from "../../validationSchema/exerciseFeatureSettingSchema"
import { fetchConstants, updateConstants } from "@/store/constant/action"
import { actions } from "@/store/constant/reducer"

export const useExerciseFeatureSetting = (onClose) => {
  const dispatch = useDispatch()

  const form = useFormik({
    initialValues: {
      exercise_feature_title: '',
      exercise_feature_description: '',
      exercise_access_type: 'subscription',
      exercise_credit_cost: '0',
      exercise_is_active: true,
      exercise_generation_model: 'gemini-1.5-flash',
      exercise_generation_prompt_text_based: '',
      exercise_generation_prompt_document_based: ''
    },
    validationSchema: exerciseFeatureSettingSchema,
    onSubmit: async (values) => {
      try {
        // Convert boolean to string for backend
        const constantsToSave = {
          ...values,
          exercise_is_active: String(values.exercise_is_active)
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
        "exercise_feature_title",
        "exercise_feature_description",
        "exercise_access_type",
        "exercise_credit_cost",
        "exercise_is_active",
        "exercise_generation_model",
        "exercise_generation_prompt_text_based",
        "exercise_generation_prompt_document_based",
      ]
      dispatch(actions.updateFilter({ key: "keys", value: keys}))
      const constants = await dispatch(fetchConstants())

      // Convert string boolean to actual boolean for toggle switch
      const formattedConstants = {
        ...constants,
        exercise_is_active: constants.exercise_is_active === 'true'
      }

      form.setValues(formattedConstants)
    }
    onLoad()
  }, [dispatch])

  return {
    form,
  }
}
