import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    error: undefined,
    loading: {
        isUploading: false,
    }
}

const { reducer, actions } = createSlice({
    name: 'common',
    initialState,
    reducers: {
        setError: (state, { payload } ) => {
            state.error = payload
        },
        setLoading: (state, action) => {
            const { key, value } = action.payload
            state.loading[key] = value
        },
        resetError: (state) => {
            state.error = initialState.error
        }
    },
})

export { actions }
export default reducer
