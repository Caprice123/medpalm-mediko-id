import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createFeatureNode, updateFeatureNode } from '@store/featureNodes'

export const CLASSIFICATION_OPTIONS = [
  { value: 'sistem_blok', label: 'Sistem Blok' },
  { value: 'ilmu_lintas_sistem', label: 'Ilmu Lintas Sistem' },
]

export function useNodeFormModal({ layer, node, parentNode, onSuccess }) {
  const dispatch = useDispatch()
  const { loading } = useSelector(state => state.featureNodes)

  const isEdit = !!node
  const [form, setForm] = useState({
    name: '',
    description: '',
    classification: CLASSIFICATION_OPTIONS[0].value,
    icon: '',
  })

  useEffect(() => {
    if (isEdit) {
      setForm({
        name: node.name,
        description: node.description ?? '',
        classification: node.classification ?? CLASSIFICATION_OPTIONS[0].value,
        icon: node.icon ?? '',
      })
    } else {
      setForm({ name: '', description: '', classification: CLASSIFICATION_OPTIONS[0].value, icon: '' })
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
      ...(layer === 1 && { classification: form.classification, nodeType: isEdit ? node.nodeType : 'topic', icon: form.icon || null }),
      ...(layer === 2 && parentNode && { parentId: parentNode.id, nodeType: isEdit ? node.nodeType : 'subtopic' }),
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

  return { form, set, handleSubmit, isSaving, title }
}
