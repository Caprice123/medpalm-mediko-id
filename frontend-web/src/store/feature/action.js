import { actions } from '@store/feature/reducer'
import Endpoints from '@config/endpoint'
import { handleApiError } from '@utils/errorUtils'
import { getWithToken } from '@utils/requestUtils'
import axios from 'axios'

const {
  setFeatures,
  setLoading,
} = actions

/**
 * Fetch all active features (public endpoint for user panel)
 */
export const fetchFeatures = () => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isLoadingFeatures', value: true }))

    const route = Endpoints.api.features
    const response = await axios.get(import.meta.env.VITE_API_BASE_URL + route)

    const data = response.data.data

    dispatch(setFeatures(data))
  } catch(err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isLoadingFeatures', value: false }))
  }
}

/**
 * Fetch features filtered by admin user permissions (admin endpoint)
 */
export const fetchAdminFeatures = () => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isLoadingFeatures', value: true }))

    const response = await getWithToken(Endpoints.admin.features)
    const data = response.data.data

    dispatch(setFeatures(data))
  } catch(err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isLoadingFeatures', value: false }))
  }
}
