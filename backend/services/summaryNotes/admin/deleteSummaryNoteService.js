import prisma from '../../../prisma/client.js'
import { BaseService } from '../../baseService.js'
import { ValidationError } from '../../../errors/validationError.js'

export class DeleteSummaryNoteService extends BaseService {
  static async call({ id }) {
    if (!id) {
      throw new ValidationError('Summary note ID is required')
    }

    // Check if summary note exists
    const existing = await prisma.summary_notes.findUnique({
      where: { id: parseInt(id) }
    })

    if (!existing) {
      throw new ValidationError('Summary note not found')
    }

    // Delete the summary note (cascade will handle tags)
    await prisma.summary_notes.delete({
      where: { id: parseInt(id) }
    })

    return { success: true }
  }
}
