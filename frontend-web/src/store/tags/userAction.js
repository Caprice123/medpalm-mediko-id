import { actions } from '@store/tags/reducer'
import Endpoints from '@config/endpoint'
import { getWithToken } from '../../utils/requestUtils'

const {
  setLoading,
  setTags,
} = actions

export const fetchTags = () => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ key: 'isGetListTagsLoading', value: true }))

    const { tagGroupNames } = getState().tags.filter
    const queryParams = {}
    if (tagGroupNames) queryParams.tagGroupNames = tagGroupNames.join(",")

    const route = Endpoints.api.tags
    const response = await getWithToken(route, queryParams)
    const { data } = response.data
    dispatch(setTags(data))
  } finally {
    dispatch(setLoading({ key: 'isGetListTagsLoading', value: false }))
  }
}
