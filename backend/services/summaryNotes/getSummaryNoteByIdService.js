import prisma from '../../prisma/client.js'
import { BaseService } from '../baseService.js'
import { ValidationError } from '../../errors/validationError.js'

export class GetSummaryNoteByIdService extends BaseService {
  static async call({ noteId }) {
    if (!noteId) {
      throw new ValidationError('Note ID is required')
    }

    // Get the summary note
    const note = await prisma.summary_notes.findUnique({
      where: {
        id: parseInt(noteId),
        is_active: true,
        status: 'published'
      },
      include: {
        summary_note_tags: {
          include: {
            tags: {
              include: {
                tag_group: true
              }
            }
          }
        }
      }
    })

    if (!note) {
      throw new ValidationError('Summary note not found')
    }

    // Separate tags by group
    const allTags = note.summary_note_tags.map(t => ({
      id: t.tags.id,
      name: t.tags.name,
      tagGroupId: t.tags.tag_group_id,
      tagGroupName: t.tags.tag_group?.name
    }))

    const universityTags = allTags.filter(tag => tag.tagGroupName === 'university')
    const semesterTags = allTags.filter(tag => tag.tagGroupName === 'semester')

    return {
      id: note.id,
      title: note.title,
      description: note.description,
      content: note.content,
      tags: allTags,
      universityTags,
      semesterTags,
      createdAt: note.created_at,
      updatedAt: note.updated_at
    }
  }
}
