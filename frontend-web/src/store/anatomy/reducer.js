import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  quizzes: [],
  selectedQuiz: null,
  questions: [],
  currentQuiz: null, // For user taking quiz
  quizResult: null,
  uploadedImage: null, // For admin creating quiz
  pagination: {
    page: 1,
    perPage: 20,
    isLastPage: false
  },
  loading: {
    isQuizzesLoading: false,
    isQuizLoading: false,
    isCreatingQuiz: false,
    isUpdatingQuiz: false,
    isDeletingQuiz: false,
    isUploadingImage: false,
    isSubmitting: false,
    isConstantsLoading: false,
    isUpdatingConstants: false,
  },
  error: null,
  filter: {
    name: '',
    university: '',
    semester: '',
    status: ''
  }
}

const { reducer, actions } = createSlice({
  name: 'anatomy',
  initialState,
  reducers: {
    setLoading: (state, { payload: { key, value } }) => {
      state.loading[key] = value
    },
    setQuizzes: (state, { payload }) => {
      state.quizzes = payload
    },
    setPagination: (state, { payload }) => {
      state.pagination = payload
    },
    setSelectedQuiz: (state, { payload }) => {
      state.selectedQuiz = payload
    },
    setQuestions: (state, { payload }) => {
      state.questions = payload
    },
    setCurrentQuiz: (state, { payload }) => {
      state.currentQuiz = payload
    },
    setQuizResult: (state, { payload }) => {
      state.quizResult = payload
    },
    setUploadedImage: (state, { payload }) => {
      state.uploadedImage = payload
    },
    setFilters: (state, { payload }) => {
      state.filters = { ...state.filters, ...payload }
    },
    clearFilters: (state) => {
      state.filters = {
        university: '',
        semester: '',
        status: ''
      }
    },
    setError: (state, { payload }) => {
      state.error = payload
    },
    clearError: (state) => {
      state.error = null
    },
    addQuiz: (state, { payload }) => {
      state.quizzes = [payload, ...state.quizzes]
    },
    updateFilter: (state, { payload: { key, value } }) => {
      state.filter[key] = value
    },
    updateQuiz: (state, { payload }) => {
      const index = state.quizzes.findIndex(q => q.id === payload.id)
      if (index !== -1) {
        state.quizzes[index] = payload
      }
    },
    removeQuiz: (state, { payload }) => {
      state.quizzes = state.quizzes.filter(q => q.id !== payload)
    },
    addQuestion: (state, { payload }) => {
      state.questions = [...state.questions, payload]
    },
    updateQuestion: (state, { payload }) => {
      const index = state.questions.findIndex(q => q.id === payload.id)
      if (index !== -1) {
        state.questions[index] = payload
      }
    },
    removeQuestion: (state, { payload }) => {
      state.questions = state.questions.filter(q => q.id !== payload)
    },
    clearUploadedImage: (state) => {
      state.uploadedImage = null
    },
    clearSelectedQuiz: (state) => {
      state.selectedQuiz = null
      state.questions = []
    },
    clearCurrentQuiz: (state) => {
      state.currentQuiz = null
      state.quizResult = null
    },
    nextPage: (state) => {
      if (!state.pagination.isLastPage) {
        state.pagination.page += 1
      }
    },
    previousPage: (state) => {
      if (state.pagination.page > 1) {
        state.pagination.page -= 1
      }
    },
    setPage: (state, { payload }) => {
      state.pagination.page = payload
    }
  }
})

export { actions }
export default reducer
