import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addNodeCard, updateNodeCard } from '@store/nodeCards'
import { upload } from '@store/common/action'
import { referencedClozeNumbers } from '../../../utils/clozeTokens'

export function useCardFormModal({ nodeId, card, onSuccess, onSave, isSavingOverride }) {
  const dispatch = useDispatch()
  const { loading } = useSelector(state => state.nodeCards)

  const isEdit = !!card
  const [form, setForm] = useState({
    type: 'basic',
    front: '',
    back: '',
    blobId: null,
    imagePreviewUrl: null,
    imageFilename: null,
    references: [],
    clozeAnswers: [],
    occlusionRegions: [],
  })

  useEffect(() => {
    if (isEdit) {
      setForm({
        type: card.type || 'basic',
        front: card.front || '',
        back: card.back || '',
        blobId: card.imageBlobId ?? null,
        imagePreviewUrl: card.imageUrl ?? null,
        imageFilename: null,
        references: Array.isArray(card.references) ? card.references.map(r => ({ label: r.label || '', url: r.url || '' })) : [],
        clozeAnswers: Array.isArray(card.clozeAnswers) ? card.clozeAnswers : [],
        occlusionRegions: Array.isArray(card.occlusionRegions) ? card.occlusionRegions : [],
      })
    }
  }, [isEdit, card])

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const setClozeAnswer = (blankNumber, value) => setForm(f => {
    const clozeAnswers = [...f.clozeAnswers]
    clozeAnswers[blankNumber - 1] = value
    return { ...f, clozeAnswers }
  })

  const setOcclusionRegions = (occlusionRegions) => set('occlusionRegions', occlusionRegions)

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

  const validate = () => {
    if (form.type === 'cloze') {
      if (!form.front.trim()) return 'Teks cloze wajib diisi'
      const numbers = referencedClozeNumbers(form.front)
      if (numbers.length === 0) return 'Teks cloze harus memiliki minimal satu blank, contoh: {{1}}'
      for (const n of numbers) {
        if (!form.clozeAnswers[n - 1]?.trim()) return `Jawaban untuk blank {{${n}}} wajib diisi`
      }
      return null
    }
    if (form.type === 'occlusion') {
      if (!form.blobId) return 'Gambar wajib diunggah untuk kartu occlusion'
      if (form.occlusionRegions.length === 0) return 'Minimal satu area occlusion wajib ditambahkan'
      for (const r of form.occlusionRegions) {
        if (!r.label?.trim()) return 'Label area occlusion wajib diisi'
      }
      return null
    }
    if (!form.front.trim() || !form.back.trim()) return 'Front dan back wajib diisi'
    return null
  }

  const handleSubmit = () => {
    const error = validate()
    if (error) {
      alert(error)
      return
    }

    const payload = {
      type: form.type,
      front: form.front,
      back: form.back,
      blobId: form.blobId,
      references: form.references
        .filter(r => r.label.trim() || r.url.trim())
        .map(r => ({ label: r.label.trim(), url: r.url.trim() || undefined })),
      ...(form.type === 'cloze' && { clozeAnswers: form.clozeAnswers }),
      ...(form.type === 'occlusion' && { occlusionRegions: form.occlusionRegions }),
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
    setClozeAnswer, setOcclusionRegions,
    addReference, setReference, removeReference,
    handleImageUpload, handleRemoveImage, handleSubmit,
    isSaving,
  }
}
