import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import { useQuizLinkModal } from './hooks/useQuizLinkModal'
import {
  Layout, Slots, SlotRow, SlotLabel, SlotValue, SlotEmpty, SlotActions,
  Divider, PickerHeader, PickerFor,
  Nav, NavLink, NavCurrent, NavSep,
  FolderList, FolderRow, FolderIcon, FolderName, Chevron, EmptyState,
} from './QuizLinkModal.styles'

export default function QuizLinkModal({ quiz, onClose }) {
  const {
    prevRelation, nextRelation, loadingRelations, isSaving,
    activeSide, level, selectedTopic, selectedModule, nodes, loadingNodes, isLeaf,
    openPicker, handleTopicClick, handleModuleClick, handleBackToTopics, handleBackToModules,
    handleLinkQuiz, handleUnlink, isSelf, isOtherSlot,
  } = useQuizLinkModal(quiz)

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={`Link Quiz Anatomi — ${quiz.title}`}
      size="medium"
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={onClose}>Tutup</Button>
        </div>
      }
    >
      <Layout>
        <Slots>
          <SlotRow>
            <SlotLabel>◀ Sebelum</SlotLabel>
            {loadingRelations ? <SlotEmpty>Memuat...</SlotEmpty>
              : prevRelation ? <SlotValue>{prevRelation.targetTitle}</SlotValue>
              : <SlotEmpty>Belum diatur</SlotEmpty>}
            <SlotActions>
              <Button size="small" variant="secondary" disabled={isSaving} onClick={() => openPicker('prev')}>
                {activeSide === 'prev' ? 'Sedang memilih...' : 'Atur'}
              </Button>
              {prevRelation && (
                <Button size="small" variant="danger" disabled={isSaving} onClick={() => handleUnlink('prev')}>Hapus</Button>
              )}
            </SlotActions>
          </SlotRow>

          <SlotRow>
            <SlotLabel>Sesudah ▶</SlotLabel>
            {loadingRelations ? <SlotEmpty>Memuat...</SlotEmpty>
              : nextRelation ? <SlotValue>{nextRelation.targetTitle}</SlotValue>
              : <SlotEmpty>Belum diatur</SlotEmpty>}
            <SlotActions>
              <Button size="small" variant="secondary" disabled={isSaving} onClick={() => openPicker('next')}>
                {activeSide === 'next' ? 'Sedang memilih...' : 'Atur'}
              </Button>
              {nextRelation && (
                <Button size="small" variant="danger" disabled={isSaving} onClick={() => handleUnlink('next')}>Hapus</Button>
              )}
            </SlotActions>
          </SlotRow>
        </Slots>

        {activeSide && (
          <>
            <Divider />
            <PickerHeader>
              Pilih Quiz Anatomi — <PickerFor>{activeSide === 'prev' ? 'Sebelum' : 'Sesudah'}</PickerFor>
            </PickerHeader>

            <Nav>
              {level === 'topics' ? (
                <NavCurrent>Semua Topik</NavCurrent>
              ) : level === 'modules' ? (
                <><NavLink onClick={handleBackToTopics}>Semua Topik</NavLink><NavSep>›</NavSep><NavCurrent>{selectedTopic?.name}</NavCurrent></>
              ) : (
                <><NavLink onClick={handleBackToTopics}>Semua Topik</NavLink><NavSep>›</NavSep><NavLink onClick={handleBackToModules}>{selectedTopic?.name}</NavLink><NavSep>›</NavSep><NavCurrent>{selectedModule?.name}</NavCurrent></>
              )}
            </Nav>

            <FolderList>
              {loadingNodes ? (
                <EmptyState>Memuat...</EmptyState>
              ) : nodes.length === 0 ? (
                <EmptyState>Tidak ada data</EmptyState>
              ) : (
                nodes.map(node => {
                  const isFolder = !isLeaf
                  const disabled = isLeaf && (isSelf(node) || isOtherSlot(node) || isSaving)

                  return (
                    <FolderRow
                      key={node.id ?? node.uniqueId}
                      $disabled={disabled}
                      onClick={() => {
                        if (disabled) return
                        if (level === 'topics') handleTopicClick(node)
                        else if (level === 'modules') handleModuleClick(node)
                        else handleLinkQuiz(node)
                      }}
                    >
                      <FolderIcon $isFolder={isFolder}>{isFolder ? '▶' : '◆'}</FolderIcon>
                      <FolderName $bold={isFolder}>
                        {node.title ?? node.name}
                        {isLeaf && isSelf(node) && <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: '#9ca3af' }}>(ini)</span>}
                        {isLeaf && isOtherSlot(node) && <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: '#9ca3af' }}>(sudah di slot lain)</span>}
                      </FolderName>
                      {isFolder && <Chevron>›</Chevron>}
                    </FolderRow>
                  )
                })
              )}
            </FolderList>
          </>
        )}
      </Layout>
    </Modal>
  )
}
