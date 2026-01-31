import { createSlice } from '@reduxjs/toolkit'
import { resetAllState } from '../globalAction'

const initialState = {
  tags: [],
  filter: {
    tagGroupNames: undefined,
  },
  loading: {
    isGetListTagsLoading: false,
    isCreateTagLoading: false,
    isUpdateTagLoading: false,
  },
}

const tagsSlice = createSlice({
  name: 'tags',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      const { key, value } = action.payload
      state.loading[key] = value
    },
    setTags: (state, action) => {
      state.tags = action.payload
    },
    updateFilter: (state, action) => {
      const { key, value } = action.payload
      console.log(key, value)
      state.filter[key] = value
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
