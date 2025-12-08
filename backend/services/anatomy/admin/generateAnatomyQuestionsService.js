import { ValidationError } from '../../../errors/validationError.js'
import { BaseService } from '../../baseService.js'
import geminiService from '../../gemini.service.js'
import fs from 'fs'

export class GenerateAnatomyQuestionsService extends BaseService {
  static async call({ imageFilePath, questionCount = 5 }) {
    this.validate({ imageFilePath, questionCount })

    try {
      // Generate anatomy questions using Gemini vision model
      const questions = await geminiService.generateAnatomyQuestionsFromImage(
        imageFilePath,
        questionCount
      )

      return questions
    } finally {
      // Clean up temporary image file if it exists
      if (imageFilePath && fs.existsSync(imageFilePath)) {
        try {
          fs.unlinkSync(imageFilePath)
          console.log('Temporary image file deleted after preview generation')
        } catch (cleanupError) {
          console.error('Error deleting temporary image:', cleanupError)
        }
      }
    }
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
