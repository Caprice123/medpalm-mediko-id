import { useState, useEffect, useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchUserOsceTopics, createOsceSession } from '@store/oscePractice/userAction'
import { fetchTags } from '@store/tags/userAction'
import { actions as tagActions } from '@store/tags/reducer'
import { OscePracticeRoute } from '../../../routes'

export const useTopicSelection = () => {
  const { userTopics, loading, topicsPagination } = useSelector(state => state.oscePractice)
  const { tags } = useSelector(state => state.tags)
  const [searchQuery, setSearchQuery] = useState('')
  const [topicTag, setTopicTag] = useState('')
  const [batchTag, setBatchTag] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const topicTags = useMemo(() => {
    return tags?.find(tag => tag.name === 'topic')?.tags?.map((tag) => ({ label: tag.name, value: tag.id })) || []
  }, [tags])

  const batchTags = useMemo(() => {
    return tags?.find(tag => tag.name === 'batch')?.tags?.map((tag) => ({ label: tag.name, value: tag.id })) || []
  }, [tags])

  const loadTopics = useCallback((params = {}) => {
    dispatch(fetchUserOsceTopics(params))
  }, [dispatch])

  useEffect(() => {
    dispatch(tagActions.updateFilter({ key: 'tagGroupNames', value: ['topic', 'batch'] }))
    dispatch(fetchTags())
    loadTopics({ page: 1 })
  }, [dispatch, loadTopics])

  const handleSearch = (e) => {
    if (e) e.preventDefault()
    loadTopics({ search: searchQuery, topicTag, batchTag, page: 1 })
  }

  const handleSelectTopic = async (topicId) => {
    await dispatch(createOsceSession(topicId, (session) => {
      navigate(OscePracticeRoute.preparationRoute(session.uniqueId))
    }))
  }

  const handlePageChange = (newPage) => {
    loadTopics({ search: searchQuery, topicTag, batchTag, page: newPage })
  }

  const handleBack = () => {
    navigate(OscePracticeRoute.moduleRoute)
  }

  return {
    userTopics, loading, pagination: topicsPagination,
    searchQuery, setSearchQuery,
    topicTag, setTopicTag,
    batchTag, setBatchTag,
    topicTags, batchTags,
    handleSearch, handleSelectTopic, handlePageChange, handleBack,
  }
}
