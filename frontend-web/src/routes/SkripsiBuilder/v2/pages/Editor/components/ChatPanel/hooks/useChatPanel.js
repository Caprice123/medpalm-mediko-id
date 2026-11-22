import { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { sendMessage, stopStreaming, loadOlderMessages } from '@store/skripsi/v2'
import { selectMessagesForTab, selectPagingForTab } from '@store/skripsi/v2/reducer'

// Distance from the top at which the next page of older messages is fetched.
const LOAD_TRIGGER_PX = 100

// One tab's conversation: its scroll behaviour and sending.
//
// There is no mode to choose any more — the Research tab asks for research
// answers and the AI Chat tab for normal ones, which the server reads off the
// tab itself.
//
// The thread reads bottom-up — newest at the bottom, paging back loads older
// messages above — so two scroll behaviours are needed: stay at the bottom when
// a message arrives or the tab opens, and hold the reading position when older
// messages are inserted above the viewport.
export const useChatPanel = (tab) => {
  const dispatch = useDispatch()
  const tabId = tab?.id ?? null

  const messages = useSelector(state => selectMessagesForTab(state, tabId), shallowEqual)
  const paging = useSelector(state => selectPagingForTab(state, tabId), shallowEqual)
  const streaming = useSelector(
    state => (tabId ? state.skripsiV2.streamingStateByTab[tabId] || null : null),
    shallowEqual
  )
  const isFetchingMessages = useSelector(state => state.skripsiV2.loading.isFetchingMessages)

  const scrollerRef = useRef(null)
  const scrollHeightBeforePaging = useRef(0)
  const lastMessageCount = useRef(0)
  const lastTabId = useRef(null)
  const [isLoadingOlder, setIsLoadingOlder] = useState(false)

  const isStreaming = Boolean(streaming?.isSending || streaming?.isTyping)

  // Only the first page of a tab gets the skeleton. V1 read this off a
  // per-tab `isMessagesLoading` flag that nothing ever set — fetching wrote a
  // global flag instead — so its skeleton never appeared at all.
  const isInitialLoading = isFetchingMessages && messages.length === 0

  // Stick to the bottom when the tab changes or a new message lands, but not
  // when older messages are prepended — that is what the paging effect handles.
  useEffect(() => {
    const grew = messages.length > lastMessageCount.current
    const switched = tabId !== lastTabId.current

    if ((switched || grew) && scrollerRef.current) {
      scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight
    }

    lastMessageCount.current = messages.length
    lastTabId.current = tabId
  }, [messages.length, tabId])

  const handleScroll = useCallback(async () => {
    const scroller = scrollerRef.current
    if (!scroller || !tabId) return
    if (isLoadingOlder || isFetchingMessages) return
    if (!paging.hasMore || scroller.scrollTop >= LOAD_TRIGGER_PX) return

    const before = scroller.scrollHeight
    scrollHeightBeforePaging.current = before
    setIsLoadingOlder(true)

    try {
      await dispatch(loadOlderMessages(tabId))

      // Shift the scroll position down by exactly the height that was added,
      // so the message being read does not move.
      if (scrollerRef.current) {
        const grown = scrollerRef.current.scrollHeight - before
        if (grown > 0) scrollerRef.current.scrollTop = grown
      }
    } finally {
      setIsLoadingOlder(false)
    }
  }, [tabId, paging.hasMore, isLoadingOlder, isFetchingMessages, dispatch])

  const handleSend = useCallback((content) => {
    if (!tabId || !content) return

    return dispatch(sendMessage(tabId, content))
  }, [tabId, dispatch])

  const handleStop = useCallback(() => {
    if (!tabId || !isStreaming) return

    return dispatch(stopStreaming(tabId))
  }, [tabId, isStreaming, dispatch])

  return {
    tabId,
    isStreaming,
    isInitialLoading,
    isLoadingOlder,
    scrollerRef,
    handleScroll,
    handleSend,
    handleStop,
  }
}
