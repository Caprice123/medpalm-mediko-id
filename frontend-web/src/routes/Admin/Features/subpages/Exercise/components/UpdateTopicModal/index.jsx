import { memo, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import Modal from '@components/common/Modal'
import TagSelector from '@components/common/TagSelector'
import FileUpload from '@components/common/FileUpload'
import { DndContext, closestCenter } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'
import { useUpdateTopic } from '../../hooks/subhooks/useUpdateTopic'
import {
  FormSection,
  Label,
  Input,
  Textarea,
  ContentTypeButtons,
  ContentTypeButton,
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
  StatusToggle,
  StatusOption,
  Button,
  HelpText,
  EmptyState
} from './UpdateTopicModal.styles'

const SortableQuestion = memo(function SortableQuestion({ question, index, onEdit, onRemove, isEditing, editData, onEditChange, onSaveEdit, onCancelEdit, onImageUpload, onImageRemove, isUploadingImage }) {
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

          <FormSection>
            <Label>Gambar Pertanyaan (Opsional)</Label>
            <PhotoProvider>
              <FileUpload
                file={editData.image ? {
                  name: editData.image.filename || 'image',
                  type: 'image/*',
                  size: 0
                } : null}
                onFileSelect={(file) => onImageUpload(question.id, file)}
                onRemove={() => onImageRemove(question.id)}
                isUploading={isUploadingImage}
                acceptedTypes={['image/jpeg', 'image/jpg', 'image/png']}
                acceptedTypesLabel="JPEG atau PNG"
                maxSizeMB={5}
                uploadText="Klik untuk upload gambar"
                actions={
                  <>
                    {editData.image?.url && (
                      <PhotoView src={editData.image.url}>
                        <Button
                          type="button"
                          style={{ backgroundColor: '#3b82f6', color: 'white', fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                        >
                          Lihat Gambar
                        </Button>
                      </PhotoView>
                    )}
                  </>
                }
              />
            </PhotoProvider>
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

          {question.image && (
            <ExplanationSection>
              <ExplanationLabel>Gambar</ExplanationLabel>
              <PhotoProvider>
                <PhotoView src={question.image.url}>
                  <img
                    src={question.image.url}
                    alt="Question"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '300px',
                      cursor: 'pointer',
                      borderRadius: '8px',
                      marginTop: '0.5rem'
                    }}
                  />
                </PhotoView>
              </PhotoProvider>
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
    handleFileSelect,
    handleGenerate,
    canGenerate,
    isGenerating,
    handleQuestionImageUpload,
    handleQuestionImageRemove
  } = useUpdateTopic(topicToEdit, onClose)

  const { loading: commonLoading } = useSelector(state => state.common)

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
      q.id === editingQuestionId ? { ...editingQuestionData, id: q.id } : q
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
        />
        {form.errors.title && <ErrorText>{form.errors.title}</ErrorText>}
      </FormSection>

      <FormSection>
        <Label>Deskripsi</Label>
        <Textarea
          value={form.values.description}
          onChange={(e) => form.setFieldValue('description', e.target.value)}
          placeholder="Brief description of this topic"
        />
      </FormSection>

      {/* University Tags */}
      <FormSection>
        <Label>Universitas</Label>
        <TagSelector
          allTags={universityTags}
          selectedTags={form.values.universityTags}
          onTagsChange={handleUniversityTagsChange}
          placeholder="-- Pilih Universitas --"
          helpText="Pilih universitas untuk membantu mengorganisir topik"
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
          helpText="Pilih semester untuk membantu mengorganisir topik"
        />
      </FormSection>

      {/* AI Generation Section */}
      <FormSection>
        <Label>Generate Soal Baru dari AI (Opsional)</Label>
        <ContentTypeButtons>
          <ContentTypeButton
            type="button"
            isActive={form.values.contentType === 'document'}
            onClick={() => form.setFieldValue('contentType', 'document')}
          >
            📄 Document (PDF)
          </ContentTypeButton>
          <ContentTypeButton
            type="button"
            isActive={form.values.contentType === 'text'}
            onClick={() => form.setFieldValue('contentType', 'text')}
          >
            📝 Text Content
          </ContentTypeButton>
        </ContentTypeButtons>

        {form.values.contentType === 'document' ? (
            <FileUpload
            file={form.values.pdfFile ? {
                name: form.values.pdfFile.name,
                type: form.values.pdfFile.type,
                size: form.values.pdfFile.size
            } : null}
            onFileSelect={handleFileSelect}
            onRemove={() => {
                form.setFieldValue('pdfFile', null)
                form.setFieldValue('uploadedBlobId', null)
            }}
            isUploading={isGenerating}
            acceptedTypes={['application/pdf']}
            acceptedTypesLabel="PDF file"
            maxSizeMB={20}
            uploadText="Klik untuk upload PDF"
            actions={
                <>
                {form.values.pdfFile && (
                    <RemoveFileButton
                    onClick={() => {
                        // Check if it's a File object or just an object with URL
                        const url = form.values.pdfFile instanceof File
                            ? URL.createObjectURL(form.values.pdfFile)
                            : form.values.pdfFile.url
                        window.open(url, '_blank')
                    }}
                    style={{ backgroundColor: '#3b82f6', color: 'white' }}
                    >
                    Lihat
                    </RemoveFileButton>
                )}
                </>
            }
            />
        ) : (
            <FormSection>
            <Textarea
                value={form.values.textContent}
                onChange={(e) => form.setFieldValue('textContent', e.target.value)}
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
          value={form.values.questionCount}
          onChange={(e) => form.setFieldValue('questionCount', parseInt(e.target.value))}
        />
        <HelpText>Pilih antara 1-50 soal</HelpText>
      </FormSection>

      <FormSection>
        <Button
          type="button"
          variant="primary"
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
                  onImageUpload={handleQuestionImageUpload}
                  onImageRemove={handleQuestionImageRemove}
                  isUploadingImage={commonLoading.isUploading}
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

      <StatusToggle>
        <StatusOption>
          <input
            type="radio"
            name="status"
            value="draft"
            checked={form.values.status === 'draft'}
            onChange={(e) => form.setFieldValue('status', e.target.value)}
          />
          Save as Draft
        </StatusOption>
        <StatusOption>
          <input
            type="radio"
            name="status"
            value="published"
            checked={form.values.status === 'published'}
            onChange={(e) => form.setFieldValue('status', e.target.value)}
          />
          Publish Now
        </StatusOption>
      </StatusToggle>
    </Modal>
  )
}

export default UpdateTopicModal
