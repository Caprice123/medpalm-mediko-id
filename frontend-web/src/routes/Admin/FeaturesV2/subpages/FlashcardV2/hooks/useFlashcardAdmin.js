import { useState } from 'react'

export function useFlashcardAdmin() {
  const [selectedNode, setSelectedNode] = useState(null)
  const [view, setView] = useState('topics') // 'topics' | 'unlinked'

  const handleBack = () => setSelectedNode(null)
  const handleViewUnlinked = () => setView('unlinked')
  const handleViewTopics = () => setView('topics')

  return {
    selectedNode, setSelectedNode,
    view,
    handleBack, handleViewUnlinked, handleViewTopics,
  }
}
