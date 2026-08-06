import { actions } from './reducer'
import Endpoints from '@config/endpoint'
import { getWithToken } from '@utils/requestUtils'
import { fetchNodeStats } from '@store/featureNodes'

const NOTES_PER_PAGE = 20
const LIST_PAGE_LIMIT = 50

// The backend stays paginated (bounded per-request), but the sidebar's topic list needs
// the complete set — so page through here rather than truncating at a single page.
async function fetchAllSummaryNoteTopics(classification) {
  const topics = []
  let page = 1
  for (;;) {
    const res = await getWithToken(Endpoints.api.summaryNotesV2Topics, { classification, page, perPage: LIST_PAGE_LIMIT })
    topics.push(...(res.data.data?.topics || []))
    if (res.data.data?.pagination?.isLastPage ?? true) break
    page += 1
  }
  return topics
}

// Root-level topics, split by classification, into state.userTopics.
// Only returns topics whose subtopics actually have a summary note (backend-filtered).
export const fetchSummaryNoteTopics = () => async (dispatch) => {
  try {
    dispatch(actions.setLoading({ isFetchingUserTopics: true }))
    const [primary, special] = await Promise.all([
      fetchAllSummaryNoteTopics('sistem_blok'),
      fetchAllSummaryNoteTopics('ilmu_lintas_sistem'),
    ])
    const userTopics = { primary, special }
    dispatch(actions.setUserTopics(userTopics))
    return userTopics
  } finally {
    dispatch(actions.setLoading({ isFetchingUserTopics: false }))
  }
}

// Returns { data, pagination } — for lazy tree loading of a topic's subtopics.
// Only returns subtopics that actually have a summary note (backend-filtered).
export const fetchLazyUserNodes = (parentId, page = 1) => async () => {
  const res = await getWithToken(Endpoints.api.summaryNotesV2Subtopics(parentId), { page, perPage: LIST_PAGE_LIMIT })
  return {
    data: res.data.data?.subtopics || [],
    pagination: res.data.data?.pagination || { page: 1, isLastPage: true },
  }
}

export const fetchSummaryNotesByNode = (nodeId, page = 1) => async (dispatch) => {
  try {
    dispatch(actions.setNodeNotesLoading({ nodeId, value: true, isLoadingMore: page > 1 }))
    const response = await getWithToken(Endpoints.api.summaryNotesV2, { nodeId, perPage: NOTES_PER_PAGE, page })
    const { data, pagination } = response.data
    if (page === 1) {
      dispatch(actions.setNodeNotes({ nodeId, notes: data || [], page, isLastPage: pagination.isLastPage }))
    } else {
      dispatch(actions.appendNodeNotes({ nodeId, notes: data || [], page, isLastPage: pagination.isLastPage }))
    }
    return { notes: data || [], isLastPage: pagination.isLastPage }
  } finally {
    dispatch(actions.setNodeNotesLoading({ nodeId, value: false, isLoadingMore: page > 1 }))
  }
}

export const fetchSummaryNoteDetailV2 = (uniqueId) => async (dispatch) => {
  try {
    dispatch(actions.setLoading({ isNoteDetailLoading: true }))
    dispatch(actions.setDetail(null))
    const response = await getWithToken(`${Endpoints.api.summaryNotesV2}/${uniqueId}`)
    const note = response.data.data
    dispatch(actions.setDetail(note))
    dispatch(actions.prependRecentlyViewed({
      id: `temp-${note.id}`,
      recordType: 'summary_note',
      recordId: note.id,
      metadata: { title: note.title, uniqueId: note.uniqueId },
    }))
    return note
  } finally {
    dispatch(actions.setLoading({ isNoteDetailLoading: false }))
  }
}

export const searchSummaryNotesV2 = (search) => async (dispatch) => {
  try {
    dispatch(actions.setLoading({ isSearchLoading: true }))
    const response = await getWithToken(Endpoints.api.summaryNotesV2, { search, perPage: 50 })
    dispatch(actions.setSearchResults(response.data.data || []))
  } finally {
    dispatch(actions.setLoading({ isSearchLoading: false }))
  }
}

export const fetchNoteNodeStats = (nodeId) => async (dispatch) => {
  if (!nodeId) {
    dispatch(actions.setNodeStats(null))
    return
  }
  const stats = await dispatch(fetchNodeStats(nodeId))
  dispatch(actions.setNodeStats(stats))
}

export const fetchNoteAnatomyQuizRelations = (noteUniqueId) => async (dispatch) => {
  if (!noteUniqueId) {
    dispatch(actions.setAnatomyQuizzes([]))
    return
  }
  const res = await getWithToken(Endpoints.api.userContentRelations, {
    sourceType: 'summary_note',
    sourceUniqueId: noteUniqueId,
    targetType: 'anatomy_quiz',
  })
  dispatch(actions.setAnatomyQuizzes(res.data.data || []))
}

export const fetchRecentlyViewed = () => async (dispatch) => {
  try {
    const response = await getWithToken(Endpoints.api.recentlyViewed, {
      recordType: 'summary_note',
      limit: 5
    })
    dispatch(actions.setRecentlyViewed(response.data.data || []))
  } catch {}
}
