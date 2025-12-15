import { ValidationError } from '../../../errors/validationError.js'
import { BaseService } from '../../baseService.js'
import geminiService from '../../gemini.service.js'
import fs from 'fs'

export class GenerateMcqQuestionsService extends BaseService {
  static async call({ content, pdfFilePath, type, questionCount = 10 }) {
    this.validate({ content, pdfFilePath, type, questionCount })

    try {
      // Generate MCQ questions using Gemini
      let questions
      if (type === 'text') {
        questions = await geminiService.generateMCQFromText(content, questionCount)
      } else if (type === 'pdf') {
        questions = await geminiService.generateMCQFromPDF(pdfFilePath, questionCount)
      }

      return questions
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
