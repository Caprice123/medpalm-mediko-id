import { useMemo, useCallback, memo } from 'react'
import { useSelector } from 'react-redux'
import ModelDropdown from '@components/common/ModelDropdown'
import Dropdown from '@components/common/Dropdown'
import Modal from '@components/common/Modal'
import TextInput from '@components/common/TextInput'
import Textarea from '@components/common/Textarea'
import Button from '@components/common/Button'
import TagSelector from '@components/common/TagSelector'
import {
  FormSection,
  StatusToggle,
  StatusOption,
} from './CreateTopicModal.styles'
import { useCreateTopicModal } from './hook'
import AttachmentSection from '../../shared/AttachmentSection'
import ObservationSection from '../../shared/ObservationSection'


function CreateTopicModal({ onClose }) {
  const { loading: commonLoading } = useSelector(state => state.common)
  const { rubrics, loading } = useSelector(state => state.oscePractice)
  const { tags } = useSelector(state => state.tags)

  const { form, handleMultipleFilesSelect, handleRemoveAttachment, handleDragEnd } = useCreateTopicModal(onClose)

  const topicTags = useMemo(() =>
    tags.find(t => t.name === 'topic')?.tags || [],
    [tags]
  )
  const batchTags = useMemo(() =>
    tags.find(t => t.name === 'batch')?.tags || [],
    [tags]
  )

  const availableRubrics = rubrics.map((r) => ({
    label: r.name,
    value: r.id,
  }))

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Buat Topic OSCE Baru"
      size="large"
    >
      <form onSubmit={form.handleSubmit}>
        <FormSection>
          <TextInput
            label="Title"
            required
            name="title"
            value={form.values.title}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            placeholder="e.g., Taking History - Chest Pain"
            error={form.touched.title && form.errors.title}
          />
        </FormSection>

        <FormSection>
          <Textarea
            label="Description"
            name="description"
            value={form.values.description}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            placeholder="Brief description of this OSCE station..."
            rows={2}
            hint="Optional brief description of this OSCE topic"
          />
        </FormSection>

        <FormSection>
          <Textarea
            label="Scenario"
            required
            name="scenario"
            value={form.values.scenario}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            placeholder="You are a 45-year-old patient who came to the emergency department with chest pain..."
            rows={6}
            error={form.touched.scenario && form.errors.scenario}
            hint="Describe the clinical scenario in detail. This will be shown to students and used by the AI."
          />
        </FormSection>

        <FormSection>
          <Textarea
            label="Guide"
            name="guide"
            value={form.values.guide}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            placeholder="Instructions or guidelines for completing this OSCE station..."
            rows={4}
            hint="Optional guide for students on how to approach this case"
          />
        </FormSection>

        <FormSection>
          <Textarea
            label="Context"
            name="context"
            value={form.values.context}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            placeholder="Additional context or background information..."
            rows={4}
            hint="Optional contextual information about the case"
          />
        </FormSection>

        <FormSection>
          <Textarea
            label="Answer Key"
            name="answerKey"
            value={form.values.answerKey}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            placeholder="Expected answers or key points..."
            rows={6}
            hint="Key points and expected answers for this OSCE"
          />
        </FormSection>

        <FormSection>
          <KnowledgeBaseSection
            knowledgeBase={form.values.knowledgeBase}
            setFieldValue={form.setFieldValue}
          />
        </FormSection>

        <FormSection>
            <ModelDropdown
                value={form.values.aiModel}
                onChange={(option) => form.setFieldValue('aiModel', option.value)}
            />
        </FormSection>

        <FormSection>
          <Dropdown
            label="Rubric penilaian"
            options={availableRubrics}
            value={availableRubrics.find(rubric => rubric.value == form.values.rubricId)}
            onChange={(option) => form.setFieldValue('rubricId', option?.value || null)}
            error={form.touched.rubricId && form.errors.rubricId}
            required
          />
        </FormSection>

        <FormSection>
          <TextInput
            label="Duration (minutes)"
            required
            type="number"
            name="durationMinutes"
            value={form.values.durationMinutes}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            placeholder="15"
            error={form.touched.durationMinutes && form.errors.durationMinutes}
            hint="Recommended practice duration in minutes"
          />
        </FormSection>

        <FormSection>
          <AttachmentSection
            attachments={form.values.attachments}
            handleMultipleFilesSelect={handleMultipleFilesSelect}
            handleRemoveAttachment={handleRemoveAttachment}
            handleDragEnd={handleDragEnd}
          />
        </FormSection>

        <FormSection>
          <ObservationSection
            observations={form.values.observations}
            setFieldValue={form.setFieldValue}
          />
        </FormSection>

        <FormSection>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
            Topik Tags *
          </label>
          <TagSelector
            allTags={topicTags || []}
            selectedTags={form.values.topicTags}
            onTagsChange={(newTags) => form.setFieldValue('topicTags', newTags)}
            placeholder="Pilih topik..."
          />
        </FormSection>

        <FormSection>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
            Batch Tags *
          </label>
          <TagSelector
            allTags={batchTags || []}
            selectedTags={form.values.batchTags}
            onTagsChange={(newTags) => form.setFieldValue('batchTags', newTags)}
            placeholder="Pilih batch..."
          />
        </FormSection>

        <FormSection>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
            Status
          </label>
          <StatusToggle>
            <StatusOption
              type="button"
              active={form.values.status === 'draft'}
              onClick={() => form.setFieldValue('status', 'draft')}
            >
              Draft
            </StatusOption>
            <StatusOption
              type="button"
              active={form.values.status === 'published'}
              onClick={() => form.setFieldValue('status', 'published')}
            >
              Published
            </StatusOption>
          </StatusToggle>
        </FormSection>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={commonLoading.isCreatingTopic || !form.isValid || commonLoading.isUploading || loading.isCreatingTopic}
          >
            {commonLoading.isCreatingTopic ? 'Creating...' : 'Create Topic'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

// Memoized Knowledge Base Section
const KnowledgeBaseSection = memo(({ knowledgeBase, setFieldValue }) => {
  const handleKeyChange = useCallback((index, value) => {
    const newKnowledgeBase = [...knowledgeBase]
    newKnowledgeBase[index].key = value
    setFieldValue('knowledgeBase', newKnowledgeBase)
  }, [knowledgeBase, setFieldValue])

  const handleValueChange = useCallback((index, value) => {
    const newKnowledgeBase = [...knowledgeBase]
    newKnowledgeBase[index].value = value
    setFieldValue('knowledgeBase', newKnowledgeBase)
  }, [knowledgeBase, setFieldValue])

  const handleAddItem = useCallback(() => {
    setFieldValue('knowledgeBase', [...knowledgeBase, { key: '', value: '' }])
  }, [knowledgeBase, setFieldValue])

  return (
    <>
      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
        Knowledge Base
      </label>
      {knowledgeBase.map((item, index) => (
        <KnowledgeBaseItem
          key={index}
          index={index}
          item={item}
          onKeyChange={handleKeyChange}
          onValueChange={handleValueChange}
        />
      ))}
      <div style={{ marginTop: '0.5rem' }}>
        <Button type="button" variant="primary" onClick={handleAddItem}>
          Add Knowledge Item
        </Button>
      </div>
    </>
  )
}, (prevProps, nextProps) => {
  return JSON.stringify(prevProps.knowledgeBase) === JSON.stringify(nextProps.knowledgeBase)
})

// Memoized Knowledge Base Item
const KnowledgeBaseItem = memo(({ index, item, onKeyChange, onValueChange }) => {
  return (
    <div style={{ marginBottom: '0.75rem' }}>
      <TextInput
        placeholder="Judul basis pengetahuan"
        value={item.key}
        onChange={(e) => onKeyChange(index, e.target.value)}
      />
      <div style={{ marginTop: '0.5rem' }}>
        <Textarea
          placeholder="Konten pengetahuan"
          value={item.value}
          onChange={(e) => onValueChange(index, e.target.value)}
          rows={3}
        />
      </div>
    </div>
  )
}, (prevProps, nextProps) => {
  return prevProps.item.key === nextProps.item.key &&
         prevProps.item.value === nextProps.item.value
})

export default CreateTopicModal
