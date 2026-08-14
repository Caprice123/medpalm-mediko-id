import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchFilteredNodes } from '@store/featureNodes'
import { fetchSummaryNotesByNode } from '@store/summaryNotes/adminAction'

export function useSummaryNoteTreePicker({ onSelect }) {
  const dispatch = useDispatch()

  const [view, setView] = useState('topics')
  const [nodes, setNodes] = useState([])
  const [loadingNodes, setLoadingNodes] = useState(false)
  const [currentTopic, setCurrentTopic] = useState(null)
  const [resolvingNodeId, setResolvingNodeId] = useState(null)

  const loadTopics = async () => {
    setLoadingNodes(true)
    try {
      const data = await dispatch(fetchFilteredNodes({ layer: '1', visibility: 'general' }))
      setNodes(data)
    } finally {
      setLoadingNodes(false)
    }
  }

  useEffect(() => { loadTopics() }, [])

  const openTopic = async (topic) => {
    setCurrentTopic(topic)
    setView('subtopics')
    setLoadingNodes(true)
    try {
      const data = await dispatch(fetchFilteredNodes({ layer: '2', parentId: topic.id, nodeType: 'subtopic', visibility: 'general', hasRecordType: 'summary_note' }))
      setNodes(data)
    } finally {
      setLoadingNodes(false)
    }
  }

  const backToTopics = () => {
    setCurrentTopic(null)
    setView('topics')
    loadTopics()
  }

  // Each subtopic has at most one summary note, so selecting it resolves straight to that note.
  const selectSubtopic = async (subtopic) => {
    setResolvingNodeId(subtopic.id)
    try {
      const notes = await dispatch(fetchSummaryNotesByNode(subtopic.id))
      if (!notes.length) {
        alert('Sub-topik ini belum memiliki ringkasan')
        return
      }
      onSelect({ value: notes[0].id, label: notes[0].title })
    } finally {
      setResolvingNodeId(null)
    }
  }

  return {
    view, nodes, loadingNodes, currentTopic, resolvingNodeId,
    openTopic, backToTopics, selectSubtopic,
  }
}
