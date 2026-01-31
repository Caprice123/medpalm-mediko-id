import { actions } from '@store/credit/reducer'
import Endpoints from '@config/endpoint'
import { handleApiError } from '@utils/errorUtils'
import { getWithToken, getPublic, patchWithToken, postWithToken, putWithToken } from '../../utils/requestUtils'

const {
  setLoading,
  setBalance,
  setPlans,
  setTransactions,
  setPagination,
  setFilters,
  setStats,
  clearFilters,
  setPage,
  addTransaction,
  updatePlan,
  addPlan
} = actions

// ============= User Credit Actions =============

/**
 * Fetch user's credit balance
 */
export const fetchCreditBalance = () => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isBalanceLoading', value: true }))

    const response = await getWithToken(`${Endpoints.credits}/balance`)

    dispatch(setBalance(response.data.data.balance))
  } finally {
    dispatch(setLoading({ key: 'isBalanceLoading', value: false }))
  }
}

/**
 * Fetch user's credit transactions
 */
export const fetchCreditTransactions = (params = {}) => async (dispatch) => {

  try {
    dispatch(setLoading({ key: 'isTransactionsLoading', value: true }))
    const { limit = 50, offset = 0, type } = params

    const queryParams = {
      limit,
      offset,
      type,
    }

    const subRoute = '/transactions'
    const route = Endpoints.credits + subRoute
    const response = await getWithToken(route, queryParams)

    dispatch(setTransactions(response.data.data.transactions))
    dispatch(setPagination(response.data.data.pagination))
  } finally {
    dispatch(setLoading({ key: 'isTransactionsLoading', value: false }))
  }
}

/**
 * Purchase credits
 */
export const purchaseCredits = (creditPlanId, paymentMethod = 'xendit') => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isPurchaseLoading', value: true }))
    const requestBody = {
        creditPlanId,
        paymentMethod
    }
    const subRoute = "/purchase"
    const route = Endpoints.credits + subRoute
    const response = await postWithToken(route, requestBody)

    dispatch(addTransaction(response.data.data.transaction))
  } finally {
    dispatch(setLoading({ key: 'isPurchaseLoading', value: false }))
  }
}

/**
 * Deduct credits (when using a feature)
 */
export const deductCredits = (amount, description, sessionId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isDeductLoading', value: true }))
    const requestBody = {
        amount,
        description,
        sessionId,
    }
    const subRoute = "/deduct"
    const route = Endpoints.credits + subRoute
    const response = await postWithToken(route, requestBody)

    dispatch(setBalance(response.data.data.newBalance))
    dispatch(addTransaction(response.data.data.transaction))
  } finally {
    dispatch(setLoading({ key: 'isDeductLoading', value: false }))
  }
}

// ============= Credit Plans Actions =============

/**
 * Fetch all credit plans (admin)
 */
export const fetchAllCreditPlans = () => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isPlansLoading', value: true }))
    const response = await getWithToken(`${Endpoints.creditPlans}`)

    dispatch(setPlans(response.data.data))
  } finally {
    dispatch(setLoading({ key: 'isPlansLoading', value: false }))
  }
}

/**
 * Fetch active credit plans (for users)
 */
export const fetchActiveCreditPlans = () => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isPlansLoading', value: true }))
    // Use public endpoint for landing page (no auth required)
    const response = await getPublic(`${Endpoints.creditPlans}/active`)

    dispatch(setPlans(response.data.data))

  } finally {
    dispatch(setLoading({ key: 'isPlansLoading', value: false }))
  }
}

/**
 * Create credit plan (admin)
 */
export const createCreditPlan = (planData) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isCreatePlanLoading', value: true }))
    const response = await postWithToken(
      `${Endpoints.creditPlans}`,
      planData,
    )

    dispatch(addPlan(response.data.data))
  } catch {
    // no need to handle anything because already handled in api.jsx  } finally {
    dispatch(setLoading({ key: 'isCreatePlanLoading', value: false }))
  }
}

/**
 * Update credit plan (admin)
 */
export const updateCreditPlan = (planId, planData) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isUpdatePlanLoading', value: true }))
    const response = await putWithToken(
      `${Endpoints.creditPlans}/${planId}`,
      planData,
    )

    dispatch(updatePlan(response.data.data))
  } finally {
    dispatch(setLoading({ key: 'isUpdatePlanLoading', value: false }))
  }
}

/**
 * Toggle credit plan status (admin)
 */
export const toggleCreditPlanStatus = (planId) => async (dispatch) => {
  try {
    const response = await patchWithToken(
      `${Endpoints.creditPlans}/${planId}/toggle`,
      {},
    )

    dispatch(updatePlan(response.data.data))

  } catch {
    // no need to handle anything because already handled in api.jsx
  }
}

// ============= Admin Actions =============

/**
 * Fetch all transactions (admin)
 */
export const fetchAllTransactions = (params = {}) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isTransactionsLoading', value: true }))

    const { page = 1, perPage = 20, type, status } = params

    const queryParams = {
      page,
      perPage,
      type,
      status,
    }

    const response = await getWithToken(
      Endpoints.admin.credits,
      queryParams
    )

    dispatch(setTransactions(response.data.data.transactions))
    dispatch(setPagination({
      page: response.data.data.pagination.page,
      perPage: response.data.data.pagination.perPage,
      isLastPage: response.data.data.pagination.isLastPage
    }))
  } finally {
    dispatch(setLoading({ key: 'isTransactionsLoading', value: false }))
  }
}

/**
 * Confirm payment (admin)
 */
export const confirmPayment = (transactionId, status) => async (dispatch) => {
  try {
    const url = Endpoints.admin.credits + `/transactions/${transactionId}/confirm`
    await postWithToken(
      url,
      { status },
    )
  } catch {
    // no need to handle anything because already handled in api.jsx  
  }
}

/**
 * Add bonus credits (admin)
 */
export const addBonusCredits = (userId, amount, description) => async (dispatch) => {
  try {
    const url = Endpoints.admin.credits + `/bonus`
    await postWithToken(
      url,
      { userId, amount, description },
    )
  } catch {
    // no need to handle anything because already handled in api.jsx
  }
}

// Export filter and pagination actions
export { setFilters, setPage }
