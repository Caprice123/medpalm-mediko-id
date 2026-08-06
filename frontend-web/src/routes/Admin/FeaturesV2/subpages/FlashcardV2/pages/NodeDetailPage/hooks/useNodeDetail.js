import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchFeatureNodes, deleteFeatureNode, updateFilter } from '@store/featureNodes'

export function useNodeDetail(parentNode) {
  const dispatch = useDispatch()
  const search = useSelector(s => s.featureNodes.filter.search)

  const [selectedSubNode, setSelectedSubNode] = useState(null)
  const [modal, setModal] = useState({ open: false, node: null })
  const [tab, setTab] = useState('ordered')
  const [orderModal, setOrderModal] = useState({ open: false, node: null })

  const loadNodes = () => {
    dispatch(updateFilter({ key: 'layer', value: '2' }))
    dispatch(updateFilter({ key: 'parentId', value: String(parentNode.id) }))
    dispatch(updateFilter({ key: 'visibility', value: parentNode.visibility }))
    dispatch(updateFilter({ key: 'nodeType', value: 'subtopic' }))
    dispatch(fetchFeatureNodes())
  }

  useEffect(() => {
    dispatch(updateFilter({ key: 'search', value: '' }))
    dispatch(updateFilter({ key: 'sortBy', value: tab === 'ordered' ? 'order' : '' }))
    loadNodes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, parentNode.id, parentNode.visibility, tab])

  const handleTabChange = (value) => setTab(value)

  const setSearch = (value) => dispatch(updateFilter({ key: 'search', value }))

  const handleSearch = () => {
    dispatch(updateFilter({ key: 'search', value: search.trim() }))
    loadNodes()
  }

  const handleDelete = (node) => {
    if (!window.confirm(`Hapus sub-topik "${node.name}"? Semua kartu di dalamnya akan ikut terhapus.`)) return
    dispatch(deleteFeatureNode(node.id, loadNodes))
  }

  const handleSuccess = () => {
    setModal({ open: false, node: null })
    loadNodes()
  }

  const handleOrderChanged = () => loadNodes()

  return {
    selectedSubNode, setSelectedSubNode,
    modal, setModal,
    search, setSearch,
    tab, handleTabChange,
    orderModal, setOrderModal,
    handleSearch, handleDelete, handleSuccess, handleOrderChanged,
  }
}
