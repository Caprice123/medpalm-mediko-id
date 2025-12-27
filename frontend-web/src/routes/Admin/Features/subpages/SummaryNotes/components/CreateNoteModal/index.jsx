import { useMemo } from 'react'
import Modal from '@components/common/Modal'
import TagSelector from '@components/common/TagSelector'
import BlockNoteEditor from '@components/BlockNoteEditor'
import { formatFileSize, getFileIcon } from '@utils/fileUtils'
import {
  FormSection,
  Label,
  Input,
  Textarea,
  UploadSection,
  UploadArea,
  UploadIcon,
  UploadText,
  ErrorText,
  StatusToggle,
  StatusOption,
  Button,
  EditorContainer,
  EditorHint,
  ExistingFileInfo,
  FileIcon,
  FileName,
  GenerateButton,
  RemoveFileButton
} from './CreateNoteModal.styles'
import { useSelector } from 'react-redux'
import { useCreateNote } from '../../hooks/subhooks/useCreateNote'

const CreateNoteModal = ({ onClose }) => {
  const { loading } = useSelector(state => state.summaryNotes)
  const { tags } = useSelector(state => state.tags)

  const {
    form,
    handleFileSelect,
    handleGenerate,
    handleRemoveFile,
    handleImageUpload,
    uploadedFile
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

  // Debug logging
  console.log('CreateNoteModal - uploadedFile:', uploadedFile)
  if (uploadedFile) {
    console.log('uploadedFile.name:', uploadedFile.name)
    console.log('uploadedFile.type:', uploadedFile.type)
    console.log('uploadedFile.size:', uploadedFile.size)
    console.log('File icon:', getFileIcon(uploadedFile.type))
  }

  return (
    <Modal
      isOpen={true}
      onClose={handleModalClose}
      title="Buat Ringkasan Baru"
      size="large"
      footer={
        <>
          <Button onClick={handleModalClose}>Batal</Button>
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
        <UploadSection>
          {!uploadedFile ? (
            <UploadArea onClick={() => document.getElementById('document-upload').click()}>
              <input
                id="document-upload"
                type="file"
                accept=".pdf,.pptx,.docx"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
              <UploadIcon>📤</UploadIcon>
              <UploadText>
                {loading.isUploading ? 'Uploading...' : 'Klik untuk upload dokumen'}
              </UploadText>
              <UploadText style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
                PDF, PPTX, atau DOCX (max 50MB)
              </UploadText>
            </UploadArea>
          ) : (
            <ExistingFileInfo>
              <FileIcon>{getFileIcon(uploadedFile.type)}</FileIcon>
              <div style={{ flex: 1 }}>
                <FileName>{uploadedFile.name}</FileName>
                <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>
                  {formatFileSize(uploadedFile.size)}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {uploadedFile.url && (
                  <GenerateButton
                    as="a"
                    href={uploadedFile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Lihat
                  </GenerateButton>
                )}
                <GenerateButton
                  onClick={handleGenerate}
                  disabled={loading.isGenerating}
                >
                  {loading.isGenerating ? 'Generating...' : '✨ Generate'}
                </GenerateButton>
                <RemoveFileButton onClick={handleRemoveFile}>
                  Hapus
                </RemoveFileButton>
              </div>
            </ExistingFileInfo>
          )}
        </UploadSection>
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
