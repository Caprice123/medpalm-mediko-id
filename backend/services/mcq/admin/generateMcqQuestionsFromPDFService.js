import { BaseService } from "#services/baseService"
import { RouterUtils } from "#utils/aiUtils/routerUtils"
import prisma from "#prisma/client"

export class GenerateMcqQuestionsFromPDFService extends BaseService {
  /**
   * Generate MCQ questions from PDF buffer using configurable prompt
   * @param {Buffer} pdfBuffer - PDF file buffer
   * @param {number} questionCount - Number of questions to generate
   * @param {string} mimeType - MIME type of the file
   * @returns {Promise<Array>} Array of MCQ question objects
   */
  static async call(pdfBuffer, questionCount, mimeType = 'application/pdf') {
    // Fetch configuration from constants
    const constants = await prisma.constants.findMany({
      where: {
        key: {
          in: [
            'mcq_generation_model',
            'mcq_generation_prompt'
          ]
        }
      }
    })

    const constantsMap = {}
    constants.forEach(c => { constantsMap[c.key] = c.value })

    const model = constantsMap.mcq_generation_model || 'gemini-2.5-flash'
    const systemPrompt = constantsMap.mcq_generation_prompt

    if (!systemPrompt) {
      throw new Error('MCQ generation prompt not configured in constants')
    }

    // Build prompt with variables
    const options = {
      questionCount: questionCount,
    }
    const parsedSystemPrompt = this.buildSystemPrompt(systemPrompt, options)

    // Get AI service through RouterUtils
    const modelService = RouterUtils.call(model)

    // Generate MCQ questions using PDF and custom prompt
    const text = await modelService.generateFromFile(
      model,
      parsedSystemPrompt,
      pdfBuffer,
      mimeType
    )

    // Parse JSON response
    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const result = JSON.parse(cleanedText)

    // Extract questions from result
    const questions = Array.isArray(result) ? result : (result.questions || [])

    // Map and validate questions
    return questions.map((q, index) => ({
      question: q.question || '',
      options: Array.isArray(q.options) ? q.options : [],
      correct_answer: typeof q.correct_answer === 'number' ? q.correct_answer : 0,
      explanation: q.explanation || '',
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
