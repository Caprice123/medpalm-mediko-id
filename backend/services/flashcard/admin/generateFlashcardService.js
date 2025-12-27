import { ValidationError } from '#errors/validationError'
import { BaseService } from "#services/baseService"
import { GenerateFlashcardFromTextService } from './generateFlashcardFromTextService.js'
import { GenerateFlashcardFromPDFService } from './generateFlashcardFromPDFService.js'

export class GenerateFlashcardService extends BaseService {
    static async call({ content, pdfBuffer, type, cardCount = 10 }) {
        this.validate({ content, pdfBuffer, type, cardCount })

        if (type === 'text') {
            // Generate from text using configurable prompt
            return await GenerateFlashcardFromTextService.call(content, cardCount)
        } else if (type === 'pdf') {
            // Generate from PDF using configurable prompt
            return await GenerateFlashcardFromPDFService.call(pdfBuffer, cardCount)
        }
    }

    static validate({ content, pdfBuffer, type, cardCount }) {
        if (!type || !['text', 'pdf'].includes(type)) {
            throw new ValidationError('Type must be either "text" or "pdf"')
        }

        if (type === 'text' && !content) {
            throw new ValidationError('Content is required for text type')
        }

        if (type === 'pdf' && !pdfBuffer) {
            throw new ValidationError('PDF file path or buffer is required for pdf type')
        }

        if (cardCount && parseInt(cardCount) < 1) {
            throw new ValidationError("Kartu yang akan digenerate harus lebih besar dari 0")
        }
    }
}
