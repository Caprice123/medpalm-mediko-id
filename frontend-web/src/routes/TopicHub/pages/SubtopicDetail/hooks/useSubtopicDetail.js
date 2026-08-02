import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchUserSubtopicBySlug, fetchUserTopicBySlug, fetchUserTopics,
  fetchUserSubtopics, fetchNodeStats, fetchNodeAtlasModelRelations,
} from '@store/featureNodes'
import { checkFeatureLock } from '../utils/checkFeatureLock'

export function useSubtopicDetail() {
  const { topicSlug, subtopicSlug } = useParams()
  const dispatch = useDispatch()
  const { userTopics } = useSelector(s => s.featureNodes)
  const { features } = useSelector(s => s.feature)
  const { userStatus } = useSelector(s => s.pricing)

  const [topic, setTopic] = useState(null)
  const [subtopic, setSubtopic] = useState(null)
  const [siblings, setSiblings] = useState([])
  const [stats, setStats] = useState(null)
  const [atlasModels, setAtlasModels] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [panelTab, setPanelTab] = useState(null)

  useEffect(() => {
    if (!userTopics.primary.length && !userTopics.special.length) {
      dispatch(fetchUserTopics())
    }
  }, [dispatch, userTopics.primary.length, userTopics.special.length])

  useEffect(() => {
    const allTopics = [...(userTopics.primary || []), ...(userTopics.special || [])]
    const cached = allTopics.find(t => t.slug === topicSlug)
    if (cached) {
      setTopic(cached)
    } else {
      dispatch(fetchUserTopicBySlug(topicSlug)).then(data => setTopic(data))
    }
  }, [dispatch, topicSlug, userTopics.primary.length, userTopics.special.length])

  useEffect(() => {
    dispatch(fetchUserSubtopics(topicSlug)).then(data => setSiblings(data || []))
  }, [dispatch, topicSlug])

  useEffect(() => {
    setIsLoading(true)
    setSubtopic(null)
    setStats(null)
    setAtlasModels([])
    dispatch(fetchUserSubtopicBySlug(subtopicSlug))
      .then(data => {
        setSubtopic(data)
        if (data?.id) dispatch(fetchNodeStats(data.id)).then(setStats)
      })
      .finally(() => setIsLoading(false))
  }, [dispatch, subtopicSlug])

  useEffect(() => {
    if (!subtopic?.id || !features.length) return
    const atlasLock = checkFeatureLock('atlas', features, userStatus)
    const anatomyLock = checkFeatureLock('anatomy', features, userStatus)
    const atlasAccessible = !atlasLock.isLocked || !anatomyLock.isLocked
    if (!atlasAccessible) return
    dispatch(fetchNodeAtlasModelRelations(subtopicSlug)).then(setAtlasModels)
  }, [dispatch, subtopic?.id, subtopicSlug, features, userStatus])

  const currentIndex = siblings.findIndex(s => s.slug === subtopicSlug)
  const prevSubtopic = currentIndex > 0 ? siblings[currentIndex - 1] : null
  const nextSubtopic = currentIndex >= 0 && currentIndex < siblings.length - 1 ? siblings[currentIndex + 1] : null
  const embedSrc = subtopic?.videoEmbedUrl ?? null

  return {
    topicSlug, subtopicSlug,
    topic, subtopic, siblings, stats, atlasModels, isLoading,
    panelTab, setPanelTab,
    currentIndex, prevSubtopic, nextSubtopic, embedSrc,
  }
}
