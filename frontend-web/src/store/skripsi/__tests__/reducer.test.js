import { describe, it, expect } from 'vitest'
import reducer, { actions } from '../reducer'

describe('Skripsi Reducer', () => {
  const initialState = {
    sets: [],
    currentSet: null,
    currentTab: null,
    loading: {
      isSetsLoading: false,
      isSetLoading: false,
      isSendingMessage: false,
      isSavingContent: false,
    },
    pagination: {
      page: 1,
      perPage: 20,
      total: 0,
      totalPages: 0,
      isLastPage: false,
    },
    error: null,
  }

  it('should return initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState)
  })

  describe('setSets', () => {
    it('should set sets', () => {
      const sets = [
        { id: 1, uniqueId: 'uuid-1', title: 'Set 1' },
        { id: 2, uniqueId: 'uuid-2', title: 'Set 2' },
      ]

      const state = reducer(initialState, actions.setSets(sets))

      expect(state.sets).toEqual(sets)
    })
  })

  describe('addSet', () => {
    it('should add a new set to the beginning', () => {
      const existingState = {
        ...initialState,
        sets: [{ id: 1, uniqueId: 'uuid-1', title: 'Set 1' }],
      }

      const newSet = { id: 2, uniqueId: 'uuid-2', title: 'Set 2' }
      const state = reducer(existingState, actions.addSet(newSet))

      expect(state.sets).toHaveLength(2)
      expect(state.sets[0]).toEqual(newSet)
    })
  })

  describe('updateSet', () => {
    it('should update a set in the list', () => {
      const existingState = {
        ...initialState,
        sets: [
          { id: 1, uniqueId: 'uuid-1', title: 'Set 1' },
          { id: 2, uniqueId: 'uuid-2', title: 'Set 2' },
        ],
      }

      const updatedSet = { id: 1, uniqueId: 'uuid-1', title: 'Updated Set 1' }
      const state = reducer(existingState, actions.updateSet(updatedSet))

      expect(state.sets[0].title).toBe('Updated Set 1')
    })

    it('should update currentSet if it matches', () => {
      const existingState = {
        ...initialState,
        currentSet: { id: 1, uniqueId: 'uuid-1', title: 'Set 1' },
      }

      const updatedSet = { id: 1, uniqueId: 'uuid-1', title: 'Updated Set 1' }
      const state = reducer(existingState, actions.updateSet(updatedSet))

      expect(state.currentSet.title).toBe('Updated Set 1')
    })
  })

  describe('removeSet', () => {
    it('should remove a set from the list', () => {
      const existingState = {
        ...initialState,
        sets: [
          { id: 1, uniqueId: 'uuid-1', title: 'Set 1' },
          { id: 2, uniqueId: 'uuid-2', title: 'Set 2' },
        ],
      }

      const state = reducer(existingState, actions.removeSet('uuid-1'))

      expect(state.sets).toHaveLength(1)
      expect(state.sets[0].uniqueId).toBe('uuid-2')
    })

    it('should clear currentSet if removed set matches', () => {
      const existingState = {
        ...initialState,
        currentSet: { id: 1, uniqueId: 'uuid-1', title: 'Set 1' },
      }

      const state = reducer(existingState, actions.removeSet('uuid-1'))

      expect(state.currentSet).toBeNull()
    })
  })

  describe('setCurrentTab', () => {
    it('should set current tab', () => {
      const tab = { id: 1, tab_type: 'ai_researcher_1', title: 'AI Researcher 1' }
      const state = reducer(initialState, actions.setCurrentTab(tab))

      expect(state.currentTab).toEqual(tab)
    })
  })

  describe('updateSetContent', () => {
    it('should update set editor content', () => {
      const existingState = {
        ...initialState,
        currentSet: {
          id: 1,
          uniqueId: 'uuid-1',
          title: 'My Set',
          editor_content: '',
          tabs: [
            { id: 1, tab_type: 'ai_researcher_1' },
            { id: 2, tab_type: 'ai_researcher_2' },
          ],
        },
      }

      const state = reducer(
        existingState,
        actions.updateSetContent({ setId: 'uuid-1', editorContent: '<p>New content</p>' })
      )

      expect(state.currentSet.editorContent).toBe('<p>New content</p>')
    })
  })

  describe('addMessage', () => {
    it('should add a message to tab', () => {
      const existingState = {
        ...initialState,
        currentSet: {
          id: 1,
          tabs: [
            { id: 1, tab_type: 'ai_researcher_1', messages: [] },
          ],
        },
      }

      const message = {
        id: 1,
        sender_type: 'user',
        content: 'Test message',
        created_at: new Date().toISOString(),
      }

      const state = reducer(
        existingState,
        actions.addMessage({ tabId: 1, message })
      )

      expect(state.currentSet.tabs[0].messages).toHaveLength(1)
      expect(state.currentSet.tabs[0].messages[0]).toEqual(message)
    })

    it('should initialize messages array if not exists', () => {
      const existingState = {
        ...initialState,
        currentSet: {
          id: 1,
          tabs: [
            { id: 1, tab_type: 'ai_researcher_1' },
          ],
        },
      }

      const message = { id: 1, content: 'Test' }
      const state = reducer(
        existingState,
        actions.addMessage({ tabId: 1, message })
      )

      expect(state.currentSet.tabs[0].messages).toBeDefined()
      expect(state.currentSet.tabs[0].messages).toHaveLength(1)
    })
  })

  describe('setLoading', () => {
    it('should update loading state', () => {
      const state = reducer(
        initialState,
        actions.setLoading({ key: 'isSetsLoading', value: true })
      )

      expect(state.loading.isSetsLoading).toBe(true)
    })
  })

  describe('setPagination', () => {
    it('should update pagination', () => {
      const pagination = {
        page: 2,
        perPage: 10,
        total: 50,
        totalPages: 5,
        isLastPage: false,
      }

      const state = reducer(initialState, actions.setPagination(pagination))

      expect(state.pagination).toEqual(pagination)
    })
  })

  describe('error handling', () => {
    it('should set error', () => {
      const error = 'Something went wrong'
      const state = reducer(initialState, actions.setError(error))

      expect(state.error).toBe(error)
    })

    it('should clear error', () => {
      const existingState = {
        ...initialState,
        error: 'Some error',
      }

      const state = reducer(existingState, actions.clearError())

      expect(state.error).toBeNull()
    })
  })

  describe('resetState', () => {
    it('should reset to initial state', () => {
      const existingState = {
        sets: [{ id: 1 }],
        currentSet: { id: 1 },
        currentTab: { id: 1 },
        loading: {
          isSetsLoading: true,
          isSetLoading: true,
          isSendingMessage: true,
          isSavingContent: true,
        },
        pagination: {
          page: 5,
          perPage: 10,
          total: 100,
          totalPages: 10,
          isLastPage: false,
        },
        error: 'Some error',
      }

      const state = reducer(existingState, actions.resetState())

      expect(state).toEqual(initialState)
    })
  })
})
