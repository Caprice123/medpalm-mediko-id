import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  tags: [],
  filter: {
    tagGroup: undefined,
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
  }
})

export const actions = tagsSlice.actions
export default tagsSlice.reducer
