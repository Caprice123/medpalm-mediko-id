import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMcqTopics } from '@store/mcq/action'
import { fetchTags } from '@store/tags/action'
import { actions as tagActions } from '@store/tags/reducer'
import { actions } from '@store/mcq/reducer'

export const useMultipleChoiceList = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { topics, loading, pagination } = useSelector(state => state.mcq)
  const { tags } = useSelector(state => state.tags)

  const [filters, setFilters] = useState({
    university: '',
    semester: ''
  })

  useEffect(() => {
    dispatch(fetchMcqTopics())
    dispatch(tagActions.updateFilter({ key: "tagGroupNames", value: ["topic", "department", "university", "semester"]}))
    dispatch(fetchTags())
  }, [dispatch])

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  const handleSelectMode = (topicId, mode) => {
    navigate(`/multiple-choice/${topicId}?mode=${mode}`)
  }

  const handlePageChange = (page) => {
    dispatch(actions.setPage(page))
    dispatch(fetchMcqTopics())
  }

  // Get tag groups
  const universities = tags.find((tag) => tag.name === "university")?.tags || []
  const universityGroupId = tags.find((tag) => tag.name === "university")?.id

  const semesterGroupId = tags.find((tag) => tag.name === "semester")?.id
  const semesters = tags.find((tag) => tag.name === "semester")?.tags || []

  // Filter topics based on selected filters and only show published topics
  const filteredTopics = topics.filter(topic => {
    // Only show published topics
    if (topic.status !== 'published') return false

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      const titleMatch = topic.title?.toLowerCase().includes(searchLower)
      const descMatch = topic.description?.toLowerCase().includes(searchLower)
      if (!titleMatch && !descMatch) return false
    }

    // University filter - check by ID
    const universityMatch = !filters.university ||
      topic.tags?.some(tag => tag.tagGroupId === universityGroupId && tag.id === filters.university)

    // Semester filter - check by ID
    const semesterMatch = !filters.semester ||
      topic.tags?.some(tag => tag.tagGroupId === semesterGroupId && tag.id === filters.semester)

    return universityMatch && semesterMatch
  })

  return {
    // State
    filteredTopics,
    loading,
    filters,
    universities,
    semesters,
    pagination,

    // Handlers
    handleFilterChange,
    handleSelectMode,
    handlePageChange
  }
}
