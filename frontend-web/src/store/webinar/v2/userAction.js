import { actions } from '@store/webinar/v2/reducer'
import Endpoints from '@config/endpoint'
import { getWithToken, postWithToken } from '@utils/requestUtils'

const {
  setLoading,
  setFeatured,
  setWebinars,
  appendWebinars,
  setMyRegistrations,
  setPagination,
} = actions

// The billboard's webinar. `GET /api/v1/webinars` orders by start_at ascending,
// so the first row of the `open` filter is the nearest webinar a student can
// still register for. Kept out of the list request so switching the list filter
// never moves the lead.
export const fetchFeaturedWebinar = () => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isFetchingFeatured', value: true }))
    const response = await getWithToken(Endpoints.api.webinars, {
      page: 1,
      perPage: 1,
      registrationStatus: 'open',
    })
    dispatch(setFeatured(response.data.data?.[0] ?? null))
  } finally {
    dispatch(setLoading({ key: 'isFetchingFeatured', value: false }))
  }
}

// Always fetches whatever page the reducer currently says; `append` only picks
// setWebinars vs appendWebinars.
export const fetchWebinars = ({ append = false } = {}) => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ key: 'isFetchingWebinars', value: true }))

    const { filter, pagination } = getState().webinarV2
    const queryParams = { page: pagination.page, perPage: pagination.perPage }
    if (filter.search) queryParams.search = filter.search
    if (filter.registrationStatus && filter.registrationStatus !== 'all') {
      queryParams.registrationStatus = filter.registrationStatus
    }

    const response = await getWithToken(Endpoints.api.webinars, queryParams)
    const rows = response.data.data || []
    dispatch(append ? appendWebinars(rows) : setWebinars(rows))
    if (response.data.pagination) dispatch(setPagination(response.data.pagination))
  } finally {
    dispatch(setLoading({ key: 'isFetchingWebinars', value: false }))
  }
}

export const loadMoreWebinars = () => (dispatch, getState) => {
  const { pagination } = getState().webinarV2
  if (pagination.isLastPage) return
  dispatch(setPagination({ page: pagination.page + 1 }))
  dispatch(fetchWebinars({ append: true }))
}

export const fetchMyRegistrations = () => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isFetchingMyRegistrations', value: true }))
    const response = await getWithToken(`${Endpoints.api.webinars}/my-registrations`, {
      page: 1,
      perPage: 50,
    })
    dispatch(setMyRegistrations(response.data.data || []))
  } finally {
    dispatch(setLoading({ key: 'isFetchingMyRegistrations', value: false }))
  }
}

export const registerWebinar = (uniqueId, blobIds, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isRegistering', value: true }))
    await postWithToken(`${Endpoints.api.webinars}/${uniqueId}/register`, { blobIds })
    if (onSuccess) onSuccess()
  } finally {
    dispatch(setLoading({ key: 'isRegistering', value: false }))
  }
}
