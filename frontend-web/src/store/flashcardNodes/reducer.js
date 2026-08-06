import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  topics: [],
  subtopics: [],
  subtopicsByTopic: {},
  sessionCards: [],
  sessionIndex: 0,
  dueToday: null,
  progress: null,
  loading: {
    isFetchingTopics: false,
    isFetchingSubtopics: false,
    isStartingSession: false,
    isFetchingDueToday: false,
    isFetchingProgress: false,
    isSubmittingRating: false,
  },
}

const flashcardNodesSlice = createSlice({
  name: 'flashcardNodes',
  initialState,
  reducers: {
    setTopics(state, action) { state.topics = action.payload },
    setSubtopics(state, action) { state.subtopics = action.payload },
    setSubtopicsForTopic(state, action) {
      const { topicId, subtopics, nextCursor = null } = action.payload
      state.subtopicsByTopic[topicId] = { items: subtopics, nextCursor }
    },
    appendSubtopicsForTopic(state, action) {
      const { topicId, subtopics, nextCursor = null } = action.payload
      const existing = state.subtopicsByTopic[topicId]?.items || []
      state.subtopicsByTopic[topicId] = { items: [...existing, ...subtopics], nextCursor }
    },
    setSessionCards(state, action) { state.sessionCards = action.payload; state.sessionIndex = 0 },
    setSessionIndex(state, action) { state.sessionIndex = action.payload },
    setDueToday(state, action) { state.dueToday = action.payload },
    setProgress(state, action) { state.progress = action.payload },
    setLoading(state, action) { state.loading = { ...state.loading, ...action.payload } },
    reset() { return initialState },
  },
})

export const { actions } = flashcardNodesSlice
export default flashcardNodesSlice.reducer
