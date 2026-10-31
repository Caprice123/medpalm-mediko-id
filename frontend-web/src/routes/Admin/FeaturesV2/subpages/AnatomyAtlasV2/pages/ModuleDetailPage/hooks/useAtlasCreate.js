import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import { createAtlasModelV2, fetchAtlasModelV2, clearAtlasModelDetail } from '@store/atlas/adminAction'
import { updateNodeAtlasModel } from '@store/nodeAtlas/adminAction'
import { upload } from '@store/common/action'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

export function useAtlasCreate(onSuccess, nodeId, atlas = null) {
  const dispatch = useDispatch()
  const { detail, loading: atlasLoading } = useSelector(s => s.atlas)
  const { loading: nodeAtlasLoading } = useSelector(s => s.nodeAtlas)
  const isEdit = !!atlas
  const uniqueId = atlas?.uniqueId ?? null

  // Only the uniqueId is taken from the row that opened this form; every field comes from
  // the detail endpoint, since list rows carry no editorContent.
  useEffect(() => {
    if (!uniqueId) return
    dispatch(fetchAtlasModelV2(uniqueId))
    return () => dispatch(clearAtlasModelDetail())
  }, [dispatch, uniqueId])

  // Guard against a detail left over from a previously opened model.
  const model = isEdit && detail?.uniqueId === uniqueId ? detail : null
  const isLoadingDetail = isEdit && !model

  const form = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: model?.title ?? '',
      description: model?.description ?? '',
      embedUrl: model?.embedUrl ?? '',
      editorContent: model?.editorContent ?? null,
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
        dispatch(updateNodeAtlasModel(uniqueId, payload, () => onSuccess()))
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

  return { form, handleImageUpload, isEdit, isSaving, isLoadingDetail }
}
