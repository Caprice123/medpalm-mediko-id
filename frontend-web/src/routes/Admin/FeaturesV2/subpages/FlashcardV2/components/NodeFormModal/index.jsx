import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createFeatureNode, updateFeatureNode } from '@store/featureNodes'
import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import TextInput from '@components/common/TextInput'
import Dropdown from '@components/common/Dropdown'

const CLASSIFICATION_OPTIONS = [
  { value: 'sistem_blok', label: 'Sistem Blok' },
  { value: 'ilmu_lintas_sistem', label: 'Ilmu Lintas Sistem' },
]

function NodeFormModal({ layer, node, parentNode, onClose, onSuccess }) {
  const dispatch = useDispatch()
  const { loading } = useSelector(state => state.featureNodes)

  const isEdit = !!node
  const [form, setForm] = useState({
    name: '',
    classification: CLASSIFICATION_OPTIONS[0].value,
  })

  useEffect(() => {
    if (isEdit) {
      setForm({
        name: node.name,
        classification: node.classification ?? CLASSIFICATION_OPTIONS[0].value,
      })
    }
  }, [isEdit, node])

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleSubmit = () => {
    const slug = form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    const payload = {
      name: form.name,
      slug: isEdit ? node.slug : slug,
      visibility: 'general',
      layer,
      ...(layer === 1 && { classification: form.classification }),
      ...(layer === 2 && parentNode && { parentId: parentNode.id, nodeType: 'subtopik' }),
    }

    if (isEdit) {
      dispatch(updateFeatureNode(node.id, payload, onSuccess))
    } else {
      dispatch(createFeatureNode(payload, onSuccess))
    }
  }

  const isSaving = isEdit ? loading.isUpdating : loading.isCreating
  const title = layer === 1
    ? (isEdit ? 'Edit Topik' : 'Tambah Topik Baru')
    : (isEdit ? 'Edit Sub-topik' : 'Tambah Sub-topik Baru')

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={title}
      size="small"
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
        {layer === 1 && (
          <Dropdown
            label="Klasifikasi"
            options={CLASSIFICATION_OPTIONS}
            value={CLASSIFICATION_OPTIONS.find(o => o.value === form.classification) ?? CLASSIFICATION_OPTIONS[0]}
            onChange={opt => set('classification', opt?.value ?? CLASSIFICATION_OPTIONS[0].value)}
          />
        )}
      </div>
    </Modal>
  )
}

export default NodeFormModal
