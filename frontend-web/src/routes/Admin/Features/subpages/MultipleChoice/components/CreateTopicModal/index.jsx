import { useMemo } from 'react'
import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import TagSelector from '@components/common/TagSelector'
import FileUpload from '@components/common/FileUpload'
import {
  FormSection,
  FormRow,
  Label,
  Input,
  Textarea,
  QuestionsSection,
  QuestionsSectionHeader,
  QuestionsSectionTitle,
  QuestionCard,
  QuestionCardHeader,
  QuestionNumber,
  OptionContainer,
  OptionLabel,
  OptionRadio,
  OptionInput,
  ErrorText,
  StatusToggle,
  StatusOption,
  HelpText,
  ContentTypeButtons,
  ContentTypeButton
} from './CreateTopicModal.styles'
import { useSelector } from 'react-redux'
import { useCreateTopic } from '../../hooks/subhooks/useCreateTopic'

const CreateTopicModal = ({ onClose }) => {
  const { loading } = useSelector(state => state.mcq)
  const { loading: commonLoading } = useSelector(state => state.common)
  const { tags } = useSelector(state => state.tags)

  const {
    form,
    handleAddQuestion,
    handleRemoveQuestion,
    handleAddOption,
    handleRemoveOption,
    handleQuestionImageSelect,
    handleRemoveQuestionImage,
    handleFileSelect,
    handleGenerate,
    canGenerate,
    isGenerating
  } = useCreateTopic(onClose)

  // Get tags from all tag groups - memoized
  const topicTags = useMemo(() =>
    tags.find(t => t.name === 'topic')?.tags || [],
    [tags]
  )
  const departmentTags = useMemo(() =>
    tags.find(t => t.name === 'department')?.tags || [],
    [tags]
  )
  const universityTags = useMemo(() =>
    tags.find(t => t.name === 'university')?.tags || [],
    [tags]
  )
  const semesterTags = useMemo(() =>
    tags.find(t => t.name === 'semester')?.tags || [],
    [tags]
  )

  // Handlers for tag changes
  const handleTopicTagsChange = (newTags) => {
    form.setFieldValue('topicTags', newTags)
  }

  const handleDepartmentTagsChange = (newTags) => {
    form.setFieldValue('departmentTags', newTags)
  }

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
      title={'Create Multiple Choice Topic'}
      size="large"
      footer={
        <>
          <Button variant="secondary" onClick={handleModalClose}>Cancel</Button>
          <Button
            variant="primary"
            onClick={form.handleSubmit}
            disabled={loading.isCreatingTopic || loading.isUpdatingTopic}
          >
            {(loading.isCreatingTopic || loading.isUpdatingTopic)
              ? 'Creating...'
              : 'Create Topic'}
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
            value={form.values.quizTimeLimit}
            onChange={(e) => form.setFieldValue('quizTimeLimit', parseInt(e.target.value) || 0)}
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

      {/* Topic Tags Section */}
      <FormSection>
        <Label>Topik</Label>
        <TagSelector
          allTags={topicTags}
          selectedTags={form.values.topicTags || []}
          onTagsChange={handleTopicTagsChange}
          placeholder="-- Pilih Topik --"
          helpText="Pilih topik medis untuk membantu mengorganisir topik"
        />
      </FormSection>

      {/* Department Tags Section */}
      <FormSection>
        <Label>Departemen</Label>
        <TagSelector
          allTags={departmentTags}
          selectedTags={form.values.departmentTags || []}
          onTagsChange={handleDepartmentTagsChange}
          placeholder="-- Pilih Departemen --"
          helpText="Pilih departemen untuk membantu mengorganisir topik"
        />
      </FormSection>

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
            onFileSelect={(file) => {
              handleFileSelect(file)
            }}
            onRemove={() => {
              form.setFieldValue('pdfFile', null)
              form.setFieldValue('uploadedBlobId', null)
            }}
            isUploading={isGenerating}
            acceptedTypes={['application/pdf']}
            acceptedTypesLabel="PDF file"
            maxSizeMB={20}
            uploadText="Klik untuk upload PDF"
            actions={<></>}
          />
        ) : (
          <FormSection>
            <Textarea
              value={form.values.textContent}
              onChange={(e) => form.setFieldValue('textContent', e.target.value)}
              placeholder="Paste your medical study material here..."
              style={{ minHeight: '150px' }}
            />
            <HelpText>Masukkan konten yang ingin di-generate menjadi soal MCQ</HelpText>
          </FormSection>
        )}
      </FormSection>

      <FormSection>
        <Label>Number of Questions</Label>
        <Input
          type="number"
          value={form.values.questionCount}
          onChange={(e) => form.setFieldValue('questionCount', parseInt(e.target.value) || 5)}
        />
        <HelpText>Pilih antara 1-50 soal</HelpText>
      </FormSection>

      <FormSection style={{ display: 'flex', alignItems: 'flex-end' }}>
        <Button
          type="button"
          variant="primary"
          onClick={handleGenerate}
          disabled={isGenerating || !canGenerate}
          style={{ width: '100%' }}
        >
          {isGenerating ? 'Generating...' : '✨ Generate Questions'}
        </Button>
      </FormSection>

      <QuestionsSection>
        <QuestionsSectionHeader>
          <QuestionsSectionTitle>Questions</QuestionsSectionTitle>
          <Button variant="primary" size="small" onClick={handleAddQuestion}>
            + Add Question
          </Button>
        </QuestionsSectionHeader>
        {form.errors.questions && <ErrorText>{form.errors.questions}</ErrorText>}

        {form.values.questions.map((question, index) => (
          <QuestionCard key={question.tempId || index}>
            <QuestionCardHeader>
              <QuestionNumber>Question {index + 1}</QuestionNumber>
              <Button variant="danger" size="small" onClick={() => handleRemoveQuestion(index)}>
                Remove
              </Button>
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
              <FileUpload
                file={question.image ? {
                  name: question.image.filename || 'image.jpg',
                  type: question.image.contentType || 'image/jpeg',
                  size: question.image.byteSize || 0,
                  url: question.image.url
                } : null}
                onFileSelect={(file) => handleQuestionImageSelect(file, index)}
                onRemove={() => handleRemoveQuestionImage(index)}
                isUploading={commonLoading.isUploading}
                acceptedTypes={['image/jpeg', 'image/jpg', 'image/png']}
                acceptedTypesLabel="JPEG or PNG image"
                maxSizeMB={5}
                uploadText="Click to upload question image"
                showPreview={true}
              />
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
                      <Button
                        variant="danger"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemoveOption(index, optIndex)
                        }}
                      >
                        Remove
                      </Button>
                    )}
                  </OptionContainer>
                ))}
                <Button
                  variant="primary"
                  size="small"
                  onClick={() => handleAddOption(index)}
                >
                  + Add Option
                </Button>
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

export default CreateTopicModal
