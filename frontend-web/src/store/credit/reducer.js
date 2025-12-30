import { createSlice } from '@reduxjs/toolkit'
import { resetAllState } from '../globalAction'

const initialState = {
  balance: 0,
  plans: [],
  transactions: [],
  loading: {
    isBalanceLoading: false,
    isPlansLoading: false,
    isTransactionsLoading: false,
    isPurchaseLoading: false,
    isDeductLoading: false,
    isCreatePlanLoading: false,
    isUpdatePlanLoading: false,
    isDeletePlanLoading: false,
  },
  error: null,
  pagination: {
    total: 0,
    limit: 50,
    offset: 0,
    hasMore: false
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
    setError: (state, { payload }) => {
      state.error = payload
    },
    clearError: (state) => {
      state.error = null
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
    //   builder.addCase(resetAllState, (state) => ({
    //       ...initialState,
    //       balance: state.balance,
    //       loading: state.loading, // 🔥 preserve current loading state
    //   }));
    },
})

export { actions }
export default reducer
