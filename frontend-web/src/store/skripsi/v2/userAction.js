import Endpoints from '@config/endpoint'
import { captureException } from '@config/sentry'
import { actions as commonActions } from '@store/common/reducer'
import { getWithToken, postWithToken, putWithToken, deleteWithToken } from '../../../utils/requestUtils'
import { actions } from './reducer'
import { streamMessage } from './streaming'

const base = Endpoints.api.skripsiV2

const MESSAGES_PER_PAGE = 50

// AbortControllers are not serializable, so they live here rather than in
// Redux. Keyed by tab: stopping one answer must not abort another tab's.
const abortControllers = {}

// ============= Bootstrap =============

// Config plus the first page of sets in one request, replacing V1's two calls
// on mount.
export const bootstrapSkripsi = ({ perPage = 20 } = {}) => async (dispatch) => {
  try {
    dispatch(actions.setLoading({ key: 'isBootstrapping', value: true }))

    const response = await getWithToken(`${base}/bootstrap`, { perPage })
    const { config, sets, pagination } = response.data.data

    dispatch(actions.setConfig(config))
    dispatch(actions.setSets(sets || []))
    if (pagination) dispatch(actions.setPagination(pagination))

    return response.data.data
  } finally {
    dispatch(actions.setLoading({ key: 'isBootstrapping', value: false }))
  }
}

// ============= Sets =============

// Reads whichever page the reducer points at; callers reset or advance
// `pagination.page` first. The thunk never decides the page itself.
export const fetchSets = ({ append = false } = {}) => async (dispatch, getState) => {
  const loadingKey = append ? 'isLoadingMoreSets' : 'isFetchingSets'

  try {
    dispatch(actions.setLoading({ key: loadingKey, value: true }))

    const { pagination, filters } = getState().skripsiV2
    const response = await getWithToken(`${base}/sets`, {
      page: pagination.page,
      perPage: pagination.perPage,
      // Filtering is server-side — V1 had a search box whose value never left
      // the browser, because its list endpoint took no search argument.
      ...(filters.search ? { search: filters.search } : {}),
    })

    const sets = response.data.data || []
    dispatch(append ? actions.appendSets(sets) : actions.setSets(sets))

    if (response.data.pagination) {
      dispatch(actions.setPagination(response.data.pagination))
    }
  } finally {
    dispatch(actions.setLoading({ key: loadingKey, value: false }))
  }
}

export const loadMoreSets = () => (dispatch, getState) => {
  const { pagination, loading } = getState().skripsiV2
  if (pagination.isLastPage || loading.isLoadingMoreSets) return

  dispatch(actions.setPagination({ page: pagination.page + 1 }))
  return dispatch(fetchSets({ append: true }))
}

export const reloadSets = () => (dispatch) => {
  dispatch(actions.setPagination({ page: 1 }))
  return dispatch(fetchSets())
}

export const fetchSet = (uniqueId) => async (dispatch) => {
  try {
    dispatch(actions.setLoading({ key: 'isFetchingSet', value: true }))

    const response = await getWithToken(`${base}/sets/${uniqueId}`)
    dispatch(actions.setCurrentSet(response.data.data))

    return response.data.data
  } finally {
    dispatch(actions.setLoading({ key: 'isFetchingSet', value: false }))
  }
}

// Creating a set also creates its tab row from whichever tabs are enabled, so
// the response carries them and the editor can open without a second read.
export const createSet = (title, description) => async (dispatch) => {
  try {
    dispatch(actions.setLoading({ key: 'isCreatingSet', value: true }))

    const response = await postWithToken(`${base}/sets`, { title, description })
    dispatch(actions.addSet(response.data.data))

    return response.data.data
  } finally {
    dispatch(actions.setLoading({ key: 'isCreatingSet', value: false }))
  }
}

export const updateSetInfo = (uniqueId, { title, description }) => async (dispatch) => {
  try {
    dispatch(actions.setLoading({ key: 'isUpdatingSet', value: true }))

    const response = await putWithToken(`${base}/sets/${uniqueId}`, { title, description })
    dispatch(actions.updateSet(response.data.data))

    return response.data.data
  } finally {
    dispatch(actions.setLoading({ key: 'isUpdatingSet', value: false }))
  }
}

export const deleteSet = (uniqueId) => async (dispatch) => {
  try {
    dispatch(actions.setLoading({ key: 'isDeletingSet', value: true }))

    await deleteWithToken(`${base}/sets/${uniqueId}`)
    dispatch(actions.removeSet(uniqueId))
  } finally {
    dispatch(actions.setLoading({ key: 'isDeletingSet', value: false }))
  }
}

// The editor autosaves, so this runs far more often than the rest. The local
// copy is updated first so the editor never waits on the network to show its
// own keystrokes.
export const saveSetContent = (uniqueId, editorContent) => async (dispatch) => {
  dispatch(actions.setEditorContent(editorContent))

  try {
    dispatch(actions.setLoading({ key: 'isSavingContent', value: true }))
    await putWithToken(`${base}/sets/${uniqueId}/content`, { editorContent })
  } finally {
    dispatch(actions.setLoading({ key: 'isSavingContent', value: false }))
  }
}

// ============= Research settings (per set) =============

export const fetchSetResearchSettings = (uniqueId) => async () => {
  const response = await getWithToken(`${base}/sets/${uniqueId}/research-settings`)
  return response.data.data
}

export const updateSetResearchSettings = (uniqueId, settings) => async (dispatch) => {
  try {
    dispatch(actions.setLoading({ key: 'isUpdatingResearchSettings', value: true }))

    const response = await putWithToken(`${base}/sets/${uniqueId}/research-settings`, settings)
    return response.data.data
  } finally {
    dispatch(actions.setLoading({ key: 'isUpdatingResearchSettings', value: false }))
  }
}

// The pickers feed a modal rather than the page, so they return their result
// instead of storing it.
export const fetchSkripsiDomains = ({ page = 1, perPage = 12, search = '' } = {}) => async () => {
  const response = await getWithToken(`${base}/research/domains`, { page, perPage, ...(search ? { search } : {}) })
  return response.data.data
}

export const fetchSkripsiJournals = ({ page = 1, perPage = 20, search = '' } = {}) => async () => {
  const response = await getWithToken(`${base}/research/journals`, { page, perPage, ...(search ? { search } : {}) })
  return response.data.data
}

// Live lookup against the journal index itself, so a saved journal always
// resolves at search time.
export const searchSkripsiJournals = ({ query = '', page = 1, perPage = 10 } = {}) => async () => {
  const response = await getWithToken(`${base}/research/journals/search`, { q: query.trim(), page, perPage })
  return response.data
}

// ============= Tabs & messages =============

// Messages page backwards from a cursor, not a page number: new messages
// arrive while a tab is open, so an offset would skip or repeat rows.
export const fetchTabMessages = (tabId, { before = null, prepend = false } = {}) => async (dispatch) => {
  try {
    dispatch(actions.setLoading({ key: 'isFetchingMessages', value: true }))

    const response = await getWithToken(`${base}/tabs/${tabId}/messages`, {
      limit: MESSAGES_PER_PAGE,
      ...(before ? { beforeMessageId: before } : {}),
    })

    const messages = response.data.data || []
    dispatch(prepend
      ? actions.prependMessages({ tabId, messages })
      : actions.setMessages({ tabId, messages }))

    dispatch(actions.setMessagePaging({
      tabId,
      hasMore: Boolean(response.data.hasMore),
      // The oldest row on screen is the cursor for the next page back.
      ...(messages.length > 0 && { oldestMessageId: messages[0].id }),
    }))

    return { messages, hasMore: Boolean(response.data.hasMore) }
  } finally {
    dispatch(actions.setLoading({ key: 'isFetchingMessages', value: false }))
  }
}

export const loadOlderMessages = (tabId) => (dispatch, getState) => {
  const { messagePagingByTab, loading } = getState().skripsiV2
  const paging = messagePagingByTab[tabId]

  if (!paging?.hasMore || !paging.oldestMessageId || loading.isFetchingMessages) return

  return dispatch(fetchTabMessages(tabId, { before: paging.oldestMessageId, prepend: true }))
}

// Opening a tab reuses cached messages — moving between tabs should not pay
// for a refetch each time.
export const openTab = (tabId) => (dispatch, getState) => {
  dispatch(actions.setActiveTabId(tabId))

  const cached = getState().skripsiV2.messagesByTab[tabId]
  if (cached?.length) return

  return dispatch(fetchTabMessages(tabId))
}

export const setTabMode = (tabId, mode) => (dispatch) => {
  dispatch(actions.setModeForTab({ tabId, mode }))
}

// Moves a message off status 'streaming' — with the whole text when the stream
// played out, or with exactly what was displayed when the user stopped it.
export const finalizeMessage = (tabId, messageId, content, isComplete) => async () => {
  const response = await postWithToken(
    `${base}/tabs/${tabId}/messages/${messageId}/finalize`,
    { content, isComplete }
  )
  return response.data
}

export const sendMessage = (tabId, content, modeType) => async (dispatch, getState) => {
  const state = getState().skripsiV2
  const mode = modeType || state.modeByTab[tabId] || state.defaultMode

  try {
    dispatch(actions.setTabLoading({ tabId, key: 'isSendingMessage', value: true }))

    if (!state.modeByTab[tabId]) {
      dispatch(actions.setModeForTab({ tabId, mode }))
    }

    // Shown immediately, then swapped for the persisted row once the backend
    // reports the real id.
    const optimisticUserMessage = {
      id: `temp-user-${Date.now()}`,
      senderType: 'user',
      content,
      modeType: mode,
      createdAt: new Date().toISOString(),
    }
    dispatch(actions.addMessage({ tabId, message: optimisticUserMessage }))

    dispatch(actions.setStreamingState({
      tabId,
      isSending: true,
      isTyping: false,
      userStopped: false,
      userMessage: content,
      userMessageCreatedAt: optimisticUserMessage.createdAt,
      optimisticUserId: optimisticUserMessage.id,
      modeType: mode,
    }))

    abortControllers[tabId] = new AbortController()

    return await streamMessage({
      tabId,
      content,
      modeType: mode,
      dispatch,
      getState,
      optimisticUserId: optimisticUserMessage.id,
      abortController: abortControllers[tabId],
      finalizeMessage,
    })
  } catch (error) {
    if (error.name === 'AbortError') return null

    captureException(error, { feature: 'skripsi_v2', tabId, phase: 'send' })
    dispatch(commonActions.setError({ message: error.message || 'Terjadi kesalahan saat mengirim pesan' }))
    dispatch(actions.setTabLoading({ tabId, key: 'isSendingMessage', value: false }))
    return null
  } finally {
    delete abortControllers[tabId]
  }
}

// Stops an answer mid-flight and keeps exactly the text the student saw.
export const stopStreaming = (tabId) => async (dispatch, getState) => {
  // Set before aborting: the typing loop reads this flag to stop revealing text.
  dispatch(actions.setStreamingState({ tabId, userStopped: true, isTyping: false }))

  abortControllers[tabId]?.abort()

  const state = getState().skripsiV2
  const streaming = state.streamingStateByTab[tabId]

  // Nothing was persisted yet, so there is nothing to truncate.
  if (!streaming?.realMessageId || !streaming.displayedContent) {
    dispatch(actions.clearStreamingState(tabId))
    dispatch(actions.setTabLoading({ tabId, key: 'isSendingMessage', value: false }))
    return null
  }

  try {
    const response = await dispatch(finalizeMessage(
      tabId,
      streaming.realMessageId,
      streaming.displayedContent,
      false
    ))

    dispatch(actions.removeMessage({ tabId, messageId: streaming.streamingMessageId }))
    dispatch(actions.removeMessage({ tabId, messageId: streaming.optimisticUserId }))

    const mode = streaming.modeType || state.modeByTab[tabId] || state.defaultMode

    if (streaming.userMessage && streaming.realUserMessageId) {
      dispatch(actions.addMessage({
        tabId,
        message: {
          id: streaming.realUserMessageId,
          senderType: 'user',
          content: streaming.userMessage,
          modeType: mode,
          createdAt: streaming.userMessageCreatedAt,
        },
      }))
    }

    if (response.data) {
      dispatch(actions.addMessage({
        tabId,
        message: {
          id: response.data.id,
          senderType: 'ai',
          content: response.data.content,
          modeType: response.data.modeType || mode,
          status: response.data.status,
          sources: response.data.sources || [],
          createdAt: response.data.createdAt || response.data.updatedAt,
        },
      }))
    }
  } catch (error) {
    captureException(error, { feature: 'skripsi_v2', tabId, phase: 'stop' })
  } finally {
    dispatch(actions.clearStreamingState(tabId))
    dispatch(actions.setTabLoading({ tabId, key: 'isSendingMessage', value: false }))
  }

  return null
}

// ============= Diagram builder =============

export const generateDiagram = (tabId, diagramConfig) => async (dispatch) => {
  try {
    dispatch(actions.setLoading({ key: 'isGeneratingDiagram', value: true }))

    const response = await postWithToken(`${base}/tabs/${tabId}/diagrams`, diagramConfig)
    return response.data.data
  } finally {
    dispatch(actions.setLoading({ key: 'isGeneratingDiagram', value: false }))
  }
}

export const createDiagram = (tabId, diagramData, diagramConfig = {}, creationMethod = 'manual') => async (dispatch) => {
  try {
    dispatch(actions.setLoading({ key: 'isSavingDiagram', value: true }))

    const response = await postWithToken(`${base}/tabs/${tabId}/diagrams/manual`, {
      diagramData,
      diagramConfig,
      creationMethod,
    })
    return response.data.data
  } finally {
    dispatch(actions.setLoading({ key: 'isSavingDiagram', value: false }))
  }
}

// The history list omits the stored canvas — it is large, and the list only
// needs to name its entries.
export const fetchDiagramHistory = (tabId) => async (dispatch) => {
  try {
    dispatch(actions.setLoading({ key: 'isFetchingDiagrams', value: true }))

    const response = await getWithToken(`${base}/tabs/${tabId}/diagrams`)
    dispatch(actions.setDiagrams({ tabId, diagrams: response.data.data || [] }))

    return response.data.data
  } finally {
    dispatch(actions.setLoading({ key: 'isFetchingDiagrams', value: false }))
  }
}

export const fetchDiagramDetail = (diagramId) => async () => {
  const response = await getWithToken(`${base}/diagrams/${diagramId}`)
  return response.data.data
}

export const updateDiagram = (diagramId, diagramData) => async (dispatch) => {
  try {
    dispatch(actions.setLoading({ key: 'isSavingDiagram', value: true }))

    const response = await putWithToken(`${base}/diagrams/${diagramId}`, { diagramData })
    return response.data.data
  } finally {
    dispatch(actions.setLoading({ key: 'isSavingDiagram', value: false }))
  }
}

// Autosaves the canvas into the tab's own content, separately from the diagram
// history entry.
export const saveTabDiagram = (tabId, diagramData) => async (dispatch) => {
  try {
    dispatch(actions.setLoading({ key: 'isSavingDiagram', value: true }))

    const response = await putWithToken(`${base}/tabs/${tabId}/diagram`, { diagramData })
    return response.data.data
  } finally {
    dispatch(actions.setLoading({ key: 'isSavingDiagram', value: false }))
  }
}
