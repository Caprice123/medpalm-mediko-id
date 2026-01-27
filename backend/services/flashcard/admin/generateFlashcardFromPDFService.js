import { BaseService } from "#services/baseService"
import { RouterUtils } from "#utils/aiUtils/routerUtils"
import prisma from "#prisma/client"

export class GenerateFlashcardFromPDFService extends BaseService {
    /**
     * Generate flashcards from PDF buffer using configurable prompt
     * @param {Buffer} pdfBuffer - PDF file buffer
     * @param {number} cardCount - Number of cards to generate
     * @param {string} mimeType - MIME type of the file
     * @returns {Promise<Array>} Array of flashcard objects
     */
    static async call(pdfBuffer, cardCount, mimeType = 'application/pdf') {
        // Fetch configuration from constants
        const constants = await prisma.constants.findMany({
            where: {
                key: {
                    in: [
                        'flashcard_generation_model',
                        'flashcard_generation_prompt_document_based',
                    ]
                }
            }
        })

        const constantsMap = {}
        constants.forEach(c => { constantsMap[c.key] = c.value })

        const model = constantsMap.flashcard_generation_model || 'gemini-2.5-flash'
        const systemPrompt = constantsMap.flashcard_generation_prompt_document_based

        if (!systemPrompt) {
            throw new Error('Document-based prompt not configured in constants')
        }

        // Build prompt with variables
        const options = {
            numberOfCards: cardCount
        }
        const parsedSystemPrompt = this.buildSystemPrompt(systemPrompt, options)

        // Get AI service through RouterUtils
        const modelService = RouterUtils.call(model)

        // Generate flashcards using PDF and custom prompt
        const text = await modelService.generateFromFile(
            model,
            parsedSystemPrompt,
            pdfBuffer,
            mimeType
        )

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
        }))
    }

    /**
     * Replace template variables in system prompt
     * @param {string} systemPrompt - System prompt template
     * @param {Object} options - Variables to replace
     * @returns {string} Parsed prompt
     */
    static buildSystemPrompt(systemPrompt, options) {
        return systemPrompt.replace(/{{(.*?)}}/g, (_, key) => {
            return options[key.trim()] ?? ""
        })
    }
}
