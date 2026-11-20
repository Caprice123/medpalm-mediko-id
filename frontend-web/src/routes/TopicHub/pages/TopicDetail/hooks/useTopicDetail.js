import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUserSubtopics, fetchUserTopicBySlug, fetchTopicAtlasModels } from '@store/featureNodes'

export function useTopicDetail() {
  const { topicSlug } = useParams()
  const dispatch = useDispatch()
  const topic = useSelector(s => s.featureNodes.topic)
  const error = useSelector(s => s.featureNodes.errors.topicDetail)
  // The page owns the query because it owns the request: the subtopic list is
  // filtered by the API, and SubtopicsSection renders what comes back. What is
  // typed and what was asked for are kept apart — the request follows the
  // second, so typing costs nothing until it is submitted.
  const [subtopicSearch, setSubtopicSearch] = useState('')
  // Stamped with the slug it was typed for. The page survives a move from one
  // topic to the next, and a plain string here would spend one request on the
  // previous topic's query before any reset could land.
  const [applied, setApplied] = useState({ slug: topicSlug, query: '' })
  const appliedSubtopicSearch = applied.slug === topicSlug ? applied.query : ''

  const loadSubtopics = useCallback(() => {
    dispatch(fetchUserSubtopics(topicSlug, { search: appliedSubtopicSearch }))
  }, [dispatch, topicSlug, appliedSubtopicSearch])

  // Split from the subtopic fetch: a submitted search re-queries the list, and
  // the topic's own name and description do not change with it.
  useEffect(() => { dispatch(fetchUserTopicBySlug(topicSlug)) }, [dispatch, topicSlug])

  useEffect(loadSubtopics, [loadSubtopics])

  // The applied query answers for itself above; the field is what is left to
  // empty, so the student does not read the previous topic's words over this
  // topic's full list.
  useEffect(() => { setSubtopicSearch('') }, [topicSlug])

  const submitSubtopicSearch = useCallback(() => {
    setApplied({ slug: topicSlug, query: subtopicSearch.trim() })
  }, [topicSlug, subtopicSearch])

  const clearSubtopicSearch = useCallback(() => {
    setSubtopicSearch('')
    setApplied({ slug: topicSlug, query: '' })
  }, [topicSlug])

  useEffect(() => {
    if (!topic?.id) return
    dispatch(fetchTopicAtlasModels(topic.id))
  }, [dispatch, topic?.id])

  const retry = useCallback(() => {
    dispatch(fetchUserTopicBySlug(topicSlug))
    loadSubtopics()
  }, [dispatch, topicSlug, loadSubtopics])

  return {
    topicSlug,
    topic,
    error,
    retry,
    subtopicSearch,
    setSubtopicSearch,
    submitSubtopicSearch,
    clearSubtopicSearch,
    appliedSubtopicSearch,
  }
}
