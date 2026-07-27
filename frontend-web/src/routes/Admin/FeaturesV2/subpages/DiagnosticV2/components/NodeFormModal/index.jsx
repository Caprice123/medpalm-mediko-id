import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createFeatureNode, updateFeatureNode } from '@store/featureNodes'
import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import TextInput from '@components/common/TextInput'
import Dropdown from '@components/common/Dropdown'

const LAYER_LABELS = { 1: 'Topik', 2: 'Sub-topik' }

const CLASSIFICATION_OPTIONS = [
  { value: 'primary', label: 'Modalitas Utama' },
  { value: 'special', label: 'Modalitas Khusus' },
]

function NodeFormModal({ layer, node, parentNode, onClose, onSuccess }) {
  const dispatch = useDispatch()
  const { loading } = useSelector(state => state.featureNodes)
  const isEdit = !!node
  const [name, setName] = useState('')
  const [classification, setClassification] = useState(CLASSIFICATION_OPTIONS[0].value)

  useEffect(() => {
    setName(isEdit ? node.name : '')
    setClassification(isEdit ? (node.classification ?? CLASSIFICATION_OPTIONS[0].value) : CLASSIFICATION_OPTIONS[0].value)
  }, [isEdit, node])

  const handleSubmit = () => {
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    const payload = {
      name,
      slug: isEdit ? node.slug : slug,
      visibility: 'diagnostic',
      layer,
      ...(layer === 1 && { classification }),
      ...(parentNode && { parentId: parentNode.id }),
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
      size="small"
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
        {layer === 1 && (
          <Dropdown
            label="Klasifikasi"
            options={CLASSIFICATION_OPTIONS}
            value={CLASSIFICATION_OPTIONS.find(o => o.value === classification) ?? CLASSIFICATION_OPTIONS[0]}
            onChange={opt => setClassification(opt?.value ?? CLASSIFICATION_OPTIONS[0].value)}
          />
        )}
      </div>
    </Modal>
  )
}

export default NodeFormModal
