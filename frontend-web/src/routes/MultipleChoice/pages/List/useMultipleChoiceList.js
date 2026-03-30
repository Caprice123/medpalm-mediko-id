import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMcqTopics } from '@store/mcq/userAction'
import { fetchTags } from '@store/tags/userAction'
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
  const semesters = tags.find((tag) => tag.name === "semester")?.tags || []

  return {
    // State
    filteredTopics: topics,
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
