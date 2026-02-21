import { actions } from '@store/pricing/reducer'
import Endpoints from '@config/endpoint'
import { getWithToken, postWithToken, putWithToken, patchWithToken } from '../../utils/requestUtils'

const {
  setLoading,
  setPlans,
  setPagination,
  clearError,
  setTransactionDetail,
} = actions

export const fetchAllPricingPlans = (params = {}) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isPlansLoading', value: true }))

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
  } finally {
    dispatch(setLoading({ key: 'isPlansLoading', value: false }))
  }
}

export const createPricingPlan = (planData) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isPlansLoading', value: true }))

    const response = await postWithToken(Endpoints.pricing.admin.create, planData)

    dispatch(fetchAllPricingPlans())

    return response.data
  } finally {
    dispatch(setLoading({ key: 'isPlansLoading', value: false }))
  }
}

export const updatePricingPlan = (planId, planData) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isPlansLoading', value: true }))

    const response = await putWithToken(Endpoints.pricing.admin.update(planId), planData)

    dispatch(fetchAllPricingPlans())

    return response.data
  } finally {
    dispatch(setLoading({ key: 'isPlansLoading', value: false }))
  }
}

export const togglePricingPlanStatus = (planId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isPlansLoading', value: true }))

    const response = await patchWithToken(Endpoints.pricing.admin.toggle(planId), {})

    dispatch(fetchAllPricingPlans())

    return response.data
  } finally {
    dispatch(setLoading({ key: 'isPlansLoading', value: false }))
  }
}

export const fetchTransactionDetail = (purchaseId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isTransactionDetailLoading', value: true }))
    dispatch(clearError())

    const response = await getWithToken(`${Endpoints.pricing.admin.list}/purchases/${purchaseId}`)

    dispatch(setTransactionDetail(response.data.data))

    return response.data
  } finally {
    dispatch(setLoading({ key: 'isTransactionDetailLoading', value: false }))
  }
}

export const approveTransaction = (purchaseId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isApprovingTransaction', value: true }))
    dispatch(clearError())

    const response = await postWithToken(
      `${Endpoints.pricing.admin.list}/purchases/${purchaseId}/approve`,
      { status: 'completed' }
    )

    dispatch(fetchTransactionDetail(purchaseId))

    return response.data
  } finally {
    dispatch(setLoading({ key: 'isApprovingTransaction', value: false }))
  }
}

export const rejectTransaction = (purchaseId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isRejectingTransaction', value: true }))
    dispatch(clearError())

    const response = await postWithToken(
      `${Endpoints.pricing.admin.list}/purchases/${purchaseId}/approve`,
      { status: 'failed' }
    )

    dispatch(fetchTransactionDetail(purchaseId))

    return response.data
  } finally {
    dispatch(setLoading({ key: 'isRejectingTransaction', value: false }))
  }
}
