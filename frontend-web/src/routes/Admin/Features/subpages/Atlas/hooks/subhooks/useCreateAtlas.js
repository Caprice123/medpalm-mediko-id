import { useDispatch } from 'react-redux'
import { useFormik } from 'formik'
import { createAtlasModel, fetchAdminAtlasModels } from '@store/atlas/adminAction'

export const useCreateAtlas = (closeCallback) => {
  const dispatch = useDispatch()

  const form = useFormik({
    initialValues: {
      title: '',
      description: '',
      embedUrl: '',
      topicTags: [],
      subtopicTags: [],
      status: 'draft'
    },
    onSubmit: (values, { resetForm }) => {
      const modelData = {
        title: values.title,
        description: values.description,
        embedUrl: values.embedUrl,
        tags: [...values.topicTags, ...values.subtopicTags].map(tag => tag.id),
        status: values.status
      }

      const onSuccess = () => {
        resetForm()
        if (closeCallback) closeCallback()
        dispatch(fetchAdminAtlasModels())
      }

      dispatch(createAtlasModel(modelData, onSuccess))
    }
  })

  return { form }
}
