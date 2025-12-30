import { useFormik } from "formik"
import { useDispatch } from "react-redux"
import { useEffect } from "react"
import { fetchConstants, updateConstants } from "@/store/constant/action"
import { actions } from "@/store/constant/reducer"
import * as Yup from 'yup'

const featureSettingSchema = Yup.object({
  calculator_feature_title: Yup.string().required('Judul fitur harus diisi'),
  calculator_credit_cost: Yup.number()
    .min(0, 'Kredit harus bernilai positif')
    .required('Kredit harus diisi')
})

export const useFeatureSetting = (onClose) => {
  const dispatch = useDispatch()

  const form = useFormik({
    initialValues: {
      calculator_feature_title: '',
      calculator_feature_description: '',
      calculator_access_type: 'free',
      calculator_credit_cost: '0',
      calculator_is_active: true
    },
    validationSchema: featureSettingSchema,
    onSubmit: async (values) => {
      try {
        // Convert boolean to string for backend
        const constantsToSave = {
          ...values,
          calculator_is_active: String(values.calculator_is_active)
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
        "calculator_feature_title",
        "calculator_feature_description",
        "calculator_access_type",
        "calculator_credit_cost",
        "calculator_is_active"
      ]
      dispatch(actions.updateFilter({ key: "keys", value: keys}))
      const constants = await dispatch(fetchConstants())

      // Convert string boolean to actual boolean for toggle switch
      const formattedConstants = {
        ...constants,
        calculator_is_active: constants.calculator_is_active === 'true' || constants.calculator_is_active === true
      }

      form.setValues(formattedConstants)
    }
    onLoad()
  }, [dispatch])

  return {
    form,
  }
}
