import api from "@config/api";
import { getToken } from "./authToken";

function makeRequestWithToken(
    method, 
    url,
    params,
    requestBody,
    additionalHeaders,
    additionalConfig = {},
) {
    const token = getToken()
    
    const isFormData = typeof FormData !== "undefined" && requestBody instanceof FormData;
    
    const headers = { ...additionalHeaders, "Authorization": `Bearer ${token}`}

    if (isFormData) {
        headers["Content-Type"] = "multipart/form-data"
    } else {
        headers["Content-Type"] = "application/json"
    }

    return api({
        method: method,
        params: params,
        url: url,
        data: requestBody,
        headers: headers,
        ...additionalConfig,
    })
}

export function getWithToken(url, params = null, additionalHeaders = {}) {
    return makeRequestWithToken("GET", url, params, null, additionalHeaders);
}

export function downloadWithToken(url, params = null, additionalHeaders = {}) {
    return makeRequestWithToken("GET", url, params, null, additionalHeaders, { responseType: "blob" });
}

export function postWithToken(url, requestBody = null, additionalHeaders = {}) {
    return makeRequestWithToken("POST", url, null, requestBody, additionalHeaders);
}

export function putWithToken(url, requestBody = null, additionalHeaders = {}) {
    return makeRequestWithToken("PUT", url, null, requestBody, additionalHeaders)
}

export function patchWithToken(url, requestBody = null, additionalHeaders = {}) {
    return makeRequestWithToken("PATCH", url, null, requestBody, additionalHeaders)
}

export function deleteWithToken(url, additionalHeaders = {}) {
    return makeRequestWithToken("DELETE", url, null, {}, additionalHeaders)
}

// Public request methods (no authentication required)
export function getPublic(url, params = null) {
    return api({
        method: "GET",
        params: params,
        url: url,
        headers: { "Content-Type": "application/json" }
    })
}
