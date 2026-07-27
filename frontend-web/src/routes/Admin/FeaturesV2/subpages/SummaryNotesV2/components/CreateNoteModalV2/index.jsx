import { useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import TextInput from '@components/common/TextInput'
import Textarea from '@components/common/Textarea'
import TagSelector from '@components/common/TagSelector'
import FileUpload from '@components/common/FileUpload'
import BlockNoteEditor from '@components/BlockNoteEditor'
import FlashcardSelectorModal from '@routes/Admin/Features/subpages/SummaryNotes/components/FlashcardSelectorModal'
import McqSelectorModal from '@routes/Admin/Features/subpages/SummaryNotes/components/McqSelectorModal'
import SelectedResourcesDisplay from '@routes/Admin/Features/subpages/SummaryNotes/components/SelectedResourcesDisplay'
import { useCreateNoteV2 } from '../../hooks/useCreateNoteV2'
import { FormSection, Label, StatusToggle, StatusOption, EditorContainer, EditorHint } from '../NoteDetailPage/NoteDetailPage.styles'

function CreateNoteModalV2({ nodeId, onClose }) {
  const { loading } = useSelector(s => s.summaryNotesV2)
  const { loading: commonLoading } = useSelector(s => s.common)
  const { tags } = useSelector(s => s.tags)

  const [flashcardSelectorOpen, setFlashcardSelectorOpen] = useState(false)
  const [mcqSelectorOpen, setMcqSelectorOpen] = useState(false)

  const { form, handleFileSelect, handleGenerate, handleRemoveFile, handleImageUpload } =
    useCreateNoteV2(nodeId, onClose)

  const universityTags = useMemo(() => tags.find(t => t.name === 'university')?.tags || [], [tags])
  const semesterTags = useMemo(() => tags.find(t => t.name === 'semester')?.tags || [], [tags])
  const departmentTags = useMemo(() => tags.find(t => t.name === 'department')?.tags || [], [tags])

  return (
    <>
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

        <FormSection>
          <Label>Universitas</Label>
          <TagSelector
            allTags={universityTags}
            selectedTags={form.values.universityTags}
            onTagsChange={tags => form.setFieldValue('universityTags', tags)}
            placeholder="-- Pilih Universitas --"
          />
        </FormSection>

        <FormSection>
          <Label>Semester</Label>
          <TagSelector
            allTags={semesterTags}
            selectedTags={form.values.semesterTags}
            onTagsChange={tags => form.setFieldValue('semesterTags', tags)}
            placeholder="-- Pilih Semester --"
          />
        </FormSection>

        <FormSection>
          <Label>Departemen</Label>
          <TagSelector
            allTags={departmentTags}
            selectedTags={form.values.departmentTags}
            onTagsChange={tags => form.setFieldValue('departmentTags', tags)}
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
                <input type="radio" name="create-note-v2-status" value={s} checked={form.values.status === s} onChange={() => form.setFieldValue('status', s)} />
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </StatusOption>
            ))}
          </StatusToggle>
        </FormSection>
      </Modal>

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

export default CreateNoteModalV2
