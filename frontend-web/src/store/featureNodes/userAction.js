import { actions } from './reducer'
import Endpoints from '@config/endpoint'
import { getWithToken } from '@utils/requestUtils'

const { setUserTopics, setTopic, setSubtopics, setAtlasGroups, setLoading } = actions

export const fetchUserTopics = () => async (dispatch) => {
  try {
    dispatch(setLoading({ isFetchingUserTopics: true }))
    const [primaryRes, specialRes] = await Promise.all([
      getWithToken(Endpoints.api.featureNodes, { visibility: 'general', layer: 1, nodeType: 'topic', hasContent: true, classification: 'sistem_blok', perPage: 100 }),
      getWithToken(Endpoints.api.featureNodes, { visibility: 'general', layer: 1, nodeType: 'topic', hasContent: true, classification: 'ilmu_lintas_sistem', perPage: 100 }),
    ])
    dispatch(setUserTopics({
      primary: primaryRes.data.data || [],
      special: specialRes.data.data || [],
    }))
  } finally {
    dispatch(setLoading({ isFetchingUserTopics: false }))
  }
}

export const fetchUserSubtopics = (parentSlug) => async (dispatch) => {
  try {
    dispatch(setLoading({ isFetchingSubtopics: true }))
    const res = await getWithToken(Endpoints.api.featureNodes, { parentSlug, layer: 2, nodeType: 'subtopic', hasContent: true, perPage: 100 })
    const subtopics = res.data.data || []
    dispatch(setSubtopics(subtopics))
    return subtopics
  } finally {
    dispatch(setLoading({ isFetchingSubtopics: false }))
  }
}

export const fetchUserTopicBySlug = (slug) => async (dispatch) => {
  const res = await getWithToken(Endpoints.api.featureNodes, { slug, layer: 1, nodeType: 'topic', perPage: 1 })
  const topic = (res.data.data || [])[0] ?? null
  dispatch(setTopic(topic))
  return topic
}

export const fetchUserNodeById = (id) => async () => {
  const res = await getWithToken(Endpoints.api.featureNodes, { id, perPage: 1 })
  return (res.data.data || [])[0] ?? null
}

export const fetchUserNodeBySlug = (slug) => async () => {
  const res = await getWithToken(Endpoints.api.featureNodes, { slug, perPage: 1 })
  return (res.data.data || [])[0] ?? null
}

export const fetchUserNodeByName = (name) => async () => {
  const res = await getWithToken(Endpoints.api.featureNodes, { name, layer: 2, nodeType: 'subtopic', perPage: 1 })
  return (res.data.data || [])[0] ?? null
}

export const fetchUserSubtopicBySlug = (slug) => async () => {
  const res = await getWithToken(Endpoints.api.featureNodes, { slug, layer: 2, nodeType: 'subtopic', perPage: 1, hasContent: true, includeAdjacent: true })
  return (res.data.data || [])[0] ?? null
}

export const fetchNodeStats = (nodeId) => async () => {
  const res = await getWithToken(Endpoints.api.featureNodeStats(nodeId))
  return res.data.data
}

export const fetchNodePreview = (nodeId, type) => async () => {
  const res = await getWithToken(Endpoints.api.featureNodePreview(nodeId), { type })
  return res.data.data
}

export const fetchTopicAtlasModels = (topicId) => async (dispatch) => {
  const res = await getWithToken(Endpoints.api.featureNodeTopicAtlasModels(topicId))
  const atlasGroups = res.data.data || []
  dispatch(setAtlasGroups(atlasGroups))
  return atlasGroups
}

// node (subtopic) ↔ atlas model content_relations
export const fetchNodeAtlasModelRelations = (slug) => async () => {
  const res = await getWithToken(Endpoints.api.contentRelationsV2, {
    sourceType: 'feature_node', sourceUniqueId: slug, targetType: 'atlas_model',
  })
  return res.data.data || []
}
