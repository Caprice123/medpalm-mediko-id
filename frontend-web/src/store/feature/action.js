import { actions } from '@store/feature/reducer'
import Endpoints from '@config/endpoint'
import { handleApiError } from '@utils/errorUtils'
import axios from 'axios'

const {
  setFeatures,
  setLoading,
} = actions

/**
 * Fetch all active features (public endpoint)
 */
export const fetchFeatures = () => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isLoadingFeatures', value: true }))
    
    const route = Endpoints.api.features
    console.log(import.meta.env.VITE_API_BASE_URL + route)
    const response = await axios.get(import.meta.env.VITE_API_BASE_URL + route)

    const data = response.data.data

    dispatch(setFeatures(data))
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isLoadingFeatures', value: false }))
  }
}
