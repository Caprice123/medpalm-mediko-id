import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addNodeQuestion, updateNodeQuestion } from '@store/nodeQuestions'
import { upload } from '@store/common/action'
import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import Textarea from '@components/common/Textarea'
import FileUpload from '@components/common/FileUpload'
import {
  FormSection,
  Label,
  HelpText,
  ErrorText,
  OptionContainer,
  OptionBadge,
  OptionInput,
  OptionsList,
  AddOptionButton,
  RemoveOptionButton,
} from './QuestionFormModal.styles'

function QuestionFormModal({ nodeId, question, onClose, onSuccess, onSave, isSavingOverride }) {
  const dispatch = useDispatch()
  const { loading } = useSelector(state => state.nodeQuestions)
  const { loading: commonLoading } = useSelector(state => state.common)

  const isEdit = !!question
  const [form, setForm] = useState({
    question: '',
    options: ['', '', '', ''],
    correctIndex: 0,
    explanation: '',
    blobId: null,
    imagePreviewUrl: null,
    imageFilename: null,
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (isEdit) {
      setForm({
        question: question.question ?? '',
        options: question.options?.length >= 2 ? question.options : ['', '', '', ''],
        correctIndex: question.correctIndex ?? 0,
        explanation: question.explanation ?? '',
        blobId: question.imageBlobId ?? null,
        imagePreviewUrl: question.imageUrl ?? null,
        imageFilename: null,
      })
    }
  }, [isEdit, question])

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const setOption = (index, val) =>
    setForm(f => {
      const options = [...f.options]
      options[index] = val
      return { ...f, options }
    })

  const handleAddOption = () =>
    setForm(f => ({ ...f, options: [...f.options, ''] }))

  const handleRemoveOption = (index) => {
    if (form.options.length <= 2) return
    const newOptions = form.options.filter((_, i) => i !== index)
    const newCorrect = form.correctIndex === index
      ? 0
      : form.correctIndex > index
        ? form.correctIndex - 1
        : form.correctIndex
    setForm(f => ({ ...f, options: newOptions, correctIndex: newCorrect }))
  }

  const handleImageUpload = async (file) => {
    const result = await dispatch(upload(file, 'mcq-v2'))
    setForm(f => ({ ...f, blobId: result.blobId, imagePreviewUrl: result.url, imageFilename: result.filename }))
  }

  const handleRemoveImage = () =>
    setForm(f => ({ ...f, blobId: null, imagePreviewUrl: null, imageFilename: null }))

  const validate = () => {
    const errs = {}
    if (!form.question.trim()) errs.question = 'Teks pertanyaan wajib diisi'
    if (form.options.some(o => !o.trim())) errs.options = 'Semua pilihan jawaban wajib diisi'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    const payload = {
      question: form.question,
      options: form.options,
      correctIndex: form.correctIndex,
      explanation: form.explanation,
      blobId: form.blobId,
    }
    if (onSave) {
      onSave(payload, onSuccess)
    } else if (isEdit) {
      dispatch(updateNodeQuestion(nodeId, question.id, payload, onSuccess))
    } else {
      dispatch(addNodeQuestion(nodeId, payload, onSuccess))
    }
  }

  const isSaving = isSavingOverride ?? (isEdit ? loading.isUpdatingQuestion : loading.isAddingQuestion)
  const isUploading = commonLoading?.isUploading

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={isEdit ? 'Edit Pertanyaan' : 'Tambah Pertanyaan Baru'}
      size="large"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Batal</Button>
          <Button variant="primary" onClick={handleSubmit} disabled={isSaving || isUploading}>
            {isSaving ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </>
      }
    >
      <FormSection>
        <Label>Pertanyaan *</Label>
        <Textarea
          value={form.question}
          onChange={e => set('question', e.target.value)}
          placeholder="Masukkan teks pertanyaan..."
          rows={3}
        />
        {errors.question && <ErrorText>{errors.question}</ErrorText>}
      </FormSection>

      <FormSection>
        <Label>Gambar (Opsional)</Label>
        <FileUpload
          file={form.blobId ? { name: form.imageFilename || 'Gambar pertanyaan', type: 'image/jpeg' } : null}
          onFileSelect={handleImageUpload}
          onRemove={handleRemoveImage}
          isUploading={isUploading}
          acceptedTypes={['image/jpeg', 'image/jpg', 'image/png']}
          acceptedTypesLabel="JPEG atau PNG"
          maxSizeMB={5}
          uploadText="Klik untuk upload gambar pertanyaan"
          showPreview={true}
          actions={form.imagePreviewUrl
            ? <Button variant="primary" size="small" onClick={() => window.open(form.imagePreviewUrl, '_blank')}>Lihat</Button>
            : null
          }
        />
      </FormSection>

      <FormSection>
        <Label>Pilihan Jawaban *</Label>
        <OptionsList>
          {form.options.map((option, i) => (
            <OptionContainer
              key={i}
              $selected={form.correctIndex === i}
              onClick={() => set('correctIndex', i)}
            >
              <OptionBadge $selected={form.correctIndex === i}>
                {String.fromCharCode(65 + i)}
              </OptionBadge>
              <OptionInput
                type="text"
                value={option}
                onChange={e => { e.stopPropagation(); setOption(i, e.target.value) }}
                onClick={e => e.stopPropagation()}
                placeholder={`Pilihan ${String.fromCharCode(65 + i)}`}
              />
              {form.options.length > 2 && (
                <RemoveOptionButton
                  type="button"
                  onClick={e => { e.stopPropagation(); handleRemoveOption(i) }}
                >
                  Hapus
                </RemoveOptionButton>
              )}
            </OptionContainer>
          ))}

          <AddOptionButton type="button" onClick={handleAddOption}>
            + Tambah Pilihan
          </AddOptionButton>
        </OptionsList>
        {errors.options && <ErrorText>{errors.options}</ErrorText>}
        <HelpText>Klik pada pilihan untuk menjadikannya jawaban benar. Dapat menambah atau menghapus pilihan sesuai kebutuhan.</HelpText>
      </FormSection>

      <FormSection>
        <Label>Penjelasan (Opsional)</Label>
        <Textarea
          value={form.explanation}
          onChange={e => set('explanation', e.target.value)}
          placeholder="Jelaskan mengapa jawaban tersebut benar..."
          rows={3}
        />
      </FormSection>
    </Modal>
  )
}

export default QuestionFormModal
