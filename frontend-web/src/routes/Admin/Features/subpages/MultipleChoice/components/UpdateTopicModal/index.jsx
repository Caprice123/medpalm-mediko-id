import { useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import Modal from '@components/common/Modal'
import TagSelector from '@components/common/TagSelector'
import { generateMcqQuestions } from '@store/mcq/action'
import {
  FormSection,
  FormRow,
  Label,
  Input,
  Textarea,
  Select,
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
  OptionsGrid,
  OptionContainer,
  OptionLabel,
  OptionRadio,
  OptionInput,
  AddOptionButton,
  RemoveOptionButton,
  ErrorText,
  StatusToggle,
  StatusOption,
  Button,
  HelpText,
  UploadSection,
  UploadArea,
  UploadIcon,
  UploadText,
  ExistingFileInfo,
  FileIcon,
  FileName,
  GenerateButton,
  RemoveFileButton,
  ContentTypeButtons,
  ContentTypeButton
} from './UpdateTopicModal.styles'
import { useSelector } from 'react-redux'
import { useUpdateTopic } from '../../hooks/subhooks/useUpdateTopic'

const UpdateTopicModal = ({ onClose }) => {
  const dispatch = useDispatch()
  const { loading } = useSelector(state => state.mcq)
  const { tags } = useSelector(state => state.tags)

  const [contentType, setContentType] = useState('document') // 'document' or 'text'
  const [generationContent, setGenerationContent] = useState('')
  const [generationFile, setGenerationFile] = useState(null)
  const [questionCount, setQuestionCount] = useState(10)

  const { form, handleAddQuestion, handleRemoveQuestion, handleAddOption, handleRemoveOption, handleQuestionImageSelect } = useUpdateTopic(onClose)

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setGenerationFile(selectedFile)
    }
  }

  const handleGenerate = async () => {
    try {
      const type = contentType === 'document' ? 'pdf' : 'text'
      const questions = await dispatch(generateMcqQuestions({
        content: generationContent,
        file: generationFile,
        type: type,
        questionCount
      }))

      // Replace existing questions with generated ones
      form.setFieldValue('questions', questions)

      // Reset generation inputs
      setGenerationContent('')
      setGenerationFile(null)
    } catch (error) {
      console.error('Failed to generate MCQ questions:', error)
    }
  }

  const canGenerate = contentType === 'document'
    ? generationFile !== null
    : generationContent.trim().length > 0

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

  return (
    <Modal
      isOpen={true}
      onClose={handleModalClose}
      title={'Update Multiple Choice Topic'}
      size="large"
      footer={
        <>
          <Button onClick={handleModalClose}>Cancel</Button>
          <Button
            variant="primary"
            onClick={form.handleSubmit}
            disabled={loading.isCreatingTopic || loading.isUpdatingTopic}
          >
            {(loading.isCreatingTopic || loading.isUpdatingTopic)
              ? 'Updating...'
              : 'Update Topic'}
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
          placeholder="e.g., Sistem Kardiovaskular"
        />
        {form.errors.title && <ErrorText>{form.errors.title}</ErrorText>}
      </FormSection>

      <FormSection>
        <Label>Description</Label>
        <Textarea
          value={form.values.description}
          onChange={(e) => form.setFieldValue('description', e.target.value)}
          placeholder="Brief description of this topic"
        />
      </FormSection>

      <FormRow columns={2}>
        <FormSection>
          <Label>Quiz Time Limit (minutes)</Label>
          <Input
            type="number"
            min="0"
            value={form.values.quiz_time_limit}
            onChange={(e) => form.setFieldValue('quiz_time_limit', parseInt(e.target.value) || 0)}
            placeholder="0 = No limit"
          />
          <HelpText>Set to 0 for no time limit</HelpText>
        </FormSection>

        <FormSection>
          <Label>Passing Score (%)</Label>
          <Input
            type="number"
            min="0"
            max="100"
            value={form.values.passing_score}
            onChange={(e) => form.setFieldValue('passing_score', parseInt(e.target.value) || 70)}
            placeholder="70"
          />
          <HelpText>Minimum score to pass (default: 70%)</HelpText>
        </FormSection>
      </FormRow>

      {/* University Tags Section */}
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

      {/* Semester Tags Section */}
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
        <Label>Generate dari AI (Opsional)</Label>
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
            {!generationFile ? (
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
                  {loading.isGenerating ? 'Uploading...' : 'Klik untuk upload PDF'}
                </UploadText>
                <UploadText style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
                  PDF file (max 20MB)
                </UploadText>
              </UploadArea>
            ) : (
              <ExistingFileInfo>
                <FileIcon>📕</FileIcon>
                <div style={{ flex: 1 }}>
                  <FileName>{generationFile.name}</FileName>
                  <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>
                    Siap untuk di-generate menjadi soal
                  </div>
                </div>
                <RemoveFileButton onClick={() => setGenerationFile(null)}>
                  Hapus
                </RemoveFileButton>
              </ExistingFileInfo>
            )}
          </UploadSection>
        ) : (
          <FormSection>
            <Textarea
              value={generationContent}
              onChange={(e) => setGenerationContent(e.target.value)}
              placeholder="Paste your medical study material here..."
              style={{ minHeight: '150px' }}
            />
            <HelpText>Masukkan konten yang ingin di-generate menjadi soal MCQ</HelpText>
          </FormSection>
        )}
      </FormSection>

      <FormRow columns={2}>
        <FormSection>
          <Label>Number of Questions</Label>
          <Input
            type="number"
            min="1"
            max="50"
            value={questionCount}
            onChange={(e) => setQuestionCount(parseInt(e.target.value) || 10)}
          />
          <HelpText>Pilih antara 1-50 soal</HelpText>
        </FormSection>
        <FormSection style={{ display: 'flex', alignItems: 'flex-end' }}>
          <Button
            type="button"
            variant="primary"
            onClick={handleGenerate}
            disabled={loading.isGenerating || !canGenerate}
            style={{ width: '100%' }}
          >
            {loading.isGenerating ? 'Generating...' : '✨ Generate Questions'}
          </Button>
        </FormSection>
      </FormRow>

      <QuestionsSection>
        <QuestionsSectionHeader>
          <QuestionsSectionTitle>Questions</QuestionsSectionTitle>
          <AddQuestionButton type="button" onClick={handleAddQuestion}>
            + Add Question
          </AddQuestionButton>
        </QuestionsSectionHeader>
        {form.errors.questions && <ErrorText>{form.errors.questions}</ErrorText>}

        {form.values.questions.map((question, index) => (
          <QuestionCard key={question.tempId || index}>
            <QuestionCardHeader>
              <QuestionNumber>Question {index + 1}</QuestionNumber>
              <RemoveQuestionButton type="button" onClick={() => handleRemoveQuestion(index)}>
                Remove
              </RemoveQuestionButton>
            </QuestionCardHeader>

            <FormSection>
              <Label>Question Text *</Label>
              <Textarea
                value={question.question}
                onChange={(e) => form.setFieldValue(`questions.${index}.question`, e.target.value)}
                placeholder="Enter your multiple choice question here..."
                style={{ minHeight: '60px' }}
              />
              {form.errors[`questions.${index}.question`] && (
                <ErrorText>{form.errors[`questions.${index}.question`]}</ErrorText>
              )}
            </FormSection>

            <FormSection>
              <Label>Question Image (Optional)</Label>
              <ImageUploadArea
                hasImage={question.image_url}
                onClick={() => document.getElementById(`question-image-${index}`).click()}
              >
                <input
                  id={`question-image-${index}`}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={(e) => handleQuestionImageSelect(e, index)}
                  style={{ display: 'none' }}
                />
                {!question.image_url ? (
                  <>
                    <ImageUploadIcon>🖼️</ImageUploadIcon>
                    <ImageUploadText>
                      {loading.isUploadingImage ? 'Uploading...' : 'Click to upload image'}
                    </ImageUploadText>
                    <ImageUploadHint>JPEG or PNG, max 5MB</ImageUploadHint>
                  </>
                ) : (
                  <ImagePreview>
                    <PreviewImage src={question.image_url} alt="Question" />
                    <RemoveImageButton
                      onClick={(e) => {
                        e.stopPropagation()
                        form.setFieldValue(`questions.${index}.image_url`, '')
                        form.setFieldValue(`questions.${index}.image_key`, '')
                        form.setFieldValue(`questions.${index}.image_filename`, '')
                      }}
                    >
                      ×
                    </RemoveImageButton>
                  </ImagePreview>
                )}
              </ImageUploadArea>
            </FormSection>

            <FormSection>
              <Label>Options * (minimum 2)</Label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {question.options?.map((option, optIndex) => (
                  <OptionContainer
                    key={optIndex}
                    isSelected={question.correct_answer === optIndex}
                    onClick={() => form.setFieldValue(`questions.${index}.correct_answer`, optIndex)}
                  >
                    <OptionRadio
                      type="radio"
                      name={`correct-${index}`}
                      checked={question.correct_answer === optIndex}
                      onChange={() => form.setFieldValue(`questions.${index}.correct_answer`, optIndex)}
                    />
                    <OptionLabel isSelected={question.correct_answer === optIndex}>
                      {String.fromCharCode(65 + optIndex)}
                    </OptionLabel>
                    <OptionInput
                      type="text"
                      value={option}
                      onChange={(e) => {
                        e.stopPropagation()
                        form.setFieldValue(`questions.${index}.options.${optIndex}`, e.target.value)
                      }}
                      onClick={(e) => e.stopPropagation()}
                      placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                    />
                    {question.options.length > 2 && (
                      <RemoveOptionButton
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemoveOption(index, optIndex)
                        }}
                      >
                        Remove
                      </RemoveOptionButton>
                    )}
                  </OptionContainer>
                ))}
                <AddOptionButton
                  type="button"
                  onClick={() => handleAddOption(index)}
                >
                  + Add Option
                </AddOptionButton>
              </div>
              <HelpText>Click on an option to mark it as the correct answer. You can add or remove options as needed.</HelpText>
            </FormSection>

            <FormSection>
              <Label>Explanation (Optional)</Label>
              <Textarea
                value={question.explanation || ''}
                onChange={(e) => form.setFieldValue(`questions.${index}.explanation`, e.target.value)}
                placeholder="Explain why this is the correct answer..."
                style={{ minHeight: '60px' }}
              />
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
