import { useState } from 'react'
import { useSelector } from 'react-redux'

export function useTopicsSection() {
  const { topics, subtopicsByTopic, progress, loading } = useSelector(s => s.flashcardNodes)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTopics = searchQuery.trim()
    ? topics.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : topics

  const statsMap = new Map((progress?.topics || []).map(t => [t.nodeId, t]))

  return {
    topics,
    filteredTopics,
    subtopicsByTopic,
    statsMap,
    isLoading: loading.isFetchingTopics,
    searchQuery,
    setSearchQuery,
  }
}
