import { useFormik } from 'formik'
import { useDispatch } from 'react-redux'
import { hasFeaturePermission } from '@utils/permissionUtils'
import { fetchConstants, updateConstants } from '@/store/constant/action'
import { actions } from '@/store/constant/reducer'
import { useEffect } from 'react'

export const useAtlasFeatureSetting = (onClose) => {
  const dispatch = useDispatch()

  const form = useFormik({
    initialValues: {
      atlas_feature_title: '',
      atlas_feature_description: '',
      atlas_access_type: 'subscription',
      atlas_credit_cost: '0',
      atlas_is_active: true,
    },
    onSubmit: (values) => {
      dispatch(updateConstants(values, onClose))
    }
  })

  useEffect(() => {
    const onLoad = async () => {
      if (!hasFeaturePermission('atlas')) {
        console.warn('User lacks permission to fetch atlas constants')
        return
      }

      const keys = [
        'atlas_feature_title',
        'atlas_feature_description',
        'atlas_access_type',
        'atlas_credit_cost',
        'atlas_is_active',
      ]
      dispatch(actions.updateFilter({ key: 'keys', value: keys }))
      const constants = await dispatch(fetchConstants())

      const formattedConstants = {
        ...constants,
        atlas_is_active: constants.atlas_is_active === 'true'
      }

      form.setValues(formattedConstants)
    }
    onLoad()
  }, [dispatch])

  return { form }
}
