import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Modal from '@components/common/Modal'
import TextInput from '@components/common/TextInput'
import Button from '@components/common/Button'
import Dropdown from '@components/common/Dropdown'
import { createFeatureNode, fetchFeatureNodes } from '@store/featureNodes'

const NODE_TYPE_OPTIONS = [
  { value: 'department', label: 'Departemen' },
  { value: 'topic', label: 'Topik' },
  { value: 'subtopic', label: 'Sub-topik' },
]

function CreateFeatureNodeModal({ onClose, defaultParent }) {
  const dispatch = useDispatch()
  const { nodes, loading } = useSelector(state => state.featureNodes)

  const [form, setForm] = useState({
    name: '',
    slug: '',
    parentId: defaultParent?.id ?? null,
    nodeType: null,
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

  const handleSubmit = () => {
    dispatch(createFeatureNode(
      {
        name: form.name,
        slug: form.slug,
        parentId: form.parentId,
        nodeType: form.nodeType,
      },
      () => {
        dispatch(fetchFeatureNodes())
        onClose()
      }
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
        <TextInput
          label="Nama"
          required
          value={form.name}
          onChange={handleNameChange}
          placeholder="Contoh: Kardiologi"
        />
        <TextInput
          label="Slug"
          required
          value={form.slug}
          onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
          placeholder="kardiologi"
          hint="Digunakan sebagai identifier unik"
        />
        <Dropdown
          label="Tipe Node"
          options={NODE_TYPE_OPTIONS}
          value={NODE_TYPE_OPTIONS.find(o => o.value === form.nodeType) ?? null}
          onChange={opt => setForm(f => ({ ...f, nodeType: opt?.value ?? null }))}
          placeholder="Pilih tipe..."
        />
        <Dropdown
          label="Node Induk"
          options={parentOptions}
          value={parentOptions.find(o => o.value === form.parentId) ?? parentOptions[0]}
          onChange={opt => setForm(f => ({ ...f, parentId: opt?.value ?? null }))}
          placeholder="Pilih node induk..."
        />
      </div>
    </Modal>
  )
}

export default CreateFeatureNodeModal
