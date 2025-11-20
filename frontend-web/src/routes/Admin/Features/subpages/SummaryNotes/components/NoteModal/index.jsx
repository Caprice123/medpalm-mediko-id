import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createSummaryNote, updateSummaryNote, generateSummaryFromDocument } from '@store/summaryNotes/action'
import { actions } from '@store/summaryNotes/reducer'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import TagSelector from '../../../Exercise/components/TagSelector'
import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ModalBody,
  FormSection,
  SectionTitle,
  FormGroup,
  Label,
  Input,
  TextArea,
  Select,
  EditorContainer,
  EditorSection,
  EditorHeader,
  EditorTextArea,
  PreviewSection,
  PreviewContent,
  UploadSection,
  UploadArea,
  UploadIcon,
  UploadText,
  UploadInput,
  FileName,
  GenerateButton,
  ModalFooter,
  FooterButton,
  MarkdownHelpSection,
  HelpTitle,
  HelpGrid,
  HelpItem,
  ExistingFileContainer,
  ExistingFileIcon,
  ExistingFileInfo,
  ExistingFileLabel,
  ExistingFileName,
  FileActions,
  FileActionButton,
  RemoveFileButton
} from './NoteModal.styles'

const { clearGeneratedContent, setError, clearError } = actions

function NoteModal({ isOpen, onClose, noteToEdit, onSuccess }) {
  const dispatch = useDispatch()
  const { isCreating, isUpdating, isGenerating } = useSelector(state => state.summaryNotes.loading)
  const { generatedContent } = useSelector(state => state.summaryNotes)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    status: 'draft',
    tags: []
  })

  const [uploadedFile, setUploadedFile] = useState(null)
  const [sourceFileInfo, setSourceFileInfo] = useState(null)

  useEffect(() => {
    if (noteToEdit) {
      // Determine status based on is_active and status
      let combinedStatus = noteToEdit.status || 'draft'
      if (noteToEdit.is_active === false) {
        combinedStatus = 'inactive'
      }

      setFormData({
        title: noteToEdit.title || '',
        description: noteToEdit.description || '',
        content: noteToEdit.content || '',
        status: combinedStatus,
        tags: noteToEdit.tags || []
      })

      // Set source file info if exists
      if (noteToEdit.source_url) {
        setSourceFileInfo({
          url: noteToEdit.source_url,
          key: noteToEdit.source_key,
          filename: noteToEdit.source_filename,
          type: noteToEdit.source_type
        })
      } else {
        setSourceFileInfo(null)
      }
    } else {
      setFormData({
        title: '',
        description: '',
        content: '',
        status: 'draft',
        tags: []
      })
      setSourceFileInfo(null)
    }
    dispatch(clearError())
    setUploadedFile(null)
    dispatch(clearGeneratedContent())
  }, [noteToEdit, isOpen, dispatch])

  useEffect(() => {
    if (generatedContent?.content) {
      setFormData(prev => ({
        ...prev,
        content: generatedContent.content
      }))

      // Store file info from generation
      if (generatedContent.fileInfo) {
        setSourceFileInfo({
          url: generatedContent.fileInfo.url,
          key: generatedContent.fileInfo.key,
          filename: generatedContent.fileInfo.originalFilename || generatedContent.filename,
          type: generatedContent.mimeType
        })
      }
    }
  }, [generatedContent])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    dispatch(clearError())
  }

  const handleTagsChange = (newTags) => {
    setFormData(prev => ({
      ...prev,
      tags: newTags
    }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-powerpoint',
        'application/msword'
      ]

      if (!allowedTypes.includes(file.type)) {
        dispatch(setError('Format file tidak didukung. Gunakan PDF, PPTX, atau DOCX.'))
        return
      }

      if (file.size > 50 * 1024 * 1024) {
        dispatch(setError('Ukuran file maksimal 50MB.'))
        return
      }

      setUploadedFile(file)
      dispatch(clearError())
    }
  }

  const handleGenerate = async () => {
    if (!uploadedFile) {
      dispatch(setError('Pilih file terlebih dahulu.'))
      return
    }

    try {
      dispatch(clearError())
      await dispatch(generateSummaryFromDocument(uploadedFile))
    } catch (err) {
      dispatch(setError('Gagal generate ringkasan. Silakan coba lagi.'))
    }
  }

  const handleRemoveSourceFile = () => {
    setSourceFileInfo(null)
    setUploadedFile(null)
  }

  const getFileIcon = (mimeType) => {
    if (!mimeType) return '📄'
    if (mimeType.includes('pdf')) return '📕'
    if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return '📊'
    if (mimeType.includes('document') || mimeType.includes('word')) return '📘'
    return '📄'
  }

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      dispatch(setError('Judul harus diisi.'))
      return
    }

    if (!formData.content.trim()) {
      dispatch(setError('Konten harus diisi.'))
      return
    }

    try {
      dispatch(clearError())

      // Convert combined status to status + isActive
      let apiStatus = formData.status
      let isActive = true

      if (formData.status === 'inactive') {
        apiStatus = 'draft'
        isActive = false
      }

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        content: formData.content,
        status: apiStatus,
        isActive: isActive,
        tagIds: formData.tags.map(t => t.id),
        sourceType: sourceFileInfo?.type || null,
        sourceUrl: sourceFileInfo?.url || null,
        sourceKey: sourceFileInfo?.key || null,
        sourceFilename: sourceFileInfo?.filename || null
      }

      if (noteToEdit) {
        await dispatch(updateSummaryNote(noteToEdit.id, payload))
      } else {
        await dispatch(createSummaryNote(payload))
      }

      onSuccess()
    } catch (err) {
      dispatch(setError('Gagal menyimpan ringkasan. Silakan coba lagi.'))
    }
  }

  const handleClose = () => {
    dispatch(clearGeneratedContent())
    dispatch(clearError())
    onClose()
  }

  if (!isOpen) return null

  const isLoading = isCreating || isUpdating || isGenerating

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            {noteToEdit ? 'Edit Ringkasan' : 'Buat Ringkasan Baru'}
          </ModalTitle>
          <CloseButton onClick={handleClose} disabled={isLoading}>
            ×
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <FormSection>
            <SectionTitle>Informasi Dasar</SectionTitle>

            <FormGroup>
              <Label>Judul *</Label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Masukkan judul ringkasan"
                disabled={isLoading}
              />
            </FormGroup>

            <FormGroup>
              <Label>Deskripsi</Label>
              <TextArea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Deskripsi singkat tentang ringkasan ini"
                rows={4}
                disabled={isLoading}
              />
            </FormGroup>

            <FormGroup>
              <Label>Status</Label>
              <Select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                disabled={isLoading}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="inactive">Tidak Aktif</option>
              </Select>
            </FormGroup>
          </FormSection>

          <FormSection>
            <SectionTitle>Tags</SectionTitle>
            <TagSelector
              selectedTags={formData.tags}
              onChange={handleTagsChange}
              type="university"
              label="Universitas"
            />
            <TagSelector
              selectedTags={formData.tags}
              onChange={handleTagsChange}
              type="semester"
              label="Semester"
            />
          </FormSection>

          <FormSection>
            <SectionTitle>Generate dari Dokumen (Opsional)</SectionTitle>
            <UploadSection>
              {uploadedFile ? (
                <ExistingFileContainer>
                  <ExistingFileIcon>{getFileIcon(uploadedFile.type)}</ExistingFileIcon>
                  <ExistingFileInfo>
                    <ExistingFileLabel>File Baru</ExistingFileLabel>
                    <ExistingFileName title={uploadedFile.name}>
                      {uploadedFile.name}
                    </ExistingFileName>
                  </ExistingFileInfo>
                  <FileActions>
                    <RemoveFileButton
                      type="button"
                      onClick={() => setUploadedFile(null)}
                      disabled={isLoading}
                    >
                      Hapus
                    </RemoveFileButton>
                  </FileActions>
                </ExistingFileContainer>
              ) : sourceFileInfo ? (
                <ExistingFileContainer>
                  <ExistingFileIcon>{getFileIcon(sourceFileInfo.type)}</ExistingFileIcon>
                  <ExistingFileInfo>
                    <ExistingFileLabel>File Sumber</ExistingFileLabel>
                    <ExistingFileName title={sourceFileInfo.filename}>
                      {sourceFileInfo.filename}
                    </ExistingFileName>
                  </ExistingFileInfo>
                  <FileActions>
                    {sourceFileInfo.url && (
                      <FileActionButton
                        href={sourceFileInfo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="download"
                      >
                        Download
                      </FileActionButton>
                    )}
                    <RemoveFileButton
                      type="button"
                      onClick={handleRemoveSourceFile}
                      disabled={isLoading}
                    >
                      Hapus
                    </RemoveFileButton>
                  </FileActions>
                </ExistingFileContainer>
              ) : (
                <UploadArea>
                  <UploadInput
                    type="file"
                    accept=".pdf,.pptx,.docx,.ppt,.doc"
                    onChange={handleFileChange}
                    disabled={isLoading}
                  />
                  <UploadIcon>📄</UploadIcon>
                  <UploadText>
                    <strong>Klik untuk upload</strong>
                    <br />
                    <span>PDF, PPTX, DOCX (max 50MB)</span>
                  </UploadText>
                </UploadArea>
              )}
              <GenerateButton
                onClick={handleGenerate}
                disabled={!uploadedFile || isLoading}
              >
                {isGenerating ? 'Generating...' : 'Generate Ringkasan'}
              </GenerateButton>
            </UploadSection>
          </FormSection>

          <FormSection>
            <SectionTitle>Konten Ringkasan *</SectionTitle>
            <EditorContainer>
              <EditorSection>
                <EditorHeader>Editor (Markdown)</EditorHeader>
                <EditorTextArea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Tulis konten ringkasan dalam format Markdown..."
                  disabled={isLoading}
                />
              </EditorSection>
              <PreviewSection>
                <EditorHeader>Preview</EditorHeader>
                <PreviewContent>
                  {formData.content ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {formData.content}
                    </ReactMarkdown>
                  ) : (
                    <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>
                      Preview akan muncul di sini...
                    </span>
                  )}
                </PreviewContent>
              </PreviewSection>
            </EditorContainer>

            <MarkdownHelpSection>
              <HelpTitle>
                📝 Panduan Markdown
              </HelpTitle>
              <HelpGrid>
                <HelpItem>
                  <code># Judul</code> <span>→ Heading 1</span>
                </HelpItem>
                <HelpItem>
                  <code>## Sub Judul</code> <span>→ Heading 2</span>
                </HelpItem>
                <HelpItem>
                  <code>**teks**</code> <span>→ Bold</span>
                </HelpItem>
                <HelpItem>
                  <code>*teks*</code> <span>→ Italic</span>
                </HelpItem>
                <HelpItem>
                  <code>- item</code> <span>→ Bullet list</span>
                </HelpItem>
                <HelpItem>
                  <code>1. item</code> <span>→ Numbered list</span>
                </HelpItem>
                <HelpItem>
                  <code>[teks](url)</code> <span>→ Link</span>
                </HelpItem>
                <HelpItem>
                  <code>![alt](url)</code> <span>→ Gambar</span>
                </HelpItem>
                <HelpItem>
                  <code>`kode`</code> <span>→ Inline code</span>
                </HelpItem>
                <HelpItem>
                  <code>```kode```</code> <span>→ Code block</span>
                </HelpItem>
                <HelpItem>
                  <code>&gt; teks</code> <span>→ Blockquote</span>
                </HelpItem>
                <HelpItem>
                  <code>| A | B |</code> <span>→ Tabel</span>
                </HelpItem>
              </HelpGrid>
            </MarkdownHelpSection>
          </FormSection>
        </ModalBody>

        <ModalFooter>
          <FooterButton variant="secondary" onClick={handleClose} disabled={isLoading}>
            Batal
          </FooterButton>
          <FooterButton variant="primary" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Menyimpan...' : noteToEdit ? 'Update' : 'Simpan'}
          </FooterButton>
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  )
}

export default NoteModal
