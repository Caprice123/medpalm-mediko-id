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
            anatomy_feature_title: '',
            anatomy_feature_description: '',
            anatomy_access_type: 'subscription',
            anatomy_credit_cost: '0',
            anatomy_is_active: true,
            anatomy_section_title: 'Identifikasi Bagian Anatomi'
        },
        validationSchema: featureSettingSchema,
        onSubmit: (values) => {
            dispatch(updateConstants(values, onClose))
        }
    })

  useEffect(() => {
    const onLoad = async () => {
      // Only fetch constants if user has 'anatomy' permission
      if (!hasFeaturePermission('anatomy')) {
        console.warn('User lacks permission to fetch anatomy constants')
        return
      }

      const keys = [
        "anatomy_feature_title",
        "anatomy_feature_description",
        "anatomy_access_type",
        "anatomy_credit_cost",
        "anatomy_is_active",
        "anatomy_section_title"
      ]
      dispatch(actions.updateFilter({ key: "keys", value: keys }))
      const constants = await dispatch(fetchConstants())

      // Convert string boolean to actual boolean for toggle switch
      const formattedConstants = {
        ...constants,
        anatomy_is_active: constants.anatomy_is_active === 'true'
      }

      form.setValues(formattedConstants)
    }
    onLoad()
  }, [dispatch])

    return {
        form,
    }
}