import { actions } from '@store/constant/reducer'
import Endpoints from '@config/endpoint'
import { getPublic } from '../../utils/requestUtils'

const { setLoading, setConstants } = actions

export const fetchPublicConstants = (keys) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isGetListConstantsLoading', value: true }))
    const queryParams = keys && keys.length ? { keys: keys.join(',') } : {}
    const response = await getPublic(Endpoints.api.constants, queryParams)
    const { data } = response.data
    dispatch(setConstants(data))
    return data
  } finally {
    dispatch(setLoading({ key: 'isGetListConstantsLoading', value: false }))
  }
}
