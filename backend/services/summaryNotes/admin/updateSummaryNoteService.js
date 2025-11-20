import prisma from '../../../prisma/client.js'
import { BaseService } from '../../baseService.js'
import { ValidationError } from '../../../errors/validationError.js'

export class UpdateSummaryNoteService extends BaseService {
  static async call({ id, title, description, content, sourceType, sourceUrl, sourceKey, sourceFilename, status, isActive, tagIds }) {
    // Validate required fields
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

    const result = await prisma.$transaction(async (tx) => {
      // Build update data
      const updateData = {
        updated_at: new Date()
      }

      if (title !== undefined) updateData.title = title
      if (description !== undefined) updateData.description = description
      if (content !== undefined) updateData.content = content
      if (sourceType !== undefined) updateData.source_type = sourceType
      if (sourceUrl !== undefined) updateData.source_url = sourceUrl
      if (sourceKey !== undefined) updateData.source_key = sourceKey
      if (sourceFilename !== undefined) updateData.source_filename = sourceFilename
      if (status !== undefined) updateData.status = status
      if (isActive !== undefined) updateData.is_active = isActive

      // Update the summary note
      const summaryNote = await tx.summary_notes.update({
        where: { id: parseInt(id) },
        data: updateData
      })

      // Update tag associations if provided
      if (tagIds !== undefined) {
        // Delete existing tags
        await tx.summary_note_tags.deleteMany({
          where: { summary_note_id: parseInt(id) }
        })

        // Create new tag associations
        if (tagIds.length > 0) {
          await tx.summary_note_tags.createMany({
            data: tagIds.map(tagId => ({
              summary_note_id: summaryNote.id,
              tag_id: tagId
            }))
          })
        }
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
