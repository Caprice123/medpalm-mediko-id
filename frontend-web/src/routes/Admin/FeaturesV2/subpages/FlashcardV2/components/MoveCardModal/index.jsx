import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import { useMoveCardModal } from './hooks/useMoveCardModal'
import { Nav, NavLink, NavCurrent, NavSep, FolderList, FolderRow, FolderIcon, FolderName, Chevron, EmptyState } from './MoveCardModal.styles'

export default function MoveCardModal({ card, currentNode, onClose, onSuccess, onMove, isSavingOverride, title, nodeTypeFilter = null }) {
  const {
    nodes, loadingNodes, currentParent, selectedNode,
    handleRowClick, handleBackToRoot, handleConfirm,
    isMoving,
  } = useMoveCardModal({ card, currentNode, onSuccess, onMove, isSavingOverride, nodeTypeFilter })

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={title || 'Pindah Kartu'}
      size="medium"
      footer={
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={onClose}>Batal</Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={!selectedNode || isMoving}
          >
            {isMoving ? 'Memproses...' : 'Pindah ke Sini'}
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
              const isDisabled = currentNode && node.id === currentNode.id
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
