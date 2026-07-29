import { createSlice } from '@reduxjs/toolkit'
import { resetAllState } from '../globalAction'

const initialState = {
  sistemBlokTopics: [],
  sistemBlokPagination: { page: 1, perPage: 9, total: 0, totalPages: 1 },
  ilmuLintasSistemTopics: [],
  ilmuLintasSistemPagination: { page: 1, perPage: 9, total: 0, totalPages: 1 },
  topicDetail: null,
  atlasModelDetail: null,
  anatomyQuizDetail: null,
  topicModules: [],
  moduleOptions: [],
  modulesFilter: { module: null, page: 1 },
  modulesPagination: { page: 1, perPage: 30, isLastPage: true },
  topicAnatomyQuizzes: [],
  quizzesFilter: { module: null, page: 1 },
  quizzesPagination: { page: 1, perPage: 30, isLastPage: true },
  loading: {
    isFetchingSistemBlok: false,
    isFetchingIlmuLintasSistem: false,
    isFetchingTopicDetail: false,
    isFetchingAtlasModelDetail: false,
    isFetchingAnatomyQuizDetail: false,
    isSubmittingQuiz: false,
    isFetchingModules: false,
    isFetchingAnatomyQuizzes: false,
  },
  error: null,
}

const atlasQuizSlice = createSlice({
  name: 'atlasQuiz',
  initialState,
  reducers: {
    setSistemBlokTopics: (state, action) => {
      state.sistemBlokTopics = action.payload.topics
      state.sistemBlokPagination = action.payload.pagination
    },
    appendSistemBlokTopics: (state, action) => {
      state.sistemBlokTopics = [...state.sistemBlokTopics, ...action.payload.topics]
      state.sistemBlokPagination = action.payload.pagination
    },
    setIlmuLintasSistemTopics: (state, action) => {
      state.ilmuLintasSistemTopics = action.payload.topics
      state.ilmuLintasSistemPagination = action.payload.pagination
    },
    appendIlmuLintasSistemTopics: (state, action) => {
      state.ilmuLintasSistemTopics = [...state.ilmuLintasSistemTopics, ...action.payload.topics]
      state.ilmuLintasSistemPagination = action.payload.pagination
    },
    setTopicDetail: (state, action) => {
      state.topicDetail = action.payload
    },
    setAtlasModelDetail: (state, action) => {
      state.atlasModelDetail = action.payload
    },
    setAnatomyQuizDetail: (state, action) => {
      state.anatomyQuizDetail = action.payload
    },
    setModuleOptions: (state, action) => {
      state.moduleOptions = action.payload
    },
    setTopicModules: (state, action) => {
      state.topicModules = action.payload.data
      state.modulesPagination = action.payload.pagination
    },
    appendTopicModules: (state, action) => {
      state.topicModules = [...state.topicModules, ...action.payload.data]
      state.modulesPagination = action.payload.pagination
    },
    setModulesFilter: (state, action) => {
      state.modulesFilter = { ...state.modulesFilter, ...action.payload }
    },
    setTopicAnatomyQuizzes: (state, action) => {
      state.topicAnatomyQuizzes = action.payload.data
      state.quizzesPagination = action.payload.pagination
    },
    appendTopicAnatomyQuizzes: (state, action) => {
      state.topicAnatomyQuizzes = [...state.topicAnatomyQuizzes, ...action.payload.data]
      state.quizzesPagination = action.payload.pagination
    },
    setQuizzesFilter: (state, action) => {
      state.quizzesFilter = { ...state.quizzesFilter, ...action.payload }
    },
    setLoading: (state, action) => {
      state.loading[action.payload.key] = action.payload.value
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    resetTopicDetail: (state) => {
      state.topicDetail = null
      state.topicModules = []
      state.topicAnatomyQuizzes = []
      state.moduleOptions = []
      state.modulesFilter = { module: null, page: 1 }
      state.quizzesFilter = { classification: null, page: 1 }
      state.modulesPagination = { page: 1, perPage: 9, isLastPage: true }
      state.quizzesPagination = { page: 1, perPage: 10, isLastPage: true }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetAllState, () => initialState)
  },
})

export const { actions } = atlasQuizSlice
export default atlasQuizSlice.reducer
