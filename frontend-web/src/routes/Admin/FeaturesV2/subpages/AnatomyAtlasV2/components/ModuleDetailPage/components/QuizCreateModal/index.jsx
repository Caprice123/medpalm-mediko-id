import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import { useQuizCreate } from '../../hooks/useQuizCreate'
import {
  FormSection, Label, Input, Textarea, HelpText, ErrorText,
} from './QuizCreateModal.styles'

export default function QuizCreateModal({ nodeId, onSuccess, onClose, quiz = null }) {
  const { form, isEdit, isSaving } = useQuizCreate(onSuccess, nodeId, quiz)

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={isEdit ? 'Edit Quiz Anatomi' : 'Tambah Quiz Anatomi'}
      size="large"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Batal</Button>
          <Button variant="primary" onClick={form.handleSubmit} disabled={isSaving}>
            {isSaving ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </>
      }
    >
      <FormSection>
        <Label>Judul *</Label>
        <Input
          value={form.values.title}
          onChange={e => form.setFieldValue('title', e.target.value)}
          placeholder="e.g., Anatomi Jantung"
        />
        {form.errors.title && <ErrorText>{form.errors.title}</ErrorText>}
      </FormSection>

      <FormSection>
        <Label>Deskripsi</Label>
        <Textarea
          value={form.values.description}
          onChange={e => form.setFieldValue('description', e.target.value)}
          placeholder="Deskripsi singkat tentang quiz ini"
        />
      </FormSection>

      <FormSection>
        <Label>Embed URL 3D *</Label>
        <Input
          type="url"
          value={form.values.embedUrl}
          onChange={e => form.setFieldValue('embedUrl', e.target.value)}
          placeholder="https://human.biodigital.com/viewer/?id=..."
        />
        <HelpText>URL embed dari BioDigital Human, Sketchfab, atau platform 3D lainnya</HelpText>
        {form.errors.embedUrl && <ErrorText>{form.errors.embedUrl}</ErrorText>}
      </FormSection>

      <FormSection>
        <Label>Jumlah Pertanyaan *</Label>
        <Input
          type="number"
          min="0"
          value={form.values.questionCount}
          onChange={e => form.setFieldValue('questionCount', e.target.value)}
          placeholder="e.g., 10"
        />
        <HelpText>Jumlah pertanyaan yang harus dijawab mahasiswa untuk model 3D ini</HelpText>
      </FormSection>
    </Modal>
  )
}
