import { actions } from './reducer'
import Endpoints from '@config/endpoint'
import { getWithToken, postWithToken, deleteWithToken } from '../../utils/requestUtils'

export const fetchReviewStats = () => async (dispatch) => {
  try {
    dispatch(actions.setLoading({ key: 'isFetchingStats', value: true }))
    const response = await getWithToken(Endpoints.api.reviewStats)
    dispatch(actions.setStats(response.data.data || null))
  } finally {
    dispatch(actions.setLoading({ key: 'isFetchingStats', value: false }))
  }
}

export const fetchReviewSession = (params) => async (dispatch) => {
  try {
    dispatch(actions.setLoading({ key: 'isFetchingSession', value: true }))
    const response = await getWithToken(Endpoints.api.reviewSession, params)
    dispatch(actions.setSessionCards(response.data.data || []))
  } finally {
    dispatch(actions.setLoading({ key: 'isFetchingSession', value: false }))
  }
}

export const startReviewSession = (params, onSuccess) => async (dispatch) => {
  try {
    dispatch(actions.setLoading({ key: 'isFetchingSession', value: true }))
    const response = await postWithToken(Endpoints.api.reviewSessions, params)
    const { uniqueId, cards } = response.data.data || {}
    dispatch(actions.setSessionUniqueId(uniqueId || null))
    dispatch(actions.setSessionCards(cards || []))
    onSuccess?.(uniqueId)
  } finally {
    dispatch(actions.setLoading({ key: 'isFetchingSession', value: false }))
  }
}

export const fetchSessionByUniqueId = (uniqueId) => async (dispatch) => {
  try {
    dispatch(actions.setLoading({ key: 'isFetchingSession', value: true }))
    const response = await getWithToken(Endpoints.api.reviewSessionByUniqueId(uniqueId))
    const { cards } = response.data.data || {}
    dispatch(actions.setSessionCards(cards || []))
  } finally {
    dispatch(actions.setLoading({ key: 'isFetchingSession', value: false }))
  }
}

export const submitRating = ({ recordType, recordId, rating }) => async (dispatch) => {
  try {
    dispatch(actions.setLoading({ key: 'isSubmittingRating', value: true }))
    await postWithToken(Endpoints.api.reviewRate, { recordType, recordId, rating })
  } finally {
    dispatch(actions.setLoading({ key: 'isSubmittingRating', value: false }))
  }
}

export const fetchCustomSessions = () => async (dispatch) => {
  try {
    dispatch(actions.setLoading({ key: 'isFetchingCustomSessions', value: true }))
    const response = await getWithToken(Endpoints.api.reviewCustomSessions)
    dispatch(actions.setCustomSessions(response.data.data || []))
  } finally {
    dispatch(actions.setLoading({ key: 'isFetchingCustomSessions', value: false }))
  }
}

export const createCustomSession = (payload, onSuccess) => async (dispatch) => {
  try {
    dispatch(actions.setLoading({ key: 'isCreatingCustomSession', value: true }))
    const response = await postWithToken(Endpoints.api.reviewCustomSessions, payload)
    onSuccess?.(response.data.data)
  } finally {
    dispatch(actions.setLoading({ key: 'isCreatingCustomSession', value: false }))
  }
}

export const deleteCustomSession = (id, onSuccess) => async (dispatch) => {
  try {
    dispatch(actions.setLoading({ key: 'isDeletingCustomSession', value: true }))
    await deleteWithToken(`${Endpoints.api.reviewCustomSessions}/${id}`)
    onSuccess?.()
  } finally {
    dispatch(actions.setLoading({ key: 'isDeletingCustomSession', value: false }))
  }
}
