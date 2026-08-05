import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import BlockNoteEditor from '@components/BlockNoteEditor'
import { useAtlasCreate } from '../../hooks/useAtlasCreate'
import {
  FormSection, Label, Input, Textarea, HelpText, ErrorText,
  EditorContainer, EditorHint,
} from './AtlasCreateModal.styles'

export default function AtlasCreateModal({ nodeId, onSuccess, onClose, atlas = null }) {
  const { form, handleImageUpload, isEdit, isSaving } = useAtlasCreate(onSuccess, nodeId, atlas)

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={isEdit ? 'Edit Atlas 3D' : 'Tambah Atlas 3D'}
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
        <HelpText>URL embed dari BioDigital Human, Sketchfab, atau platform 3D lainnya</HelpText>
        {form.errors.embedUrl && <ErrorText>{form.errors.embedUrl}</ErrorText>}
      </FormSection>

      <FormSection>
        <Label>Konten Editor</Label>
        <EditorHint>Ketik <strong>/</strong> untuk pilihan format • Ditampilkan di bawah viewer 3D</EditorHint>
        <EditorContainer>
          <BlockNoteEditor
            initialContent={form.values.editorContent}
            onChange={blocks => form.setFieldValue('editorContent', blocks)}
            editable
            onImageUpload={handleImageUpload}
          />
        </EditorContainer>
      </FormSection>
    </Modal>
  )
}
