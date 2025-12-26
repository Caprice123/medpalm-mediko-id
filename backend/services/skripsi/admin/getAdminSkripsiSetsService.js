import prisma from '../../../prisma/client.js'
import { BaseService } from '../../baseService.js'
import { ValidationError } from '../../../errors/validationError.js'

export class GetAdminSkripsiSetsService extends BaseService {
  static async call({ page = 1, perPage = 20, userId, search }) {
    this.validate({ page, perPage, userId })

    const skip = (page - 1) * perPage
    const take = perPage + 1

    // Build where clause
    const where = {
      is_deleted: false
    }

    if (userId) {
      where.user_id = userId
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Get sets with user info and tab count (fetch one extra to determine if there's more)
    const sets = await prisma.skripsi_sets.findMany({
      where,
      take,
      skip,
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        tabs: {
          select: {
            id: true,
            tab_type: true,
            title: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    })

    const isLastPage = sets.length <= perPage
    const paginatedSets = sets.slice(0, perPage)

    // Transform data to include tab count and latest update
    const transformedSets = paginatedSets.map(set => ({
      id: set.id,
      title: set.title,
      description: set.description,
      user: set.users,
      tabCount: set.tabs.length,
      tabs: set.tabs,
      created_at: set.created_at,
      updated_at: set.updated_at
    }))

    return {
      data: transformedSets,
      pagination: {
        page,
        perPage,
        isLastPage
      }
    }
  }

  static validate({ page, perPage, userId }) {
    if (page && (isNaN(parseInt(page)) || parseInt(page) < 1)) {
      throw new ValidationError('Invalid page number')
    }

    if (perPage) {
      const perPageNum = parseInt(perPage)
      if (isNaN(perPageNum) || perPageNum < 1 || perPageNum > 100) {
        throw new ValidationError('Invalid perPage. Must be between 1 and 100')
      }
    }

    if (userId && isNaN(parseInt(userId))) {
      throw new ValidationError('Invalid user ID')
    }
  }
}

export default GetAdminSkripsiSetsService
