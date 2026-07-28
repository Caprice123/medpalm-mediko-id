import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createFeatureNode, updateFeatureNode } from '@store/featureNodes'
import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import TextInput from '@components/common/TextInput'

const LAYER_LABELS = { 1: 'Topik', 2: 'Modul' }

function NodeFormModal({ layer, node, parentNode, onClose, onSuccess }) {
  const dispatch = useDispatch()
  const { loading } = useSelector(state => state.featureNodes)
  const isEdit = !!node
  const [name, setName] = useState('')

  useEffect(() => {
    setName(isEdit ? node.name : '')
  }, [isEdit, node])

  const handleSubmit = () => {
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    const payload = {
      name,
      slug: isEdit ? node.slug : slug,
      visibility: 'general',
      layer,
      nodeType: isEdit ? node.nodeType : (layer === 1 ? 'topic' : 'module'),
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
      <TextInput
        label="Nama"
        required
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder={`Nama ${label.toLowerCase()}...`}
      />
    </Modal>
  )
}

export default NodeFormModal
