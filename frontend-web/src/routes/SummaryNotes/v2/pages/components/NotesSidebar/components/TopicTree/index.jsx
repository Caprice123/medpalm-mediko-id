import { PiCaretRight } from 'react-icons/pi'
import { useStoredOpen } from '../../hooks/useStoredOpen'
import { EmptyHint } from '../../NotesSidebar.styles'
import TreeNode from '../TreeNode'
import { SectionBlock, SectionHeader, SectionChevron, SectionLabel, SectionCount } from './TopicTree.styles'

export default function TopicTree({
  label, topics, isLoading, emptyText, storageKey,
  selectedNoteId, selectedEmptyNodeId,
  expandedNodes, onToggleNode, onLoadMoreChildren,
}) {
  const [isOpen, toggle] = useStoredOpen(storageKey)

  return (
    <SectionBlock>
      <SectionHeader onClick={toggle} aria-expanded={isOpen}>
        <SectionChevron $open={isOpen}><PiCaretRight /></SectionChevron>
        <SectionLabel>{label}</SectionLabel>
        {!isLoading && topics.length > 0 && <SectionCount>{topics.length}</SectionCount>}
      </SectionHeader>

      {isOpen && (
        isLoading ? (
          <EmptyHint>Memuat...</EmptyHint>
        ) : topics.length === 0 ? (
          <EmptyHint>{emptyText}</EmptyHint>
        ) : topics.map(topic => (
          <TreeNode
            key={topic.id}
            node={topic}
            depth={0}
            selectedNoteId={selectedNoteId}
            selectedEmptyNodeId={selectedEmptyNodeId}
            expandedNodes={expandedNodes}
            onToggleNode={onToggleNode}
            onLoadMoreChildren={onLoadMoreChildren}
          />
        ))
      )}
    </SectionBlock>
  )
}
