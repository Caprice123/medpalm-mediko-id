import { useState, useEffect, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { fetchFeatureNodes, updateFilter } from '@store/featureNodes'

export function useSummaryNotesAdmin() {
  const dispatch = useDispatch()

  const [selectedNode, setSelectedNode] = useState(null)
  const [modal, setModal] = useState({ open: false, node: null })
  const [search, setSearch] = useState('')

  const loadTopics = useCallback(() => {
    dispatch(updateFilter({ key: 'layer', value: '1' }))
    dispatch(updateFilter({ key: 'parentId', value: '' }))
    dispatch(updateFilter({ key: 'search', value: '' }))
    dispatch(updateFilter({ key: 'classification', value: '' }))
    dispatch(updateFilter({ key: 'visibility', value: 'general' }))
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
    if (!window.confirm(`Hapus topik "${node.name}"? Semua sub-topik dan ringkasan di dalamnya akan ikut terhapus.`)) return
    alert('Hapus topik belum diimplementasi.')
  }

  return {
    selectedNode, setSelectedNode,
    modal, setModal,
    search, setSearch,
    handleSearch, handleBack, handleDelete,
  }
}
