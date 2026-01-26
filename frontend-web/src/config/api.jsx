import { getToken, setToken } from '@utils/authToken';
import axios from 'axios'
import endpoints from '@config/endpoint';
import { handleApiError } from '@utils/errorUtils';

// Define sign-in route directly to avoid circular dependency
const SIGN_IN_ROUTE = '/sign-in';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
})

const isTokenExpired = (isoString) => {
    const now = new Date(); // Current date and time
    const targetDate = new Date(isoString); // Convert ISO string to Date object
    return targetDate < now; // Check if the target date is before now
};

let isRefreshing = false; // Tracks if a refresh request is ongoing
let refreshPromise = null; // Holds the promise of the ongoing refresh

export const refreshAccessToken = async () => {
    const token = getToken();
    const refreshResponse = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/refresh`, {
        refreshToken: token.refreshToken,
    });
    const newToken = refreshResponse.data.data;
    setToken(newToken);
    return newToken.accessToken;
};

const trimSpaces = (data) => {
    if (typeof data === "string") {
      return data.trim(); // Trim leading and trailing spaces
    } else if (Array.isArray(data)) {
      return data.map(trimSpaces); // Recursively trim array elements
    } else if (typeof data === "object" && data !== null) {
      return Object.fromEntries(
        Object.entries(data).map(([key, value]) => [key, trimSpaces(value)])
      );
    }
    return data;
  }; 

export const setupAxiosInterceptors = (navigate, dispatch) => {
    api.interceptors.request.use(
        async (config) => {
            if (config.url == endpoints.Login) {
                return config
            }

            const isFormData = typeof FormData !== "undefined" && config.data instanceof FormData;
            if (!isFormData && config.params) {
                config.params = trimSpaces(config.params); // Trim query params
            }

            if (!isFormData && config.data) {
                config.data = trimSpaces(config.data); // Trim request body
            }

            const token = getToken();
            if (token == null) {
                navigate(SIGN_IN_ROUTE)
                return config;
            }

            // Redirect to login if the refresh token is expired
            if (isTokenExpired(token.refreshTokenExpiresAt)) {
                navigate(SIGN_IN_ROUTE);
                return config;
            }

            // If the access token is expired, refresh it
            if (isTokenExpired(token.accessTokenExpiresAt)) {
                if (!isRefreshing) {
                    isRefreshing = true;
                    refreshPromise = refreshAccessToken()
                        .then((newAccessToken) => {
                            isRefreshing = false;
                            refreshPromise = null;
                            return newAccessToken;
                        })
                        .catch((error) => {
                            isRefreshing = false;
                            refreshPromise = null;
                            handleApiError(error, dispatch)
                            navigate(SIGN_IN_ROUTE);
                            throw error;
                        });
                }

                // Wait for the ongoing refresh token request
                const newAccessToken = await refreshPromise;
                config.headers.Authorization = `Bearer ${newAccessToken}`;
            } else {
                // Use the current access token if not expired
                config.headers.Authorization = `Bearer ${token.accessToken}`;
            }

            return config;
        },
    );

    // Response interceptor to handle 401 errors
    api.interceptors.response.use(
        (response) => response,
        (error) => {
            // If we get a 401 error, the token is invalid or expired
            if (error.response && error.response.status === 401) {
                // Clear the token and redirect to login
                setToken(null);
                navigate(SIGN_IN_ROUTE);
            }
            return Promise.reject(error);
        }
    );
};


export default api
