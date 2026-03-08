import { createSlice } from '@reduxjs/toolkit'
import { resetAllState } from '../globalAction'

const initialState = {
  quizzes: [],
  filter: {
    search: undefined,
    university: undefined,
    semester: undefined,
    topic: undefined,
    status: undefined
  },
  detail: undefined,
  uploadedImage: undefined,
  pagination: {
    page: 1,
    perPage: 20,
    isLastPage: false
  },
  loading: {
    isGetListDiagnosticQuizLoading: false,
    isGetDetailDiagnosticQuizLoading: false,
    isCreateDiagnosticQuizLoading: false,
    isUpdateDiagnosticQuizLoading: false,
    isDeleteDiagnosticQuizLoading: false,
    isUploadingImage: false,
    isSubmitDiagnosticQuizLoading: false,
  },
  error: null
}

const { reducer, actions } = createSlice({
  name: 'diagnostic',
  initialState,
  reducers: {
    setLoading: (state, { payload: { key, value } }) => {
      state.loading[key] = value
    },
    setDetail: (state, { payload }) => {
      state.detail = payload
    },
    setQuizzes: (state, { payload }) => {
      state.quizzes = payload
    },
    setPagination: (state, { payload }) => {
      state.pagination = payload
    },
    setUploadedImage: (state, { payload }) => {
      state.uploadedImage = payload
    },
    setPage: (state, { payload }) => {
      state.pagination.page = payload
    },
    updateFilter: (state, { payload: { key, value } }) => {
      state.filter[key] = value
    }
  },
  extraReducers: (builder) => {
    builder.addCase(resetAllState, (state) => ({
        ...initialState,
        loading: state.loading,
    }));
  },
})

export { actions }
export default reducer
