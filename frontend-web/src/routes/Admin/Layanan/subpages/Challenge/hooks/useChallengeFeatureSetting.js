import { useEffect } from 'react'
import { useFormik } from 'formik'
import { useDispatch } from 'react-redux'
import { fetchConstants, updateConstants } from '@/store/constant/action'
import { actions } from '@/store/constant/reducer'

export const useChallengeFeatureSetting = (onClose) => {
  const dispatch = useDispatch()

  const form = useFormik({
    initialValues: {
      challenge_is_active: true,
      challenge_feature_title: '',
      challenge_feature_description: '',
      challenge_access_type: 'free',
    },
    onSubmit: (values) => {
      dispatch(updateConstants(values, onClose))
    },
  })

  useEffect(() => {
    const onLoad = async () => {
      const keys = [
        'challenge_is_active',
        'challenge_feature_title',
        'challenge_feature_description',
        'challenge_access_type',
      ]
      dispatch(actions.updateFilter({ key: 'keys', value: keys }))
      const constants = await dispatch(fetchConstants())
      form.setValues({
        ...constants,
        challenge_is_active: constants.challenge_is_active === 'true',
      })
    }
    onLoad()
  }, [dispatch])

  return { form }
}
