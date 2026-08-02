import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createFeatureNode, updateFeatureNode } from '@store/featureNodes'
import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import TextInput from '@components/common/TextInput'
import Textarea from '@components/common/Textarea'
import Dropdown from '@components/common/Dropdown'

const LAYER_LABELS = { 1: 'Topik', 2: 'Modul' }

const TOPIC_CLASSIFICATION_OPTIONS = [
  { value: 'sistem_blok', label: 'Sistem Blok' },
  { value: 'ilmu_lintas_sistem', label: 'Ilmu Lintas Sistem' },
]

const MODULE_CLASSIFICATION_OPTIONS = [
  { value: 'fisiologi', label: 'Fisiologi' },
  { value: 'patologi', label: 'Patologi' },
]

function NodeFormModal({ layer, node, parentNode, onClose, onSuccess }) {
  const dispatch = useDispatch()
  const { loading } = useSelector(state => state.featureNodes)
  const isEdit = !!node
  const classificationOptions = layer === 1 ? TOPIC_CLASSIFICATION_OPTIONS : MODULE_CLASSIFICATION_OPTIONS
  const [form, setForm] = useState({ name: '', description: '', classification: classificationOptions[0].value })

  useEffect(() => {
    if (isEdit) {
      setForm({
        name: node.name,
        description: node.description ?? '',
        classification: node.classification ?? classificationOptions[0].value,
      })
    } else {
      setForm({ name: '', description: '', classification: classificationOptions[0].value })
    }
  }, [isEdit, node])

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleSubmit = () => {
    const slug = form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    const payload = {
      name: form.name,
      description: form.description,
      slug: isEdit ? node.slug : slug,
      visibility: 'general',
      layer,
      nodeType: isEdit ? node.nodeType : (layer === 1 ? 'topic' : 'module'),
      classification: form.classification,
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
          <Dropdown
            label="Klasifikasi"
            options={classificationOptions}
            value={classificationOptions.find(o => o.value === form.classification) ?? classificationOptions[0]}
            onChange={opt => set('classification', opt?.value ?? classificationOptions[0].value)}
          />
        )}
      </div>
    </Modal>
  )
}

export default NodeFormModal
