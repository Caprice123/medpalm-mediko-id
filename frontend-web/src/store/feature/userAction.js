import { actions } from '@store/feature/reducer'
import Endpoints from '@config/endpoint'
import { handleApiError } from '@utils/errorUtils'
import axios from 'axios'
import { captureException } from '../../config/sentry'

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
    captureException(err, {
        url: import.meta.env.VITE_API_BASE_URL + Endpoints.api.features,
        status: err.response?.status,
        responseData: err.response?.data,
        method: err.config?.method,
    })
  } finally {
    dispatch(setLoading({ key: 'isLoadingFeatures', value: false }))
  }
}
