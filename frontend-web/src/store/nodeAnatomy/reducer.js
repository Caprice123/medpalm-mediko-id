import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  quizzes: [],
  pagination: { page: 1, perPage: 20, isLastPage: false },
  loading: { isFetchingQuizzes: false, isUnlinkingQuiz: false, isUpdatingQuiz: false, isMovingQuiz: false, isSwappingOrder: false },
}

const nodeAnatomySlice = createSlice({
  name: 'nodeAnatomy',
  initialState,
  reducers: {
    setQuizzes(state, action) { state.quizzes = action.payload },
    appendQuizzes(state, action) { state.quizzes = [...state.quizzes, ...action.payload] },
    setPagination(state, action) { state.pagination = { ...state.pagination, ...action.payload } },
    setLoading(state, action) { state.loading = { ...state.loading, ...action.payload } },
    reset() { return initialState },
  },
})

export const { actions } = nodeAnatomySlice
export default nodeAnatomySlice.reducer
