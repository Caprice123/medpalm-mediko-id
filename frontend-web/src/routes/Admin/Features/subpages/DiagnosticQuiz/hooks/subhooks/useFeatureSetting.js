import { useFormik } from "formik"
import { featureSettingSchema } from "../../validationSchema/featureSettingSchema"
import { useDispatch } from "react-redux"
import { hasFeaturePermission } from "@utils/permissionUtils"
import { fetchConstants, updateConstants } from "@/store/constant/action"
import { actions } from "@/store/constant/reducer"
import { useEffect } from "react"

export const useFeatureSetting = (onClose) => {
    const dispatch = useDispatch()
    const form = useFormik({
        initialValues: {
            diagnostic_feature_title: '',
            diagnostic_feature_description: '',
            diagnostic_access_type: 'subscription',
            diagnostic_credit_cost: '0',
            diagnostic_is_active: true,
            diagnostic_section_title: 'Identifikasi Bagian Anatomi',
            diagnostic_youtube_url: ''
        },
        validationSchema: featureSettingSchema,
        onSubmit: (values) => {
            dispatch(updateConstants(values, onClose))
        }
    })

  useEffect(() => {
    const onLoad = async () => {
      // Only fetch constants if user has 'diagnostic' permission
      if (!hasFeaturePermission('diagnostic')) {
        console.warn('User lacks permission to fetch diagnostic constants')
        return
      }

      const keys = [
        "diagnostic_feature_title",
        "diagnostic_feature_description",
        "diagnostic_access_type",
        "diagnostic_credit_cost",
        "diagnostic_is_active",
        "diagnostic_section_title",
        "diagnostic_youtube_url"
      ]
      dispatch(actions.updateFilter({ key: "keys", value: keys }))
      const constants = await dispatch(fetchConstants())

      // Convert string boolean to actual boolean for toggle switch
      const formattedConstants = {
        ...constants,
        diagnostic_is_active: constants.diagnostic_is_active === 'true'
      }

      form.setValues(formattedConstants)
    }
    onLoad()
  }, [dispatch])

    return {
        form,
    }
}