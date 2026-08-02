import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addNodeCard, updateNodeCard } from '@store/nodeCards'
import { upload } from '@store/common/action'

export function useCardFormModal({ nodeId, card, onSuccess, onSave, isSavingOverride }) {
  const dispatch = useDispatch()
  const { loading } = useSelector(state => state.nodeCards)

  const isEdit = !!card
  const [form, setForm] = useState({
    front: '',
    back: '',
    blobId: null,
    imagePreviewUrl: null,
    imageFilename: null,
    references: [],
  })

  useEffect(() => {
    if (isEdit) {
      setForm({
        front: card.front,
        back: card.back,
        blobId: card.imageBlobId ?? null,
        imagePreviewUrl: card.imageUrl ?? null,
        imageFilename: null,
        references: Array.isArray(card.references) ? card.references.map(r => ({ label: r.label || '', url: r.url || '' })) : [],
      })
    }
  }, [isEdit, card])

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const addReference = () => setForm(f => ({ ...f, references: [...f.references, { label: '', url: '' }] }))
  const setReference = (index, key, val) =>
    setForm(f => {
      const references = [...f.references]
      references[index] = { ...references[index], [key]: val }
      return { ...f, references }
    })
  const removeReference = (index) => setForm(f => ({ ...f, references: f.references.filter((_, i) => i !== index) }))

  const handleImageUpload = async (file) => {
    const result = await dispatch(upload(file, 'flashcard-v2'))
    setForm(f => ({ ...f, blobId: result.blobId, imagePreviewUrl: result.url, imageFilename: result.filename }))
  }

  const handleRemoveImage = () => setForm(f => ({ ...f, blobId: null, imagePreviewUrl: null, imageFilename: null }))

  const handleSubmit = () => {
    if (!form.front.trim() || !form.back.trim()) {
      alert('Front dan back wajib diisi')
      return
    }
    const payload = {
      front: form.front,
      back: form.back,
      blobId: form.blobId,
      references: form.references
        .filter(r => r.label.trim() || r.url.trim())
        .map(r => ({ label: r.label.trim(), url: r.url.trim() || undefined })),
    }
    if (onSave) {
      onSave(payload, onSuccess)
    } else if (isEdit) {
      dispatch(updateNodeCard(nodeId, card.id, payload, onSuccess))
    } else {
      dispatch(addNodeCard(nodeId, payload, onSuccess))
    }
  }

  const isSaving = isSavingOverride ?? (isEdit ? loading.isUpdatingCard : loading.isAddingCard)

  return {
    isEdit,
    form, set,
    addReference, setReference, removeReference,
    handleImageUpload, handleRemoveImage, handleSubmit,
    isSaving,
  }
}
