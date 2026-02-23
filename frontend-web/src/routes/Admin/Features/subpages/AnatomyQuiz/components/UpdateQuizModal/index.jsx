import { useCallback, useMemo } from 'react'
import Modal from '@components/common/Modal'
import TagSelector from '@components/common/TagSelector'
import FileUpload from '@components/common/FileUpload'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'
import {
  FormSection,
  Label,
  Input,
  Textarea,
  QuestionsSection,
  QuestionsSectionHeader,
  QuestionsSectionTitle,
  QuestionCard,
  QuestionCardHeader,
  QuestionNumber,
  ErrorText,
  StatusToggle,
  StatusOption,
  AnswerTypeToggle,
  AnswerTypeButton,
  OptionContainer,
  OptionRadio,
  OptionLabel,
  OptionInput,
  HelpText
} from './UpdateQuizModal.styles'
import Button from "@components/common/Button"
import { useSelector } from 'react-redux'
import { useUpdateQuiz } from '../../hooks/subhooks/useUpdateQuiz'

const UpdateQuizModal = ({ onClose }) => {
    const { loading } = useSelector(state => state.anatomy)
    const { tags } = useSelector(state => state.tags)

    const { form, handleAddQuestion, handleRemoveQuestion, handleAddOption, handleRemoveOption, handleImageSelect } = useUpdateQuiz(onClose)

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
    form.setFieldValue('universityTags', newTags)
  }, [form])

  const handleSemesterTagsChange = useCallback((newTags) => {
    form.setFieldValue('semesterTags', newTags)
  }, [form])

  const handleModalClose = () => {
    if (onClose) onClose()
  }

  return (
    <>
      <Modal
        isOpen={true}
        onClose={handleModalClose}
        title={'Edit Anatomy Quiz'}
        size="large"
        footer={
          <>
            <Button variant="secondary" onClick={handleModalClose}>Cancel</Button>
            <Button
              variant="primary"
              onClick={form.handleSubmit}
              disabled={loading.isCreateAnatomyQuizLoading || loading.isUpdateAnatomyQuizLoading}
            >
              {(loading.isCreateAnatomyQuizLoading || loading.isUpdateAnatomyQuizLoading)
                ? 'Updating...'
                : 'Update Quiz'}
            </Button>
          </>
        }
      >
        <FormSection>
          <Label>Title *</Label>
          <Input
            type="text"
            value={form.values.title}
            onChange={(e) => form.setFieldValue('title', e.target.value)}
            placeholder="e.g., Anatomi Jantung"
          />
          {form.errors.title && <ErrorText>{form.errors.title}</ErrorText>}
        </FormSection>

        <FormSection>
          <Label>Description</Label>
          <Textarea
            value={form.values.description}
            onChange={(e) => form.setFieldValue('description', e.target.value)}
            placeholder="Brief description of the quiz"
          />
        </FormSection>

        <FormSection>
          <Label>Media *</Label>
          <AnswerTypeToggle>
            <AnswerTypeButton
              type="button"
              isActive={form.values.mediaType === 'upload'}
              onClick={() => form.setFieldValue('mediaType', 'upload')}
            >
              📁 Upload Image
            </AnswerTypeButton>
            <AnswerTypeButton
              type="button"
              isActive={form.values.mediaType === 'embed'}
              onClick={() => form.setFieldValue('mediaType', 'embed')}
            >
              🔗 Embed URL
            </AnswerTypeButton>
          </AnswerTypeToggle>

          {form.values.mediaType === 'upload' ? (
            <PhotoProvider>
              <FileUpload
                file={form.values.blob.id ? {
                  name: form.values.blob.filename || 'File name',
                  type: 'image/*',
                  size: form.values.blob.size
                } : null}
                onFileSelect={handleImageSelect}
                onRemove={() => {
                  form.setFieldValue('blob', {
                    id: null,
                    url: '',
                    filename: '',
                    size: null
                  })
                }}
                isUploading={loading.isUploadingImage}
                acceptedTypes={['image/jpeg', 'image/jpg', 'image/png']}
                acceptedTypesLabel="JPEG atau PNG"
                maxSizeMB={5}
                uploadText="Klik untuk upload gambar"
                actions={
                  <>
                    {form.values.blob.url && (
                      <PhotoView src={form.values.blob.url}>
                        <Button variant="primary" type="button">
                          👁️ Preview
                        </Button>
                      </PhotoView>
                    )}
                  </>
                }
              />
            </PhotoProvider>
          ) : (
            <>
              <Input
                type="url"
                value={form.values.embedUrl}
                onChange={(e) => form.setFieldValue('embedUrl', e.target.value)}
                placeholder="https://human.biodigital.com/viewer/?id=..."
                style={{ marginTop: '0.5rem' }}
              />
              <HelpText>Paste an embed URL from BioDigital Human, Sketchfab, or other 3D model platforms</HelpText>
            </>
          )}

          {form.errors.blob && form.values.mediaType === 'upload' && <ErrorText>{form.errors.blob}</ErrorText>}
          {form.errors.embedUrl && form.values.mediaType === 'embed' && <ErrorText>{form.errors.embedUrl}</ErrorText>}
        </FormSection>

        {form.values.mediaType === 'embed' && (
          <FormSection>
            <Label>Question Count * (required)</Label>
            <Input
              type="number"
              min="0"
              value={form.values.questionCount}
              onChange={(e) => form.setFieldValue('questionCount', e.target.value)}
              placeholder="e.g., 10"
            />
            <HelpText>Number of questions students need to answer for this 3D model</HelpText>
            {form.errors.questionCount && <ErrorText>{form.errors.questionCount}</ErrorText>}
          </FormSection>
        )}

        {/* University Tags Section */}
        <FormSection>
          <Label>Universitas</Label>
          <TagSelector
            allTags={universityTags}
            selectedTags={form.values.universityTags}
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
            selectedTags={form.values.semesterTags || []}
            onTagsChange={handleSemesterTagsChange}
            placeholder="-- Pilih Semester --"
            helpText="Pilih semester untuk membantu mengorganisir quiz"
          />
        </FormSection>

        {form.values.mediaType === 'upload' && <QuestionsSection>
          <QuestionsSectionHeader>
            <QuestionsSectionTitle>Input Fields for Students</QuestionsSectionTitle>
            <Button variant="primary" type="button" onClick={handleAddQuestion}>
              + Add Input Field
            </Button>
          </QuestionsSectionHeader>
          {form.errors.questions && <ErrorText>{form.errors.questions}</ErrorText>}

          {form.values.questions.map((question, index) => (
            <QuestionCard key={question.tempId || index}>
              <QuestionCardHeader>
                <QuestionNumber>Input Field {index + 1}</QuestionNumber>
                <Button variant="danger" type="button" onClick={() => handleRemoveQuestion(index)}>
                  Remove
                </Button>
              </QuestionCardHeader>

              <FormSection>
                <Label>Question *</Label>
                <Input
                  type="text"
                  value={question.question}
                  onChange={(e) => form.setFieldValue(`questions.${index}.question`, e.target.value)}
                  placeholder="e.g., Ruang jantung dengan dinding paling tebal yang memompa darah ke seluruh tubuh adalah?"
                />
                {form.errors[`questions.${index}.question`] && (
                  <ErrorText>{form.errors[`questions.${index}.question`]}</ErrorText>
                )}
              </FormSection>

              <FormSection>
                <Label>Answer Type *</Label>
                <AnswerTypeToggle>
                  <AnswerTypeButton
                    type="button"
                    isActive={(question.answerType || 'text') === 'text'}
                    onClick={() => form.setFieldValue(`questions.${index}.answerType`, 'text')}
                  >
                    📝 Text Input
                  </AnswerTypeButton>
                  <AnswerTypeButton
                    type="button"
                    isActive={(question.answerType || 'text') === 'multiple_choice'}
                    onClick={() => {
                      form.setFieldValue(`questions.${index}.answerType`, 'multiple_choice')
                      // Initialize choices if not already set
                      if (!question.choices || question.choices.length === 0) {
                        form.setFieldValue(`questions.${index}.choices`, ['', ''])
                      }
                    }}
                  >
                    ☑️ Multiple Choice
                  </AnswerTypeButton>
                </AnswerTypeToggle>
              </FormSection>

              {(question.answerType || 'text') === 'multiple_choice' ? (
                <FormSection>
                  <Label>Options * (minimum 2)</Label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {(question.choices || []).map((choice, choiceIndex) => (
                      <OptionContainer
                        key={choiceIndex}
                        isSelected={choiceIndex === question.correctChoiceIndex}
                        onClick={() => {
                          form.setFieldValue(`questions.${index}.correctChoiceIndex`, choiceIndex)
                          form.setFieldValue(`questions.${index}.answer`, choice)
                        }}
                      >
                        <OptionRadio
                          type="radio"
                          name={`correct-${index}`}
                          checked={choiceIndex === question.correctChoiceIndex}
                          onChange={() => {
                            form.setFieldValue(`questions.${index}.correctChoiceIndex`, choiceIndex)
                            form.setFieldValue(`questions.${index}.answer`, choice)
                          }}
                        />
                        <OptionLabel isSelected={choiceIndex === question.correctChoiceIndex}>
                          {String.fromCharCode(65 + choiceIndex)}
                        </OptionLabel>
                        <OptionInput
                          type="text"
                          value={choice}
                          onChange={(e) => {
                            e.stopPropagation()
                            form.setFieldValue(`questions.${index}.choices.${choiceIndex}`, e.target.value)
                            // Auto-update answer if this is the selected choice
                            if (question.correctChoiceIndex === choiceIndex) {
                              form.setFieldValue(`questions.${index}.answer`, e.target.value)
                            }
                          }}
                          onClick={(e) => e.stopPropagation()}
                          placeholder={`Option ${String.fromCharCode(65 + choiceIndex)}`}
                        />
                        {(question.choices || []).length > 2 && (
                          <Button
                            variant="danger"
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleRemoveOption(index, choiceIndex)
                            }}
                          >
                            Remove
                          </Button>
                        )}
                      </OptionContainer>
                    ))}
                    <Button
                      variant="primary"
                      type="button"
                      onClick={() => handleAddOption(index)}
                    >
                      + Add Option
                    </Button>
                  </div>
                  <HelpText>Click on an option to mark it as the correct answer</HelpText>
                  {form.errors[`questions.${index}.answer`] && (
                    <ErrorText>{form.errors[`questions.${index}.answer`]}</ErrorText>
                  )}
                </FormSection>
              ) : (
                <FormSection>
                  <Label>Correct Answer *</Label>
                  <Input
                    type="text"
                    value={question.answer}
                    onChange={(e) => form.setFieldValue(`questions.${index}.answer`, e.target.value)}
                    placeholder="e.g., Ventrikel Kiri"
                  />
                  {form.errors[`questions.${index}.answer`] && (
                    <ErrorText>{form.errors[`questions.${index}.answer`]}</ErrorText>
                  )}
                </FormSection>
              )}
            </QuestionCard>
          ))}
        </QuestionsSection>}

        <StatusToggle>
          <StatusOption checked={form.values.status === 'draft'}>
            <input
              type="radio"
              name="status"
              value="draft"
              checked={form.values.status === 'draft'}
              onChange={(e) => form.setFieldValue('status', e.target.value)}
            />
            Draft
          </StatusOption>
          <StatusOption checked={form.values.status === 'published'}>
            <input
              type="radio"
              name="status"
              value="published"
              checked={form.values.status === 'published'}
              onChange={(e) => form.setFieldValue('status', e.target.value)}
            />
            Published
          </StatusOption>
        </StatusToggle>
      </Modal>
    </>
  )
}

export default UpdateQuizModal
