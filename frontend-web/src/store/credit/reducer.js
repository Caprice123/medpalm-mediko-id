import { createSlice } from '@reduxjs/toolkit'
import { resetAllState } from '../globalAction'

const initialState = {
  plans: [],
  transactions: [],
  balance: 0,
  loading: {
    isPlansLoading: false,
    isTransactionsLoading: false,
    isPurchaseLoading: false,
    isDeductLoading: false,
    isCreatePlanLoading: false,
    isUpdatePlanLoading: false,
    isDeletePlanLoading: false,
    isBalanceLoading: false,
  },
  error: null,
  pagination: {
    page: 1,
    perPage: 20,
    isLastPage: true
  },
  filters: {
    type: '',
    status: ''
  },
  stats: {
    total: 0,
    completed: 0,
    pending: 0,
    totalAmount: 0
  }
}

const { reducer, actions } = createSlice({
  name: 'credit',
  initialState,
  reducers: {
    setLoading: (state, { payload: { key, value } }) => {
      state.loading[key] = value
    },
    setBalance: (state, { payload }) => {
      state.balance = payload
    },
    setPlans: (state, { payload }) => {
      state.plans = payload
    },
    setTransactions: (state, { payload }) => {
      state.transactions = payload
    },
    setPagination: (state, { payload }) => {
      state.pagination = { ...state.pagination, ...payload }
    },
    setFilters: (state, { payload }) => {
      state.filters = { ...state.filters, ...payload }
      // Reset to first page when filters change
      state.pagination.page = 1
    },
    setStats: (state, { payload }) => {
      state.stats = { ...state.stats, ...payload }
    },
    setError: (state, { payload }) => {
      state.error = payload
    },
    clearError: (state) => {
      state.error = null
    },
    clearFilters: (state) => {
      state.filters = { type: '', status: '' }
      state.pagination.page = 1
    },
    setPage: (state, { payload }) => {
      state.pagination.page = payload
    },
    addTransaction: (state, { payload }) => {
      state.transactions = [payload, ...state.transactions]
    },
    updatePlan: (state, { payload }) => {
      const index = state.plans.findIndex(p => p.id === payload.id)
      if (index !== -1) {
        state.plans[index] = payload
      }
    },
    removePlan: (state, { payload }) => {
      state.plans = state.plans.filter(p => p.id !== payload)
    },
    addPlan: (state, { payload }) => {
      state.plans = [...state.plans, payload]
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
