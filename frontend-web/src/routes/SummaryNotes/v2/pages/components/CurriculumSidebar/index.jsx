import { useState, useRef, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSummaryNotesByNode, fetchLazyUserNodes, searchSummaryNotesV2 } from '@store/summaryNotes/v2/userAction'
import { fetchFavorites, toggleFavorite } from '@store/favorites/userAction'

import {
  SidebarContainer, SearchBox, SearchIcon, SearchInput,
  ScrollArea, SectionBlock, SectionHeader, SectionLabel, TabGroup, Tab,
  NodeRow, ChevronIcon, NodeIcon, NodeLabel,
  NoteRow, NoteIcon, NoteLabel, LoadingRow,
  FavoritesSection, RecentSection, SectionListArea,
  RecentHeader, RecentHeaderLabel, CollapseChevron, RecentNoteRow, EmptyHint,
  SearchNoteRow, SearchNoteInfo, SearchNoteTitle, SearchNotePath, FavoriteBtn,
} from './CurriculumSidebar.styles'

function TreeNode({
  node, depth, selectedNoteId,
  nodeNotes, expandedNodes, loadingNodeIds, childrenMap, childrenPagination,
  favoritedIds,
  onToggleNode, onSelectNote, onLoadMoreChildren, onLoadMoreNotes, onToggleFavorite,
}) {
  const isOpen = expandedNodes.has(node.id)
  const children = childrenMap[node.id] || []
  const isNodeLoading = loadingNodeIds.has(node.id)
  const childrenLoaded = node.id in childrenMap
  const nodeData = nodeNotes[node.id]
  const notes = nodeData?.notes || []
  const isNotesLoading = nodeData?.isLoading
  const isLoadingMoreNotes = nodeData?.isLoadingMore
  const showChevron = isNodeLoading || !childrenLoaded || children.length > 0 || isOpen || notes.length > 0
  const canLoadMoreChildren = isOpen && childrenLoaded && childrenPagination[node.id]?.isLastPage === false && !isNodeLoading
  const canLoadMoreNotes = isOpen && nodeData?.isLoaded && !nodeData?.isLastPage && !isNotesLoading

  return (
    <>
      <NodeRow $depth={depth} $clickable onClick={() => onToggleNode(node.id)}>
        {showChevron ? (
          <ChevronIcon $open={isOpen}>
            {isNodeLoading ? '…' : '▶'}
          </ChevronIcon>
        ) : (
          <span style={{ width: '0.75rem', flexShrink: 0 }} />
        )}
        <NodeLabel>{node.name}</NodeLabel>
      </NodeRow>

      {isOpen && (
        <>
          {children.map(child => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedNoteId={selectedNoteId}
              nodeNotes={nodeNotes}
              expandedNodes={expandedNodes}
              loadingNodeIds={loadingNodeIds}
              childrenMap={childrenMap}
              childrenPagination={childrenPagination}
              favoritedIds={favoritedIds}
              onToggleNode={onToggleNode}
              onSelectNote={onSelectNote}
              onLoadMoreChildren={onLoadMoreChildren}
              onLoadMoreNotes={onLoadMoreNotes}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
          {canLoadMoreChildren && (
            <LoadingRow $depth={depth + 1} $clickable onClick={() => onLoadMoreChildren(node.id)}>
              Muat folder lainnya
            </LoadingRow>
          )}
          {isNotesLoading && (
            <LoadingRow $depth={depth + 1}>Memuat...</LoadingRow>
          )}
          {!isNotesLoading && notes.map(note => {
            const isFav = favoritedIds.includes(note.id)
            return (
              <NoteRow
                key={note.id}
                $depth={depth + 1}
                $selected={note.uniqueId === selectedNoteId}
                onClick={() => onSelectNote(note.uniqueId)}
              >
                <NoteIcon>📄</NoteIcon>
                <NoteLabel $selected={note.uniqueId === selectedNoteId}>{note.title}</NoteLabel>
                <FavoriteBtn
                  $active={isFav}
                  onClick={e => onToggleFavorite(e, note.id, { uniqueId: note.uniqueId, title: note.title })}
                  title={isFav ? 'Hapus dari favorit' : 'Tambah ke favorit'}
                >
                  ★
                </FavoriteBtn>
              </NoteRow>
            )
          })}
          {canLoadMoreNotes && (
            <LoadingRow
              $depth={depth + 1}
              $clickable={!isLoadingMoreNotes}
              onClick={() => !isLoadingMoreNotes && onLoadMoreNotes(node.id, (nodeData.page ?? 1) + 1)}
            >
              {isLoadingMoreNotes ? 'Memuat...' : 'Muat ringkasan lainnya'}
            </LoadingRow>
          )}
          {!isNotesLoading && nodeData?.isLoaded && notes.length === 0 && childrenLoaded && children.length === 0 && (
            <LoadingRow $depth={depth + 1}>Tidak ada ringkasan</LoadingRow>
          )}
        </>
      )}
    </>
  )
}

function CurriculumSidebar({ selectedNoteId, onSelectNote }) {
  const dispatch = useDispatch()
  const { nodeNotes, loading, recentlyViewed, searchResults, detail } = useSelector(s => s.summaryNotesV2)
  const { favoritedIds, favoriteItems, loading: favLoading } = useSelector(s => s.favorites)
  const favoritedSummaryNoteIds = favoritedIds['summary_note'] || []
  const favoriteSummaryNotes = favoriteItems['summary_note'] || []

  const [treeMode, setTreeMode] = useState('semester')
  const [rootNodes, setRootNodes] = useState([])
  const [childrenMap, setChildrenMap] = useState({})
  const [childrenPagination, setChildrenPagination] = useState({})
  const [expandedNodes, setExpandedNodes] = useState(new Set())
  const [loadingNodeIds, setLoadingNodeIds] = useState(new Set())
  const [rootLoading, setRootLoading] = useState(false)

  const [search, setSearch] = useState('')
  const debounceRef = useRef(null)
  const [isFavOpen, setIsFavOpen] = useState(true)
  const [isRecentOpen, setIsRecentOpen] = useState(true)

  const pendingRevealIdRef = useRef(null)

  useEffect(() => {
    setRootLoading(true)
    dispatch(fetchLazyUserNodes(null))
      .then(({ data }) => setRootNodes(data))
      .finally(() => setRootLoading(false))
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
    setExpandedNodes(prev => new Set([...prev, leaf.id]))
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

  const handleToggleNode = useCallback(async (nodeId) => {
    const isExpanding = !expandedNodes.has(nodeId)
    setExpandedNodes(prev => {
      const next = new Set(prev)
      isExpanding ? next.add(nodeId) : next.delete(nodeId)
      return next
    })
    if (!isExpanding) return
    const { data: children, isLastPage } = await fetchChildren(nodeId)
    if (children.length === 0 && isLastPage && !nodeNotes[nodeId]?.isLoaded) {
      dispatch(fetchSummaryNotesByNode(nodeId))
    }
  }, [expandedNodes, fetchChildren, nodeNotes, dispatch])

  const handleLoadMoreChildren = useCallback(async (nodeId) => {
    const page = childrenPagination[nodeId]?.page ?? 1
    await fetchChildren(nodeId, page + 1)
  }, [childrenPagination, fetchChildren])

  const handleLoadMoreNotes = useCallback((nodeId, page) => {
    dispatch(fetchSummaryNotesByNode(nodeId, page))
  }, [dispatch])

  const handleSetSubjectMode = useCallback(async () => {
    setTreeMode('subject')
    for (const node of rootNodes) {
      if (!expandedNodes.has(node.id)) {
        setExpandedNodes(prev => new Set([...prev, node.id]))
      }
      if (!(node.id in childrenMap)) {
        setLoadingNodeIds(prev => new Set([...prev, node.id]))
        dispatch(fetchLazyUserNodes(node.id, 1)).then(({ data: children, pagination }) => {
          setChildrenMap(prev => ({ ...prev, [node.id]: children }))
          setChildrenPagination(prev => ({ ...prev, [node.id]: pagination }))
          setLoadingNodeIds(prev => { const s = new Set(prev); s.delete(node.id); return s })
        })
      }
    }
  }, [rootNodes, expandedNodes, childrenMap, dispatch])

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

  const displayedRootNodes = treeMode === 'subject'
    ? rootNodes.flatMap(n => childrenMap[n.id] || [])
    : rootNodes

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
          <SectionBlock>
            <SectionHeader>
              <SectionLabel>📖 Kurikulum</SectionLabel>
              <TabGroup>
                <Tab $active={treeMode === 'semester'} onClick={() => setTreeMode('semester')}>Semester</Tab>
                <Tab $active={treeMode === 'subject'} onClick={handleSetSubjectMode}>Subject</Tab>
              </TabGroup>
            </SectionHeader>

            {rootLoading ? (
              <EmptyHint>Memuat kurikulum...</EmptyHint>
            ) : displayedRootNodes.length === 0 ? (
              <EmptyHint>
                {treeMode === 'subject' && loadingNodeIds.size > 0
                  ? 'Memuat...'
                  : 'Belum ada folder kurikulum'}
              </EmptyHint>
            ) : displayedRootNodes.map(node => (
              <TreeNode
                key={node.id}
                node={node}
                depth={0}
                selectedNoteId={selectedNoteId}
                nodeNotes={nodeNotes}
                expandedNodes={expandedNodes}
                loadingNodeIds={loadingNodeIds}
                childrenMap={childrenMap}
                childrenPagination={childrenPagination}
                favoritedIds={favoritedSummaryNoteIds}
                onToggleNode={handleToggleNode}
                onSelectNote={onSelectNote}
                onLoadMoreChildren={handleLoadMoreChildren}
                onLoadMoreNotes={handleLoadMoreNotes}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </SectionBlock>
        )}
      </ScrollArea>

      {favoriteSummaryNotes.length > 0 && !isSearching && (
        <FavoritesSection>
          <RecentHeader onClick={() => setIsFavOpen(p => !p)}>
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

      {recentlyViewed.length > 0 && !isSearching && (
        <RecentSection>
          <RecentHeader onClick={() => setIsRecentOpen(p => !p)}>
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
    </SidebarContainer>
  )
}

export default CurriculumSidebar
