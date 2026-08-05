import { useState } from 'react'

export function useDiagnosticV2Admin() {
  // path = [{id, name, layer}, ...]  — 0 items = topics, 1 item = subtopics, 2 items = questions
  const [path, setPath] = useState([])
  const [showUnlinked, setShowUnlinked] = useState(false)

  const currentLayer = path.length + 1
  const parentNode = path.length > 0 ? path[path.length - 1] : null
  const inQuestions = path.length === 2

  const navigate = (node) => setPath(prev => [...prev, node])
  const navigateTo = (index) => setPath(prev => prev.slice(0, index))
  const navigateToRoot = () => setPath([])
  const handleViewUnlinked = () => setShowUnlinked(true)
  const handleViewTopics = () => setShowUnlinked(false)

  return {
    path, currentLayer, parentNode, inQuestions, showUnlinked,
    navigate, navigateTo, navigateToRoot, handleViewUnlinked, handleViewTopics,
  }
}
