import { useDispatch, useSelector } from 'react-redux'
import { PiCaretRight, PiCircleNotch, PiFileText, PiStar, PiStarFill } from 'react-icons/pi'
import { toggleFavorite } from '@store/favorites/userAction'
import { FavoriteButton } from '../../NotesSidebar.styles'
import { useTreeNode } from './hooks/useTreeNode'
import { NodeRow, NodeGlyph, NodeLabel, HintRow } from './TreeNode.styles'

// Layer 1 = topic (a folder, always has subtopic children). Layer 2 = subtopic
// (always a leaf, bound to at most one summary note). That is a fixed, app-wide
// convention, so folder vs. article is known from `node.layer` alone — no fetch
// needed to decide which affordance to draw.
export default function TreeNode({
  node, depth,
  selectedNoteId, selectedEmptyNodeId,
  expandedNodes, onToggleNode, onLoadMoreChildren,
}) {
  const dispatch = useDispatch()
  const children = useSelector(s => s.summaryNotesV2.nodeChildren[node.id])
  const pagination = useSelector(s => s.summaryNotesV2.nodeChildrenPagination[node.id])
  const isNodeLoading = useSelector(s => s.summaryNotesV2.loadingNodeIds.includes(node.id))
  const nodeData = useSelector(s => s.summaryNotesV2.nodeNotes[node.id])

  const isLeaf = node.layer !== 1
  const isOpen = !isLeaf && expandedNodes.has(node.id)
  const childrenLoaded = Array.isArray(children)
  const notes = nodeData?.notes || []

  const note = isLeaf && nodeData?.isLoaded && notes.length > 0 ? notes[0] : null
  const isKnownEmpty = isLeaf && nodeData?.isLoaded && notes.length === 0
  const isSelected = (!!note && note.uniqueId === selectedNoteId)
    || (isKnownEmpty && node.id === selectedEmptyNodeId)

  const isFavorited = useSelector(s => (
    note ? (s.favorites.favoritedIds['summary_note'] || []).includes(note.id) : false
  ))

  const canLoadMore = isOpen && childrenLoaded && pagination?.isLastPage === false && !isNodeLoading
  const { rowRef, loadMoreRef } = useTreeNode({
    isSelected, canLoadMore, nodeId: node.id, onLoadMoreChildren,
  })

  const handleToggleFavorite = (event) => {
    event.stopPropagation()
    dispatch(toggleFavorite('summary_note', note.id, {
      uniqueId: note.uniqueId,
      title: note.title,
    }))
  }

  const renderGlyph = () => {
    if (isLeaf) return <NodeGlyph $selected={isSelected}><PiFileText /></NodeGlyph>
    if (isNodeLoading && !childrenLoaded) return <NodeGlyph $chevron $spinning><PiCircleNotch /></NodeGlyph>
    return <NodeGlyph $chevron $open={isOpen} $selected={isSelected}><PiCaretRight /></NodeGlyph>
  }

  return (
    <>
      <NodeRow
        ref={rowRef}
        $depth={depth}
        $selected={isSelected}
        onClick={() => onToggleNode(node)}
      >
        {renderGlyph()}
        <NodeLabel $selected={isSelected} title={node.name}>{node.name}</NodeLabel>
        {note && (
          <FavoriteButton
            $active={isFavorited}
            $alwaysVisible={isFavorited}
            onClick={handleToggleFavorite}
            title={isFavorited ? 'Hapus dari favorit' : 'Tambah ke favorit'}
            aria-label={isFavorited ? 'Hapus dari favorit' : 'Tambah ke favorit'}
          >
            {isFavorited ? <PiStarFill /> : <PiStar />}
          </FavoriteButton>
        )}
      </NodeRow>

      {isOpen && (
        <>
          {isNodeLoading && !childrenLoaded && (
            <HintRow $depth={depth + 1}>Memuat...</HintRow>
          )}
          {childrenLoaded && children.length === 0 && (
            <HintRow $depth={depth + 1}>Belum ada subtopik</HintRow>
          )}
          {childrenLoaded && children.map(child => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedNoteId={selectedNoteId}
              selectedEmptyNodeId={selectedEmptyNodeId}
              expandedNodes={expandedNodes}
              onToggleNode={onToggleNode}
              onLoadMoreChildren={onLoadMoreChildren}
            />
          ))}
          {canLoadMore && (
            <HintRow ref={loadMoreRef} $depth={depth + 1}>Memuat subtopik lainnya...</HintRow>
          )}
        </>
      )}
    </>
  )
}
