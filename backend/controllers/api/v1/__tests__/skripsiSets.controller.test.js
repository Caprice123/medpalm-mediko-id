import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import * as SkripsiSetsController from '#skripsiSets.controller'

// Mock services
jest.mock('#services/skripsi/getSkripsiSetsService', () => ({
  __esModule: true,
  default: jest.fn(),
}))
jest.mock('#services/skripsi/createSkripsiSetService', () => ({
  __esModule: true,
  default: jest.fn(),
}))
jest.mock('#services/skripsi/getSkripsiSetService', () => ({
  __esModule: true,
  default: jest.fn(),
}))
jest.mock('#services/skripsi/updateSkripsiSetService', () => ({
  __esModule: true,
  default: jest.fn(),
}))
jest.mock('#services/skripsi/deleteSkripsiSetService', () => ({
  __esModule: true,
  default: jest.fn(),
}))

import getSkripsiSetsService from '#services/skripsi/getSkripsiSetsService'
import createSkripsiSetService from '#services/skripsi/createSkripsiSetService'
import getSkripsiSetService from '#services/skripsi/getSkripsiSetService'
import updateSkripsiSetService from '#services/skripsi/updateSkripsiSetService'
import deleteSkripsiSetService from '#services/skripsi/deleteSkripsiSetService'

describe('SkripsiSetsController', () => {
  let req, res

  beforeEach(() => {
    jest.clearAllMocks()
    req = {
      user: { id: 1 },
      body: {},
      params: {},
      query: {},
    }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
  })

  describe('getSets', () => {
    it('should return sets with pagination', async () => {
      const mockResult = {
        data: [
          { id: 1, title: 'Set 1' },
          { id: 2, title: 'Set 2' },
        ],
        pagination: {
          page: 1,
          perPage: 20,
          total: 2,
          totalPages: 1,
          isLastPage: true,
        },
      }

      getSkripsiSetsService.mockResolvedValue(mockResult)

      req.query = { page: '1', perPage: '20' }

      await SkripsiSetsController.getSets(req, res)

      expect(getSkripsiSetsService).toHaveBeenCalledWith(1, 1, 20)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Sets retrieved successfully',
        data: mockResult.data,
        pagination: mockResult.pagination,
      })
    })

    it('should use default pagination values', async () => {
      const mockResult = {
        data: [],
        pagination: {
          page: 1,
          perPage: 20,
          total: 0,
          totalPages: 0,
          isLastPage: true,
        },
      }

      getSkripsiSetsService.mockResolvedValue(mockResult)

      await SkripsiSetsController.getSets(req, res)

      expect(getSkripsiSetsService).toHaveBeenCalledWith(1, 1, 20)
    })
  })

  describe('createSet', () => {
    it('should create a new set', async () => {
      const mockSet = {
        id: 1,
        user_id: 1,
        title: 'New Set',
        description: 'Test description',
        tabs: [],
      }

      createSkripsiSetService.mockResolvedValue(mockSet)

      req.body = {
        title: 'New Set',
        description: 'Test description',
      }

      await SkripsiSetsController.createSet(req, res)

      expect(createSkripsiSetService).toHaveBeenCalledWith(
        1,
        'New Set',
        'Test description'
      )
      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Set created successfully',
        data: mockSet,
      })
    })

    it('should return 400 if title is missing', async () => {
      req.body = { description: 'Test' }

      await SkripsiSetsController.createSet(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Title is required',
      })
    })
  })

  describe('getSet', () => {
    it('should return a single set with tabs and messages', async () => {
      const mockSet = {
        id: 1,
        title: 'Test Set',
        tabs: [
          { id: 1, tab_type: 'ai_researcher_1', messages: [] },
        ],
      }

      getSkripsiSetService.mockResolvedValue(mockSet)

      req.params = { id: '1' }

      await SkripsiSetsController.getSet(req, res)

      expect(getSkripsiSetService).toHaveBeenCalledWith(1, 1)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Set retrieved successfully',
        data: mockSet,
      })
    })
  })

  describe('updateSet', () => {
    it('should update a set', async () => {
      const mockSet = {
        id: 1,
        title: 'Updated Set',
        description: 'Updated description',
      }

      updateSkripsiSetService.mockResolvedValue(mockSet)

      req.params = { id: '1' }
      req.body = {
        title: 'Updated Set',
        description: 'Updated description',
      }

      await SkripsiSetsController.updateSet(req, res)

      expect(updateSkripsiSetService).toHaveBeenCalledWith(
        1,
        1,
        'Updated Set',
        'Updated description'
      )
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Set updated successfully',
        data: mockSet,
      })
    })
  })

  describe('deleteSet', () => {
    it('should delete a set', async () => {
      deleteSkripsiSetService.mockResolvedValue()

      req.params = { id: '1' }

      await SkripsiSetsController.deleteSet(req, res)

      expect(deleteSkripsiSetService).toHaveBeenCalledWith(1, 1)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Set deleted successfully',
      })
    })
  })
})
