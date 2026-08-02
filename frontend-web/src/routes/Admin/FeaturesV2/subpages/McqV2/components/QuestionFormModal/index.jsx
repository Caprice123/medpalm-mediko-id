import { useSelector } from 'react-redux'
import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import Textarea from '@components/common/Textarea'
import TextInput from '@components/common/TextInput'
import FileUpload from '@components/common/FileUpload'
import { useQuestionFormModal } from './hooks/useQuestionFormModal'
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
  const isUploading = useSelector(state => state.common.loading?.isUploading)
  const {
    isEdit,
    form, errors, set,
    addReference, setReference, removeReference,
    setOption, handleAddOption, handleRemoveOption,
    handleImageUpload, handleRemoveImage, handleSubmit,
    isSaving,
  } = useQuestionFormModal({ nodeId, question, onSuccess, onSave, isSavingOverride })

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

      <FormSection>
        <Label>Referensi (Opsional)</Label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {form.references.map((ref, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <TextInput value={ref.label} onChange={e => setReference(i, 'label', e.target.value)} placeholder="Nama sumber" />
              <TextInput value={ref.url} onChange={e => setReference(i, 'url', e.target.value)} placeholder="Link (opsional)" />
              <Button variant="danger" onClick={() => removeReference(i)}>Hapus</Button>
            </div>
          ))}
          <Button onClick={addReference}>+ Tambah Referensi</Button>
        </div>
      </FormSection>
    </Modal>
  )
}

export default QuestionFormModal
