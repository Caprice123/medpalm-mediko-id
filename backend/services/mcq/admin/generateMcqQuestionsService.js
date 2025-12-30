import { ValidationError } from '#errors/validationError'
import { BaseService } from "#services/baseService"
import { GenerateMcqQuestionsFromTextService } from './generateMcqQuestionsFromTextService.js'
import { GenerateMcqQuestionsFromPDFService } from './generateMcqQuestionsFromPDFService.js'

export class GenerateMcqQuestionsService extends BaseService {
  static async call({ content, pdfBuffer, type, questionCount = 10 }) {
    this.validate({ content, pdfBuffer, type, questionCount })

    if (type === 'text') {
      // Generate from text using configurable prompt
      return await GenerateMcqQuestionsFromTextService.call(content, questionCount)
    } else if (type === 'pdf') {
      // Generate from PDF using configurable prompt
      return await GenerateMcqQuestionsFromPDFService.call(pdfBuffer, questionCount)
    }
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

    if (questionCount && (questionCount < 1 || questionCount > 50)) {
      throw new ValidationError('Question count must be between 1 and 50')
    }
  }
}
