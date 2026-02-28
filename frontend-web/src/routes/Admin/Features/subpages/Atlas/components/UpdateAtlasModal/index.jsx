import { useMemo } from 'react'
import Modal from '@components/common/Modal'
import TagSelector from '@components/common/TagSelector'
import Button from '@components/common/Button'
import { useSelector } from 'react-redux'
import { useUpdateAtlas } from '../../hooks/subhooks/useUpdateAtlas'
import {
  FormSection,
  Label,
  Input,
  Textarea,
  HelpText,
  ErrorText,
  StatusToggle,
  StatusOption,
} from './UpdateAtlasModal.styles'

function UpdateAtlasModal({ onClose }) {
  const { loading } = useSelector(state => state.atlas)
  const { tags } = useSelector(state => state.tags)

  const { form } = useUpdateAtlas(onClose)

  const topicTags = useMemo(
    () => tags.find(t => t.name === 'atlas_topic')?.tags || [],
    [tags]
  )
  const subtopicTags = useMemo(
    () => tags.find(t => t.name === 'atlas_subtopic')?.tags || [],
    [tags]
  )

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Edit Atlas Model"
      size="large"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Batal</Button>
          <Button
            variant="primary"
            onClick={form.handleSubmit}
            disabled={loading.isUpdateAtlasLoading}
          >
            {loading.isUpdateAtlasLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </Button>
        </>
      }
    >
      <FormSection>
        <Label>Judul *</Label>
        <Input
          type="text"
          value={form.values.title}
          onChange={e => form.setFieldValue('title', e.target.value)}
          placeholder="e.g., Anatomi Jantung 3D"
        />
        {form.errors.title && <ErrorText>{form.errors.title}</ErrorText>}
      </FormSection>

      <FormSection>
        <Label>Deskripsi</Label>
        <Textarea
          value={form.values.description}
          onChange={e => form.setFieldValue('description', e.target.value)}
          placeholder="Deskripsi singkat tentang model anatomi ini"
        />
      </FormSection>

      <FormSection>
        <Label>Embed URL *</Label>
        <Input
          type="url"
          value={form.values.embedUrl}
          onChange={e => form.setFieldValue('embedUrl', e.target.value)}
          placeholder="https://human.biodigital.com/viewer/?id=..."
        />
        <HelpText>Paste URL embed dari BioDigital Human, Sketchfab, atau platform 3D lainnya</HelpText>
        {form.errors.embedUrl && <ErrorText>{form.errors.embedUrl}</ErrorText>}
      </FormSection>

      <FormSection>
        <Label>Atlas Topik</Label>
        <TagSelector
          allTags={topicTags}
          selectedTags={form.values.topicTags}
          onTagsChange={newTags => form.setFieldValue('topicTags', newTags)}
          placeholder="-- Pilih Topik --"
          helpText="Pilih topik untuk mengorganisir model"
        />
      </FormSection>

      <FormSection>
        <Label>Atlas Subtopik</Label>
        <TagSelector
          allTags={subtopicTags}
          selectedTags={form.values.subtopicTags}
          onTagsChange={newTags => form.setFieldValue('subtopicTags', newTags)}
          placeholder="-- Pilih Subtopik --"
          helpText="Pilih subtopik untuk mengorganisir model"
        />
      </FormSection>

      <FormSection>
        <Label>Status</Label>
        <StatusToggle>
          <StatusOption checked={form.values.status === 'draft'}>
            <input
              type="radio"
              name="update-status"
              value="draft"
              checked={form.values.status === 'draft'}
              onChange={e => form.setFieldValue('status', e.target.value)}
            />
            Draft
          </StatusOption>
          <StatusOption checked={form.values.status === 'published'}>
            <input
              type="radio"
              name="update-status"
              value="published"
              checked={form.values.status === 'published'}
              onChange={e => form.setFieldValue('status', e.target.value)}
            />
            Published
          </StatusOption>
        </StatusToggle>
      </FormSection>
    </Modal>
  )
}

export default UpdateAtlasModal
