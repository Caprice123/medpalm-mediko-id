import { GeminiService } from "#services/ai/gemini.service";
import { PerplexityService } from "#services/ai/perplexity.service";
import { GeminiEmbeddingService } from "#services/ai/embedding/gemini.embedding.service";
import { BaseService } from "#services/baseService";

const providerModelMapping = {
    "gemini-3-pro": GeminiService,
    "gemini-3-flash": GeminiService,
    "gemini-2.0-flash": GeminiService,
    "gemini-2.5-flash": GeminiService,
    "gemini-2.5-flash-list": GeminiService,
    "gemini-2.5-pro": GeminiService,

    "sonar": PerplexityService,
    "sonar-pro": PerplexityService,
    "sonar-reasoning-pro": PerplexityService,
    "sonar-deep-research": PerplexityService,
}

const providerMapping = {
    "gemini-3-pro": "gemini",
    "gemini-3-flash": "gemini",
    "gemini-2.0-flash": "gemini",
    "gemini-2.5-flash": "gemini",
    "gemini-2.5-flash-list": "gemini",
    "gemini-2.5-pro": "gemini",

    "sonar": "perplexity",
    "sonar-pro": "perplexity",
    "sonar-reasoning-pro": "perplexity",
    "sonar-deep-research": "perplexity",
}

const embeddingProviderMapping = {
    "text-embedding-004": GeminiEmbeddingService,
    "gemini-embedding-001": GeminiEmbeddingService,
}

export class RouterUtils extends BaseService {
    static call(model) {
        return providerModelMapping[model]
    }

    static getEmbeddingProvider(model) {
        return embeddingProviderMapping[model]
    }


    static getProvider(model) {
        return providerMapping[model]
    }
}

