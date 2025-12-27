import { ValidationError } from "#errors/validationError";
import { BaseService } from "#services/baseService";

export class BaseAiService extends BaseService {
    static async call(model, systemPrompt, conversationHistory, options) {
        throw new ValidationError("Not Implemented")
    }

    static async buildConversationHistory(conversationHistory, userMessage) {
        throw new ValidationError("Not Implemented")
    }
}