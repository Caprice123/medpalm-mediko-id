import { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector, useStore, shallowEqual } from 'react-redux'
import { actions } from '@store/chatbot/v2/reducer'
import {
  fetchConversation,
  openConversationMessages,
  loadOlderMessages,
  sendMessage,
  stopStreaming,
  switchMode,
} from '@store/chatbot/v2'

const DEFAULT_MESSAGE_PAGINATION = { page: 1, perPage: 10, isLastPage: false }

// Scroll and streaming state for one open thread.
//
// The thread reads bottom-up: the newest message sits at the bottom, and paging
// back loads older messages above. That makes two scroll behaviours necessary —
// jump to the bottom when the thread opens or a message is sent, and hold the
// reading position when older messages are inserted above the viewport.
export const useConversation = (conversationId) => {
  const dispatch = useDispatch()
  const store = useStore()

  const currentConversation = useSelector(state => state.chatbotV2.currentConversation, shallowEqual)
  const currentMode = useSelector(state => state.chatbotV2.currentMode)
  const availableModes = useSelector(state => state.chatbotV2.availableModes, shallowEqual)
  const messages = useSelector(state => state.chatbotV2.messagesByConversation[conversationId] || [])
  const messagePagination = useSelector(
    state => state.chatbotV2.messagePaginationByConversation[conversationId] || DEFAULT_MESSAGE_PAGINATION,
    shallowEqual
  )
  const streaming = useSelector(
    state => state.chatbotV2.streamingStateByConversation[conversationId] || null,
    shallowEqual
  )
  const isMessagesLoading = useSelector(state => state.chatbotV2.loading.isMessagesLoading)
  const isConversationLoading = useSelector(state => state.chatbotV2.loading.isCurrentConversationLoading)
  const isSending = useSelector(state => state.chatbotV2.loading.isSendingMessage)

  const chatAreaRef = useRef(null)
  const scrollHeightBeforePaging = useRef(0)
  // InfiniteScroll fires `next` as soon as the container sits at the top, which
  // it does for a moment before the opening jump-to-bottom runs. Without this
  // guard, opening a thread immediately pages in older messages.
  const isOpeningRef = useRef(true)
  const [isAwaitingFirstPage, setIsAwaitingFirstPage] = useState(false)
  const [scrollRequest, setScrollRequest] = useState(null)

  const isStreaming = Boolean(streaming?.isSending || streaming?.isTyping)

  // Opening a thread. Messages already in the cache are reused — a student
  // flicking between threads should not pay for a refetch each time.
  useEffect(() => {
    if (!conversationId) return

    scrollHeightBeforePaging.current = 0
    isOpeningRef.current = true

    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = 0
    }

    // Read imperatively rather than through useSelector: this is a one-off
    // check at open time, and subscribing to the cache would re-run the whole
    // opening sequence every time a streamed character lands.
    const { messagesByConversation, conversations } = store.getState().chatbotV2
    const cached = messagesByConversation[conversationId]
    const conversation = conversations.find(c => c.uniqueId === conversationId)

    if (cached?.length) {
      if (conversation) {
        dispatch(actions.setCurrentConversation(conversation))
      }
      dispatch(actions.setActiveConversationId(conversationId))
      setScrollRequest({ behavior: 'auto', at: Date.now() })
    } else {
      dispatch(fetchConversation(conversationId))
      setIsAwaitingFirstPage(true)
      dispatch(openConversationMessages(conversationId))
    }

    const releaseTimer = setTimeout(() => {
      isOpeningRef.current = false
    }, 1000)

    return () => clearTimeout(releaseTimer)
  }, [conversationId, dispatch, store])

  // The opening jump has to wait for the first page to actually render.
  useEffect(() => {
    if (!isAwaitingFirstPage || isMessagesLoading) return
    if (messagePagination.page !== 1 || messages.length === 0) return

    setScrollRequest({ behavior: 'auto', at: Date.now() })
    setIsAwaitingFirstPage(false)
  }, [isAwaitingFirstPage, isMessagesLoading, messagePagination.page, messages.length])

  useEffect(() => {
    if (!scrollRequest || !chatAreaRef.current) return

    chatAreaRef.current.scrollTo({
      top: chatAreaRef.current.scrollHeight,
      behavior: scrollRequest.behavior,
    })
  }, [scrollRequest])

  // Older messages were just inserted above: shift the scroll position down by
  // exactly their height so the message the student was reading does not move.
  useEffect(() => {
    if (messagePagination.page <= 1 || !chatAreaRef.current) return
    if (scrollHeightBeforePaging.current === 0) return

    const grown = chatAreaRef.current.scrollHeight - scrollHeightBeforePaging.current
    if (grown > 0) {
      chatAreaRef.current.scrollTop = grown
      scrollHeightBeforePaging.current = 0
    }
  }, [messages, messagePagination.page])

  const handleLoadOlder = useCallback(() => {
    if (isOpeningRef.current || isMessagesLoading || messagePagination.isLastPage) return

    if (chatAreaRef.current) {
      scrollHeightBeforePaging.current = chatAreaRef.current.scrollHeight
    }

    return dispatch(loadOlderMessages(conversationId))
  }, [conversationId, dispatch, isMessagesLoading, messagePagination.isLastPage])

  const handleSend = useCallback((content) => {
    if (!content || isSending) return

    setScrollRequest({ behavior: 'smooth', at: Date.now() })
    return dispatch(sendMessage(conversationId, content, currentMode))
  }, [conversationId, currentMode, dispatch, isSending])

  const handleStop = useCallback(() => {
    if (!isStreaming) return

    return dispatch(stopStreaming(conversationId))
  }, [conversationId, dispatch, isStreaming])

  const handleModeChange = useCallback((mode) => {
    dispatch(switchMode(mode))
  }, [dispatch])

  // An admin can switch a mode off while someone has it selected; fall back to
  // one that is actually available rather than sending into a disabled mode.
  useEffect(() => {
    if (!currentMode || !availableModes || availableModes[currentMode]) return

    const fallback = Object.keys(availableModes).find(mode => availableModes[mode])
    if (fallback) dispatch(switchMode(fallback))
  }, [availableModes, currentMode, dispatch])

  return {
    currentConversation,
    currentMode,
    messages,
    messagePagination,
    isStreaming,
    isMessagesLoading,
    isConversationLoading,
    chatAreaRef,
    handleLoadOlder,
    handleSend,
    handleStop,
    handleModeChange,
  }
}
