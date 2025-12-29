import { ValidationError } from '#errors/validationError'
import { BaseService } from '#services/baseService'
import { RouterUtils } from "#utils/aiUtils/routerUtils"
import prisma from "#prisma/client"
import fs from 'fs'

export class GenerateMcqQuestionsService extends BaseService {
  static async call({ content, pdfFilePath, type, questionCount = 10 }) {
    this.validate({ content, pdfFilePath, type, questionCount })

    try {
      // Fetch constants
      const constants = await prisma.constants.findMany({
        where: {
          key: {
            in: ['mcq_generation_model', 'mcq_generation_prompt']
          }
        }
      })

      const constantsMap = {}
      constants.forEach(c => { constantsMap[c.key] = c.value })

      const model = constantsMap.mcq_generation_model
      const systemPrompt = constantsMap.mcq_generation_prompt

      // Build system prompt with options
      const options = {
        questionCount: questionCount,
        context: content || ''
      }
      const parsedSystemPrompt = this.buildSystemPrompt(systemPrompt, options)

      // Get AI service from router
      const modelService = RouterUtils.call(model)

      // Generate MCQ questions
      let text
      if (type === 'text') {
        text = await modelService.generateFromText(model, parsedSystemPrompt)
      } else if (type === 'pdf') {
        const pdfBuffer = fs.readFileSync(pdfFilePath)
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
        options: Array.isArray(q.options) ? q.options : [],
        correct_answer: typeof q.correct_answer === 'number' ? q.correct_answer : 0,
        explanation: q.explanation || '',
        order: index
      }))
    } finally {
      // Clean up temporary PDF file if it exists
      if (pdfFilePath && fs.existsSync(pdfFilePath)) {
        try {
          fs.unlinkSync(pdfFilePath)
          console.log('Temporary PDF file deleted after MCQ generation')
        } catch (cleanupError) {
          console.error('Error deleting temporary PDF:', cleanupError)
        }
      }
    }
  }

  static buildSystemPrompt(systemPrompt, options) {
    return systemPrompt.replace(/{{(.*?)}}/g, (_, key) => {
      return options[key.trim()] ?? ""
    })
  }

  static validate({ content, pdfFilePath, type, questionCount }) {
    if (!type || !['text', 'pdf'].includes(type)) {
      throw new ValidationError('Type must be either "text" or "pdf"')
    }

    if (type === 'text' && !content) {
      throw new ValidationError('Content is required for text type')
    }

    if (type === 'pdf' && !pdfFilePath) {
      throw new ValidationError('PDF file path is required for pdf type')
    }

    if (questionCount && (questionCount < 1 || questionCount > 50)) {
      throw new ValidationError('Question count must be between 1 and 50')
    }
  }
}
