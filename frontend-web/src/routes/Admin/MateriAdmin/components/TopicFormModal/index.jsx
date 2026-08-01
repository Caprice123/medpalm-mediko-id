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

function TopicFormModal({ topic, onClose, onSuccess }) {
  const dispatch = useDispatch()
  const { loading } = useSelector(s => s.featureNodes)
  const isEdit = !!topic

  const [form, setForm] = useState({
    name: '',
    classification: CLASSIFICATION_OPTIONS[0].value,
    icon: '',
  })

  useEffect(() => {
    if (isEdit) {
      setForm({
        name: topic.name,
        classification: topic.classification ?? CLASSIFICATION_OPTIONS[0].value,
        icon: topic.icon ?? '',
      })
    } else {
      setForm({ name: '', classification: CLASSIFICATION_OPTIONS[0].value, icon: '' })
    }
  }, [isEdit, topic])

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleSubmit = () => {
    const slug = form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    const payload = {
      name: form.name,
      slug: isEdit ? topic.slug : slug,
      visibility: 'general',
      layer: 1,
      classification: form.classification,
      icon: form.icon || null,
    }
    if (isEdit) {
      dispatch(updateFeatureNode(topic.id, payload, onSuccess))
    } else {
      dispatch(createFeatureNode(payload, onSuccess))
    }
  }

  const isSaving = isEdit ? loading.isUpdating : loading.isCreating

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={isEdit ? 'Edit Topik' : 'Tambah Topik Baru'}
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
          label="Nama Topik"
          required
          value={form.name}
          onChange={e => set('name', e.target.value)}
          placeholder="Contoh: Sistem Kardiovaskular"
        />
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
      </div>
    </Modal>
  )
}

export default TopicFormModal
