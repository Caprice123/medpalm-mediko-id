import { useSelector } from 'react-redux'
import { useNotesSidebar } from './hooks/useNotesSidebar'
import TopicTree from './components/TopicTree'
import SearchResults from './components/SearchResults'
import CollapsibleNoteSection from './components/CollapsibleNoteSection'
import { SidebarContainer, SearchBox, SearchIcon, SearchInput, ScrollArea } from './NotesSidebar.styles'

export default function NotesSidebar({ selectedNoteId, selectedEmptyNodeId, onSelectNote, onSelectEmptyNode }) {
  const { userTopics, loading } = useSelector(s => s.summaryNotesV2)
  const {
    nodeNotes, childrenMap, childrenPagination, expandedNodes, loadingNodeIds,
    handleToggleNode, handleLoadMoreChildren,
    search, isSearching, handleSearchChange,
    handleSelectAndReveal,
  } = useNotesSidebar(selectedNoteId, onSelectNote, onSelectEmptyNode)

  return (
    <SidebarContainer>
      <SearchBox>
        <SearchIcon>🔍</SearchIcon>
        <SearchInput
          placeholder="Search summaries..."
          value={search}
          onChange={e => handleSearchChange(e.target.value)}
        />
      </SearchBox>

      <ScrollArea>
        {isSearching ? (
          <SearchResults
            selectedNoteId={selectedNoteId}
            onSelectNote={handleSelectAndReveal}
          />
        ) : (
          <>
            <TopicTree
              label="Sistem Blok"
              topics={userTopics.primary}
              isLoading={loading.isFetchingUserTopics}
              emptyText="Belum ada topik sistem blok"
              selectedNoteId={selectedNoteId}
              selectedEmptyNodeId={selectedEmptyNodeId}
              nodeNotes={nodeNotes}
              expandedNodes={expandedNodes}
              loadingNodeIds={loadingNodeIds}
              childrenMap={childrenMap}
              childrenPagination={childrenPagination}
              onToggleNode={handleToggleNode}
              onLoadMoreChildren={handleLoadMoreChildren}
            />
            <TopicTree
              label="Ilmu Lintas Sistem"
              topics={userTopics.special}
              isLoading={loading.isFetchingUserTopics}
              emptyText="Belum ada topik lintas sistem"
              selectedNoteId={selectedNoteId}
              selectedEmptyNodeId={selectedEmptyNodeId}
              nodeNotes={nodeNotes}
              expandedNodes={expandedNodes}
              loadingNodeIds={loadingNodeIds}
              childrenMap={childrenMap}
              childrenPagination={childrenPagination}
              onToggleNode={handleToggleNode}
              onLoadMoreChildren={handleLoadMoreChildren}
            />

            <CollapsibleNoteSection source="favorites" selectedNoteId={selectedNoteId} onSelectNote={handleSelectAndReveal} />
            <CollapsibleNoteSection source="recent" selectedNoteId={selectedNoteId} onSelectNote={handleSelectAndReveal} />
          </>
        )}
      </ScrollArea>
    </SidebarContainer>
  )
}
