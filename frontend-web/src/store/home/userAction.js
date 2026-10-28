import { actions } from '@store/home/reducer'
import Endpoints from '@config/endpoint'
import { getPublic } from '../../utils/requestUtils'

const { setLoading, setStats } = actions

// The landing page is reachable logged-out, so this goes through getPublic —
// no Authorization header.
export const fetchHomeStats = () => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isFetchingStats', value: true }))
    const response = await getPublic(Endpoints.api.homeStatsV2)
    const { data } = response.data
    dispatch(setStats(data))
    return data
  } finally {
    dispatch(setLoading({ key: 'isFetchingStats', value: false }))
  }
}
