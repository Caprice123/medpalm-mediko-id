import { getToken, setToken } from '@utils/authToken';
import axios from 'axios'
import endpoints from '@config/endpoint';
import { handleApiError } from '@utils/errorUtils';
import { actions as creditActions } from '@store/credit/reducer';
import { actions as pricingActions } from '@store/pricing/reducer';
import { captureException, captureMessage } from '@config/sentry';

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

let refreshPromise = null; // The single in-flight refresh, shared by both interceptors

export const refreshAccessToken = async () => {
    const token = getToken();
    const refreshResponse = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/refresh`, {
        refreshToken: token.refreshToken,
    });
    const newToken = refreshResponse.data.data;
    setToken(newToken);
    return newToken.accessToken;
};

// Never let two refreshes run at once. The backend rotates the refresh token on every
// call, so a second concurrent refresh would present an already-rotated token, fail, and
// take an otherwise healthy session down with it. Callers report their own errors; this
// only deduplicates.
const refreshOnce = () => {
    if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => { refreshPromise = null; });
    }
    return refreshPromise;
};

// Resolve a bearer token for the fetch-based streaming paths. They bypass the axios
// interceptors entirely, so they have to do this themselves — but going through
// refreshOnce means a stream that starts while a refresh is already in flight joins that
// one instead of firing a second, which the backend's refresh-token rotation would reject.
export const ensureValidToken = async () => {
    const token = getToken();

    if (!token) {
        throw new Error('No authentication token found');
    }

    if (isTokenExpired(token.accessTokenExpiresAt)) {
        return refreshOnce();
    }

    return token.accessToken;
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
                try {
                    const newAccessToken = await refreshOnce();
                    config.headers.Authorization = `Bearer ${newAccessToken}`;
                } catch (error) {
                    handleApiError(error, dispatch)
                    throw error;
                }
            } else {
                // Use the current access token if not expired
                config.headers.Authorization = `Bearer ${token.accessToken}`;
            }

            return config;
        },
    );

    // Response interceptor to handle 401, 403 errors and credit quota updates
    api.interceptors.response.use(
        (response) => {
            // Check for quota headers and update balance breakdown
            const remainingQuota = response.headers['x-remaining-quota'];
            if (remainingQuota !== undefined && dispatch) {
                const balance = parseFloat(remainingQuota);
                const update = { balance };
                if (response.headers['x-permanent-quota'] !== undefined) {
                    update.permanentBalance = parseFloat(response.headers['x-permanent-quota']);
                }
                dispatch(creditActions.setBalance(balance));
                dispatch(pricingActions.updateCreditBalance(update));
            }

            return response;
        },
        async (error) => {
            console.error('API Error Interceptor triggered:', error);
            console.error('Error response:', error.response);
            console.error('Error status:', error.response?.status);
            console.error('Error data:', error.response?.data);

            // Also check headers in error responses
            const remainingQuota = error.response?.headers?.['x-remaining-quota'];
            if (remainingQuota !== undefined && dispatch) {
                const balance = parseFloat(remainingQuota);
                const update = { balance };
                if (error.response?.headers?.['x-permanent-quota'] !== undefined) {
                    update.permanentBalance = parseFloat(error.response.headers['x-permanent-quota']);
                }
                dispatch(creditActions.setBalance(balance));
                dispatch(pricingActions.updateCreditBalance(update));
            }

            // A 401 the request interceptor's clock check did not see coming — a device
            // clock that runs behind, or a token the server rejected for a reason the
            // client cannot observe. Refresh once and replay before giving up on the
            // session. `_retried` bounds this: a 401 on the replay falls straight through
            // to the logout below instead of looping.
            if (
                error.response?.status === 401
                && error.config
                && !error.config._retried
                && error.config.url !== endpoints.Login
            ) {
                error.config._retried = true;
                try {
                    const newAccessToken = await refreshOnce();
                    error.config.headers.Authorization = `Bearer ${newAccessToken}`;
                    return api(error.config);
                } catch {
                    // Refresh failed too — the session really is gone. Fall through.
                }
            }

            // If we get a 401 error, the token is invalid or expired
            if (error.response && error.response.status === 401) {
                // Clear the token and redirect to login
                handleApiError(error, dispatch);
                setToken(null);
                navigate(SIGN_IN_ROUTE);
                return Promise.reject(error)
            }

            // If we get a 403 error, feature is disabled - redirect to dashboard with error message
            if (error.response && error.response.status === 403) {
                // Redirect to dashboard
                handleApiError(error, dispatch);
                navigate('/dashboard');
                return Promise.reject(error)
            }

            // Handle 500 errors (silent for finalize/truncate — caller handles those)
            if (error.response && error.response.status >= 500) {
                console.error('Server error (500):', error.response.data);
                const url = error.config?.url || ''
                const isSilent = url.includes('/finalize') || url.includes('/truncate')
                if (!isSilent) {
                    captureException(error, {
                        url,
                        status: error.response.status,
                        responseData: error.response?.data,
                        method: error.config?.method,
                    })
                    handleApiError(error, dispatch);
                }
                return
            }

            if (error.response && error.response.status >= 400) {
                handleApiError(error, dispatch);
                if (error.response.status === 400) {
                    const message = error.response.data?.error?.message || 'Bad Request'
                    captureMessage(message, 'warning', {
                        url: error.config?.url,
                        method: error.config?.method,
                        status: 400,
                        responseData: error.response.data,
                    })
                }
            }

            return Promise.reject(error);
        }
    );
};


export default api
