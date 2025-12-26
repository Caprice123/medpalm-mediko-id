import { useCallback, useMemo } from 'react'
import Modal from '@components/common/Modal'
import TagSelector from '@components/common/TagSelector'
import { formatFileSize } from '@utils/formatUtils'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'
import {
  FormSection,
  Label,
  Input,
  Textarea,
  ImageUploadArea,
  ImageUploadIcon,
  ImageUploadText,
  ImageUploadHint,
  ExistingFileInfo,
  FileIcon,
  FileName,
  FileActions,
  PreviewButton,
  RemoveFileButton,
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
} from './UpdateQuizModal.styles'
import { useSelector } from 'react-redux'
import { useUpdateQuiz } from '../../hooks/subhooks/useUpdateQuiz'

const UpdateQuizModal = ({ onClose }) => {
    const { loading } = useSelector(state => state.anatomy)
    const { tags } = useSelector(state => state.tags)

    const { form, handleAddQuestion, handleRemoveQuestion, handleImageSelect } = useUpdateQuiz(onClose)

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
            <Button onClick={handleModalClose}>Cancel</Button>
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
          <Label>Upload Image *</Label>
          {!form.values.blob.id ? (
            <ImageUploadArea onClick={() => document.getElementById('image-upload').click()}>
              <input
                id="image-upload"
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleImageSelect}
                style={{ display: 'none' }}
              />
              <ImageUploadIcon>🖼️</ImageUploadIcon>
              <ImageUploadText>
                {loading.isUploadingImage ? 'Uploading...' : 'Klik untuk upload gambar'}
              </ImageUploadText>
              <ImageUploadHint>JPEG atau PNG, max 5MB</ImageUploadHint>
            </ImageUploadArea>
          ) : (
            <PhotoProvider>
              <ExistingFileInfo>
                <FileIcon>🖼️</FileIcon>
                <div style={{ flex: 1 }}>
                  <FileName>
                    {form.values.blob.filename || 'File name'}
                  </FileName>
                  <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>
                    {form.values.blob.size ? formatFileSize(form.values.blob.size) : 'File size'}
                  </div>
                </div>
                <FileActions>
                  <PhotoView src={form.values.blob.url}>
                    <PreviewButton type="button">
                      👁️ Preview
                    </PreviewButton>
                  </PhotoView>
                  <RemoveFileButton
                    type="button"
                    onClick={() => {
                      form.setFieldValue('blob', {
                        id: null,
                        url: '',
                        filename: '',
                        size: null
                      })
                    }}
                  >
                    Hapus
                  </RemoveFileButton>
                </FileActions>
              </ExistingFileInfo>
            </PhotoProvider>
          )}
          {form.errors.blob && <ErrorText>{form.errors.blob}</ErrorText>}
        </FormSection>

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

        <QuestionsSection>
          <QuestionsSectionHeader>
            <QuestionsSectionTitle>Input Fields for Students</QuestionsSectionTitle>
            <AddQuestionButton type="button" onClick={handleAddQuestion}>
              + Add Input Field
            </AddQuestionButton>
          </QuestionsSectionHeader>
          {form.errors.questions && <ErrorText>{form.errors.questions}</ErrorText>}

          {form.values.questions.map((question, index) => (
            <QuestionCard key={question.tempId || index}>
              <QuestionCardHeader>
                <QuestionNumber>Input Field {index + 1}</QuestionNumber>
                <RemoveQuestionButton type="button" onClick={() => handleRemoveQuestion(index)}>
                  Remove
                </RemoveQuestionButton>
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
    </>
  )
}

export default UpdateQuizModal
