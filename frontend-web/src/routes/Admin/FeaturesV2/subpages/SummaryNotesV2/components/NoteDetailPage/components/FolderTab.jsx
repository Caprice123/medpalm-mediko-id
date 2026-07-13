import { useState } from 'react'
import { useFolderPicker } from '../hooks/useFolderPicker'
import {
  FolderPickerWrap, FolderPickerEmpty, FolderStatusRow,
  PickerNode, PickerChevron, PickerIcon, PickerName, PickerCheck,
} from '../NoteDetailPage.styles'

function FolderPickerNode({ node, depth, linkedIds, onToggle }) {
  const [open, setOpen] = useState(true)
  const hasChildren = node.children?.length > 0
  const isLinked = linkedIds.has(node.id)

  return (
    <>
      <PickerNode $depth={depth} $linked={isLinked} onClick={() => onToggle(node.id)}>
        {hasChildren ? (
          <PickerChevron
            $open={open}
            onClick={e => { e.stopPropagation(); setOpen(p => !p) }}
          >▶</PickerChevron>
        ) : (
          <span style={{ width: '0.875rem', flexShrink: 0 }} />
        )}
        <PickerIcon>{hasChildren ? '📚' : '📁'}</PickerIcon>
        <PickerName>{node.name}</PickerName>
        {isLinked && <PickerCheck>✓</PickerCheck>}
      </PickerNode>
      {open && hasChildren && node.children.map(child => (
        <FolderPickerNode
          key={child.id}
          node={child}
          depth={depth + 1}
          linkedIds={linkedIds}
          onToggle={onToggle}
        />
      ))}
    </>
  )
}

function FolderTab({ note }) {
  const { tree, linkedIds, currentFolderName, handleFolderToggle, nodeLoading } = useFolderPicker(note)

  if (nodeLoading.isFetchingNodes) {
    return <FolderPickerEmpty>Memuat folder...</FolderPickerEmpty>
  }

  if (tree.length === 0) {
    return <FolderPickerEmpty>Belum ada folder.</FolderPickerEmpty>
  }

  return (
    <>
      <FolderPickerWrap>
        {tree.map(node => (
          <FolderPickerNode
            key={node.id}
            node={node}
            depth={0}
            linkedIds={linkedIds}
            onToggle={handleFolderToggle}
          />
        ))}
      </FolderPickerWrap>
      <FolderStatusRow>
        {linkedIds.size === 0
          ? '📋 Belum ada folder dipilih'
          : `📁 Folder: ${currentFolderName}`}
      </FolderStatusRow>
    </>
  )
}

export default FolderTab
