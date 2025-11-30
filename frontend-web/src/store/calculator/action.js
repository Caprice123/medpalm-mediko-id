import { actions } from '@store/calculator/reducer'
import Endpoints from '@config/endpoint'
import { handleApiError } from '@utils/errorUtils'
import { getWithToken, postWithToken, putWithToken, deleteWithToken } from '../../utils/requestUtils'

const {
  setLoading,
  setTopics,
  setSelectedTopic,
  setError,
  clearError,
  addTopic,
  updateTopic,
  removeTopic
} = actions

// Fetch all calculator topics (admin)
export const fetchAdminCalculatorTopics = () => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isTopicsLoading', value: true }))
    dispatch(clearError())

    const response = await getWithToken(Endpoints.calculators.admin.list)
    dispatch(setTopics(response.data.data || response.data || []))
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isTopicsLoading', value: false }))
  }
}

// Fetch single calculator topic
export const fetchAdminCalculatorTopic = (topicId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isTopicsLoading', value: true }))
    dispatch(clearError())

    const response = await getWithToken(Endpoints.calculators.admin.detail(topicId))
    const topic = response.data.data || response.data
    dispatch(setSelectedTopic(topic))
    return topic
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  } finally {
    dispatch(setLoading({ key: 'isTopicsLoading', value: false }))
  }
}

// Create calculator topic
export const createCalculatorTopic = (data) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isCreatingTopic', value: true }))
    dispatch(clearError())

    const response = await postWithToken(Endpoints.calculators.admin.create, data)
    const topic = response.data.data || response.data
    dispatch(addTopic(topic))
    return topic
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  } finally {
    dispatch(setLoading({ key: 'isCreatingTopic', value: false }))
  }
}

// Update calculator topic
export const updateCalculatorTopic = (topicId, data) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isUpdatingTopic', value: true }))
    dispatch(clearError())

    const response = await putWithToken(Endpoints.calculators.admin.update(topicId), data)
    const topic = response.data.data || response.data
    dispatch(updateTopic(topic))
    return topic
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  } finally {
    dispatch(setLoading({ key: 'isUpdatingTopic', value: false }))
  }
}

// Delete calculator topic
export const deleteCalculatorTopic = (topicId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isDeletingTopic', value: true }))
    dispatch(clearError())

    await deleteWithToken(Endpoints.calculators.admin.delete(topicId))
    dispatch(removeTopic(topicId))
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  } finally {
    dispatch(setLoading({ key: 'isDeletingTopic', value: false }))
  }
}

// ============= Constants Actions =============

/**
 * Fetch calculator constants (admin only)
 */
export const fetchCalculatorConstants = (keys = null) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isConstantsLoading', value: true }))
    dispatch(clearError())

    const queryParams = {}
    if (keys && Array.isArray(keys)) {
      queryParams.keys = keys.join(',')
    }

    const response = await getWithToken(Endpoints.calculators.admin.constants, queryParams)

    return response.data.data || {}
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  } finally {
    dispatch(setLoading({ key: 'isConstantsLoading', value: false }))
  }
}

/**
 * Update calculator constants (admin only)
 */
export const updateCalculatorConstants = (constants) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isUpdatingConstants', value: true }))
    dispatch(clearError())

    const response = await putWithToken(Endpoints.calculators.admin.constants, constants)

    return response.data.data || {}
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  } finally {
    dispatch(setLoading({ key: 'isUpdatingConstants', value: false }))
  }
}
