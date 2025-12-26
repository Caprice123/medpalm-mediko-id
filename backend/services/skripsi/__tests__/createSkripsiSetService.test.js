import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import createSkripsiSetService from '../createSkripsiSetService.js'
import prisma from '../../../config/database.js'

describe('createSkripsiSetService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should create a new skripsi set with default tabs', async () => {
    const userId = 1
    const title = 'Test Skripsi Set'
    const description = 'Test Description'

    const mockSet = {
      id: 1,
      user_id: userId,
      title,
      description,
      created_at: new Date(),
      updated_at: new Date(),
      is_deleted: false,
    }

    const mockTabs = [
      { id: 1, set_id: 1, tab_type: 'ai_researcher_1', title: 'AI Researcher 1' },
      { id: 2, set_id: 1, tab_type: 'ai_researcher_2', title: 'AI Researcher 2' },
      { id: 3, set_id: 1, tab_type: 'ai_researcher_3', title: 'AI Researcher 3' },
      { id: 4, set_id: 1, tab_type: 'paraphraser', title: 'Paraphraser' },
      { id: 5, set_id: 1, tab_type: 'diagram_builder', title: 'Diagram Builder' },
    ]

    prisma.skripsi_sets.create.mockResolvedValue({
      ...mockSet,
      tabs: mockTabs,
    })

    const result = await createSkripsiSetService(userId, title, description)

    expect(prisma.skripsi_sets.create).toHaveBeenCalledWith({
      data: {
        user_id: userId,
        title,
        description,
        tabs: {
          createMany: {
            data: [
              { tab_type: 'ai_researcher_1', title: 'AI Researcher 1' },
              { tab_type: 'ai_researcher_2', title: 'AI Researcher 2' },
              { tab_type: 'ai_researcher_3', title: 'AI Researcher 3' },
              { tab_type: 'paraphraser', title: 'Paraphraser' },
              { tab_type: 'diagram_builder', title: 'Diagram Builder' },
            ],
          },
        },
      },
      include: {
        tabs: true,
      },
    })

    expect(result).toEqual({
      ...mockSet,
      tabs: mockTabs,
    })
  })

  it('should create a set without description if not provided', async () => {
    const userId = 1
    const title = 'Test Skripsi Set'

    const mockSet = {
      id: 1,
      user_id: userId,
      title,
      description: null,
      created_at: new Date(),
      updated_at: new Date(),
      is_deleted: false,
      tabs: [],
    }

    prisma.skripsi_sets.create.mockResolvedValue(mockSet)

    await createSkripsiSetService(userId, title, null)

    expect(prisma.skripsi_sets.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          user_id: userId,
          title,
          description: null,
        }),
      })
    )
  })

  it('should throw error if database operation fails', async () => {
    const userId = 1
    const title = 'Test Skripsi Set'
    const description = 'Test Description'

    prisma.skripsi_sets.create.mockRejectedValue(new Error('Database error'))

    await expect(
      createSkripsiSetService(userId, title, description)
    ).rejects.toThrow('Database error')
  })
})
