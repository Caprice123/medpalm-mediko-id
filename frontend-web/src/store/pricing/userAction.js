import { actions } from '@store/pricing/reducer'
import Endpoints from '@config/endpoint'
import { getWithToken, postWithToken } from '../../utils/requestUtils'
import axios from 'axios'
import { captureException } from '../../config/sentry'
import { handleApiError } from '@utils/errorUtils'

const {
  setLoading,
  setPlans,
  setUserStatus,
  setPurchaseHistory,
  clearError,
  setTransactionDetail,
  clearTransactionDetail,
} = actions

export const fetchPricingPlans = (bundleType = null) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isPlansLoading', value: true }))

    const url = bundleType
      ? `${Endpoints.pricing.plans}?bundle_type=${bundleType}`
      : Endpoints.pricing.plans
    const response = await axios.get(import.meta.env.VITE_API_BASE_URL + url)

    dispatch(setPlans(response.data.data))
  } catch(err) {
    handleApiError(err, dispatch)
    captureException(err, {
        url: import.meta.env.VITE_API_BASE_URL + Endpoints.api.features,
        status: err.response?.status,
        responseData: err.response?.data,
        method: err.config?.method,
    })
  } finally {
    dispatch(setLoading({ key: 'isPlansLoading', value: false }))
  }
}

export const fetchUserStatus = () => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isStatusLoading', value: true }))

    const response = await getWithToken(Endpoints.pricing.status)
    dispatch(setUserStatus(response.data.data))
  } finally {
    dispatch(setLoading({ key: 'isStatusLoading', value: false }))
  }
}

export const fetchPurchaseHistory = () => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ key: 'isHistoryLoading', value: true }))

    const { page, perPage } = getState().pricing.historyPagination
    const url = `${Endpoints.pricing.history}?page=${page}&perPage=${perPage}`
    const response = await getWithToken(url)

    dispatch(setPurchaseHistory({
      data: response.data.data,
      pagination: response.data.pagination
    }))
  } finally {
    dispatch(setLoading({ key: 'isHistoryLoading', value: false }))
  }
}

export const purchasePricingPlan = (pricingPlanId, paymentMethod = 'manual', onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isPurchaseLoading', value: true }))

    const response = await postWithToken(Endpoints.pricing.purchase, {
      pricingPlanId,
      paymentMethod
    })

    dispatch(fetchUserStatus())
    if (onSuccess) onSuccess(response.data)

    return response.data
  } finally {
    dispatch(setLoading({ key: 'isPurchaseLoading', value: false }))
  }
}

export const fetchUserTransactionDetail = (purchaseId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isTransactionDetailLoading', value: true }))
    dispatch(clearError())

    const response = await getWithToken(`${Endpoints.pricing.history}/${purchaseId}`)
    dispatch(setTransactionDetail(response.data.data))

    return response.data
  } finally {
    dispatch(setLoading({ key: 'isTransactionDetailLoading', value: false }))
  }
}

export const attachPaymentEvidence = (purchaseId, blobId, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isAttachingEvidence', value: true }))
    dispatch(clearError())

    const response = await postWithToken(`${Endpoints.pricing.history}/${purchaseId}/evidence`, {
      blobId
    })

    dispatch(fetchUserTransactionDetail(purchaseId))
    if (onSuccess) onSuccess(response.data)

    return response.data
  } finally {
    dispatch(setLoading({ key: 'isAttachingEvidence', value: false }))
  }
}

export { clearTransactionDetail }
