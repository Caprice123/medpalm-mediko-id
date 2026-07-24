import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchFilteredNodes } from '@store/featureNodes'
import { moveNodeCard } from '@store/nodeCards'
import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import { Nav, NavLink, NavCurrent, NavSep, FolderList, FolderRow, FolderIcon, FolderName, Chevron, EmptyState } from './MoveCardModal.styles'

export default function MoveCardModal({ card, currentNode, onClose, onSuccess }) {
  const dispatch = useDispatch()
  const { loading } = useSelector(state => state.nodeCards)

  const [nodes, setNodes] = useState([])
  const [loadingNodes, setLoadingNodes] = useState(false)
  const [currentParent, setCurrentParent] = useState(null)
  const [selectedNode, setSelectedNode] = useState(null)

  const loadNodes = async (layer, parentId = null) => {
    setLoadingNodes(true)
    try {
      const params = { layer }
      if (parentId) params.parentId = parentId
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
    } else if (node.id !== currentNode.id) {
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
    dispatch(moveNodeCard(currentNode.id, card.id, selectedNode.id, onSuccess))
  }

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Pindah Kartu"
      size="medium"
      footer={
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={onClose}>Batal</Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={!selectedNode || loading.isMovingCard}
          >
            {loading.isMovingCard ? 'Memindahkan...' : 'Pindah ke Sini'}
          </Button>
        </div>
      }
    >
      <div>
        <Nav>
          {currentParent ? (
            <>
              <NavLink onClick={handleBackToRoot}>Semua Topik</NavLink>
              <NavSep>›</NavSep>
              <NavCurrent>{currentParent.name}</NavCurrent>
            </>
          ) : (
            <NavCurrent>Semua Topik</NavCurrent>
          )}
        </Nav>

        <FolderList>
          {loadingNodes ? (
            <EmptyState>Memuat...</EmptyState>
          ) : nodes.length === 0 ? (
            <EmptyState>Tidak ada sub-topik</EmptyState>
          ) : (
            nodes.map(node => {
              const isFolder = node.layer === 1
              const isDisabled = node.id === currentNode.id
              const isSelected = selectedNode?.id === node.id

              return (
                <FolderRow
                  key={node.id}
                  $selected={isSelected}
                  $disabled={isDisabled}
                  onClick={() => !isDisabled && handleRowClick(node)}
                >
                  <FolderIcon $isFolder={isFolder}>{isFolder ? '▶' : '—'}</FolderIcon>
                  <FolderName $bold={isFolder} $selected={isSelected}>{node.name}</FolderName>
                  {isFolder && <Chevron>›</Chevron>}
                </FolderRow>
              )
            })
          )}
        </FolderList>
      </div>
    </Modal>
  )
}
