import { actions } from '@store/oscePractice/v2/reducer'
import Endpoints from '@config/endpoint'
import { getWithToken } from '@utils/requestUtils'

const {
  setLoading,
  setHub,
  setStations,
  appendStations,
  setHistory,
  appendHistory,
  setStationsPagination,
  setHistoryPagination,
} = actions

const base = Endpoints.api.oscePracticeV2

// The left rail in one read: the session to resume with its clock and what it still owes the
// rubric, the counted states, and the last station that was marked.
export const fetchOsceHub = () => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isFetchingHub', value: true }))
    const response = await getWithToken(`${base}/hub`)
    dispatch(setHub(response.data.data ?? null))
  } finally {
    dispatch(setLoading({ key: 'isFetchingHub', value: false }))
  }
}

// Always fetches whatever page the reducer currently says; `append` only picks setStations vs
// appendStations. Filters are read from state too, so the rail's performance rows can filter
// this panel by dispatching updateFilter and calling this with no arguments.
export const fetchOsceStations = ({ append = false } = {}) => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ key: 'isFetchingStations', value: true }))

    const { filter, stationsPagination } = getState().oscePracticeV2
    const queryParams = { page: stationsPagination.page, perPage: stationsPagination.perPage }
    if (filter.search) queryParams.search = filter.search
    if (filter.topicTag) queryParams.topicTag = filter.topicTag
    if (filter.batchTag) queryParams.batchTag = filter.batchTag

    const response = await getWithToken(`${base}/stations`, queryParams)
    const stations = response.data.data || []

    dispatch(append ? appendStations(stations) : setStations(stations))
    if (response.data.pagination) dispatch(setStationsPagination(response.data.pagination))

    return stations
  } finally {
    dispatch(setLoading({ key: 'isFetchingStations', value: false }))
  }
}

export const loadMoreOsceStations = () => (dispatch, getState) => {
  const { stationsPagination } = getState().oscePracticeV2
  if (stationsPagination.isLastPage) return

  dispatch(setStationsPagination({ page: stationsPagination.page + 1 }))
  dispatch(fetchOsceStations({ append: true }))
}

export const fetchOsceHistory = ({ append = false } = {}) => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ key: 'isFetchingHistory', value: true }))

    const { historyFilter, historyPagination } = getState().oscePracticeV2
    const queryParams = { page: historyPagination.page, perPage: historyPagination.perPage }
    if (historyFilter.status) queryParams.status = historyFilter.status

    const response = await getWithToken(`${base}/sessions`, queryParams)
    const sessions = response.data.data || []

    dispatch(append ? appendHistory(sessions) : setHistory(sessions))
    if (response.data.pagination) dispatch(setHistoryPagination(response.data.pagination))

    return sessions
  } finally {
    dispatch(setLoading({ key: 'isFetchingHistory', value: false }))
  }
}

export const loadMoreOsceHistory = () => (dispatch, getState) => {
  const { historyPagination } = getState().oscePracticeV2
  if (historyPagination.isLastPage) return

  dispatch(setHistoryPagination({ page: historyPagination.page + 1 }))
  dispatch(fetchOsceHistory({ append: true }))
}
