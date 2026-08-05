import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { moveUnlinkedDiagnosticQuestion } from '@store/diagnosticNodes/adminAction'
import { fetchFilteredNodes } from '@store/featureNodes'

export function useMoveQuestionModal({ question, onSuccess, onMove, isSavingOverride }) {
  const dispatch = useDispatch()
  const { loading } = useSelector(s => s.nodeQuestions)

  const [nodes, setNodes] = useState([])
  const [loadingNodes, setLoadingNodes] = useState(false)
  const [currentParent, setCurrentParent] = useState(null)
  const [selectedNode, setSelectedNode] = useState(null)

  const loadNodes = async (layer, parentId = null) => {
    setLoadingNodes(true)
    try {
      const params = { layer: String(layer), visibility: 'diagnostic' }
      if (parentId !== null) params.parentId = parentId
      const data = await dispatch(fetchFilteredNodes(params))
      setNodes(data)
    } finally {
      setLoadingNodes(false)
    }
  }

  useEffect(() => { loadNodes(1) }, [])

  const handleRowClick = (node) => {
    if (node.layer === 1) {
      setCurrentParent(node)
      setSelectedNode(null)
      loadNodes(2, node.id)
    } else {
      setSelectedNode(prev => prev?.id === node.id ? null : node)
    }
  }

  const handleBackToRoot = () => {
    setCurrentParent(null)
    setSelectedNode(null)
    loadNodes(1)
  }

  const handleConfirm = () => {
    if (!selectedNode) return
    if (onMove) {
      onMove(selectedNode.id, onSuccess)
    } else {
      dispatch(moveUnlinkedDiagnosticQuestion(question.id, selectedNode.id, onSuccess))
    }
  }

  const isMoving = isSavingOverride ?? loading.isMovingQuestion

  return {
    nodes, loadingNodes, currentParent, selectedNode,
    handleRowClick, handleBackToRoot, handleConfirm,
    isMoving,
  }
}
