const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

export default {
    Root: "/",
    Login: "/api/v1/login",
    Logout: "/api/v1/logout",
    creditPlans: `${API_BASE_URL}/api/v1/credit-plans`,
    credits: `${API_BASE_URL}/api/credits`,
    // tags: {
    //     list: `${API_BASE_URL}/api/v1/tags`,
    //     create: `${API_BASE_URL}/api/v1/tags`,
    //     update: (id) => `${API_BASE_URL}/api/v1/tags/${id}`,
    //     delete: (id) => `${API_BASE_URL}/api/v1/tags/${id}`,
    // },
    tags: "/admin/v1/tags",
    // tagGroups: {
    //     list: `${API_BASE_URL}/api/v1/tag-groups`,
    //     create: `${API_BASE_URL}/api/v1/tag-groups`,
    // },
    admin: {
        constants: "/admin/v1/constants",
    },
    api: {
        calculators: "/api/v1/calculators"
    },
    tagGroups: "/admin/v1/tag-groups",
    users: "/admin/v1/users",
    calculators: {
        api: "/api/v1/calculators",
        admin: {
            list: `${API_BASE_URL}/admin/v1/calculators`,
            detail: (id) => `${API_BASE_URL}/admin/v1/calculators/${id}`,
            create: `${API_BASE_URL}/admin/v1/calculators`,
            update: (id) => `${API_BASE_URL}/admin/v1/calculators/${id}`,
            delete: (id) => `${API_BASE_URL}/admin/v1/calculators/${id}`,
            constants: `${API_BASE_URL}/admin/v1/calculators/constants`,
        }
    },
    exercises: {
        // User endpoints
        topics: `${API_BASE_URL}/api/v1/exercises/topics`,
        createTopic: `${API_BASE_URL}/api/v1/exercises/topics`,
        start: `${API_BASE_URL}/api/v1/exercises/start`,
        submit: `${API_BASE_URL}/api/v1/exercises/submit`,

        // Admin endpoints
        admin: {
            generate: `${API_BASE_URL}/admin/v1/exercises/generate`,
            generateFromPDF: `${API_BASE_URL}/admin/v1/exercises/generate-from-pdf`,
            topics: `${API_BASE_URL}/admin/v1/exercises/topics`,
            topic: (id) => `${API_BASE_URL}/admin/v1/exercises/topics/${id}`,
            constants: `${API_BASE_URL}/admin/v1/exercises/constants`,
        }
    },
    flashcards: {
        // User endpoints
        decks: `${API_BASE_URL}/api/v1/flashcards/decks`,
        start: `${API_BASE_URL}/api/v1/flashcards/start`,
        submit: `${API_BASE_URL}/api/v1/flashcards/submit`,

        // Admin endpoints
        admin: {
            generate: `${API_BASE_URL}/admin/v1/flashcards/generate`,
            generateFromPDF: `${API_BASE_URL}/admin/v1/flashcards/generate-from-pdf`,
            decks: `${API_BASE_URL}/admin/v1/flashcards/decks`,
            deck: (id) => `${API_BASE_URL}/admin/v1/flashcards/decks/${id}`,
            constants: `${API_BASE_URL}/admin/v1/flashcards/constants`,
        }
    },
    sessions: {
        create: `${API_BASE_URL}/api/v1/sessions`,
        list: `${API_BASE_URL}/api/v1/sessions`,
        detail: (sessionId) => `${API_BASE_URL}/api/v1/sessions/${sessionId}`,
        flashcard: {
            start: (sessionId) => `${API_BASE_URL}/api/v1/sessions/${sessionId}/flashcard/start`,
            submit: (sessionId) => `${API_BASE_URL}/api/v1/sessions/${sessionId}/flashcard/submit`,
        },
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
    statistics: {
        list: `${API_BASE_URL}/api/v1/statistics`,
    },
    pricing: {
        plans: `${API_BASE_URL}/api/v1/pricing/plans`,
        status: `${API_BASE_URL}/api/v1/pricing/status`,
        history: `${API_BASE_URL}/api/v1/pricing/history`,
        purchase: `${API_BASE_URL}/api/v1/pricing/purchase`,
        admin: {
            list: `${API_BASE_URL}/admin/v1/pricing`,
            detail: (id) => `${API_BASE_URL}/admin/v1/pricing/${id}`,
            create: `${API_BASE_URL}/admin/v1/pricing`,
            update: (id) => `${API_BASE_URL}/admin/v1/pricing/${id}`,
            toggle: (id) => `${API_BASE_URL}/admin/v1/pricing/${id}/toggle`,
        }
    },
    summaryNotes: {
        // User endpoints
        list: `${API_BASE_URL}/api/v1/summary-notes`,
        start: `${API_BASE_URL}/api/v1/summary-notes/sessions/start`,
        session: (sessionId) => `${API_BASE_URL}/api/v1/summary-notes/sessions/${sessionId}`,

        // Admin endpoints
        admin: {
            list: `${API_BASE_URL}/admin/v1/summary-notes`,
            detail: (id) => `${API_BASE_URL}/admin/v1/summary-notes/${id}`,
            generate: `${API_BASE_URL}/admin/v1/summary-notes/generate`,
        }
    },
    anatomy: {
        // User endpoints
        quizzes: `${API_BASE_URL}/api/v1/anatomy/quizzes`,
        quiz: (id) => `${API_BASE_URL}/api/v1/anatomy/quizzes/${id}`,
        submit: (id) => `${API_BASE_URL}/api/v1/anatomy/quizzes/${id}/submit`,
        constants: `${API_BASE_URL}/api/v1/anatomy/constants`,

        // Admin endpoints
        admin: {
            uploadImage: `${API_BASE_URL}/admin/v1/anatomy/upload-image`,
            quizzes: `${API_BASE_URL}/admin/v1/anatomy/quizzes`,
            quiz: (id) => `${API_BASE_URL}/admin/v1/anatomy/quizzes/${id}`,
            constants: `${API_BASE_URL}/admin/v1/anatomy/constants`,
        }
    },
    mcq: {
        // User endpoints
        topics: `${API_BASE_URL}/api/v1/mcq/topics`,
        topic: (id) => `${API_BASE_URL}/api/v1/mcq/topics/${id}`,
        submit: (id) => `${API_BASE_URL}/api/v1/mcq/topics/${id}/submit`,
        topicSession: (id) => `${API_BASE_URL}/api/v1/mcq/topics/${id}/session`,
        check: (id) => `${API_BASE_URL}/api/v1/mcq/topics/${id}/check`,
        constants: `${API_BASE_URL}/api/v1/mcq/constants`,

        // Admin endpoints
        admin: {
            generate: `${API_BASE_URL}/admin/v1/mcq/generate`,
            uploadQuestionImage: `${API_BASE_URL}/admin/v1/mcq/upload-question-image`,
            topics: `${API_BASE_URL}/admin/v1/mcq/topics`,
            topic: (id) => `${API_BASE_URL}/admin/v1/mcq/topics/${id}`,
            constants: `${API_BASE_URL}/admin/v1/mcq/constants`,
        }
    },
}
