import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  questions: [],
  pagination: {
    page: 1,
    perPage: 20,
    isLastPage: false,
  },
  loading: {
    isFetchingQuestions: false,
    isAddingQuestion: false,
    isUpdatingQuestion: false,
    isDeletingQuestion: false,
    isMovingQuestion: false,
    isImportingQuestions: false,
  },
}

const nodeQuestionsSlice = createSlice({
  name: 'nodeQuestions',
  initialState,
  reducers: {
    setQuestions(state, action) { state.questions = action.payload },
    setPagination(state, action) { state.pagination = { ...state.pagination, ...action.payload } },
    setLoading(state, action) { state.loading = { ...state.loading, ...action.payload } },
    reset() { return initialState },
  },
})

export const { actions } = nodeQuestionsSlice
export default nodeQuestionsSlice.reducer
