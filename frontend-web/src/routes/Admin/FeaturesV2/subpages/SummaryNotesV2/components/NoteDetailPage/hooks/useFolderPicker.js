import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createNodeRecord, deleteNodeRecord, fetchFeatureNodes, fetchNodeRecords } from '@store/featureNodes'

function buildTree(nodes, parentId = null) {
  return nodes
    .filter(n => n.parentId === parentId)
    .map(n => ({ ...n, children: buildTree(nodes, n.id) }))
}

export function useFolderPicker(note) {
  const dispatch = useDispatch()
  const { nodes, nodeRecords, loading: nodeLoading } = useSelector(s => s.featureNodes)

  useEffect(() => {
    dispatch(fetchFeatureNodes())
    dispatch(fetchNodeRecords('summary_note'))
  }, [dispatch])

  const tree = useMemo(() => buildTree(nodes), [nodes])

  const linkedIds = useMemo(() => new Set(
    nodeRecords
      .filter(r => r.recordType === 'summary_note' && r.recordId === note.id)
      .map(r => r.nodeId)
  ), [nodeRecords, note.id])

  const currentFolderName = useMemo(() => {
    if (linkedIds.size === 0) return null
    const nodeId = [...linkedIds][0]
    return nodes.find(n => n.id === nodeId)?.name || null
  }, [linkedIds, nodes])

  const handleFolderToggle = async (nodeId) => {
    const existing = nodeRecords.find(
      r => r.recordType === 'summary_note' && r.recordId === note.id && r.nodeId === nodeId
    )
    if (existing) {
      await dispatch(deleteNodeRecord(existing.id))
    } else {
      const allExisting = nodeRecords.filter(
        r => r.recordType === 'summary_note' && r.recordId === note.id
      )
      for (const rec of allExisting) {
        await dispatch(deleteNodeRecord(rec.id))
      }
      await dispatch(createNodeRecord({ nodeId, recordType: 'summary_note', recordId: note.id }))
    }
    dispatch(fetchNodeRecords('summary_note'))
  }

  return { tree, linkedIds, currentFolderName, handleFolderToggle, nodeLoading }
}
