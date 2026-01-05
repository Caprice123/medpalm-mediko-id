import { actions } from '@store/pricing/reducer'
import Endpoints from '@config/endpoint'
import { handleApiError } from '@utils/errorUtils'
import { getPublic, getWithToken, postWithToken } from '../../utils/requestUtils'

const {
  setLoading,
  setPlans,
  setPagination,
  setUserStatus,
  setPurchaseHistory,
  setError,
  clearError,
} = actions

/**
 * Fetch all active pricing plans (public - for landing page)
 * @param {string} bundleType - Optional filter: 'credits', 'subscription', 'hybrid'
 */
export const fetchPricingPlans = (bundleType = null) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isPlansLoading', value: true }))
    

    const url = bundleType
      ? `${Endpoints.pricing.plans}?bundle_type=${bundleType}`
      : Endpoints.pricing.plans

    const response = await getPublic(url)

    dispatch(setPlans(response.data.data))

  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isPlansLoading', value: false }))
  }
}

/**
 * Fetch user status (subscription + credit balance)
 * Requires authentication
 */
export const fetchUserStatus = () => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isStatusLoading', value: true }))
    

    const response = await getWithToken(Endpoints.pricing.status)

    dispatch(setUserStatus(response.data.data))

  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isStatusLoading', value: false }))
  }
}

/**
 * Fetch user's purchase history with pagination
 * Requires authentication
 * @param {number} page - Page number (default: 1)
 * @param {number} perPage - Items per page (default: 10)
 */
export const fetchPurchaseHistory = (page = 1, perPage = 10) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isHistoryLoading', value: true }))


    const url = `${Endpoints.pricing.history}?page=${page}&perPage=${perPage}`
    const response = await getWithToken(url)

    dispatch(setPurchaseHistory({
      data: response.data.data,
      pagination: response.data.pagination
    }))

  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isHistoryLoading', value: false }))
  }
}

/**
 * Purchase a pricing plan
 * Requires authentication
 * @param {number} pricingPlanId
 * @param {string} paymentMethod
 */
export const purchasePricingPlan = (pricingPlanId, paymentMethod = 'manual') => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isPurchaseLoading', value: true }))

    const response = await postWithToken(Endpoints.pricing.purchase, {
      pricingPlanId,
      paymentMethod
    })

    // Refresh user status to update subscription and credit balance
    dispatch(fetchUserStatus())

    return response.data
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isPurchaseLoading', value: false }))
  }
}

/**
 * Admin: Fetch all pricing plans (including inactive)
 * Requires admin authentication
 */
export const fetchAllPricingPlans = (params = {}) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isPlansLoading', value: true }))
    

    // Build query string
    const queryParams = new URLSearchParams()
    if (params.page) queryParams.append('page', params.page)
    if (params.limit) queryParams.append('limit', params.limit)
    if (params.search_name) queryParams.append('search_name', params.search_name)
    if (params.search_code) queryParams.append('search_code', params.search_code)
    if (params.bundle_type && params.bundle_type !== 'all') {
      queryParams.append('bundle_type', params.bundle_type)
    }

    const url = `${Endpoints.pricing.admin.list}?${queryParams.toString()}`
    const response = await getWithToken(url)

    dispatch(setPlans(response.data.data || response.data || []))
    dispatch(setPagination(response.data.pagination))

  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isPlansLoading', value: false }))
  }
}

/**
 * Admin: Create a new pricing plan
 * Requires admin authentication
 */
export const createPricingPlan = (planData) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isPlansLoading', value: true }))

    const response = await postWithToken(Endpoints.pricing.admin.create, planData)

    // Refresh plans list
    dispatch(fetchAllPricingPlans())

    return response.data

  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isPlansLoading', value: false }))
  }
}

/**
 * Admin: Update a pricing plan
 * Requires admin authentication
 */
export const updatePricingPlan = (planId, planData) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isPlansLoading', value: true }))
    

    const { putWithToken } = await import('../../utils/requestUtils')

    const response = await putWithToken(Endpoints.pricing.admin.update(planId), planData)

    // Refresh plans list
    dispatch(fetchAllPricingPlans())

    return response.data

  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isPlansLoading', value: false }))
  }
}

/**
 * Admin: Toggle pricing plan active status
 * Requires admin authentication
 */
export const togglePricingPlanStatus = (planId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isPlansLoading', value: true }))
    

    const { patchWithToken } = await import('../../utils/requestUtils')

    const response = await patchWithToken(Endpoints.pricing.admin.toggle(planId))

    // Refresh plans list
    dispatch(fetchAllPricingPlans())

    return response.data

  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isPlansLoading', value: false }))
  }
}

export { setError, clearError }
