import { actions } from './reducer'
import Endpoints from '@config/endpoint'
import { getWithToken, postWithToken } from '@utils/requestUtils'

export const fetchFavorites = (recordType) => async (dispatch) => {
  try {
    dispatch(actions.setLoading({ isFetching: true }))
    const res = await getWithToken(Endpoints.api.favorites, { recordType })
    const items = res.data.data || []
    dispatch(actions.setFavorites({
      recordType,
      ids: items.map(r => r.record_id),
      items,
    }))
  } finally {
    dispatch(actions.setLoading({ isFetching: false }))
  }
}

export const toggleFavorite = (recordType, recordId, noteMetadata = null) => async (dispatch) => {
  try {
    dispatch(actions.setLoading({ isToggling: true }))
    const res = await postWithToken(`${Endpoints.api.favorites}/toggle`, { recordType, recordId })
    const { isFavorited } = res.data.data
    dispatch(actions.setFavorited({
      recordType,
      recordId,
      isFavorited,
      item: isFavorited ? { record_id: recordId, metadata: noteMetadata } : null,
    }))
  } finally {
    dispatch(actions.setLoading({ isToggling: false }))
  }
}
