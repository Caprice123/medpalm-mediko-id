import { actions } from "@store/auth/reducer"
import api from "@config/api"
import Endpoints from "@config/endpoint"
import { removeToken, removeUser, setToken, setUser } from "@utils/authToken"
import { postWithToken } from "@utils/requestUtils"
import { handleApiError } from "@utils/errorUtils"

const { setLoading } = actions

export const login = (googleCredential, onSuccess) => async (dispatch) => {
    try {
        dispatch(setLoading({ key: "isLoginLoading", value: true }))

        const requestBody = {
            googleToken: googleCredential,
        }

        const response = await api.post(Endpoints.Login, requestBody)
        const { data } = response.data
        setUser(data.user)

        // Store new token structure with both access and refresh tokens
        const tokenData = {
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            accessTokenExpiresAt: data.accessTokenExpiresAt,
            refreshTokenExpiresAt: data.refreshTokenExpiresAt
        }
        setToken(tokenData)

        onSuccess()
    } catch(err) {
        handleApiError(err, dispatch)
    } finally {
        dispatch(setLoading({ key: "isLoginLoading", value: false }))
    }
}

export const logout = (onSuccess) => async (dispatch) => {
    try {
        dispatch(setLoading({ key: "isLogoutLoading", value: true }))

        await postWithToken(Endpoints.Logout)
        removeUser()
        removeToken()
    } catch(err) {
        handleApiError(err, dispatch)
    } finally {
        dispatch(setLoading({ key: "isLogoutLoading", value: false }))
        onSuccess()
    }
}
