import { actions } from '@store/tagGroups/reducer'
import Endpoints from '@config/endpoint'
import { handleApiError } from '@utils/errorUtils'
import { getWithToken } from '../../utils/requestUtils'

const {
  setLoading,
  setTagGroups,
} = actions

export const fetchTagGroups = () => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ key: 'isGetListTagGroupsLoading', value: true }))

    const queryParams = {}

      // Otherwise, check state
    const { names } = getState().tagGroups.filter
    if (names) queryParams.name = names.join(',')

    const route = Endpoints.tagGroups
    const response = await getWithToken(route, queryParams)
    const { data } = response.data
    dispatch(setTagGroups(data))
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isGetListTagGroupsLoading', value: false }))
  }
}
