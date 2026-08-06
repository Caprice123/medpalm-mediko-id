import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleFavorite } from '@store/favorites/userAction'
import { SectionBlock, EmptyHint, FavoriteBtn } from '../../NotesSidebar.styles'
import { SectionHeader, SectionLabel, NodeRow, ChevronIcon, NodeIcon, NodeLabel, LoadingRow } from './TopicTree.styles'

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

  const loadMoreRef = useRef(null)
  useEffect(() => {
    if (!canLoadMoreChildren) return
    const el = loadMoreRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) onLoadMoreChildren(node.id) },
      { rootMargin: '200px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [canLoadMoreChildren, node.id, onLoadMoreChildren])

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
            <LoadingRow ref={loadMoreRef} $depth={depth + 1}>
              Memuat subtopik lainnya...
            </LoadingRow>
          )}
        </>
      )}
    </>
  )
}

export default function TopicClassificationSection({
  label, topics, isLoading, emptyText,
  selectedNoteId, selectedEmptyNodeId,
  nodeNotes, expandedNodes, loadingNodeIds, childrenMap, childrenPagination,
  onToggleNode, onLoadMoreChildren,
}) {
  const dispatch = useDispatch()
  const { favoritedIds } = useSelector(s => s.favorites)
  const favoritedSummaryNoteIds = favoritedIds['summary_note'] || []

  const handleToggleFavorite = (e, noteId, metadata = null) => {
    e.stopPropagation()
    dispatch(toggleFavorite('summary_note', noteId, metadata))
  }

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
        <TreeNode
          key={node.id}
          node={node}
          depth={0}
          selectedNoteId={selectedNoteId}
          selectedEmptyNodeId={selectedEmptyNodeId}
          nodeNotes={nodeNotes}
          expandedNodes={expandedNodes}
          loadingNodeIds={loadingNodeIds}
          childrenMap={childrenMap}
          childrenPagination={childrenPagination}
          favoritedIds={favoritedSummaryNoteIds}
          onToggleNode={onToggleNode}
          onToggleFavorite={handleToggleFavorite}
          onLoadMoreChildren={onLoadMoreChildren}
        />
      ))}
    </SectionBlock>
  )
}
