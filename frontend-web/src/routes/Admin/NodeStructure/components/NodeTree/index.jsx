import { useState } from 'react'
import {
  TreeContainer, NodeRow, NodeLeft, Chevron, NodeIcon,
  NodeName, NodeSlug, TypeBadge, NodeActions, ActionBtn,
} from './NodeTree.styles'

const NODE_TYPE_LABELS = {
  department: 'Dept',
  topic: 'Topik',
  subtopic: 'Sub',
}

const NODE_ICONS = {
  department: '🗂️',
  topic: '📁',
  subtopic: '📄',
}

function buildTree(nodes) {
  const map = {}
  const roots = []
  nodes.forEach(n => { map[n.id] = { ...n, _children: [] } })
  nodes.forEach(n => {
    if (n.parentId && map[n.parentId]) {
      map[n.parentId]._children.push(map[n.id])
    } else {
      roots.push(map[n.id])
    }
  })
  return roots
}

function NodeItem({ node, depth, onEdit, onAddChild, onDelete }) {
  const [open, setOpen] = useState(depth === 0)
  const hasChildren = node._children.length > 0

  return (
    <>
      <NodeRow $depth={depth} onClick={() => hasChildren && setOpen(o => !o)}>
        <NodeLeft>
          <Chevron $open={open} $hasChildren={hasChildren}>▶</Chevron>
          <NodeIcon>{NODE_ICONS[node.nodeType] ?? '📄'}</NodeIcon>
          <NodeName $depth={depth}>{node.name}</NodeName>
          <NodeSlug>/{node.slug}</NodeSlug>
          {node.nodeType && (
            <TypeBadge $type={node.nodeType}>
              {NODE_TYPE_LABELS[node.nodeType] ?? node.nodeType}
            </TypeBadge>
          )}
        </NodeLeft>
        <NodeActions onClick={e => e.stopPropagation()}>
          <ActionBtn onClick={() => onAddChild(node)}>+ Sub-node</ActionBtn>
          <ActionBtn onClick={() => onEdit(node)}>Edit</ActionBtn>
          <ActionBtn $danger onClick={() => onDelete(node)}>Hapus</ActionBtn>
        </NodeActions>
      </NodeRow>

      {open && node._children.map(child => (
        <NodeItem
          key={child.id}
          node={child}
          depth={depth + 1}
          onEdit={onEdit}
          onAddChild={onAddChild}
          onDelete={onDelete}
        />
      ))}
    </>
  )
}

function NodeTree({ nodes, onEdit, onAddChild, onDelete }) {
  const tree = buildTree(nodes)

  return (
    <TreeContainer>
      {tree.map(root => (
        <NodeItem
          key={root.id}
          node={root}
          depth={0}
          onEdit={onEdit}
          onAddChild={onAddChild}
          onDelete={onDelete}
        />
      ))}
    </TreeContainer>
  )
}

export default NodeTree
