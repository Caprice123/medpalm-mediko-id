import { BaseService } from '#services/baseService'
import { RouterUtils } from '#utils/aiUtils/routerUtils'
import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import idriveService from '#services/idrive.service'

export class GenerateSummaryFromDocumentService extends BaseService {
  /**
   * Generate summary from document using configurable prompt
   * @param {Object} params - Parameters
   * @param {number} params.blobId - Blob ID of the document
   * @returns {Promise<Object>} Generated summary object
   */
  static async call({ blobId }) {
    if (!blobId) {
      throw new ValidationError('Blob ID is required')
    }

    // Get blob from database
    const blob = await prisma.blobs.findUnique({
      where: { id: parseInt(blobId) }
    })

    if (!blob) {
      throw new ValidationError('Blob not found')
    }

    // Fetch configuration from constants
    const constants = await prisma.constants.findMany({
      where: {
        key: {
          in: [
            'summary_notes_generation_model',
            'summary_notes_generation_prompt',
          ]
        }
      }
    })

    const constantsMap = {}
    constants.forEach(c => { constantsMap[c.key] = c.value })

    const model = constantsMap.summary_notes_generation_model || 'gemini-2.0-flash'
    const systemPrompt = constantsMap.summary_notes_generation_prompt

    if (!systemPrompt) {
      throw new Error('Summary notes generation prompt not configured in constants')
    }

    // Download file from blob storage as buffer
    const pdfBuffer = await idriveService.downloadFileAsBuffer(blob.key)

    // Get AI service through RouterUtils
    const modelService = RouterUtils.call(model)

    // Generate summary using PDF and custom prompt
    const result = await modelService.generateFromPDF(
      model,
      systemPrompt,
      pdfBuffer
    )

    // Return generated summary wrapped properly
    return {
      summary: result, // Markdown text content
      blobId: parseInt(blobId)
    }
  }
}
