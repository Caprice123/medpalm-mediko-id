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
    permanentBalance: 0,
    expiringBuckets: [],
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
    isReorderingPlans: false,
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
    updatePlanOrders: (state, { payload }) => {
      // payload: [{ id, order }]
      payload.forEach(({ id, order }) => {
        const plan = state.plans.find(p => p.id === id)
        if (plan) plan.order = order
      })
    },
    setPagination: (state, { payload }) => {
      state.pagination = payload || initialState.pagination
    },
    setUserStatus: (state, { payload }) => {
      state.userStatus = payload
    },
    updateCreditBalance: (state, { payload }) => {
      if (typeof payload === 'object' && payload !== null) {
        // Full breakdown from streaming userQuota
        state.userStatus.creditBalance = payload.balance ?? state.userStatus.creditBalance
        if (payload.permanentBalance !== undefined) state.userStatus.permanentBalance = payload.permanentBalance
        if (payload.expiringBuckets !== undefined) state.userStatus.expiringBuckets = payload.expiringBuckets
      } else {
        state.userStatus.creditBalance = payload
      }
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
    setHistoryPage: (state, { payload }) => {
      state.historyPagination.page = payload
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
