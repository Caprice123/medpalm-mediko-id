import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import TextInput from '@components/common/TextInput'
import Textarea from '@components/common/Textarea'
import Dropdown from '@components/common/Dropdown'
import { useNodeFormModal, CLASSIFICATION_OPTIONS } from './hooks/useNodeFormModal'

function NodeFormModal({ layer, node, parentNode, onClose, onSuccess }) {
  const { form, set, handleSubmit, isSaving, title } = useNodeFormModal({ layer, node, parentNode, onSuccess })

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={title}
      size="medium"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Batal</Button>
          <Button variant="primary" onClick={handleSubmit} disabled={!form.name || isSaving}>
            {isSaving ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <TextInput
          label="Nama"
          required
          value={form.name}
          onChange={e => set('name', e.target.value)}
          placeholder={layer === 1 ? 'Contoh: Sistem Kardiovaskular' : 'Contoh: Anatomi Jantung'}
        />
        <Textarea
          label="Deskripsi"
          value={form.description}
          onChange={e => set('description', e.target.value)}
          placeholder="Deskripsi singkat (opsional)..."
          rows={3}
        />
        {layer === 1 && (
          <>
            <Dropdown
              label="Klasifikasi"
              options={CLASSIFICATION_OPTIONS}
              value={CLASSIFICATION_OPTIONS.find(o => o.value === form.classification) ?? CLASSIFICATION_OPTIONS[0]}
              onChange={opt => set('classification', opt?.value ?? CLASSIFICATION_OPTIONS[0].value)}
            />
            <TextInput
              label="Ikon (emoji)"
              value={form.icon}
              onChange={e => set('icon', e.target.value)}
              placeholder="Contoh: 🫀"
            />
          </>
        )}
      </div>
    </Modal>
  )
}

export default NodeFormModal
