import Endpoints from '@config/endpoint'
import { captureException } from '@config/sentry'
import { actions as commonActions } from '@store/common/reducer'
import { getWithToken, postWithToken, putWithToken, deleteWithToken } from '../../../utils/requestUtils'
import { actions, selectChatContext } from './reducer'
import { streamMessage } from './streaming'

const base = Endpoints.api.skripsiV2

// The editor's three side panels each have their own prefix on the server, so
// a change to one panel's API is a change to one line here.
const chatBase = `${base}/chat`
const searcherBase = `${base}/searcher`
const diagramBase = `${base}/diagrams`

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

// Opening a report is one request: the set, its tabs, every section and the
// group all arrive together, because the editor cannot draw without all four.
// The separate section and member routes are still there, and are what the
// writes below refresh from.
export const fetchSet = (uniqueId) => async (dispatch) => {
  try {
    dispatch(actions.setLoading({ key: 'isFetchingSet', value: true }))

    const response = await getWithToken(`${base}/sets/${uniqueId}`)
    const set = response.data.data

    dispatch(actions.setCurrentSet(set))
    if (set.sections) dispatch(actions.setSections(set.sections))
    if (set.members) dispatch(actions.setMembers(set.members))

    return set
  } finally {
    dispatch(actions.setLoading({ key: 'isFetchingSet', value: false }))
  }
}

// Creating a set also creates its tab row from whichever tabs are enabled, so
// the response carries them and the editor can open without a second read.
export const createSet = (title, description, {
  templateId = null,
  workMode = 'manual',
  caseText = '',
  members = [],
} = {}) => async (dispatch) => {
  try {
    dispatch(actions.setLoading({ key: 'isCreatingSet', value: true }))

    const response = await postWithToken(`${base}/sets`, {
      title, description, templateId, workMode, caseText, members,
    })
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

// ============= Report templates =============

// The picker on "Buat laporan baru". A handful of rows, rendered at once, so
// there is no pagination to carry.
export const fetchSkripsiTemplates = () => async (dispatch) => {
  try {
    dispatch(actions.setLoading({ key: 'isFetchingTemplates', value: true }))

    const response = await getWithToken(`${base}/templates`)
    dispatch(actions.setTemplates(response.data.data || []))

    return response.data.data
  } finally {
    dispatch(actions.setLoading({ key: 'isFetchingTemplates', value: false }))
  }
}

// Saves the open report's outline as a template the student can start their
// next report from. Only the headings travel — what was written into them
// stays with this report.
export const saveSetAsTemplate = (uniqueId, name) => async (dispatch) => {
  try {
    dispatch(actions.setLoading({ key: 'isSavingTemplate', value: true }))

    const response = await postWithToken(`${base}/templates`, { setId: uniqueId, name })
    await dispatch(fetchSkripsiTemplates())

    return response.data.data
  } finally {
    dispatch(actions.setLoading({ key: 'isSavingTemplate', value: false }))
  }
}

export const deleteOwnTemplate = (templateId) => async (dispatch) => {
  await deleteWithToken(`${base}/templates/${templateId}`)
  await dispatch(fetchSkripsiTemplates())
}

// ============= Group members =============

export const fetchSetMembers = (uniqueId) => async (dispatch) => {
  try {
    dispatch(actions.setLoading({ key: 'isFetchingMembers', value: true }))

    const response = await getWithToken(`${base}/sets/${uniqueId}/members`)
    dispatch(actions.setMembers(response.data.data || []))

    return response.data.data
  } finally {
    dispatch(actions.setLoading({ key: 'isFetchingMembers', value: false }))
  }
}

// The group is edited as one list, so it is written back as one list.
export const saveSetMembers = (uniqueId, members) => async (dispatch) => {
  try {
    dispatch(actions.setLoading({ key: 'isSavingMembers', value: true }))

    const response = await putWithToken(`${base}/sets/${uniqueId}/members`, { members })
    dispatch(actions.setMembers(response.data.data || []))

    return response.data.data
  } finally {
    dispatch(actions.setLoading({ key: 'isSavingMembers', value: false }))
  }
}

// ============= Searcher =============

// The Searcher panel. Perplexity answers with web pages rather than prose, so
// there is no stream to follow and nothing is stored — the results live in
// Redux until the next run.
export const runSkripsiSearch = (payload) => async (dispatch) => {
  try {
    dispatch(actions.setLoading({ key: 'isSearching', value: true }))

    const response = await postWithToken(`${searcherBase}/run`, payload)
    dispatch(actions.setSearchResult(response.data.data))

    return response.data.data
  } finally {
    dispatch(actions.setLoading({ key: 'isSearching', value: false }))
  }
}

export const clearSkripsiSearch = () => (dispatch) => dispatch(actions.clearSearchResult())

// ============= Citations =============

// Every source kept for this report, numbered against the style it last
// generated in, plus the styles the dropdown offers.
export const fetchSetCitations = (uniqueId) => async (dispatch) => {
  try {
    dispatch(actions.setLoading({ key: 'isFetchingCitations', value: true }))

    const response = await getWithToken(`${base}/sets/${uniqueId}/citations`)
    dispatch(actions.setCitations({
      citations: response.data.data || [],
      style: response.data.meta?.style,
      styles: response.data.meta?.styles,
    }))

    return response.data.data
  } finally {
    dispatch(actions.setLoading({ key: 'isFetchingCitations', value: false }))
  }
}

// "Simpan ke referensi" on a Searcher result. The whole list is re-read rather
// than the one row appended: saving changes the numbering of every entry under
// an author-date style, and the server is what decides that order.
export const saveSetCitation = (uniqueId, { title, url, date = null }) => async (dispatch) => {
  try {
    dispatch(actions.setLoading({ key: 'isSavingCitation', value: true }))

    const response = await postWithToken(`${base}/sets/${uniqueId}/citations`, { title, url, date })
    await dispatch(fetchSetCitations(uniqueId))

    return response.data.data
  } finally {
    dispatch(actions.setLoading({ key: 'isSavingCitation', value: false }))
  }
}

// The edit form: a guideline's institutional author and year are things no
// registry knows, so they are typed in and re-read the same way.
export const updateSetCitation = (uniqueId, citationId, updates) => async (dispatch) => {
  try {
    dispatch(actions.setLoading({ key: 'isUpdatingCitation', value: true }))

    const response = await putWithToken(`${base}/citations/${citationId}`, updates)
    await dispatch(fetchSetCitations(uniqueId))

    return response.data.data
  } finally {
    dispatch(actions.setLoading({ key: 'isUpdatingCitation', value: false }))
  }
}

export const deleteSetCitation = (uniqueId, citationId) => async (dispatch) => {
  try {
    dispatch(actions.setLoading({ key: 'isDeletingCitation', value: true }))

    await deleteWithToken(`${base}/citations/${citationId}`)
    await dispatch(fetchSetCitations(uniqueId))
  } finally {
    dispatch(actions.setLoading({ key: 'isDeletingCitation', value: false }))
  }
}

// Writes the daftar pustaka into the report's reference section. The updated
// section comes back with the response, so the editor swaps that one card's
// content instead of re-reading the whole document.
export const generateBibliography = (uniqueId, { style = null, append = false } = {}) => async (dispatch) => {
  try {
    dispatch(actions.setLoading({ key: 'isGeneratingBibliography', value: true }))

    const response = await postWithToken(`${base}/sets/${uniqueId}/citations/generate`, { style, append })
    const { section, style: used } = response.data.data

    dispatch(actions.replaceSectionContent(section))
    dispatch(actions.setCitationStyle(used))
    await dispatch(fetchSetCitations(uniqueId))

    return response.data.data
  } finally {
    dispatch(actions.setLoading({ key: 'isGeneratingBibliography', value: false }))
  }
}

// ============= Sections =============

export const fetchSetSections = (uniqueId) => async (dispatch) => {
  try {
    dispatch(actions.setLoading({ key: 'isFetchingSections', value: true }))

    const response = await getWithToken(`${base}/sets/${uniqueId}/sections`)
    dispatch(actions.setSections(response.data.data || []))

    return response.data.data
  } finally {
    dispatch(actions.setLoading({ key: 'isFetchingSections', value: false }))
  }
}

// `afterPosition` is what the "+" between two cards sends, so a section can be
// slotted in the middle; omitting it appends.
//
// The card appears immediately, under a placeholder id, and the request runs
// behind it — adding a heading is a thought, not a transaction, and waiting a
// round trip for one is what made the button feel broken. The placeholder is
// swapped for the real row when the server answers, and taken back out if it
// refuses.
export const createSetSection = (uniqueId, { title, afterPosition = null } = {}) => async (dispatch, getState) => {
  const { sections } = getState().skripsiV2

  // The daftar pustaka closes the report, so nothing is inserted below it —
  // the same clamp the server applies to whatever it is sent.
  const referenceIndex = sections.findIndex(section => section.isReferenceSlot)
  const lastAllowed = referenceIndex === -1 ? sections.length : referenceIndex
  const requested = afterPosition === null || afterPosition === undefined ? lastAllowed : afterPosition
  const index = Math.min(Math.max(requested, 0), lastAllowed)

  const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
  const placeholder = {
    id: tempId, title, content: '', position: index, isReferenceSlot: false,
  }

  const optimistic = [
    ...sections.slice(0, index),
    placeholder,
    ...sections.slice(index),
  ].map((section, position) => ({ ...section, position }))

  dispatch(actions.setSections(optimistic))

  try {
    dispatch(actions.setLoading({ key: 'isCreatingSection', value: true }))

    const response = await postWithToken(`${base}/sets/${uniqueId}/sections`, { title, afterPosition: index })

    // A report that had no Referensi section was given one by the same call,
    // so the list on screen is a section short: that one case re-reads.
    if (referenceIndex === -1) await dispatch(fetchSetSections(uniqueId))
    else dispatch(actions.replaceSection({ tempId, section: response.data.data }))

    return response.data.data
  } catch (error) {
    dispatch(actions.removeSection(tempId))
    dispatch(commonActions.setError('Gagal menambah bagian'))
    throw error
  } finally {
    dispatch(actions.setLoading({ key: 'isCreatingSection', value: false }))
  }
}

// The editor autosaves each section on its own, so this is the hottest write in
// the feature. The local copy is updated first: the editor must never wait on
// the network to show its own keystrokes.
//
// A failed rename is rolled back, because the old heading is still the true
// one. A failed content save is NOT: what is on screen is the student's own
// typing, and throwing it away to agree with the server would lose work the
// next autosave is about to retry anyway.
export const updateSetSection = (sectionId, updates) => async (dispatch, getState) => {
  const previousTitle = getState().skripsiV2.sections
    .find(section => section.id === sectionId)?.title

  dispatch(actions.updateSection({ id: sectionId, ...updates }))

  try {
    dispatch(actions.setSectionSaving({ sectionId, value: true }))

    const response = await putWithToken(`${base}/sections/${sectionId}`, updates)
    dispatch(actions.updateSection(response.data.data))

    return response.data.data
  } catch (error) {
    if (updates.title !== undefined && previousTitle !== undefined) {
      dispatch(actions.updateSection({ id: sectionId, title: previousTitle }))
      dispatch(commonActions.setError('Gagal mengganti nama bagian'))
    }

    throw error
  } finally {
    dispatch(actions.setSectionSaving({ sectionId, value: false }))
  }
}

// The card goes as soon as the deletion is confirmed; the request follows it.
// A refusal — the Referensi section cannot be deleted — puts the whole list
// back as it was, which is cheaper and more honest than re-inserting one row
// into a list whose positions have already shifted.
export const deleteSetSection = (sectionId) => async (dispatch, getState) => {
  const previous = getState().skripsiV2.sections

  dispatch(actions.removeSection(sectionId))

  try {
    dispatch(actions.setLoading({ key: 'isDeletingSection', value: true }))

    await deleteWithToken(`${base}/sections/${sectionId}`)
  } catch (error) {
    dispatch(actions.setSections(previous))
    dispatch(commonActions.setError('Gagal menghapus bagian'))
    throw error
  } finally {
    dispatch(actions.setLoading({ key: 'isDeletingSection', value: false }))
  }
}

// The full order is sent rather than a single move, so the stored order cannot
// drift from what is on screen when two moves land close together.
//
// The move is shown first and sent after: dragging an outline entry that only
// lands once the server agrees feels like the drag failed. The server's own
// answer still wins when it arrives — it pins the Referensi section last, so a
// move the client allowed but the server corrects settles here.
export const reorderSetSections = (uniqueId, sectionIds) => async (dispatch, getState) => {
  const previous = getState().skripsiV2.sections

  const byId = new Map(previous.map(section => [section.id, section]))
  const optimistic = sectionIds
    .map(id => byId.get(id))
    .filter(Boolean)
    .map((section, position) => ({ ...section, position }))

  if (optimistic.length === previous.length) dispatch(actions.setSections(optimistic))

  try {
    dispatch(actions.setLoading({ key: 'isReorderingSections', value: true }))

    const response = await putWithToken(`${base}/sets/${uniqueId}/sections/reorder`, { sectionIds })
    dispatch(actions.setSections(response.data.data || []))

    return response.data.data
  } catch (error) {
    dispatch(actions.setSections(previous))
    dispatch(commonActions.setError('Gagal mengubah urutan bagian'))
    throw error
  } finally {
    dispatch(actions.setLoading({ key: 'isReorderingSections', value: false }))
  }
}

// The section assistant. `mode` is 'rewrite' for a selection the student
// highlighted, 'draft' for a section they want written from nothing; `context`
// is what they ticked to send along with it.
//
// The result is returned to the caller rather than stored: nothing is written
// until the student accepts it, and then it is written as an ordinary content
// edit and picked up by the section's own autosave.
export const requestSectionAssist = (sectionId, { mode, selectedText = '', instruction = '', context }) => async (dispatch) => {
  try {
    dispatch(actions.setLoading({ key: 'isAssistingSection', value: true }))

    const response = await postWithToken(`${base}/sections/${sectionId}/assist`, {
      mode,
      selectedText,
      instruction,
      context,
    })

    return response.data.data
  } finally {
    dispatch(actions.setLoading({ key: 'isAssistingSection', value: false }))
  }
}

// ============= Research settings (per set) =============

export const fetchSetResearchSettings = (uniqueId) => async () => {
  const response = await getWithToken(`${searcherBase}/sets/${uniqueId}/settings`)
  return response.data.data
}

export const updateSetResearchSettings = (uniqueId, settings) => async (dispatch) => {
  try {
    dispatch(actions.setLoading({ key: 'isUpdatingResearchSettings', value: true }))

    const response = await putWithToken(`${searcherBase}/sets/${uniqueId}/settings`, settings)
    return response.data.data
  } finally {
    dispatch(actions.setLoading({ key: 'isUpdatingResearchSettings', value: false }))
  }
}

// The pickers feed a modal rather than the page, so they return their result
// instead of storing it.
export const fetchSkripsiDomains = ({ page = 1, perPage = 12, search = '' } = {}) => async () => {
  const response = await getWithToken(`${searcherBase}/domains`, { page, perPage, ...(search ? { search } : {}) })
  return response.data.data
}

export const fetchSkripsiJournals = ({ page = 1, perPage = 20, search = '' } = {}) => async () => {
  const response = await getWithToken(`${searcherBase}/journals`, { page, perPage, ...(search ? { search } : {}) })
  return response.data.data
}

// Live lookup against the journal index itself, so a saved journal always
// resolves at search time.
export const searchSkripsiJournals = ({ query = '', page = 1, perPage = 10 } = {}) => async () => {
  const response = await getWithToken(`${searcherBase}/journals/search`, { q: query.trim(), page, perPage })
  return response.data
}

// ============= Tabs & messages =============

// Messages page backwards from a cursor, not a page number: new messages
// arrive while a tab is open, so an offset would skip or repeat rows.
export const fetchTabMessages = (tabId, { before = null, prepend = false } = {}) => async (dispatch) => {
  try {
    dispatch(actions.setLoading({ key: 'isFetchingMessages', value: true }))

    const response = await getWithToken(`${chatBase}/tabs/${tabId}/messages`, {
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
    `${chatBase}/tabs/${tabId}/messages/${messageId}/finalize`,
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
      // Whatever the context bar has ticked for this tab. The server ignores
      // it for anything but a normal-mode chat message.
      context: selectChatContext({ skripsiV2: state }, tabId),
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

// The builder generates a picture from a description. Gemini draws it, the
// server stores it as a blob, and what comes back is a diagram row with a URL.
export const generateDiagramImage = (tabId, description) => async (dispatch) => {
  try {
    dispatch(actions.setLoading({ key: 'isGeneratingDiagram', value: true }))

    const response = await postWithToken(`${diagramBase}/tabs/${tabId}/images`, { description })
    dispatch(actions.addDiagram({ tabId, diagram: response.data.data }))

    return response.data.data
  } finally {
    dispatch(actions.setLoading({ key: 'isGeneratingDiagram', value: false }))
  }
}

// Everything generated for this tab so far, newest first.
export const fetchDiagramImages = (tabId) => async (dispatch) => {
  try {
    dispatch(actions.setLoading({ key: 'isFetchingDiagrams', value: true }))

    const response = await getWithToken(`${diagramBase}/tabs/${tabId}/images`)
    dispatch(actions.setDiagrams({ tabId, diagrams: response.data.data || [] }))

    return response.data.data
  } finally {
    dispatch(actions.setLoading({ key: 'isFetchingDiagrams', value: false }))
  }
}
