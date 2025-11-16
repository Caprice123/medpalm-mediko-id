const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

export default {
    Root: "/",
    Login: "/api/v1/login",
    Logout: "/api/v1/logout",
    creditPlans: `${API_BASE_URL}/api/credit-plans`,
    credits: `${API_BASE_URL}/api/credits`,
    tags: {
        list: `${API_BASE_URL}/api/v1/tags`,
        create: `${API_BASE_URL}/api/v1/tags`,
        update: (id) => `${API_BASE_URL}/api/v1/tags/${id}`,
        delete: (id) => `${API_BASE_URL}/api/v1/tags/${id}`,
    },
    exercises: {
        // User endpoints
        topics: `${API_BASE_URL}/api/v1/exercises/topics`,
        createTopic: `${API_BASE_URL}/api/v1/exercises/topics`,

        // Admin endpoints
        admin: {
            generate: `${API_BASE_URL}/admin/v1/exercises/generate`,
            generateFromPDF: `${API_BASE_URL}/admin/v1/exercises/generate-from-pdf`,
            topics: `${API_BASE_URL}/admin/v1/exercises/topics`,
            topic: (id) => `${API_BASE_URL}/admin/v1/exercises/topics/${id}`,
            constants: `${API_BASE_URL}/admin/v1/exercises/constants`,
        }
    },
    sessions: {
        create: `${API_BASE_URL}/api/v1/sessions`,
        list: `${API_BASE_URL}/api/v1/sessions`,
        detail: (sessionId) => `${API_BASE_URL}/api/v1/sessions/${sessionId}`,
        exercise: {
            create: `${API_BASE_URL}/api/v1/sessions/exercise`,
            attempts: {
                get: (learningSessionId) => `${API_BASE_URL}/api/v1/exercises/${learningSessionId}/attempts`,
                detail: (attemptId) => `${API_BASE_URL}/api/v1/exercises/attempts/${attemptId}`,
                create: (learningSessionId) => `${API_BASE_URL}/api/v1/exercises/${learningSessionId}/attempts`,
                start: (attemptId) => `${API_BASE_URL}/api/v1/exercises/attempts/${attemptId}/start`,
                complete: (attemptId) => `${API_BASE_URL}/api/v1/exercises/attempts/${attemptId}/complete`,
            }
        }
    },
    features: {
        list: `${API_BASE_URL}/api/v1/features`,
    },
}
