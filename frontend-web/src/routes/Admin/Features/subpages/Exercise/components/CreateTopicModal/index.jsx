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
import { useCreateTopic } from '../../hooks/subhooks/useCreateTopic'
import {
  FormSection,
  Label,
  Input,
  Textarea,
  ContentTypeButtons,
  ContentTypeButton,
  QuestionsSection,
  QuestionsSectionHeader,
  QuestionsSectionTitle,
  QuestionCard,
  QuestionHeader,
  QuestionNumber,
  DragHandle,
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
  HelpText,
  EmptyState
} from './CreateTopicModal.styles'
import Button from "@components/common/Button"

const SortableQuestion = memo(function SortableQuestion({ question, index, onRemove, onQuestionChange, onImageUpload, onImageRemove, isUploadingImage }) {
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

  return (
    <QuestionCard ref={setNodeRef} style={style} isDragging={isDragging}>
      <QuestionHeader>
        <QuestionNumber>
          <DragHandle {...attributes} {...listeners}>⋮⋮</DragHandle>
          Question {index + 1}
        </QuestionNumber>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button variant="danger" type="button" onClick={() => onRemove(index)}>
            Remove
          </Button>
        </div>
      </QuestionHeader>

      {/* Always in edit mode */}
      {(
        <>
          <FormSection>
            <Label>Pertanyaan (gunakan ____ untuk blank) *</Label>
            <EditTextarea
              value={question.question}
              onChange={(e) => onQuestionChange(question.id, 'question', e.target.value)}
              placeholder="Contoh: Jantung memiliki ____ ruang utama"
            />
          </FormSection>

          <FormSection>
            <Label>Jawaban *</Label>
            <EditInput
              value={question.answer}
              onChange={(e) => onQuestionChange(question.id, 'answer', e.target.value)}
              placeholder="Contoh: empat"
            />
          </FormSection>

          {/* <FormSection>
            <Label>Penjelasan</Label>
            <EditTextarea
              value={question.explanation}
              onChange={(e) => onQuestionChange(question.id, 'explanation', e.target.value)}
              placeholder="Jelaskan mengapa ini jawaban yang benar..."
            />
          </FormSection> */}

          <FormSection>
            <Label>Gambar Pertanyaan (Opsional)</Label>
            <PhotoProvider>
              <FileUpload
                file={question.image ? {
                  name: question.image.filename || 'image',
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
                    {question.image?.url && (
                      <PhotoView src={question.image.url}>
                        <Button variant="primary" size="small">
                          Lihat Gambar
                        </Button>
                      </PhotoView>
                    )}
                  </>
                }
              />
            </PhotoProvider>
          </FormSection>
        </>
      )}
    </QuestionCard>
  )
})

const CreateTopicModal = ({ onClose }) => {
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
  } = useCreateTopic(onClose)

  const { loading: commonLoading } = useSelector(state => state.common)

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

  const handleQuestionChange = (questionId, field, value) => {
    const updatedQuestions = form.values.questions.map(q =>
      q.id === questionId ? { ...q, [field]: value } : q
    )
    form.setFieldValue('questions', updatedQuestions)
  }

  const handleModalClose = () => {
    if (onClose) onClose()
  }

  return (
    <Modal
      isOpen={true}
      onClose={handleModalClose}
      title="Create Exercise Topic"
      size="large"
      footer={
        <>
          <Button variant="secondary" onClick={handleModalClose}>Cancel</Button>
          <Button
            variant="primary"
            onClick={form.handleSubmit}
            disabled={loading.isCreatingTopic}
          >
            {loading.isCreatingTopic ? 'Creating...' : 'Create Topic'}
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
        {form.errors.universityTags && <ErrorText>{form.errors.universityTags}</ErrorText>}
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
        {form.errors.semesterTags && <ErrorText>{form.errors.semesterTags}</ErrorText>}
      </FormSection>

      {/* AI Generation Section */}
      <FormSection>
        <Label>Generate dari AI (Opsional)</Label>
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
                  <Button
                    variant="primary"
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
                  </Button>
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
          <Button variant="primary" type="button" onClick={handleAddQuestion}>
            + Tambah Soal Manual
          </Button>
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
                  onRemove={handleRemoveQuestion}
                  onQuestionChange={handleQuestionChange}
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

export default CreateTopicModal
