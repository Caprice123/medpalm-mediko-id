import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  favoritedIds: {},   // { [recordType]: [recordId, ...] } — for quick isFavorited check
  favoriteItems: {},  // { [recordType]: [{id, recordId, metadata}] } — for section display
  loading: {
    isFetching: false,
    isToggling: false,
  },
}

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    setFavorites(state, { payload: { recordType, ids, items } }) {
      state.favoritedIds[recordType] = ids
      state.favoriteItems[recordType] = items
    },
    setFavorited(state, { payload: { recordType, recordId, isFavorited, item } }) {
      if (!state.favoritedIds[recordType]) state.favoritedIds[recordType] = []
      if (!state.favoriteItems[recordType]) state.favoriteItems[recordType] = []

      if (isFavorited) {
        if (!state.favoritedIds[recordType].includes(recordId)) {
          state.favoritedIds[recordType].unshift(recordId)
        }
        if (item && !state.favoriteItems[recordType].find(i => i.record_id === recordId)) {
          state.favoriteItems[recordType].unshift(item)
        }
      } else {
        state.favoritedIds[recordType] = state.favoritedIds[recordType].filter(id => id !== recordId)
        state.favoriteItems[recordType] = state.favoriteItems[recordType].filter(i => i.record_id !== recordId)
      }
    },
    setLoading(state, { payload }) {
      state.loading = { ...state.loading, ...payload }
    },
  },
})

export const { actions } = favoritesSlice
export default favoritesSlice.reducer
