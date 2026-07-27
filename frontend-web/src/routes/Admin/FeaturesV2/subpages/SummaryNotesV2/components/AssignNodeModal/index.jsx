import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchFilteredNodes, createNodeRecord } from '@store/featureNodes'
import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import {
  Nav, NavLink, NavCurrent, NavSep,
  FolderList, FolderRow, FolderIcon, FolderName, Chevron, EmptyState,
} from './AssignNodeModal.styles'

export default function AssignNodeModal({ note, onClose, onSuccess }) {
  const dispatch = useDispatch()

  const [nodes, setNodes] = useState([])
  const [loadingNodes, setLoadingNodes] = useState(false)
  const [currentParent, setCurrentParent] = useState(null)
  const [selectedNode, setSelectedNode] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const loadNodes = async (layer, parentId = null) => {
    setLoadingNodes(true)
    try {
      const params = { layer, visibility: 'general' }
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
    } else {
      setSelectedNode(prev => prev?.id === node.id ? null : node)
    }
  }

  const handleBackToRoot = () => {
    setCurrentParent(null)
    setSelectedNode(null)
    loadNodes('1')
  }

  const handleConfirm = async () => {
    if (!selectedNode) return
    setSubmitting(true)
    try {
      await dispatch(createNodeRecord({ nodeId: selectedNode.id, recordType: 'summary_note', recordId: note.id }))
      onSuccess()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={`Pindahkan: ${note.title}`}
      size="medium"
      footer={
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={onClose}>Batal</Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={!selectedNode || submitting}
          >
            {submitting ? 'Memproses...' : 'Pindah ke Sini'}
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
            <EmptyState>Tidak ada {currentParent ? 'sub-topik' : 'topik'} tersedia</EmptyState>
          ) : (
            nodes.map(node => {
              const isFolder = node.layer === 1
              const isSelected = selectedNode?.id === node.id

              return (
                <FolderRow
                  key={node.id}
                  $selected={isSelected}
                  onClick={() => handleRowClick(node)}
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
