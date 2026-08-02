import { useState } from 'react'
import { useSelector } from 'react-redux'

export function useTopicListSection() {
  const { topics, loading } = useSelector(s => s.mcqNodes)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTopics = searchQuery.trim()
    ? topics.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : topics

  return {
    topics,
    filteredTopics,
    isLoading: loading.isFetchingTopics,
    searchQuery,
    setSearchQuery,
  }
}
