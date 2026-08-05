import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import TextInput from '@components/common/TextInput'
import Textarea from '@components/common/Textarea'
import Dropdown from '@components/common/Dropdown'
import { useNodeFormModal } from './hooks/useNodeFormModal'

function NodeFormModal({ layer, node, parentNode, onClose, onSuccess }) {
  const { isEdit, label, classificationOptions, form, set, handleSubmit, isSaving } =
    useNodeFormModal({ layer, node, parentNode, onSuccess })

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={isEdit ? `Edit ${label}` : `Tambah ${label} Baru`}
      size="medium"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Batal</Button>
          <Button variant="primary" onClick={handleSubmit} disabled={!form.name.trim() || isSaving}>
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
          placeholder={`Nama ${label.toLowerCase()}...`}
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
              options={classificationOptions}
              value={classificationOptions.find(o => o.value === form.classification) ?? classificationOptions[0]}
              onChange={opt => set('classification', opt?.value ?? classificationOptions[0].value)}
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
