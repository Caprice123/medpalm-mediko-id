import { useEffect, useState, useRef, useCallback, useMemo, memo } from 'react'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { fetchConversation, fetchMessages, sendMessage, switchMode, renameConversation, stopChatbotStreaming } from '@store/chatbot/action'
import { actions, selectMessagesForCurrentConversation } from '@store/chatbot/reducer'
import { ChatbotMessagesSkeleton, ChatbotLoadingIndicator } from '@components/common/SkeletonCard'
import MessageList from './components/MessageList'
import MessageInput from './components/MessageInput'
import ModeSelector from './components/ModeSelector'
import {
  Container,
  Header,
  HeaderContent,
  TopicTitle,
  TopicInput,
  ChatArea,
  LoadingState,
  ErrorState
} from './Conversation.styles'
import Button from '@components/common/Button'

// Memoized Header Component - only re-renders when title or editing state changes
const ConversationHeader = memo(({
  currentConversation,
  isEditingTitle,
  editedTitle,
  onBack,
  onTitleClick,
  onTitleChange,
  onTitleBlur,
  onTitleKeyDown,
  titleInputRef
}) => {
  // Debug: See when header re-renders
  console.log('🔄 ConversationHeader rendered')

  return (
    <Header>
      <HeaderContent>
        {onBack && (
          <Button variant="secondary" onClick={onBack}>
            ← Kembali
          </Button>
        )}
        {isEditingTitle ? (
          <TopicInput
            ref={titleInputRef}
            value={editedTitle}
            onChange={onTitleChange}
            onBlur={onTitleBlur}
            onKeyDown={onTitleKeyDown}
          />
        ) : (
          <TopicTitle onClick={onTitleClick}>
            {currentConversation?.topic || 'Untitled'}
          </TopicTitle>
        )}
      </HeaderContent>
    </Header>
  )
}, (prevProps, nextProps) => {
  // Custom comparison: only re-render if these specific props change
  return (
    prevProps.isEditingTitle === nextProps.isEditingTitle &&
    prevProps.editedTitle === nextProps.editedTitle &&
    prevProps.currentConversation?.topic === nextProps.currentConversation?.topic &&
    prevProps.onBack === nextProps.onBack &&
    prevProps.onTitleClick === nextProps.onTitleClick &&
    prevProps.onTitleChange === nextProps.onTitleChange &&
    prevProps.onTitleBlur === nextProps.onTitleBlur &&
    prevProps.onTitleKeyDown === nextProps.onTitleKeyDown
  )
})

function ChatbotConversationPanel({ conversationId, onBack }) {
  const dispatch = useDispatch()

  // Optimize selectors - only select what's needed to prevent unnecessary re-renders
  const conversations = useSelector(state => state.chatbot.conversations, shallowEqual)
  const currentConversation = useSelector(
    state => state.chatbot.currentConversation,
    (prev, next) => {
      // Custom equality: only re-render if uniqueId or topic changes
      if (!prev && !next) return true
      if (!prev || !next) return false
      return prev.uniqueId === next.uniqueId && prev.topic === next.topic
    }
  )
  const currentMode = useSelector(state => state.chatbot.currentMode)
  const availableModes = useSelector(state => state.chatbot.availableModes, shallowEqual)
  const loading = useSelector(state => state.chatbot.loading, shallowEqual)
  const pagination = useSelector(state => state.chatbot.pagination, shallowEqual)
  const messagesByConversation = useSelector(state => state.chatbot.messagesByConversation, shallowEqual)

  // Get streaming state for this specific conversation only
  const conversationStreamingState = useSelector(
    state => state.chatbot.streamingStateByConversation[conversationId] || null,
    shallowEqual
  )

  // Get messages for the current conversation using selector
  const messages = useSelector(selectMessagesForCurrentConversation)

  const [currentPage, setCurrentPage] = useState(1)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editedTitle, setEditedTitle] = useState('')
  const [streamingMessage, setStreamingMessage] = useState(null)
  const [scrollTrigger, setScrollTrigger] = useState({ should: false, behavior: 'auto' })
  const [isInitialLoad, setIsInitialLoad] = useState(false)
  const chatAreaRef = useRef(null)
  const previousScrollHeight = useRef(0)
  const titleInputRef = useRef(null)
  console.log(conversationStreamingState)
  const isInitialScrollRef = useRef(false)

  // Use refs to avoid recreating callbacks
  const currentConversationRef = useRef(currentConversation)
  const editedTitleRef = useRef(editedTitle)

  // Keep refs updated
  useEffect(() => {
    currentConversationRef.current = currentConversation
  }, [currentConversation])

  useEffect(() => {
    editedTitleRef.current = editedTitle
  }, [editedTitle])

  useEffect(() => {
    if (conversationId) {
      // Reset pagination and scroll state
      setCurrentPage(1)
      previousScrollHeight.current = 0
      isInitialScrollRef.current = true

      // Reset ChatArea scroll position immediately to prevent stuck scroll
      if (chatAreaRef.current) {
        chatAreaRef.current.scrollTop = 0
      }

      // Reset loading state when switching conversations
      // This ensures input is not disabled in the new conversation
      dispatch(actions.setLoading({ key: 'isSendingMessage', value: false }))

      // Reset streaming message state
      setStreamingMessage(null)

      // Check if messages are already cached for this conversation
      const cachedMessages = messagesByConversation[conversationId]

      if (!cachedMessages || cachedMessages.length === 0) {
        // First visit to this conversation - fetch both conversation detail and messages
        console.log(`📥 Fetching conversation detail and messages for ${conversationId}`)
        dispatch(fetchConversation(conversationId))
        setIsInitialLoad(true) // Mark as initial load to trigger scroll after fetch
        dispatch(fetchMessages({ conversationId, page: 1, perPage: 50, prepend: false }))
      } else {
        // Messages already cached - we've visited this conversation before
        // No need to fetch anything, just use cached data
        console.log(`✅ Using cached data for conversation ${conversationId} (${cachedMessages.length} messages)`)

        // Find the conversation in the list and set it as current (to update the title)
        const conversation = conversations.find(c => c.uniqueId === conversationId)
        if (conversation) {
          dispatch(actions.setCurrentConversation(conversation))
        }

        // Set active conversation ID so selector returns the cached messages
        dispatch(actions.setActiveConversationId(conversationId))

        // Scroll to bottom after a brief delay to ensure messages are rendered
        setTimeout(() => {
          setScrollTrigger({ should: true, behavior: 'auto' })
        }, 0)
      }
    }

    // Cleanup function when unmounting or switching conversations
    return () => {
      // Reset loading state to prevent disabled input on next conversation
      dispatch(actions.setLoading({ key: 'isSendingMessage', value: false }))
    }
  }, [conversationId, dispatch])

  useEffect(() => {
    // Allow scroll handling after initial load completes
    if (currentPage === 1) {
      setTimeout(() => {
        isInitialScrollRef.current = false
      }, 1000)
    }
  }, [currentPage])

  useEffect(() => {
    // Restore scroll position after loading older messages (page 2+)
    if (currentPage > 1 && chatAreaRef.current && previousScrollHeight.current > 0) {
      const newScrollHeight = chatAreaRef.current.scrollHeight
      const scrollDiff = newScrollHeight - previousScrollHeight.current
      chatAreaRef.current.scrollTop = scrollDiff
    }
  }, [currentPage])

  const loadMoreMessages = useCallback(async () => {
    if (chatAreaRef.current) {
      previousScrollHeight.current = chatAreaRef.current.scrollHeight
    }

    const nextPage = currentPage + 1
    setCurrentPage(nextPage)

    await dispatch(fetchMessages({
      conversationId,
      page: nextPage,
      perPage: 50,
      prepend: true // Signal to prepend instead of replace
    }))
  }, [currentPage, conversationId, dispatch])

  const handleScroll = useCallback((e) => {
    const { scrollTop } = e.target

    // Don't load more during initial scroll or if already loading
    if (isInitialScrollRef.current || loading.isMessagesLoading || pagination.isLastPage) {
      return
    }

    // Load more when scrolled near top
    if (scrollTop < 100) {
      loadMoreMessages()
    }
  }, [loading.isMessagesLoading, pagination.isLastPage, loadMoreMessages])

  // Scroll to bottom after initial message fetch completes (first page only)
  useEffect(() => {
    if (isInitialLoad && !loading.isMessagesLoading && currentPage === 1 && messages.length > 0) {
      console.log('📜 Initial messages loaded, scrolling to bottom')
      // Scroll to bottom instantly after first fetch
      setScrollTrigger({ should: true, behavior: 'auto' })
      setIsInitialLoad(false) // Reset flag
    }
  }, [isInitialLoad, loading.isMessagesLoading, currentPage, messages.length])

  // Track streaming message - check state.messages instead of currentConversation.messages
  useEffect(() => {
    if (messages && messages.length > 0) {
      const streaming = messages.find(m => m.id && m.id.toString().startsWith('streaming-'))
      // Only update if the streaming message actually changed
      setStreamingMessage(prev => {
        if (!streaming && !prev) return null
        if (streaming && prev && streaming.id === prev.id && streaming.content === prev.content) {
          return prev
        }
        return streaming || null
      })
    } else {
      setStreamingMessage(prev => prev ? null : prev)
    }
  }, [messages])
//   console.log(messages)

  const handleSendMessage = useCallback(async (content) => {
    if (!content || loading.isSendingMessage) return

    try {
      // Trigger scroll to bottom when sending a new message (smooth)
      setScrollTrigger({ should: true, behavior: 'smooth' })

      await dispatch(sendMessage(conversationId, content, currentMode))
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }, [loading.isSendingMessage, conversationId, currentMode, dispatch])

  const handleStopStreaming = useCallback(async () => {
    if (!streamingMessage) return

    try {
      console.log('⏹️ Stopping stream')

      // Stop receiving new chunks from backend, but finish typing what we already received
      await dispatch(stopChatbotStreaming(conversationId))

      // Typing animation will continue until all received content is displayed
      // Backend saves partial message to database in background
      // On page refresh, user will see the saved message from database
    } catch (error) {
      console.error('Failed to stop streaming:', error)
    }
  }, [streamingMessage, dispatch])

  const handleModeChange = useCallback((mode) => {
    dispatch(switchMode(mode))
  }, [dispatch])

  // Ensure current mode is valid (in case a mode becomes inactive)
  useEffect(() => {
    if (currentMode && availableModes && !availableModes[currentMode]) {
      // Current mode is not available, switch to first available mode
      const firstAvailableMode = Object.keys(availableModes).find(mode => availableModes[mode])
      if (firstAvailableMode) {
        dispatch(switchMode(firstAvailableMode))
      }
    }
  }, [availableModes, currentMode, dispatch])

  // Stable callbacks using refs to prevent recreating on every render
  const handleTitleClick = useCallback(() => {
    if (currentConversationRef.current) {
      setEditedTitle(currentConversationRef.current.topic)
      setIsEditingTitle(true)
      setTimeout(() => titleInputRef.current?.select(), 0)
    }
  }, []) // No dependencies - uses ref

  const handleTitleChange = useCallback((e) => {
    setEditedTitle(e.target.value)
  }, [])

  const handleTitleBlur = useCallback(async () => {
    const currentTitle = editedTitleRef.current
    const originalTopic = currentConversationRef.current?.topic

    if (currentTitle.trim() && currentTitle !== originalTopic) {
      try {
        await dispatch(renameConversation(conversationId, currentTitle.trim()))
      } catch (error) {
        console.error('Failed to rename conversation:', error)
      }
    }
    setIsEditingTitle(false)
  }, [conversationId, dispatch]) // Removed editedTitle and currentConversation - uses refs

  const handleTitleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      titleInputRef.current?.blur()
    } else if (e.key === 'Escape') {
      setIsEditingTitle(false)
    }
  }, [])

  if (loading.isCurrentConversationLoading && !currentConversation) {
    return (
      <Container>
        <ChatbotMessagesSkeleton messageCount={6} />
      </Container>
    )
  }

  if (!currentConversation) {
    return (
      <Container>
        <ErrorState>
          <div>❌</div>
          <div>Percakapan tidak ditemukan</div>
        </ErrorState>
      </Container>
    )
  }

  return (
    <Container>
      <ConversationHeader
        currentConversation={currentConversation}
        isEditingTitle={isEditingTitle}
        editedTitle={editedTitle}
        onBack={onBack}
        onTitleClick={handleTitleClick}
        onTitleChange={handleTitleChange}
        onTitleBlur={handleTitleBlur}
        onTitleKeyDown={handleTitleKeyDown}
        titleInputRef={titleInputRef}
      />

      <ModeSelector
        currentMode={currentMode}
        onModeChange={handleModeChange}
      />

      <ChatArea ref={chatAreaRef} onScroll={handleScroll}>
        {!pagination.isLastPage && loading.isMessagesLoading && currentPage > 1 && (
          <ChatbotLoadingIndicator variant="spinner" />
        )}
        <MessageList
          key={conversationId}
          isLoading={loading.isMessagesLoading && currentPage === 1}
          isStreaming={!!(conversationStreamingState?.isSending || conversationStreamingState?.isTyping)}
          scrollTrigger={scrollTrigger}
        />
      </ChatArea>

      <MessageInput
        key={conversationId}
        onSend={handleSendMessage}
        onStop={handleStopStreaming}
        disabled={!!(conversationStreamingState?.isTyping || conversationStreamingState?.isSending)}
        currentMode={currentMode}
        isStreaming={!!(conversationStreamingState?.isSending || conversationStreamingState?.isTyping)}
      />
    </Container>
  )
}

export default ChatbotConversationPanel
