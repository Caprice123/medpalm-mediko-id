import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class GetSummaryNotesListService extends BaseService {
  static async call({ page = 1, perPage = 30, status, search, university, semester, topic, department }) {
    // Calculate pagination
    const limit = parseInt(perPage)
    const offset = (parseInt(page) - 1) * limit

    // Build where clause
    const where = {}

    if (status) {
      where.status = status
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Build tag filters array
    const tagFilters = []

    // Filter by university tag
    if (university) {
      tagFilters.push({
        summary_note_tags: {
          some: {
            tags: {
              type: 'university',
              name: { equals: university, mode: 'insensitive' }
            }
          }
        }
      })
    }

    // Filter by semester tag
    if (semester) {
      tagFilters.push({
        summary_note_tags: {
          some: {
            tags: {
              type: 'semester',
              name: { equals: semester, mode: 'insensitive' }
            }
          }
        }
      })
    }

    // Filter by topic tag
    if (topic) {
      tagFilters.push({
        summary_note_tags: {
          some: {
            tags: {
              type: 'topic',
              name: { equals: topic, mode: 'insensitive' }
            }
          }
        }
      })
    }

    // Filter by department tag
    if (department) {
      tagFilters.push({
        summary_note_tags: {
          some: {
            tags: {
              type: 'department',
              name: { equals: department, mode: 'insensitive' }
            }
          }
        }
      })
    }

    // Apply tag filters with AND logic if any exist
    if (tagFilters.length > 0) {
      where.AND = tagFilters
    }

    // Get summary notes with pagination
    const summaryNotes = await prisma.summary_notes.findMany({
      where,
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
      },
      orderBy: {
        created_at: 'desc'
      },
      take: limit + 1,
      skip: offset
    })

    // Check if there are more results
    const hasMore = summaryNotes.length > limit
    const isLastPage = !hasMore

    // Get only the requested number of items
    const notesToReturn = hasMore ? summaryNotes.slice(0, limit) : summaryNotes

    // Transform the data
    const data = notesToReturn.map(note => {
      // Separate tags by group (matching Anatomy Quiz pattern)
      const allTags = note.summary_note_tags.map(t => ({
        id: t.tags.id,
        name: t.tags.name,
        tagGroupId: t.tags.tag_group_id,
        tagGroupName: t.tags.tag_group?.name
      }))

      const universityTags = allTags.filter(tag => tag.tagGroupName === 'university')
      const semesterTags = allTags.filter(tag => tag.tagGroupName === 'semester')
      const topicTags = allTags.filter(tag => tag.tagGroupName === 'topic')
      const departmentTags = allTags.filter(tag => tag.tagGroupName === 'department')

      return {
        id: note.id,
        title: note.title,
        unique_id: note.unique_id,
        description: note.description,
        status: note.status,
        created_at: note.created_at,
        updated_at: note.updated_at,
        tags: allTags,
        universityTags,
        semesterTags,
        topicTags,
        departmentTags
      }
    })

    return {
      data,
      pagination: {
        page: parseInt(page),
        perPage: limit,
        isLastPage
      }
    }
  }
}
