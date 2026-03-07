import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import { useMemo } from 'react'
import { updateAtlasModel, fetchAdminAtlasModels } from '@store/atlas/adminAction'
import { upload } from '@store/common/action'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

export const useUpdateAtlas = (closeCallback) => {
  const dispatch = useDispatch()
  const { detail: selectedModel } = useSelector(state => state.atlas)
  const { tags } = useSelector(state => state.tags)

  const topicTags = useMemo(
    () => tags.find(t => t.name === 'atlas_topic')?.tags || [],
    [tags]
  )
  const subtopicTags = useMemo(
    () => tags.find(t => t.name === 'atlas_subtopic')?.tags || [],
    [tags]
  )

  const initialTopicTags = useMemo(() => {
    if (!selectedModel?.tags) return []
    return selectedModel.tags.filter(tag => topicTags.find(ut => ut.id === tag.id))
  }, [selectedModel, topicTags])

  const initialSubtopicTags = useMemo(() => {
    if (!selectedModel?.tags) return []
    return selectedModel.tags.filter(tag => subtopicTags.find(st => st.id === tag.id))
  }, [selectedModel, subtopicTags])

  const form = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: selectedModel?.title || '',
      description: selectedModel?.description || '',
      embedUrl: selectedModel?.embedUrl || '',
      topicTags: initialTopicTags,
      subtopicTags: initialSubtopicTags,
      status: selectedModel?.status || 'draft',
      editorContent: selectedModel?.editorContent || null
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

      dispatch(updateAtlasModel(selectedModel.uniqueId, modelData, onSuccess))
    }
  })

  const handleImageUpload = async (file) => {
    const result = await dispatch(upload(file, 'atlas'))
    return `${API_BASE_URL}/api/v1/blobs/${result.blobId}`
  }

  return { form, handleImageUpload }
}
