import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import { useMemo } from 'react'
import { updateAtlasModel, fetchAdminAtlasModels } from '@store/atlas/adminAction'

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
      status: selectedModel?.status || 'draft'
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

      dispatch(updateAtlasModel(selectedModel.uniqueId, modelData, onSuccess))
    }
  })

  return { form }
}
