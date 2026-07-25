import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  questions: [],
  pagination: { page: 1, perPage: 20, isLastPage: false },
  loading: {
    isFetchingQuestions: false,
    isUpdatingQuestion: false,
    isDeletingQuestion: false,
    isAssigningQuestion: false,
  },
}

const unlinkedQuestionsSlice = createSlice({
  name: 'unlinkedQuestions',
  initialState,
  reducers: {
    setQuestions(state, action) { state.questions = action.payload },
    setPagination(state, action) { state.pagination = { ...state.pagination, ...action.payload } },
    setLoading(state, action) { state.loading = { ...state.loading, ...action.payload } },
    reset() { return initialState },
  },
})

export const { actions } = unlinkedQuestionsSlice
export default unlinkedQuestionsSlice.reducer
