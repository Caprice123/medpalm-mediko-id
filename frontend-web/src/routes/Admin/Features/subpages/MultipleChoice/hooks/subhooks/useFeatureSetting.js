import { useFormik } from 'formik'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { hasFeaturePermission } from "@utils/permissionUtils"
import { fetchConstants, updateConstants } from "@/store/constant/action"
import { actions } from "@/store/constant/reducer"

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
    onSubmit: async (values) => {
      const constantsToSave = {
          ...values,
          mcq_is_active: String(values.mcq_is_active)
      }
      await dispatch(updateConstants(constantsToSave))
      onClose()
    }
  })

  useEffect(() => {
    const onLoad = async () => {
      // Only fetch constants if user has 'mcq' permission
      if (!hasFeaturePermission('mcq')) {
        console.warn('User lacks permission to fetch mcq constants')
        return
      }

      const keys = [
        "mcq_feature_title",
        "mcq_feature_description",
        "mcq_access_type",
        "mcq_credit_cost",
        "mcq_is_active",
        "mcq_generation_model",
        "mcq_generation_prompt"
      ]
      dispatch(actions.updateFilter({ key: "keys", value: keys }))
      const constants = await dispatch(fetchConstants())

      // Convert string boolean to actual boolean for toggle switch
      const formattedConstants = {
        ...constants,
        mcq_is_active: constants.mcq_is_active === 'true'
      }

      form.setValues(formattedConstants)
    }
    onLoad()
  }, [])

  return {
    form
  }
}
