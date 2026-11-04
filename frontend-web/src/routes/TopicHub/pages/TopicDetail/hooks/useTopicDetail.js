import { useCallback, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUserSubtopics, fetchUserTopicBySlug, fetchTopicAtlasModels } from '@store/featureNodes'

export function useTopicDetail() {
  const { topicSlug } = useParams()
  const dispatch = useDispatch()
  const topic = useSelector(s => s.featureNodes.topic)
  const error = useSelector(s => s.featureNodes.errors.topicDetail)

  const load = useCallback(() => {
    dispatch(fetchUserTopicBySlug(topicSlug))
    dispatch(fetchUserSubtopics(topicSlug))
  }, [dispatch, topicSlug])

  useEffect(load, [load])

  useEffect(() => {
    if (!topic?.id) return
    dispatch(fetchTopicAtlasModels(topic.id))
  }, [dispatch, topic?.id])

  return { topicSlug, topic, error, retry: load }
}
