import { actions } from '@store/featureV2/reducer'
import Endpoints from '@config/endpoint'
import { handleApiError } from '@utils/errorUtils'
import axios from 'axios'

const { setFeatures, setLoading } = actions

export const fetchFeaturesV2 = () => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isLoadingFeatures', value: true }))
    const response = await axios.get(import.meta.env.VITE_API_BASE_URL + Endpoints.api.featuresV2)
    dispatch(setFeatures(response.data.data))
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isLoadingFeatures', value: false }))
  }
}
