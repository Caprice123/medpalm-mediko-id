import { useDispatch } from 'react-redux'
import { useFormik } from 'formik'
import { createAtlasModel, fetchAdminAtlasModels } from '@store/atlas/adminAction'
import { upload } from '@store/common/action'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

export const useCreateAtlas = (closeCallback) => {
  const dispatch = useDispatch()

  const form = useFormik({
    initialValues: {
      title: '',
      description: '',
      embedUrl: '',
      topicTags: [],
      subtopicTags: [],
      status: 'draft',
      editorContent: null
    },
    onSubmit: (values, { resetForm }) => {
      const modelData = {
        title: values.title,
        description: values.description,
        embedUrl: values.embedUrl,
        tags: [...values.topicTags, ...values.subtopicTags].map(tag => tag.id),
        status: values.status,
        editorContent: values.editorContent
      }

      const onSuccess = () => {
        resetForm()
        if (closeCallback) closeCallback()
        dispatch(fetchAdminAtlasModels())
      }

      dispatch(createAtlasModel(modelData, onSuccess))
    }
  })

  const handleImageUpload = async (file) => {
    const result = await dispatch(upload(file, 'atlas'))
    return `${API_BASE_URL}/api/v1/blobs/${result.blobId}`
  }

  return { form, handleImageUpload }
}
