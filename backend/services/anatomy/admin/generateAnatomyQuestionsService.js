import { ValidationError } from '#errors/validationError'
import { BaseService } from '#services/baseService'
import { RouterUtils } from "#utils/aiUtils/routerUtils"
import prisma from "#prisma/client"
import fs from 'fs'
import path from 'path'

export class GenerateAnatomyQuestionsService extends BaseService {
  static async call({ imageFilePath, questionCount = 5 }) {
    this.validate({ imageFilePath, questionCount })

    try {
      // Fetch constants
      const constants = await prisma.constants.findMany({
        where: {
          key: {
            in: ['anatomy_generation_model', 'anatomy_generation_prompt']
          }
        }
      })

      const constantsMap = {}
      constants.forEach(c => { constantsMap[c.key] = c.value })

      const model = constantsMap.anatomy_generation_model
      const systemPrompt = constantsMap.anatomy_generation_prompt

      // Build system prompt with options
      const options = {
        questionCount: questionCount
      }
      const parsedSystemPrompt = this.buildSystemPrompt(systemPrompt, options)

      // Get AI service from router
      const modelService = RouterUtils.call(model)

      // Read image file
      const imageBuffer = fs.readFileSync(imageFilePath)

      // Detect mime type from file extension
      const ext = path.extname(imageFilePath).toLowerCase()
      const mimeTypes = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png'
      }
      const mimeType = mimeTypes[ext] || 'image/jpeg'

      // Generate anatomy questions using vision model
      const text = await modelService.generateFromFile(model, parsedSystemPrompt, imageBuffer, mimeType)

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
    } finally {
      // Clean up temporary image file if it exists
      if (imageFilePath && fs.existsSync(imageFilePath)) {
        try {
          fs.unlinkSync(imageFilePath)
          console.log('Temporary image file deleted after anatomy generation')
        } catch (cleanupError) {
          console.error('Error deleting temporary image:', cleanupError)
        }
      }
    }
  }

  static buildSystemPrompt(systemPrompt, options) {
    return systemPrompt.replace(/{{(.*?)}}/g, (_, key) => {
      return options[key.trim()] ?? ""
    })
  }

  static validate({ imageFilePath, questionCount }) {
    if (!imageFilePath) {
      throw new ValidationError('Image file path is required')
    }

    if (!fs.existsSync(imageFilePath)) {
      throw new ValidationError('Image file does not exist')
    }

    if (questionCount && (questionCount < 1 || questionCount > 20)) {
      throw new ValidationError('Question count must be between 1 and 20')
    }
  }
}
