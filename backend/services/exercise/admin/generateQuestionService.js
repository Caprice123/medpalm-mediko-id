import { ValidationError } from '#errors/validationError'
import { BaseService } from "#services/baseService"
import { RouterUtils } from "#utils/aiUtils/routerUtils"
import prisma from "#prisma/client"

export class GenerateQuestionService extends BaseService {
    static async call({ content, pdfBuffer, type, questionCount = 10 }) {
        this.validate({ content, pdfBuffer, type, questionCount })

        // Fetch constants
        const constantKeys = type === 'text'
            ? ['exercise_generation_model', 'exercise_generation_prompt_text_based']
            : ['exercise_generation_model', 'exercise_generation_prompt_document_based']

        const constants = await prisma.constants.findMany({
            where: { key: { in: constantKeys } }
        })

        const constantsMap = {}
        constants.forEach(c => { constantsMap[c.key] = c.value })

        const model = constantsMap.exercise_generation_model
        const systemPrompt = type === 'text'
            ? constantsMap.exercise_generation_prompt_text_based
            : constantsMap.exercise_generation_prompt_document_based

        // Build system prompt with options
        const options = {
            numberOfQuestions: questionCount,
            context: content || ''
        }
        const parsedSystemPrompt = this.buildSystemPrompt(systemPrompt, options)

        // Get AI service from router
        const modelService = RouterUtils.call(model)

        // Generate questions
        let text
        if (type === 'text') {
            text = await modelService.generateFromText(model, parsedSystemPrompt)
        } else if (type === 'pdf') {
            text = await modelService.generateFromFile(model, parsedSystemPrompt, pdfBuffer, 'application/pdf')
        }

        // Parse JSON response
        const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
        const result = JSON.parse(cleanedText)

        // Extract questions from result
        const questions = Array.isArray(result) ? result : (result.questions || [])

        // Map and validate questions
        return questions.map((q, index) => ({
            question: q.question || '',
            answer: q.answer || '',
            explanation: q.explanation || '',
            order: index
        }))
    }

    static buildSystemPrompt(systemPrompt, options) {
        return systemPrompt.replace(/{{(.*?)}}/g, (_, key) => {
            return options[key.trim()] ?? ""
        })
    }

    static validate({ content, pdfBuffer, type, questionCount }) {
        if (!type || !['text', 'pdf'].includes(type)) {
            throw new ValidationError('Type must be either "text" or "pdf"')
        }

        if (type === 'text' && !content) {
            throw new ValidationError('Content is required for text type')
        }

        if (type === 'pdf' && !pdfBuffer) {
            throw new ValidationError('PDF buffer is required for pdf type')
        }
    }
}
