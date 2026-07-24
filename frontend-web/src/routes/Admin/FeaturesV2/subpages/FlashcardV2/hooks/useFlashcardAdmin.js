import { useState, useEffect, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { fetchFeatureNodes, updateFilter } from '@store/featureNodes'

export function useFlashcardAdmin() {
  const dispatch = useDispatch()

  const [selectedNode, setSelectedNode] = useState(null)
  const [modal, setModal] = useState({ open: false, node: null })
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [search, setSearch] = useState('')

  const loadTopics = useCallback(() => {
    dispatch(updateFilter({ key: 'layer', value: '1' }))
    dispatch(updateFilter({ key: 'parentId', value: '' }))
    dispatch(updateFilter({ key: 'search', value: '' }))
    dispatch(updateFilter({ key: 'classification', value: '' }))
    setSearch('')
    dispatch(fetchFeatureNodes())
  }, [dispatch])

  useEffect(() => { loadTopics() }, [loadTopics])

  const handleSearch = () => {
    dispatch(updateFilter({ key: 'search', value: search.trim() }))
    dispatch(fetchFeatureNodes())
  }

  const handleBack = () => {
    setSelectedNode(null)
    loadTopics()
  }

  const handleDelete = (node) => {
    if (!window.confirm(`Hapus topik "${node.name}"? Semua sub-topik dan kartu di dalamnya akan ikut terhapus.`)) return
    alert('Hapus node belum diimplementasi di sini.')
  }

  return {
    selectedNode, setSelectedNode,
    modal, setModal,
    settingsOpen, setSettingsOpen,
    search, setSearch,
    handleSearch, handleBack, handleDelete,
  }
}
