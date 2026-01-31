import { createSlice } from '@reduxjs/toolkit'
import { resetAllState } from '../globalAction'

const initialState = {
  tagGroups: [],
  filter: {
    names: undefined,
  },
  loading: {
    isGetListTagGroupsLoading: false,
    isCreateTagGroupLoading: false,
  },
}

const tagsSlice = createSlice({
  name: 'tagGroups',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      const { key, value } = action.payload
      state.loading[key] = value
    },
    setTagGroups: (state, action) => {
      state.tagGroups = action.payload
    },
  },
  
    extraReducers: (builder) => {
      builder.addCase(resetAllState, (state) => ({
          ...initialState,
          loading: state.loading, // 🔥 preserve current loading state
      }));
    },
})

export const actions = tagsSlice.actions
export default tagsSlice.reducer
