import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import getSkripsiSetsService from '../getSkripsiSetsService.js'
import prisma from '../../../config/database.js'

describe('getSkripsiSetsService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return paginated skripsi sets for a user', async () => {
    const userId = 1
    const page = 1
    const perPage = 20

    const mockSets = [
      {
        id: 1,
        user_id: userId,
        title: 'Set 1',
        description: 'Description 1',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        user_id: userId,
        title: 'Set 2',
        description: 'Description 2',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]

    prisma.skripsi_sets.findMany.mockResolvedValue(mockSets)
    prisma.skripsi_sets.count.mockResolvedValue(2)

    const result = await getSkripsiSetsService(userId, page, perPage)

    expect(prisma.skripsi_sets.findMany).toHaveBeenCalledWith({
      where: {
        user_id: userId,
        is_deleted: false,
      },
      orderBy: {
        updated_at: 'desc',
      },
      skip: 0,
      take: 20,
    })

    expect(prisma.skripsi_sets.count).toHaveBeenCalledWith({
      where: {
        user_id: userId,
        is_deleted: false,
      },
    })

    expect(result).toEqual({
      data: mockSets,
      pagination: {
        page: 1,
        perPage: 20,
        total: 2,
        totalPages: 1,
        isLastPage: true,
      },
    })
  })

  it('should handle pagination correctly for second page', async () => {
    const userId = 1
    const page = 2
    const perPage = 10

    prisma.skripsi_sets.findMany.mockResolvedValue([])
    prisma.skripsi_sets.count.mockResolvedValue(25)

    const result = await getSkripsiSetsService(userId, page, perPage)

    expect(prisma.skripsi_sets.findMany).toHaveBeenCalledWith({
      where: {
        user_id: userId,
        is_deleted: false,
      },
      orderBy: {
        updated_at: 'desc',
      },
      skip: 10,
      take: 10,
    })

    expect(result.pagination).toEqual({
      page: 2,
      perPage: 10,
      total: 25,
      totalPages: 3,
      isLastPage: false,
    })
  })

  it('should return empty array if user has no sets', async () => {
    const userId = 1

    prisma.skripsi_sets.findMany.mockResolvedValue([])
    prisma.skripsi_sets.count.mockResolvedValue(0)

    const result = await getSkripsiSetsService(userId, 1, 20)

    expect(result.data).toEqual([])
    expect(result.pagination.total).toBe(0)
  })

  it('should only return non-deleted sets', async () => {
    const userId = 1

    await getSkripsiSetsService(userId, 1, 20)

    expect(prisma.skripsi_sets.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          is_deleted: false,
        }),
      })
    )
  })
})
