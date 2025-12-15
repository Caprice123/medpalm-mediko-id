import { actions } from '@store/calculator/reducer'
import Endpoints from '@config/endpoint'
import { handleApiError } from '@utils/errorUtils'
import { getWithToken, putWithToken } from '../../utils/requestUtils'

const {
  setLoading,
  setConstants,
} = actions

export const fetchConstants = () => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ key: 'isGetListConstantsLoading', value: true }))
    
    const { keys } = getState().constants
    const queryParams = {}
    if (keys && Array.isArray(keys)) {
      queryParams.keys = keys.join(',')
    }

    const response = await getWithToken(Endpoints.admin.constants, queryParams)
    const { data } = response.data
    dispatch(setConstants(data))
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isGetListConstantsLoading', value: false }))
  }
}

export const updateCalculatorConstants = (constants) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isUpdateConstantLoading', value: true }))
    
    await putWithToken(Endpoints.admin.constants, constants)
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isUpdateConstantLoading', value: false }))
  }
}
