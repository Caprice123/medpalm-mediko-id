import prisma from '../../prisma/client.js'
import { BaseService } from '../baseService.js'

export class GetSummaryNotesService extends BaseService {
  static async call({ search, university, semester, page = 1, perPage = 12 }) {
    // Build where clause for active and published notes
    const where = {
      is_active: true,
      status: 'published'
    }

    // Add search filter for title
    if (search) {
      where.title = { contains: search, mode: 'insensitive' }
    }

    // Add tag filters if provided
    if (university || semester) {
      where.summary_note_tags = {
        some: {
          tags: {
            OR: [
              ...(university ? [{
                type: 'university',
                name: { equals: university, mode: 'insensitive' }
              }] : []),
              ...(semester ? [{
                type: 'semester',
                name: { equals: semester, mode: 'insensitive' }
              }] : [])
            ]
          }
        }
      }
    }

    // Get paginated summary notes (fetch one extra to check if there's a next page)
    const summaryNotes = await prisma.summary_notes.findMany({
      where,
      select: {
        id: true,
        title: true,
        description: true,
        created_at: true,
        summary_note_tags: {
          select: {
            tags: {
              select: {
                id: true,
                name: true,
                type: true
              }
            }
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      },
      skip: (page - 1) * perPage,
      take: perPage + 1
    })

    // Check if there's a next page
    const hasMore = summaryNotes.length > perPage
    const notesToReturn = hasMore ? summaryNotes.slice(0, perPage) : summaryNotes

    // Transform the data
    const notes = notesToReturn.map(note => ({
      id: note.id,
      title: note.title,
      description: note.description,
      created_at: note.created_at,
      tags: note.summary_note_tags.map(t => t.tags)
    }))

    // Filter results if both university and semester are provided (need to match both)
    let filteredNotes = notes
    if (university && semester) {
      filteredNotes = notes.filter(note => {
        const hasUniversity = note.tags.some(tag =>
          tag.type === 'university' &&
          tag.name.toLowerCase() === university.toLowerCase()
        )
        const hasSemester = note.tags.some(tag =>
          tag.type === 'semester' &&
          tag.name.toLowerCase() === semester.toLowerCase()
        )
        return hasUniversity && hasSemester
      })
    }

    return {
      notes: filteredNotes,
      pagination: {
        page,
        perPage,
        isLastPage: !hasMore
      }
    }
  }
}
