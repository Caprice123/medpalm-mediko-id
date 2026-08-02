import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createFeatureNode, updateFeatureNode } from '@store/featureNodes'
import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import TextInput from '@components/common/TextInput'
import Textarea from '@components/common/Textarea'
import Dropdown from '@components/common/Dropdown'

const LAYER_LABELS = { 1: 'Modul', 2: 'Sub-modul' }

const CLASSIFICATION_OPTIONS = [
  { value: 'primary', label: 'Modalitas Utama' },
  { value: 'special', label: 'Modalitas Khusus' },
]

function NodeFormModal({ layer, node, parentNode, onClose, onSuccess }) {
  const dispatch = useDispatch()
  const { loading } = useSelector(state => state.featureNodes)
  const isEdit = !!node
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [classification, setClassification] = useState(CLASSIFICATION_OPTIONS[0].value)
  const [icon, setIcon] = useState('')

  useEffect(() => {
    setName(isEdit ? node.name : '')
    setDescription(isEdit ? (node.description ?? '') : '')
    setClassification(isEdit ? (node.classification ?? CLASSIFICATION_OPTIONS[0].value) : CLASSIFICATION_OPTIONS[0].value)
    setIcon(isEdit ? (node.icon ?? '') : '')
  }, [isEdit, node])

  const handleSubmit = () => {
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    const payload = {
      name,
      description,
      slug: isEdit ? node.slug : slug,
      visibility: 'diagnostic',
      layer,
      ...(layer === 1 && { classification, nodeType: isEdit ? node.nodeType : 'module', icon: icon || null }),
      ...(parentNode && { parentId: parentNode.id }),
      ...(layer === 2 && { nodeType: isEdit ? node.nodeType : 'submodule' }),
    }
    if (isEdit) {
      dispatch(updateFeatureNode(node.id, payload, onSuccess))
    } else {
      dispatch(createFeatureNode(payload, onSuccess))
    }
  }

  const isSaving = isEdit ? loading.isUpdating : loading.isCreating
  const label = LAYER_LABELS[layer] ?? 'Node'

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
