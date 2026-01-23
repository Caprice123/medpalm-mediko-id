export const aiModels = {
    gemini: {
        "gemini-3-pro": "Gemini 3 Pro",
        "gemini-3-flash": "Gemini 3 Flash",
        "gemini-2.5-flash": "Gemini 2.5 Flash",
        "gemini-2.5-flash-list":  "Gemini 2.5 Flash Lite",
        "gemini-2.5-pro": "Gemini 2.5 Pro",
    },
    perplexity: {
        "sonar": "Sonar",
        "sonar-pro": "Sonar Pro",
        "sonar-reasoning-pro": "Sonar Reasoning Pro",
        "sonar-deep-research": "Sonar Deep Research",
    }
}

// Grouped AI Models by Provider (for react-select optgroup)
export const aiModelsGrouped = [
    {
        label: 'GEMINI',
        options: Object.entries(aiModels.gemini).map(([value, label]) => ({
            value,
            label
        }))
    },
    {
        label: 'PERPLEXITY',
        options: Object.entries(aiModels.perplexity).map(([value, label]) => ({
            value,
            label
        }))
    }
]

// Helper to get model label from value
export const getModelLabel = (value) => {
    return aiModels.gemini[value] || aiModels.perplexity[value] || value
}

export const embeddingModels = {
    gemini: {
        "gemini-embedding-001": "Gemini Embedding 001",
    },
}

// Grouped AI Models by Provider (for react-select optgroup)
export const embeddingModelsGrouped = [
    {
        label: 'GEMINI',
        options: Object.entries(embeddingModels.gemini).map(([value, label]) => ({
            value,
            label
        }))
    },
]

// Helper to get model label from value
export const getEmbeddingModelLabel = (value) => {
    return embeddingModels.gemini[value] || value
}
