
import prisma from "#prisma/client"
import { BaseService } from "#services/baseService"
import { RouterUtils } from "#utils/aiUtils/routerUtils"

export class GenerateFlashcardFromTextService extends BaseService {
    static async call(content, cardCount) {
        const constants = await prisma.constants.findMany({
            where: {
                key: {
                    in: [
                        'flashcard_generation_model',
                        'flashcard_generation_prompt_text_based',
                    ]
                }
            }
        })
        const constantsMap = {}
        constants.forEach(c => { constantsMap[c.key] = c.value })

        const model = constantsMap.flashcard_generation_model
        const systemPrompt = constantsMap.flashcard_generation_prompt_text_based

        const options = {
            numberOfCards: cardCount,
            context: content
        }
        const parsedSystemPrompt = this.buildSystemPrompt(systemPrompt, options)
        const modelService = RouterUtils.call(model)

        const text = await modelService.generateFromText(model, parsedSystemPrompt)

        // Parse JSON response
        const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
        const result = JSON.parse(cleanedText)

        // Ensure result is an array and has the expected structure
        const flashcards = Array.isArray(result) ? result : (result.flashcards || [])

        // Map and validate flashcards
        return flashcards.map((card, index) => ({
            front: card.front || '',
            back: card.back || '',
            order: index
        }));
    }

    static buildSystemPrompt(systemPrompt, options) {
        return systemPrompt.replace(/{{(.*?)}}/g, (_, key) => {
            return options[key.trim()] ?? ""
        })
    }
}