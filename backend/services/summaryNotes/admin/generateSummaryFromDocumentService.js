import { GoogleAIFileManager } from '@google/generative-ai/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import fs from 'fs'
import path from 'path'
import { BaseService } from '../../baseService.js'
import { ValidationError } from '../../../errors/validationError.js'
import idriveService from '../../idrive.service.js'

export class GenerateSummaryFromDocumentService extends BaseService {
  static async call({ filePath, mimeType, filename }) {
    if (!filePath) {
      throw new ValidationError('File path is required')
    }

    if (!mimeType) {
      throw new ValidationError('MIME type is required')
    }

    const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY)
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    let uploadedFile = null

    try {
      // 1. Upload file to Gemini
      uploadedFile = await fileManager.uploadFile(filePath, {
        mimeType: mimeType,
        displayName: filename || 'document'
      })

      // Wait for file to be processed
      let file = await fileManager.getFile(uploadedFile.file.name)
      while (file.state === 'PROCESSING') {
        await new Promise(resolve => setTimeout(resolve, 2000))
        file = await fileManager.getFile(uploadedFile.file.name)
      }

      if (file.state === 'FAILED') {
        throw new ValidationError('Failed to process document')
      }

      // 2. Generate summary using the uploaded file
      const prompt = `
        Analyze this document and create a comprehensive summary in Markdown format.

        Requirements:
        - Use proper Markdown headers (# ## ###) to organize sections
        - Include bullet points for key concepts and important points
        - Add tables if the document contains tabular data
        - Highlight important terms, definitions, and keywords in **bold**
        - Use code blocks if there are any formulas, equations, or code
        - Include numbered lists for steps or processes
        - Organize content logically and make it easy to study from
        - Preserve important details while making the content more digestible
        - Add a brief introduction at the beginning
        - If there are images or diagrams in the document, describe their key points

        The summary should be comprehensive enough for students to use as study material.

        Document: ${filename || 'Uploaded Document'}
      `

      const result = await model.generateContent([
        prompt,
        {
          fileData: {
            fileUri: uploadedFile.file.uri,
            mimeType: uploadedFile.file.mimeType
          }
        }
      ])

      const generatedContent = result.response.text()

      // 3. Upload file to iDrive e2 for storage
      let fileInfo = null
      try {
        const ext = path.extname(filename || '.pdf')
        const sanitizedName = (filename || 'document').toLowerCase().replace(/[^a-z0-9]/g, '-').replace(ext, '')
        const timestamp = Date.now()
        const storageFileName = `${sanitizedName}-${timestamp}${ext}`

        fileInfo = await idriveService.uploadFile(filePath, 'summary-notes-sources', storageFileName)
        fileInfo.originalFilename = filename
      } catch (error) {
        console.error('Failed to upload file to iDrive e2:', error)
        // Continue without file storage - not critical
      }

      return {
        content: generatedContent,
        filename: filename,
        mimeType: mimeType,
        fileInfo: fileInfo
      }

    } finally {
      // 4. Delete file from Gemini
      if (uploadedFile) {
        try {
          await fileManager.deleteFile(uploadedFile.file.name)
        } catch (error) {
          console.error('Failed to delete file from Gemini:', error)
        }
      }

      // 5. Delete temp file from server
      if (filePath && fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath)
        } catch (error) {
          console.error('Failed to delete temp file:', error)
        }
      }
    }
  }
}
