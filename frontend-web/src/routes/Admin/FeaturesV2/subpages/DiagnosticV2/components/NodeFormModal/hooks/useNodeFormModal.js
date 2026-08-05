import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createFeatureNode, updateFeatureNode } from '@store/featureNodes'

export const CLASSIFICATION_OPTIONS = [
  { value: 'primary', label: 'Modalitas Utama' },
  { value: 'special', label: 'Modalitas Khusus' },
]

export const LAYER_LABELS = { 1: 'Modul', 2: 'Sub-modul' }

export function useNodeFormModal({ layer, node, parentNode, onSuccess }) {
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

  return {
    isEdit, label,
    name, setName, description, setDescription, classification, setClassification, icon, setIcon,
    handleSubmit, isSaving,
  }
}
