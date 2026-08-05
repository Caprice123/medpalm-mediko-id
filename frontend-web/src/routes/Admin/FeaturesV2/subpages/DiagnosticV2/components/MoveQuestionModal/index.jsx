import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import { useMoveQuestionModal } from './hooks/useMoveQuestionModal'
import { Nav, NavLink, NavCurrent, NavSep, FolderList, FolderRow, FolderIcon, FolderName, Chevron, EmptyState } from './MoveQuestionModal.styles'

export default function MoveQuestionModal({ question, onClose, onSuccess, onMove, isSavingOverride }) {
  const {
    nodes, loadingNodes, currentParent, selectedNode,
    handleRowClick, handleBackToRoot, handleConfirm,
    isMoving,
  } = useMoveQuestionModal({ question, onSuccess, onMove, isSavingOverride })

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="Pindah ke Sub-modul"
      size="medium"
      footer={
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={onClose}>Batal</Button>
          <Button variant="primary" onClick={handleConfirm} disabled={!selectedNode || isMoving}>
            {isMoving ? 'Memproses...' : 'Pindah ke Sini'}
          </Button>
        </div>
      }
    >
      <div>
        <Nav>
          {currentParent ? (
            <>
              <NavLink onClick={handleBackToRoot}>Semua Modul</NavLink>
              <NavSep>›</NavSep>
              <NavCurrent>{currentParent.name}</NavCurrent>
            </>
          ) : (
            <NavCurrent>Semua Modul</NavCurrent>
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
              const isSelected = selectedNode?.id === node.id
              return (
                <FolderRow key={node.id} $selected={isSelected} onClick={() => handleRowClick(node)}>
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
