import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  cards: [],
  pagination: {
    page: 1,
    perPage: 20,
    isLastPage: false,
  },
  loading: {
    isFetchingCards: false,
    isAddingCard: false,
    isUpdatingCard: false,
    isDeletingCard: false,
    isMovingCard: false,
  },
}

const nodeCardsSlice = createSlice({
  name: 'nodeCards',
  initialState,
  reducers: {
    setCards(state, action) { state.cards = action.payload },
    setPagination(state, action) { state.pagination = { ...state.pagination, ...action.payload } },
    setLoading(state, action) { state.loading = { ...state.loading, ...action.payload } },
    reset() { return initialState },
  },
})

export const { actions } = nodeCardsSlice
export default nodeCardsSlice.reducer
