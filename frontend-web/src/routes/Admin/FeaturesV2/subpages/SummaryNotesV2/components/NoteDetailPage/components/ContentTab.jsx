import Button from '@components/common/Button'
import FileUpload from '@components/common/FileUpload'
import BlockNoteEditor from '@components/BlockNoteEditor'
import { FormSection, Label, EditorContainer, EditorHint, SaveRow } from '../NoteDetailPage.styles'

function ContentTab({
  form, handleFileSelect, handleGenerate, handleRemoveFile,
  handleRemoveSourceFile, handleImageUpload,
  isLoading, isSaving, isUploading, loading,
}) {
  if (isLoading) {
    return <p style={{ color: '#9ca3af', textAlign: 'center', padding: '3rem' }}>Memuat...</p>
  }

  return (
    <>
      {form.values.sourceFileInfo && !form.values.uploadedFile ? (
        <FormSection>
          <Label>Dokumen Sumber</Label>
          <FileUpload
            file={{
              name: form.values.sourceFileInfo.filename,
              type: form.values.sourceFileInfo.type,
              size: form.values.sourceFileInfo.size,
            }}
            onRemove={handleRemoveSourceFile}
            actions={
              <>
                {form.values.sourceFileInfo.url && (
                  <Button
                    variant="primary"
                    size="small"
                    as="a"
                    href={form.values.sourceFileInfo.url}
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
                  disabled={loading.isGenerating}
                >
                  {loading.isGenerating ? 'Generating...' : '✨ Generate'}
                </Button>
              </>
            }
          />
        </FormSection>
      ) : (
        <FormSection>
          <Label>Upload Dokumen</Label>
          <FileUpload
            file={form.values.uploadedFile}
            onFileSelect={handleFileSelect}
            onRemove={handleRemoveFile}
            isUploading={isUploading}
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
      )}

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
            editable={!isSaving}
            placeholder="Tulis konten ringkasan..."
            onImageUpload={handleImageUpload}
          />
        </EditorContainer>
      </FormSection>

      <SaveRow>
        <Button variant="primary" onClick={form.handleSubmit} disabled={isSaving}>
          {isSaving ? 'Menyimpan...' : 'Simpan Konten'}
        </Button>
      </SaveRow>
    </>
  )
}

export default ContentTab
