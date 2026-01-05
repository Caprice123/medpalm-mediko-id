import { useEffect, useState, useRef, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchConversation, fetchMessages, sendMessage, switchMode, renameConversation } from '@store/chatbot/action'
import { actions } from '@store/chatbot/reducer'
import MessageList from './components/MessageList'
import MessageInput from './components/MessageInput'
import ModeSelector from './components/ModeSelector'
import {
  Container,
  Header,
  HeaderContent,
  BackButton,
  TopicTitle,
  TopicInput,
  ChatArea,
  LoadingState,
  ErrorState
} from './Conversation.styles'

function ChatbotConversationPanel({ conversationId, onBack }) {
  const dispatch = useDispatch()

  const {
    currentConversation,
    currentMode,
    availableModes,
    loading,
    pagination
  } = useSelector(state => state.chatbot)

  const [currentPage, setCurrentPage] = useState(1)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editedTitle, setEditedTitle] = useState('')
  const chatAreaRef = useRef(null)
  const previousScrollHeight = useRef(0)
  const titleInputRef = useRef(null)
  const isInitialScrollRef = useRef(false)

  useEffect(() => {
    if (conversationId) {
      // Reset messages when switching conversations
      dispatch(actions.resetMessages())
      setCurrentPage(1)
      previousScrollHeight.current = 0
      isInitialScrollRef.current = true

      // Fetch new conversation data
      dispatch(fetchConversation(conversationId))
      dispatch(fetchMessages({ conversationId, page: 1, perPage: 50, prepend: false }))
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

  const handleSendMessage = useCallback(async (content) => {
    if (!content || loading.isSendingMessage) return

    try {
      await dispatch(sendMessage(conversationId, content, currentMode))
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }, [loading.isSendingMessage, conversationId, currentMode, dispatch])

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

  const handleTitleClick = useCallback(() => {
    if (currentConversation) {
      setEditedTitle(currentConversation.topic)
      setIsEditingTitle(true)
      setTimeout(() => titleInputRef.current?.select(), 0)
    }
  }, [currentConversation])

  const handleTitleChange = useCallback((e) => {
    setEditedTitle(e.target.value)
  }, [])

  const handleTitleBlur = useCallback(async () => {
    if (editedTitle.trim() && editedTitle !== currentConversation.topic) {
      try {
        await dispatch(renameConversation(conversationId, editedTitle.trim()))
      } catch (error) {
        console.error('Failed to rename conversation:', error)
      }
    }
    setIsEditingTitle(false)
  }, [editedTitle, currentConversation, conversationId, dispatch])

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
        <LoadingState>
          <div>⏳</div>
          <div>Memuat percakapan...</div>
        </LoadingState>
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
      <Header>
        <HeaderContent>
          {onBack && (
            <BackButton onClick={onBack}>
              ← Kembali
            </BackButton>
          )}
          {isEditingTitle ? (
            <TopicInput
              ref={titleInputRef}
              value={editedTitle}
              onChange={handleTitleChange}
              onBlur={handleTitleBlur}
              onKeyDown={handleTitleKeyDown}
            />
          ) : (
            <TopicTitle onClick={handleTitleClick}>
              {currentConversation.topic}
            </TopicTitle>
          )}
        </HeaderContent>
      </Header>

      <ModeSelector
        currentMode={currentMode}
        onModeChange={handleModeChange}
      />

      <ChatArea ref={chatAreaRef} onScroll={handleScroll}>
        {!pagination.isLastPage && (
          <div style={{ textAlign: 'center', padding: '10px', color: '#6b7280', fontSize: '13px' }}>
            {loading.isMessagesLoading && currentPage > 1 ? '⏳ Memuat pesan lama...' : ''}
          </div>
        )}
        <MessageList
          isLoading={loading.isMessagesLoading && currentPage === 1}
          isSending={loading.isSendingMessage}
        />
      </ChatArea>

      <MessageInput
        onSend={handleSendMessage}
        disabled={loading.isSendingMessage}
        currentMode={currentMode}
      />
    </Container>
  )
}

export default ChatbotConversationPanel
