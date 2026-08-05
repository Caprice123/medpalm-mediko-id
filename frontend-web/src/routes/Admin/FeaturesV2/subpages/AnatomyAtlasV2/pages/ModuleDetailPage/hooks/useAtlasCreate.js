import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import { createAtlasModelV2 } from '@store/atlas/adminAction'
import { updateNodeAtlasModel } from '@store/nodeAtlas/adminAction'
import { upload } from '@store/common/action'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

export function useAtlasCreate(onSuccess, nodeId, atlas = null) {
  const dispatch = useDispatch()
  const { loading: atlasLoading } = useSelector(s => s.atlas)
  const { loading: nodeAtlasLoading } = useSelector(s => s.nodeAtlas)
  const isEdit = !!atlas

  const form = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: atlas?.title ?? '',
      description: atlas?.description ?? '',
      embedUrl: atlas?.embedUrl ?? '',
      editorContent: atlas?.editorContent ?? null,
    },
    onSubmit: (values, { resetForm }) => {
      const payload = {
        title: values.title.trim(),
        description: values.description.trim(),
        embedUrl: values.embedUrl.trim(),
        editorContent: values.editorContent,
        status: 'published',
        tags: [],
      }
      if (isEdit) {
        dispatch(updateNodeAtlasModel(atlas.uniqueId, payload, () => onSuccess()))
      } else {
        dispatch(createAtlasModelV2({ ...payload, nodeId }, () => {
          resetForm()
          onSuccess()
        }))
      }
    },
  })

  const handleImageUpload = async (file) => {
    const result = await dispatch(upload(file, 'atlas'))
    return `${API_BASE}/api/v1/blobs/${result.blobId}`
  }

  const isSaving = isEdit ? nodeAtlasLoading.isUpdatingModel : atlasLoading.isCreateAtlasLoading

  return { form, handleImageUpload, isEdit, isSaving }
}
