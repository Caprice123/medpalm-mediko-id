import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchFilteredNodes } from '@store/featureNodes'
import { moveNodeCard } from '@store/nodeCards'

export function useMoveCardModal({ card, currentNode, onSuccess, onMove, isSavingOverride, nodeTypeFilter = null }) {
  const dispatch = useDispatch()
  const { loading } = useSelector(state => state.nodeCards)

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
    } else if (!currentNode || node.id !== currentNode.id) {
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
    if (onMove) {
      onMove(selectedNode.id, onSuccess)
    } else {
      dispatch(moveNodeCard(currentNode.id, card.id, selectedNode.id, onSuccess))
    }
  }

  const isMoving = isSavingOverride ?? loading.isMovingCard

  return {
    nodes, loadingNodes, currentParent, selectedNode,
    handleRowClick, handleBackToRoot, handleConfirm,
    isMoving,
  }
}
