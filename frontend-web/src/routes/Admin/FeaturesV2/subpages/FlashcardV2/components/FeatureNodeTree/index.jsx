import {
  NodeRow, NodeLeft, NodeName, NodeSlug, TypeBadge,
  NodeActions, ActionBtn, NodeIndent,
} from './FeatureNodeTree.styles'

const NODE_TYPE_LABELS = {
  department: 'Departemen',
  topic: 'Topik',
  subtopic: 'Sub-topik',
}

function buildTree(nodes) {
  const map = {}
  const roots = []

  nodes.forEach(n => { map[n.id] = { ...n, _children: [] } })
  nodes.forEach(n => {
    if (n.parentId) {
      map[n.parentId]?._children.push(map[n.id])
    } else {
      roots.push(map[n.id])
    }
  })

  return roots
}

function NodeItem({ node, depth, onEdit, onAddChild, onDelete }) {
  return (
    <>
      <NodeRow $depth={depth}>
        <NodeLeft>
          {depth > 0 && <NodeIndent>{'└─'}</NodeIndent>}
          <NodeName $depth={depth}>{node.name}</NodeName>
          <NodeSlug>{node.slug}</NodeSlug>
          {node.nodeType && (
            <TypeBadge $type={node.nodeType}>
              {NODE_TYPE_LABELS[node.nodeType] ?? node.nodeType}
            </TypeBadge>
          )}
        </NodeLeft>
        <NodeActions>
          <ActionBtn onClick={() => onAddChild(node)}>+ Sub-node</ActionBtn>
          <ActionBtn onClick={() => onEdit(node)}>Edit</ActionBtn>
          <ActionBtn $danger onClick={() => onDelete(node)}>Hapus</ActionBtn>
        </NodeActions>
      </NodeRow>
      {node._children.map(child => (
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

function FeatureNodeTree({ nodes, onEdit, onAddChild, onDelete }) {
  const tree = buildTree(nodes)

  return (
    <>
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
    </>
  )
}

export default FeatureNodeTree
