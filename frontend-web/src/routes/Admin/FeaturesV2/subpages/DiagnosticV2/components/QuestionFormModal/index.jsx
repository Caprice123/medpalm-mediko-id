import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { upload } from '@store/common/action'
import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import TextInput from '@components/common/TextInput'
import Textarea from '@components/common/Textarea'
import FileUpload from '@components/common/FileUpload'
import {
  FormSection, Label, HelpText, ErrorText,
  OptionContainer, OptionBadge, OptionInput, OptionsList,
  AddOptionButton, RemoveOptionButton,
} from '@routes/Admin/FeaturesV2/subpages/McqV2/components/QuestionFormModal/QuestionFormModal.styles'

function QuestionFormModal({ nodeId, question, onClose, onSave, isSavingOverride }) {
  const dispatch = useDispatch()
  const { loading: commonLoading } = useSelector(state => state.common)
  const isEdit = !!question

  const [form, setForm] = useState({
    vignette: '',
    question: '',
    options: ['', '', '', ''],
    correctIndex: 0,
    explanation: '',
    imageCaption: '',
    blobId: null,
    imagePreviewUrl: null,
    imageFilename: null,
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (isEdit) {
      const options = question.choices?.length >= 2 ? question.choices : ['', '', '', '']
      const correctIndex = Math.max(0, options.indexOf(question.answer))
      setForm({
        vignette: question.vignette ?? '',
        question: question.question ?? '',
        options,
        correctIndex,
        explanation: question.explanation ?? '',
        imageCaption: question.image_caption ?? question.imageCaption ?? '',
        blobId: question.imageBlobId ?? null,
        imagePreviewUrl: question.imageUrl ?? null,
        imageFilename: null,
      })
    }
  }, [isEdit, question])

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const setOption = (i, val) =>
    setForm(f => { const opts = [...f.options]; opts[i] = val; return { ...f, options: opts } })

  const handleAddOption = () =>
    setForm(f => ({ ...f, options: [...f.options, ''] }))

  const handleRemoveOption = (i) => {
    if (form.options.length <= 2) return
    const newOptions = form.options.filter((_, idx) => idx !== i)
    const newCorrect = form.correctIndex === i ? 0 : form.correctIndex > i ? form.correctIndex - 1 : form.correctIndex
    setForm(f => ({ ...f, options: newOptions, correctIndex: newCorrect }))
  }

  const handleImageUpload = async (file) => {
    const result = await dispatch(upload(file, 'diagnostic-v2'))
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
      vignette: form.vignette || null,
      answerType: 'multiple_choice',
      choices: form.options,
      answer: form.options[form.correctIndex],
      explanation: form.explanation || null,
      imageBlobId: form.blobId,
      imageCaption: form.imageCaption || null,
    }
    onSave(payload)
  }

  const isUploading = commonLoading?.isUploading

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={isEdit ? 'Edit Soal' : 'Tambah Soal Baru'}
      size="large"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Batal</Button>
          <Button variant="primary" onClick={handleSubmit} disabled={isSavingOverride || isUploading}>
            {isSavingOverride ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </>
      }
    >
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
          showPreview
          actions={form.imagePreviewUrl
            ? <Button variant="primary" size="small" onClick={() => window.open(form.imagePreviewUrl, '_blank')}>Lihat</Button>
            : null}
        />
        {form.blobId && (
          <TextInput
            label="Keterangan Gambar"
            value={form.imageCaption}
            onChange={e => set('imageCaption', e.target.value)}
            placeholder="Contoh: Foto X-ray thorax PA proyeksi anteroposterior..."
            style={{ marginTop: '0.75rem' }}
          />
        )}
      </FormSection>

      <FormSection>
        <Label>Vignette (Opsional)</Label>
        <HelpText style={{ marginBottom: '0.5rem', marginTop: 0 }}>Skenario klinis yang mendeskripsikan pasien dan kondisinya. Contoh: "Laki-laki 45 tahun datang dengan nyeri dada sejak 2 jam..."</HelpText>
        <Textarea
          value={form.vignette}
          onChange={e => set('vignette', e.target.value)}
          placeholder="Tuliskan skenario klinis di sini..."
          rows={4}
        />
      </FormSection>

      <FormSection>
        <Label>Pertanyaan *</Label>
        <HelpText style={{ marginBottom: '0.5rem', marginTop: 0 }}>Pertanyaan spesifik yang diajukan berdasarkan vignette di atas. Contoh: "Apa diagnosis yang paling mungkin?"</HelpText>
        <Textarea
          value={form.question}
          onChange={e => set('question', e.target.value)}
          placeholder="Masukkan teks pertanyaan..."
          rows={3}
        />
        {errors.question && <ErrorText>{errors.question}</ErrorText>}
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
                <RemoveOptionButton type="button" onClick={e => { e.stopPropagation(); handleRemoveOption(i) }}>
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
        <Label>Penjelasan Jawaban (Opsional)</Label>
        <HelpText style={{ marginBottom: '0.5rem', marginTop: 0 }}>Jelaskan mengapa jawaban tersebut benar. Penjelasan ini akan ditampilkan kepada pengguna setelah menjawab soal.</HelpText>
        <Textarea
          value={form.explanation}
          onChange={e => set('explanation', e.target.value)}
          placeholder="Tuliskan penjelasan jawaban di sini..."
          rows={4}
        />
      </FormSection>
    </Modal>
  )
}

export default QuestionFormModal
