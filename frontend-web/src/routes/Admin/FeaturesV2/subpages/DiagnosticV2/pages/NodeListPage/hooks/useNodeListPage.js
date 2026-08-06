import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchFeatureNodes, updateFilter, deleteFeatureNode } from '@store/featureNodes'

export function useNodeListPage(currentLayer, parentNode) {
  const dispatch = useDispatch()
  const { nodes, loading } = useSelector(s => s.featureNodes)

  const [search, setSearch] = useState('')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [nodeModal, setNodeModal] = useState({ open: false, node: null })
  const [tab, setTab] = useState('ordered')
  const [orderModal, setOrderModal] = useState({ open: false, node: null })

  const loadNodes = () => {
    dispatch(updateFilter({ key: 'layer', value: String(currentLayer) }))
    dispatch(updateFilter({ key: 'nodeType', value: currentLayer === 1 ? 'module' : 'submodule' }))
    dispatch(updateFilter({ key: 'parentId', value: parentNode?.id ? String(parentNode.id) : '' }))
    dispatch(updateFilter({ key: 'visibility', value: 'diagnostic' }))
    dispatch(updateFilter({ key: 'search', value: '' }))
    dispatch(updateFilter({ key: 'sortBy', value: currentLayer === 2 && tab === 'ordered' ? 'order' : '' }))
    dispatch(fetchFeatureNodes())
  }

  useEffect(() => {
    setSearch('')
    loadNodes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLayer, parentNode?.id, tab])

  const handleTabChange = (value) => setTab(value)

  const handleSearch = () => {
    dispatch(updateFilter({ key: 'search', value: search.trim() }))
    dispatch(fetchFeatureNodes())
  }

  const handleDelete = (node) => {
    if (!window.confirm(`Hapus "${node.name}"? Semua data di dalamnya akan ikut terhapus.`)) return
    dispatch(deleteFeatureNode(node.id, loadNodes))
  }

  const handleModalSuccess = () => {
    setNodeModal({ open: false, node: null })
    loadNodes()
  }

  const handleOrderChanged = () => loadNodes()

  return {
    nodes, isLoading: loading.isFetchingNodes,
    search, setSearch, handleSearch,
    settingsOpen, setSettingsOpen,
    nodeModal, setNodeModal,
    tab, handleTabChange,
    orderModal, setOrderModal,
    handleDelete, handleModalSuccess, handleOrderChanged,
  }
}
