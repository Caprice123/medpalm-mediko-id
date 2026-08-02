import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchFeatureNodes, deleteFeatureNode, updateFilter } from '@store/featureNodes'

export function useNodeDetail(parentNode) {
  const dispatch = useDispatch()
  const search = useSelector(s => s.featureNodes.filter.search)

  const [selectedSubNode, setSelectedSubNode] = useState(null)
  const [modal, setModal] = useState({ open: false, node: null })

  useEffect(() => {
    dispatch(updateFilter({ key: 'layer', value: '2' }))
    dispatch(updateFilter({ key: 'parentId', value: String(parentNode.id) }))
    dispatch(updateFilter({ key: 'visibility', value: parentNode.visibility }))
    dispatch(updateFilter({ key: 'nodeType', value: 'subtopic' }))
    dispatch(updateFilter({ key: 'search', value: '' }))
    dispatch(fetchFeatureNodes())
  }, [dispatch, parentNode.id, parentNode.visibility])

  const setSearch = (value) => dispatch(updateFilter({ key: 'search', value }))

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
