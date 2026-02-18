import { actions } from '@store/calculator/reducer'
import Endpoints from '@config/endpoint'
import { getWithToken, postWithToken } from '../../utils/requestUtils'

const {
  setLoading,
  setDetail,
  setTopics,
  updatePagination,
} = actions

export const getCalculatorTopics = () => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ key: 'isGetListCalculatorsLoading', value: true }))

    const { filters, pagination } = getState().calculator

    const requestQuery = {
      page: pagination.page,
      perPage: pagination.perPage
    }
    if (filters.search) requestQuery.search = filters.search
    if (filters.tagName) requestQuery.tagName = filters.tagName

    const route = Endpoints.api.calculators + "/topics"
    const response = await getWithToken(route, requestQuery)

    const responseData = response.data.data || response.data

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
    dispatch(setDetail(response.data.data))
  } finally {
    dispatch(setLoading({ key: 'isGetDetailCalculatorLoading', value: false }))
  }
}

export const calculateResult = (id, inputs, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isCalculateResultLoading', value: true }))

    const route = Endpoints.api.calculators + `/${id}/calculate`
    const response = await postWithToken(route, inputs)
    if (onSuccess) onSuccess(response.data.data)
  } finally {
    dispatch(setLoading({ key: 'isCalculateResultLoading', value: false }))
  }
}
