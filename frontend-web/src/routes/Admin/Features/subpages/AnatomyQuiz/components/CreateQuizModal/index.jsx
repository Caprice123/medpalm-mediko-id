import { useCallback, useMemo } from 'react'
import Modal from '@components/common/Modal'
import TagSelector from '@components/common/TagSelector'
import {
  FormSection,
  Label,
  Input,
  Textarea,
  ImageUploadArea,
  ImageUploadIcon,
  ImageUploadText,
  ImageUploadHint,
  ImagePreview,
  PreviewImage,
  RemoveImageButton,
  QuestionsSection,
  QuestionsSectionHeader,
  QuestionsSectionTitle,
  AddQuestionButton,
  QuestionCard,
  QuestionCardHeader,
  QuestionNumber,
  RemoveQuestionButton,
  ErrorText,
  StatusToggle,
  StatusOption,
  Button
} from './CreateQuizModal.styles'
import { useSelector } from 'react-redux'
import { useCreateQuiz } from '../../hooks/subhooks/useCreateQuiz'
import { useUpdateQuiz } from '../../hooks/subhooks/useUpdateQuiz'

const CreateQuizModal = ({ isOpen, mode, quiz, onClose }) => {
    const { loading } = useSelector(state => state.anatomy)
    const { tags } = useSelector(state => state.tags)

    // Use the appropriate hook based on mode
    const createHandler = useCreateQuiz()
    const updateHandler = useUpdateQuiz(null, quiz)

    // Select handler based on mode
    const handler = mode === 'update' ? updateHandler : createHandler

  // Get tags from both university and semester groups - memoized
  const universityTags = useMemo(() =>
    tags.find(t => t.name === 'university')?.tags || [],
    [tags]
  )
  const semesterTags = useMemo(() =>
    tags.find(t => t.name === 'semester')?.tags || [],
    [tags]
  )

  // Handlers for tag changes - now directly update separate fields
  const handleUniversityTagsChange = useCallback((newTags) => {
    handler.form.setFieldValue('universityTags', newTags)
  }, [handler.form])

  const handleSemesterTagsChange = useCallback((newTags) => {
    handler.form.setFieldValue('semesterTags', newTags)
  }, [handler.form])

  const handleModalClose = () => {
    if (onClose) onClose()
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleModalClose}
        title={mode == "update" ? 'Edit Anatomy Quiz' : 'Create Anatomy Quiz'}
        size="large"
        footer={
          <>
            <Button onClick={handleModalClose}>Cancel</Button>
            <Button
              variant="primary"
              onClick={handler.form.handleSubmit}
              disabled={loading.isCreatingQuiz || loading.isUpdatingQuiz}
            >
              {(loading.isCreatingQuiz || loading.isUpdatingQuiz)
                ? (mode == "update" ? 'Updating...' : 'Creating...')
                : (mode == "update" ? 'Update Quiz' : 'Create Quiz')}
            </Button>
          </>
        }
      >
        <FormSection>
          <Label>Title *</Label>
          <Input
            type="text"
            value={handler.form.values.title}
            onChange={(e) => handler.form.setFieldValue('title', e.target.value)}
            placeholder="e.g., Anatomi Jantung"
          />
          {handler.form.errors.title && <ErrorText>{handler.form.errors.title}</ErrorText>}
        </FormSection>

        <FormSection>
          <Label>Description</Label>
          <Textarea
            value={handler.form.values.description}
            onChange={(e) => handler.form.setFieldValue('description', e.target.value)}
            placeholder="Brief description of the quiz"
          />
        </FormSection>

        <FormSection>
          <Label>Upload Image *</Label>
          <ImageUploadArea
            hasImage={handler.form.values.image_url}
            onClick={() => document.getElementById('image-upload').click()}
          >
            <input
              id="image-upload"
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handler.handleImageSelect}
              style={{ display: 'none' }}
            />
            {!handler.form.values.image_url ? (
              <>
                <ImageUploadIcon>📤</ImageUploadIcon>
                <ImageUploadText>
                  {loading.isUploadingImage ? 'Uploading...' : 'Click to upload image'}
                </ImageUploadText>
                <ImageUploadHint>JPEG or PNG, max 5MB</ImageUploadHint>
              </>
            ) : (
              <ImagePreview>
                <PreviewImage src={handler.form.values.image_url} alt="Preview" />
                <RemoveImageButton
                  onClick={(e) => {
                    e.stopPropagation()
                    handler.form.setFieldValue('image_url', '')
                    handler.form.setFieldValue('image_key', '')
                    handler.form.setFieldValue('image_filename', '')
                  }}
                >
                  ×
                </RemoveImageButton>
              </ImagePreview>
            )}
          </ImageUploadArea>
          {handler.form.errors.image_url && <ErrorText>{handler.form.errors.image_url}</ErrorText>}
        </FormSection>

        {/* University Tags Section */}
        <FormSection>
          <Label>Universitas</Label>
          <TagSelector
            allTags={universityTags}
            selectedTags={handler.form.values.universityTags}
            onTagsChange={handleUniversityTagsChange}
            placeholder="-- Pilih Universitas --"
            helpText="Pilih universitas untuk membantu mengorganisir quiz"
          />
        </FormSection>

        {/* Semester Tags Section */}
        <FormSection>
          <Label>Semester</Label>
          <TagSelector
            allTags={semesterTags}
            selectedTags={handler.form.values.semesterTags || []}
            onTagsChange={handleSemesterTagsChange}
            placeholder="-- Pilih Semester --"
            helpText="Pilih semester untuk membantu mengorganisir quiz"
          />
        </FormSection>

        <QuestionsSection>
          <QuestionsSectionHeader>
            <QuestionsSectionTitle>Input Fields for Students</QuestionsSectionTitle>
            <AddQuestionButton type="button" onClick={handler.handleAddQuestion}>
              + Add Input Field
            </AddQuestionButton>
          </QuestionsSectionHeader>
          {handler.form.errors.questions && <ErrorText>{handler.form.errors.questions}</ErrorText>}

          {handler.form.values.questions.map((question, index) => (
            <QuestionCard key={question.tempId || index}>
              <QuestionCardHeader>
                <QuestionNumber>Input Field {index + 1}</QuestionNumber>
                <RemoveQuestionButton type="button" onClick={() => handler.handleRemoveQuestion(index)}>
                  Remove
                </RemoveQuestionButton>
              </QuestionCardHeader>

              <FormSection>
                <Label>Field Label (what students will see) *</Label>
                <Textarea
                  value={question.label}
                  onChange={(e) => handler.form.setFieldValue(`questions.${index}.label`, e.target.value)}
                  placeholder="e.g., Ruang jantung dengan dinding paling tebal yang memompa darah ke seluruh tubuh adalah?"
                />
                {handler.form.errors[`questions.${index}.label`] && (
                  <ErrorText>{handler.form.errors[`questions.${index}.label`]}</ErrorText>
                )}
              </FormSection>

              <FormSection>
                <Label>Correct Answer *</Label>
                <Input
                  type="text"
                  value={question.answer}
                  onChange={(e) => handler.form.setFieldValue(`questions.${index}.answer`, e.target.value)}
                  placeholder="e.g., Ventrikel Kiri"
                />
                {handler.form.errors[`questions.${index}.answer`] && (
                  <ErrorText>{handler.form.errors[`questions.${index}.answer`]}</ErrorText>
                )}
              </FormSection>

              <FormSection>
                <Label>Explanation *</Label>
                <Textarea
                  value={question.explanation}
                  onChange={(e) => handler.form.setFieldValue(`questions.${index}.explanation`, e.target.value)}
                  placeholder="Explain why this is the correct answer"
                />
                {handler.form.errors[`questions.${index}.explanation`] && (
                  <ErrorText>{handler.form.errors[`questions.${index}.explanation`]}</ErrorText>
                )}
              </FormSection>
            </QuestionCard>
          ))}
        </QuestionsSection>

        <StatusToggle>
          <StatusOption>
            <input
              type="radio"
              name="status"
              value="draft"
              checked={handler.form.values.status === 'draft'}
              onChange={(e) => handler.form.setFieldValue('status', e.target.value)}
            />
            Save as Draft
          </StatusOption>
          <StatusOption>
            <input
              type="radio"
              name="status"
              value="published"
              checked={handler.form.values.status === 'published'}
              onChange={(e) => handler.form.setFieldValue('status', e.target.value)}
            />
            Publish Now
          </StatusOption>
        </StatusToggle>
      </Modal>
    </>
  )
}

export default CreateQuizModal
