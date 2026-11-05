import { createSlice } from '@reduxjs/toolkit'

// Admin state for Diagnostic V2 cases. Separate from the shared `nodeQuestions` slice,
// which MCQ V2 also writes to and whose unit is a single question.
const initialState = {
  cases: [],
  pagination: {
    page: 1,
    perPage: 20,
    isLastPage: false,
  },
  loading: {
    isFetchingCases: false,
    isAddingCase: false,
    isUpdatingCase: false,
    isDeletingCase: false,
    isMovingCase: false,
    isImportingCases: false,
  },
}

const diagnosticCasesSlice = createSlice({
  name: 'diagnosticCases',
  initialState,
  reducers: {
    setCases(state, action) { state.cases = action.payload },
    appendCases(state, action) { state.cases = [...state.cases, ...action.payload] },
    setPagination(state, action) { state.pagination = { ...state.pagination, ...action.payload } },
    setLoading(state, action) { state.loading = { ...state.loading, ...action.payload } },
    reset() { return initialState },
  },
})

export const { actions } = diagnosticCasesSlice
export default diagnosticCasesSlice.reducer
