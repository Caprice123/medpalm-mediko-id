import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchFeatureNodesWithStats, updateFilter, deleteFeatureNode } from '@store/featureNodes'

const VISIBILITY = 'general'

export function useNodeListPage(currentLayer, parentNode) {
  const dispatch = useDispatch()
  const { nodes, loading } = useSelector(s => s.featureNodes)

  const [tab, setTab] = useState('ordered')
  const [orderModal, setOrderModal] = useState({ open: false, node: null })
  const [search, setSearch] = useState('')
  const [classification, setClassification] = useState('')

  const loadNodes = () => {
    dispatch(updateFilter({ key: 'layer', value: String(currentLayer) }))
    dispatch(updateFilter({ key: 'parentId', value: parentNode?.id ? String(parentNode.id) : '' }))
    dispatch(updateFilter({ key: 'visibility', value: VISIBILITY }))
    dispatch(updateFilter({ key: 'nodeType', value: currentLayer === 2 ? 'module' : 'topic' }))
    dispatch(updateFilter({ key: 'sortBy', value: currentLayer === 2 && tab === 'ordered' ? 'order' : '' }))
    dispatch(updateFilter({ key: 'search', value: '' }))
    dispatch(updateFilter({ key: 'classification', value: '' }))
    dispatch(fetchFeatureNodesWithStats())
  }

  useEffect(() => {
    setSearch('')
    setClassification('')
    loadNodes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLayer, parentNode?.id, tab])

  const handleTabChange = (value) => setTab(value)

  const handleSearch = () => {
    dispatch(updateFilter({ key: 'search', value: search.trim() }))
    dispatch(fetchFeatureNodesWithStats())
  }

  const handleClassificationChange = (opt) => {
    const value = opt?.value ?? ''
    setClassification(value)
    dispatch(updateFilter({ key: 'classification', value }))
    dispatch(fetchFeatureNodesWithStats())
  }

  const handleDelete = (node) => {
    if (!window.confirm(`Hapus "${node.name}"? Semua data di dalamnya akan ikut terhapus.`)) return
    dispatch(deleteFeatureNode(node.id, loadNodes))
  }

  const handleOrderChanged = () => loadNodes()

  return {
    nodes, isLoading: loading.isFetchingNodes,
    tab, handleTabChange,
    search, setSearch, handleSearch,
    classification, handleClassificationChange,
    orderModal, setOrderModal,
    handleDelete, handleOrderChanged, reload: loadNodes,
  }
}
