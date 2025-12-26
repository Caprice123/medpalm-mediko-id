import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import deleteSkripsiSetService from '../deleteSkripsiSetService.js'
import prisma from '../../../config/database.js'

describe('deleteSkripsiSetService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should soft delete a skripsi set', async () => {
    const setId = 1
    const userId = 1

    const mockSet = {
      id: setId,
      user_id: userId,
      is_deleted: false,
    }

    const mockUpdatedSet = {
      ...mockSet,
      is_deleted: true,
    }

    prisma.skripsi_sets.findUnique.mockResolvedValue(mockSet)
    prisma.skripsi_sets.update.mockResolvedValue(mockUpdatedSet)

    const result = await deleteSkripsiSetService(setId, userId)

    expect(prisma.skripsi_sets.findUnique).toHaveBeenCalledWith({
      where: { id: setId },
    })

    expect(prisma.skripsi_sets.update).toHaveBeenCalledWith({
      where: { id: setId },
      data: { is_deleted: true },
    })

    expect(result.is_deleted).toBe(true)
  })

  it('should throw error if set not found', async () => {
    const setId = 999
    const userId = 1

    prisma.skripsi_sets.findUnique.mockResolvedValue(null)

    await expect(
      deleteSkripsiSetService(setId, userId)
    ).rejects.toThrow('Set not found')
  })

  it('should throw error if user is not the owner', async () => {
    const setId = 1
    const userId = 1
    const differentUserId = 2

    const mockSet = {
      id: setId,
      user_id: differentUserId,
      is_deleted: false,
    }

    prisma.skripsi_sets.findUnique.mockResolvedValue(mockSet)

    await expect(
      deleteSkripsiSetService(setId, userId)
    ).rejects.toThrow('Unauthorized')
  })

  it('should throw error if set is already deleted', async () => {
    const setId = 1
    const userId = 1

    const mockSet = {
      id: setId,
      user_id: userId,
      is_deleted: true,
    }

    prisma.skripsi_sets.findUnique.mockResolvedValue(mockSet)

    await expect(
      deleteSkripsiSetService(setId, userId)
    ).rejects.toThrow('Set already deleted')
  })
})
