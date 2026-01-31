import { actions } from '@store/calculator/reducer'
import Endpoints from '@config/endpoint'
import { handleApiError } from '@utils/errorUtils'
import { getWithToken, postWithToken, putWithToken, deleteWithToken } from '../../utils/requestUtils'

const {
  setLoading,
  setDetail,
  setTopics,
  updatePagination,
} = actions

// Fetch all calculator topics (admin)
export const fetchAdminCalculatorTopics = () => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ key: 'isGetListCalculatorsLoading', value: true }))

    const { filters, pagination } = getState().calculator

    const requestQuery = {
      page: pagination.page,
      perPage: pagination.perPage
    }
    if (filters.name) requestQuery.name = filters.name
    if (filters.tagName) requestQuery.tagName = filters.tagName

    const route = Endpoints.admin.calculators
    const response = await getWithToken(route, requestQuery)

    const responseData = response.data.data || response.data

    // Handle paginated response
    dispatch(setTopics(responseData.topics))
    dispatch(updatePagination(responseData.pagination))
  } finally {
    dispatch(setLoading({ key: 'isGetListCalculatorsLoading', value: false }))
  }
}

// Fetch single calculator topic
export const fetchAdminCalculatorTopic = (topicId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isGetDetailCalculatorLoading', value: true }))
    
    const route = Endpoints.admin.calculators + `/${topicId}`
    const response = await getWithToken(route)
    const topic = response.data.data || response.data
    dispatch(setDetail(topic))
    return topic
  } finally {
    dispatch(setLoading({ key: 'isGetDetailCalculatorLoading', value: false }))
  }
}

// Create calculator topic
export const createCalculatorTopic = (data, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isCreateCalculatorLoading', value: true }))
    
    const route = Endpoints.admin.calculators
    await postWithToken(route, data)
    if (onSuccess) onSuccess()
  } finally {
    dispatch(setLoading({ key: 'isCreateCalculatorLoading', value: false }))
  }
}

// Update calculator topic
export const updateCalculatorTopic = (topicId, data) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isUpdateCalculatorLoading', value: true }))
    
    const route = Endpoints.admin.calculators + `/${topicId}`
    await putWithToken(route, data)
  } finally {
    dispatch(setLoading({ key: 'isUpdateCalculatorLoading', value: false }))
  }
}

// Delete calculator topic
export const deleteCalculatorTopic = (topicId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isDeleteCalculatorLoading', value: true }))
    
    const route = Endpoints.admin.calculators + `/${topicId}`
    await deleteWithToken(route)
  } finally {
    dispatch(setLoading({ key: 'isDeleteCalculatorLoading', value: false }))
  }
}

export const getCalculatorTopics = () => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ key: 'isGetListCalculatorsLoading', value: true }))

    const { filters, pagination } = getState().calculator

    const requestQuery = {
      page: pagination.page,
      perPage: pagination.perPage
    }
    if (filters.name) requestQuery.name = filters.name
    if (filters.tagName) requestQuery.tagName = filters.tagName

    const route = Endpoints.api.calculators + "/topics"
    const response = await getWithToken(route, requestQuery)

    const responseData = response.data.data || response.data

    // Handle paginated response
    dispatch(setTopics(responseData.topics))
    dispatch(updatePagination(responseData.pagination))
  } finally {
    dispatch(setLoading({ key: 'isGetListCalculatorsLoading', value: false }))
  }
}

export const getCalculatorTopicDetail = (id) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isGetDetailCalculatorLoading', value: true }))
    
    const route = Endpoints.api.calculators + `/topics/${id}`
    const response = await getWithToken(route)
    dispatch(setDetail(response.data.data || response.data || []))
  } finally {
    dispatch(setLoading({ key: 'isGetDetailCalculatorLoading', value: false }))
  }
}

export const calculateResult = (id, inputs) => async (dispatch) => {
    try {
        dispatch(setLoading({ key: 'isCalculateResultLoading', value: true }))

        const route = Endpoints.api.calculators + `/${id}/calculate`
        const response = await postWithToken(route, inputs)
        return response.data.data
    } catch {
        // no need to handle anything because already handled in api.jsx
    } finally {
        dispatch(setLoading({ key: 'isCalculateResultLoading', value: false }))
    }
}
