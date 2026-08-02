import { useState, useRef, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSummaryNotesByNode, fetchLazyUserNodes, fetchSummaryNoteTopics, searchSummaryNotesV2 } from '@store/summaryNotes/v2/userAction'
import { fetchFavorites } from '@store/favorites/userAction'

export function useNotesSidebar(selectedNoteId, onSelectNote, onSelectEmptyNode) {
  const dispatch = useDispatch()
  const { nodeNotes, loading, searchResults, detail } = useSelector(s => s.summaryNotesV2)

  const [userTopics, setUserTopics] = useState({ primary: [], special: [] })
  const [topicsLoading, setTopicsLoading] = useState({ isFetchingUserTopics: true })
  const [childrenMap, setChildrenMap] = useState({})
  const [childrenPagination, setChildrenPagination] = useState({})
  const [expandedNodes, setExpandedNodes] = useState(new Set())
  const [loadingNodeIds, setLoadingNodeIds] = useState(new Set())

  const [search, setSearch] = useState('')
  const debounceRef = useRef(null)

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

  const isSearching = search.trim().length > 0

  return {
    userTopics, topicsLoading,
    nodeNotes, childrenMap, childrenPagination, expandedNodes, loadingNodeIds,
    handleToggleNode, handleLoadMoreChildren,
    search, isSearching, handleSearchChange, searchResults, isSearchLoading: loading.isSearchLoading,
    handleSelectAndReveal,
  }
}
