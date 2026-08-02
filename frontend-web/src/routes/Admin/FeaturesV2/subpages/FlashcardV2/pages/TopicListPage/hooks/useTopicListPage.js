import { useState, useEffect, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { fetchFeatureNodes, updateFilter } from '@store/featureNodes'

export function useTopicListPage() {
  const dispatch = useDispatch()
  const [modal, setModal] = useState({ open: false, node: null })
  const [settingsOpen, setSettingsOpen] = useState(false)

  const loadTopics = useCallback(() => {
    dispatch(updateFilter({ key: 'layer', value: '1' }))
    dispatch(updateFilter({ key: 'parentId', value: '' }))
    dispatch(updateFilter({ key: 'search', value: '' }))
    dispatch(updateFilter({ key: 'classification', value: '' }))
    dispatch(updateFilter({ key: 'visibility', value: 'general' }))
    dispatch(updateFilter({ key: 'nodeType', value: 'topic' }))
    dispatch(fetchFeatureNodes())
  }, [dispatch])

  useEffect(() => { loadTopics() }, [loadTopics])

  const handleModalSuccess = () => {
    setModal({ open: false, node: null })
    dispatch(fetchFeatureNodes())
  }

  const handleDelete = (node) => {
    if (!window.confirm(`Hapus topik "${node.name}"? Semua sub-topik dan kartu di dalamnya akan ikut terhapus.`)) return
    alert('Hapus node belum diimplementasi di sini.')
  }

  return {
    modal, setModal,
    settingsOpen, setSettingsOpen,
    handleModalSuccess, handleDelete,
  }
}
