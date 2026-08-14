import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addNodeCard, updateNodeCard, fetchNodeCardDetail } from '@store/nodeCards'
import { upload } from '@store/common/action'
import { referencedClozeNumbers } from '../../../utils/clozeTokens'

const emptyForm = () => ({
  type: 'basic',
  front: '',
  back: '',
  blobId: null,
  imagePreviewUrl: null,
  imageFilename: null,
  references: [],
  clozeAnswers: [],
  occlusionRegions: [],
  explanationShort: '',
  explanationLong: '',
})

export function useCardFormModal({ nodeId, card, onSuccess, onSave, isSavingOverride }) {
  const dispatch = useDispatch()
  const { loading } = useSelector(state => state.nodeCards)

  const isEdit = !!card
  const [previewOpen, setPreviewOpen] = useState(false)
  const [isLoadingDetail, setIsLoadingDetail] = useState(isEdit)
  const [form, setForm] = useState(emptyForm)

  // The list only gives us id/type/front/back — fetch full detail (image, explanations,
  // references, cloze/occlusion data) before letting the admin edit.
  useEffect(() => {
    if (!isEdit) return
    let cancelled = false
    setIsLoadingDetail(true)
    dispatch(fetchNodeCardDetail(nodeId, card.id)).then((detail) => {
      if (cancelled) return
      setForm({
        type: detail.type || 'basic',
        front: detail.front || '',
        back: detail.back || '',
        blobId: detail.imageBlobId ?? null,
        imagePreviewUrl: detail.imageUrl ?? null,
        imageFilename: null,
        references: Array.isArray(detail.references) ? detail.references.map(r => ({ label: r.label || '', url: r.url || '' })) : [],
        clozeAnswers: Array.isArray(detail.clozeAnswers) ? detail.clozeAnswers : [],
        occlusionRegions: Array.isArray(detail.occlusionRegions) ? detail.occlusionRegions : [],
        explanationShort: detail.explanationShort || '',
        explanationLong: detail.explanationLong || '',
      })
    }).finally(() => { if (!cancelled) setIsLoadingDetail(false) })
    return () => { cancelled = true }
  }, [isEdit, card?.id])

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
      explanationShort: form.explanationShort.trim(),
      explanationLong: form.explanationLong.trim(),
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
    isLoadingDetail,
    previewOpen, setPreviewOpen,
    form, set,
    setClozeAnswer, setOcclusionRegions,
    addReference, setReference, removeReference,
    handleImageUpload, handleRemoveImage, handleSubmit,
    isSaving,
  }
}
