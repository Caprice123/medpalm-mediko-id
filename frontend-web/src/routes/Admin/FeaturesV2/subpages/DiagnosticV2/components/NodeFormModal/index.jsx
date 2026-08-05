import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import TextInput from '@components/common/TextInput'
import Textarea from '@components/common/Textarea'
import Dropdown from '@components/common/Dropdown'
import { useNodeFormModal, CLASSIFICATION_OPTIONS } from './hooks/useNodeFormModal'

function NodeFormModal({ layer, node, parentNode, onClose, onSuccess }) {
  const {
    isEdit, label,
    name, setName, description, setDescription, classification, setClassification, icon, setIcon,
    handleSubmit, isSaving,
  } = useNodeFormModal({ layer, node, parentNode, onSuccess })

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={isEdit ? `Edit ${label}` : `Tambah ${label} Baru`}
      size="medium"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Batal</Button>
          <Button variant="primary" onClick={handleSubmit} disabled={!name.trim() || isSaving}>
            {isSaving ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <TextInput
          label="Nama"
          required
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder={`Nama ${label.toLowerCase()}...`}
        />
        <Textarea
          label="Deskripsi"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Deskripsi singkat (opsional)..."
          rows={3}
        />
        {layer === 1 && (
          <>
            <Dropdown
              label="Klasifikasi"
              options={CLASSIFICATION_OPTIONS}
              value={CLASSIFICATION_OPTIONS.find(o => o.value === classification) ?? CLASSIFICATION_OPTIONS[0]}
              onChange={opt => setClassification(opt?.value ?? CLASSIFICATION_OPTIONS[0].value)}
            />
            <TextInput
              label="Ikon (emoji)"
              value={icon}
              onChange={e => setIcon(e.target.value)}
              placeholder="Contoh: 🫀"
            />
          </>
        )}
      </div>
    </Modal>
  )
}

export default NodeFormModal
