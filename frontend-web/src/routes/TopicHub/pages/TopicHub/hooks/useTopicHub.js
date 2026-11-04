import { useCallback, useEffect } from 'react'
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

  const loadTopics = useCallback(() => { dispatch(fetchUserTopics()) }, [dispatch])

  useEffect(loadTopics, [loadTopics])

  return {
    lastTopic: getLastTopic(),
    error,
    isLoading,
    // Each section hides itself when it has no topics, so with both empty the
    // page would render a greeting over nothing at all. The page answers that
    // case; the sections only answer their own.
    isEmpty: !isLoading && !error && primary.length === 0 && special.length === 0,
    retry: loadTopics,
  }
}
