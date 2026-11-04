import { actions } from '@store/event/v2/reducer'
import Endpoints from '@config/endpoint'
import { getWithToken, postWithToken } from '@utils/requestUtils'

const {
  setLoading,
  setClaimable,
  appendClaimable,
  setClaims,
  setPagination,
} = actions

// Track one. Hits /api/v2/events, whose `claimState: 'open'` lets a null
// registration bound through — V1's `open` filter requires both bounds to be
// set and silently drops a window-less event.
export const fetchClaimableEvents = ({ append = false } = {}) => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ key: 'isFetchingClaimable', value: true }))

    const { filter, pagination } = getState().eventV2
    const queryParams = {
      page: pagination.page,
      perPage: pagination.perPage,
      claimState: 'open',
    }
    if (filter.search) queryParams.search = filter.search

    const response = await getWithToken(Endpoints.api.eventsV2, queryParams)
    const rows = response.data.data || []
    dispatch(append ? appendClaimable(rows) : setClaimable(rows))
    if (response.data.pagination) dispatch(setPagination(response.data.pagination))
  } finally {
    dispatch(setLoading({ key: 'isFetchingClaimable', value: false }))
  }
}

export const loadMoreClaimableEvents = () => (dispatch, getState) => {
  const { pagination } = getState().eventV2
  if (pagination.isLastPage) return
  dispatch(setPagination({ page: pagination.page + 1 }))
  dispatch(fetchClaimableEvents({ append: true }))
}

// Track two. Still on the V1 route: only the list filtering needed a V2, and
// my-registrations has no equivalent bug.
export const fetchMyClaims = () => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isFetchingClaims', value: true }))
    const response = await getWithToken(`${Endpoints.api.events}/my-registrations`, {
      page: 1,
      perPage: 50,
    })
    dispatch(setClaims(response.data.data || []))
  } finally {
    dispatch(setLoading({ key: 'isFetchingClaims', value: false }))
  }
}

export const claimEvent = (code, blobIds, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isClaiming', value: true }))
    await postWithToken(`${Endpoints.api.events}/${code}/register`, { blobIds })
    if (onSuccess) onSuccess()
  } finally {
    dispatch(setLoading({ key: 'isClaiming', value: false }))
  }
}
