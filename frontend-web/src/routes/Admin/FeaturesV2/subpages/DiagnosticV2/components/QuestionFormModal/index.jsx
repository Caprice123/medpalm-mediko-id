import { useState } from 'react'
import { useSelector } from 'react-redux'
import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import TextInput from '@components/common/TextInput'
import Textarea from '@components/common/Textarea'
import FileUpload from '@components/common/FileUpload'
import Loading from '@components/common/Loading'
import SummaryNoteTreePicker from '@routes/Admin/FeaturesV2/subpages/FlashcardV2/components/CardFormModal/components/SummaryNoteTreePicker'
import { useQuestionFormModal } from './hooks/useQuestionFormModal'
import { useQuestionSummaryNoteLinks } from './hooks/useQuestionSummaryNoteLinks'
import {
  FormSection, Label, HelpText, ErrorText,
  OptionContainer, OptionBadge, OptionInput, OptionsList,
  AddOptionButton, RemoveOptionButton,
} from '@routes/Admin/FeaturesV2/subpages/McqV2/components/QuestionFormModal/QuestionFormModal.styles'

function QuestionFormModal({ nodeId, question, onClose, onSave, isSavingOverride }) {
  const isUploading = useSelector(state => state.common.loading?.isUploading)
  const {
    isEdit, isLoadingDetail, form, errors, set,
    setOption, handleAddOption, handleRemoveOption,
    addReference, setReference, removeReference,
    handleImageUpload, handleRemoveImage, handleSubmit,
  } = useQuestionFormModal({ nodeId, question, onSave })

  const {
    relations: linkedNotes,
    addNote,
    updateLabel,
    removeNote,
    isSyncing: isSyncingNotes,
  } = useQuestionSummaryNoteLinks(question?.id)

  const [notePickerOpen, setNotePickerOpen] = useState(false)
  const [labelDrafts, setLabelDrafts] = useState({})

  const commitLabel = (relation, value) => {
    setLabelDrafts(d => { const next = { ...d }; delete next[relation.id]; return next })
    if (value !== (relation.label || '')) updateLabel(relation.id, value)
  }

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={isEdit ? 'Edit Soal' : 'Tambah Soal Baru'}
      size="large"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Batal</Button>
          <Button variant="primary" onClick={handleSubmit} disabled={isLoadingDetail || isSavingOverride || isUploading}>
            {isSavingOverride ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </>
      }
    >
      {isLoadingDetail ? (
        <Loading />
      ) : (
        <>
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
            <Label>Penjelasan Singkat (Opsional)</Label>
            <HelpText style={{ marginBottom: '0.5rem', marginTop: 0 }}>Ringkasan singkat yang tampil langsung setelah jawaban dipilih.</HelpText>
            <Textarea
              value={form.explanationShort}
              onChange={e => set('explanationShort', e.target.value)}
              placeholder="Tuliskan ringkasan penjelasan di sini..."
              rows={2}
            />
          </FormSection>

          <FormSection>
            <Label>Penjelasan Panjang (Opsional)</Label>
            <HelpText style={{ marginBottom: '0.5rem', marginTop: 0 }}>Penjelasan detail, ditampilkan saat pengguna klik "Lihat Penjelasan Panjang".</HelpText>
            <Textarea
              value={form.explanationLong}
              onChange={e => set('explanationLong', e.target.value)}
              placeholder="Tuliskan penjelasan detail di sini..."
              rows={4}
            />
          </FormSection>

          {isEdit && (
            <FormSection>
              <Label>Modul Terkait (Opsional)</Label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {linkedNotes.map(relation => (
                  <div key={relation.id} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <TextInput
                      value={labelDrafts[relation.id] ?? relation.label ?? ''}
                      onChange={e => setLabelDrafts(d => ({ ...d, [relation.id]: e.target.value }))}
                      onBlur={e => commitLabel(relation, e.target.value.trim())}
                      placeholder="Label (mis. Modul Terkait)"
                    />
                    <TextInput value={relation.targetTitle || ''} disabled />
                    <Button variant="danger" onClick={() => removeNote(relation.id)} disabled={isSyncingNotes}>Hapus</Button>
                  </div>
                ))}
                <Button onClick={() => setNotePickerOpen(true)} disabled={isSyncingNotes}>+ Tambah Modul Terkait</Button>
              </div>
            </FormSection>
          )}

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
        </>
      )}

      {notePickerOpen && (
        <SummaryNoteTreePicker
          onSelect={async (option) => {
            await addNote(option)
            setNotePickerOpen(false)
          }}
          onClose={() => setNotePickerOpen(false)}
        />
      )}
    </Modal>
  )
}

export default QuestionFormModal
