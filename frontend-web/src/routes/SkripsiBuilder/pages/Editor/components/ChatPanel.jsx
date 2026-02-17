import React, { useState, useRef, useEffect, memo, useCallback } from 'react'
import { formatLocalTime } from '@utils/dateUtils'
import { useAppDispatch } from '@store/store'
import { sendMessage, loadOlderMessages, stopStreaming, fetchModeConfiguration } from '@store/skripsi/action'
import { selectMessagesForTab, selectLoadingForTab, selectModeForTab } from '@store/skripsi/reducer'
import { actions as skripsiActions } from '@store/skripsi/reducer'
import { FaPaperPlane, FaStop } from 'react-icons/fa'
import { ChatbotLoadingIndicator, ChatbotMessagesSkeleton } from '@components/common/SkeletonCard'
import CustomMarkdownRenderer from '@components/common/CustomMarkdownRenderer/CustomMarkdownRenderer'
import ModeSelector from './ModeSelector'
import {
  ChatPanel as StyledChatPanel,
  ChatHeader,
  ChatTitle,
  ChatMessages,
  Message,
  UserMessage,
  AIMessage,
  MessageContent,
  MessageFooter,
  Timestamp,
  ModeBadge,
  ChatInputArea,
  ChatInputWrapper,
  ChatInput,
  SendButton,
  EmptyMessages,
  TypingIndicator,
  TypingDot,
  SourcesSection,
  SourceItem
} from '../Editor.styles'
import { useSelector } from 'react-redux'

// Memoized message component - only rerenders when its own content changes
const ChatMessage = memo(({ message, formatTime, processContentWithCitations }) => {
  // Check if this message is currently streaming (temp ID starting with 'streaming-')
  const isStreaming = message.id && message.id.toString().startsWith('streaming-')

  const getModeInfo = (mode) => {
    switch (mode) {
      case 'normal':
        return { icon: '🤖', label: 'Normal Mode' }
      case 'research':
        return { icon: '🔍', label: 'Research Mode' }
      case 'validated':
      case 'validated_search':
        return { icon: '📚', label: 'Validated' }
      default:
        return { icon: '🤖', label: 'Normal Mode' }
    }
  }

  if (!message.content) {
    return null
  }

  return (
    <Message $sender={message.senderType}>
      {message.senderType === 'user' ? (
        <UserMessage>
          <MessageContent>
            <CustomMarkdownRenderer item={message.content} isStreaming={false} />
          </MessageContent>
          <MessageFooter>
            <Timestamp>{formatTime(message.createdAt)}</Timestamp>
          </MessageFooter>
        </UserMessage>
      ) : (
        <AIMessage>
          <MessageContent>
            <CustomMarkdownRenderer
              item={isStreaming ? message.content : processContentWithCitations(message.content, message.sources)}
              isStreaming={isStreaming}
            />
          </MessageContent>

          {!isStreaming && message.sources && message.sources.length > 0 && (
            <SourcesSection>
              <div className="sources-title">📚 Sumber:</div>
              {message.sources.map((source, index) => (
                <React.Fragment key={index}>
                  <SourceItem href={source.url} target='_blank' rel='noopener noreferrer'>
                    [{index + 1}] {source.title || source.url}
                  </SourceItem>
                  <br />
                </React.Fragment>
              ))}
            </SourcesSection>
          )}

          {!isStreaming && (
            <MessageFooter>
              <ModeBadge mode={message.modeType}>
                <span>{getModeInfo(message.modeType).icon}</span>
                <span>{getModeInfo(message.modeType).label}</span>
              </ModeBadge>
              <Timestamp>{formatTime(message.createdAt)}</Timestamp>
            </MessageFooter>
          )}
        </AIMessage>
      )}
    </Message>
  )
}, (prevProps, nextProps) => {
  // Only rerender if content, id, modeType, or sources change
  const prevSources = prevProps.message.sources || []
  const nextSources = nextProps.message.sources || []

  const sourcesChanged = prevSources.length !== nextSources.length ||
    prevSources.some((src, i) => src?.url !== nextSources[i]?.url)

  return prevProps.message.content === nextProps.message.content &&
         prevProps.message.id === nextProps.message.id &&
         prevProps.message.modeType === nextProps.message.modeType &&
         !sourcesChanged
})

// Memoized input section - manages its own state, isolated from parent
const ChatInputSection = memo(({
  onSendMessage,
  onStopStreaming,
  disabled,
  isStreaming
}) => {
  const [chatInput, setChatInput] = useState('')

  const handleSendMessage = () => {
    if (!chatInput.trim()) return
    const message = chatInput.trim()
    setChatInput('')
    onSendMessage(message)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <ChatInputArea>
      <ChatInputWrapper>
        <ChatInput
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ketik pesan... (Enter untuk kirim, Shift+Enter untuk baris baru)"
          disabled={disabled}
        />
        {isStreaming ? (
          <SendButton
            onClick={onStopStreaming}
            style={{ background: '#ef4444' }}
            title="Stop streaming"
          >
            <FaStop />
          </SendButton>
        ) : (
          <SendButton
            onClick={handleSendMessage}
            disabled={!chatInput.trim() || disabled}
          >
            <FaPaperPlane />
          </SendButton>
        )}
      </ChatInputWrapper>
    </ChatInputArea>
  )
}, (prevProps, nextProps) => {
  // Only rerender if disabled state or streaming state changes
  return prevProps.disabled === nextProps.disabled &&
         prevProps.isStreaming === nextProps.isStreaming
})

const ChatPanel = memo(({ currentTab, style }) => {
  const dispatch = useAppDispatch()
  const chatMessagesRef = useRef(null)
  const [isLoadingOlder, setIsLoadingOlder] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const previousScrollHeight = useRef(0)
  const previousMessageCountRef = useRef(0)
  const previousTabIdRef = useRef(null)

  // Get messages for the current tab (use prop instead of Redux activeTabId to avoid timing issues)
  const messages = useSelector(state => selectMessagesForTab(state, currentTab?.id))
  // Get per-tab loading state (use prop instead of Redux activeTabId)
  const tabLoading = useSelector(state => selectLoadingForTab(state, currentTab?.id))
  const isInitialLoading = tabLoading.isMessagesLoading || false

  // Get streaming state from Redux (same pattern as chatbot)
  const streamingStateByTab = useSelector(state => state.skripsi.streamingStateByTab)
  const tabStreamingState = currentTab?.id ? (streamingStateByTab[currentTab.id] || null) : null

  // Mode selection (only for AI Chat tabs)
  const currentMode = useSelector(state => selectModeForTab(state, currentTab?.id))
  const isAIChatTab = currentTab?.tabType?.startsWith('ai_researcher')

  // Fetch mode configuration on mount
  useEffect(() => {
    dispatch(fetchModeConfiguration())
  }, [dispatch])

  // Check if currently streaming using Redux state
  const isStreaming = !!(tabStreamingState?.isSending || tabStreamingState?.isTyping)
  // Input disabled when typing or sending (same as chatbot)
  const isInputDisabled = !!(tabStreamingState?.isTyping || tabStreamingState?.isSending)

  // Debug streaming state changes
  useEffect(() => {
    // console.log(`🔄 Streaming state for tab ${currentTab?.id}:`, isStreaming, tabStreamingState)
  }, [isStreaming, currentTab?.id, tabStreamingState])

  // Only scroll to bottom when a NEW message is added or tab changes
  useEffect(() => {
    const currentMessageCount = messages.length
    const currentTabId = currentTab?.id

    // Scroll when:
    // 1. Tab changes (switching to a different tab)
    // 2. Message count increases (new message sent/received)
    if (currentTabId !== previousTabIdRef.current ||
        currentMessageCount > previousMessageCountRef.current) {
      if (chatMessagesRef.current) {
        chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight
      }
    }

    previousMessageCountRef.current = currentMessageCount
    previousTabIdRef.current = currentTabId
  }, [messages.length, currentTab?.id])

  // Reset hasMore when tab changes
  useEffect(() => {
    setHasMore(true)
  }, [currentTab?.id])

  // Handle scroll to detect when user scrolls to top
  const handleScroll = useCallback(async () => {
    if (!chatMessagesRef.current || !currentTab || !hasMore || isLoadingOlder) return

    const { scrollTop } = chatMessagesRef.current

    // If scrolled near the top (within 100px)
    if (scrollTop < 100) {
      if (messages.length === 0) return

      const oldestMessageId = messages[0]?.id
      if (!oldestMessageId) return

      try {
        setIsLoadingOlder(true)
        previousScrollHeight.current = chatMessagesRef.current.scrollHeight

        const result = await dispatch(loadOlderMessages(currentTab.id, oldestMessageId))

        setHasMore(result.hasMore)

        // Restore scroll position after loading
        if (chatMessagesRef.current) {
          const newScrollHeight = chatMessagesRef.current.scrollHeight
          const scrollDiff = newScrollHeight - previousScrollHeight.current
          chatMessagesRef.current.scrollTop = scrollTop + scrollDiff
        }
      } catch (error) {
        console.error('Failed to load older messages:', error)
      } finally {
        setIsLoadingOlder(false)
      }
    }
  }, [currentTab, messages, hasMore, isLoadingOlder, dispatch])

  const formatTime = (dateString) => formatLocalTime(dateString)

  // Process content to add inline citation links
  const processContentWithCitations = useCallback((content, sources) => {
    if (!sources || sources.length === 0) {
      return content
    }

    // Replace [1], [2], etc. with clickable links
    // Use [[1]] as link text so brackets are visible
    let processed = content
    sources.forEach((source, index) => {
      const citationNumber = index + 1
      const citationPattern = new RegExp(`\\[${citationNumber}\\]`, 'g')
      const citationLink = `[[${citationNumber}]](${source.url})`
      processed = processed.replace(citationPattern, citationLink)
    })

    return processed
  }, [])

  const handleModeChange = useCallback((newMode) => {
    if (!currentTab) return
    dispatch(skripsiActions.setModeForTab({ tabId: currentTab.id, mode: newMode }))
  }, [currentTab, dispatch])

  const handleSendMessage = useCallback(async (userMessageText) => {
    if (!currentTab) return
    if (!userMessageText) return

    try {
      // Wait for streaming to complete (everything handled in Redux)
      console.log('📨 Sending message...')
      // Don't pass currentMode - let sendMessage read it fresh from Redux state to avoid stale closure values
      await dispatch(sendMessage(currentTab.id, userMessageText))
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }, [currentTab, dispatch])

  const handleStopStreaming = useCallback(async () => {
    if (!currentTab) return

    try {
      console.log('⏹️ User clicked stop button')
      await dispatch(stopStreaming(currentTab.id))
    } catch (error) {
      console.error('Failed to stop streaming:', error)
    }
  }, [currentTab, dispatch])

  return (
    <StyledChatPanel style={style}>
      {/* Mode selector at top (only for AI Chat tabs) */}
      {isAIChatTab && (
        <ModeSelector
          currentMode={currentMode}
          onModeChange={handleModeChange}
        />
      )}

      <ChatMessages ref={chatMessagesRef} onScroll={handleScroll}>
        {isLoadingOlder && hasMore && (
          <ChatbotLoadingIndicator variant="spinner" />
        )}
        {isInitialLoading && messages.length === 0 ? (
          <ChatbotMessagesSkeleton messageCount={4} />
        ) : messages.length === 0 ? (
          <EmptyMessages>
            Belum ada percakapan. Mulai chat dengan AI untuk mendapatkan bantuan!
          </EmptyMessages>
        ) : (
          <>
            {messages.map((msg, idx) => (
              <ChatMessage
                key={msg.id || idx}
                message={msg}
                formatTime={formatTime}
                processContentWithCitations={processContentWithCitations}
              />
            ))}

            {isStreaming && (
              <Message $sender="ai">
                <AIMessage>
                  <TypingIndicator>
                    <TypingDot delay="0s" />
                    <TypingDot delay="0.2s" />
                    <TypingDot delay="0.4s" />
                  </TypingIndicator>
                </AIMessage>
              </Message>
            )}
          </>
        )}
      </ChatMessages>

      <ChatInputSection
        key={currentTab?.id} // Reset input when tab changes
        onSendMessage={handleSendMessage}
        onStopStreaming={handleStopStreaming}
        disabled={isInputDisabled}
        isStreaming={isStreaming}
      />
    </StyledChatPanel>
  )
})

ChatPanel.displayName = 'ChatPanel'
ChatInputSection.displayName = 'ChatInputSection'
ChatMessage.displayName = 'ChatMessage'

export default ChatPanel
