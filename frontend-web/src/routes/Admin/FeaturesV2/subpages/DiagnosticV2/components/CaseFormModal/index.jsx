import { useSelector } from 'react-redux'
import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import TextInput from '@components/common/TextInput'
import Textarea from '@components/common/Textarea'
import FileUpload from '@components/common/FileUpload'
import Loading from '@components/common/Loading'
import RichTextEditor from '@components/common/RichTextEditor'
import QuestionBlock from './components/QuestionBlock'
import { useCaseFormModal } from './hooks/useCaseFormModal'
import {
  FormSection, Label, HelpText,
} from '@routes/Admin/FeaturesV2/subpages/McqV2/components/QuestionFormModal/QuestionFormModal.styles'
import {
  SectionDivider, SectionHeading, QuestionList, RowGroup, InlineRow,
} from './CaseFormModal.styles'

function CaseFormModal({ nodeId, diagnosticCase, onClose, onSave, isSavingOverride }) {
  const isUploading = useSelector(state => state.common.loading?.isUploading)
  const {
    isEdit, isLoadingDetail, form, errors, set,
    setQuestionField, addQuestion, removeQuestion,
    setQuestionOption, addQuestionOption, removeQuestionOption,
    addQuestionReference, setQuestionReference, removeQuestionReference,
    addReference, setReference, removeReference,
    handleImageUpload, handleRemoveImage, handleSubmit,
  } = useCaseFormModal({ nodeId, diagnosticCase, onSave })

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={isEdit ? 'Edit Kasus' : 'Tambah Kasus Baru'}
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
          <SectionHeading>Kasus</SectionHeading>
          <HelpText style={{ marginTop: 0 }}>Vignette dan gambar di bawah dibagikan ke semua soal dalam kasus ini.</HelpText>

          <FormSection>
            <Label>Gambar (Opsional)</Label>
            <FileUpload
              file={form.blobId ? { name: form.imageFilename || 'Gambar kasus', type: 'image/jpeg' } : null}
              onFileSelect={handleImageUpload}
              onRemove={handleRemoveImage}
              isUploading={isUploading}
              acceptedTypes={['image/jpeg', 'image/jpg', 'image/png']}
              acceptedTypesLabel="JPEG atau PNG"
              maxSizeMB={5}
              uploadText="Klik untuk upload gambar kasus"
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
            <Label>Penjelasan Kasus (Opsional)</Label>
            <HelpText style={{ marginBottom: '0.5rem', marginTop: 0 }}>Pembahasan keseluruhan kasus, tampil setelah semua soal terjawab.</HelpText>
            <RichTextEditor
              value={form.explanation}
              onChange={html => set('explanation', html)}
              placeholder="Tuliskan pembahasan kasus di sini..."
              minHeight="7rem"
              uploadFolder="diagnostic-v2"
            />
          </FormSection>

          <FormSection>
            <Label>Referensi Kasus (Opsional)</Label>
            <RowGroup>
              {form.references.map((ref, i) => (
                <InlineRow key={i}>
                  <TextInput value={ref.label} onChange={e => setReference(i, 'label', e.target.value)} placeholder="Nama sumber" />
                  <TextInput value={ref.url} onChange={e => setReference(i, 'url', e.target.value)} placeholder="Link (opsional)" />
                  <Button variant="danger" onClick={() => removeReference(i)}>Hapus</Button>
                </InlineRow>
              ))}
              <Button onClick={addReference}>+ Tambah Referensi</Button>
            </RowGroup>
          </FormSection>

          <SectionDivider />

          <SectionHeading>Soal ({form.questions.length})</SectionHeading>
          <HelpText style={{ marginTop: 0 }}>Semua soal di bawah ditanyakan tentang vignette yang sama dan dinilai bersama dalam satu rating.</HelpText>

          <QuestionList>
            {form.questions.map((question, i) => (
              <QuestionBlock
                key={question.id ?? `new-${i}`}
                index={i}
                question={question}
                errors={errors}
                canRemove={form.questions.length > 1}
                onRemove={() => removeQuestion(i)}
                onFieldChange={(key, val) => setQuestionField(i, key, val)}
                onOptionChange={(optionIndex, val) => setQuestionOption(i, optionIndex, val)}
                onAddOption={() => addQuestionOption(i)}
                onRemoveOption={(optionIndex) => removeQuestionOption(i, optionIndex)}
                onAddReference={() => addQuestionReference(i)}
                onReferenceChange={(refIndex, key, val) => setQuestionReference(i, refIndex, key, val)}
                onRemoveReference={(refIndex) => removeQuestionReference(i, refIndex)}
              />
            ))}
          </QuestionList>

          <div style={{ marginTop: '0.875rem' }}>
            <Button variant="secondary" onClick={addQuestion}>+ Tambah Soal</Button>
          </div>
        </>
      )}
    </Modal>
  )
}

export default CaseFormModal
