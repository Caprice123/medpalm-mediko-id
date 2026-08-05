import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  cards: [],
  pagination: { page: 1, perPage: 20, isLastPage: false },
  loading: {
    isFetchingCards: false,
    isUpdatingCard: false,
    isDeletingCard: false,
    isAssigningCard: false,
  },
}

const unlinkedCardsSlice = createSlice({
  name: 'unlinkedCards',
  initialState,
  reducers: {
    setCards(state, action) { state.cards = action.payload },
    appendCards(state, action) { state.cards = [...state.cards, ...action.payload] },
    setPagination(state, action) { state.pagination = { ...state.pagination, ...action.payload } },
    setLoading(state, action) { state.loading = { ...state.loading, ...action.payload } },
    reset() { return initialState },
  },
})

export const { actions } = unlinkedCardsSlice
export default unlinkedCardsSlice.reducer
