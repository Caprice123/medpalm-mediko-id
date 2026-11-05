import { createSlice } from '@reduxjs/toolkit'
import { resetAllState } from '../../globalAction'

// OSCE Practice V2 keeps its own slice rather than extending `state.oscePractice`. That slice is
// the session engine — detail, messages, physical-exam interactions, end/evaluate — and the V2
// station room and debrief still read it unchanged. What V2 adds is the hub's own shape: one
// resumable session, stations carrying the student's own record, and history rows that know
// their last page. Mixing those into the engine's slice would make the archived V1 pages and
// the live V2 board fight over the same `userTopics` / `userSessions` arrays.
const initialState = {
  // { resumable, completedCount, lastResult, totalPracticeSeconds } — the left rail's content.
  hub: null,
  stations: [],
  history: [],
  // Read by the action before it builds query params, so a filter change and a page reset are
  // one dispatch each rather than arguments threaded through the thunk.
  filter: {
    search: '',
    topicTag: '',
    batchTag: '',
  },
  historyFilter: {
    status: '',
  },
  stationsPagination: {
    page: 1,
    perPage: 10,
    isLastPage: false,
  },
  historyPagination: {
    page: 1,
    perPage: 8,
    isLastPage: false,
  },
  loading: {
    isFetchingHub: false,
    isFetchingStations: false,
    isFetchingHistory: false,
  },
}

const { reducer, actions } = createSlice({
  name: 'oscePracticeV2',
  initialState,
  reducers: {
    setLoading: (state, { payload: { key, value } }) => {
      state.loading[key] = value
    },
    setHub: (state, { payload }) => {
      state.hub = payload
    },
    // The resumable session's clock counts down in the browser; writing it back here keeps the
    // rail and any other reader on one number instead of each holding its own interval.
    setResumableRemainingSeconds: (state, { payload }) => {
      if (state.hub?.resumable) {
        state.hub.resumable.remainingSeconds = Math.max(0, payload)
      }
    },
    setStations: (state, { payload }) => {
      state.stations = payload
    },
    appendStations: (state, { payload }) => {
      state.stations = [...state.stations, ...payload]
    },
    setHistory: (state, { payload }) => {
      state.history = payload
    },
    appendHistory: (state, { payload }) => {
      state.history = [...state.history, ...payload]
    },
    updateFilter: (state, { payload: { key, value } }) => {
      state.filter[key] = value
    },
    updateHistoryFilter: (state, { payload: { key, value } }) => {
      state.historyFilter[key] = value
    },
    setStationsPagination: (state, { payload }) => {
      state.stationsPagination = { ...state.stationsPagination, ...payload }
    },
    setHistoryPagination: (state, { payload }) => {
      state.historyPagination = { ...state.historyPagination, ...payload }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetAllState, () => initialState)
  },
})

export { actions }
export default reducer
