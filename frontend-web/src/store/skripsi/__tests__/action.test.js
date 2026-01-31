import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchSets, createSet, deleteSet, saveTabContent, sendMessage } from '../action'
import * as requestUtils from '../../../utils/requestUtils'

// Mock request utils
vi.mock('../../../utils/requestUtils', () => ({
  getWithToken: vi.fn(),
  postWithToken: vi.fn(),
  putWithToken: vi.fn(),
  deleteWithToken: vi.fn(),
}))

// Mock error utils
vi.mock('../../../utils/errorUtils', () => ({
  handleApiError: vi.fn(),
}))

describe('Skripsi Redux Actions', () => {
  let dispatch

  beforeEach(() => {
    dispatch = vi.fn((action) => {
      if (typeof action === 'function') {
        return action(dispatch)
      }
      return action
    })
    vi.clearAllMocks()
  })

  describe('fetchSets', () => {
    it('should fetch sets successfully', async () => {
      const mockResponse = {
        data: {
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
        },
      }

      requestUtils.getWithToken.mockResolvedValue(mockResponse)

      const action = fetchSets(1, 20)
      const result = await action(dispatch)

      expect(requestUtils.getWithToken).toHaveBeenCalled()
      expect(result).toEqual(mockResponse.data)
      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'skripsi/setLoading',
          payload: { key: 'isSetsLoading', value: true },
        })
      )
    })

    it('should handle fetch error', async () => {
      const error = new Error('Network error')
      requestUtils.getWithToken.mockRejectedValue(error)

      const action = fetchSets()

      await expect(action(dispatch)).rejects.toThrow('Network error')
    })
  })

  describe('createSet', () => {
    it('should create a new set', async () => {
      const mockResponse = {
        data: {
          data: {
            id: 1,
            title: 'New Set',
            description: 'Test description',
            tabs: [],
          },
        },
      }

      requestUtils.postWithToken.mockResolvedValue(mockResponse)

      const action = createSet('New Set', 'Test description')
      const result = await action(dispatch)

      expect(requestUtils.postWithToken).toHaveBeenCalledWith(
        expect.any(String),
        {
          title: 'New Set',
          description: 'Test description',
        }
      )
      expect(result).toEqual(mockResponse.data.data)
      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'skripsi/addSet',
        })
      )
    })

    it('should handle create error', async () => {
      const error = new Error('Validation error')
      requestUtils.postWithToken.mockRejectedValue(error)

      const action = createSet('', '')

      await expect(action(dispatch)).rejects.toThrow('Validation error')
    })
  })

  describe('deleteSet', () => {
    it('should delete a set', async () => {
      requestUtils.deleteWithToken.mockResolvedValue({})

      const action = deleteSet(1)
      await action(dispatch)

      expect(requestUtils.deleteWithToken).toHaveBeenCalled()
      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'skripsi/removeSet',
          payload: 1,
        })
      )
    })
  })

  describe('saveTabContent', () => {
    it('should save tab content', async () => {
      const mockResponse = {
        data: {
          success: true,
        },
      }

      requestUtils.putWithToken.mockResolvedValue(mockResponse)

      const action = saveTabContent(1, '<p>Test content</p>')
      const result = await action(dispatch)

      expect(requestUtils.putWithToken).toHaveBeenCalledWith(
        expect.any(String),
        { editorContent: '<p>Test content</p>' }
      )
      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'skripsi/updateTabContent',
        })
      )
    })
  })

  describe('sendMessage', () => {
    it('should send a message and receive AI response', async () => {
      const mockResponse = {
        data: {
          data: {
            userMessage: {
              id: 1,
              sender_type: 'user',
              content: 'Test message',
              created_at: new Date().toISOString(),
            },
            aiMessage: {
              id: 2,
              sender_type: 'ai',
              content: 'AI response',
              created_at: new Date().toISOString(),
            },
          },
        },
      }

      requestUtils.postWithToken.mockResolvedValue(mockResponse)

      const action = sendMessage(1, 'Test message')
      const result = await action(dispatch)

      expect(requestUtils.postWithToken).toHaveBeenCalledWith(
        expect.any(String),
        { message: 'Test message' }
      )
      expect(result).toEqual(mockResponse.data)

      // Should dispatch addMessage twice (user + AI)
      const addMessageCalls = dispatch.mock.calls.filter(
        call => call[0]?.type === 'skripsi/addMessage'
      )
      expect(addMessageCalls).toHaveLength(2)
    })
  })
})
