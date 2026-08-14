import Modal from '@components/common/Modal'
import { useSummaryNoteTreePicker } from './hooks/useSummaryNoteTreePicker'
import { Nav, NavLink, NavCurrent, NavSep, FolderList, FolderRow, FolderIcon, FolderName, Chevron, EmptyState } from './SummaryNoteTreePicker.styles'

export default function SummaryNoteTreePicker({ onSelect, onClose }) {
  const {
    view, nodes, loadingNodes, currentTopic, resolvingNodeId,
    openTopic, backToTopics, selectSubtopic,
  } = useSummaryNoteTreePicker({ onSelect })

  return (
    <Modal isOpen onClose={onClose} title="Pilih Modul Terkait" size="medium">
      <div>
        <Nav>
          <NavLink onClick={backToTopics}>Semua Topik</NavLink>
          {currentTopic && (
            <>
              <NavSep>›</NavSep>
              <NavCurrent>{currentTopic.name}</NavCurrent>
            </>
          )}
        </Nav>

        <FolderList>
          {loadingNodes ? (
            <EmptyState>Memuat...</EmptyState>
          ) : nodes.length === 0 ? (
            <EmptyState>{view === 'topics' ? 'Tidak ada topik' : 'Tidak ada sub-topik dengan ringkasan'}</EmptyState>
          ) : (
            nodes.map(node => (
              <FolderRow
                key={node.id}
                onClick={() => view === 'topics' ? openTopic(node) : selectSubtopic(node)}
              >
                <FolderIcon $isFolder={view === 'topics'}>{view === 'topics' ? '▶' : '📄'}</FolderIcon>
                <FolderName $bold={view === 'topics'}>{node.name}</FolderName>
                <Chevron>{view === 'topics' ? '›' : (resolvingNodeId === node.id ? 'Memuat...' : 'Pilih')}</Chevron>
              </FolderRow>
            ))
          )}
        </FolderList>
      </div>
    </Modal>
  )
}
