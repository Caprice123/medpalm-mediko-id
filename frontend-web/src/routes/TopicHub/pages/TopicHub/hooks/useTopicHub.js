import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
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

  useEffect(() => {
    dispatch(fetchUserTopics())
  }, [dispatch])

  return {
    lastTopic: getLastTopic(),
  }
}
