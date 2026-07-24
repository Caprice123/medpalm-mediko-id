import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchFeatureNodes, deleteFeatureNode, updateFilter } from '@store/featureNodes'

export function useNodeDetail(parentNode) {
  const dispatch = useDispatch()

  const [selectedSubNode, setSelectedSubNode] = useState(null)
  const [modal, setModal] = useState({ open: false, node: null })
  const [search, setSearch] = useState('')

  useEffect(() => {
    dispatch(updateFilter({ key: 'layer', value: '2' }))
    dispatch(updateFilter({ key: 'parentId', value: String(parentNode.id) }))
    dispatch(updateFilter({ key: 'visibility', value: parentNode.visibility }))
    dispatch(updateFilter({ key: 'search', value: '' }))
    dispatch(fetchFeatureNodes())
  }, [dispatch, parentNode.id, parentNode.visibility])

  const handleSearch = () => {
    dispatch(updateFilter({ key: 'search', value: search.trim() }))
    dispatch(fetchFeatureNodes())
  }

  const handleDelete = (node) => {
    if (!window.confirm(`Hapus sub-topik "${node.name}"? Semua kartu di dalamnya akan ikut terhapus.`)) return
    dispatch(deleteFeatureNode(node.id, () => dispatch(fetchFeatureNodes())))
  }

  const handleSuccess = () => {
    setModal({ open: false, node: null })
    dispatch(fetchFeatureNodes())
  }

  return {
    selectedSubNode, setSelectedSubNode,
    modal, setModal,
    search, setSearch,
    handleSearch, handleDelete, handleSuccess,
  }
}
