import { useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import Button from '@components/common/Button'
import TextInput from '@components/common/TextInput'
import Textarea from '@components/common/Textarea'
import TagSelector from '@components/common/TagSelector'
import FileUpload from '@components/common/FileUpload'
import BlockNoteEditor from '@components/BlockNoteEditor'
import FlashcardSelectorModal from '@routes/Admin/Features/subpages/SummaryNotes/components/FlashcardSelectorModal'
import McqSelectorModal from '@routes/Admin/Features/subpages/SummaryNotes/components/McqSelectorModal'
import SelectedResourcesDisplay from '@routes/Admin/Features/subpages/SummaryNotes/components/SelectedResourcesDisplay'
import {
  FormSection, Label, StatusToggle, StatusOption,
  EditorContainer, EditorHint, SaveRow,
} from '../NoteDetailPage.styles'

function DetailTab({ form, handleFileSelect, handleGenerate, handleRemoveFile, handleRemoveSourceFile, handleImageUpload, isLoading, isSaving, isUploading, loading }) {
  const { tags } = useSelector(s => s.tags)
  const [flashcardSelectorOpen, setFlashcardSelectorOpen] = useState(false)
  const [mcqSelectorOpen, setMcqSelectorOpen] = useState(false)

  const universityTags = useMemo(() => tags.find(t => t.name === 'university')?.tags || [], [tags])
  const semesterTags = useMemo(() => tags.find(t => t.name === 'semester')?.tags || [], [tags])
  const departmentTags = useMemo(() => tags.find(t => t.name === 'department')?.tags || [], [tags])

  if (isLoading) {
    return <p style={{ color: '#9ca3af', textAlign: 'center', padding: '3rem' }}>Memuat...</p>
  }

  return (
    <>
      <FormSection>
        <TextInput
          label="Judul"
          required
          value={form.values.title}
          onChange={e => form.setFieldValue('title', e.target.value)}
          placeholder="Masukkan judul ringkasan"
          error={form.errors.title}
        />
      </FormSection>

      <FormSection>
        <Textarea
          label="Deskripsi"
          value={form.values.description}
          onChange={e => form.setFieldValue('description', e.target.value)}
          placeholder="Deskripsi singkat tentang ringkasan ini"
          rows={3}
        />
      </FormSection>

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
                  disabled={loading?.isGenerating}
                >
                  {loading?.isGenerating ? 'Generating...' : '✨ Generate'}
                </Button>
              </>
            }
          />
        </FormSection>
      ) : (
        <FormSection>
          <Label>Upload Dokumen (Opsional)</Label>
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
                    onClick={e => e.stopPropagation()}
                  >
                    Lihat
                  </Button>
                )}
                <Button
                  variant="primary"
                  size="small"
                  onClick={handleGenerate}
                  disabled={!form.values.uploadedFile || loading?.isGenerating}
                >
                  {loading?.isGenerating ? 'Generating...' : '✨ Generate'}
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

      <FormSection>
        <Label>Universitas</Label>
        <TagSelector
          allTags={universityTags}
          selectedTags={form.values.universityTags}
          onTagsChange={t => form.setFieldValue('universityTags', t)}
          placeholder="-- Pilih Universitas --"
        />
      </FormSection>

      <FormSection>
        <Label>Semester</Label>
        <TagSelector
          allTags={semesterTags}
          selectedTags={form.values.semesterTags}
          onTagsChange={t => form.setFieldValue('semesterTags', t)}
          placeholder="-- Pilih Semester --"
        />
      </FormSection>

      <FormSection>
        <Label>Departemen</Label>
        <TagSelector
          allTags={departmentTags}
          selectedTags={form.values.departmentTags}
          onTagsChange={t => form.setFieldValue('departmentTags', t)}
          placeholder="-- Pilih Departemen --"
        />
      </FormSection>

      <FormSection>
        <Label>Flashcard Terkait</Label>
        <SelectedResourcesDisplay
          selectedItems={form.values.selectedFlashcards}
          onOpenSelector={() => setFlashcardSelectorOpen(true)}
          onRemove={id => form.setFieldValue('selectedFlashcards', form.values.selectedFlashcards.filter(f => f.id !== id))}
          emptyText="Pilih flashcard deck"
          icon="🃏"
          getItemMeta={item => `${item.cardCount || 0} kartu`}
        />
      </FormSection>

      <FormSection>
        <Label>MCQ Terkait</Label>
        <SelectedResourcesDisplay
          selectedItems={form.values.selectedMcqTopics}
          onOpenSelector={() => setMcqSelectorOpen(true)}
          onRemove={id => form.setFieldValue('selectedMcqTopics', form.values.selectedMcqTopics.filter(m => m.id !== id))}
          emptyText="Pilih MCQ topic"
          icon="📝"
          getItemMeta={item => `${item.questionCount || 0} soal`}
        />
      </FormSection>

      <FormSection>
        <Label>Status</Label>
        <StatusToggle>
          {['draft', 'testing', 'published'].map(s => (
            <StatusOption key={s} $checked={form.values.status === s} onClick={() => form.setFieldValue('status', s)}>
              <input type="radio" name="note-detail-status" value={s} checked={form.values.status === s} onChange={() => form.setFieldValue('status', s)} />
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </StatusOption>
          ))}
        </StatusToggle>
      </FormSection>

      <SaveRow>
        <Button variant="primary" onClick={form.handleSubmit} disabled={isSaving}>
          {isSaving ? 'Menyimpan...' : 'Simpan'}
        </Button>
      </SaveRow>

      <FlashcardSelectorModal
        isOpen={flashcardSelectorOpen}
        onClose={() => setFlashcardSelectorOpen(false)}
        onSelect={selected => form.setFieldValue('selectedFlashcards', selected)}
        initialSelected={form.values.selectedFlashcards}
      />

      <McqSelectorModal
        isOpen={mcqSelectorOpen}
        onClose={() => setMcqSelectorOpen(false)}
        onSelect={selected => form.setFieldValue('selectedMcqTopics', selected)}
        initialSelected={form.values.selectedMcqTopics}
      />
    </>
  )
}

export default DetailTab
