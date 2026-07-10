import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import { createNodeRecord, deleteNodeRecord, fetchNodeRecords } from '@store/featureNodes'
import { TreePickerWrapper, TreePickerRow } from '../../FlashcardV2.styles'

function buildTree(nodes) {
  const map = {}
  const roots = []
  nodes.forEach(n => { map[n.id] = { ...n, _children: [] } })
  nodes.forEach(n => {
    if (n.parentId && map[n.parentId]) map[n.parentId]._children.push(map[n.id])
    else roots.push(map[n.id])
  })
  return roots
}

function TreeRow({ node, depth, assignedIds, onToggle }) {
  const [open, setOpen] = useState(depth === 0)
  const isAssigned = assignedIds.has(node.id)

  return (
    <>
      <TreePickerRow
        $depth={depth}
        $selected={isAssigned}
        onClick={() => onToggle(node)}
      >
        {node._children.length > 0 && (
          <span
            style={{ fontSize: '0.65rem', color: '#9ca3af', cursor: 'pointer' }}
            onClick={e => { e.stopPropagation(); setOpen(o => !o) }}
          >
            {open ? '▼' : '▶'}
          </span>
        )}
        <span>{node.name}</span>
        <span style={{ fontSize: '0.7rem', color: '#9ca3af', fontFamily: 'monospace' }}>/{node.slug}</span>
        {isAssigned && <span style={{ marginLeft: 'auto', fontSize: '0.75rem' }}>✓</span>}
      </TreePickerRow>
      {open && node._children.map(child => (
        <TreeRow key={child.id} node={child} depth={depth + 1} assignedIds={assignedIds} onToggle={onToggle} />
      ))}
    </>
  )
}

function AssignNodeModal({ deck, assignedRecords, onClose }) {
  const dispatch = useDispatch()
  const { nodes, loading } = useSelector(state => state.featureNodes)

  const assignedIds = new Set(assignedRecords.map(r => r.nodeId))
  const recordByNodeId = Object.fromEntries(assignedRecords.map(r => [r.nodeId, r]))

  const handleToggle = (node) => {
    if (assignedIds.has(node.id)) {
      const record = recordByNodeId[node.id]
      if (!record) return
      dispatch(deleteNodeRecord(record.id, () => dispatch(fetchNodeRecords('flashcard_deck'))))
    } else {
      dispatch(createNodeRecord(
        { nodeId: node.id, recordType: 'flashcard_deck', recordId: deck.id },
        () => dispatch(fetchNodeRecords('flashcard_deck'))
      ))
    }
  }

  const tree = buildTree(nodes)

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={`Assign Node — ${deck.title}`}
      size="medium"
      footer={<Button variant="primary" onClick={onClose}>Selesai</Button>}
    >
      <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '0.75rem' }}>
        Klik node untuk assign/unassign. Node yang sudah ter-assign ditandai ✓.
      </p>
      <TreePickerWrapper>
        {tree.length === 0 ? (
          <p style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>
            Belum ada node. Buat dulu di tab "Struktur Folder".
          </p>
        ) : tree.map(root => (
          <TreeRow
            key={root.id}
            node={root}
            depth={0}
            assignedIds={assignedIds}
            onToggle={handleToggle}
          />
        ))}
      </TreePickerWrapper>
    </Modal>
  )
}

export default AssignNodeModal
