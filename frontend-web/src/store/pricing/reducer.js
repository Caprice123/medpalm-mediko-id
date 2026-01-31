import { createSlice } from '@reduxjs/toolkit'
import { resetAllState } from '../globalAction'

const initialState = {
  plans: [],
  pagination: {
    page: 1,
    limit: 10,
    isLastPage: true
  },
  userStatus: {
    hasActiveSubscription: false,
    subscription: null,
    creditBalance: 0,
    userId: null
  },
  purchaseHistory: [],
  historyPagination: {
    page: 1,
    perPage: 10,
    isLastPage: true
  },
  transactionDetail: null,
  loading: {
    isPlansLoading: false,
    isStatusLoading: false,
    isHistoryLoading: false,
    isPurchaseLoading: false,
    isTransactionDetailLoading: false,
    isApprovingTransaction: false,
    isRejectingTransaction: false,
    isAttachingEvidence: false,
  },
  error: null,
}

const { reducer, actions } = createSlice({
  name: 'pricing',
  initialState,
  reducers: {
    setLoading: (state, { payload: { key, value } }) => {
      state.loading[key] = value
    },
    setPlans: (state, { payload }) => {
      state.plans = payload
    },
    setPagination: (state, { payload }) => {
      state.pagination = payload || initialState.pagination
    },
    setUserStatus: (state, { payload }) => {
      state.userStatus = payload
    },
    updateCreditBalance: (state, { payload }) => {
      state.userStatus.creditBalance = payload
    },
    setPurchaseHistory: (state, { payload }) => {
      state.purchaseHistory = payload.data || payload
      if (payload.pagination) {
        state.historyPagination = payload.pagination
      }
    },
    setHistoryPagination: (state, { payload }) => {
      state.historyPagination = payload || initialState.historyPagination
    },
    setError: (state, { payload }) => {
      state.error = payload
    },
    clearError: (state) => {
      state.error = null
    },
    addPurchase: (state, { payload }) => {
      state.purchaseHistory = [payload, ...state.purchaseHistory]
    },
    setTransactionDetail: (state, { payload }) => {
      state.transactionDetail = payload
    },
    clearTransactionDetail: (state) => {
      state.transactionDetail = null
    }
  },
  
    extraReducers: (builder) => {
      builder.addCase(resetAllState, (state) => ({
          ...initialState,
          loading: state.loading, // 🔥 preserve current loading state
          userStatus: state.userStatus, // 🔥 preserve user status (credits & subscription)
      }));
    },
})

export { actions }
export default reducer
