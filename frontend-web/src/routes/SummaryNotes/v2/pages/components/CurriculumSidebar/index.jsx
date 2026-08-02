import { useState, useRef, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSummaryNotesByNode, fetchLazyUserNodes, fetchSummaryNoteTopics, searchSummaryNotesV2 } from '@store/summaryNotes/v2/userAction'
import { fetchFavorites, toggleFavorite } from '@store/favorites/userAction'

import {
  SidebarContainer, SearchBox, SearchIcon, SearchInput,
  ScrollArea, SectionBlock, SectionHeader, SectionLabel,
  NodeRow, ChevronIcon, NodeIcon, NodeLabel, LoadingRow,
  FavoritesSection, RecentSection, SectionListArea,
  RecentHeader, RecentHeaderLabel, CollapseChevron, RecentNoteRow, EmptyHint,
  SearchNoteRow, SearchNoteInfo, SearchNoteTitle, SearchNotePath, FavoriteBtn,
} from './CurriculumSidebar.styles'

const FAV_OPEN_KEY = 'summaryNotesV2_favOpen'
const RECENT_OPEN_KEY = 'summaryNotesV2_recentOpen'

function readStoredOpen(key) {
  try {
    const v = localStorage.getItem(key)
    return v === null ? true : v === 'true'
  } catch {
    return true
  }
}

function useStoredOpen(key) {
  const [open, setOpen] = useState(() => readStoredOpen(key))
  const toggle = useCallback(() => {
    setOpen(prev => {
      const next = !prev
      try { localStorage.setItem(key, String(next)) } catch {}
      return next
    })
  }, [key])
  return [open, toggle]
}

// Layer 1 = topic (folder, always has subtopic children).
// Layer 2 = subtopic (always a leaf, bound to at most one summary note) — this is a
// fixed convention used app-wide (see e.g. FlashcardV2's MoveCardModal), so we can tell
// folder vs. article apart from `node.layer` alone, no fetch needed.
function TreeNode({
  node, depth, selectedNoteId, selectedEmptyNodeId,
  nodeNotes, expandedNodes, loadingNodeIds, childrenMap, childrenPagination,
  favoritedIds,
  onToggleNode, onToggleFavorite, onLoadMoreChildren,
}) {
  const isLeaf = node.layer !== 1
  const isOpen = !isLeaf && expandedNodes.has(node.id)
  const children = childrenMap[node.id] || []
  const isNodeLoading = loadingNodeIds.has(node.id)
  const childrenLoaded = node.id in childrenMap
  const nodeData = nodeNotes[node.id]
  const notes = nodeData?.notes || []
  const canLoadMoreChildren = isOpen && childrenLoaded && childrenPagination[node.id]?.isLastPage === false && !isNodeLoading

  const hasNote = isLeaf && nodeData?.isLoaded && notes.length > 0
  const isKnownEmpty = isLeaf && nodeData?.isLoaded && notes.length === 0
  const isSelected = (hasNote && notes[0].uniqueId === selectedNoteId) || (isKnownEmpty && node.id === selectedEmptyNodeId)
  const isFavNote = hasNote && favoritedIds.includes(notes[0].id)

  return (
    <>
      <NodeRow $depth={depth} $clickable $selected={isSelected} onClick={() => onToggleNode(node)}>
        {isLeaf ? (
          <NodeIcon>📄</NodeIcon>
        ) : (
          <ChevronIcon $open={isOpen}>
            {isNodeLoading ? '…' : '▶'}
          </ChevronIcon>
        )}
        <NodeLabel $selected={isSelected}>{node.name}</NodeLabel>
        {hasNote && (
          <FavoriteBtn
            $active={isFavNote}
            onClick={e => onToggleFavorite(e, notes[0].id, { uniqueId: notes[0].uniqueId, title: notes[0].title })}
            title={isFavNote ? 'Hapus dari favorit' : 'Tambah ke favorit'}
          >
            ★
          </FavoriteBtn>
        )}
      </NodeRow>

      {isOpen && (
        <>
          {isNodeLoading && !childrenLoaded && (
            <LoadingRow $depth={depth + 1}>Memuat...</LoadingRow>
          )}
          {childrenLoaded && children.length === 0 && (
            <LoadingRow $depth={depth + 1}>Belum ada subtopik</LoadingRow>
          )}
          {children.map(child => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedNoteId={selectedNoteId}
              selectedEmptyNodeId={selectedEmptyNodeId}
              nodeNotes={nodeNotes}
              expandedNodes={expandedNodes}
              loadingNodeIds={loadingNodeIds}
              childrenMap={childrenMap}
              childrenPagination={childrenPagination}
              favoritedIds={favoritedIds}
              onToggleNode={onToggleNode}
              onToggleFavorite={onToggleFavorite}
              onLoadMoreChildren={onLoadMoreChildren}
            />
          ))}
          {canLoadMoreChildren && (
            <LoadingRow $depth={depth + 1} $clickable onClick={() => onLoadMoreChildren(node.id)}>
              Muat subtopik lainnya
            </LoadingRow>
          )}
        </>
      )}
    </>
  )
}

function TopicClassificationSection({ label, topics, isLoading, emptyText, ...treeNodeProps }) {
  return (
    <SectionBlock>
      <SectionHeader>
        <SectionLabel>{label}</SectionLabel>
      </SectionHeader>

      {isLoading ? (
        <EmptyHint>Memuat...</EmptyHint>
      ) : topics.length === 0 ? (
        <EmptyHint>{emptyText}</EmptyHint>
      ) : topics.map(node => (
        <TreeNode key={node.id} node={node} depth={0} {...treeNodeProps} />
      ))}
    </SectionBlock>
  )
}

function CurriculumSidebar({ selectedNoteId, selectedEmptyNodeId, onSelectNote, onSelectEmptyNode, onClose }) {
  const dispatch = useDispatch()
  const { nodeNotes, loading, recentlyViewed, searchResults, detail } = useSelector(s => s.summaryNotesV2)
  const { favoritedIds, favoriteItems, loading: favLoading } = useSelector(s => s.favorites)
  const favoritedSummaryNoteIds = favoritedIds['summary_note'] || []
  const favoriteSummaryNotes = favoriteItems['summary_note'] || []

  const [userTopics, setUserTopics] = useState({ primary: [], special: [] })
  const [topicsLoading, setTopicsLoading] = useState({ isFetchingUserTopics: true })
  const [childrenMap, setChildrenMap] = useState({})
  const [childrenPagination, setChildrenPagination] = useState({})
  const [expandedNodes, setExpandedNodes] = useState(new Set())
  const [loadingNodeIds, setLoadingNodeIds] = useState(new Set())

  const [search, setSearch] = useState('')
  const debounceRef = useRef(null)
  const [isFavOpen, toggleFavOpen] = useStoredOpen(FAV_OPEN_KEY)
  const [isRecentOpen, toggleRecentOpen] = useStoredOpen(RECENT_OPEN_KEY)

  // Seeded with whatever note the sidebar mounts already selected (e.g. a direct
  // /summary-notes/:id URL) so that note's first detail load also triggers reveal,
  // not just ones selected via search/favorites/recently-viewed clicks.
  const pendingRevealIdRef = useRef(selectedNoteId || null)

  useEffect(() => {
    setTopicsLoading({ isFetchingUserTopics: true })
    dispatch(fetchSummaryNoteTopics())
      .then(setUserTopics)
      .finally(() => setTopicsLoading({ isFetchingUserTopics: false }))
    dispatch(fetchFavorites('summary_note'))
  }, [dispatch])

  const fetchChildren = useCallback(async (nodeId, page = 1) => {
    if (page === 1 && nodeId in childrenMap) {
      return { data: childrenMap[nodeId], isLastPage: childrenPagination[nodeId]?.isLastPage ?? true }
    }
    setLoadingNodeIds(prev => new Set([...prev, nodeId]))
    try {
      const { data: children, pagination } = await dispatch(fetchLazyUserNodes(nodeId, page))
      setChildrenMap(prev => ({
        ...prev,
        [nodeId]: page === 1 ? children : [...(prev[nodeId] || []), ...children],
      }))
      setChildrenPagination(prev => ({ ...prev, [nodeId]: pagination }))
      return { data: children, isLastPage: pagination.isLastPage }
    } finally {
      setLoadingNodeIds(prev => { const s = new Set(prev); s.delete(nodeId); return s })
    }
  }, [childrenMap, childrenPagination, dispatch])

  const fetchNotesUntilFound = useCallback(async (nodeId, noteId) => {
    const existing = nodeNotes[nodeId]
    if (existing?.notes?.find(n => n.id === noteId)) return
    let page = existing?.isLoaded ? existing.page + 1 : 1
    while (true) {
      const result = await dispatch(fetchSummaryNotesByNode(nodeId, page))
      if (!result || result.notes.find(n => n.id === noteId) || result.isLastPage) break
      page++
    }
  }, [nodeNotes, dispatch])

  const revealNote = useCallback(async (noteDetail) => {
    if (!noteDetail?.nodes?.length) return
    const { path } = noteDetail.nodes[0]
    if (!path?.length) return
    for (const ancestor of path.slice(0, -1)) {
      if (!(ancestor.id in childrenMap)) await fetchChildren(ancestor.id)
      setExpandedNodes(prev => new Set([...prev, ancestor.id]))
    }
    const leaf = path[path.length - 1]
    await fetchNotesUntilFound(leaf.id, noteDetail.id)
  }, [childrenMap, fetchChildren, fetchNotesUntilFound])

  useEffect(() => {
    if (detail && detail.uniqueId === pendingRevealIdRef.current) {
      pendingRevealIdRef.current = null
      revealNote(detail)
    }
  }, [detail, revealNote])

  const handleSelectAndReveal = useCallback((uniqueId) => {
    pendingRevealIdRef.current = uniqueId
    onSelectNote(uniqueId)
  }, [onSelectNote])

  // Subtopic (layer 2) click — always a leaf. Opens its bound note directly,
  // or the "no note yet" empty state in the panel if it has none.
  const openLeafNode = useCallback(async (node) => {
    const nodeId = node.id
    let nodeData = nodeNotes[nodeId]
    if (!nodeData?.isLoaded) {
      const result = await dispatch(fetchSummaryNotesByNode(nodeId))
      nodeData = { notes: result?.notes || [] }
    }
    if (nodeData.notes?.length > 0) {
      onSelectNote(nodeData.notes[0].uniqueId)
    } else {
      onSelectEmptyNode({ id: nodeId, name: node.name })
    }
  }, [nodeNotes, dispatch, onSelectNote, onSelectEmptyNode])

  const handleToggleNode = useCallback(async (node) => {
    if (node.layer !== 1) {
      await openLeafNode(node)
      return
    }

    const nodeId = node.id
    const isExpanding = !expandedNodes.has(nodeId)
    if (!isExpanding) {
      setExpandedNodes(prev => { const next = new Set(prev); next.delete(nodeId); return next })
      return
    }
    setExpandedNodes(prev => new Set([...prev, nodeId]))
    await fetchChildren(nodeId)
  }, [expandedNodes, fetchChildren, openLeafNode])

  const handleLoadMoreChildren = useCallback(async (nodeId) => {
    const page = childrenPagination[nodeId]?.page ?? 1
    await fetchChildren(nodeId, page + 1)
  }, [childrenPagination, fetchChildren])

  const handleSearchChange = useCallback((value) => {
    setSearch(value)
    clearTimeout(debounceRef.current)
    if (value.trim()) {
      debounceRef.current = setTimeout(() => {
        dispatch(searchSummaryNotesV2(value.trim()))
      }, 350)
    }
  }, [dispatch])

  const handleToggleFavorite = useCallback((e, noteId, metadata = null) => {
    e.stopPropagation()
    dispatch(toggleFavorite('summary_note', noteId, metadata))
  }, [dispatch])

  const isSearching = search.trim().length > 0

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
          <SectionBlock>
            {loading.isSearchLoading ? (
              <EmptyHint>Mencari...</EmptyHint>
            ) : searchResults.length === 0 ? (
              <EmptyHint>Tidak ada hasil</EmptyHint>
            ) : searchResults.map(note => {
              const isFav = favoritedSummaryNoteIds.includes(note.id)
              return (
                <SearchNoteRow
                  key={note.id}
                  $selected={note.uniqueId === selectedNoteId}
                  onClick={() => handleSelectAndReveal(note.uniqueId)}
                >
                  <SearchNoteInfo>
                    <SearchNoteTitle $selected={note.uniqueId === selectedNoteId}>
                      {note.title}
                    </SearchNoteTitle>
                    {note.nodePath?.length > 0 && (
                      <SearchNotePath>📁 {note.nodePath.join(' › ')}</SearchNotePath>
                    )}
                  </SearchNoteInfo>
                  <FavoriteBtn
                    $active={isFav}
                    disabled={favLoading.isToggling}
                    onClick={e => handleToggleFavorite(e, note.id, { uniqueId: note.uniqueId, title: note.title })}
                    title={isFav ? 'Hapus dari favorit' : 'Tambah ke favorit'}
                  >
                    ★
                  </FavoriteBtn>
                </SearchNoteRow>
              )
            })}
          </SectionBlock>
        ) : (
          <>
            <TopicClassificationSection
              label="🧩 Sistem Blok"
              topics={userTopics.primary}
              isLoading={topicsLoading.isFetchingUserTopics}
              emptyText="Belum ada topik sistem blok"
              selectedNoteId={selectedNoteId}
              selectedEmptyNodeId={selectedEmptyNodeId}
              nodeNotes={nodeNotes}
              expandedNodes={expandedNodes}
              loadingNodeIds={loadingNodeIds}
              childrenMap={childrenMap}
              childrenPagination={childrenPagination}
              favoritedIds={favoritedSummaryNoteIds}
              onToggleNode={handleToggleNode}
              onToggleFavorite={handleToggleFavorite}
              onLoadMoreChildren={handleLoadMoreChildren}
            />
            <TopicClassificationSection
              label="🔬 Ilmu Lintas Sistem"
              topics={userTopics.special}
              isLoading={topicsLoading.isFetchingUserTopics}
              emptyText="Belum ada topik lintas sistem"
              selectedNoteId={selectedNoteId}
              selectedEmptyNodeId={selectedEmptyNodeId}
              nodeNotes={nodeNotes}
              expandedNodes={expandedNodes}
              loadingNodeIds={loadingNodeIds}
              childrenMap={childrenMap}
              childrenPagination={childrenPagination}
              favoritedIds={favoritedSummaryNoteIds}
              onToggleNode={handleToggleNode}
              onToggleFavorite={handleToggleFavorite}
              onLoadMoreChildren={handleLoadMoreChildren}
            />

            {favoriteSummaryNotes.length > 0 && (
              <FavoritesSection>
                <RecentHeader onClick={toggleFavOpen}>
                  <RecentHeaderLabel>⭐ Favorit</RecentHeaderLabel>
                  <CollapseChevron $open={isFavOpen}>▶</CollapseChevron>
                </RecentHeader>
                <SectionListArea $open={isFavOpen}>
                  {favoriteSummaryNotes.map(item => (
                    <RecentNoteRow
                      key={item.record_id}
                      $selected={item.metadata?.uniqueId === selectedNoteId}
                      onClick={() => handleSelectAndReveal(item.metadata?.uniqueId)}
                    >
                      {item.metadata?.title}
                    </RecentNoteRow>
                  ))}
                </SectionListArea>
              </FavoritesSection>
            )}

            {recentlyViewed.length > 0 && (
              <RecentSection>
                <RecentHeader onClick={toggleRecentOpen}>
                  <RecentHeaderLabel>🕐 Terakhir Dilihat</RecentHeaderLabel>
                  <CollapseChevron $open={isRecentOpen}>▶</CollapseChevron>
                </RecentHeader>
                <SectionListArea $open={isRecentOpen}>
                  {recentlyViewed.map(item => (
                    <RecentNoteRow
                      key={item.id}
                      $selected={item.metadata?.uniqueId === selectedNoteId}
                      onClick={() => handleSelectAndReveal(item.metadata?.uniqueId)}
                    >
                      {item.metadata?.title}
                    </RecentNoteRow>
                  ))}
                </SectionListArea>
              </RecentSection>
            )}
          </>
        )}
      </ScrollArea>
    </SidebarContainer>
  )
}

export default CurriculumSidebar
