import prisma from '../../../prisma/client.js'
import { BaseService } from '../../baseService.js'
import { ValidationError } from '../../../errors/validationError.js'

export class CreateSummaryNoteService extends BaseService {
  static async call({ title, description, content, sourceType, sourceUrl, sourceKey, sourceFilename, status, tagIds, createdBy }) {
    // Validate required fields
    if (!title) {
      throw new ValidationError('Title is required')
    }

    if (!content) {
      throw new ValidationError('Content is required')
    }

    if (!createdBy) {
      throw new ValidationError('Created by is required')
    }

    const result = await prisma.$transaction(async (tx) => {
      // Create the summary note
      const summaryNote = await tx.summary_notes.create({
        data: {
          title,
          description: description || null,
          content,
          source_type: sourceType || null,
          source_url: sourceUrl || null,
          source_key: sourceKey || null,
          source_filename: sourceFilename || null,
          status: status || 'draft',
          created_by: createdBy
        }
      })

      // Create tag associations if provided
      if (tagIds && tagIds.length > 0) {
        await tx.summary_note_tags.createMany({
          data: tagIds.map(tagId => ({
            summary_note_id: summaryNote.id,
            tag_id: tagId
          }))
        })
      }

      // Fetch the complete summary note with tags
      const completeSummaryNote = await tx.summary_notes.findUnique({
        where: { id: summaryNote.id },
        include: {
          summary_note_tags: {
            include: {
              tags: true
            }
          }
        }
      })

      return completeSummaryNote
    })

    return result
  }
}
