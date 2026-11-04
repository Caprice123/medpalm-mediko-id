import { useSelector } from 'react-redux'
import { PiBookOpenText, PiX } from 'react-icons/pi'
import { useNotesSidebar } from './hooks/useNotesSidebar'
import { useSidebarSearch } from './hooks/useSidebarSearch'
import SidebarSearch from './components/SidebarSearch'
import TopicTree from './components/TopicTree'
import SearchResults from './components/SearchResults'
import CollapsibleNoteSection from './components/CollapsibleNoteSection'
import {
  SidebarContainer, SidebarTop, SidebarTitle, DrawerCloseButton,
  ScrollArea, PinnedFooter,
} from './NotesSidebar.styles'

export default function NotesSidebar({
  selectedNoteId, selectedEmptyNodeId, onSelectNote, onSelectEmptyNode, onClose,
}) {
  const userTopics = useSelector(s => s.summaryNotesV2.userTopics)
  const isFetchingUserTopics = useSelector(s => s.summaryNotesV2.loading.isFetchingUserTopics)
  const { expandedNodes, handleToggleNode, handleLoadMoreChildren } = useNotesSidebar({
    onSelectNote, onSelectEmptyNode,
  })
  const { query, trimmedQuery, isSearching, handleChange, handleClear } = useSidebarSearch()

  const treeProps = {
    selectedNoteId,
    selectedEmptyNodeId,
    expandedNodes,
    onToggleNode: handleToggleNode,
    onLoadMoreChildren: handleLoadMoreChildren,
  }

  return (
    <SidebarContainer>
      <SidebarTop>
        <SidebarTitle><PiBookOpenText />Ringkasan Materi</SidebarTitle>
        <DrawerCloseButton onClick={onClose} aria-label="Tutup daftar materi">
          <PiX />
        </DrawerCloseButton>
      </SidebarTop>

      <SidebarSearch query={query} onChange={handleChange} onClear={handleClear} />

      <ScrollArea>
        {isSearching ? (
          <SearchResults
            query={trimmedQuery}
            selectedNoteId={selectedNoteId}
            onSelectNote={onSelectNote}
          />
        ) : (
          <>
            <TopicTree
              label="Sistem Blok"
              storageKey="summaryNotesV2_primaryOpen"
              topics={userTopics.primary}
              isLoading={isFetchingUserTopics}
              emptyText="Belum ada topik sistem blok"
              {...treeProps}
            />
            <TopicTree
              label="Ilmu Lintas Sistem"
              storageKey="summaryNotesV2_specialOpen"
              topics={userTopics.special}
              isLoading={isFetchingUserTopics}
              emptyText="Belum ada topik lintas sistem"
              {...treeProps}
            />
          </>
        )}
      </ScrollArea>

      <PinnedFooter>
        <CollapsibleNoteSection source="favorites" selectedNoteId={selectedNoteId} onSelectNote={onSelectNote} />
        <CollapsibleNoteSection source="recent" selectedNoteId={selectedNoteId} onSelectNote={onSelectNote} />
      </PinnedFooter>
    </SidebarContainer>
  )
}
