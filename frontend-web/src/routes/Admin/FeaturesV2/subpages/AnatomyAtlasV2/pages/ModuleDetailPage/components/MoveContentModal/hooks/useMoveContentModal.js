import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchFilteredNodes } from '@store/featureNodes'

export function useMoveContentModal({ currentNodeId, onSuccess, onMove, nodeTypeFilter = null }) {
  const dispatch = useDispatch()
  const [nodes, setNodes] = useState([])
  const [loadingNodes, setLoadingNodes] = useState(false)
  const [currentParent, setCurrentParent] = useState(null)
  const [selectedNode, setSelectedNode] = useState(null)

  const loadNodes = async (layer, parentId = null) => {
    setLoadingNodes(true)
    try {
      const params = { layer, visibility: 'general' }
      if (parentId) params.parentId = parentId
      if (layer === '2' && nodeTypeFilter) params.nodeType = nodeTypeFilter
      const data = await dispatch(fetchFilteredNodes(params))
      setNodes(data)
    } finally {
      setLoadingNodes(false)
    }
  }

  useEffect(() => { loadNodes('1') }, [])

  const handleRowClick = (node) => {
    if (node.layer === 1) {
      setCurrentParent(node)
      setSelectedNode(null)
      loadNodes('2', node.id)
    } else if (node.id !== currentNodeId) {
      setSelectedNode(prev => prev?.id === node.id ? null : node)
    }
  }

  const handleBackToRoot = () => {
    setCurrentParent(null)
    setSelectedNode(null)
    loadNodes('1')
  }

  const handleConfirm = () => {
    if (!selectedNode) return
    onMove(selectedNode.id, onSuccess)
  }

  return {
    nodes, loadingNodes, currentParent, selectedNode,
    handleRowClick, handleBackToRoot, handleConfirm,
  }
}
