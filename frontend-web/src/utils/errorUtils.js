import { actions } from "@store/common/reducer";
import axios from "axios";

const { setError } = actions

const isDev = import.meta.env.MODE === 'development';

export const handleApiError = (err, dispatch) => {
    if (isDev) {
        console.error('[API Error]', err);
    }

    if (axios.isAxiosError(err)) {
        if (err.response) {
            const error = err.response.data.error;
            dispatch(setError(error));
        } else if (err.code === "ERR_NETWORK") {
            const errorMessage = "Sistem tidak dapat konek ke server.";
            dispatch(setError({ message: errorMessage, code: "CORS_ERROR" }));
        } else {
            const errorMessage = "An unknown error occurred.";
            dispatch(setError({ message: errorMessage, code: "UNKNOWN_ERROR" }));
        }
    } else {
        const errorMessage = "An unexpected error occurred.";
        dispatch(setError({ message: errorMessage, code: "UNEXPECTED_ERROR" }));
    }
}