import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Modal from '@components/common/Modal'
import TextInput from '@components/common/TextInput'
import Button from '@components/common/Button'
import Dropdown from '@components/common/Dropdown'
import { createFeatureNode, fetchFeatureNodes } from '@store/featureNodes'

const NODE_TYPE_OPTIONS = [
  { value: null, label: '— Tidak ada —' },
  { value: 'department', label: 'Departemen' },
  { value: 'topic', label: 'Topik' },
  { value: 'subtopik', label: 'Sub-topik' },
]

const VISIBILITY_OPTIONS = [
  { value: 'general', label: 'Umum (General)' },
  { value: 'premium', label: 'Premium' },
]

const CLASSIFICATION_OPTIONS = [
  { value: null, label: '— Tidak ada —' },
  { value: 'sistem_blok', label: 'Sistem Blok' },
  { value: 'ilmu_lintas_sistem', label: 'Ilmu Lintas Sistem' },
]

const LAYER_OPTIONS = [
  { value: null, label: '— Tidak ada —' },
  { value: 1, label: 'Layer 1 (Root)' },
  { value: 2, label: 'Layer 2 (Sub-topik)' },
]

function CreateNodeModal({ onClose, defaultParent }) {
  const dispatch = useDispatch()
  const { nodes, loading } = useSelector(state => state.featureNodes)

  const [form, setForm] = useState({
    name: '',
    slug: '',
    parentId: defaultParent?.id ?? null,
    nodeType: defaultParent?.nodeType === 'department' ? 'topic'
             : defaultParent?.nodeType === 'topic' ? 'subtopik'
             : null,
    visibility: defaultParent?.visibility ?? 'general',
    classification: null,
    layer: defaultParent?.layer != null ? defaultParent.layer + 1 : null,
  })

  const parentOptions = [
    { value: null, label: '— Tidak ada (root) —' },
    ...nodes.map(n => ({ value: n.id, label: n.name })),
  ]

  const handleNameChange = (e) => {
    const name = e.target.value
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    setForm(f => ({ ...f, name, slug }))
  }

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleSubmit = () => {
    dispatch(createFeatureNode(
      {
        name: form.name,
        slug: form.slug,
        parentId: form.parentId,
        nodeType: form.nodeType,
        visibility: form.visibility,
        classification: form.classification,
        layer: form.layer,
      },
      () => { dispatch(fetchFeatureNodes()); onClose() }
    ))
  }

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="Tambah Node Baru"
      size="small"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Batal</Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!form.name || !form.slug || loading.isCreating}
          >
            {loading.isCreating ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <TextInput label="Nama" required value={form.name} onChange={handleNameChange} placeholder="Contoh: Kardiologi" />
        <TextInput
          label="Slug"
          required
          value={form.slug}
          onChange={e => set('slug', e.target.value)}
          placeholder="kardiologi"
          hint="Identifier unik — diisi otomatis dari nama"
        />
        <Dropdown
          label="Tipe Node"
          options={NODE_TYPE_OPTIONS}
          value={NODE_TYPE_OPTIONS.find(o => o.value === form.nodeType) ?? NODE_TYPE_OPTIONS[0]}
          onChange={opt => set('nodeType', opt?.value ?? null)}
          placeholder="Pilih tipe..."
        />
        <Dropdown
          label="Layer"
          options={LAYER_OPTIONS}
          value={LAYER_OPTIONS.find(o => o.value === form.layer) ?? LAYER_OPTIONS[0]}
          onChange={opt => set('layer', opt?.value ?? null)}
          placeholder="Pilih layer..."
        />
        <Dropdown
          label="Visibilitas"
          options={VISIBILITY_OPTIONS}
          value={VISIBILITY_OPTIONS.find(o => o.value === form.visibility) ?? VISIBILITY_OPTIONS[0]}
          onChange={opt => set('visibility', opt?.value ?? 'general')}
        />
        <Dropdown
          label="Klasifikasi"
          options={CLASSIFICATION_OPTIONS}
          value={CLASSIFICATION_OPTIONS.find(o => o.value === form.classification) ?? CLASSIFICATION_OPTIONS[0]}
          onChange={opt => set('classification', opt?.value ?? null)}
          placeholder="Pilih klasifikasi..."
        />
        <Dropdown
          label="Node Induk"
          options={parentOptions}
          value={parentOptions.find(o => o.value === form.parentId) ?? parentOptions[0]}
          onChange={opt => set('parentId', opt?.value ?? null)}
          placeholder="Pilih node induk..."
        />
      </div>
    </Modal>
  )
}

export default CreateNodeModal
