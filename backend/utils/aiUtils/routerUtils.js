import { GeminiService } from "#services/ai/gemini.service";
import { PerplexityService } from "#services/ai/perplexity.service";
import { BaseService } from "#services/baseService";

const providerModelMapping = {
    "gemini-3-pro": GeminiService,
    "gemini-3-flash": GeminiService,
    "gemini-2.5-flash": GeminiService,
    "gemini-2.5-flash-list": GeminiService,
    "gemini-2.5-pro": GeminiService,

    "sonar": PerplexityService,
    "sonar-pro": PerplexityService,
    "sonar-reasoning-pro": PerplexityService,
    "sonar-deep-research": PerplexityService,
}

export class RouterUtils extends BaseService {
    static call(model) {
        return providerModelMapping[model]
    }
}

