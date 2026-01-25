import { useMemo } from 'react'
import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import TagSelector from '@components/common/TagSelector'
import BlockNoteEditor from '@components/BlockNoteEditor'
import FileUpload from '@components/common/FileUpload'
import {
  FormSection,
  Label,
  Input,
  Textarea,
  ErrorText,
  StatusToggle,
  StatusOption,
  EditorContainer,
  EditorHint
} from './CreateNoteModal.styles'
import { useSelector } from 'react-redux'
import { useCreateNote } from '../../hooks/subhooks/useCreateNote'
import { formatFileSize, getFileIcon } from '@utils/fileUtils'

const CreateNoteModal = ({ onClose }) => {
  const { loading } = useSelector(state => state.summaryNotes)
  const { tags } = useSelector(state => state.tags)

  const {
    form,
    handleFileSelect,
    handleGenerate,
    handleRemoveFile,
    handleImageUpload
  } = useCreateNote(onClose)

  // Get tags from both university and semester groups - memoized
  const universityTags = useMemo(() =>
    tags.find(t => t.name === 'university')?.tags || [],
    [tags]
  )
  const semesterTags = useMemo(() =>
    tags.find(t => t.name === 'semester')?.tags || [],
    [tags]
  )

  // Handlers for tag changes
  const handleUniversityTagsChange = (newTags) => {
    form.setFieldValue('universityTags', newTags)
  }

  const handleSemesterTagsChange = (newTags) => {
    form.setFieldValue('semesterTags', newTags)
  }

  const handleModalClose = () => {
    if (onClose) onClose()
  }

  const handleContentChange = (blocks) => {
    form.setFieldValue('content', blocks)
  }

  return (
    <Modal
      isOpen={true}
      onClose={handleModalClose}
      title="Buat Ringkasan Baru"
      size="large"
      footer={
        <>
          <Button variant="secondary" onClick={handleModalClose}>Batal</Button>
          <Button
            variant="primary"
            onClick={form.handleSubmit}
            disabled={loading.isCreating}
          >
            {loading.isCreating ? 'Menyimpan...' : 'Simpan Ringkasan'}
          </Button>
        </>
      }
    >
      <FormSection>
        <Label>Judul *</Label>
        <Input
          type="text"
          value={form.values.title}
          onChange={(e) => form.setFieldValue('title', e.target.value)}
          placeholder="Masukkan judul ringkasan"
        />
        {form.errors.title && <ErrorText>{form.errors.title}</ErrorText>}
      </FormSection>

      <FormSection>
        <Label>Deskripsi</Label>
        <Textarea
          value={form.values.description}
          onChange={(e) => form.setFieldValue('description', e.target.value)}
          placeholder="Deskripsi singkat tentang ringkasan ini"
          rows={3}
        />
      </FormSection>

      {/* Upload Document Section */}
      <FormSection>
        <Label>Generate dari Dokumen (Opsional)</Label>
        <FileUpload
          file={form.values.uploadedFile}
          onFileSelect={handleFileSelect}
          onRemove={handleRemoveFile}
          isUploading={loading.isUploading}
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
                  onClick={(e) => e.stopPropagation()}
                >
                  Lihat
                </Button>
              )}
              <Button
                variant="primary"
                size="small"
                onClick={handleGenerate}
                disabled={loading.isGenerating}
              >
                {loading.isGenerating ? 'Generating...' : '✨ Generate'}
              </Button>
            </>
          }
        />
      </FormSection>

      {/* Content Editor */}
      <FormSection>
        <Label>Konten Ringkasan *</Label>
        <EditorHint>
          Type <strong>/</strong> untuk melihat pilihan format • <strong>Tab</strong> untuk indent • <strong>Shift+Tab</strong> untuk unindent
        </EditorHint>
        <EditorContainer>
          <BlockNoteEditor
            initialContent={form.values.content}
            onChange={handleContentChange}
            editable={!loading.isCreating}
            placeholder="Tulis konten ringkasan atau generate dari dokumen..."
            onImageUpload={handleImageUpload}
          />
        </EditorContainer>
        {form.errors.content && <ErrorText>{form.errors.content}</ErrorText>}
      </FormSection>

      {/* University Tags */}
      <FormSection>
        <Label>Universitas</Label>
        <TagSelector
          allTags={universityTags}
          selectedTags={form.values.universityTags}
          onTagsChange={handleUniversityTagsChange}
          placeholder="-- Pilih Universitas --"
          helpText="Pilih universitas untuk membantu mengorganisir ringkasan"
        />
      </FormSection>

      {/* Semester Tags */}
      <FormSection>
        <Label>Semester</Label>
        <TagSelector
          allTags={semesterTags}
          selectedTags={form.values.semesterTags || []}
          onTagsChange={handleSemesterTagsChange}
          placeholder="-- Pilih Semester --"
          helpText="Pilih semester untuk membantu mengorganisir ringkasan"
        />
      </FormSection>

      {/* Status Selection */}
      <StatusToggle>
        <StatusOption>
          <input
            type="radio"
            name="status"
            value="draft"
            checked={form.values.status === 'draft'}
            onChange={(e) => form.setFieldValue('status', e.target.value)}
          />
          Draft
        </StatusOption>
        <StatusOption>
          <input
            type="radio"
            name="status"
            value="published"
            checked={form.values.status === 'published'}
            onChange={(e) => form.setFieldValue('status', e.target.value)}
          />
          Published
        </StatusOption>
        <StatusOption>
          <input
            type="radio"
            name="status"
            value="inactive"
            checked={form.values.status === 'inactive'}
            onChange={(e) => form.setFieldValue('status', e.target.value)}
          />
          Inactive
        </StatusOption>
      </StatusToggle>
    </Modal>
  )
}

export default CreateNoteModal
