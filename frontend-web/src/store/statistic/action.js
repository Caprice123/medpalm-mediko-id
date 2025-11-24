import { actions } from '@store/statistic/reducer'
import Endpoints from '@config/endpoint'
import { handleApiError } from '@utils/errorUtils'
import { getPublic } from '@utils/requestUtils'

const {
  setStatistics,
  setLoading,
  clearError
} = actions

/**
 * Fetch platform statistics (public endpoint)
 */
export const fetchStatistics = () => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isLoadingStatistics', value: true }))
    dispatch(clearError())

    const response = await getPublic(Endpoints.statistics.list)

    const data = response.data.data

    dispatch(setStatistics(data))
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isLoadingStatistics', value: false }))
  }
}
