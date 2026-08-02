import { useState } from 'react'
import { useSelector } from 'react-redux'

export function useTopicGroupSection(classification) {
  const { primaryTopics, specialTopics, subtopicsByTopic, progress, loading } = useSelector(s => s.diagnosticNodes)
  const topics = classification === 'special' ? specialTopics : primaryTopics
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTopics = searchQuery.trim()
    ? topics.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : topics

  const statsMap = new Map((progress?.topics || []).map(t => [t.nodeId, t]))

  return {
    filteredTopics,
    subtopicsByTopic,
    statsMap,
    isLoading: loading.isFetchingCategories,
    searchQuery,
    setSearchQuery,
  }
}
