import { useFormik } from 'formik'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { fetchConstants, updateConstants } from '@/store/constant/action'
import { actions } from '@/store/constant/reducer'

export function useAnatomyAtlasSetting(onClose) {
  const dispatch = useDispatch()

  const form = useFormik({
    initialValues: {
      anatomy_atlas_is_active: true,
      anatomy_atlas_feature_title: '',
      anatomy_atlas_feature_description: '',
      anatomy_atlas_access_type: 'subscription',
      anatomy_atlas_credit_cost: '0',
      anatomy_atlas_youtube_url: '',
    },
    onSubmit: async (values) => {
      const constantsToSave = {
        ...values,
        anatomy_atlas_is_active: String(values.anatomy_atlas_is_active),
      }
      await dispatch(updateConstants(constantsToSave, onClose))
    },
  })

  useEffect(() => {
    const onLoad = async () => {
      const keys = [
        'anatomy_atlas_is_active',
        'anatomy_atlas_feature_title',
        'anatomy_atlas_feature_description',
        'anatomy_atlas_access_type',
        'anatomy_atlas_credit_cost',
        'anatomy_atlas_youtube_url',
      ]
      dispatch(actions.updateFilter({ key: 'keys', value: keys }))
      const constants = await dispatch(fetchConstants())
      form.setValues({
        ...constants,
        anatomy_atlas_is_active: constants.anatomy_atlas_is_active === 'true',
      })
    }
    onLoad()
  }, [dispatch])

  return { form }
}
