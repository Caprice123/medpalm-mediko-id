import { createSlice } from '@reduxjs/toolkit'
import { resetAllState } from '../globalAction'

const initialState = {
  quizzes: [],
  filter: {
    search: undefined,
    university: undefined,
    semester: undefined,
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
    isGetListAnatomyQuizLoading: false,
    isGetDetailAnatomyQuizLoading: false,
    isCreateAnatomyQuizLoading: false,
    isUpdateAnatomyQuizLoading: false,
    isDeleteAnatomyQuizLoading: false,
    isUploadingImage: false,
    isSubmitAnatomyQuizLoading: false,
  },
  error: null
}

const { reducer, actions } = createSlice({
  name: 'anatomy',
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
    updateFilter: (state, { payload: { key, value } }) => {
      state.filter[key] = value
    }
  },
  extraReducers: (builder) => {
    builder.addCase(resetAllState, (state) => ({
        ...initialState,
        loading: state.loading, // 🔥 preserve current loading state
    }));
  },
})

export { actions }
export default reducer
