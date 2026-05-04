import { createSlice } from '@reduxjs/toolkit'
import { resetAllState } from '../globalAction'

const initialState = {
  events: [],
  myRegistrations: [],
  registrations: [],
  detail: undefined,
  filter: {
    search: undefined,
    status: undefined,
    registrationStatus: 'open',
  },
  pagination: {
    page: 1,
    perPage: 20,
    isLastPage: false,
  },
  registrationPagination: {
    page: 1,
    perPage: 20,
    isLastPage: false,
  },
  registrationFilter: {
    status: '',
    search: '',
    eventId: '',
  },
  loading: {
    isGetListLoading: false,
    isGetDetailLoading: false,
    isCreateLoading: false,
    isUpdateLoading: false,
    isDeleteLoading: false,
    isGetRegistrationsLoading: false,
    isReviewLoading: false,
    isRegisterLoading: false,
    isGetMyRegistrationsLoading: false,
  },
  error: null,
}

const { reducer, actions } = createSlice({
  name: 'event',
  initialState,
  reducers: {
    setLoading: (state, { payload: { key, value } }) => {
      state.loading[key] = value
    },
    setEvents: (state, { payload }) => {
      state.events = payload
    },
    setDetail: (state, { payload }) => {
      state.detail = payload
    },
    setRegistrations: (state, { payload }) => {
      state.registrations = payload
    },
    setMyRegistrations: (state, { payload }) => {
      state.myRegistrations = payload
    },
    setPagination: (state, { payload }) => {
      state.pagination = payload
    },
    setPage: (state, { payload }) => {
      state.pagination.page = payload
    },
    setRegistrationPagination: (state, { payload }) => {
      state.registrationPagination = payload
    },
    setRegistrationPage: (state, { payload }) => {
      state.registrationPagination.page = payload
    },
    updateFilter: (state, { payload: { key, value } }) => {
      state.filter[key] = value
    },
    updateRegistrationFilter: (state, { payload: { key, value } }) => {
      state.registrationFilter[key] = value
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetAllState, (state) => ({
      ...initialState,
      loading: state.loading,
    }))
  },
})

export { actions }
export default reducer
