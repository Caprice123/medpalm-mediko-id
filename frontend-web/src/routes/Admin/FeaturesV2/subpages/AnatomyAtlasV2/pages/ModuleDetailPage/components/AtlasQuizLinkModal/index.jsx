import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import { useAtlasQuizLinkModal } from './hooks/useAtlasQuizLinkModal'
import {
  Layout,
  LinkedList, LinkedItem, LinkedTitle, EmptyLinked, AddRow,
  Divider, PickerHeader,
  Nav, NavLink, NavCurrent, NavSep,
  FolderList, FolderRow, FolderIcon, FolderName, Chevron, EmptyState,
} from './AtlasQuizLinkModal.styles'

export default function AtlasQuizLinkModal({ atlas, onClose }) {
  const {
    linkedQuizzes, loadingRelations, isSaving,
    pickerOpen, level, selectedTopic, selectedModule, nodes, loadingNodes, isLeaf,
    openPicker, handleTopicClick, handleModuleClick, handleBackToTopics, handleBackToModules,
    handleLinkQuiz, handleUnlink, isAlreadyLinked,
  } = useAtlasQuizLinkModal(atlas)

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={`Link Quiz Anatomi — ${atlas.title}`}
      size="medium"
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={onClose}>Tutup</Button>
        </div>
      }
    >
      <Layout>
        <LinkedList>
          {loadingRelations ? (
            <EmptyLinked>Memuat...</EmptyLinked>
          ) : linkedQuizzes.length === 0 ? (
            <EmptyLinked>Belum ada quiz yang ditautkan.</EmptyLinked>
          ) : (
            linkedQuizzes.map(rel => (
              <LinkedItem key={rel.id}>
                <LinkedTitle>{rel.targetTitle}</LinkedTitle>
                <Button size="small" variant="danger" disabled={isSaving} onClick={() => handleUnlink(rel)}>Hapus</Button>
              </LinkedItem>
            ))
          )}
        </LinkedList>

        <AddRow>
          <Button size="small" variant="secondary" disabled={isSaving || loadingRelations} onClick={openPicker}>
            + Tambah Quiz
          </Button>
        </AddRow>

        {pickerOpen && (
          <>
            <Divider />
            <PickerHeader>Pilih Quiz Anatomi</PickerHeader>

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
                  const disabled = isLeaf && (isAlreadyLinked(node) || isSaving)

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
                        {isLeaf && isAlreadyLinked(node) && (
                          <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: '#9ca3af' }}>(sudah ditautkan)</span>
                        )}
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
