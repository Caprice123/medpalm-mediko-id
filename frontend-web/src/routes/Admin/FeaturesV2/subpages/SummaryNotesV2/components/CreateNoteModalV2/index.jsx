import { useSelector } from 'react-redux'
import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import TextInput from '@components/common/TextInput'
import Textarea from '@components/common/Textarea'
import FileUpload from '@components/common/FileUpload'
import BlockNoteEditor from '@components/BlockNoteEditor'
import { useCreateNoteV2 } from '../../hooks/useCreateNoteV2'
import { FormSection, Label, EditorContainer, EditorHint } from '../NoteDetailPage/NoteDetailPage.styles'

function CreateNoteModalV2({ nodeId, nodeName, onClose }) {
  const { loading } = useSelector(s => s.summaryNotesV2)
  const { loading: commonLoading } = useSelector(s => s.common)

  const { form, handleFileSelect, handleGenerate, handleRemoveFile, handleImageUpload } =
    useCreateNoteV2(nodeId, nodeName, onClose)

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="Buat Ringkasan Baru"
      size="large"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Batal</Button>
          <Button variant="primary" onClick={form.handleSubmit} disabled={loading.isCreating}>
            {loading.isCreating ? 'Menyimpan...' : 'Buat Ringkasan'}
          </Button>
        </>
      }
    >
      {nodeName ? (
        <FormSection>
          <Label>Judul</Label>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
            Ringkasan ini mengikuti nama sub-topik: <strong>{nodeName}</strong>
          </p>
        </FormSection>
      ) : (
        <FormSection>
          <TextInput
            label="Judul"
            required
            value={form.values.title}
            onChange={e => { form.setFieldValue('title', e.target.value) }}
            placeholder="Masukkan judul ringkasan"
            error={form.errors.title}
          />
        </FormSection>
      )}

      <FormSection>
        <Textarea
          label="Deskripsi"
          value={form.values.description}
          onChange={e => form.setFieldValue('description', e.target.value)}
          placeholder="Deskripsi singkat tentang ringkasan ini"
          rows={3}
        />
      </FormSection>

      <FormSection>
        <Label>Generate dari Dokumen (Opsional)</Label>
        <FileUpload
          file={form.values.uploadedFile}
          onFileSelect={handleFileSelect}
          onRemove={handleRemoveFile}
          isUploading={commonLoading.isUploading}
          acceptedTypes={['.pdf', '.pptx', '.docx']}
          acceptedTypesLabel="PDF, PPTX, atau DOCX"
          maxSizeMB={50}
          uploadText="Klik untuk upload dokumen"
          actions={
            <>
              {form.values.uploadedFile?.url && (
                <Button
                  variant="primary"
                  size="small"
                  as="a"
                  href={form.values.uploadedFile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                >
                  Lihat
                </Button>
              )}
              <Button
                variant="primary"
                size="small"
                onClick={handleGenerate}
                disabled={!form.values.uploadedFile || loading.isGenerating}
              >
                {loading.isGenerating ? 'Generating...' : '✨ Generate'}
              </Button>
            </>
          }
        />
      </FormSection>

      <FormSection>
        <Label>Konten Ringkasan</Label>
        <EditorHint>
          Type <strong>/</strong> untuk melihat pilihan format •{' '}
          <strong>Tab</strong> untuk indent • <strong>Shift+Tab</strong> untuk unindent
        </EditorHint>
        <EditorContainer>
          <BlockNoteEditor
            initialContent={form.values.content}
            onChange={blocks => form.setFieldValue('content', blocks)}
            editable={!loading.isCreating}
            placeholder="Tulis konten ringkasan atau generate dari dokumen..."
            onImageUpload={handleImageUpload}
          />
        </EditorContainer>
      </FormSection>
    </Modal>
  )
}

export default CreateNoteModalV2
