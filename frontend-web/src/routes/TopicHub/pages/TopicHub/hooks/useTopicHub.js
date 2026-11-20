import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUserTopics } from '@store/featureNodes'

const LAST_TOPIC_KEY = 'topichub_last_topic'

export function saveLastTopic(topic) {
  try {
    localStorage.setItem(LAST_TOPIC_KEY, JSON.stringify({
      slug: topic.slug,
      name: topic.name,
      icon: topic.icon ?? null,
      description: topic.description ?? null,
    }))
  } catch {}
}

export function getLastTopic() {
  try {
    return JSON.parse(localStorage.getItem(LAST_TOPIC_KEY) || 'null')
  } catch { return null }
}

export function useTopicHub() {
  const dispatch = useDispatch()
  // One request fills both sections, so one failure covers the whole page —
  // the error belongs here rather than inside each section, which would
  // otherwise show the student the same message twice.
  const error = useSelector(s => s.featureNodes.errors.userTopics)
  const isLoading = useSelector(s => s.featureNodes.loading.isFetchingUserTopics)
  const { primary, special } = useSelector(s => s.featureNodes.userTopics)
  // Two values, not one: searchQuery is what is typed, appliedQuery is what the
  // API was actually asked for. The request follows the second, so typing costs
  // nothing until it is submitted — and the empty states below stay truthful
  // about the list on screen while the field says something else.
  const [searchQuery, setSearchQuery] = useState('')
  const [appliedQuery, setAppliedQuery] = useState('')

  const loadTopics = useCallback(() => {
    dispatch(fetchUserTopics({ search: appliedQuery }))
  }, [dispatch, appliedQuery])

  useEffect(loadTopics, [loadTopics])

  const submitSearch = useCallback(() => { setAppliedQuery(searchQuery.trim()) }, [searchQuery])

  const clearSearch = useCallback(() => {
    setSearchQuery('')
    setAppliedQuery('')
  }, [])

  return {
    lastTopic: getLastTopic(),
    error,
    isLoading,
    searchQuery,
    setSearchQuery,
    submitSearch,
    clearSearch,
    // Each section hides itself when it has no topics, so with both empty the
    // page would render a greeting over nothing at all. The page answers that
    // case; the sections only answer their own.
    isEmpty: !isLoading && !error && !appliedQuery && primary.length === 0 && special.length === 0,
    // Same reason, one step further: with a query on, both sections can hide
    // while the hub itself does hold topics — that is a failed search, not an
    // empty hub, and it needs its own message plus a way back out.
    isNotFound: !isLoading && !error && !!appliedQuery && primary.length === 0 && special.length === 0,
    appliedQuery,
    retry: loadTopics,
  }
}
