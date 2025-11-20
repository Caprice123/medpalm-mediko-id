import prisma from '../../../prisma/client.js'
import { BaseService } from '../../baseService.js'
import { ValidationError } from '../../../errors/validationError.js'

export class GetSummaryNoteDetailService extends BaseService {
  static async call({ id }) {
    if (!id) {
      throw new ValidationError('Summary note ID is required')
    }

    const summaryNote = await prisma.summary_notes.findUnique({
      where: { id: parseInt(id) },
      include: {
        summary_note_tags: {
          include: {
            tags: true
          }
        }
      }
    })

    if (!summaryNote) {
      throw new ValidationError('Summary note not found')
    }

    return {
      id: summaryNote.id,
      title: summaryNote.title,
      description: summaryNote.description,
      content: summaryNote.content,
      source_type: summaryNote.source_type,
      source_url: summaryNote.source_url,
      source_key: summaryNote.source_key,
      source_filename: summaryNote.source_filename,
      status: summaryNote.status,
      is_active: summaryNote.is_active,
      created_by: summaryNote.created_by,
      created_at: summaryNote.created_at,
      updated_at: summaryNote.updated_at,
      tags: summaryNote.summary_note_tags.map(t => ({
        id: t.tags.id,
        name: t.tags.name,
        type: t.tags.type
      }))
    }
  }
}
