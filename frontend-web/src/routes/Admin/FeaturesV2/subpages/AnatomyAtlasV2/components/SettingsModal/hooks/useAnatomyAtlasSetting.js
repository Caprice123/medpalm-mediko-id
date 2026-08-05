import { useFormik } from 'formik'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { fetchConstants, updateConstants } from '@/store/constant/action'
import { actions } from '@/store/constant/reducer'

const ALL_KEYS = [
  'atlas_is_active',
  'atlas_feature_title',
  'atlas_feature_description',
  'atlas_access_type',
  'atlas_credit_cost',
  'atlas_youtube_url',
  'anatomy_is_active',
  'anatomy_feature_title',
  'anatomy_feature_description',
  'anatomy_access_type',
  'anatomy_credit_cost',
  'anatomy_youtube_url',
]

export function useAnatomyAtlasSetting(onClose) {
  const dispatch = useDispatch()

  const form = useFormik({
    initialValues: {
      atlas_is_active: true,
      atlas_feature_title: '',
      atlas_feature_description: '',
      atlas_access_type: 'subscription',
      atlas_credit_cost: '0',
      atlas_youtube_url: '',
      anatomy_is_active: true,
      anatomy_feature_title: '',
      anatomy_feature_description: '',
      anatomy_access_type: 'subscription',
      anatomy_credit_cost: '0',
      anatomy_youtube_url: '',
    },
    onSubmit: async (values) => {
      const constantsToSave = {
        ...values,
        atlas_is_active: String(values.atlas_is_active),
        anatomy_is_active: String(values.anatomy_is_active),
      }
      await dispatch(updateConstants(constantsToSave, onClose))
    },
  })

  useEffect(() => {
    const onLoad = async () => {
      dispatch(actions.updateFilter({ key: 'keys', value: ALL_KEYS }))
      const constants = await dispatch(fetchConstants())
      form.setValues({
        ...constants,
        atlas_is_active: constants.atlas_is_active === 'true',
        anatomy_is_active: constants.anatomy_is_active === 'true',
      })
    }
    onLoad()
  }, [dispatch])

  return { form }
}
