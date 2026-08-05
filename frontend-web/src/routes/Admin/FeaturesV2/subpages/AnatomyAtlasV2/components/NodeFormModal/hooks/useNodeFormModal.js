import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createFeatureNode, updateFeatureNode } from '@store/featureNodes'

export const LAYER_LABELS = { 1: 'Topik', 2: 'Modul' }

export const TOPIC_CLASSIFICATION_OPTIONS = [
  { value: 'sistem_blok', label: 'Sistem Blok' },
  { value: 'ilmu_lintas_sistem', label: 'Ilmu Lintas Sistem' },
]

export const MODULE_CLASSIFICATION_OPTIONS = [
  { value: 'fisiologi', label: 'Fisiologi' },
  { value: 'patologi', label: 'Patologi' },
]

export function useNodeFormModal({ layer, node, parentNode, onSuccess }) {
  const dispatch = useDispatch()
  const { loading } = useSelector(state => state.featureNodes)
  const isEdit = !!node
  const classificationOptions = layer === 1 ? TOPIC_CLASSIFICATION_OPTIONS : MODULE_CLASSIFICATION_OPTIONS
  const [form, setForm] = useState({ name: '', description: '', classification: classificationOptions[0].value, icon: '' })

  useEffect(() => {
    if (isEdit) {
      setForm({
        name: node.name,
        description: node.description ?? '',
        classification: node.classification ?? classificationOptions[0].value,
        icon: node.icon ?? '',
      })
    } else {
      setForm({ name: '', description: '', classification: classificationOptions[0].value, icon: '' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      ...(layer === 1 && { icon: form.icon || null }),
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

  return { isEdit, label, classificationOptions, form, set, handleSubmit, isSaving }
}
