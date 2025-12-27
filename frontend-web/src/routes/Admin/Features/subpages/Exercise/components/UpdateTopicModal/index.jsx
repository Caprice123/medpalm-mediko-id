import { memo, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import Modal from '@components/common/Modal'
import TagSelector from '@components/common/TagSelector'
import { DndContext, closestCenter } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useUpdateTopic } from '../../hooks/subhooks/useUpdateTopic'
import { useGenerateQuestions } from '../../hooks/subhooks/useGenerateQuestions'
import {
  FormSection,
  Label,
  Input,
  Textarea,
  ContentTypeButtons,
  ContentTypeButton,
  UploadSection,
  UploadArea,
  UploadIcon,
  UploadText,
  ExistingFileInfo,
  FileIcon,
  FileName,
  RemoveFileButton,
  QuestionsSection,
  QuestionsSectionHeader,
  QuestionsSectionTitle,
  AddQuestionButton,
  QuestionCard,
  QuestionHeader,
  QuestionNumber,
  DragHandle,
  RemoveQuestionButton,
  EditQuestionButton,
  QuestionText,
  AnswerSection,
  AnswerLabel,
  AnswerText,
  ExplanationSection,
  ExplanationLabel,
  ExplanationText,
  EditInput,
  EditTextarea,
  EditButtonGroup,
  ErrorText,
  Button,
  HelpText,
  EmptyState
} from './UpdateTopicModal.styles'

const SortableQuestion = memo(function SortableQuestion({ question, index, onEdit, onRemove, isEditing, editData, onEditChange, onSaveEdit, onCancelEdit }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: question.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const renderQuestionText = (text, answer) => {
    const parts = text.split('____')
    return (
      <>
        {parts.map((part, idx) => (
          <span key={idx}>
            {part}
            {idx < parts.length - 1 && (
              <span className="blank">{answer}</span>
            )}
          </span>
        ))}
      </>
    )
  }

  return (
    <QuestionCard ref={setNodeRef} style={style} isDragging={isDragging}>
      <QuestionHeader>
        <QuestionNumber>
          <DragHandle {...attributes} {...listeners}>⋮⋮</DragHandle>
          Question {index + 1}
        </QuestionNumber>
        {!isEditing && (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <EditQuestionButton type="button" onClick={() => onEdit(question)}>
              Edit
            </EditQuestionButton>
            <RemoveQuestionButton type="button" onClick={() => onRemove(index)}>
              Remove
            </RemoveQuestionButton>
          </div>
        )}
      </QuestionHeader>

      {isEditing ? (
        <>
          <FormSection>
            <Label>Pertanyaan (gunakan ____ untuk blank) *</Label>
            <EditTextarea
              value={editData.question}
              onChange={(e) => onEditChange('question', e.target.value)}
              placeholder="Contoh: Jantung memiliki ____ ruang utama"
            />
          </FormSection>

          <FormSection>
            <Label>Jawaban *</Label>
            <EditInput
              value={editData.answer}
              onChange={(e) => onEditChange('answer', e.target.value)}
              placeholder="Contoh: empat"
            />
          </FormSection>

          <FormSection>
            <Label>Penjelasan</Label>
            <EditTextarea
              value={editData.explanation}
              onChange={(e) => onEditChange('explanation', e.target.value)}
              placeholder="Jelaskan mengapa ini jawaban yang benar..."
            />
          </FormSection>

          <EditButtonGroup>
            <Button onClick={onCancelEdit}>
              Batal
            </Button>
            <Button variant="primary" onClick={onSaveEdit}>
              Simpan
            </Button>
          </EditButtonGroup>
        </>
      ) : (
        <>
          <QuestionText>
            {renderQuestionText(question.question, question.answer)}
          </QuestionText>

          <AnswerSection>
            <AnswerLabel>Jawaban</AnswerLabel>
            <AnswerText>{question.answer}</AnswerText>
          </AnswerSection>

          {question.explanation && (
            <ExplanationSection>
              <ExplanationLabel>Penjelasan</ExplanationLabel>
              <ExplanationText>{question.explanation}</ExplanationText>
            </ExplanationSection>
          )}
        </>
      )}
    </QuestionCard>
  )
})

const UpdateTopicModal = ({ topicToEdit, onClose }) => {
  const { loading } = useSelector(state => state.exercise)
  const { tags } = useSelector(state => state.tags)

  const {
    form,
    sensors,
    handleAddQuestion,
    handleRemoveQuestion,
    handleDragEnd,
    setPdfInfo,
    pdfInfo,
    initialContentType,
    initialTextContent
  } = useUpdateTopic(topicToEdit, onClose)

  const {
    contentType,
    setContentType,
    textContent,
    setTextContent,
    pdfFile,
    setPdfFile,
    questionCount,
    setQuestionCount,
    handleFileSelect,
    handleGenerate,
    canGenerate,
    isGenerating
  } = useGenerateQuestions(form, setPdfInfo, initialContentType, initialTextContent)

  // Edit state
  const [editingQuestionId, setEditingQuestionId] = useState(null)
  const [editingQuestionData, setEditingQuestionData] = useState(null)

  // Get tags from both university and semester groups - memoized
  const universityTags = useMemo(() =>
    tags.find(t => t.name === 'university')?.tags || [],
    [tags]
  )
  const semesterTags = useMemo(() =>
    tags.find(t => t.name === 'semester')?.tags || [],
    [tags]
  )

  // Handlers for tag changes (Note: Tags are read-only in update mode, but keeping for consistency)
  const handleUniversityTagsChange = (newTags) => {
    form.setFieldValue('universityTags', newTags)
  }

  const handleSemesterTagsChange = (newTags) => {
    form.setFieldValue('semesterTags', newTags)
  }

  const handleEditQuestion = (question) => {
    setEditingQuestionId(question.id)
    setEditingQuestionData({ ...question })
  }

  const handleEditChange = (field, value) => {
    setEditingQuestionData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSaveEdit = () => {
    if (!editingQuestionData.question || !editingQuestionData.answer) {
      alert('Pertanyaan dan jawaban harus diisi')
      return
    }

    const updatedQuestions = form.values.questions.map(q =>
      q.id === editingQuestionId ? editingQuestionData : q
    )
    form.setFieldValue('questions', updatedQuestions)
    setEditingQuestionId(null)
    setEditingQuestionData(null)
  }

  const handleCancelEdit = () => {
    setEditingQuestionId(null)
    setEditingQuestionData(null)
  }

  const handleModalClose = () => {
    if (onClose) onClose()
  }

  return (
    <Modal
      isOpen={true}
      onClose={handleModalClose}
      title="Update Exercise Topic"
      size="large"
      footer={
        <>
          <Button onClick={handleModalClose}>Cancel</Button>
          <Button
            variant="primary"
            onClick={form.handleSubmit}
            disabled={loading.isUpdatingTopic}
          >
            {loading.isUpdatingTopic ? 'Updating...' : 'Update Topic'}
          </Button>
        </>
      }
    >
      <FormSection>
        <Label>Judul Topik *</Label>
        <Input
          type="text"
          value={form.values.title}
          onChange={(e) => form.setFieldValue('title', e.target.value)}
          placeholder="e.g., Anatomi Jantung"
          disabled
        />
        <HelpText>Judul tidak dapat diubah saat update</HelpText>
        {form.errors.title && <ErrorText>{form.errors.title}</ErrorText>}
      </FormSection>

      <FormSection>
        <Label>Deskripsi</Label>
        <Input
          type="text"
          value={form.values.description}
          onChange={(e) => form.setFieldValue('description', e.target.value)}
          placeholder="Brief description of this topic"
          disabled
        />
        <HelpText>Deskripsi tidak dapat diubah saat update</HelpText>
      </FormSection>

      {/* University Tags (Read-only) */}
      <FormSection>
        <Label>Universitas</Label>
        <div style={{ padding: '0.75rem', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
          {form.values.universityTags.map(tag => tag.name).join(', ') || 'Tidak ada'}
        </div>
        <HelpText>Tag tidak dapat diubah saat update</HelpText>
      </FormSection>

      {/* Semester Tags (Read-only) */}
      <FormSection>
        <Label>Semester</Label>
        <div style={{ padding: '0.75rem', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
          {form.values.semesterTags.map(tag => tag.name).join(', ') || 'Tidak ada'}
        </div>
        <HelpText>Tag tidak dapat diubah saat update</HelpText>
      </FormSection>

      {/* AI Generation Section */}
      <FormSection>
        <Label>Generate Soal Baru dari AI (Opsional)</Label>
        <ContentTypeButtons>
          <ContentTypeButton
            type="button"
            isActive={contentType === 'document'}
            onClick={() => setContentType('document')}
          >
            📄 Document (PDF)
          </ContentTypeButton>
          <ContentTypeButton
            type="button"
            isActive={contentType === 'text'}
            onClick={() => setContentType('text')}
          >
            📝 Text Content
          </ContentTypeButton>
        </ContentTypeButtons>

        {contentType === 'document' ? (
          <UploadSection>
            {/* Show existing PDF info if topic was created from PDF */}
            {pdfInfo && !pdfFile && (
              <ExistingFileInfo style={{ marginBottom: '1rem', backgroundColor: '#f0f9ff', border: '1px solid #bae6fd' }}>
                <FileIcon>📕</FileIcon>
                <div style={{ flex: 1 }}>
                  <FileName>{pdfInfo.pdf_filename || 'Existing PDF'}</FileName>
                  <div style={{ fontSize: '0.85rem', color: '#0369a1', marginTop: '0.25rem' }}>
                    Topik ini dibuat dari PDF. Upload PDF baru untuk re-generate.
                  </div>
                </div>
              </ExistingFileInfo>
            )}

            {!pdfFile ? (
              <UploadArea onClick={() => document.getElementById('pdf-upload-update').click()}>
                <input
                  id="pdf-upload-update"
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
                <UploadIcon>📤</UploadIcon>
                <UploadText>
                  {isGenerating ? 'Uploading...' : pdfInfo ? 'Upload PDF baru untuk re-generate' : 'Klik untuk upload PDF'}
                </UploadText>
                <UploadText style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
                  PDF file (max 20MB)
                </UploadText>
              </UploadArea>
            ) : (
              <ExistingFileInfo>
                <FileIcon>📕</FileIcon>
                <div style={{ flex: 1 }}>
                  <FileName>{pdfFile.name}</FileName>
                  <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>
                    Siap untuk di-generate menjadi soal
                  </div>
                </div>
                <RemoveFileButton onClick={() => setPdfFile(null)}>
                  Hapus
                </RemoveFileButton>
              </ExistingFileInfo>
            )}
          </UploadSection>
        ) : (
          <FormSection>
            <Textarea
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Paste your medical study material here..."
            />
            <HelpText>Masukkan konten yang ingin di-generate menjadi soal</HelpText>
          </FormSection>
        )}
      </FormSection>

      <FormSection>
        <Label>Jumlah Soal yang Akan Digenerate</Label>
        <Input
          type="number"
          min="1"
          max="50"
          value={questionCount}
          onChange={(e) => setQuestionCount(parseInt(e.target.value) || 10)}
        />
        <HelpText>Pilih antara 1-50 soal</HelpText>
      </FormSection>

      <FormSection>
        <Button
          type="button"
          variant="success"
          onClick={handleGenerate}
          disabled={isGenerating || !canGenerate}
          style={{ width: '100%', padding: '0.875rem 1.5rem', fontSize: '0.9375rem' }}
        >
          {isGenerating ? 'Generating...' : '✨ Generate Soal'}
        </Button>
      </FormSection>

      <QuestionsSection>
        <QuestionsSectionHeader>
          <QuestionsSectionTitle>Soal ({form.values.questions.length})</QuestionsSectionTitle>
          <AddQuestionButton type="button" onClick={handleAddQuestion}>
            + Tambah Soal Manual
          </AddQuestionButton>
        </QuestionsSectionHeader>
        {typeof form.errors.questions === 'string' && <ErrorText>{form.errors.questions}</ErrorText>}

        {form.values.questions.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={(form.values.questions || []).map(q => q.id)}
              strategy={verticalListSortingStrategy}
            >
              {(form.values.questions || []).map((question, index) => (
                <SortableQuestion
                  key={question.id}
                  question={question}
                  index={index}
                  onEdit={handleEditQuestion}
                  onRemove={handleRemoveQuestion}
                  isEditing={editingQuestionId === question.id}
                  editData={editingQuestionData}
                  onEditChange={handleEditChange}
                  onSaveEdit={handleSaveEdit}
                  onCancelEdit={handleCancelEdit}
                />
              ))}
            </SortableContext>
          </DndContext>
        ) : (
          <EmptyState>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
            <div>Belum ada soal. Klik "Generate Soal" untuk membuat soal otomatis.</div>
          </EmptyState>
        )}
      </QuestionsSection>
    </Modal>
  )
}

export default UpdateTopicModal
